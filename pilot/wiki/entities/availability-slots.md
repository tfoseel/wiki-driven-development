---
id: entities/availability-slots
type: entity
title: 예약 가능 슬롯
summary: 고객이 예약할 수 있는 시간 슬롯.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - entities/services
implemented_by:
  - pilot/app/src/lib/seed-store.ts
verified_by:
  - pilot/app/src/models/availability-slot.test.ts
artifacts:
  - pilot/app/src/lib/seed-store.ts
verify:
  - npm run test -w pilot-booking-app -- availability-slot
---
# 예약 가능 슬롯

## 의미
예약 가능 슬롯은 하나의 서비스에 대해 고객이 선택할 수 있는 시간을 나타낸다.

## 필드

| 필드 | 타입 | 의미 | 규칙 |
|---|---|---|---|
| `id` | string | 안정적인 슬롯 식별자 | 필수 |
| `serviceId` | string | 이 슬롯에서 제공되는 서비스 | [[entities/services]]를 참조해야 함 |
| `startsAt` | ISO datetime | 슬롯 시작 시각 | 타임존을 포함해야 함 |
| `status` | enum | `available`, `booked`, `unavailable` | `available`만 예약 가능 |

## 상태 규칙
- `available`: 신규 예약 또는 일정 변경에서 선택할 수 있다.
- `booked`: 활성 예약이 이미 점유한 상태다.
- `unavailable`: 운영자나 일정에 의해 막힌 상태다.

## 엣지 케이스
- 고객이 선택한 뒤에도 슬롯이 `booked`로 바뀔 수 있다.
- 날짜 경계에 있는 슬롯도 반드시 타임존을 기준으로 해석해야 한다.
