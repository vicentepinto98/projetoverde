---
name: refine-story
description: Read comments on a GitHub story issue and update the story description in the STORIES file accordingly. Only applies to stories that have not yet been executed (status [ ]). Use when the user says "refine story S-02", "update story from comments", or "check comments on #6".
model: sonnet
---

Sync the story description in the STORIES file with feedback left in GitHub issue comments. Act as a **careful editor** — incorporate only confirmed changes, never invent requirements. Follow this process strictly.

## Input
- If $ARGUMENTS is a story ID (e.g. "S-02" or "E1 S-02"), locate the issue number from the STORIES file heading: `## S-{nn}: Title [ ] (#NN)`
- If $ARGUMENTS is an issue number (e.g. "#6" or "6"), use it directly
- If $ARGUMENTS is empty, ask which story to sync

## Step 1: Guard — only sync unexecuted stories

Read the story's status from the STORIES file heading:
- `[ ]` planned → proceed
- `[~]` in progress → **stop**. Tell the user: "S-{nn} is already in progress. Sync is only allowed before execution starts to avoid mid-implementation scope drift."
- `[x]` done → **stop**. Tell the user: "S-{nn} is already done."
- `[!]` blocked → **stop**. Tell the user: "S-{nn} is blocked. Resolve the blocker first."

## Step 2: Fetch issue and comments

```bash
# Get issue body
gh issue view {issue-number} -R vicentepinto98/projetoverde --json title,body,comments
```

Read:
- The current issue body
- All comments in chronological order
- Note the author of each comment (owner comments carry more weight)

## Step 3: Extract actionable changes

Go through each comment and identify:
- **Requirement changes**: new or modified acceptance criteria
- **Scope changes**: things added to or removed from the story
- **Clarifications**: details that resolve ambiguity in the current description
- **Priority or effort changes**: explicit statements like "this is actually 1d not 4h"
- **Dependency changes**: new or removed prerequisite stories

Ignore: reactions, thank-you messages, status updates, and anything that doesn't change the story's scope or acceptance criteria.

If comments conflict with each other, flag the conflict to the user and ask how to resolve — do not pick a side silently.

## Step 4: Summarise proposed changes

Before editing any file, present the proposed changes to the user as a diff-style summary:

```
Proposed changes to S-{nn}:

+ Add AC: "When the user submits the form with a phone number field left empty..."
~ Update effort: 4h → 6h (comment from vicentepinto98: "SMTP setup will take longer")
- Remove AC: "..." (comment from vicentepinto98: "decided to drop this requirement")
```

Ask for confirmation before proceeding: "Apply these changes to `docs/epics/E{n}-STORIES.md`?"

## Step 5: Update the STORIES file

Apply only the confirmed changes to `docs/epics/E{n}-STORIES.md`:
- Edit the relevant story section
- Preserve all existing formatting and structure
- Keep acceptance criteria as full sentences (never X → Y shorthand)
- Update `**Effort:**` and `**Depends on:**` fields if changed
- Do not touch any other story in the file

## Step 6: Update the GitHub issue body

Reflect the same changes in the GitHub issue body so it stays in sync with the STORIES file:

```bash
gh issue edit {issue-number} -R vicentepinto98/projetoverde --body "$(cat <<'EOF'
{updated issue body}
EOF
)"
```

## Step 7: Commit & Push

```bash
git add docs/epics/E{n}-STORIES.md
git commit -m "chore(docs): sync S-{nn} from issue comments (#issue-number)"
git push
```

## Step 8: Report

Tell the user what changed, what was skipped, and whether any conflicts need their attention.

## Rules
- Never sync a story that is `[~]`, `[x]`, or `[!]`
- Never apply changes that weren't explicitly stated in a comment — no inference or interpretation of intent
- Always ask for confirmation before editing the file
- Acceptance criteria must always be written as full sentences — never revert to X → Y format
- If the only comments are reactions or status updates (no content changes), tell the user: "No actionable changes found in the comments."
