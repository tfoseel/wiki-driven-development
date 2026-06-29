---
id: models/availability-slot
type: model
title: 예약 가능 슬롯 모델
summary: 예약 가능한 시간 슬롯의 도메인 검증.
depends_on:
  - entities/availability-slots
  - models/service
implemented_by:
  - pilot/app/src/models/availability-slot.ts
verified_by:
  - pilot/app/src/models/availability-slot.test.ts
artifacts:
  - pilot/app/src/models/availability-slot.ts
verify:
  - npm run test -w pilot-booking-app -- availability-slot
---
# 예약 가능 슬롯 모델

## 의미
슬롯 모델은 고객이 특정 시간을 예약할 수 있는지 화면과 액션에 알려준다.

## 검증
- `startsAt`은 타임존이 포함된 유효한 ISO datetime이어야 한다.
- `status`는 `available`, `booked`, `unavailable` 중 하나여야 한다.
- `serviceId`는 알려진 서비스를 가리켜야 한다.

## 예시
- 유효: 내일의 예약 가능한 상담 슬롯.
- 차단: 보이지만 선택할 수 없는 unavailable 슬롯.
- 경쟁 상황: 제출 전에 선택한 슬롯이 booked로 바뀜.
