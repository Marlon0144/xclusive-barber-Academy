# Landing pricing modularization design

This document describes how you will replace the landing pricing data with
four new programs, modularize the pricing UI, and keep the existing
qualification funnel. The goal is to make future edits to plan content
straightforward while preserving the Premium Dark visual system.

## Goals

The changes must:

- Show four new pricing programs with the exact copy provided by the user.
- Update both `es` and `en` locale entries in
  `lib/i18n/dictionaries.ts` so the data stays consistent across languages.
- Keep the CTA flow as `landing -> /qualify -> WhatsApp`.
- Encapsulate pricing cards into reusable React components.
- Make plan content easy to update without touching layout logic.

## Non-goals

The changes do not include:

- Any new routes or server actions.
- Changes to the CRM workflow beyond updating plan labels.
- Visual redesign outside the current Premium Dark look and feel.

## Requirements

The implementation must satisfy the following requirements:

- The pricing data must remain in `lib/i18n/dictionaries.ts`.
- Each plan must provide `id`, `name`, `priceLabel`, `billingLabel`,
  `hook`, `formatLabel`, `description`, `benefits`, `ctaLabel`, and
  optional `badge`.
- The CTA for each plan must link to `/qualify?plan=<id>`.
- The public qualify action must accept the new plan IDs and map them
  to correct WhatsApp labels.
- The pricing section must render four cards with a responsive grid:
  one column on mobile, two columns on `md`, and four columns on `xl`.
- Legacy plan IDs (`premium`, `mastery`) will be removed and are not
  considered valid for the public qualify flow.

## Plan data model

You will extend the pricing plan type to match the new copy:

- `id`: `starter`, `profesional`, `elite`, `business`
- `name`: program name
- `priceLabel`: price string without the currency suffix
- `billingLabel`: currency label, for example `AUD`
- `hook`: short lead-in line shown under the title
- `formatLabel`: short format line
- `description`: full paragraph description
- `benefits`: list of bullet points
- `ctaLabel`: CTA label text
- `badge` (optional): highlighted label

The `planLabels` mapping in `app/qualify/actions.ts` must include the
same four IDs so the WhatsApp message is correctly interpolated.

## Plan copy

You must use the following plan content exactly, preserving spelling
and punctuation. Keep the text in ASCII and use the same copy for both
`es` and `en` locales until English translations are provided.

### Plan: EXPERIENCIA BARBER STARTER

- `id`: `starter`
- `name`: EXPERIENCIA BARBER STARTER
- `hook`: Descubre si la barberia es lo tuyo antes de dar el siguiente paso.
- `priceLabel`: $300
- `billingLabel`: AUD
- `formatLabel`: 3 clases presenciales
- `description`: Vive tu primera experiencia en barberia dentro de un entorno
  real. Aprende lo basico, haz tu primeros corte y entiende como funciona
  esta profesion.
- `benefits`:
  - Fundamentos esenciales
  - Uso de herramientas
  - Primeros corte guiados
  - Experiencia real en barberia
  - Feedback
- `ctaLabel`: Reservar cupo

### Plan: PROGRAMA PROFESIONAL XCLUSIVE

- `id`: profesional
- `name`: PROGRAMA PROFESIONAL XCLUSIVE
- `hook`: Conviertete en barbero profesional en 12 semanas.
- `priceLabel`: $3,500 (early) / $4,000
- `billingLabel`: AUD
- `formatLabel`: Presencial - 12 semanas 80% practico 20% teorico
- `description`: Formacion completa para llevarte de cero a profesional.
  Aprendes tecnicas reales avanzadas, trabajas con clientes y te preparas
  para generar una habilidad que puede cambiarte la vida. Nuestro curso esta
  disenado por modulos con una duracion de alrededor de 100 horas de practica.
- `benefits`:
  - Higiene de la babera, fades, tijera, barba y estilos modernos
  - Practica con clientes reales
  - Kit profesional + uniforme
  - Certificado privado
- `ctaLabel`: Aplicar ahora

