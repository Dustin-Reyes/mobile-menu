# Forms Kit v1 Spec (React + Netlify Forms)

## Goals
- Add forms to any page/section by importing a single component (e.g. `ContactForm`) or the generic `Form` engine.
- Schema-driven fields for consistent UI and fast form creation.
- Full client-side validation with clear inline errors and submit notifications.
- Netlify Forms submission (no custom API / DB / email logic in-app).
- Built-in honeypot support for spam reduction.
- Stable Playwright selectors (`data-testid`) for every form element.
- Themeable inputs via Emotion ThemeProvider with light/dark support.
- Sentry capture for unexpected submit failures (no PII in telemetry).

## Non-goals (v1)
- Multi-step/wizard forms
- File uploads
- Complex conditional logic beyond simple “show/hide” (reserve for v2)
- Custom backend submission (Netlify Functions) — supported in future via “submit strategies”

---

## Repo structure

Add a new folder under components:

```
src/components/forms/
  Form.jsx
  FormField.jsx
  ContactForm.jsx
  inputs/
    TextInput.jsx
    TextArea.jsx
  schema/
    contactSchema.js
  config/
    contactFields.js
```

Optional future additions:
- `src/components/forms/presets/` (for waitlist, quote)
- `src/services/forms/` (if adding Netlify Functions strategy later)

Notes:
- Keep v1 “flat and obvious.” No deep nesting beyond `inputs/`, `schema/`, `config/`.

---

## Dependencies (v1)
- `react-hook-form`
- `zod`
- `@hookform/resolvers` (zod resolver)
- Use existing toast/notification mechanism in the template (or a thin wrapper).
- Use existing Sentry initialization already present in the project.

---

## Naming conventions

### Form IDs
- Each form has a unique `formId` string.
- v1 uses: `formId = "contact"`

This `formId` is used for:
- Netlify form-name binding
- test id generation
- Sentry tags/breadcrumbs

### Field names
- `name` must be a stable string, used as the HTML input `name` and RHF field key.
- Examples: `name`, `email`, `message`
- Field names must be unique within a form.

---

## Playwright selector standard (`data-testid`)

All forms and elements MUST include stable `data-testid` attributes based on the pattern below.

### Base pattern
`form:<formId>`

### Required test ids
- Form root:  
  `data-testid="form:<formId>"`
- Field wrapper:  
  `data-testid="form:<formId>:field:<fieldName>"`
- Input element (actual input/textarea/select):  
  `data-testid="form:<formId>:input:<fieldName>"`
- Inline field error message:  
  `data-testid="form:<formId>:error:<fieldName>"`
- Submit button:  
  `data-testid="form:<formId>:submit"`
- Submit error banner (general):  
  `data-testid="form:<formId>:submitError"`
- Success confirmation panel:  
  `data-testid="form:<formId>:success"`

### Optional test ids
- Loading indicator (if separate from button):  
  `data-testid="form:<formId>:loading"`
- Honeypot input:  
  `data-testid="form:<formId>:honeypot"`

Rules:
- The input element itself MUST carry the `input:*` test id (not only wrappers).
- Test ids must not change with label text, layout, or theme.

---

## Theme support (Emotion)
All form UI components MUST derive styles from theme tokens (no hard-coded colors).

### Minimum required theme tokens
The existing theme may name these differently; the forms kit should map to the project’s theme structure.

Required conceptual tokens:
- `colors.input.bg`
- `colors.input.text`
- `colors.input.border`
- `colors.input.borderFocus` (or focus ring color)
- `colors.text.muted`
- `colors.feedback.error`
- `colors.feedback.success`
- `spacing.xs`, `spacing.sm`, `spacing.md`, `spacing.lg`
- `radii.sm`, `radii.md`
- `fontSizes.sm`, `fontSizes.md`

Light/dark:
- Provided via swapping theme objects in ThemeProvider; form kit must be theme-agnostic.

---

## Accessibility requirements (a11y)
For each field:
- Label is associated with input via `htmlFor` + input `id`
- Error message must be linked via `aria-describedby`
- If error exists: `aria-invalid="true"`
- Helper text (if present) also included in `aria-describedby`
- Submit error banner (general) should use `role="alert"` or similar pattern

---

## Form engine API: `Form` component

### Purpose
Generic engine that:
- initializes React Hook Form with Zod validation
- renders fields from config
- handles Netlify Forms submission
- controls success/error UI
- fires notifications
- captures Sentry events on submit failure

### Props

**Required**
- `formId: string`  
  Used for Netlify form-name and test ids.
- `schema: ZodSchema`  
  Zod schema used with RHF resolver.
- `fields: FieldConfig[]`  
  Field definitions (see below).
- `submitLabel: string`  
  Submit button label (e.g., “Send message”).

**Optional**
- `successMessage: string`  
  Inline success panel text.
- `errorMessage: string`  
  Fallback submit error message (non-field errors).
