---
name: go-backend
description: Architecture and coding rules for the Projeto Verde Go backend — Chi router, standard Go project layout, net/http handlers, JSON APIs, and testing. Use when creating, generating, scaffolding, writing, or reviewing Go code, handlers, models, or config in this project.
---

## Language & Version
- Go 1.25, use modern idioms (range-over-func, any alias, etc.)
- No frameworks beyond `github.com/go-chi/chi/v5` for routing
- **Stdlib first** — always reach for the standard library before adding a dependency. If stdlib can do the job (even with a few extra lines), use it. Only introduce a third-party package when the stdlib genuinely cannot do what is needed (e.g. a STARTTLS SMTP client is in stdlib; a JWT signer requires a crypto library).
- Before adding any `go get` dependency, explicitly justify why stdlib falls short.

## Project Layout
```
backend/
├── cmd/server/main.go       # entrypoint only — wires deps, starts server
├── internal/
│   ├── config/              # config.Load() reads env vars
│   ├── handlers/            # one file per handler group
│   └── models/              # domain types (structs, no ORM)
└── go.mod
```
- `cmd/` contains entrypoints only — no business logic
- `internal/` is the only place for application code
- Never create `pkg/` — everything is internal to this service

## Handlers
- Handler functions signature: `func Name(w http.ResponseWriter, r *http.Request)`
- Register handlers on the Chi router in `main.go`, not inside handler files
- One handler file per logical group (e.g., `handlers/health.go`, `handlers/contact.go`)
- Set `Content-Type` header before writing the body
- Always check and handle `r.Body` close: `defer r.Body.Close()`

## JSON
- Use `encoding/json` — no third-party JSON libraries
- Decode request body with `json.NewDecoder(r.Body).Decode(&v)`
- Encode response with `json.NewEncoder(w).Encode(v)`
- Define request/response structs in `internal/models/` with `json:` tags

## Error Handling
- Return proper HTTP status codes: `http.StatusBadRequest`, `http.StatusInternalServerError`, etc.
- Use `http.Error(w, message, statusCode)` for error responses
- Log errors with `log.Printf` — never swallow errors silently
- Do not panic in handlers; recover at the middleware level (Chi's `middleware.Recoverer` handles this)

## Config
- All configuration via environment variables, loaded in `config.Load()`
- Provide sensible defaults in `config.Load()` — never require env vars to be set for local dev
- Never read env vars outside of `internal/config/`
- Load `.env` for local development in `main.go` using a stdlib-only helper (`bufio.Scanner` + `strings.Cut` + `os.Setenv`). Silently skip if the file is absent so production is unaffected. Never use a third-party dotenv library.

## Code Style
- No comments that restate what the code does — only explain non-obvious WHY
- Short functions; if a handler grows beyond ~40 lines, extract helpers
- Prefer explicit error returns over panics
- Use named return values only when it genuinely improves clarity
- `gofmt` formatting is mandatory — code must be properly formatted

## Testing
- TDD: write the test first, then the implementation
- Use `net/http/httptest` for handler tests — no external test frameworks
- Test file names: `*_test.go` in the same package as the code under test
- Table-driven tests preferred for multiple input/output cases
- Test the HTTP contract: status code, `Content-Type`, response body shape
- One test file per handler file (e.g., `health_test.go` for `health.go`)

## Chi Router Conventions
- Use `middleware.Logger` and `middleware.Recoverer` on the root router
- Group related routes with `r.Route("/api/...", func(r chi.Router) { ... })`
- URL parameters via `chi.URLParam(r, "id")`
- Set CORS headers in a middleware, not per-handler

## Simplicity
- KISS and YAGNI — implement the simplest solution that works
- Never add abstractions for hypothetical future requirements
- Ask before introducing a new dependency or significant architectural change
