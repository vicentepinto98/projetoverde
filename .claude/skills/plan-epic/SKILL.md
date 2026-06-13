---
name: plan-epic
description: Break down an epic from ROADMAP.md into actionable, well-specified stories. Use when the user asks to plan an epic, break down stories, or says things like "plan E2", "break E2 into stories".
model: opus
---

Break down epic $ARGUMENTS from ROADMAP.md into stories. Act as a **Tech Lead** — translate product goals into implementable, well-specified stories. Follow this process strictly.

Always follow the rules given by `.claude/skills/backend/SKILL.md` and `.claude/skills/frontend-design/SKILL.md`.

## Terminology
- **Epic**: a large feature defined in ROADMAP.md and `docs/epics/E{n}-STORIES.md`
- **Story**: a self-contained unit of work within an epic, implementable in one PR
- Stories must belong to an epic — standalone stories are not allowed

## Input
- Read the target epic from `ROADMAP.md` — understand goals, requirements, test cases, ADRs, and scope bullets
- If $ARGUMENTS is empty, ask which epic to plan

## Step 1: Codebase Analysis
Use an Explore agent to analyze the current codebase:
- Find all files affected by the epic (exact paths, current state)
- Identify existing patterns, conventions, and test structure
- Note what already exists vs. what needs to be created

## Step 2: Skill Compliance Check
Read all applicable SKILL.md files and check for conflicts with planned stories. Present conflicts to the user — do not resolve silently.

## Step 3: Story Breakdown
For each story, specify all of the following:

```markdown
## S-{nn}: {Short Title} [ ]

**Epic:** E{n} (#{epic-issue-number})
**Priority:** MUST | SHOULD | COULD
**Effort:** {e.g. 4h, 6h, 1d, 1d4h, 2d}
**Depends on:** S-{nn} (#{issue-number}) | none

### Details
{One-paragraph description of what this story delivers and why it matters. Written from the user's perspective.}

### Implementation Details
{Technical approach — only include if non-trivial. Describe files to create/modify, patterns to follow, APIs to call. Omit this section for straightforward CRUD or config changes.}

### Acceptance Criteria
- [ ] {Full sentence describing the condition, the action, and the expected outcome. Example: "When the user submits the form with all fields filled in correctly, the API returns a 200 response with `{"ok": true}` and an email is delivered to the school inbox."}
- [ ] {Another full-sentence criterion.}

### Test Cases Covered
{Reference TC-XX from the epic's test cases that this story contributes to.}
```

**Priority guide:**
- **MUST**: story is required for the epic to be considered done
- **SHOULD**: story adds significant value but epic ships without it if time-constrained
- **COULD**: nice-to-have; implement only after all MUST and SHOULD stories are done

**Effort guide:** 4h, 6h, 1d (8h), 1d4h (12h), 2d (16h), etc.

**Acceptance criteria rules:**
- Write every criterion as a full sentence: subject, action, expected outcome
- Never use the `X → Y` shorthand pattern
- Bad: `Empty name → 422 {"errors": {"name": "required"}}`
- Good: `When the user submits the form with an empty name field, the API returns a 422 response with the body {"errors": {"name": "required"}}.`

**Dependency rules:**
- Always link the prerequisite story by GitHub issue number: `**Depends on:** S-01 (#5)`
- If a story has no prerequisite, write `**Depends on:** none` explicitly

## Step 4: Coverage Check
After drafting, verify completeness:
- Every goal/scope bullet has at least one story (or is marked out of scope with reason)
- Every test case (TC-XX) from the epic is covered by at least one story
- Failure paths covered?
- Cross-cutting concerns: auth, validation, error handling addressed?

Present a brief gap summary to the user even if no gaps found.

## Step 5: Dependency Graph
- Draw ASCII dependency graph; identify critical path and parallelizable stories
- Mark stories `breaking` when they change API contracts or DB schema non-additively

## Step 6: Create GitHub Issues
For each story, include the priority as a label (`priority:MUST`, `priority:SHOULD`, or `priority:COULD`):
```bash
gh issue create -R vicentepinto98/projetoverde \
  --title "E{n} S-{nn}: {short title}" \
  --label "story,priority:{MUST|SHOULD|COULD}" \
  --body "$(cat <<'EOF'
**Epic:** #{epic-issue-number}
**Priority:** {MUST|SHOULD|COULD}
**Effort:** {effort}

## Details
{summary}

## Acceptance Criteria
{full-sentence criteria — no X → Y shorthand}

## Depends on
{S-XX (#issue-number) or "none"}

> Full spec: `docs/epics/E{n}-STORIES.md` — section S-{nn}
EOF
)"
```

After creating all issues, patch dependency references with real issue numbers in both the issue bodies and the STORIES file.

## Step 7: Update STORIES file heading + root index
Update each story heading in the file: `## S-{nn}: Title [ ] (#NN)`

Update `STORIES.md` root index: add one line for the new epic.

## Step 8: Commit & Push
```bash
git add docs/epics/E{n}-STORIES.md STORIES.md
git commit -m "chore(docs): plan E{n} — add stories file and index entry"
git push
```

## Rules
- Every story must be implementable in a single PR
- A story without an epic is not allowed — always include `**Epic:** E{n}`
- Every MUST story must map to at least one TC-XX from the epic
- Ask when multiple valid approaches exist — do not decide silently
- If `gh` commands fail, log and continue — STORIES file is source of truth

## Output Format
- Write stories to `docs/epics/E{n}-STORIES.md`
- Status markers: `[ ]` planned · `[~]` in progress · `[x]` done · `[!]` blocked
- Update `STORIES.md` root index: add one line for the new epic
- Report created issue URLs to the user
