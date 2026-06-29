---
id: ROOT
type: root
title: Mini Booking Pilot
summary: A small consultation booking app used to dogfood the WDD harness.
depends_on:
implemented_by:
verified_by:
artifacts:
verify:
---
# Mini Booking Pilot

## Purpose
This pilot proves that a small but complete product can be driven from wiki pages as the SSOT.

## User Journey
1. View available services.
2. Start a booking.
3. Choose a date and time slot.
4. Enter customer details.
5. Create the booking.
6. View booking details.
7. Reschedule or cancel according to policy.

## Core Nodes
- [[entities/services]]
- [[entities/availability-slots]]
- [[entities/bookings]]
- [[actions/create-booking]]
- [[actions/reschedule-booking]]
- [[actions/cancel-booking]]
- [[pages/service-list]]
- [[pages/wiki-browser]]
- [[pages/booking-new]]
- [[pages/booking-detail]]
- [[pages/booking-complete]]
- [[flows/create-booking-flow]]
- [[flows/manage-booking-flow]]
- [[policies/cancellation-policy]]
- [[qa/create-booking-e2e]]
- [[qa/reschedule-booking-e2e]]
- [[qa/cancel-booking-e2e]]
