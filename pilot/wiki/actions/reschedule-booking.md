---
id: actions/reschedule-booking
type: action
title: 예약 일정 변경
summary: 활성 예약을 다른 예약 가능 슬롯으로 옮긴다.
depends_on:
  - models/booking
  - models/availability-slot
  - policies/cancellation-policy
implemented_by:
  - pilot/app/src/actions/reschedule-booking.ts
verified_by:
  - pilot/app/src/actions/reschedule-booking.test.ts
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
artifacts:
  - pilot/app/src/actions/reschedule-booking.ts
verify:
  - npm run test -w pilot-booking-app -- reschedule-booking
  - npm run e2e -w pilot-booking-app -- reschedule-booking
---
# 예약 일정 변경

## 의도
확정 또는 일정 변경된 예약을 다른 예약 가능 슬롯으로 이동한다.

## 입력

| 필드 | 타입 | 필수 | 의미 |
|---|---|---:|---|
| `bookingId` | string | yes | 옮길 예약 |
| `targetSlotId` | string | yes | 새 슬롯 |

## 규칙
- 예약은 존재해야 한다.
- 예약은 취소 상태가 아니어야 한다.
- [[policies/cancellation-policy]]가 일정 변경을 허용해야 한다.
- 대상 슬롯은 `available` 상태여야 한다.

## 상태 변화
- 이전 슬롯은 `available`이 된다.
- 대상 슬롯은 `booked`가 된다.
- 예약 상태는 `rescheduled`가 된다.

## 실패 케이스
- 알 수 없는 예약 id.
- 이미 취소된 예약.
- 대상 슬롯이 예약 불가 상태.
- 현재 슬롯 시작까지 24시간 미만.
- 중복 제출.

## QA
- given 25시간 뒤 예약과 예약 가능한 대상 슬롯 / when 일정 변경 / then 예약이 대상 슬롯을 사용한다
- given 대상 슬롯 예약 불가 / when 일정 변경 / then 예약은 변하지 않는다
