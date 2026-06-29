---
id: pages/booking-complete
type: page
title: 예약 완료
summary: 예약 생성 뒤 보여주는 확인 화면.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - models/booking
  - design/design-system
implemented_by:
  - pilot/app/src/app/bookings/complete/page.tsx
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx
screenshots:
  - path: pilot/wiki/assets/screenshots/pages/booking-complete.png
    alt: 예약 완료 QA 통과 화면
    route: /bookings/complete?bookingId=booking-confirmed-001
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# 예약 완료

## 설명
생성된 예약 요약과 예약 관리 링크를 보여준다.

## 조건
- 유효한 `bookingId`가 필요하다.
- 예약 id가 없거나 알 수 없으면 복구 가능한 오류를 보여준다.

## 사용자 행동
- [[pages/booking-detail]]로 이동한다.
- [[pages/service-list]]로 돌아간다.

## 표시 상태와 예외

| 조건 | 표시 상태 | 시드 |
|---|---|---|
| 예약 있음 | 확인 요약 | seed-booking-complete-normal |
| 예약 id 누락 | 오류와 서비스 목록 링크 | seed-booking-complete-missing-id |
| 알 수 없는 예약 id | 오류와 지원 안내 | seed-booking-complete-unknown-id |

## 내비게이션과 전달
- [[pages/booking-detail]]로 `bookingId`를 전달한다.

## 독립 QA
- given seed-booking-complete-normal / when 예약 관리 선택 / then 상세 화면이 booking id를 받는다
- given seed-booking-complete-missing-id / when page loads / then 오류가 보인다
