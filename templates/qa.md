---
id: qa/example-e2e
type: qa
title: Example E2E
summary: Executable product scenarios derived from wiki behavior.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - pages/example-page
  - actions/example-action
  - policies/example-policy
implemented_by:
  - pilot/app/tests/e2e/example-e2e.spec.ts
verified_by:
  - pilot/app/tests/e2e/example-e2e.spec.ts
artifacts:
  - pilot/app/tests/e2e/example-e2e.spec.ts
verify:
  - npm run e2e -- example-e2e
---
# Example E2E

## Coverage Model
QA should partition the product input space, not collect a loose list of examples.

Cover:
- Happy path.
- Empty or unavailable states.
- Policy boundaries.
- Validation failures.
- Mutation failure cases.
- Duplicate or repeated user actions.
- Stale data or race-like cases.
- Missing or invalid route/handoff data.
- Server/network errors.

## Scenarios
- given happy path / when the user completes the workflow / then the expected state is persisted and visible
- given unavailable state / when the user attempts the workflow / then the action is blocked with a clear reason
- given duplicate submit / when the user submits twice / then only one mutation is accepted
- given stale data / when the user submits after data changes / then the user sees a recoverable conflict
