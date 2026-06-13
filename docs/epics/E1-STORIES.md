# E1: Contact Form Backend — Stories

Epic issue: #1
Goal: Wire the existing contact form to send real emails so parents can reach the school.

---

## S-01: Contact API handler [ ] (#5)

**Epic:** E1 (#1)
**Priority:** MUST
**Effort:** 6h
**Depends on:** none

### Details
Add a `POST /api/contact` endpoint to the Go backend that validates the submitted form fields and sends an email to the school's inbox via SMTP. This is the core of the epic — without it, the form cannot function.

### Implementation Details
Three files to create/modify:

1. **`backend/internal/config/config.go`** — extend `Config` struct with SMTP fields:
   ```go
   type Config struct {
       Port       string
       SMTPHost   string
       SMTPPort   string
       SMTPUser   string
       SMTPPass   string
       ContactTo  string
   }
   ```
   Read from env vars `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO`. Defaults: host=`smtp.gmail.com`, port=`587`. `SMTP_USER`, `SMTP_PASS`, `CONTACT_TO` have no defaults — handler must check they are set.

2. **`backend/internal/models/contact.go`** — request struct and validation:
   ```go
   type ContactRequest struct {
       Name    string `json:"name"`
       Email   string `json:"email"`
       Message string `json:"message"`
   }

   type ValidationErrors map[string]string

   func (r ContactRequest) Validate() ValidationErrors { ... }
   ```
   Validation rules: `name` non-empty; `email` matches `addr@domain.tld` (use `net/mail.ParseAddress`); `message` non-empty.

3. **`backend/internal/handlers/contact.go`** — handler:
   ```go
   func Contact(cfg config.Config) http.HandlerFunc {
       return func(w http.ResponseWriter, r *http.Request) { ... }
   }
   ```
   Flow: decode body → validate → send SMTP → respond.
   - 422 on validation errors: `{"errors": {"field": "reason"}}`
   - 200 on success: `{"ok": true}`
   - 500 on SMTP failure: `{"error": "failed to send message"}`
   - Use `net/smtp` with STARTTLS (`smtp.SendMail`)

4. **`backend/cmd/server/main.go`** — register route:
   ```go
   r.Post("/api/contact", handlers.Contact(cfg))
   ```

### Acceptance Criteria
- [ ] `POST /api/contact` with valid fields returns `200 {"ok": true}` and an email is sent to `CONTACT_TO`
- [ ] `POST /api/contact` with empty `name` returns `422 {"errors": {"name": "required"}}`
- [ ] `POST /api/contact` with invalid `email` returns `422 {"errors": {"email": "invalid format"}}`
- [ ] `POST /api/contact` with empty `message` returns `422 {"errors": {"message": "required"}}`
- [ ] Multiple invalid fields return all errors in a single `422` response
- [ ] SMTP credentials are read from env vars only — no hardcoded values
- [ ] `go test ./...` passes with unit tests for `Validate()` and an `httptest`-based integration test for the handler
- [ ] `Content-Type: application/json` set on all responses

### Test Cases Covered
TC-01 (happy path), TC-02 (validation), TC-03 (SMTP failure)

---

## S-02: Wire contact form to API [ ] (#6)

**Epic:** E1 (#1)
**Priority:** MUST
**Effort:** 4h
**Depends on:** S-01

### Details
Replace the placeholder submit handler in `Contact.tsx` with a real `fetch` call to `POST /api/contact`. The form should show field-level validation errors returned by the API and an error banner with a retry option if the server fails.

### Implementation Details
Modify **`frontend/src/components/Contact.tsx`**:

- Add `errors` state: `const [errors, setErrors] = useState<Record<string, string>>({})`
- Add `submitting` state to disable the button during the request
- Add `submitError` state for the 5xx banner
- Replace `handleSubmit` body:
  ```ts
  const res = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(form),
  })
  if (res.ok) { setSent(true); return }
  if (res.status === 422) {
    const { errors } = await res.json()
    setErrors(errors)
    return
  }
  setSubmitError(true)
  ```
- Render field-level errors below each input (red text, `text-red-400 text-xs mt-1`)
- Render error banner above the submit button when `submitError` is true:
  ```
  Ocorreu um erro. Tenta novamente.   [Tentar novamente]
  ```
  "Tentar novamente" clears `submitError` and re-enables the form.
- The existing success state (`sent === true`) remains unchanged.

No new files needed.

### Acceptance Criteria
- [ ] Submitting a valid form calls `POST /api/contact` and shows the existing success state on 200
- [ ] On 422, field-level error messages appear below the relevant inputs (in Portuguese where possible: "Obrigatório", "Email inválido")
- [ ] Submit button shows "A enviar…" and is disabled during the request
- [ ] On 500/network error, an error banner appears with a "Tentar novamente" button that re-enables the form
- [ ] `errors` state is cleared on each new submission attempt
- [ ] No inline styles — Tailwind classes only

### Test Cases Covered
TC-01 (happy path), TC-02 (validation errors shown), TC-03 (retry banner)
