---
id: qa/create-booking-e2e
type: qa
title: Create Booking E2E
summary: End-to-end scenarios for creating bookings.
depends_on:
  - flows/create-booking-flow
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
# Create Booking E2E

## Coverage Model
- Happy path.
- No available slots.
- Slot becomes booked after selection.
- Invalid customer email.
- Duplicate submit.
- Service inactive.
- Server error.

## Scenarios
- given active service and available slot / when valid contact is submitted / then booking is confirmed
- given no available slots / when new booking page loads / then no submit button is enabled
- given slot becomes booked after selection / when submitted / then conflict is shown
- given invalid email / when submitted / then field error is shown and no booking is created
- given duplicate submit / when button is clicked twice / then one booking is created
