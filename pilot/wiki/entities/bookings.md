---
id: entities/bookings
type: entity
title: Bookings
summary: Customer reservations for service slots.
depends_on:
  - entities/services
  - entities/availability-slots
implemented_by:
  - pilot/app/src/lib/seed-store.ts
verified_by:
  - pilot/app/src/models/booking.test.ts
artifacts:
  - pilot/app/src/lib/seed-store.ts
verify:
  - npm run test -w pilot-booking-app -- booking
---
# Bookings

## Meaning
A booking records that a customer reserved a service slot.

## Fields

| Field | Type | Meaning | Rules |
|---|---|---|---|
| `id` | string | Stable booking identifier | Required |
| `serviceId` | string | Booked service | Must reference [[entities/services]] |
| `slotId` | string | Reserved slot | Must reference [[entities/availability-slots]] |
| `customerName` | string | Customer name | Required |
| `customerEmail` | string | Contact email | Must be valid email |
| `status` | enum | `confirmed`, `rescheduled`, or `cancelled` | Drives available actions |

## Lifecycle
- New bookings start as `confirmed`.
- Rescheduled bookings keep the same booking id and move to a new slot.
- Cancelled bookings release their slot and cannot be cancelled again.
