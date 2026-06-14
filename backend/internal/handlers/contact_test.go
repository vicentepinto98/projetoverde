package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/vicentepinto98/projetoverde/internal/config"
	"github.com/vicentepinto98/projetoverde/internal/models"
)

func TestContact_Validation(t *testing.T) {
	cfg := config.Config{SMTPHost: "localhost", SMTPPort: "25", SMTPUser: "u", SMTPPass: "p", ContactTo: "to@example.com"}
	handler := Contact(cfg)

	tests := []struct {
		name       string
		body       map[string]string
		wantStatus int
		wantErrKey string
	}{
		{
			name:       "empty name",
			body:       map[string]string{"name": "", "email": "a@b.com", "message": "hi"},
			wantStatus: http.StatusBadRequest,
			wantErrKey: "name",
		},
		{
			name:       "invalid email",
			body:       map[string]string{"name": "Ana", "email": "notvalid", "message": "hi"},
			wantStatus: http.StatusBadRequest,
			wantErrKey: "email",
		},
		{
			name:       "empty message",
			body:       map[string]string{"name": "Ana", "email": "a@b.com", "message": ""},
			wantStatus: http.StatusBadRequest,
			wantErrKey: "message",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			b, _ := json.Marshal(tt.body)
			req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewReader(b))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()

			handler(w, req)

			if w.Code != tt.wantStatus {
				t.Fatalf("status = %d, want %d", w.Code, tt.wantStatus)
			}
			if w.Header().Get("Content-Type") != "application/json" {
				t.Errorf("Content-Type = %q, want application/json", w.Header().Get("Content-Type"))
			}
			var resp map[string]map[string]string
			json.NewDecoder(w.Body).Decode(&resp)
			if _, ok := resp["errors"][tt.wantErrKey]; !ok {
				t.Errorf("expected errors[%q] in response: %v", tt.wantErrKey, resp)
			}
		})
	}
}

func TestBuildMessage(t *testing.T) {
	cfg := config.Config{SMTPUser: "site@example.com", ContactTo: "school@example.com"}
	req := models.ContactRequest{Name: "Ana Silva", Email: "ana@parent.com", Message: "Olá,\nquero inscrever a minha filha."}

	msg := string(buildMessage(cfg, req))

	if !strings.Contains(msg, "Reply-To: ana@parent.com\r\n") {
		t.Errorf("missing Reply-To header for submitter:\n%s", msg)
	}
	if !strings.Contains(msg, "Nome: Ana Silva") {
		t.Errorf("body should contain sender name:\n%s", msg)
	}
	if !strings.Contains(msg, "Email: ana@parent.com") {
		t.Errorf("body should contain sender email:\n%s", msg)
	}
	if !strings.Contains(msg, "quero inscrever a minha filha.") {
		t.Errorf("body should contain the message:\n%s", msg)
	}
}

func TestBuildMessage_HeaderInjection(t *testing.T) {
	cfg := config.Config{SMTPUser: "site@example.com", ContactTo: "school@example.com"}
	// Attacker tries to smuggle a Bcc header through the name field.
	req := models.ContactRequest{
		Name:    "Eve\r\nBcc: victim@example.com",
		Email:   "eve@evil.com",
		Message: "hi",
	}

	msg := string(buildMessage(cfg, req))

	// The injected text may survive as harmless inline content, but it must
	// never appear as its own header line (i.e. preceded by a CRLF).
	if strings.Contains(msg, "\r\nBcc:") {
		t.Errorf("CRLF injection not sanitized — Bcc leaked as a header line:\n%s", msg)
	}
	// The Subject must remain a single header line.
	if strings.Count(msg, "Subject:") != 1 {
		t.Errorf("expected exactly one Subject header:\n%s", msg)
	}
}

func TestContact_InvalidBody(t *testing.T) {
	cfg := config.Config{}
	handler := Contact(cfg)

	req := httptest.NewRequest(http.MethodPost, "/api/contact", bytes.NewBufferString("not-json"))
	w := httptest.NewRecorder()
	handler(w, req)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", w.Code, http.StatusBadRequest)
	}
}
