# Gu�a y Estado Actual del Front-end

Documento vivo del estado de front-end para mantener continuidad entre iteraciones y agentes.

## 1. Arquitectura oficial (vigente)

- **Framework:** Next.js 15 (App Router).
- **Lenguaje:** TypeScript (strict).
- **Estilos:** Tailwind CSS v4 + variables en `app/globals.css`.
- **Patr�n de datos:** Server Components para carga inicial + Supabase para auth/data.
- **UI base:** componentes propios en `components/ui`.

## 2. Estado Actualizado (18-Feb-2026) - Hito 1, 2 & 3 Completados (Landing + Auth)

### A. Landing Page Rediseñanda 1:1 Figma (Implementado - v3)

- **Fidelidad Visual:** Se ha implementado el diseño "Landing Desktop Op 2" (Node `164-150`) con fidelidad pixel-perfect, eliminando problemas de superposición.
- **Componentes Refactorizados:**
  - `HeroSection`: Tipografía "MERCADO AUSTRALIANO" masiva, assets de brazo tatuado y separadores dorados.
  - `TargetAudienceSection`: Tarjeta "XCLUSIVE BARBER ACADEMY ES PARA" oscura con lista de items e icono de tijeras.
  - `FeaturesSection`: Diseño centrado "FORMAMOS PROFESIONALES" con iconos personalizados (Mentalidad, Práctica, Negocio).
  - `MissionVisionSection`: Layout corregido con headers gráficos para Misión y Visión.
  - `InstructorSection`: Texto de fondo "JULIAN" gigante y tarjeta flotante sobre imagen del instructor.
  - `FinalCtaSection`: Bloque final con botón de textura dorada y fondo crema superpuesto.
- **Assets:** Centralizados en `public/assets/landing/` (11 nuevos assets extraídos de Figma).

### B. M�dulo de Autenticaci�n / Activaci�n (Implementado 100%)

Se han finalizado las vistas de `Login` y `Apply` con dise�o "Dark Premium" id�ntico a Figma.

#### 1. Vista `/apply` (Registro/Activaci�n)
- **Dise�o:** 1:1 con Figma (Node `134-273`).
- **Caracter�sticas:**
    - Tarjeta central flotante estilo "Xclusive Card".
    - Header interno con franja verde y t�tulo "ACTIVA TU ACCESO".
    - Inputs estilizados (`uppercase`, `tracking-wide`, `font-light`).
    - Mensajes de ayuda y footer integrados.
- **Assets:** `public/assets/apply/`.

#### 2. Vista `/login` (Inicio de Sesi�n)
- **Dise�o:** 1:1 con Figma (Node `134-209`).
- **Caracter�sticas:**
    - Tarjeta central flotante consistente con `/apply`.
    - Logo principal centrado y t�tulo "ACCEDE A LA ACADEMIA".
    - Footer externo con redes sociales y contacto.
- **Assets:** `public/assets/login/`.

#### 3. Componentes Atomizados Auth (`components/ui/`)
Reutilizados exitosamente en ambas vistas:
- `AuthCard.tsx`: Contenedor oscuro con acento superior dorado (backdrop-blur opcional).
- `AuthInput.tsx`: Input minimalista de borde inferior, label flotante en focus, color dorado.
- `AuthButton.tsx`: Bot�n con gradiente dorado y sombra neon.

### C. Ensamblaje actual

- `app/page.tsx`  Landing Page.
- `app/apply/page.tsx`  Formulario de Activaci�n.
- `app/login/page.tsx`  Formulario de Login.
- `components/HeaderWrapper.tsx`  Controla visibilidad del Header (oculto en auth).

### D. Assets

El flujo de assets est� estandarizado en `public/assets`.
**Regla de oro:** No usar URLs externas de Figma. Descargar, renombrar a *kebab-case*, guardar en `public/assets/<vista>/` e importar con `next/image`.

## 3. Sistema visual y tokens

Base de dise�o vigente (Actualizada):

- **Paleta Auth Dark:**
  - Background: `#050505` (Deep Black)
  - Card Bg: `#1d1d1d` (Surface Elevated)
  - Gold Accent: `#D4AF37`
  - Input Placeholder: `text-[#d3cbba]/50`
  - Typography: `font-cinzel` (T�tulos), `font-sans` (Cuerpo/Inputs).

## 4. Pr�cticas obligatorias para siguientes vistas (Dashboard, Admin, etc.)

1. **Flujo de Implementaci�n de Vistas:**
    *   **Input:** Screenshot o MCP Figma + Asset Export.
    *   **Paso 1 (Assets):** Descargar im�genes a `public/assets/<vista>/`.
    *   **Paso 2 (Atomizaci�n):** Identificar patrones repetidos -> `components/ui` o `components/<vista>`.
    *   **Paso 3 (Layout):** Implementar estructura macro.
    *   **Paso 4 (Detalle):** Aplicar tokens de dise�o y ajustes finos (pixel-perfect).

2. **Consistencia Visual**
    - Mantener la est�tica "Dark Premium".
    - Usar los componentes `Auth*` si se requieren formularios similares.
    - Respetar espaciados y tipograf�as (`Cinzel` vs `Montserrat`).

3. **Control de Navegaci�n**
    - Las nuevas vistas privadas (Dashboard) deben tener su propio Layout/Sidebar.

## 5. Pr�ximos Pasos (Ready for Dev)

El terreno est� listo para recibir dise�os de las siguientes vistas.

**Prioridad sugerida:**
1. **Dashboard Layout:** Crear el "shell" del estudiante con el sidebar y header autenticado correctos.
2. **Dashboard Home:** Implementar la vista de resumen del estudiante.
3. **Player de Cursos:** Implementar la vista de visualizaci�n de contenido.
