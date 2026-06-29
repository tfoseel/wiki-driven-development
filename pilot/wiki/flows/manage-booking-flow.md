---
id: flows/manage-booking-flow
type: flow
title: Manage Booking Flow
summary: Reschedule or cancel an existing booking.
depends_on:
  - pages/booking-detail
  - actions/reschedule-booking
  - actions/cancel-booking
  - policies/cancellation-policy
implemented_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- reschedule-booking
  - npm run e2e -w pilot-booking-app -- cancel-booking
---
# Manage Booking Flow

## Intent
Let a customer manage an active booking while respecting cancellation policy.

## Steps
1. Open [[pages/booking-detail]].
2. Reschedule with [[actions/reschedule-booking]] or cancel with [[actions/cancel-booking]].
3. Stay on the detail page and show the updated state.

## Handoff Contract

| From | To | Data | Assertion |
|---|---|---|---|
| Booking detail route | [[pages/booking-detail]] | `bookingId` | Detail page loads matching booking |
| [[actions/cancel-booking]] | [[pages/booking-detail]] | updated booking status | Detail shows cancelled state |
| [[actions/reschedule-booking]] | [[pages/booking-detail]] | updated slot id | Detail shows new slot |

## Flow QA
- given active booking outside boundary / when cancelled / then detail shows cancelled state
- given active booking outside boundary / when rescheduled / then detail shows new slot
- given policy-blocked booking / when mutation is attempted / then no state change occurs
