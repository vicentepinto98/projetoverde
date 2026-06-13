---
name: define-epic
description: Define a new Epic for ROADMAP.md with user story, requirements, test cases, scope, ADRs, and API/UX design. Use when the user wants to create a new epic, define a feature, or says things like "new epic", "define E2", or "I need a feature for...".
model: opus
---

Define a new Epic for ROADMAP.md. Act as the **Product Owner / Architect** — focus on *what* and *why*, not *how*.

## Input
- If $ARGUMENTS contains an epic number or feature description, use it as starting point
- If $ARGUMENTS is empty, ask the user what capability they want to add

**Before proceeding, evaluate and present alternatives:**
- **Simpler approach**: config flag, extra field, or small extension instead of a new concept?
- **Extend existing**: existing endpoint, entity, or flow that could be enhanced?
- **Established pattern**: well-known pattern that achieves the same with less complexity?
- **Defer or reject**: if effort-to-value ratio is low, say so with reasoning

Present alternatives clearly. Only proceed with the confirmed approach.

## Step 1: Context Gathering
- Read `ROADMAP.md` fully — understand existing epics, ADRs, and numbering
- Next epic number: scan for `E{n}:` entries
- Next ADR number: scan for `ADR-XX` entries
- Flag dependency on incomplete predecessors to the user

## Step 2: User Story & Goal
Formulate: **Goal** (one sentence), **Motivation** (one paragraph), **User Story** (As a… I want… So that…).
Present to the user for confirmation before proceeding.

## Step 3: Requirements
Define functional and non-functional requirements:

```markdown
### Functional Requirements
- REQ-01: <specific, verifiable requirement>
- REQ-02: <...>

### Non-Functional Requirements
- Performance: <e.g. page load < 2s>
- Accessibility: <e.g. WCAG 2.1 AA>
- Compatibility: <e.g. modern browsers, mobile-first>
```

Requirements must be concrete and testable — "fast" is not a requirement, "< 2s on a 4G connection" is.

## Step 4: Test Cases
Define high-level test scenarios that cover the epic's goals. These are feature-level scenarios, not unit tests.

```markdown
### Test Cases
- TC-01: <Happy path — describe the expected flow and outcome>
- TC-02: <Edge case — describe the scenario and expected behaviour>
- TC-03: <Error case — describe what happens when something goes wrong>
```

Cover at minimum: happy path, one edge case, one error case. Stories created by `plan-epic` will map to these test cases.

## Step 5: Scope Definition
- **In scope** / **Out of scope** (with brief reason)
- Keep focused — an epic should be achievable in a reasonable sprint

## Step 6: API / UX Design
- Which endpoints are added or changed? (method, path, request/response shape)
- HTTP status codes and error cases?
- If frontend stories included: what views/interactions?

Present API design to the user before finalizing ADRs.

## Step 7: Architecture Decisions (ADRs)
- One ADR per non-trivial design choice — explain decision and rationale
- Only for decisions not obvious from the code
- Note "supersedes ADR-XX" if applicable

## Step 8: Story Outline
Plain scope bullets grouped by component (Backend, Frontend, etc.) — **no `[ ]` markers**. Keep coarse — `plan-epic` will break them into stories.

## Step 9: Create Epic Issue
```bash
gh issue create -R vicentepinto98/projetoverde \
  --title "E{n}: {Short Goal}" \
  --label "epic" \
  --body "$(cat <<'EOF'
## Goal
{One-line goal}

## Motivation
{Motivation paragraph}

## Requirements
{Requirements section}

## Test Cases
{Test cases section}

## Scope
See `docs/epics/E{n}-STORIES.md` for full story breakdown (created by `plan-epic`).
EOF
)"
```

Report the Epic issue URL to the user.

## Output
- Append new epic to `ROADMAP.md` under `## Epics` (create section if needed)
- Structure: Goal, Motivation, Requirements, Test Cases, Architecture Decisions, Scope by component
- Preserve all existing content

## Rules
- Requirements must be concrete and testable — no vague adjectives
- Test cases must cover the happy path AND failure paths
- Every ADR must explain *why*, not just *what*
- No duplicate scope from existing epics unless dependency is explicit
- Keep epic focused on a single coherent goal
- Ask when trade-offs exist — no silent product decisions
- All content in ROADMAP.md must be in English
