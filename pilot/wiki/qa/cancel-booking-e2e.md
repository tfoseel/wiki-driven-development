---
id: qa/cancel-booking-e2e
type: qa
title: 예약 취소 E2E
summary: 예약 취소에 대한 end-to-end 시나리오.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - flows/manage-booking-flow
  - pages/booking-detail
  - actions/cancel-booking
  - policies/cancellation-policy
implemented_by:
  - pilot/app/tests/e2e/cancel-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/cancel-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/cancel-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- cancel-booking
---
# 예약 취소 E2E

## 커버리지 모델
- 성공 경로.
- 정책 경계.
- 이미 취소된 예약.
- 알 수 없는 예약 id.
- 중복 클릭.
- 서버 오류.
- 타임존/날짜 컷오프.

## 시나리오
- given 25시간 뒤 예약 / when 취소 확정 / then 예약이 취소되고 슬롯이 해제된다
- given 정확히 24시간 뒤 예약 / when 취소 확정 / then 취소가 허용된다
- given 23시간 뒤 예약 / when 취소 시도 / then 정책 사유가 보인다
- given 이미 취소된 예약 / when 상세 화면 로드 / then 취소 액션이 없다
- given 중복 취소 클릭 / when 요청 대기 중 / then 최종 상태는 하나의 취소된 예약이다
