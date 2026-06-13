package models

import "net/mail"

type ContactRequest struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Message string `json:"message"`
}

type ValidationErrors map[string]string

func (r ContactRequest) Validate() ValidationErrors {
	errs := make(ValidationErrors)
	if r.Name == "" {
		errs["name"] = "required"
	}
	if r.Email == "" {
		errs["email"] = "required"
	} else if _, err := mail.ParseAddress(r.Email); err != nil {
		errs["email"] = "invalid format"
	}
	if r.Message == "" {
		errs["message"] = "required"
	}
	if len(errs) == 0 {
		return nil
	}
	return errs
}
