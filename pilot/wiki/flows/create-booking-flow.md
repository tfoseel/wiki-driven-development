---
id: flows/create-booking-flow
type: flow
title: Create Booking Flow
summary: Service selection through booking confirmation.
depends_on:
  - pages/service-list
  - pages/booking-new
  - pages/booking-complete
  - actions/create-booking
implemented_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
verified_by:
  - pilot/app/tests/e2e/create-booking.spec.ts
artifacts:
  - pilot/app/tests/e2e/create-booking.spec.ts
verify:
  - npm run e2e -w pilot-booking-app -- create-booking
---
# Create Booking Flow

## Intent
Guide a customer from choosing a service to seeing a confirmed booking.

## Steps
1. Start at [[pages/service-list]].
2. Choose a service and move to [[pages/booking-new]].
3. Submit [[actions/create-booking]].
4. Arrive at [[pages/booking-complete]].

## Handoff Contract

| From | To | Data | Assertion |
|---|---|---|---|
| [[pages/service-list]] | [[pages/booking-new]] | `serviceId` | New booking page loads selected service |
| [[pages/booking-new]] | [[pages/booking-complete]] | `bookingId` | Complete page loads created booking |

## Flow QA
- given active service and available slot / when customer completes form / then confirmation appears
- given slot becomes booked before submit / when customer submits / then conflict is shown and no confirmation appears
