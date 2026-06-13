package config

import "os"

type Config struct {
	Port      string
	SMTPHost  string
	SMTPPort  string
	SMTPUser  string
	SMTPPass  string
	ContactTo string
}

func Load() Config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	smtpHost := os.Getenv("SMTP_HOST")
	if smtpHost == "" {
		smtpHost = "smtp.gmail.com"
	}
	smtpPort := os.Getenv("SMTP_PORT")
	if smtpPort == "" {
		smtpPort = "587"
	}
	return Config{
		Port:      port,
		SMTPHost:  smtpHost,
		SMTPPort:  smtpPort,
		SMTPUser:  os.Getenv("SMTP_USER"),
		SMTPPass:  os.Getenv("SMTP_PASS"),
		ContactTo: os.Getenv("CONTACT_TO"),
	}
}
