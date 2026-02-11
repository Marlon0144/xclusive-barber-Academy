# Guía y Estado Actual del Front-end

Este documento presenta un análisis técnico del estado actual del front-end de la aplicación **Xclusive Barber Academy**, identificando la arquitectura, los componentes clave y las áreas de mejora para la escalabilidad.

## 1. Arquitectura General

*   **Framework:** Next.js 15 (App Router).
*   **Lenguaje:** TypeScript.
*   **Estilos:** Tailwind CSS v4.
*   **Gestión de Estado/Data:** Server Components para data fetching inicial + Supabase Client para interacciones.
*   **Librería de Componentes:** Componentes propios basados en `radix-ui` (primitivos) y `lucide-react` (iconos).

## 2. Mapa de Componentes Importantes

La aplicación sigue una estructura modular, separando componentes de UI genéricos de los componentes de dominio (admin, cursos).

### A. Core UI (`/components/ui`)
Estos son los bloques fundamentales de la interfaz. Actualmente la librería es **limitada**:
*   `Button` (`button.tsx`): Implementa variantes (`default`, `outline`, `ghost`, etc.) usando `class-variance-authority`. Es un buen ejemplo de componente escalable.
*   `Input` (`input.tsx`): Componente base para formularios.

### B. Componentes de Dominio
*   **Admin** (`/components/admin`):
    *   `RichTextEditor`: Editor de texto enriquecido basado en Tiptap. Crítico para la gestión de contenido de cursos.
*   **Estructura de Páginas** (`/app`):
    *   `RootLayout` (`layout.tsx`): Define la configuración global de fuentes (Cinzel, Montserrat) y el tema oscuro base.
    *   `Dashboard` (`/app/dashboard/page.tsx`): Actúa como el "hub" central. Actualmente contiene mucha lógica de UI "inline" (tarjetas de navegación) que debería ser separada.

## 3. Clases Fundamentales y Sistema de Diseño

El diseño se basa en una estética "Premium Dark" definida en `globals.css`.

### Paleta de Colores (CSS Variables)
*   **Dorado (Acción/Premium):** `--gold-500` (#D4AF37), `--gold-600`. Usado en botones, textos destacados y bordes hover.
*   **Fondo/Superficie:** `--background` (#050505), `--surface` (#121212). El fondo usa un patrón de textura sutil (`--pattern-dark`).
*   **Semánticos:**
    *   Texto principal: `--foreground` (#EDEDED).
    *   Texto secundario: `text-zinc-400` (Clase de Tailwind).
    *   Verde (Instrutor): `--green-950` / `text-green-400`.

### Tipografía
*   **Títulos:** `font-serif` (Cinzel). Para encabezados h1-h6 y elementos decorativos.
*   **Cuerpo:** `font-sans` (Montserrat). Para lectura y UI general.

### Sombras y Efectos
*   **Glow Dorado:** `shadow-[0_0_10px_rgba(212,175,55,0.3)]`. Usado para destacar elementos activos o hover.

## 4. Análisis de Escalabilidad y Errores Detectados

A continuación se detallan los problemas encontrados y las soluciones sugeridas para la próxima iteración.

### A. Falta de Abstracción en UI (Tarjetas del Dashboard)
**Problema:** En `app/dashboard/page.tsx`, las tarjetas de navegación ("Aprender", "Practicar", etc.) repiten el mismo código HTML y clases de Tailwind varias veces.
**Riesgo:** Si quieres cambiar el diseño de las tarjetas, tienes que hacerlo en 3 o 4 lugares diferentes. Aumenta la posibilidad de inconsistencias.
**Solución:** Crear un componente `DashboardCard.tsx` que reciba `icon`, `title`, `description`, `href` y `themeColor` como props.

### B. "Magic Values" (Valores Arbitrarios)
**Problema:** Se usan valores arbitrarios en el código, por ejemplo: `bg-[#0A1F0A]/40` o `bg-[#1A1010]/40`.
**Riesgo:** Rompe la consistencia del sistema de diseño. Si decides cambiar el tono de "verde oscuro" de la marca, tendrás que buscar y reemplazar estos hex codes manualmente.
**Solución:** Definir estos colores en `globals.css` o `tailwind.config` con nombres semánticos, ejemplo: `--bg-instructor-card` o clases como `bg-green-deep`.

### C. Librería UI Incompleta
**Problema:** Faltan componentes básicos estandarizados como `Card` (Container, Header, Body), `Badge`, `Dialog/Modal`.
**Riesgo:** Cada desarrollador implementará estos elementos a su manera, generando "deuda técnica" visual.
**Solución:** Implementar un set básico de componentes en `/components/ui` siguiendo el patrón del `Button`.

### D. Lógica de Negocio en Vistas
**Problema:** `DashboardPage` hace 3 niveles de verificación de roles directamente en el componente de página (`if (user) ... const { data: profile } ...`).
**Riesgo:** Dificulta el testing y reutilización de la lógica de permisos.
**Solución:** Mover la lógica de obtención de roles a una función de utilidad (`utils/auth.ts`) o un Contexto de Usuario si la app crece.

## 5. Próximos Pasos Recomendados

1.  **Refactorizar Dashboard:** Extraer las tarjetas a componentes reutilizables.
2.  **Estandarizar Colores:** Reemplazar los valores hex arbitrarios (`#0A1F0A`, etc.) por variables CSS o clases de utilidad configuradas.
3.  **Expandir UI Kit:** Crear componentes `Card`, `Badge` y `Alert` para usar en toda la aplicación.
