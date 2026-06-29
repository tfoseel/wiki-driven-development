---
id: flows/example-flow
type: flow
title: Example Flow
summary: Multi-page user journey and handoff contract.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - pages/example-page
  - pages/other-page
  - actions/example-action
implemented_by:
  - pilot/app/tests/e2e/example-flow.spec.ts
verified_by:
  - pilot/app/tests/e2e/example-flow.spec.ts
artifacts:
  - pilot/app/tests/e2e/example-flow.spec.ts
verify:
  - npm run e2e -- example-flow
---
# Example Flow

## Intent
Describe the user journey from start to completion.

## Steps
1. Start at [[pages/example-page]].
2. Perform [[actions/example-action]].
3. Arrive at [[pages/other-page]].

## Handoff Contract

| From | To | Data | Assertion |
|---|---|---|---|
| [[pages/example-page]] | [[pages/other-page]] | `exampleId` | Destination can load the same object |

## Flow QA
- given happy path / when the journey is completed / then final state is visible
- given missing handoff data / when destination loads / then recoverable error is shown
