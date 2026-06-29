---
id: entities/services
type: entity
title: Services
summary: Bookable consultation services.
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
# Services

## Meaning
A service is the thing a customer can book, such as an initial consultation or a follow-up session.

## Fields

| Field | Type | Meaning | Rules |
|---|---|---|---|
| `id` | string | Stable service identifier | Required |
| `name` | string | Customer-visible service name | Required |
| `durationMinutes` | number | Slot length | Must be positive |
| `active` | boolean | Whether users can book it | Inactive services cannot start new bookings |

## Examples
- `consultation`: 45-minute initial consultation, active.
- `follow-up`: 30-minute follow-up, active.
- `legacy-review`: inactive service kept for old bookings.
