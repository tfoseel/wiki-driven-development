---
id: flows/create-booking-flow
type: flow
title: 예약 생성 플로우
summary: 서비스 선택부터 예약 확인까지의 흐름.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
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
# 예약 생성 플로우

## 의도
고객이 서비스를 고른 뒤 확정 예약을 확인하기까지 안내한다.

## 단계
1. [[pages/service-list]]에서 시작한다.
2. 서비스를 고르고 [[pages/booking-new]]로 이동한다.
3. 연락처와 선택적 요청사항으로 [[actions/create-booking]]을 제출한다.
4. [[pages/booking-complete]]에 도착한다.

## 전달 계약

| 출발 | 도착 | 데이터 | 검증 |
|---|---|---|---|
| [[pages/service-list]] | [[pages/booking-new]] | `serviceId` | 새 예약 화면이 선택한 서비스를 로드함 |
| [[pages/booking-new]] | [[actions/create-booking]] | `serviceId`, `slotId`, 연락처, `customerNote?` | 액션이 예약과 요청사항을 저장함 |
| [[pages/booking-new]] | [[pages/booking-complete]] | `bookingId` | 완료 화면이 생성된 예약과 요청사항을 로드함 |

## 플로우 QA
- given 활성 서비스와 예약 가능 슬롯 / when 고객이 폼 완료 / then 확인 화면이 나타난다
- given 요청사항 포함 / when 고객이 폼 완료 / then 확인 화면과 상세 화면에서 요청사항이 보인다
- given 제출 전 슬롯이 booked가 됨 / when 고객이 제출 / then 충돌이 보이고 확인 화면은 나타나지 않는다
