package main

import (
	"bufio"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/vicentepinto98/projetoverde/internal/config"
	"github.com/vicentepinto98/projetoverde/internal/handlers"
	"github.com/vicentepinto98/projetoverde/internal/middleware"
)

// loadDotEnv reads KEY=VALUE pairs from path into the process environment.
// Missing file is silently ignored — production uses real env vars.
func loadDotEnv(path string) {
	f, err := os.Open(path)
	if err != nil {
		return
	}
	defer f.Close()
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		line := strings.TrimSpace(scanner.Text())
		if line == "" || strings.HasPrefix(line, "#") {
			continue
		}
		key, val, ok := strings.Cut(line, "=")
		if !ok {
			continue
		}
		os.Setenv(strings.TrimSpace(key), strings.TrimSpace(val))
	}
}

func main() {
	loadDotEnv(".env")
	cfg := config.Load()

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/health", handlers.Health)
	mux.HandleFunc("POST /api/contact", handlers.Contact(cfg))

	handler := middleware.Logging(middleware.Recovery(mux))

	log.Printf("server listening on :%s", cfg.Port)
	if err := http.ListenAndServe(":"+cfg.Port, handler); err != nil {
		log.Fatal(err)
	}
}
