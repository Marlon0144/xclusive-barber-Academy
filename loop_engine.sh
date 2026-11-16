#!/usr/bin/env bash
set -euo pipefail

# ==============================================================================
# Orquestador del Bucle Agéntico - Spec-Driven Development (Ejecutor-Centric)
# ==============================================================================

# Configuración de límites y logs
MAX_ITERATIONS=${MAX_ITERATIONS:-15}
MAX_INFRA_FAILURES=3   # Guardrail: Máximo de fallas consecutivas de infraestructura/Docker
LOG_DIR="logs"
mkdir -p "$LOG_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
EXEC_LOG="$LOG_DIR/loop_$TIMESTAMP.log"

# Duplicar salida a consola y a archivo de log persistente
exec > >(tee -a "$EXEC_LOG") 2>&1

# 1. Normalización y Validación del Argumento de Entrada
RAW_SPEC="${1:-srs001.md}"

if [[ "$RAW_SPEC" == docs/specs/* ]]; then
    SPEC_FILE="$RAW_SPEC"
else
    SPEC_FILE="docs/specs/$RAW_SPEC"
fi

if [ ! -f "$SPEC_FILE" ]; then
    echo "❌ Error Crítico: No se encontró el archivo de especificación en '$SPEC_FILE'."
    exit 1
fi

echo "🎯 Especificación Bloqueada: $SPEC_FILE"
echo "⚙️  Límite máximo de iteraciones: $MAX_ITERATIONS"
echo "🛡️  Límite de fallos consecutivos de infraestructura: $MAX_INFRA_FAILURES"
echo "📜 Registro de sesión guardado en: $EXEC_LOG"
echo "🚀 Iniciando Bucle Agéntico..."

# Guardrail: Sincronización del AST unificada (src/main y src/test)
sync_ast() {
    echo "🔄 [Safety Check] Actualizando AST completo con Graphify..."
    graphify update src/main --no-cluster || echo "⚠️ Advertencia: Falló la actualización de AST en src/main."
    graphify update src/test --no-cluster || echo "⚠️ Advertencia: Falló la actualización de AST en src/test."
}

# 2. Bucle Iterativo de Desarrollo y Verificación
ITERATION=1
CONSECUTIVE_INFRA_FAILURES=0

# === FIX: Definir FEEDBACK inicial FUERA del bucle ===
FEEDBACK="Lee la especificación '$SPEC_FILE'. Implementa/actualiza la lógica en 'src/main' y adapta/escribe las pruebas en 'src/test'. Corre la suite dentro de Docker al final de tu turno. Emite al final en una línea nueva: 'STATUS: TESTS_PASSED' o 'STATUS: TESTS_FAILED'."

while [ "$ITERATION" -le "$MAX_ITERATIONS" ]; do
    echo ""
    echo "---------------------------------------------------"
    echo "🔄 Iteración #$ITERATION / $MAX_ITERATIONS ($SPEC_FILE)"
    echo "---------------------------------------------------"
    
    # Fase A: Implementación y Pruebas con El Ejecutor
    echo "==> ⚙️ Fase A: El Ejecutor procesando código, pruebas y verificación en Docker..."
    
    EXEC_OUTPUT=$(opencode run --agent "EJECUTOR" -m "omniroute/executor" "$FEEDBACK") || true
    echo -e "\n📊 Resultado del Ejecutor:\n$EXEC_OUTPUT\n"
    sync_ast

    # Evaluación del estado emitido por El Ejecutor
    EXEC_STATUS=$(echo "$EXEC_OUTPUT" | grep -E "^STATUS:\s*(TESTS_PASSED|TESTS_FAILED)" | tail -n 1 | xargs || true)

    if [[ "$EXEC_STATUS" == "STATUS: TESTS_FAILED" ]]; then
        ((CONSECUTIVE_INFRA_FAILURES++))
        echo "⚠️ Las pruebas o la compilación fallaron en el entorno (Intento de falla $CONSECUTIVE_INFRA_FAILURES/$MAX_INFRA_FAILURES)."
        
        # Guardrail: Cortocircuito por fallas reiteradas de infraestructura/entorno
        if [ "$CONSECUTIVE_INFRA_FAILURES" -ge "$MAX_INFRA_FAILURES" ]; then
            echo "🚨 CIRCUIT BREAKER ACTIVADO: Se han superado $MAX_INFRA_FAILURES fallos consecutivos de entorno/compilación. Deteniendo bucle para proteger saldo."
            exit 1
        fi

        # === FIX: Actualizar FEEDBACK para notificar al Ejecutor de su propio fallo ===
        FEEDBACK="Tu último intento reportó 'STATUS: TESTS_FAILED' tras agotar los reintentos internos. Revisa tu lógica, el entorno, corrige el error y vuelve a intentar."
        
        ((ITERATION++))
        continue
    elif [[ "$EXEC_STATUS" != "STATUS: TESTS_PASSED" ]]; then
        echo "⚠️ Error: El Ejecutor no emitió un estado válido ('STATUS: TESTS_PASSED' o 'STATUS: TESTS_FAILED')."
        ((CONSECUTIVE_INFRA_FAILURES++))
        
        if [ "$CONSECUTIVE_INFRA_FAILURES" -ge "$MAX_INFRA_FAILURES" ]; then
            echo "🚨 CIRCUIT BREAKER ACTIVADO por respuestas inválidas o interrupciones de ejecución."
            exit 1
        fi

        # === FIX: Notificar error de formato ===
        FEEDBACK="Hubo un error crítico o no emitiste un estado válido. Recuerda emitir ÚNICAMENTE 'STATUS: TESTS_PASSED' o 'STATUS: TESTS_FAILED' al final de tu turno."
        
        ((ITERATION++))
        continue
    fi

    # Si llegó aquí, las pruebas pasaron: Reseteamos el contador de fallas de infraestructura
    CONSECUTIVE_INFRA_FAILURES=0

    # Fase B: Auditoría Estática Final con El Consultor
    echo "==> ⚖️ Fase B: Pruebas exitosas. Despertando a El Consultor para la auditoría estática..."
    CONSULTOR_OUTPUT=$(opencode run --agent "CONSULTOR" -m "omniroute/consultant" \
      "El Ejecutor ha reportado que todas las pruebas pasaron en Docker para '$SPEC_FILE'. Audita estáticamente el AST y el código modificado. Compara contra '$SPEC_FILE' y verifica la arquitectura. Emite OBLIGATORIAMENTE al final en una línea nueva: 'STATUS: APPROVED' o 'STATUS: REJECTED'.") || true
    
    echo -e "\n📋 Reporte del Consultor:\n$CONSULTOR_OUTPUT\n"
    
    # Evaluación de la bandera de estado del Consultor
    LAST_STATUS=$(echo "$CONSULTOR_OUTPUT" | grep -E "^STATUS:\s*(APPROVED|REJECTED)" | tail -n 1 | xargs || true)

    if [[ "$LAST_STATUS" == "STATUS: APPROVED" ]]; then
        echo "==================================================="
        echo "✅ ¡APROBADO en iteración #$ITERATION! La especificación $SPEC_FILE ha sido consolidada al 100%."
        echo "==================================================="
        exit 0
    elif [[ "$LAST_STATUS" == "STATUS: REJECTED" ]]; then
        echo "==================================================="
        echo "❌ RECHAZADO por la auditoría arquitectónica. Devolviendo observaciones a El Ejecutor..."
        echo "==================================================="
        
        if [ "$ITERATION" -eq "$MAX_ITERATIONS" ]; then
            echo "🚨 Se ha alcanzado el límite máximo de $MAX_ITERATIONS iteraciones. Abortando orquestación."
            exit 1
        fi
        
        # === FIX: Actualizar FEEDBACK con las notas del Consultor ===
        FEEDBACK="El Consultor ha rechazado el código para '$SPEC_FILE' por violaciones arquitectónicas. Revisa sus observaciones y ajusta el código y pruebas correspondientes:\n\n$CONSULTOR_OUTPUT"
        
        ((ITERATION++))
        continue # Asegura que pase a la siguiente iteración correctamente
    else
        echo "⚠️ Error Crítico: El Consultor no emitió una bandera válida ('STATUS: APPROVED' o 'STATUS: REJECTED')."
        exit 1
    fi
done