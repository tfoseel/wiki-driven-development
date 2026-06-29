---
id: policies/cancellation-policy
type: policy
title: 취소 정책
summary: 예약은 슬롯 시작 24시간 전까지 취소하거나 일정을 변경할 수 있다.
depends_on:
  - models/booking
  - models/availability-slot
implemented_by:
  - pilot/app/src/lib/policies/cancellation-policy.ts
verified_by:
  - pilot/app/src/lib/policies/cancellation-policy.test.ts
artifacts:
  - pilot/app/src/lib/policies/cancellation-policy.ts
verify:
  - npm run test -w pilot-booking-app -- cancellation-policy
---
# 취소 정책

## 규칙
확정 또는 일정 변경된 예약은 슬롯 시작 시각 24시간 전까지 취소하거나 일정을 변경할 수 있다.

## 적용 대상
- [[actions/cancel-booking]]
- [[actions/reschedule-booking]]
- [[pages/booking-detail]]

## 경계

| 케이스 | 기대 결과 |
|---|---|
| 슬롯 시작까지 24시간 초과 | 취소와 일정 변경 허용 |
| 슬롯 시작까지 정확히 24시간 | 허용 |
| 슬롯 시작까지 24시간 미만 | 명확한 사유와 함께 차단 |
| 이미 취소된 예약 | 이미 비활성 상태로 차단 |

## QA
- given 25시간 뒤 예약 / when 취소 요청 / then 허용된다
- given 23시간 뒤 예약 / when 취소 요청 / then 차단된다
- given 정확히 24시간 뒤 예약 / when 일정 변경 요청 / then 허용된다
