# Booking Customer Note Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add an optional customer note to the pilot booking flow to verify that WDD changes propagate from wiki nodes through model, action, page, E2E, and QA screenshots.

**Architecture:** The wiki remains the SSOT. The feature starts in impacted wiki nodes, then permanent tests define the desired behavior, then the Next.js pilot code is updated minimally to satisfy those contracts.

**Tech Stack:** Next.js App Router, React Server Components, server actions, Zod, Vitest, Playwright, `@wdd/harness`.

---

### Task 1: Wiki Contract

**Files:**
- Modify: `pilot/wiki/models/booking.md`
- Modify: `pilot/wiki/entities/bookings.md`
- Modify: `pilot/wiki/actions/create-booking.md`
- Modify: `pilot/wiki/pages/booking-new.md`
- Modify: `pilot/wiki/pages/booking-complete.md`
- Modify: `pilot/wiki/pages/booking-detail.md`
- Modify: `pilot/wiki/flows/create-booking-flow.md`
- Modify: `pilot/wiki/qa/create-booking-e2e.md`
- Modify: `pilot/wiki/design/design-system.md`

**Steps:**
1. Document optional `customerNote` on the booking entity and model.
2. Document `customerNote` as optional input to `create-booking`.
3. Document textarea entry on the new booking page.
4. Document note display on completion and detail pages.
5. Add the E2E expectation that a submitted note is visible after creation.

### Task 2: Failing Tests

**Files:**
- Modify: `pilot/app/src/models/booking.test.ts`
- Modify: `pilot/app/src/actions/create-booking.test.ts`
- Modify: `pilot/app/tests/e2e/create-booking.spec.ts`

**Steps:**
1. Add a model test that accepts a booking with `customerNote`.
2. Add an action test that persists `customerNote`.
3. Add an E2E test that fills the form, submits it, and sees the note on the completion page.
4. Run targeted tests and confirm they fail because the feature is not implemented yet.

### Task 3: Implementation

**Files:**
- Modify: `pilot/app/src/models/booking.ts`
- Modify: `pilot/app/src/lib/seed-store.ts`
- Modify: `pilot/app/src/actions/create-booking.ts`
- Modify: `pilot/app/src/app/bookings/new/page.tsx`
- Modify: `pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx`
- Modify: `pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx`
- Modify: `pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx`

**Steps:**
1. Add optional trimmed note validation to the booking schema and create action.
2. Preserve the note in the seed store.
3. Wire the booking form to a server action and redirect to the completion page on success.
4. Let E2E mutation scenarios reset the pilot seed store through `wddSeed=reset` on the booking page, so repeated QA runs stay deterministic.
4. Render the note on completion and detail pages when present.

### Task 4: Verification And Screenshots

**Commands:**
- `npm run test -w pilot-booking-app -- booking create-booking`
- `npm run e2e -w pilot-booking-app -- create-booking`
- `npm run test -w pilot-booking-app`
- `npm run test -w @wdd/harness`
- `npm run build -w @wdd/harness`
- `npm run build -w pilot-booking-app`
- `npm run qa -w pilot-booking-app`
- `npm run wdd -- status pilot/wiki && npm run wdd -- drift pilot/wiki .`

**Steps:**
1. Keep only permanent tests that verify wiki-backed behavior.
2. Refresh QA screenshots through the existing `qa` script.
3. End with all impacted wiki nodes in `verified/reflected/passed`.
