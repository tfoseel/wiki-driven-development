---
id: qa/create-booking-e2e
type: qa
title: 예약 생성 E2E
summary: 예약 생성에 대한 end-to-end 시나리오.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - flows/create-booking-flow
  - pages/service-list
  - pages/booking-new
  - pages/booking-complete
  - actions/create-booking
implemented_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/create-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# 예약 생성 E2E

## 커버리지 모델
- 성공 경로.
- 예약 가능한 슬롯 없음.
- 선택 후 슬롯이 booked가 되는 상황.
- 유효하지 않은 고객 이메일.
- 중복 제출.
- 비활성 서비스.
- 서버 오류.

## 시나리오
- given 활성 서비스와 예약 가능 슬롯 / when 유효한 연락처 제출 / then 예약이 확정된다
- given 예약 가능한 슬롯 없음 / when 새 예약 화면 로드 / then 제출 버튼이 활성화되지 않는다
- given 선택 후 슬롯이 booked가 됨 / when 제출 / then 충돌이 표시된다
- given 유효하지 않은 이메일 / when 제출 / then 필드 오류가 보이고 예약은 생성되지 않는다
- given 중복 제출 / when 버튼을 두 번 클릭 / then 예약은 하나만 생성된다
