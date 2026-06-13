---
name: implement-stories
description: Implement planned stories from a STORIES file. Use when the user asks to implement stories, work through an epic, or says things like "implement E2", "implement S-03", or "work through the stories".
model: sonnet
---

Always follow the rules given by `.claude/skills/backend/SKILL.md` and `.claude/skills/frontend-design/SKILL.md`.

Execute all planned (`[ ]`) stories from the epic's stories file. Follow this process strictly.

## Terminology
- **Story**: a self-contained unit of work belonging to an epic, implemented in one PR
- **Epic**: the parent feature defined in ROADMAP.md

## Stories File Location
Stories are stored per epic in `docs/epics/{EPIC_ID}-STORIES.md` (e.g. `docs/epics/E2-STORIES.md`).
The project-root `STORIES.md` is an index only — do not read stories from it.

## Input
- Determine the epic from $ARGUMENTS (e.g. "E2") or ask if not specified
- Read the STORIES file to identify all stories with status `[ ]` (planned) or `[~]` (in progress)
- **A story whose GitHub issue is closed is already done — skip it.** The STORIES file is never flipped to `[x]` on `main` (a closed issue + board `Done` are the source of truth), so a `[~]` story with a still-open issue is genuinely in progress
- If $ARGUMENTS specifies a story ID (e.g. "S-03"), focus on that story only
- If a story is `[!]` blocked, skip it and note the blocker

## Step 1: Preparation
Before writing any code:
- Read the STORIES file fully — understand priorities, dependencies, effort, and acceptance criteria
- Load all applicable SKILL.md files (`backend`, `frontend-design`, etc.)
- Implement MUST stories first, then SHOULD, then COULD
- Identify which stories are independent and can run in parallel

### Prerequisite check (mandatory — do not skip)
For every story about to be executed, read its `**Depends on:**` field. If it lists one or more issue numbers, verify each is closed:

```bash
gh issue view {issue-number} -R vicentepinto98/projetoverde --json state,title -q '"#\(.number) \(.title): \(.state)"'
```

If any prerequisite issue is still **open**, do NOT execute the story. Report to the user:

> "S-{nn} depends on #{issue-number} ({title}), which is still open. Implement and merge that story first."

Only proceed once all prerequisite issues are **closed**.

- Mark stories you are about to start as `[~]` in the STORIES file and commit immediately

## Step 2: Codebase Analysis
Use an Explore agent to read all files affected by the planned stories:
- Existing implementations that will be modified
- Existing test files that will be updated
- Patterns and conventions used in adjacent code

## Step 3: Conflict Check
Before implementing, verify:
- Do any stories require patterns that SKILL.md files forbid?
- Do stories conflict with rules in `CLAUDE.md`?
- If conflicts exist, **stop and present them to the user** — do not silently resolve them

## Step 4: Implementation

### Git Workflow

Each story gets its own feature branch and PR. A PR may implement a full story or a well-defined part of a story, but:
- **A PR must reference a story** — no PRs without a story ID in the title and body
- **A story must belong to an epic** — the story file must contain `**Epic:** E{n}`
- Never commit directly to `main` — always branch and PR

#### Per-Story Workflow
1. Create branch: `git checkout -b feat/E{n}-S{nn}-{slug}`
2. Mark story as `[~]` in the STORIES file on the feature branch and commit immediately, then move the board status to **In Progress**:
   ```bash
   .claude/scripts/set-board-status.sh {story-issue-number} in-progress
   ```
3. Implement the story (TDD where specified: failing test → implementation → pass)
4. Commit with conventional format (see Commit Rules below)
5. Push: `git push -u origin feat/E{n}-S{nn}-{slug}`
6. Open PR: `gh pr create` (see PR Rules below)

