---
id: qa/cancel-booking-e2e
type: qa
title: Cancel Booking E2E
summary: End-to-end scenarios for cancellation.
depends_on:
  - flows/manage-booking-flow
  - pages/booking-detail
  - actions/cancel-booking
  - policies/cancellation-policy
implemented_by:
  - pilot/app/tests/e2e/cancel-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/cancel-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/cancel-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- cancel-booking
---
# Cancel Booking E2E

## Coverage Model
- Happy path.
- Policy boundary.
- Already cancelled booking.
- Unknown booking id.
- Duplicate click.
- Server error.
- Timezone/date cutoff.

## Scenarios
- given booking 25 hours away / when cancel is confirmed / then booking is cancelled and slot is released
- given booking exactly 24 hours away / when cancel is confirmed / then cancellation is allowed
- given booking 23 hours away / when cancel is attempted / then policy reason is shown
- given already cancelled booking / when detail loads / then cancel action is absent
- given duplicate cancel click / when request is pending / then final state is one cancelled booking
