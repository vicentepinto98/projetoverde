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

## Step 0: Reviewer identity (GitHub App)

Post the review under the project's GitHub App so it is attributed to the bot, not your personal account. Run this first — it mints an installation token when the App is configured, and silently falls back to your `gh` auth when it is not:

```bash
APP_TOKEN=$(.claude/scripts/gh-app-token.sh)
if [[ -n "$APP_TOKEN" ]]; then
  export GH_TOKEN="$APP_TOKEN"   # every gh / gh api call below now acts as the App
  REVIEW_AS_APP=1
else
  REVIEW_AS_APP=0                # App not set up yet — review as your own user
fi
```

When `REVIEW_AS_APP=1`, the reviewer is the App and is therefore never the PR author, so real `APPROVE` / `REQUEST_CHANGES` events always work.

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

Every review body and every inline comment must start with the prefix `🤖 **Claude review:**` so it is clearly attributed as AI-generated, since the comment will appear under the repository owner's GitHub account.

### Determine review event
- If `REVIEW_AS_APP=1` (Step 0): the App is the reviewer and is never the PR author — always use `event="APPROVE"` or `event="REQUEST_CHANGES"` as appropriate.
- Otherwise (reviewing as your own user): GitHub does not allow `REQUEST_CHANGES` on a PR where the reviewer is also the PR author. Check:

  ```bash
  PR_AUTHOR=$(gh pr view <number> -R vicentepinto98/projetoverde --json author -q .author.login)
  REVIEWER=$(gh api user -q .login)
  ```

  - If `PR_AUTHOR == REVIEWER`: use `event="COMMENT"` for all reviews (approve and request-changes alike)
  - Otherwise: use `event="APPROVE"` or `event="REQUEST_CHANGES"` as appropriate

### File-level inline comments
For each issue tied to a specific file and line, post an inline comment using the GitHub review API:

```bash
gh api repos/vicentepinto98/projetoverde/pulls/<number>/reviews \
  --method POST \
  --field commit_id="$(gh pr view <number> --json headRefOid -q .headRefOid)" \
  --field body="🤖 **Claude review:**

## Review" \
  --field event="<COMMENT|REQUEST_CHANGES>" \
  --field "comments[][path]"="<file>" \
  --field "comments[][position]"=<diff-position> \
  --field "comments[][body]"="🤖 **Claude review:** **[blocking]** <description>"
```

For multiple inline comments, include multiple `comments[]` entries in one API call.

To find the correct `position` (1-indexed line within the unified diff hunk), count lines from the first `@@` hunk header in `gh pr diff <number>` output.

### Approve (no blocking issues)
```bash
gh pr review <number> --approve --body "$(cat <<'EOF'
🤖 **Claude review:** Approved ✓

All checks passed. Acceptance criteria met, project rules followed.

### Suggestions (non-blocking)
- <file:line> — <optional improvement, or omit section if none>
EOF
)"
```

### Request Changes (blocking issues found)
```bash
gh pr review <number> --request-changes --body "$(cat <<'EOF'
🤖 **Claude review:** Changes Requested

### Blocking Issues
- **<file:line>** — <description and why it matters>

### Suggestions (non-blocking)
- <file:line> — <optional improvement>

### Checklist
- [ ] <specific fix needed>
EOF
)"
```

## Step 5: Auto-trigger next skill

### If changes were requested
Immediately invoke the `fix-pr-comments` skill on the same PR number — do not wait for a human. The fix-pr-comments skill will address the blocking issues, push, and then re-invoke `review-pr` automatically, continuing the cycle.

### If approved
Check whether all review threads are resolved before merging:

```bash
gh api graphql -f query='
{
  repository(owner: "vicentepinto98", name: "projetoverde") {
    pullRequest(number: <number>) {
      reviewThreads(first: 100) {
        nodes { isResolved }
      }
    }
  }
}' --jq '[.data.repository.pullRequest.reviewThreads.nodes[] | select(.isResolved == false)] | length'
```

- **Result is 0** (all threads resolved) → merge immediately:
  ```bash
  gh pr merge <number> -R vicentepinto98/projetoverde --squash --delete-branch
  ```
  Squash is used because a repository ruleset blocks rebase merges; it also keeps one conventional commit per story on `main`. Then checkout main, pull, mark the story `[x]` in the STORIES file, and commit.

- **Result > 0** (open threads remain) → do NOT merge. Report to the user:
  > "PR #<number> is approved but has N unresolved conversation(s). Resolve them before merging."

## Step 6: Report to User

Summarize in one short paragraph:
- PR number and title
- Decision (approved / changes requested)
- Blocking issue count (if any)
- Link to the PR review on GitHub

## Review Cycle

The cycle runs automatically:
1. `review-pr` posts feedback → immediately invokes `fix-pr-comments`
2. `fix-pr-comments` pushes fixes → immediately invokes `review-pr`
3. Repeat until approved or round limit reached

**Round tracking:** Count only reviews with non-empty bodies — GitHub creates empty reviews when commits are pushed to a PR (marking prior reviews outdated):
```bash
gh api repos/vicentepinto98/projetoverde/pulls/<number>/reviews \
  --jq '[.[] | select(.body != "")] | length'
```

- **Round 1–3**: `review-pr` posts → `fix-pr-comments` fixes → `review-pr` re-reviews (automatic)
- **Round 4+**: do NOT invoke `fix-pr-comments`. Post this comment and stop — human intervention required:

```bash
gh pr comment <number> --body "$(cat <<'EOF'
🤖 **Claude review:** Human Intervention Required

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
