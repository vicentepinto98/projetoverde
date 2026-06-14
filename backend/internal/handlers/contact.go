package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"net/smtp"
	"strings"

	"github.com/vicentepinto98/projetoverde/internal/config"
	"github.com/vicentepinto98/projetoverde/internal/models"
)

func Contact(cfg config.Config) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		defer r.Body.Close()

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
	if err := smtp.SendMail(addr, auth, cfg.SMTPUser, []string{cfg.ContactTo}, buildMessage(cfg, req)); err != nil {
		log.Printf("smtp: %v", err)
		return err
	}
	return nil
}

// buildMessage assembles the RFC 822 message delivered to the school.
// Reply-To is set to the submitter's address so the school can reply directly,
// and the name/email are repeated in the body for visibility and record.
func buildMessage(cfg config.Config, req models.ContactRequest) []byte {
	name := sanitizeHeader(req.Name)
	email := sanitizeHeader(req.Email)
	return []byte(fmt.Sprintf(
		"From: %s\r\nTo: %s\r\nReply-To: %s\r\nSubject: Contacto via site — %s\r\n\r\n"+
			"Nome: %s\r\nEmail: %s\r\n\r\n%s\r\n",
		cfg.SMTPUser, cfg.ContactTo, email, name, name, email, req.Message,
	))
}

// sanitizeHeader strips CR and LF so user-supplied values cannot inject
// additional email headers (header injection) when placed in a header line.
func sanitizeHeader(s string) string {
	return strings.NewReplacer("\r", "", "\n", "").Replace(s)
}
