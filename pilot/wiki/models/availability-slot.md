---
id: models/availability-slot
type: model
title: Availability Slot Model
summary: Domain validation for bookable time slots.
depends_on:
  - entities/availability-slots
  - models/service
implemented_by:
  - pilot/app/src/models/availability-slot.ts
verified_by:
  - pilot/app/src/models/availability-slot.test.ts
artifacts:
  - pilot/app/src/models/availability-slot.ts
verify:
  - npm run test -w pilot-booking-app -- availability-slot
---
# Availability Slot Model

## Meaning
The slot model tells pages and actions whether a customer can reserve a time.

## Validation
- `startsAt` must be a valid ISO datetime with timezone.
- `status` must be `available`, `booked`, or `unavailable`.
- `serviceId` must identify a known service.

## Examples
- Valid: available consultation slot tomorrow.
- Blocked: unavailable slot shown but not selectable.
- Race-like: selected slot becomes booked before submit.
