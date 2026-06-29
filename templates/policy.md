---
id: policies/example-policy
type: policy
title: Example Policy
summary: Cross-cutting business rule.
depends_on:
  - terms/example-term
implemented_by:
  - pilot/app/src/lib/policies/example-policy.ts
verified_by:
  - pilot/app/src/lib/policies/example-policy.test.ts
artifacts:
  - pilot/app/src/lib/policies/example-policy.ts
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