**Status lifecycle:**
- `[ ]` → `[~]` when implementation starts. This is committed **on the feature branch**, so the `[~]` reaches `main` inside the story's own PR.
- `[~]` stays through PR creation, review, and any fix rounds.
- **Completion is not marked by flipping `[x]` on `main`.** The ruleset makes `main` PR-only and the feature branch is deleted at merge, so there is nothing left to push to. Two things at merge record "done", and together they are the source of truth:
  1. The PR body's `Closes #{story-issue-number}` auto-closes the story issue when the squash-merge lands.
  2. After confirming the merge, set the board to **Done**:
     ```bash
     gh pr view {number} -R vicentepinto98/projetoverde --json state,mergedAt -q '{state,mergedAt}'
     # if state == MERGED:
     .claude/scripts/set-board-status.sh {story-issue-number} done
     ```
  Leave the STORIES file showing `[~]` on `main` — do **not** open a separate PR just to flip `[x]`.

> Board status (`set-board-status.sh`) runs as your `gh` user — never the App token. The script reads the project/field/option IDs from CLAUDE.md's GitHub Project Integration table.

#### Parallel Stories (no mutual file dependencies)
1. Create a worktree per story: `git worktree add .claude/worktrees/S{nn} -b feat/E{n}-S{nn}-{slug}`
2. Each subagent works in its own worktree — no shared file modifications
3. Each story gets its own PR
4. Clean up worktree after PR is opened: `git worktree remove .claude/worktrees/S{nn}`

### TDD Order
Stories with TDD requirement: (1) failing test → (2) implementation → (3) all tests pass → PR

## Step 5: Opening a PR

Every PR must:
- Reference the story it implements
- Include the story's acceptance criteria in the PR body
- Have a descriptive title: `feat(E{n} S-{nn}): {short description}`

```bash
gh pr create \
  --title "feat(E{n} S-{nn}): {short description}" \
  --body "$(cat <<'EOF'
## Story
Implements **E{n} S-{nn}: {story title}** (#{story-issue-number})
Epic: #{epic-issue-number}

## What changed
{1-3 bullet points}

## Acceptance Criteria
- [ ] {criterion from STORIES file}
- [ ] {criterion}

## Test plan
- [ ] {how to verify manually or via tests}
EOF
)"
```

After opening the PR, immediately invoke the `review-pr` skill on the new PR number — do not wait for a human to trigger it. The review posts comments directly on the GitHub PR.

## Step 6: Verification
- Run `npm run build` (frontend) and/or `go build ./...` (backend) — must succeed
- Run tests: `npm test` or `go test ./...`
- Confirm every merged story's issue is **closed** and its board status is **Done**; report any stories still `[ ]` (not started) or `[!]` (blocked)

## Step 7: Roadmap & GitHub Sync
If all stories in an epic are complete:
1. Close the GitHub Milestone if one exists
2. Update ROADMAP.md: replace "Scope" subsections with "Delivered" (past tense, factual)
3. Commit: `chore(docs): close E{n} epic in ROADMAP — convert Scope to Delivered`

## Commit Rules
```
feat|fix|refactor|chore(scope): short description

Body explaining why.

Closes #<story-issue-number>
Epic: #<epic-issue-number>
```
- `scope` = component name (e.g. `contact`, `gallery`, `api`)
- Extract issue numbers from the STORIES file heading: `## S-{nn}: Title [ ] (#NN)`
- Never commit generated files, build artifacts, or `.env` files

## Handling the Usage Limit
1. Ensure each in-flight story is `[~]` on its feature branch (merged stories are already recorded by their closed issue + board `Done`)
2. Commit all in-progress work and push the feature branch
3. Resume with `/implement-stories` — open issues + `[~]` markers allow seamless continuation

## Rules
- Never skip acceptance criteria — if unverifiable, note why
- Never create a PR without a story reference
- Never create a story outside of an epic
- Never silently change scope; ask first
- The **closed GitHub issue + board `Done`** are the source of truth for "done" — not a `[x]` in the STORIES file (which stays `[~]` on `main`)
