---
id: entities/example-entity
type: entity
title: Example Entity
summary: Persistent domain data owned by the product.
depends_on:
  - policies/example-policy
implemented_by:
  - pilot/app/supabase/migrations/00000000000000_example.sql
verified_by:
  - pilot/app/tests/models/example-entity.test.ts
artifacts:
  - pilot/app/src/lib/example-repository.ts
verify:
  - npm run test -- example-entity
---
# Example Entity

## Meaning
Describe what this data represents in product language before listing fields.

## Fields

| Field | Type | Meaning | Rules |
|---|---|---|---|
| `id` | string | Stable identifier | Required |

## Relationships
- Link to related [[models/example-model]] or [[entities/other-entity]] pages.

## Persistence Rules
- Explain uniqueness, lifecycle, retention, and migration expectations.

## Examples
- Normal:
- Boundary:
- Invalid:
