---
id: policies/example-policy
type: policy
title: Example Policy
summary: Cross-cutting business rule.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - terms/example-term
implemented_by:
  - <appRoot>/src/lib/policies/example-policy.ts
verified_by:
  - <appRoot>/src/lib/policies/example-policy.test.ts
artifacts:
  - <appRoot>/src/lib/policies/example-policy.ts
verify:
  - npm run test -- example-policy
---
# Example Policy

## Rule
State the policy in product language.

## Applies To
- [[actions/example-action]]
- [[pages/example-page]]

## Boundaries

| Case | Expected Result |
|---|---|
| Clearly allowed | Allow |
| Exactly at boundary | Define explicitly |
| Clearly blocked | Block |

## Exceptions
- Document manual overrides or special cases.

## QA
- given allowed case / when policy is evaluated / then it allows
- given blocked case / when policy is evaluated / then it blocks with a user-readable reason
