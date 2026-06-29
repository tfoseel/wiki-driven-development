---
id: design/design-system
type: design
title: 디자인 시스템
summary: 예약 앱의 제품 UI 토큰, 화면 패턴, 예약 상태 표현을 정의한다.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
  - ROOT
implemented_by:
  - pilot/app/src/app/globals.css
  - pilot/app/src/app/services/_components/service-list-screen.tsx
  - pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx
  - pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx
  - pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx
verified_by:
  - pilot/app/tests/e2e/service-list.spec.ts
  - pilot/app/tests/e2e/create-booking.spec.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
artifacts:
  - pilot/app/src/app/globals.css
  - pilot/app/src/app/services/_components/service-list-screen.tsx
  - pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx
  - pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx
  - pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx
verify:
  - npm run e2e -w pilot-booking-app
---
# 디자인 시스템

## 결론
예약 앱의 디자인 시스템 문서는 필요하다. 다만 지금 단계에서는 별도 패키지나 무거운 컴포넌트 라이브러리가 아니라, 제품 화면이 공유하는 토큰과 패턴을 이 노드에 기록하는 수준으로 충분하다.

## 필요한 이유
- 서비스 선택, 새 예약, 예약 완료, 예약 상세가 하나의 제품처럼 보여야 한다.
- 예약 가능, 정책 차단, 취소됨, 찾을 수 없음 같은 상태 표현이 화면마다 일관되어야 한다.
- 고객이 예약을 진행하는 핵심 동선에서는 장식보다 명확한 정보 위계와 행동 버튼이 중요하다.
- QA는 주요 화면의 문구와 상태 표현이 디자인 계약을 벗어나지 않는지 확인해야 한다.

## 아직 필요하지 않은 것
- 별도 npm 디자인 시스템 패키지.
- Figma 컴포넌트 라이브러리 수준의 토큰 운영.
- 범용 UI kit 추상화.

## 토큰

| 토큰 | 값 | 용도 |
|---|---|---|
| `--surface` | `#fffdf8` | 예약 화면의 기본 표면 |
| `--surface-muted` | `#edf5f2` | 보조 영역과 상태 배경 |
| `--text` | `#18211f` | 본문 기본 텍스트 |
| `--muted` | `#66736f` | 보조 메타데이터 |
| `--accent` | `#08605f` | 주요 행동, 링크, 포커스 |

## 제품 UI 규칙
- 화면은 예약 작업을 방해하지 않는 조용한 업무형 레이아웃을 따른다.
- 페이지 제목 아래에는 사용자가 지금 무엇을 선택하거나 확인해야 하는지 바로 드러난다.
- 서비스는 반복 카드로 보여주고, 각 카드에는 이름, 소요 시간, 예약 시작 행동이 있어야 한다.
- 새 예약 화면의 폼은 시간 선택, 이름, 이메일, 제출 순서로 흐른다.
- 예약 완료 화면은 서비스와 시간을 먼저 확인시키고, 예약 관리 링크를 제공한다.
- 예약 상세 화면은 상태, 서비스, 시간, 가능한 행동을 분리해서 보여준다.
- 정책으로 막힌 행동은 버튼 대신 차단 사유를 보여준다.
- 취소된 예약은 비활성 상태와 함께 mutation 버튼을 제공하지 않는다.

## Next.js 구조 원칙
- `src/app` App Router를 사용한다.
- 라우트 전용 UI는 해당 route segment의 `_components`에 둔다.
- 라우트 전용 데이터 변환/읽기 모델은 해당 route area의 `_lib`에 둔다.
- `page.tsx`는 얇은 서버 컴포넌트로 유지하고, 파라미터 해석과 데이터 연결만 담당한다.
- 도메인 모델, 서버 액션, 여러 화면이 공유하는 저장소는 `src/models`, `src/actions`, `src/lib`에 유지한다.

## 검증
- `/services`에서 활성 서비스 카드와 예약 시작 행동이 보인다.
- `/bookings/new?serviceId=svc-consult`에서 시간 선택, 이름, 이메일 입력이 보인다.
- `/bookings/complete?bookingId=booking-confirmed`에서 예약 요약과 관리 링크가 보인다.
- `/bookings/booking-confirmed`에서 예약 상태와 가능한 행동이 보인다.
