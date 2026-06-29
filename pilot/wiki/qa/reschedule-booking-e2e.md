---
id: qa/reschedule-booking-e2e
type: qa
title: 예약 일정 변경 E2E
summary: 예약 일정 변경에 대한 end-to-end 시나리오.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - flows/manage-booking-flow
  - pages/booking-detail
  - actions/reschedule-booking
  - policies/cancellation-policy
implemented_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- reschedule-booking
---
# 예약 일정 변경 E2E

## 커버리지 모델
- 성공 경로.
- 대상 슬롯 예약 불가.
- 이미 취소된 예약.
- 24시간 정책 경계.
- 예약 id 누락.
- 중복 제출.

## 시나리오
- given 25시간 뒤 예약과 예약 가능한 대상 슬롯 / when 일정 변경 / then 예약이 새 슬롯을 보여준다
- given 대상 슬롯 예약 불가 / when 일정 변경 / then 예약은 변하지 않는다
- given 23시간 뒤 예약 / when 일정 변경 시도 / then 정책 사유가 보인다
- given 취소된 예약 / when 상세 화면 로드 / then 일정 변경 액션이 없다
