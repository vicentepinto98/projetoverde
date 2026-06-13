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

1. **Define** — `/define-epic` writes epic with goal, requirements, test cases, ADRs, and API/UX design
2. **Plan** — `/plan-epic` breaks the epic into stories with priority, effort, and acceptance criteria
3. **Implement** — `/implement-stories` implements each story on a feature branch (`feat/E{n}-S{nn}-{slug}`)
4. **PR** — one PR per story (or per self-contained part of a story), opened via `gh pr create`
5. **Review** — `/review-pr <number>` posts inline comments directly on the GitHub PR
6. **Iterate** — author addresses comments and pushes fixes; reviewer re-reviews (max 3 rounds, then human steps in)
7. **Merge** — human approves and merges once review passes

A PR must always reference a story. A story must always belong to an epic.

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

## GitHub Project Integration

| Variable | Value |
|---|---|
| Repository: | `vicentepinto98/projetoverde` |
| Project URL: | https://github.com/users/vicentepinto98/projects/1 |
| Project ID: | `PVT_kwHOA17tsM4BakYF` |
| Status field ID: | `PVTSSF_lAHOA17tsM4BakYFzhVbDeg` |

Status options:

| Status | Option ID |
|---|---|
| `STATUS_BACKLOG` | `f75ad846` (Todo) |
| `STATUS_IN_PROGRESS` | `47fc9ee4` (In Progress) |
| `STATUS_DONE` | `98236657` (Done) |

## Environment Variables

| Variable | Where | Purpose |
|---|---|---|
| `GH_TOKEN` | ~/.claude/settings.json | GitHub CLI auth for Claude |
| `PORT` | backend/.env | HTTP server port (default 8080) |
