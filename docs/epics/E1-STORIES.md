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
- [ ] When the user submits the form with all fields filled in correctly, the API returns a 200 response with the body `{"ok": true}` and an email is delivered to the address specified in `CONTACT_TO`.
- [ ] When the user submits the form with an empty name field, the API returns a 422 response with the body `{"errors": {"name": "required"}}` and no email is sent.
- [ ] When the user submits the form with an email address that does not match a valid email format, the API returns a 422 response with the body `{"errors": {"email": "invalid format"}}` and no email is sent.
- [ ] When the user submits the form with an empty message field, the API returns a 422 response with the body `{"errors": {"message": "required"}}` and no email is sent.
- [ ] When the user submits the form with multiple invalid fields at once, the API returns a single 422 response containing all validation errors in the `errors` object.
- [ ] All SMTP credentials are read exclusively from environment variables; no credentials appear in any committed file.
- [ ] Running `go test ./...` passes, covering unit tests for `Validate()` and an `httptest`-based integration test for the handler.
- [ ] The API sets `Content-Type: application/json` on all responses.

### Test Cases Covered
TC-01 (happy path), TC-02 (validation), TC-03 (SMTP failure)

---

## S-02: Wire contact form to API [ ] (#6)

**Epic:** E1 (#1)
**Priority:** MUST
**Effort:** 4h
**Depends on:** S-01 (#5)

### Details
Replace the placeholder submit handler in `Contact.tsx` with a real `fetch` call to `POST /api/contact`. The form should show field-level validation errors returned by the API and an error banner with a retry option if the server fails. S-01 (#5) must be merged before this story can be executed.

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
- [ ] When the user fills in all fields correctly and submits the form, the browser calls `POST /api/contact` and, on a 200 response, the form transitions to the existing success state.
- [ ] When the API returns a 422 response with validation errors, the relevant error messages appear below each invalid input field in Portuguese (e.g. "Obrigatório", "Email inválido").
- [ ] While a submission is in progress, the submit button displays "A enviar…" and is disabled so the user cannot submit twice.
- [ ] When the API returns a 500 response or a network error occurs, an error banner appears above the submit button with a "Tentar novamente" button that re-enables the form for a new attempt.
- [ ] The `errors` state is cleared at the start of each new submission attempt so stale error messages do not persist.
- [ ] No inline styles are used; all styling is done with Tailwind utility classes.

### Test Cases Covered
TC-01 (happy path), TC-02 (validation errors shown in UI), TC-03 (retry banner on server error)
