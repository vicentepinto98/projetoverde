#!/usr/bin/env bash
# Move a story's status on the GitHub Project board.
#
#   Usage: set-board-status.sh <issue-number> <todo|in-progress|done>
#
# Runs as your `gh` user, which must have project scope. Do NOT call this with
# the GitHub App installation token — the App has repository permissions only and
# cannot edit the user-owned project board.
set -euo pipefail

ISSUE="${1:?usage: set-board-status.sh <issue-number> <todo|in-progress|done>}"
STATUS="${2:?usage: set-board-status.sh <issue-number> <todo|in-progress|done>}"

if ! [[ "$ISSUE" =~ ^[0-9]+$ ]]; then
  echo "set-board-status: issue must be numeric, got '$ISSUE'" >&2; exit 2
fi

PROJECT_ID="PVT_kwHOA17tsM4BakYF"
FIELD_ID="PVTSSF_lAHOA17tsM4BakYFzhVbDeg"

case "$STATUS" in
  todo)        OPTION="f75ad846" ;;
  in-progress) OPTION="47fc9ee4" ;;
  done)        OPTION="98236657" ;;
  *) echo "set-board-status: unknown status '$STATUS' (use todo|in-progress|done)" >&2; exit 2 ;;
esac

ITEM=$(gh api graphql -f query='
{ repository(owner: "vicentepinto98", name: "projetoverde") {
    issue(number: '"$ISSUE"') {
      projectItems(first: 10) { nodes { id project { id } } } } } }' \
  --jq '.data.repository.issue.projectItems.nodes[] | select(.project.id == "'"$PROJECT_ID"'") | .id')

if [[ -z "$ITEM" ]]; then
  echo "set-board-status: issue #$ISSUE is not on project $PROJECT_ID" >&2; exit 1
fi

gh api graphql -f query='
mutation($p: ID!, $i: ID!, $f: ID!, $o: String!) {
  updateProjectV2ItemFieldValue(input: {
    projectId: $p, itemId: $i, fieldId: $f, value: { singleSelectOptionId: $o }
  }) { projectV2Item { id } } }' \
  -f p="$PROJECT_ID" -f i="$ITEM" -f f="$FIELD_ID" -f o="$OPTION" >/dev/null

echo "board: #$ISSUE -> $STATUS"
