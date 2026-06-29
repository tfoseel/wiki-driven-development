---
id: policies/cancellation-policy
type: policy
title: Cancellation Policy
summary: Bookings can be cancelled or rescheduled until 24 hours before the slot starts.
depends_on:
  - models/booking
  - models/availability-slot
implemented_by:
  - pilot/app/src/lib/policies/cancellation-policy.ts
verified_by:
  - pilot/app/src/lib/policies/cancellation-policy.test.ts
artifacts:
  - pilot/app/src/lib/policies/cancellation-policy.ts
verify:
  - npm run test -w pilot-booking-app -- cancellation-policy
---
# Cancellation Policy

## Rule
A confirmed or rescheduled booking can be cancelled or rescheduled until 24 hours before the slot start time.

## Applies To
- [[actions/cancel-booking]]
- [[actions/reschedule-booking]]
- [[pages/booking-detail]]

## Boundaries

| Case | Expected Result |
|---|---|
| More than 24 hours before slot | Allow cancellation and reschedule |
| Exactly 24 hours before slot | Allow |
| Less than 24 hours before slot | Block with clear reason |
| Booking already cancelled | Block as already inactive |

## QA
- given a booking 25 hours away / when cancellation is requested / then it is allowed
- given a booking 23 hours away / when cancellation is requested / then it is blocked
- given a booking exactly 24 hours away / when reschedule is requested / then it is allowed
