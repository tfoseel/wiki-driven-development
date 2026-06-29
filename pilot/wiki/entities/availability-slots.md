---
id: entities/availability-slots
type: entity
title: Availability Slots
summary: Time slots that can be booked by customers.
depends_on:
  - entities/services
implemented_by:
  - pilot/app/src/lib/seed-store.ts
verified_by:
  - pilot/app/src/models/availability-slot.test.ts
artifacts:
  - pilot/app/src/lib/seed-store.ts
verify:
  - npm run test -w pilot-booking-app -- availability-slot
---
# Availability Slots

## Meaning
An availability slot represents a bookable time for one service.

## Fields

| Field | Type | Meaning | Rules |
|---|---|---|---|
| `id` | string | Stable slot identifier | Required |
| `serviceId` | string | Service offered in this slot | Must reference [[entities/services]] |
| `startsAt` | ISO datetime | Slot start | Must include timezone |
| `status` | enum | `available`, `booked`, or `unavailable` | Only `available` can be booked |

## Status Rules
- `available`: can be selected for a new or rescheduled booking.
- `booked`: already owned by an active booking.
- `unavailable`: blocked by operator or schedule.

## Edge Cases
- A slot can become `booked` after the customer has selected it.
- A slot at a date boundary must still respect its timezone.
