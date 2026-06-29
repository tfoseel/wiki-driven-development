---
id: pages/booking-detail
type: page
title: Booking Detail
summary: Manage an existing booking.
depends_on:
  - models/booking
  - actions/reschedule-booking
  - actions/cancel-booking
  - policies/cancellation-policy
implemented_by:
  - pilot/app/src/app/bookings/[id]/page.tsx
verified_by:
  - pilot/app/tests/e2e/reschedule-booking.spec.ts
  - pilot/app/tests/e2e/cancel-booking.spec.ts
artifacts:
  - pilot/app/src/screens/booking-detail/screen.tsx
verify:
  - npm run e2e -w pilot-booking-app -- reschedule-booking
  - npm run e2e -w pilot-booking-app -- cancel-booking
---
# Booking Detail

## Description
Shows a booking and allows reschedule or cancellation when policy allows.

## Conditions
- Requires valid `bookingId`.
- Cancel and reschedule buttons are hidden or disabled when policy blocks them.
- Cancelled bookings show inactive state and no mutation actions.

## User Actions
- Reschedule through [[actions/reschedule-booking]].
- Cancel through [[actions/cancel-booking]].

## Visible States And Exceptions

| Condition | Rendered State | Seed |
|---|---|---|
| Active and outside policy boundary | Details with reschedule and cancel | seed-booking-detail-active |
| Less than 24 hours before slot | Details with policy-blocked actions | seed-booking-detail-policy-blocked |
| Cancelled | Inactive state and no action buttons | seed-booking-detail-cancelled |
| Unknown booking id | Not found state | seed-booking-detail-not-found |
| Server error | Error and retry | seed-booking-detail-error |

## Navigation And Handoff
- Reschedule stays on this page after success and refreshes booking.
- Cancel stays on this page and shows cancelled state.

## Independent QA
- given seed-booking-detail-active / when cancel is confirmed / then cancelled state is visible
- given seed-booking-detail-policy-blocked / when cancel is attempted / then policy reason is visible
- given seed-booking-detail-cancelled / when page loads / then mutation buttons are absent