### Plan: MENTORIA ELITE XCLUSIVE

- `id`: elite
- `name`: MENTORIA ELITE XCLUSIVE
- `hook`: Entrena directo conmigo y lleva tu profesion a otro nivel.
- `priceLabel`: $400 - $1,500
- `billingLabel`: AUD
- `formatLabel`: 1 a 1 presencial
- `description`: Programa personalizado para barberos que quieren mejorar
  rapido, corregir errores y posicionarse como profesionales de alto nivel.
- `benefits`:
  - Diagnostico personalizado
  - Correccion tecnica en tiempo real
  - Plan de mejora
  - Estrategia profesional
- `ctaLabel`: Aplicar a mentoria

### Plan: EXPERIENCIA BARBER BUSINESS

- `id`: business
- `name`: EXPERIENCIA BARBER BUSINESS
- `hook`: Aprende a ganar dinero en la industria de barberia y no solo de
  cortando cabello.
- `priceLabel`: $400 - $700
- `billingLabel`: AUD
- `formatLabel`: Workshop presencial
- `description`: Descubre como conseguir clientes, cobrar mejor y crecer como
  barbero en el mundo real, marketing de barbero, como posicionarte como
  referente.
- `benefits`:
  - Estrategias para atraer clientes
  - Como subir precios
  - Marca personal
  - Experiencia real del negocio
- `ctaLabel`: Reservar cupo

## WhatsApp plan labels

You must use the following labels for WhatsApp interpolation in
`app/qualify/actions.ts`:

- `starter`: EXPERIENCIA BARBER STARTER
- `profesional`: PROGRAMA PROFESIONAL XCLUSIVE
- `elite`: MENTORIA ELITE XCLUSIVE
- `business`: EXPERIENCIA BARBER BUSINESS

## Component structure

You will keep `PricingSection` as the section entry point and introduce
subcomponents to isolate responsibilities.

- `PricingSection`: fetches dictionary data and builds `ctaHref` for
  each plan.
- `PricingPlanGrid`: renders the responsive grid and iterates over
  plans.
- `PricingPlanCard`: renders the visual card for a single plan.

All subcomponents can live inside
`components/landing/PricingSection.tsx` to avoid new files while still
encapsulating the card layout.

## Rendering and layout

The new layout must keep the existing Premium Dark style while
supporting the extra content:

- Keep the current card background, border, shadow, and CTA styling.
- Render the hook and format as secondary text under the title and
  price.
- Render the description before the benefits list.
- Keep the contact block (Instagram, logo, WhatsApp) unchanged.
- Only apply the highlight treatment when `badge` is provided.

## CTA flow and WhatsApp messaging

The CTA flow must remain unchanged:

1. The pricing card CTA links to `/qualify?plan=<id>`.
2. The public qualify wizard submits and redirects to WhatsApp.
3. The WhatsApp message includes the selected plan label.

The update must extend the `PlanKey` union and Zod enum so the new IDs
are valid and the redirect works for all four plans.

## Error handling

You must keep the current error handling behavior in the public qualify
action. No new error states are required for this change.

## Accessibility

You must preserve the existing accessibility behavior:

- Keep focus-visible styles on CTA buttons.
- Keep `aria-label` on Instagram and WhatsApp links.
- Preserve button hit area sizes and text contrast.

## Performance

You must keep the current server component pattern:

- `PricingSection` remains an async RSC.
- There must be no new client components for this change.

## Testing

Manual checks are required because no test framework is configured:

1. Open `/` and verify four cards render with the new copy.
2. Click a CTA and confirm it navigates to `/qualify?plan=<id>`.
3. Complete the wizard and confirm WhatsApp opens with the selected
   plan label.
4. Confirm the layout is correct on mobile, `md`, and `xl`.

## Documentation updates

You will update the following docs to reflect the new structure:

- `docs/COMPONENTS.md` to document the new pricing subcomponents.
- `docs/ROUTES.md` to reflect the four-program pricing section.
