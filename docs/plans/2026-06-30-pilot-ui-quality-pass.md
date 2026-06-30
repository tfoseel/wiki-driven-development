# Pilot UI Quality Pass Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Prove the WDD cadence can drive a more production-shaped pilot UI by planning mockups in the wiki first, then implementing and verifying the pages.

**Architecture:** Page wiki nodes own mockup paths and visible-state contracts. The Next.js pilot implements those contracts in route-local components and shared CSS. QA screenshots replace stale visual evidence after E2E passes.

**Tech Stack:** Next.js App Router, React server components, CSS, Playwright E2E, `@wdd/harness`.

---

### Task 1: Wiki Mockup Contract

**Files:**
- Create: `pilot/wiki/assets/mockups/pages/service-list.html`
- Create: `pilot/wiki/assets/mockups/pages/booking-new.html`
- Create: `pilot/wiki/assets/mockups/pages/booking-complete.html`
- Create: `pilot/wiki/assets/mockups/pages/booking-detail.html`
- Modify: `pilot/wiki/design/design-system.md`
- Modify: `pilot/wiki/pages/service-list.md`
- Modify: `pilot/wiki/pages/booking-new.md`
- Modify: `pilot/wiki/pages/booking-complete.md`
- Modify: `pilot/wiki/pages/booking-detail.md`

**Steps:**
1. Mark impacted page/design nodes as `coding/pending`.
2. Add mockup paths and page-level UI contracts.
3. Keep mockups as wiki artifacts, not app code.

### Task 2: Red Tests

**Files:**
- Modify: `pilot/app/tests/e2e/service-list.spec.ts`
- Modify: `pilot/app/tests/e2e/create-booking.spec.ts`
- Modify: `pilot/app/tests/e2e/cancel-booking.spec.ts`
- Modify: `pilot/app/tests/e2e/reschedule-booking.spec.ts`

**Steps:**
1. Add permanent E2E expectations for product UI structure: hero, panels, status badges, step/progress context, and primary actions.
2. Run targeted E2E to confirm the current thin UI fails.

### Task 3: Implement UI

**Files:**
- Modify: `pilot/app/src/app/globals.css`
- Modify: `pilot/app/src/app/services/_components/service-list-screen.tsx`
- Modify: `pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx`
- Modify: `pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx`
- Modify: `pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx`

**Steps:**
1. Implement a restrained booking app shell with dense but readable information.
2. Add state badges, grouped panels, form helper text, and visible workflow context.
3. Keep the UI domain-specific and avoid landing-page decoration.

### Task 4: Verification

**Commands:**
- `npm run e2e -w pilot-booking-app -- service-list create-booking cancel-booking reschedule-booking`
- `npm run test -w pilot-booking-app`
- `npm run qa -w pilot-booking-app`
- `npm run ready`

**Steps:**
1. Refresh QA screenshots.
2. Mark impacted wiki nodes as `verified/reflected/passed`.
3. Commit the UI quality pass.
