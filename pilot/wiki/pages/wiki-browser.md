---
id: pages/wiki-browser
type: page
title: 위키 브라우저
summary: 예약 앱의 단일 진실 공급원인 파일럿 위키 페이지를 탐색한다.
depends_on:
  - ROOT
implemented_by:
  - pilot/app/src/app/wiki/[[...slug]]/page.tsx
  - pilot/app/src/screens/wiki-browser/screen.tsx
  - pilot/app/src/lib/wiki-browser.ts
  - pilot/app/src/app/page.tsx
  - pilot/app/src/app/layout.tsx
  - pilot/app/src/app/globals.css
verified_by:
  - pilot/app/src/lib/wiki-browser.test.ts
  - pilot/app/tests/e2e/wiki-browser.spec.ts
artifacts:
  - pilot/app/src/screens/wiki-browser/screen.tsx
  - packages/wdd/package.json
  - pilot/app/package.json
  - package-lock.json
verify:
  - npm run test -w pilot-booking-app -- wiki-browser
  - npm run e2e -w pilot-booking-app -- wiki-browser
---
# 위키 브라우저

## 설명
기획자가 생성물이나 에이전트가 작성한 코드를 보기 전에 SSOT인 파일럿 위키를 먼저 검토할 수 있도록 Next.js 앱 안에서 위키를 보여준다.

## 조건
- `/wiki`는 파일럿 루트 노드를 연다.
- `/wiki/<node-id>`는 `/wiki/actions/cancel-booking`처럼 중첩된 id를 포함한 특정 위키 노드를 연다.
- 화면은 전체, 엔티티, 모델, 액션, 화면, 플로우, 정책, QA 탭으로 노드를 구분한다.
- 각 노드는 유형, 요약, 구현 참조, 검증 참조를 보여준다.
- 위키 본문의 마크다운 테이블은 pipe 텍스트가 아니라 HTML 테이블 뷰로 렌더링한다.
- `[[node-id]]` 형식의 위키 링크는 대응하는 위키 페이지로 이동한다.

## 사용자 행동
- 앱 홈에서 파일럿 위키를 연다.
- 탭으로 노드 유형을 좁힌다.
- 위키 인덱스에서 노드를 선택한다.
- 본문 안의 위키 링크를 따라간다.

## 표시 상태와 예외

| 조건 | 표시 상태 | 시드 |
|---|---|---|
| 위키 루트 로드 | 루트 본문과 전체 노드 인덱스 | seed-wiki-root |
| 유형 탭 선택 | 선택한 유형의 노드만 인덱스에 표시 | seed-wiki-tab-filter |
| 중첩 노드 로드 | 노드 제목, 메타데이터, 본문, 구현/검증 참조 | seed-wiki-node |
| 테이블 본문 로드 | 필드/타입/의미/규칙 열이 있는 HTML 테이블 | seed-wiki-table |
| 알 수 없는 노드 id | 찾을 수 없음 상태 | seed-wiki-not-found |

## 독립 QA
- given `/wiki` / when page loads / then 미니 예약 파일럿 루트와 노드 인덱스가 보인다
- given `/wiki?type=action` / when page loads / then 액션 노드만 인덱스에 보인다
- given `/wiki/actions/cancel-booking` / when page loads / then 예약 취소 규칙과 코드 참조가 보인다
- given `/wiki/entities/availability-slots` / when page loads / then 필드 표가 HTML 테이블로 보인다
- given 루트 페이지의 위키 링크 / when clicked / then 대응하는 노드 페이지가 열린다
