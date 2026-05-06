# Landing lead capture email and phone design

This document describes the change to require both email and phone
before unlocking the landing page. It covers the data flow, component
changes, and CRM updates needed to store the email in `crm_leads`.

## Goals

The change must:

- Require email and phone in a single form before unlocking the landing.
- Store both values in `crm_leads` for stage 1 capture.
- Preserve the existing unlock behavior, UI layout, and flow gate
  structure.
- Keep the current CRM stage 1 timestamp behavior.
- Avoid duplicate leads when either email or phone already exists.

## Non-goals

The change does not include:

- Any visual redesign of the landing page sections.
- Any new routes or CRM stages.
- Any changes to `/qualify` wizard questions or scoring.

## Current behavior

The landing gate currently unlocks after a phone-only form succeeds.
The server action validates and normalizes the phone, then inserts or
updates a `crm_leads` row. The flow stores a cookie named
`tracked_lead_phone` and a local storage flag to keep the page unlocked.

## Proposed behavior

The landing gate unlocks only after a combined email + phone form
succeeds. Both fields are validated server-side, and the resulting lead
row is updated or created with both values. The unlock logic stays
atomic: if either field fails validation, the page remains locked.

## Data model

`crm_leads.email` already exists and is unique. This change writes email
at stage 1 capture instead of leaving it null. No schema changes are
required unless the column is missing in the target environment.

If the environment has not applied the CRM migrations, apply the
existing pre-lead migration before enabling the update.

## Server action changes

Update `capturePhoneLead` to accept and validate email plus phone.
The action should:

1. Validate `email`, `phone`, and `countryCode` with Zod.
2. Normalize email to lowercase before any lookups.
3. Normalize the phone using `normalizePhoneNumber`.
4. Look up an existing lead by phone.
    - If found, check whether the provided email belongs to a different
       lead. If it does, return `duplicateEmail`.
    - If the email is unused or belongs to the same lead, update that
       lead with the email and stage 1 fields.
5. If no phone match exists, look up by email.
    - If found and the stored phone is empty, update the phone and stage
       1 fields.
    - If found and the stored phone is different and non-empty, return
       `duplicatePhone`.
6. If neither exists, insert a new lead row with both fields set.
7. Set `tracked_lead_phone` cookie using the normalized phone value.

This avoids unique constraint conflicts on `email` and ensures the
capture is idempotent for both identifiers.

Set `stage1_entered_at` on first capture only. Preserve the existing
value on subsequent updates.

If phone and email exist on different leads, return a duplicate error
instead of attempting to merge. This keeps the capture deterministic and
avoids overwriting unrelated leads.

When a phone match exists but the provided email belongs to another
lead, return `duplicateEmail`. When an email match exists but the
provided phone belongs to another lead, return `duplicatePhone`.

Keep the existing action name (`capturePhoneLead`) and state type name
to minimize changes across imports.

If the `company` honeypot field is populated, return success early and
skip cookies and database writes.

Keep the cookie options consistent with the current implementation:
`path=/`, `httpOnly`, `sameSite=lax`, `secure` in production, and a
30-day `maxAge`.

## Component changes

Replace `PhoneLeadCaptureForm` with a two-field form that captures email
and phone in the same submission. The component keeps the existing
layout, button style, and error rendering, but adds an email input and
updates labels and helper text.

Field order and layout:

- Mobile: stacked fields in this order: email, country code, phone,
   submit button.
- `md` and up: inline row with email input, country code select, phone
   input, and submit button.

The `LandingFlowGate` continues to listen for `lead-capture:success` and
dispatches the event on successful submission.

## Unlock persistence

To avoid unlocking from older phone-only captures, bump the local
storage key version to `landing_phone_captured_v2`. This
forces a new capture with both fields.

Keep the unlock event name (`lead-capture:success`) unchanged and do not
add event payload requirements.

Clear the old local storage key after a successful capture.

Clear the old key inside `LandingFlowGate` when handling the
`lead-capture:success` event, not in the server action.

## Validation and errors

- Email: `z.string().trim().email()` with a localized error message,
   plus `max(255)`. Normalize to lowercase before storing.
- Phone: existing validation plus normalization.
- Honeypot: keep the hidden `company` field.
- Unique conflicts: return a specific message for duplicate email or
   duplicate phone based on the constraint error.

If the `company` honeypot field is populated, return a success response
without writing to the database.

In the honeypot case, do not set cookies. The current session can
unlock via the success event, but the unlock should not persist across
refreshes.

This behavior is intentional so bots do not create persistent unlocks.

Country codes are optional and default to `+61`. Use a regex guard that
matches `^\+[1-9]\d{0,3}$`.

The `+61` default is intentional to match the current Australia-based
funnel; do not geolocate or auto-detect for this change.

Return the first validation error message and keep the locked state
until success.

## Localization

Extend the landing dictionary to include email labels, placeholders, and
error messages. Reuse the existing `landing.phoneCapture` namespace for
consistency and keep the existing key names unless there is a strong
reason to rename them.

Update the flow gate title and helper copy to mention both email and
phone so the requirement is clear to the user.

Use these Spanish copy updates as the baseline:

- `landing.flowGate.unlockTitle`: "Desbloquea el contenido"
- `landing.flowGate.unlockDescription`: "Deja tu correo y telefono para
   ver toda la informacion."
- `landing.phoneCapture.helper`: "Necesitamos tu correo y telefono para
   continuar."

Add these keys:

- `landing.phoneCapture.emailLabel`
- `landing.phoneCapture.emailPlaceholder`
- `actions.landing.invalidEmail`
- `actions.landing.duplicateEmail`
- `actions.landing.duplicatePhone`

Use copy that clearly says the email or phone is already registered.

Keep error messages in `actions.landing` because the server action uses
`dictionary.actions.landing` for responses.

## Testing considerations

- Submit with valid email and phone, verify unlock and cookie set.
- Submit with invalid email or phone, verify locked state and error.
- Verify existing phone lead gets updated with email.
- Verify existing email lead gets updated with phone.
- Submit with only one field populated and confirm validation fails.
- Revisit the landing after capture and confirm it stays unlocked.
- Submit the honeypot field and confirm unlock is not persisted.
- Verify mobile and desktop layout order and spacing.
- Submit twice with identical values to confirm idempotency.

## Documentation updates

After implementation, update the following files to reflect the new
requirement:

- `docs/ROUTES.md` for the landing flow gate behavior.
- `docs/DATABASE.md` to note email capture at stage 1.
- `docs/COMPONENTS.md` for the updated lead capture form.
