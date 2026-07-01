<!-- wdd
id: screens/example-screen
type: screen
title: Example Screen
summary: User-facing route and visible states.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - models/example-model
  - actions/example-action
implemented_by:
  - '<appRoot>/src/app/examples/[id]/page.tsx'
verified_by:
  - <appRoot>/tests/e2e/example-screen.spec.ts
artifacts:
  - '<appRoot>/src/app/examples/[id]/_components/example-screen.tsx'
screenshots:
  - path: <wikiRoot>/자료/스크린샷/화면/example.png
    alt: Example screen after QA passes
    route: /examples/example-id
verify:
  - npm run e2e -- example-screen
-->
# Example Screen

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `screens/example-screen`
- 타입: `screen`
- 의존: [[models/example-model]], [[actions/example-action]]
- 구현: `<appRoot>/src/app/examples/[id]/page.tsx`
- 검증 파일: `<appRoot>/tests/e2e/example-screen.spec.ts`
- 산출물: `<appRoot>/src/app/examples/[id]/_components/example-screen.tsx`
- 스크린샷: `<wikiRoot>/자료/스크린샷/화면/example.png` (/examples/example-id)
- 검증 명령: `npm run e2e -- example-screen`

</details>

## Screen Evidence
![Example screen after QA passes](<relativeScreenshotPathFromThisFile>)

## Description
Describe what the user sees and why this screen exists.

## Conditions
- Business rules that shape the screen.

## User Actions
- The user can do this.
- The user can trigger [[actions/example-action]].

## Visible States And Exceptions

| Condition | Rendered State | Seed |
|---|---|---|
| Normal | Primary content and enabled CTA | seed-example-normal |
| Empty | Empty state and next step | seed-example-empty |
| Policy blocked | Explanation and disabled action | seed-example-policy-blocked |
| Error | Error message and retry affordance | seed-example-error |

## Navigation And Handoff
- To [[screens/other-screen]]: pass `exampleId`.

## Independent QA
**Preconditions:** State the minimum account, data, and policy context.

**QA screenshot:** Once this screen is `code: reflected` or `verification: passed`, keep at least one route-backed screenshot here. After E2E passes, refresh every `screenshots.route` capture so the wiki shows the verified screen, not a stale mock.

**Seeds:**
- seed-example-normal:
- seed-example-empty:
- seed-example-policy-blocked:
- seed-example-error:

**E2E scenarios:**
- given seed-example-normal / when primary CTA is selected / then the expected screen or state appears
- given seed-example-error / when retry is selected / then the screen attempts recovery
