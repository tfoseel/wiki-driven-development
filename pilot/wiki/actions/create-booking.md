---
id: actions/create-booking
type: action
title: Create Booking
summary: Reserve an available slot and create a confirmed booking.
depends_on:
  - models/booking
  - models/service
  - models/availability-slot
implemented_by:
  - pilot/app/src/actions/create-booking.ts
verified_by:
  - pilot/app/src/actions/create-booking.test.ts
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/src/actions/create-booking.ts
verify:
  - npm run test -w pilot-booking-app -- create-booking
  - npm run e2e -w pilot-booking-app -- create-booking
---
# Create Booking

## Intent
Create a confirmed booking for a selected active service and available slot.

## Input

| Field | Type | Required | Meaning |
|---|---|---:|---|
| `serviceId` | string | yes | Service being booked |
| `slotId` | string | yes | Slot to reserve |
| `customerName` | string | yes | Customer name |
| `customerEmail` | string | yes | Contact email |

## Rules
- Service must be active.
- Slot must exist and be `available`.
- Customer email must be valid.
- Duplicate submit must not create two bookings for the same slot.

## State Changes
- Slot changes from `available` to `booked`.
- Booking is created with status `confirmed`.

## Failure Cases
- Service inactive.
- Slot unavailable or already booked.
- Slot becomes booked after page load.
- Invalid email.
- Duplicate submit.
- Server error.

## QA
- given valid service and available slot / when submitted / then booking is confirmed and slot is booked
- given selected slot becomes booked / when submitted / then no booking is created and conflict is shown