- `resetOnSuccess: boolean`  
  Default `true` for Contact. Clears form on success.
- `className?: string`  
  For section/page layout integration.
- `onSuccess?: () => void`  
  Hook after successful submit.
- `onError?: (errMeta) => void`  
  Hook for custom handling; still should allow default Sentry capture.
- `notify?: { success(msg), error(msg) }`  
  Adapter to the project’s existing toast/notification system.

---

## Netlify Forms behavior (required)

`Form` MUST render a native `<form>` element with:
- `name="<formId>"`
- `method="POST"`
- `data-netlify="true"`
- `data-netlify-honeypot="bot-field"`

and MUST include hidden inputs:
- `<input type="hidden" name="form-name" value="<formId>" />`

and a honeypot input:
- `<input name="bot-field" />` (see honeypot rules)

Submission must post form-encoded data compatible with Netlify (not JSON).

---

## Submit flow (v1)
1. RHF validation runs via Zod resolver
2. If invalid:
   - show inline field errors
   - focus the first invalid field
   - do NOT send to Sentry
3. If valid:
   - set submitting/loading
   - submit to Netlify (POST encoded form body)
4. On success:
   - set `submitted=true`
   - if `resetOnSuccess`, call `reset()`
   - show success panel (`data-testid="form:<id>:success"`)
   - toast success (if notify provided)
5. On failure:
   - show submit error banner (`data-testid="form:<id>:submitError"`)
   - toast error (if notify provided)
   - capture Sentry event (no PII)

---

## Field configuration: `FieldConfig`

### Base shape
Each field config must include:

- `name: string` (required)
- `type: "text" | "email" | "textarea"` (v1)
- `label: string` (required)
- `placeholder?: string`
- `helperText?: string`
- `autoComplete?: string`
- `defaultValue?: string`
- `rows?: number` (textarea only)
- `required?: boolean` (UI-only; validation is controlled by schema)
- `disabled?: boolean`
- `testId?: string` (optional override; default generated)

### Test id generation
If `testId` not provided, generate:
- input: `form:<formId>:input:<fieldName>`
- wrapper/error derived similarly

Field configs MUST NOT hardcode IDs dependent on label text.

### Rendering rules (v1)
- `type="text"` -> `TextInput`
- `type="email"` -> `TextInput` with `inputMode=email` + `autoComplete=email` default
- `type="textarea"` -> `TextArea`

All fields are wrapped by `FormField` for consistent label + error handling.

---

## Contact form v1 definition

### Contact schema (Zod)
Fields:
- `name`: required, min length 2
- `email`: required, valid email
- `message`: required, min length 10

Error messages should be explicit and friendly.

### Contact fields config
- Name (text)
- Email (email)
- Message (textarea, default rows 6)

### Contact UX
- `resetOnSuccess = true`
- `successMessage = "Thanks — your message has been sent."`
- Confirmation panel remains visible until user interacts again or navigates away.

---

## Honeypot requirements
- Form has `data-netlify-honeypot="bot-field"`
- Include honeypot input with `name="bot-field"`
- Honeypot should be visually hidden but not necessarily `display:none`:
  - Prefer an offscreen/visually-hidden pattern
  - Mark appropriately so it’s not announced to screen readers (implementation detail later)
- Include `data-testid="form:<formId>:honeypot"` on the honeypot input

---

## Notifications (toasts)
The form kit must integrate with the project’s existing notification system via `notify` adapter.

Required notification events:
- success: on successful submit
- error: on submit failure (network/server)

Avoid toasting validation errors per-field (inline errors are enough). Optional: a single toast “Please fix the highlighted fields.”

---

## Sentry reporting
Sentry capture happens ONLY for submit failures (not validation).

### Client-side capture payload
- tags:
  - `formId: "<formId>"`
  - `submitter: "netlify-forms"`
- extras (no PII):
  - `fieldNames: string[]`
  - `status?: number`
  - `errorType: "network" | "unexpected" | "server"`
  - `pageUrl`

DO NOT include:
- email, message, or any user-entered values

### Server-side
Not applicable for v1 (no Netlify Functions). If added in v2, Netlify Functions must capture exceptions and return safe error objects.

---

## Testing requirements (Playwright)

At minimum, add tests for:

1) Validation
- submit empty form → field errors for required fields
- `getByTestId("form:contact:error:name")` etc.

2) Successful submission (mock / intercept)
- fill inputs by test id
- intercept POST
- assert success panel exists
- assert inputs cleared after success

3) Honeypot presence
- assert honeypot input exists by test id

Selectors must rely only on `data-testid`, not visible text.

---

## Extensibility plan (v2+)
Future forms (waitlist, quote) will:
- copy Contact pattern: `schema + fields + wrapper component`
- unique `formId`
- same engine
- optionally add more input types (select, checkbox) without changing engine API

Optional future: submit strategies
- `submitter: "netlify-forms" | "netlify-function"`
- would allow switching to Netlify Functions while keeping fields/components unchanged.
