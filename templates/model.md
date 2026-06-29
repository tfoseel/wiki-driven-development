---
id: models/example-model
type: model
title: Example Model
summary: Domain shape and validation rules.
depends_on:
  - entities/example-entity
implemented_by:
  - pilot/app/src/models/example-model.ts
verified_by:
  - pilot/app/src/models/example-model.test.ts
artifacts:
  - pilot/app/src/models/example-model.ts
verify:
  - npm run test -- example-model
---
# Example Model

## Meaning
Explain the domain concept in words a planner can review.

## Fields

| Field | Type | Meaning | Validation |
|---|---|---|---|
| `name` | string | Human-readable name | Required, trimmed |

## Entity Mapping
- Maps to [[entities/example-entity]].

## Validation Cases
- Valid:
- Missing required field:
- Boundary:
- Invalid format:

## Examples
```json
{
  "name": "Example"
}
```
