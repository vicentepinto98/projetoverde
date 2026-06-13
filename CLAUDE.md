# Projeto Verde — Claude Code Guide

## Project

Website for **Projeto Verde**, a forest school based in Portugal. The site showcases the school's philosophy, activities, team, gallery, and contact information. It should be visually modern, warm, and nature-inspired.

- **Instagram**: https://www.instagram.com/projetooverde/
- **GitHub repo**: https://github.com/vicentepinto98/projetoverde
- **Owner**: vicentepinto98 (Vicente Pinto)

## Tech Stack

| Layer | Tech |
|---|---|
| Backend | Go (net/http or Chi router) |
| Frontend | React + TypeScript + Vite |
| Styling | Tailwind CSS |
| CI/CD | GitHub Actions |
| Deployment | To be decided (target: free, public) |

## Repo Structure

```
projetoverde/
├── backend/         # Go HTTP server — API, static file serving
│   ├── cmd/server/  # main.go entrypoint
│   ├── internal/    # handlers, models, config
│   └── go.mod
├── frontend/        # React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── assets/
│   ├── public/
│   └── package.json
├── .github/
│   └── workflows/   # CI/CD pipelines
├── .claude/         # Claude Code project config
└── CLAUDE.md
```

## Development Workflow

1. **Plan** — Claude writes epics and features as GitHub Issues
2. **Branch** — feature branches off `main`, named `feat/<slug>`
3. **Implement** — Claude codes the feature
4. **Review** — `/code-review` skill runs before any PR
5. **Test** — unit + integration tests required for all backend handlers
6. **PR** — Claude opens a PR; human approves and merges

## Key Conventions

- Backend: standard Go project layout, no frameworks beyond a lightweight router
- Frontend: functional components only, no class components
- CSS: Tailwind utility classes; no inline styles
- Commits: conventional commits (`feat:`, `fix:`, `chore:`, etc.)
- All PRs must pass CI before merge

## Running Locally

```bash
# Backend
cd backend && go run ./cmd/server

# Frontend
cd frontend && npm install && npm run dev
```

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `GH_TOKEN` | ~/.claude/settings.json | GitHub CLI auth for Claude |
| `PORT` | backend/.env | HTTP server port (default 8080) |
