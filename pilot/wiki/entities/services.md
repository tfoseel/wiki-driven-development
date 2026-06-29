---
id: entities/services
type: entity
title: 서비스
summary: 고객이 예약할 수 있는 상담 서비스.
wdd_status:
  phase: verified
  code: reflected
  verification: passed
depends_on:
implemented_by:
  - pilot/app/src/lib/seed-store.ts
verified_by:
  - pilot/app/src/models/service.test.ts
artifacts:
  - pilot/app/src/lib/seed-store.ts
verify:
  - npm run test -w pilot-booking-app -- service
---
# 서비스

## 의미
서비스는 초기 상담이나 후속 상담처럼 고객이 예약할 수 있는 대상이다.

## 필드

| 필드 | 타입 | 의미 | 규칙 |
|---|---|---|---|
| `id` | string | 안정적인 서비스 식별자 | 필수 |
| `name` | string | 고객에게 보이는 서비스명 | 필수 |
| `durationMinutes` | number | 슬롯 길이 | 양수여야 함 |
| `active` | boolean | 사용자가 예약할 수 있는지 여부 | 비활성 서비스는 신규 예약을 시작할 수 없음 |

## 예시
- `consultation`: 45분 초기 상담, 활성.
- `follow-up`: 30분 후속 상담, 활성.
- `legacy-review`: 과거 예약 표시를 위해 유지하는 비활성 서비스.
