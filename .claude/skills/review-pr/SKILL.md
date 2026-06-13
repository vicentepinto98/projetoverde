---
name: review-pr
description: Review an open pull request against project standards and task acceptance criteria, then post the review as comments directly on the GitHub PR. Use after a PR is created. Triggers like "review PR #42", "review the PR", or automatically after PR creation by implement-stories.
model: sonnet
---

Review pull request $ARGUMENTS against project standards, skill rules, and task acceptance criteria. Act as a **Senior Reviewer** — verify correctness, compliance, and completeness. Post all findings as GitHub PR review comments. Follow this process strictly.

## Input
- If $ARGUMENTS is a PR number (e.g. "42" or "#42"), use `gh pr view <number>`
- If $ARGUMENTS is a URL, extract the PR number
- If $ARGUMENTS is empty, use `gh pr list` to show open PRs and ask the user which one to review

## Step 1: Gather Context

1. Read the PR metadata: `gh pr view <number> --json title,body,headRefName,baseRefName,files`
2. Read the PR diff: `gh pr diff <number>`
3. Identify which tasks from TASKS.md this PR implements (look for T-XX references in PR body or commits)
4. Load the acceptance criteria for those tasks from TASKS.md (if it exists)
5. Load all applicable SKILL.md files (backend, frontend, etc.) based on changed files

## Step 2: Compliance Check

Verify the changes against:

### Project Rules (CLAUDE.md)
- No forbidden patterns or dependencies
- KISS/YAGNI — no unnecessary complexity
- Conventional commits followed

### Skill Rules (based on changed files)
- Go/Chi backend rules (`go-backend` SKILL): layout, handler structure, error handling, testing
- Frontend rules (`frontend-design` SKILL): functional components, Tailwind only, no inline styles

### Task Acceptance Criteria
- Every acceptance criterion from TASKS.md for the referenced tasks is met (if TASKS.md exists)
- No scope creep — changes stay within what the task specifies
- Tests exist where required

### Code Quality
- No security vulnerabilities (OWASP top 10)
- No leaked secrets or hardcoded credentials
- Proper error handling at system boundaries
- No backwards-compatibility hacks unless explicitly required

## Step 3: Build Verification

Check CI status: `gh pr checks <number>`

If CI is still running, wait up to 60 seconds then check again. If CI fails, report it as a blocking issue.

## Step 4: Post Review on GitHub

All feedback goes directly onto the PR as a GitHub review — never just print it to the terminal.

### File-level inline comments
For each issue tied to a specific file and line, post an inline comment using the GitHub review API:

```bash
gh api repos/vicentepinto98/projetoverde/pulls/<number>/reviews \
  --method POST \
  --field commit_id="$(gh pr view <number> --json headRefOid -q .headRefOid)" \
  --field body="## Review" \
  --field event="REQUEST_CHANGES" \
  --field "comments[][path]"="<file>" \
  --field "comments[][position]"=<diff-position> \
  --field "comments[][body]"="**[blocking]** <description>"
```

For multiple inline comments, include multiple `comments[]` entries in one API call.

To find the correct `position` (1-indexed line within the unified diff hunk), count lines from the first `@@` hunk header in `gh pr diff <number>` output.

### Approve (no blocking issues)
```bash
gh pr review <number> --approve --body "$(cat <<'EOF'
## Review: Approved ✓

All checks passed. Acceptance criteria met, project rules followed.

### Suggestions (non-blocking)
- <file:line> — <optional improvement, or omit section if none>
EOF
)"
```

### Request Changes (blocking issues found)
```bash
gh pr review <number> --request-changes --body "$(cat <<'EOF'
## Review: Changes Requested

### Blocking Issues
- **<file:line>** — <description and why it matters>

### Suggestions (non-blocking)
- <file:line> — <optional improvement>

### Checklist
- [ ] <specific fix needed>
EOF
)"
```

## Step 5: Auto-Merge (only when invoked by implement-stories)

If approved AND all CI checks pass AND this review was triggered automatically by implement-stories (not a manual user request):
```bash
gh pr merge <number> --rebase --delete-branch
```

Never auto-merge on a manual `/review-pr` invocation — leave the merge decision to the user.

## Step 6: Report to User

Summarize in one short paragraph:
- PR number and title
- Decision (approved / changes requested)
- Blocking issue count (if any)
- Link to the PR review on GitHub

## Review Cycle

After posting a "Request Changes" review, the original author (or `implement-stories`) must address the comments and push fixes. When they do, re-run `/review-pr {number}` to re-review.

**Round tracking:** Check the PR's review history to determine the current round:
```bash
gh pr reviews <number> --json state,submittedAt | jq 'length'
```

- **Round 1–3**: reviewer posts feedback → author fixes → reviewer re-reviews
- **Round 4+**: do NOT re-review. Post this comment and stop:

```bash
gh pr comment <number> --body "$(cat <<'EOF'
## Human Intervention Required

This PR has gone through 3 review rounds without reaching approval. The outstanding issues need human judgement to resolve.

**Please review the open comments and decide how to proceed.**
EOF
)"
```

## Rules
- Never approve a PR with failing CI checks
- Never approve if acceptance criteria from STORIES file are not met (when STORIES file exists)
- Always post feedback on GitHub — do not only print it in the terminal
- Be specific: reference exact file paths and line numbers in comments
- Distinguish blocking issues from suggestions
- PRs must reference a story — flag any PR without a story reference as non-compliant
- If implement-stories created the PR and review-pr reviews it, note this in the review body
