# Handoff — pendientes que necesitan acceso de desarrollador

Este documento resume lo que queda pendiente en el PR #12
(`audit/top-10-improvements` → `main`) y qué se necesita de quien tenga
acceso a GitHub/Vercel/Supabase para cerrarlo. Todo lo que se podía resolver
sin ese acceso ya está hecho y pusheado a la rama.

PR: https://github.com/Marlon0144/xclusive-barber-Academy/pull/12

## 1. Mergear el PR #12 a `main` y verificar el deploy

El PR ya incluye, entre otras cosas:
- Analítica activada: GTM, GA4 y Meta Pixel quedan **funcionando
  automáticamente en cuanto se despliegue** — los IDs reales ya están en el
  código (`lib/analytics/config.ts`), no hace falta tocar variables de
  entorno en Vercel para que esto funcione.
- Fixes de SEO técnico (sitemap, robots, metadata, JSON-LD, jerarquía de
  encabezados H1/H2/H3 en mobile).
- Fix de textos en inglés que estaban sin traducir (planes de pricing,
  páginas `/courses`).
- Ajustes de navegación (link a `/courses` en el header, textos de botones
  menos confusos).

**Qué hacer:**
1. Revisar el PR (diff + descripción).
2. Confirmar que el preview deploy de Vercel se ve bien (mobile y desktop).
3. Mergear a `main`.
4. Confirmar que el deploy de producción levantó bien y que GTM/GA4/Meta
   Pixel están disparando (se puede verificar con la extensión "Tag
   Assistant" de Google o el pixel helper de Meta).

## 2. Auditar y arreglar la inconsistencia de políticas RLS de admin (P1 — seguridad)

**Esto es lo único que quedó bloqueado y necesita acceso directo a
Supabase** (el proyecto/organización correcto, no solo el código).

**El problema** (ya auto-documentado en `docs/DATABASE.md` antes de esta
auditoría): algunas políticas RLS que dan acceso de admin verifican el rol
leyendo metadata del JWT, y otras verifican `profiles.role` en la tabla. Son
dos fuentes de verdad distintas para la misma decisión ("¿es admin?"), lo
cual es exactamente el tipo de inconsistencia que más adelante produce bugs
de escalación de privilegios (un usuario con el JWT desactualizado, o con
`profiles.role` desactualizado, puede terminar con más o menos acceso del
que debería).

**Qué hacer (no aplicar un fix directo en producción):**
1. Con acceso al proyecto de Supabase, listar todas las políticas RLS que
   tocan tablas de admin (`crm_leads`, `crm_lead_answers`, y cualquier otra
   con políticas de rol) y anotar cuál mecanismo usa cada una.
2. Decidir una sola fuente de verdad (lo más simple y consistente con el
   resto del sistema es `profiles.role`, que es lo que ya usan las políticas
   de delete más recientes — ver `scripts/2026-04-01-crm-admin-delete-policies.sql`).
3. Escribir el SQL exacto de "antes" y "después" para cada política que haya
   que cambiar.
4. Probarlo en un **branch de Supabase** (no directo en producción) con
   usuarios de prueba en varios roles.
5. Aplicar a producción solo después de validar que ningún usuario legítimo
   pierde acceso y ningún usuario no-admin lo gana.

Referencias: `docs/ACADEMY_TECHNICAL_AUDIT.md` (hallazgo #1, P1) y
`docs/DATABASE.md` (sección "Row-Level Security (RLS)").

## 3. Opcional — cambiar los IDs de analítica más adelante

Si en algún momento se necesita apuntar un ambiente de preview/staging a un
contenedor de GTM o pixel distinto al de producción, no hace falta editar
código: basta con setear la variable de entorno correspondiente en Vercel
(`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_META_PIXEL_ID`) y
esa la va a preferir por sobre el valor por defecto que ya está en el
código. Ver `docs/ANALYTICS_TRACKING_PLAN.md` para el detalle completo.

**Importante:** GA4 ya se carga de forma directa (gtag.js), independiente de
GTM. Si alguna vez se entra al contenedor de GTM, no agregar ahí una tag de
"GA4 Configuration" — duplicaría el conteo de PageViews.
