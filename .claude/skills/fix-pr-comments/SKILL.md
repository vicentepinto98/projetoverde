---
name: fix-pr-comments
description: Address all open review comments on a PR, push fixes, then automatically re-trigger review-pr. Invoked automatically by review-pr after posting changes-requested feedback. Also triggered manually with "fix PR #42 comments" or "address review on #42".
model: sonnet
---

Address all open review comments on pull request $ARGUMENTS, push the fixes, then immediately invoke `review-pr` on the same PR. Follow this process strictly.

## Input
- If $ARGUMENTS is a PR number (e.g. "42" or "#42"), use it directly
- If $ARGUMENTS is empty, use `gh pr list -R vicentepinto98/projetoverde --state open` and ask which PR to fix

## Step 1: Guard — check round count

Before doing anything, check how many review rounds have already happened:

```bash
gh pr reviews <number> -R vicentepinto98/projetoverde --json state,submittedAt | jq 'length'
```

If the count is **3 or more**, do NOT attempt to fix. Tell the user:

> "PR #<number> has already gone through 3 review rounds. Human intervention is required — see the comment on the PR."

Stop here.

## Step 2: Fetch open review comments

```bash
gh api repos/vicentepinto98/projetoverde/pulls/<number>/comments \
  --jq '[.[] | {id, path, line, body, diff_hunk}]'
```

Also fetch the overall review body:
```bash
gh pr reviews <number> -R vicentepinto98/projetoverde --json body,state \
  | jq '.[-1]'
```

Classify each comment by author:

- **Prefixed with `🤖 **Claude review:** **[blocking]**`** → blocking, must fix
- **Prefixed with `🤖 **Claude review:** **[suggestion]**` or no blocking marker** → suggestion, fix only if trivial and obviously correct
- **Not prefixed with `🤖 **Claude review:**` at all** → assume written by a human reviewer; treat as **blocking regardless of phrasing** and fix it

Human comments carry higher authority than Claude suggestions — never skip or defer a human comment.

## Step 3: Check out the branch

```bash
BRANCH=$(gh pr view <number> -R vicentepinto98/projetoverde --json headRefName -q .headRefName)
git checkout "$BRANCH"
git pull origin "$BRANCH"
```

## Step 4: Fix each blocking issue

For each blocking comment:
- Read the referenced file and line
- Understand the required change from the comment body
- Apply the fix — stay strictly within the scope of what the comment asks for
- Do not refactor surrounding code or fix unrelated issues

If a comment is ambiguous and cannot be safely resolved without guessing, skip it and note it for the user.

## Step 5: Verify fixes

Run the relevant build and test commands for the changed files:
- Go files: `/home/linuxbrew/.linuxbrew/Cellar/go/1.25.6/libexec/bin/go build ./... && go test ./...`
- Frontend files: `cd frontend && npm run build`

If tests fail after the fix, do not push — report the failure to the user.

## Step 6: Commit and push

```bash
git add <changed files>
git commit -m "fix(<scope>): address review comments on PR #<number>

<one line per fix, e.g.:>
- Add defer r.Body.Close() in Contact handler
- Log SMTP errors before returning

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>"

git push origin "$BRANCH"
```

## Step 7: Auto-invoke review-pr

Immediately invoke the `review-pr` skill on the same PR number. Do not wait for a human to trigger it.

## Step 8: Report to user

After pushing (before the review result is back), briefly note:
- Which blocking comments were fixed
- Which suggestions were applied (if any)
- Which comments were skipped and why (if any)

## Rules
- Comments **not** prefixed with `🤖 **Claude review:**` are assumed to be from a human and are always treated as blocking
- Only fix Claude suggestions (`🤖 **Claude review:**` without `**[blocking]**`) when trivial and clearly safe
- Never change scope beyond what the comments ask for — no opportunistic refactoring
- Never push if tests fail after applying fixes
- If the round guard triggers (≥ 3 rounds), stop immediately — do not attempt fixes
- If a comment is ambiguous, skip it and flag it rather than guess
