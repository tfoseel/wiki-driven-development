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

## 하네스와의 관계
이 파일럿은 특수한 예제가 아니라 `wdd.config.json`에 연결된 dogfood 프로젝트다. 다른 앱도 같은 구조로 `wikiRoot`, `appRoot`, `repoRoot`를 지정하고 위키 노드의 ownership metadata를 채우면 같은 `wdd ready` 게이트를 사용할 수 있어야 한다.

## 배포 구조
- 제품 앱과 위키 브라우저는 다른 Next.js 앱으로 서빙한다.
- 제품 앱은 예약 기능을 제공하고 `/wiki`를 직접 서빙하지 않는다.
- 위키 브라우저는 `apps/wiki-browser`에서 정적 export로 빌드되며 GitHub Pages 같은 정적 호스팅에 배포할 수 있어야 한다.
- 위키 브라우저는 빌드 시점에 `pilot/wiki`를 읽어 모든 위키 노드 페이지를 생성한다.
- 노드 유형 탭은 쿼리스트링이 아니라 `/wiki/type/<type>` 정적 경로로 표현한다.

## 운영 cadence
1. 사용자는 위키 브라우저에서 화면, 정책, 액션, QA 상태를 확인한다.
2. 에이전트는 위키 페이지를 먼저 수정하고 영향받는 위키 페이지와 코드 파일을 추적한다.
3. 에이전트는 참조된 코드를 수정한다.
4. 에이전트는 E2E와 QA 스크린샷을 갱신한다.
5. 검증이 끝나면 에이전트는 `wdd_status`를 검증 완료 상태로 유지한다.
6. `wdd` 명령은 사용자가 외워야 하는 인터페이스가 아니라 에이전트와 CI가 사용하는 하네스다.

## 위키 브라우저가 보여야 하는 것
- 현재 제품 위키 노드만 보여준다.
- 왼쪽 목록은 문서 제목 중심으로 보여준다. 노드 타입은 선택된 탭이 이미 표현하므로 문서 카드에서 반복하지 않는다.
- 파일 경로와 노드 id는 읽기 흐름을 방해하지 않도록 접힌 구현 메타 안에 둔다.
- 상세 본문 상단은 제품 홈 링크나 타입 라벨 없이 문서 제목, 요약, 상태 배지, QA 화면, 본문 순서로 읽힌다.
- 현재 phase, 코드 반영 여부, 검증 상태는 간결한 배지로 보여준다.
- 이 노드가 바뀌면 영향받는 위키 페이지와 코드 파일, 검증에 쓰인 테스트와 실행 명령은 접힌 구현 메타에서 확인한다.
- QA가 완료된 화면 노드는 QA 화면 스크린샷을 본문 가까이에 보여준다.

## 작업 추적
- 제품 위키는 현재 검증된 제품의 SSOT다.
- 새 요청, 병렬 작업 상태, 리뷰 대화는 GitHub Issue와 PR에서 추적한다.
- 에이전트는 이슈를 픽업한 뒤 제품 위키를 먼저 수정하고, 코드와 QA를 동기화한 뒤 PR로 검증 증거를 남긴다.
- PR이 병합되기 전까지 제품 위키의 현재 브랜치가 해당 변경의 truth다.

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
