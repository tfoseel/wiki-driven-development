<!-- wdd
id: policies/example-policy
type: policy
title: Example Policy
summary: Cross-cutting business rule.
wdd_status:
  phase: coding
  code: pending
  verification: pending
depends_on:
  - terms/example-term
implemented_by:
  - <appRoot>/src/lib/policies/example-policy.ts
verified_by:
  - <appRoot>/src/lib/policies/example-policy.test.ts
artifacts:
  - <appRoot>/src/lib/policies/example-policy.ts
verify:
  - npm run test -- example-policy
-->
# Example Policy

## 상태

상태: 🛠️ 코드 반영 필요 · 코드 대기 · 검증 대기

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `policies/example-policy`
- 타입: `정책` (`policy`)
- 의존: [[terms/example-term]]
- 구현: `<appRoot>/src/lib/policies/example-policy.ts`
- 검증 파일: `<appRoot>/src/lib/policies/example-policy.test.ts`
- 산출물: `<appRoot>/src/lib/policies/example-policy.ts`
- 스크린샷: 없음
- 검증 명령: `npm run test -- example-policy`

</details>

## Rule
State the policy in product language.

## Applies To
- [[actions/example-action]]
- [[screens/example-screen]]

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
