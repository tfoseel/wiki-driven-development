---
id: pages/booking-new
type: page
title: New Booking
summary: Select a slot and enter customer details.
depends_on:
  - models/service
  - models/availability-slot
  - actions/create-booking
implemented_by:
  - pilot/app/src/app/bookings/new/page.tsx
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/screens/booking-new/screen.tsx
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# New Booking

## Description
Lets the customer choose an available slot for a selected service and enter contact details.

## Conditions
- Requires a valid active `serviceId`.
- Only available slots can be selected.
- Submit uses [[actions/create-booking]].

## User Actions
- Select a date and time slot.
- Enter name and email.
- Submit booking.

## Visible States And Exceptions

| Condition | Rendered State | Seed |
|---|---|---|
| Available slots | Slot picker and contact form | seed-booking-new-normal |
| No slots | No availability message | seed-booking-new-no-slots |
| Invalid service | Recoverable error and link to services | seed-booking-new-invalid-service |
| Submit conflict | Conflict message and refreshed slots | seed-booking-new-slot-conflict |
| Validation error | Field-level errors | seed-booking-new-invalid-contact |

## Navigation And Handoff
- To [[pages/booking-complete]]: pass `bookingId` after successful creation.

## Independent QA
- given seed-booking-new-normal / when valid form is submitted / then complete page receives booking id
- given seed-booking-new-slot-conflict / when submit returns conflict / then no complete navigation occurs
