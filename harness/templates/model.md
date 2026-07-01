<!-- wdd
id: models/example-model
type: model
title: 예시 앱객체
summary: App-facing data shape and validation rules.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - entities/example-entity
implemented_by:
  - <appRoot>/src/models/example-model.ts
verified_by:
  - <appRoot>/src/models/example-model.test.ts
artifacts:
  - <appRoot>/src/models/example-model.ts
verify:
  - npm run test -- example-model
-->
# 예시 앱객체

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `models/example-model`
- 타입: `앱객체` (`model`)
- 의존: [[entities/example-entity]]
- 구현: `<appRoot>/src/models/example-model.ts`
- 검증 파일: `<appRoot>/src/models/example-model.test.ts`
- 산출물: `<appRoot>/src/models/example-model.ts`
- 스크린샷: 없음
- 검증 명령: `npm run test -- example-model`

</details>

## Meaning
Explain the domain concept in words a planner can review.

## Fields

| Field | Type | Meaning | Validation |
|---|---|---|---|
| `name` | string | Human-readable name | Required, trimmed |

## DB테이블 매핑
- Derived from [[entities/example-entity]].

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
