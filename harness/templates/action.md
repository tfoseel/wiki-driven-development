<!-- wdd
id: actions/example-action
type: action
title: Example Action
summary: A user or system mutation contract.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - models/example-model
  - entities/example-entity
  - policies/example-policy
implemented_by:
  - <appRoot>/src/actions/example-action.ts
verified_by:
  - <appRoot>/src/actions/example-action.test.ts
  - <appRoot>/tests/e2e/example-action.spec.ts
artifacts:
  - <appRoot>/src/actions/example-action.ts
verify:
  - npm run test -- example-action
-->
# Example Action

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `actions/example-action`
- 타입: `action`
- 의존: [[models/example-model]], [[entities/example-entity]], [[policies/example-policy]]
- 구현: `<appRoot>/src/actions/example-action.ts`
- 검증 파일: `<appRoot>/src/actions/example-action.test.ts`, `<appRoot>/tests/e2e/example-action.spec.ts`
- 산출물: `<appRoot>/src/actions/example-action.ts`
- 스크린샷: 없음
- 검증 명령: `npm run test -- example-action`

</details>

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
