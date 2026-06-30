---
id: pages/booking-complete
type: page
title: 예약 완료
summary: 예약 생성 뒤 보여주는 확인 화면.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - models/booking
  - design/design-system
implemented_by:
  - pilot/app/src/app/bookings/complete/page.tsx
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx
screenshots:
  - path: pilot/wiki/assets/screenshots/pages/booking-complete.png
    alt: 예약 완료 QA 통과 화면
    route: /bookings/complete?bookingId=booking-confirmed-001
mockups:
  - path: pilot/wiki/assets/mockups/pages/booking-complete.html
    alt: 예약 완료 기획 목업
    status: implemented
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# 예약 완료

## 설명
생성된 예약 요약, 요청사항, 예약 관리 링크, 캘린더 추가 링크를 보여준다.

## 조건
- 유효한 `bookingId`가 필요하다.
- 예약 id가 없거나 알 수 없으면 복구 가능한 오류를 보여준다.
- 화면 상단에는 생성 완료 상태를 설명하는 `app-hero` 컨텍스트 블록이 있어야 한다.
- 완료 상태는 `status-badge`로 보여준다.
- 예약 핵심 정보는 `booking-summary-panel` 안에서 서비스, 시간, 고객, 이메일, 요청사항 순서로 보여준다.
- 예약에 요청 사진이 있으면 `attached-photo` 첨부 사진 섹션을 보여준다.
- 예약에 요청 사진이 없으면 첨부 사진 섹션을 숨긴다.
- 캘린더 링크는 예약, 서비스, 시간 슬롯을 모두 조회한 상태에서만 보여준다.
- 캘린더 링크는 외부 계정 연결 없이 `.ics` 파일 다운로드로 동작한다.
- 오류 상태에서는 캘린더 링크를 숨긴다.

## 사용자 행동
- [[pages/booking-detail]]로 이동한다.
- [[pages/service-list]]로 돌아간다.
- 예약 내용을 `.ics` 파일로 내려받아 캘린더에 추가한다.

## 기획 목업
- `pilot/wiki/assets/mockups/pages/booking-complete.html`
- 목업은 완료 상태와 다음 행동의 우선순위를 정의한다.
- 구현은 완료되었고 QA 스크린샷이 최신 실제 화면 증거다.

## 표시 상태와 예외

| 조건 | 표시 상태 | 시드 |
|---|---|---|
| 예약 있음 | 확인 요약 | seed-booking-complete-normal |
| 요청사항 있음 | 확인 요약과 요청사항 | seed-booking-complete-with-note |
| 요청사항 사진 있음 | 확인 요약과 첨부 사진 | seed-booking-complete-with-photo |
| 예약 id 누락 | 오류와 서비스 목록 링크 | seed-booking-complete-missing-id |
| 알 수 없는 예약 id | 오류와 지원 안내 | seed-booking-complete-unknown-id |

## 내비게이션과 전달
- [[pages/booking-detail]]로 `bookingId`를 전달한다.

## 독립 QA
- given seed-booking-complete-normal / when page loads / then 완료 상태 배지와 예약 요약 패널이 보인다
- given seed-booking-complete-normal / when page loads / then 캘린더에 추가 링크가 보인다
- given seed-booking-complete-normal / when 캘린더 링크를 확인 / then 링크는 `.ics` 다운로드 속성을 가진다
- given seed-booking-complete-normal / when 예약 관리 선택 / then 상세 화면이 booking id를 받는다
- given seed-booking-complete-with-note / when page loads / then 요청사항이 보인다
- given seed-booking-complete-with-photo / when page loads / then 첨부 사진이 보인다
- given seed-booking-complete-missing-id / when page loads / then 오류가 보인다
- given seed-booking-complete-missing-id / when page loads / then 캘린더에 추가 링크가 보이지 않는다
