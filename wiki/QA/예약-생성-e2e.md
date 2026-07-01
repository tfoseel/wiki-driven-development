<!-- wdd
id: qa/create-booking-e2e
type: qa
title: 예약 생성 E2E
summary: 예약 생성에 대한 end-to-end 시나리오.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - flows/create-booking-flow
  - screens/service-list
  - screens/booking-new
  - screens/booking-complete
  - actions/create-booking
implemented_by:
  - src/app/bookings/new/page.tsx
  - tests/e2e/create-booking.spec.ts
verified_by:
  - tests/e2e/create-booking.spec.ts
artifacts:
  - src/app/bookings/new/page.tsx
  - tests/e2e/create-booking.spec.ts
verify:
  - npm run e2e -- create-booking
-->
# 예약 생성 E2E

## 상태

상태: ✅ 검증 완료 · 코드 반영됨 · 검증 통과

<details>
<summary>영향 범위와 구현 메타</summary>

- 노드: `qa/create-booking-e2e`
- 타입: `QA` (`qa`)
- 의존: [[flows/create-booking-flow]], [[screens/service-list]], [[screens/booking-new]], [[screens/booking-complete]], [[actions/create-booking]]
- 구현: `src/app/bookings/new/page.tsx`, `tests/e2e/create-booking.spec.ts`
- 검증 파일: `tests/e2e/create-booking.spec.ts`
- 산출물: `src/app/bookings/new/page.tsx`, `tests/e2e/create-booking.spec.ts`
- 스크린샷: 없음
- 검증 명령: `npm run e2e -- create-booking`

</details>

이 문서는 [[flows/create-booking-flow]]의 화면 트리와 전달 계약을 반복 설명하지 않고, 실제로 검증해야 할 커버리지와 엣지 케이스만 기록한다.

## 커버리지 관점
- 성공 경로.
- 반복 실행을 위해 mutation 시나리오 전에 `/bookings/new?wddSeed=reset`으로 seed store를 초기화한다.
- 예약 가능한 슬롯 없음.
- 선택 후 슬롯이 booked가 되는 상황.
- 유효하지 않은 고객 이메일.
- 요청사항 저장과 표시.
- 요청사항 사진 첨부와 완료/상세 화면 조회.
- 예약 완료 화면의 `.ics` 캘린더 다운로드 링크.
- 중복 제출.
- 비활성 서비스.
- 서버 오류.

## 시나리오
- given 활성 서비스와 예약 가능 슬롯 / when 유효한 연락처 제출 / then 예약이 확정된다
- given 정상 예약 완료 / when 완료 화면 로드 / then 캘린더에 추가 링크가 보인다
- given 정상 예약 완료 / when 캘린더 링크를 확인 / then 링크는 `.ics` 다운로드 속성을 가진다
- given 예약 id 누락 / when 완료 화면 로드 / then 캘린더에 추가 링크가 보이지 않는다
- given 요청사항 포함 / when 예약 생성 / then 완료 화면과 상세 화면에서 요청사항이 보인다
- given 요청사항 사진 포함 / when 예약 생성 / then 완료 화면과 상세 화면에서 첨부 사진이 보인다
- given 예약 가능한 슬롯 없음 / when 새 예약 화면 로드 / then 제출 버튼이 활성화되지 않는다
- given 선택 후 슬롯이 booked가 됨 / when 제출 / then 충돌이 표시된다
- given 유효하지 않은 이메일 / when 제출 / then 필드 오류가 보이고 예약은 생성되지 않는다
- given 중복 제출 / when 버튼을 두 번 클릭 / then 예약은 하나만 생성된다
