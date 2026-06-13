package handlers

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/smtp"

	"github.com/vicentepinto98/projetoverde/internal/config"
	"github.com/vicentepinto98/projetoverde/internal/models"
)

func Contact(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")

		var req models.ContactRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]string{"error": "invalid request body"})
			return
		}

		if errs := req.Validate(); errs != nil {
			w.WriteHeader(http.StatusBadRequest)
			json.NewEncoder(w).Encode(map[string]any{"errors": errs})
			return
		}

		if err := sendEmail(cfg, req); err != nil {
			w.WriteHeader(http.StatusInternalServerError)
			json.NewEncoder(w).Encode(map[string]string{"error": "failed to send message"})
			return
		}

		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	}
}

func sendEmail(cfg config.Config, req models.ContactRequest) error {
	addr := cfg.SMTPHost + ":" + cfg.SMTPPort
	auth := smtp.PlainAuth("", cfg.SMTPUser, cfg.SMTPPass, cfg.SMTPHost)
	body := fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nSubject: Contacto via Projeto Verde — %s\r\n\r\n%s\r\n\r\n---\r\nEnviado por: %s",
		cfg.SMTPUser, cfg.ContactTo, req.Name, req.Message, req.Email,
	)
	return smtp.SendMail(addr, auth, cfg.SMTPUser, []string{cfg.ContactTo}, []byte(body))
}
