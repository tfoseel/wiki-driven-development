---
id: pages/booking-complete
type: page
title: Booking Complete
summary: Confirmation page after a booking is created.
depends_on:
  - models/booking
implemented_by:
  - pilot/app/src/app/bookings/complete/page.tsx
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/screens/booking-complete/screen.tsx
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# Booking Complete

## Description
Shows the created booking summary and a link to manage the booking.

## Conditions
- Requires valid `bookingId`.
- If booking id is missing or unknown, show recoverable error.

## User Actions
- Go to [[pages/booking-detail]].
- Return to [[pages/service-list]].

## Visible States And Exceptions

| Condition | Rendered State | Seed |
|---|---|---|
| Booking exists | Confirmation summary | seed-booking-complete-normal |
| Missing booking id | Error and service list link | seed-booking-complete-missing-id |
| Unknown booking id | Error and support copy | seed-booking-complete-unknown-id |

## Navigation And Handoff
- To [[pages/booking-detail]]: pass `bookingId`.

## Independent QA
- given seed-booking-complete-normal / when manage booking is selected / then detail receives booking id
- given seed-booking-complete-missing-id / when page loads / then error is visible
