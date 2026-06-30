---
id: work-items/booking-request-photo
type: work_item
title: 예약 요청사항 사진 첨부
summary: 새 예약 요청사항에 시연용 사진 1장을 첨부하고 완료와 상세 화면에서 조회한다.
work_status:
  phase: completed
  digest: reflected
  verification: passed
patches:
  - target: entities/bookings
    status: applied
    summary: 예약에 선택적 요청 사진 필드를 추가한다.
    proposed_changes:
      - 예약은 요청사항 사진을 1장까지 선택적으로 저장할 수 있다.
      - 사진은 시연용으로 파일명, MIME 타입, data URL을 예약 레코드에 저장한다.
      - 실제 파일 스토리지와 여러 장 첨부는 제외한다.
    code_targets:
      - pilot/app/src/lib/seed-store.ts
      - pilot/app/src/models/booking.ts
    verify:
      - npm run test -w pilot-booking-app -- booking
  - target: models/booking
    status: applied
    summary: 요청 사진 검증 규칙을 예약 모델에 추가한다.
    proposed_changes:
      - 요청 사진은 선택이다.
      - 허용 타입은 PNG, JPEG, WebP다.
      - data URL은 MIME 타입과 일치해야 한다.
    code_targets:
      - pilot/app/src/models/booking.ts
      - pilot/app/src/models/booking.test.ts
    verify:
      - npm run test -w pilot-booking-app -- booking
  - target: actions/create-booking
    status: applied
    summary: 예약 생성 입력에 선택적 요청 사진을 추가한다.
    proposed_changes:
      - 새 예약 폼에서 전달된 사진을 예약에 저장한다.
      - 빈 파일 입력은 첨부 없음으로 처리한다.
      - 지원하지 않는 파일 타입 또는 파일 제한 위반은 invalid_input으로 처리한다.
    code_targets:
      - pilot/app/src/actions/create-booking.ts
      - pilot/app/src/app/bookings/new/page.tsx
      - pilot/app/src/actions/create-booking.test.ts
    verify:
      - npm run test -w pilot-booking-app -- create-booking
  - target: pages/booking-new
    status: applied
    summary: 새 예약 페이지 요청사항 영역에 사진 첨부 입력을 추가한다.
    proposed_changes:
      - 요청사항 textarea 아래에 사진 첨부 입력을 둔다.
      - 사진은 1장만 선택한다.
      - 입력은 PNG, JPEG, WebP만 허용한다.
    code_targets:
      - pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx
      - pilot/app/src/app/bookings/new/page.tsx
      - pilot/app/tests/e2e/create-booking.spec.ts
    verify:
      - npm run e2e -w pilot-booking-app -- create-booking
  - target: pages/booking-complete
    status: applied
    summary: 완료 화면에서 첨부 사진을 조회한다.
    proposed_changes:
      - 예약에 요청 사진이 있으면 첨부 사진 섹션을 보여준다.
      - 사진이 없으면 섹션을 숨긴다.
    code_targets:
      - pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx
      - pilot/app/tests/e2e/create-booking.spec.ts
    verify:
      - npm run e2e -w pilot-booking-app -- create-booking
  - target: pages/booking-detail
    status: applied
    summary: 상세 화면에서 첨부 사진을 조회한다.
    proposed_changes:
      - 예약에 요청 사진이 있으면 요청사항 근처에 첨부 사진 섹션을 보여준다.
      - 사진이 없으면 기존 상세 화면을 유지한다.
    code_targets:
      - pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx
      - pilot/app/tests/e2e/create-booking.spec.ts
    verify:
      - npm run e2e -w pilot-booking-app -- create-booking
  - target: qa/create-booking-e2e
    status: applied
    summary: 사진 첨부 생성과 조회 시나리오를 추가한다.
    proposed_changes:
      - 사진을 첨부해 예약을 생성하면 완료 화면에서 사진이 보인다.
      - 예약 관리로 이동하면 상세 화면에서도 같은 사진이 보인다.
    code_targets:
      - pilot/app/tests/e2e/create-booking.spec.ts
    verify:
      - npm run e2e -w pilot-booking-app -- create-booking
---
# 예약 요청사항 사진 첨부

## 의도
고객이 예약 요청사항을 글로만 남기는 대신 참고 사진 1장을 함께 첨부할 수 있게 한다.

## 사용자 문제
상담 전에 확인해야 할 화면, 공간, 문서 일부처럼 말로 설명하기 어려운 맥락이 있다. 시연용 파일럿에서는 실제 업로드 인프라 없이도 사진을 선택하고 예약 후 조회하는 흐름을 보여줄 필요가 있다.

## 작업 범위
- 새 예약 페이지 요청사항 아래에 사진 첨부 입력을 추가한다.
- 사진은 1장만 받는다.
- 허용 타입은 PNG, JPEG, WebP다.
- 파일은 예약 레코드의 `requestPhoto`에 data URL로 저장한다.
- 예약 완료 화면과 예약 상세 화면에서 첨부 사진을 조회한다.

## 제외 범위
- 여러 장 첨부.
- 실제 파일 스토리지, 업로드 디렉터리, CDN, 외부 객체 저장소.
- 이미지 편집, 자르기, 압축 UI.
- 일정 변경 또는 취소 시 사진 변경.

## 수용 기준
| 기준 | 기대 결과 |
|---|---|
| 사진 없이 예약 | 기존 예약 생성 흐름이 유지된다 |
| 지원 타입 사진 첨부 | 예약 생성 뒤 완료 화면에서 사진이 보인다 |
| 상세 조회 | 예약 상세 화면에서도 첨부 사진이 보인다 |
| 지원하지 않는 타입 | 예약이 생성되지 않고 입력 오류로 처리된다 |
| 사진 없음 | 완료와 상세 화면에 첨부 사진 섹션이 보이지 않는다 |

## 변경 초안

### Target: [[pages/booking-new]]
```md
## 사용자 행동
- 날짜와 시간 슬롯을 선택한다.
- 이름과 이메일을 입력한다.
- 필요한 요청사항을 선택적으로 입력한다.
- 요청사항을 보완할 사진 1장을 선택적으로 첨부한다.
- 예약을 제출한다.
```

### Target: [[pages/booking-complete]]
```md
## 조건
- 예약에 요청 사진이 있으면 요청사항 근처에 첨부 사진 섹션을 보여준다.
- 예약에 요청 사진이 없으면 첨부 사진 섹션을 숨긴다.
```

### Target: [[pages/booking-detail]]
```md
## 조건
- 예약에 요청 사진이 있으면 예약 상세에서 사진을 조회할 수 있다.
```
