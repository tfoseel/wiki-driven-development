---
id: models/booking
type: model
title: Booking Model
summary: Domain validation and state model for bookings.
depends_on:
  - entities/bookings
  - models/service
  - models/availability-slot
implemented_by:
  - pilot/app/src/models/booking.ts
verified_by:
  - pilot/app/src/models/booking.test.ts
artifacts:
  - pilot/app/src/models/booking.ts
verify:
  - npm run test -w pilot-booking-app -- booking
---
# Booking Model

## Meaning
The booking model joins customer contact details, selected service, selected slot, and lifecycle status.

## Validation
- `customerName` is required.
- `customerEmail` must be a valid email address.
- `status` must be `confirmed`, `rescheduled`, or `cancelled`.
- Cancelled bookings are read-only except for display.

## State Examples
- `confirmed`: newly created booking.
- `rescheduled`: booking moved to a different slot.
- `cancelled`: booking released its slot.
