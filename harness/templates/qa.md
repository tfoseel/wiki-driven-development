<!-- wdd
id: qa/example-e2e
type: qa
title: Example E2E
summary: Executable product scenarios derived from wiki behavior.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - screens/example-screen
  - actions/example-action
  - policies/example-policy
implemented_by:
  - <appRoot>/tests/e2e/example-e2e.spec.ts
verified_by:
  - <appRoot>/tests/e2e/example-e2e.spec.ts
artifacts:
  - <appRoot>/tests/e2e/example-e2e.spec.ts
verify:
  - npm run e2e -- example-e2e
-->
# Example E2E

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `qa/example-e2e`
- 타입: `QA` (`qa`)
- 의존: [[screens/example-screen]], [[actions/example-action]], [[policies/example-policy]]
- 구현: `<appRoot>/tests/e2e/example-e2e.spec.ts`
- 검증 파일: `<appRoot>/tests/e2e/example-e2e.spec.ts`
- 산출물: `<appRoot>/tests/e2e/example-e2e.spec.ts`
- 스크린샷: 없음
- 검증 명령: `npm run e2e -- example-e2e`

</details>

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
