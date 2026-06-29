---
id: entities/bookings
type: entity
title: 예약
summary: 서비스 슬롯에 대한 고객 예약.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - entities/services
  - entities/availability-slots
implemented_by:
  - pilot/app/src/lib/seed-store.ts
verified_by:
  - pilot/app/src/models/booking.test.ts
artifacts:
  - pilot/app/src/lib/seed-store.ts
verify:
  - npm run test -w pilot-booking-app -- booking
---
# 예약

## 의미
예약은 고객이 특정 서비스 슬롯을 확보했다는 사실을 기록한다.

## 필드

| 필드 | 타입 | 의미 | 규칙 |
|---|---|---|---|
| `id` | string | 안정적인 예약 식별자 | 필수 |
| `serviceId` | string | 예약한 서비스 | [[entities/services]]를 참조해야 함 |
| `slotId` | string | 확보한 슬롯 | [[entities/availability-slots]]를 참조해야 함 |
| `customerName` | string | 고객 이름 | 필수 |
| `customerEmail` | string | 연락 이메일 | 유효한 이메일이어야 함 |
| `status` | enum | `confirmed`, `rescheduled`, `cancelled` | 가능한 행동을 결정함 |

## 생명주기
- 새 예약은 `confirmed` 상태로 시작한다.
- 일정 변경된 예약은 같은 예약 id를 유지하고 새 슬롯으로 이동한다.
- 취소된 예약은 슬롯을 해제하며 다시 취소할 수 없다.
