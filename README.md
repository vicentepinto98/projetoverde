# Projeto Verde

Website for Projeto Verde, a forest school based in Barreiro, Portugal.

## Running locally

### Prerequisites

- Go 1.21+
- Node.js 18+
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) (2-Step Verification must be on)

### 1. Backend environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` and fill in your SMTP credentials:

| Variable | Value |
|---|---|
| `SMTP_USER` | Gmail address that sends the emails |
| `SMTP_PASS` | 16-character App Password (not your Gmail password) |
| `CONTACT_TO` | Where form submissions are delivered — use `vicenteppinto@gmail.com` for local testing |

### 2. Start the backend

```bash
cd backend
go run ./cmd/server
# → server listening on :8080
```

### 3. Start the frontend

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

The Vite dev server proxies all `/api/*` requests to `http://localhost:8080`, so the contact form talks to your local Go server automatically.

### 4. Test the contact form

1. Open [http://localhost:5173](http://localhost:5173) and scroll to **Fala Connosco**
2. Submit the form with valid data → you should receive an email at `CONTACT_TO`
3. Submit with an empty field → field-level error appears in Portuguese
4. To test the 5xx banner: stop the backend and submit the form → the retry banner appears

### Running tests

```bash
# Backend unit + integration tests
cd backend && go test ./...

# Frontend type-check + build
cd frontend && npm run build
```
