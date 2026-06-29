---
id: pages/service-list
type: page
title: Service List
summary: Entry page where customers choose a service to book.
depends_on:
  - models/service
implemented_by:
  - pilot/app/src/app/services/page.tsx
verified_by:
  - pilot/app/tests/e2e/service-list.spec.ts
artifacts:
  - pilot/app/src/screens/service-list/screen.tsx
verify:
  - npm run e2e -w pilot-booking-app -- service-list
---
# Service List

## Description
Shows active services and lets the customer start a new booking.

## Conditions
- Inactive services are hidden from new booking entry.
- If no active services exist, show an empty state.

## User Actions
- Select a service.
- Start [[pages/booking-new]] with selected `serviceId`.

## Visible States And Exceptions

| Condition | Rendered State | Seed |
|---|---|---|
| Active services exist | Service cards and start buttons | seed-services-normal |
| No active services | Empty state with support copy | seed-services-empty |
| Load error | Error message and retry | seed-services-error |

## Navigation And Handoff
- To [[pages/booking-new]]: pass `serviceId`.

## Independent QA
- given seed-services-normal / when service is selected / then new booking page receives service id
- given seed-services-empty / when page loads / then no start button is shown
