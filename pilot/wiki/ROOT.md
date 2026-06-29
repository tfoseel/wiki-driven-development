---
id: ROOT
type: root
title: 미니 예약 파일럿
summary: WDD 하네스를 실제로 검증하기 위한 작은 상담 예약 앱.
wdd_status:
  phase: verified
  code: not_required
  verification: not_required
depends_on:
implemented_by:
verified_by:
artifacts:
verify:
---
# 미니 예약 파일럿

## 목적
이 파일럿은 작지만 완결된 제품을 위키 페이지를 SSOT로 삼아 운영할 수 있는지 검증한다.

## 운영 cadence
1. 위키 페이지를 먼저 수정한다.
2. 영향받는 위키 페이지와 코드 파일을 확인한다.
3. 코드를 수정한다.
4. `npm run qa -w pilot-booking-app`로 E2E를 통과시킨 뒤 화면 위키의 `screenshots.route`를 다시 캡처한다.
5. `wdd status`와 `wdd drift`가 통과하면 `wdd_status`를 검증 완료 상태로 유지한다.

## 사용자 여정
1. 예약 가능한 서비스를 본다.
2. 예약을 시작한다.
3. 날짜와 시간 슬롯을 고른다.
4. 고객 정보를 입력한다.
5. 예약을 생성한다.
6. 예약 상세를 확인한다.
7. 정책에 따라 일정을 변경하거나 취소한다.

## 핵심 노드
- [[entities/services]]
- [[entities/availability-slots]]
- [[entities/bookings]]
- [[actions/create-booking]]
- [[actions/reschedule-booking]]
- [[actions/cancel-booking]]
- [[pages/service-list]]
- [[pages/booking-new]]
- [[pages/booking-detail]]
- [[pages/booking-complete]]
- [[flows/create-booking-flow]]
- [[flows/manage-booking-flow]]
- [[design/design-system]]
- [[policies/cancellation-policy]]
- [[qa/create-booking-e2e]]
- [[qa/reschedule-booking-e2e]]
- [[qa/cancel-booking-e2e]]
