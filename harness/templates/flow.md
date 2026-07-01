<!-- wdd
id: flows/example-flow
type: flow
title: Example Flow
summary: Multi-screen user journey and handoff contract.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - screens/example-screen
  - screens/other-screen
  - actions/example-action
implemented_by:
  - <appRoot>/tests/e2e/example-flow.spec.ts
verified_by:
  - <appRoot>/tests/e2e/example-flow.spec.ts
artifacts:
  - <appRoot>/tests/e2e/example-flow.spec.ts
verify:
  - npm run e2e -- example-flow
-->
# Example Flow

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `flows/example-flow`
- 타입: `flow`
- 의존: [[screens/example-screen]], [[screens/other-screen]], [[actions/example-action]]
- 구현: `<appRoot>/tests/e2e/example-flow.spec.ts`
- 검증 파일: `<appRoot>/tests/e2e/example-flow.spec.ts`
- 산출물: `<appRoot>/tests/e2e/example-flow.spec.ts`
- 스크린샷: 화면 트리에서 의존 화면의 QA 스크린샷을 인라인으로 표시
- 검증 명령: `npm run e2e -- example-flow`

</details>

## Screen Tree
- [[screens/example-screen]]: Entry screen and primary branch point.

  ![Example screen after QA passes](<relativeScreenshotPathFromThisFile>)

  - Primary action -> [[screens/other-screen]]: Destination screen.

    ![Other screen after QA passes](<relativeOtherScreenshotPathFromThisFile>)

  - Recoverable failure -> [[screens/example-screen]] error state.

## Intent
Describe the user journey from start to completion.

## Steps
1. Start at [[screens/example-screen]].
2. Perform [[actions/example-action]].
3. Arrive at [[screens/other-screen]].

## Handoff Contract

| From | To | Data | Assertion |
|---|---|---|---|
| [[screens/example-screen]] | [[screens/other-screen]] | `exampleId` | Destination can load the same object |

## Flow QA
- given happy path / when the journey is completed / then final state is visible
- given missing handoff data / when destination loads / then recoverable error is shown
