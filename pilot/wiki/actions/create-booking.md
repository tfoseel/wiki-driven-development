---
id: actions/create-booking
type: action
title: 예약 생성
summary: 예약 가능한 슬롯을 확보하고 확정 예약을 만든다.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - models/booking
  - models/service
  - models/availability-slot
implemented_by:
  - pilot/app/src/actions/create-booking.ts
verified_by:
  - pilot/app/src/actions/create-booking.test.ts
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/actions/create-booking.ts
verify:
  - npm run test -w pilot-booking-app -- create-booking
  - npm run e2e -w pilot-booking-app -- create-booking
---
# 예약 생성

## 의도
선택한 활성 서비스와 예약 가능한 슬롯으로 확정 예약을 생성한다.

## 입력

| 필드 | 타입 | 필수 | 의미 |
|---|---|---:|---|
| `serviceId` | string | yes | 예약할 서비스 |
| `slotId` | string | yes | 확보할 슬롯 |
| `customerName` | string | yes | 고객 이름 |
| `customerEmail` | string | yes | 연락 이메일 |

## 규칙
- 서비스는 활성 상태여야 한다.
- 슬롯은 존재해야 하며 `available` 상태여야 한다.
- 고객 이메일은 유효해야 한다.
- 중복 제출이 같은 슬롯에 두 개의 예약을 만들면 안 된다.

## 상태 변화
- 슬롯은 `available`에서 `booked`로 바뀐다.
- 예약은 `confirmed` 상태로 생성된다.

## 실패 케이스
- 서비스가 비활성 상태다.
- 슬롯이 unavailable이거나 이미 booked 상태다.
- 페이지 로드 뒤 슬롯이 booked로 바뀐다.
- 이메일이 유효하지 않다.
- 중복 제출.
- 서버 오류.

## QA
- given 유효한 서비스와 예약 가능한 슬롯 / when 제출 / then 예약이 확정되고 슬롯이 booked가 된다
- given 선택한 슬롯이 booked로 바뀜 / when 제출 / then 예약은 생성되지 않고 충돌이 표시된다
