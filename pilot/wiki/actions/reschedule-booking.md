---
id: actions/reschedule-booking
type: action
title: Reschedule Booking
summary: Move an active booking to another available slot.
depends_on:
  - models/booking
  - models/availability-slot
  - policies/cancellation-policy
implemented_by:
  - pilot/app/src/actions/reschedule-booking.ts
verified_by:
  - pilot/app/src/actions/reschedule-booking.test.ts
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
artifacts:
  - pilot/app/src/actions/reschedule-booking.ts
verify:
  - npm run test -w pilot-booking-app -- reschedule-booking
  - npm run e2e -w pilot-booking-app -- reschedule-booking
---
# Reschedule Booking

## Intent
Move a confirmed or rescheduled booking to a different available slot.

## Input

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `bookingId` | string | yes | Booking to move |
| `targetSlotId` | string | yes | New slot |

## Rules
- Booking must exist.
- Booking must not be cancelled.
- [[policies/cancellation-policy]] must allow reschedule.
- Target slot must be `available`.

## State Changes
- Previous slot becomes `available`.
- Target slot becomes `booked`.
- Booking status becomes `rescheduled`.

## Failure Cases
- Unknown booking id.
- Already cancelled booking.
- Target slot unavailable.
- Less than 24 hours before current slot.
- Duplicate submit.

## QA
- given booking 25 hours away and available target / when rescheduled / then booking uses target slot
- given target slot unavailable / when rescheduled / then booking remains unchanged
