---
id: pages/example-page
type: page
title: Example Page
summary: User-facing route and visible states.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - models/example-model
  - actions/example-action
implemented_by:
  - <appRoot>/src/app/examples/[id]/page.tsx
verified_by:
  - <appRoot>/tests/e2e/example-page.spec.ts
artifacts:
  - <appRoot>/src/app/examples/[id]/_components/example-page-screen.tsx
screenshots:
  - path: <wikiRoot>/assets/screenshots/pages/example-page.png
    alt: Example page after QA passes
    route: /examples/example-id
verify:
  - npm run e2e -- example-page
---
# Example Page

## Description
Describe what the user sees and why this page exists.

## Conditions
- Business rules that shape the page.

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
- To [[pages/other-page]]: pass `exampleId`.

## Independent QA
**Preconditions:** State the minimum account, data, and policy context.

**QA screenshot:** Once this page is `code: reflected` or `verification: passed`, keep at least one route-backed screenshot here. After E2E passes, refresh every `screenshots.route` capture so the page wiki shows the verified screen, not a stale mock.

**Seeds:**
- seed-example-normal:
- seed-example-empty:
- seed-example-policy-blocked:
- seed-example-error:

**E2E scenarios:**
- given seed-example-normal / when primary CTA is selected / then the expected page or state appears
- given seed-example-error / when retry is selected / then the page attempts recovery
