---
id: pages/booking-new
type: page
title: 새 예약
summary: 슬롯을 선택하고 고객 정보를 입력한다.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - models/service
  - models/availability-slot
  - actions/create-booking
  - design/design-system
implemented_by:
  - pilot/app/src/app/bookings/new/page.tsx
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx
screenshots:
  - path: pilot/wiki/assets/screenshots/pages/booking-new.png
    alt: 새 예약 QA 통과 화면
    route: /bookings/new?serviceId=consultation
mockups:
  - path: pilot/wiki/assets/mockups/pages/booking-new.html
    alt: 새 예약 기획 목업
    status: implemented
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# 새 예약

## 설명
고객이 선택한 서비스의 예약 가능한 슬롯을 고르고 연락처를 입력하게 한다.

## 조건
- 유효한 활성 `serviceId`가 필요하다.
- 예약 가능한 슬롯만 선택할 수 있다.
- 제출은 [[actions/create-booking]]을 사용한다.
- 화면 상단에는 선택한 서비스와 예약 생성 흐름을 설명하는 `app-hero` 컨텍스트 블록이 있어야 한다.
- 폼 앞에는 `booking-progress` 진행 상태가 보여야 한다.
- 예약 입력은 `booking-form-panel` 안에서 시간 선택, 연락처, 요청사항, 제출 순서로 묶는다.

## 사용자 행동
- 날짜와 시간 슬롯을 선택한다.
- 이름과 이메일을 입력한다.
- 필요한 요청사항을 선택적으로 입력한다.
- 예약을 제출한다.

## 기획 목업
- `pilot/wiki/assets/mockups/pages/booking-new.html`
- 목업은 입력 순서와 정보 위계를 정의한다.
- 구현은 완료되었고 QA 스크린샷이 최신 실제 화면 증거다.

## 표시 상태와 예외

| 조건 | 표시 상태 | 시드 |
|---|---|---|
| 예약 가능한 슬롯 있음 | 슬롯 선택기와 연락처 폼 | seed-booking-new-normal |
| 슬롯 없음 | 예약 가능 시간이 없다는 메시지 | seed-booking-new-no-slots |
| 유효하지 않은 서비스 | 복구 가능한 오류와 서비스 목록 링크 | seed-booking-new-invalid-service |
| 제출 충돌 | 충돌 메시지와 갱신된 슬롯 | seed-booking-new-slot-conflict |
| 검증 오류 | 필드 단위 오류 | seed-booking-new-invalid-contact |
| 요청사항 포함 | 요청사항 textarea와 제출 뒤 저장 | seed-booking-new-with-note |

## 내비게이션과 전달
- 생성 성공 뒤 [[pages/booking-complete]]로 `bookingId`를 전달한다.

## 독립 QA
- given seed-booking-new-normal / when page loads / then 진행 상태와 예약 폼 패널이 보인다
- given seed-booking-new-normal / when 유효한 폼 제출 / then 완료 화면이 booking id를 받는다
- given seed-booking-new-with-note / when 요청사항 포함 제출 / then 완료 화면에 요청사항이 보인다
- given seed-booking-new-slot-conflict / when 제출이 충돌 반환 / then 완료 화면으로 이동하지 않는다
