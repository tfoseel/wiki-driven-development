---
id: actions/cancel-booking
type: action
title: Cancel Booking
summary: Cancel an active booking and release its slot according to policy.
depends_on:
  - models/booking
  - models/availability-slot
  - policies/cancellation-policy
implemented_by:
  - pilot/app/src/actions/cancel-booking.ts
verified_by:
  - pilot/app/src/actions/cancel-booking.test.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
artifacts:
  - pilot/app/src/actions/cancel-booking.ts
verify:
  - npm run test -w pilot-booking-app -- cancel-booking
  - npm run e2e -w pilot-booking-app -- cancel-booking
---
# Cancel Booking

## Intent
Cancel a confirmed or rescheduled booking and make the slot available again.

## Input

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `bookingId` | string | yes | Booking to cancel |

## Rules
- Booking must exist.
- Booking must not already be cancelled.
- [[policies/cancellation-policy]] must allow cancellation.
- Cancellation is idempotent from the user's point of view: duplicate clicks must not create inconsistent state.

## State Changes
- Booking status becomes `cancelled`.
- Slot changes from `booked` to `available`.

## Failure Cases
- Unknown booking id.
- Already cancelled booking.
- Less than 24 hours before slot.
- Duplicate click while request is pending.
- Server error.

## QA
- given booking 25 hours away / when cancelled / then booking is cancelled and slot is available
- given booking 23 hours away / when cancelled / then cancellation is blocked with policy reason
- given already cancelled booking / when cancelled again / then state remains cancelled and user sees inactive state
