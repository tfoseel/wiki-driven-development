---
id: models/service
type: model
title: Service Model
summary: Domain validation for bookable services.
depends_on:
  - entities/services
implemented_by:
  - pilot/app/src/models/service.ts
verified_by:
  - pilot/app/src/models/service.test.ts
artifacts:
  - pilot/app/src/models/service.ts
verify:
  - npm run test -w pilot-booking-app -- service
---
# Service Model

## Meaning
The service model is the customer-facing service shape used by pages and actions.

## Validation
- `id`, `name`, and `durationMinutes` are required.
- `durationMinutes` must be greater than zero.
- Inactive services can be shown in existing bookings but cannot start a new booking.

## Examples
- Valid: active 45-minute consultation.
- Invalid: active service with zero duration.
- Boundary: inactive service displayed in a cancelled old booking.
