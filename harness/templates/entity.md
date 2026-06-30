---
id: entities/example-entity
type: entity
title: Example Entity
summary: Persistent domain data owned by the product.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - policies/example-policy
implemented_by:
  - <appRoot>/supabase/migrations/00000000000000_example.sql
verified_by:
  - <appRoot>/tests/models/example-entity.test.ts
artifacts:
  - <appRoot>/src/lib/example-repository.ts
verify:
  - npm run test -- example-entity
---
# Example Entity

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `entities/example-entity`
- 타입: `entity`
- 의존: [[policies/example-policy]]
- 구현: `<appRoot>/supabase/migrations/00000000000000_example.sql`
- 검증 파일: `<appRoot>/tests/models/example-entity.test.ts`
- 산출물: `<appRoot>/src/lib/example-repository.ts`
- 스크린샷: 없음
- 검증 명령: `npm run test -- example-entity`

</details>

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
