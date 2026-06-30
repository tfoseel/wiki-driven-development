---
id: pages/booking-detail
type: page
title: 예약 상세
summary: 기존 예약을 관리한다.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - models/booking
  - actions/reschedule-booking
  - actions/cancel-booking
  - policies/cancellation-policy
  - design/design-system
implemented_by:
  - pilot/app/src/app/bookings/[id]/page.tsx
verified_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
artifacts:
  - pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx
screenshots:
  - path: pilot/wiki/assets/screenshots/pages/booking-detail.png
    alt: 예약 상세 QA 통과 화면
    route: /bookings/booking-confirmed-001
mockups:
  - path: pilot/wiki/assets/mockups/pages/booking-detail.html
    alt: 예약 상세 기획 목업
    status: implemented
verify:
  - npm run e2e -w pilot-booking-app -- reschedule-booking
  - npm run e2e -w pilot-booking-app -- cancel-booking
---
# 예약 상세

## 설명
예약과 요청사항을 보여주고 정책이 허용할 때 일정 변경 또는 취소를 가능하게 한다.

## 조건
- 유효한 `bookingId`가 필요하다.
- 정책이 차단하면 취소와 일정 변경 버튼을 숨기거나 비활성화한다.
- 취소된 예약은 비활성 상태를 보여주고 mutation 액션을 제공하지 않는다.
- 화면 상단에는 예약 관리 화면임을 설명하는 `app-hero` 컨텍스트 블록이 있어야 한다.
- 예약 상태는 `status-badge`로 보여준다.
- 예약 핵심 정보는 `booking-summary-panel` 안에서 서비스, 시간, 고객, 이메일, 요청사항 순서로 보여준다.
- 가능한 mutation은 별도 액션 영역에 묶고, 정책으로 막힌 경우 같은 영역에 사유를 보여준다.

## 사용자 행동
- [[actions/reschedule-booking]]으로 일정을 변경한다.
- [[actions/cancel-booking]]으로 예약을 취소한다.

## 기획 목업
- `pilot/wiki/assets/mockups/pages/booking-detail.html`
- 목업은 상태 확인, 예약 정보 확인, 가능한 변경 행동의 우선순위를 정의한다.
- 구현은 완료되었고 QA 스크린샷이 최신 실제 화면 증거다.

## 표시 상태와 예외

| 조건 | 표시 상태 | 시드 |
|---|---|---|
| 활성이고 정책 경계 밖 | 일정 변경과 취소가 있는 상세 | seed-booking-detail-active |
| 요청사항 있음 | 상세 정보에 요청사항 표시 | seed-booking-detail-with-note |
| 슬롯 시작까지 24시간 미만 | 정책으로 차단된 액션 표시 | seed-booking-detail-policy-blocked |
| 취소됨 | 비활성 상태와 액션 버튼 없음 | seed-booking-detail-cancelled |
| 알 수 없는 예약 id | 찾을 수 없음 상태 | seed-booking-detail-not-found |
| 서버 오류 | 오류와 재시도 | seed-booking-detail-error |

## 내비게이션과 전달
- 일정 변경 성공 뒤 이 화면에 머물며 예약을 갱신한다.
- 취소 뒤 이 화면에 머물며 취소 상태를 보여준다.

## 독립 QA
- given seed-booking-detail-active / when page loads / then 상태 배지와 예약 요약 패널이 보인다
- given seed-booking-detail-active / when 취소 확정 / then 취소 상태가 보인다
- given seed-booking-detail-with-note / when page loads / then 요청사항이 보인다
- given seed-booking-detail-policy-blocked / when 취소 시도 / then 정책 사유가 보인다
- given seed-booking-detail-cancelled / when page loads / then mutation 버튼이 없다
