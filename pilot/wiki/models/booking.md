---
id: models/booking
type: model
title: 예약 모델
summary: 예약의 도메인 검증과 상태 모델.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - entities/bookings
  - models/service
  - models/availability-slot
implemented_by:
  - pilot/app/src/models/booking.ts
verified_by:
  - pilot/app/src/models/booking.test.ts
artifacts:
  - pilot/app/src/models/booking.ts
verify:
  - npm run test -w pilot-booking-app -- booking
---
# 예약 모델

## 의미
예약 모델은 고객 연락처, 선택한 서비스, 선택한 슬롯, 생명주기 상태를 하나로 묶는다.

## 검증
- `customerName`은 필수다.
- `customerEmail`은 유효한 이메일 주소여야 한다.
- `status`는 `confirmed`, `rescheduled`, `cancelled` 중 하나여야 한다.
- 취소된 예약은 표시 목적을 제외하고 읽기 전용이다.

## 상태 예시
- `confirmed`: 새로 생성된 예약.
- `rescheduled`: 다른 슬롯으로 옮겨진 예약.
- `cancelled`: 슬롯을 해제한 예약.
