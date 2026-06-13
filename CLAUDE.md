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
| `GH_APP_ID` | ~/.claude/settings.json | GitHub App ID (PR reviewer bot) |
| `GH_APP_INSTALLATION_ID` | ~/.claude/settings.json | App installation ID for this repo |
| `GH_APP_PRIVATE_KEY_PATH` | ~/.claude/settings.json | Path to the App's `.pem` key (outside the repo) |

## GitHub App (PR reviewer identity)

PR reviews are posted under a dedicated GitHub App (`projeto-verde-bot[bot]`) instead of the owner's personal account, so review feedback has a distinct, clearly-automated identity. Because the App is a separate identity from the PR author, real `APPROVE` / `REQUEST_CHANGES` events work (a user cannot request changes on their own PR).

- The three `GH_APP_*` env vars above configure it. They live in the **private** `~/.claude/settings.json`, never in committed project settings.
- The `.pem` private key is stored **outside the repo** (e.g. `~/.claude/projetoverde-app.pem`) and is gitignored as a safety net.
- [.claude/scripts/gh-app-token.sh](.claude/scripts/gh-app-token.sh) mints a short-lived installation token on demand. If the App is not configured, it prints nothing and the review skills fall back to `GH_TOKEN` (your user account), so the workflow keeps working either way.
- App repository permissions: **Pull requests** R/W, **Contents** R/W (merge + delete branch), **Checks** R, **Commit statuses** R, **Metadata** R.
