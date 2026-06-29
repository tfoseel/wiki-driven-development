---
id: actions/example-action
type: action
title: Example Action
summary: A user or system mutation contract.
depends_on:
  - models/example-model
  - entities/example-entity
  - policies/example-policy
implemented_by:
  - pilot/app/src/actions/example-action.ts
verified_by:
  - pilot/app/src/actions/example-action.test.ts
  - pilot/app/tests/e2e/example-action.spec.ts
artifacts:
  - pilot/app/src/actions/example-action.ts
verify:
  - npm run test -- example-action
---
# Example Action

## Intent
Describe why this action exists and what user or system outcome it creates.

## Input

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `exampleId` | string | yes | Target object |

## Rules
- Preconditions:
- Policy checks:
- Idempotency:

## State Changes
- Before:
- After:
- Events:

## Failure Cases
- Validation failure:
- Policy boundary:
- Missing target:
- Duplicate submit:
- Stale data:
- Server error:

## QA
- given happy path / when action is submitted / then expected state changes occur
- given invalid input / when action is submitted / then action is rejected and state is unchanged
