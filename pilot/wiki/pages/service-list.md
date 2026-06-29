---
id: pages/service-list
type: page
title: 서비스 목록
summary: 고객이 예약할 서비스를 고르는 진입 화면.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - models/service
  - design/design-system
implemented_by:
  - pilot/app/src/app/services/page.tsx
verified_by:
  - pilot/app/tests/e2e/service-list.spec.ts
artifacts:
  - pilot/app/src/app/services/_components/service-list-screen.tsx
screenshots:
  - path: pilot/wiki/assets/screenshots/pages/service-list.png
    alt: 서비스 목록 QA 통과 화면
    route: /services
verify:
  - npm run e2e -w pilot-booking-app -- service-list
---
# 서비스 목록

## 설명
활성 서비스를 보여주고 고객이 새 예약을 시작할 수 있게 한다.

## 조건
- 비활성 서비스는 신규 예약 진입에서 숨긴다.
- 활성 서비스가 없으면 빈 상태를 보여준다.

## 사용자 행동
- 서비스를 선택한다.
- 선택한 `serviceId`로 [[pages/booking-new]]를 시작한다.

## 표시 상태와 예외

| 조건 | 표시 상태 | 시드 |
|---|---|---|
| 활성 서비스 있음 | 서비스 카드와 시작 버튼 | seed-services-normal |
| 활성 서비스 없음 | 안내 문구가 있는 빈 상태 | seed-services-empty |
| 로드 오류 | 오류 메시지와 재시도 | seed-services-error |

## 내비게이션과 전달
- [[pages/booking-new]]로 이동할 때 `serviceId`를 전달한다.

## 독립 QA
- given seed-services-normal / when 서비스 선택 / then 새 예약 화면이 service id를 받는다
- given seed-services-empty / when page loads / then 시작 버튼이 보이지 않는다
