package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/vicentepinto98/projetoverde/internal/config"
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
