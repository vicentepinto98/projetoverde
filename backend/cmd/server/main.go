package main

import (
	"log"
	"net/http"

	"github.com/vicentepinto98/projetoverde/internal/config"
	"github.com/vicentepinto98/projetoverde/internal/handlers"
	"github.com/vicentepinto98/projetoverde/internal/middleware"
)

func main() {
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
