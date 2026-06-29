---
id: qa/reschedule-booking-e2e
type: qa
title: Reschedule Booking E2E
summary: End-to-end scenarios for rescheduling bookings.
depends_on:
  - flows/manage-booking-flow
  - pages/booking-detail
  - actions/reschedule-booking
  - policies/cancellation-policy
implemented_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- reschedule-booking
---
# Reschedule Booking E2E

## Coverage Model
- Happy path.
- Target slot unavailable.
- Booking already cancelled.
- Policy boundary at 24 hours.
- Missing booking id.
- Duplicate submit.

## Scenarios
- given booking 25 hours away and target slot available / when rescheduled / then booking shows new slot
- given target slot unavailable / when rescheduled / then booking remains unchanged
- given booking 23 hours away / when reschedule is attempted / then policy reason is shown
- given cancelled booking / when detail loads / then reschedule action is absent
