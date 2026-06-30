# Booking Request Photo Attachment Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Let the mini booking pilot attach one demo photo to a booking request and view it on the booking complete and detail screens.

**Architecture:** The booking record owns a small optional request photo object containing the original file name, MIME type, and base64 data URL. The new booking server action converts a browser `File` into that object before calling the domain action. The UI remains server-rendered and only conditionally renders a photo panel when a booking has an attachment.

**Tech Stack:** Next.js server actions, React server components, TypeScript, Zod, Vitest, Playwright, WDD wiki metadata.

---

### Task 1: Add GitHub Issue And Product Wiki Contract

**Files:**
- Create: GitHub issue from `.github/ISSUE_TEMPLATE/wdd-change.md`
- Modify: `pilot/wiki/entities/bookings.md`
- Modify: `pilot/wiki/models/booking.md`
- Modify: `pilot/wiki/actions/create-booking.md`
- Modify: `pilot/wiki/pages/booking-new.md`
- Modify: `pilot/wiki/pages/booking-complete.md`
- Modify: `pilot/wiki/pages/booking-detail.md`
- Modify: `pilot/wiki/flows/create-booking-flow.md`
- Modify: `pilot/wiki/qa/create-booking-e2e.md`

**Step 1: Create or update the GitHub issue**

Create a WDD change issue with the target product wiki nodes and proposed patches for the affected nodes.

The issue should state:

- One optional photo can be attached on the new booking page.
- Supported types are PNG, JPEG, and WebP.
- The pilot stores the selected photo as a data URL on the booking record.
- The complete and detail pages show an `첨부 사진` section when present.
- Real object storage, multiple photos, and image editing are excluded.

**Step 2: Patch the product wiki nodes**

Update each impacted product node to `wdd_status.phase: coding`, `code: pending`, `verification: pending`.

Use these product contract changes:

- `entities/bookings`: add optional `requestPhoto` field with name, type, and data URL.
- `models/booking`: add validation rules for optional request photo.
- `actions/create-booking`: add optional `requestPhoto` input and invalid upload failure case.
- `pages/booking-new`: add photo input below request note.
- `pages/booking-complete`: show attached photo when present.
- `pages/booking-detail`: show attached photo when present.
- `flows/create-booking-flow`: pass `requestPhoto?` from new booking to create action and view it on completion.
- `qa/create-booking-e2e`: add photo attachment scenario.

**Step 3: Run impact**

Run:

```bash
npm run wdd -- impact pilot/wiki actions/create-booking
npm run wdd -- impact pilot/wiki pages/booking-new
```

Expected: the output includes the affected wiki nodes and the model/action/page/E2E code files for booking creation.

**Step 4: Commit the wiki contract**

```bash
git add pilot/wiki/entities/bookings.md pilot/wiki/models/booking.md pilot/wiki/actions/create-booking.md pilot/wiki/pages/booking-new.md pilot/wiki/pages/booking-complete.md pilot/wiki/pages/booking-detail.md pilot/wiki/flows/create-booking-flow.md pilot/wiki/qa/create-booking-e2e.md
git commit -m "docs: specify booking request photo attachment"
```

### Task 2: Add Booking Request Photo Model

**Files:**
- Modify: `pilot/app/src/models/booking.test.ts`
- Modify: `pilot/app/src/models/booking.ts`

**Step 1: Write failing model tests**

Add tests:

```ts
it("accepts one valid request photo", () => {
  expect(
    BookingSchema.parse({
      id: "booking-1",
      serviceId: "consultation",
      slotId: "slot-1",
      customerName: "Alex Kim",
      customerEmail: "alex@example.com",
      requestPhoto: {
        name: "room.png",
        type: "image/png",
        dataUrl: "data:image/png;base64,aGVsbG8="
      },
      status: "confirmed"
    })
  ).toMatchObject({ requestPhoto: { name: "room.png", type: "image/png" } });
});

it("rejects unsupported request photo types", () => {
  expect(() =>
    BookingSchema.parse({
      id: "booking-1",
      serviceId: "consultation",
      slotId: "slot-1",
      customerName: "Alex Kim",
      customerEmail: "alex@example.com",
      requestPhoto: {
        name: "notes.txt",
        type: "text/plain",
        dataUrl: "data:text/plain;base64,aGVsbG8="
      },
      status: "confirmed"
    })
  ).toThrow();
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w pilot-booking-app -- booking.test.ts
```

Expected: FAIL because `requestPhoto` is not yet in the booking schema.

**Step 3: Implement minimal model code**

In `pilot/app/src/models/booking.ts`, add:

```ts
export const RequestPhotoTypeSchema = z.enum(["image/png", "image/jpeg", "image/webp"]);

export const BookingRequestPhotoSchema = z
  .object({
    name: z.string().min(1).max(120),
    type: RequestPhotoTypeSchema,
    dataUrl: z.string().min(1)
  })
  .refine((photo) => photo.dataUrl.startsWith(`data:${photo.type};base64,`), {
    message: "Photo data URL must match the MIME type"
  });
```

Add `requestPhoto: BookingRequestPhotoSchema.optional()` to `BookingSchema`.

**Step 4: Run test to verify it passes**

Run:

```bash
npm run test -w pilot-booking-app -- booking.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add pilot/app/src/models/booking.ts pilot/app/src/models/booking.test.ts
git commit -m "feat: model booking request photos"
```

### Task 3: Store Request Photos In Create Booking

**Files:**
- Modify: `pilot/app/src/actions/create-booking.test.ts`
- Modify: `pilot/app/src/actions/create-booking.ts`
- Modify: `pilot/app/src/lib/seed-store.ts`

**Step 1: Write failing action tests**

Add a valid photo test:

```ts
it("stores a valid request photo with the booking", async () => {
  const result = await createBooking({
    serviceId: "follow-up",
    slotId: "slot-follow-up-tomorrow-1400",
    customerName: "Jamie Lee",
    customerEmail: "jamie@example.com",
    requestPhoto: {
      name: "desk.png",
      type: "image/png",
      dataUrl: "data:image/png;base64,aGVsbG8="
    }
  });

  expect(result.ok).toBe(true);
  if (!result.ok) return;
  expect(result.booking.requestPhoto).toMatchObject({ name: "desk.png", type: "image/png" });
  expect(getBooking(result.booking.id)?.requestPhoto?.dataUrl).toBe("data:image/png;base64,aGVsbG8=");
});
```

Add an unsupported photo test:

```ts
it("rejects unsupported request photo types", async () => {
  const result = await createBooking({
    serviceId: "follow-up",
    slotId: "slot-follow-up-tomorrow-1400",
    customerName: "Jamie Lee",
    customerEmail: "jamie@example.com",
    requestPhoto: {
      name: "notes.txt",
      type: "text/plain",
      dataUrl: "data:text/plain;base64,aGVsbG8="
    }
  });

  expect(result).toMatchObject({ ok: false, code: "invalid_input" });
});
```

**Step 2: Run test to verify it fails**

Run:

```bash
npm run test -w pilot-booking-app -- create-booking.test.ts
```

Expected: FAIL because `CreateBookingInputSchema` does not accept `requestPhoto` and the seed store does not persist it.

**Step 3: Implement minimal action/store code**

In `pilot/app/src/actions/create-booking.ts`, import `BookingRequestPhotoSchema` and add `requestPhoto: BookingRequestPhotoSchema.optional()` to `CreateBookingInputSchema`.

In `pilot/app/src/lib/seed-store.ts`, copy `requestPhoto: input.requestPhoto` into the created booking.

**Step 4: Run test to verify it passes**

Run:

```bash
npm run test -w pilot-booking-app -- create-booking.test.ts
```

Expected: PASS.

**Step 5: Commit**

```bash
git add pilot/app/src/actions/create-booking.ts pilot/app/src/actions/create-booking.test.ts pilot/app/src/lib/seed-store.ts
git commit -m "feat: store booking request photos"
```

### Task 4: Convert Browser File Input In The New Booking Route

**Files:**
- Modify: `pilot/app/src/app/bookings/new/page.tsx`
- Modify: `pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx`

**Step 1: Write the UI contract in E2E first**

In `pilot/app/tests/e2e/create-booking.spec.ts`, extend the note scenario or add a new scenario that:

- Visits `/bookings/new?serviceId=follow-up&wddSeed=reset`.
- Sets `request-photo` input to a tiny PNG fixture generated in test code.
- Submits the form.
- Expects the complete screen to show `attached-photo`.
- Navigates to detail and expects `attached-photo` again.

Use `page.setInputFiles("[data-testid='request-photo-input']", { name, mimeType, buffer })`.

**Step 2: Run E2E to verify it fails**

Run:

```bash
npm run e2e -w pilot-booking-app -- create-booking
```

Expected: FAIL because the file input and photo rendering do not exist yet.

**Step 3: Add the file input**

In `BookingNewScreen`, add below the `customerNote` textarea:

```tsx
<label className="field">
  <span>사진 첨부</span>
  <input
    name="requestPhoto"
    type="file"
    accept="image/png,image/jpeg,image/webp"
    data-testid="request-photo-input"
  />
</label>
```

**Step 4: Convert `FormData` file to a request photo object**

In `pilot/app/src/app/bookings/new/page.tsx`, add helper functions:

```ts
const supportedPhotoTypes = ["image/png", "image/jpeg", "image/webp"] as const;
const maxRequestPhotoBytes = 512 * 1024;

async function requestPhotoFromFormData(formData: FormData) {
  const value = formData.get("requestPhoto");
  if (!(value instanceof File) || value.size === 0) return undefined;
  if (!supportedPhotoTypes.includes(value.type as (typeof supportedPhotoTypes)[number])) return "invalid";
  if (value.size > maxRequestPhotoBytes) return "invalid";

  const bytes = Buffer.from(await value.arrayBuffer());
  return {
    name: value.name,
    type: value.type as (typeof supportedPhotoTypes)[number],
    dataUrl: `data:${value.type};base64,${bytes.toString("base64")}`
  };
}
```

Call the helper in `submitBooking`; if it returns `"invalid"`, redirect with `error=invalid_input`; otherwise pass `requestPhoto` into `createBooking`.

**Step 5: Run E2E again**

Run:

```bash
npm run e2e -w pilot-booking-app -- create-booking
```

Expected: still FAIL until display panels are added.

### Task 5: Show Request Photos On Complete And Detail Screens

**Files:**
- Modify: `pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx`
- Modify: `pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx`
- Modify: `pilot/app/src/app/globals.css`
- Modify: `pilot/app/tests/e2e/create-booking.spec.ts`

**Step 1: Add photo panels**

On both complete and detail screens, render this section when `booking.requestPhoto` exists:

```tsx
{booking.requestPhoto ? (
  <section className="photo-panel" data-testid="attached-photo">
    <h2>첨부 사진</h2>
    <img src={booking.requestPhoto.dataUrl} alt={`${booking.requestPhoto.name} 첨부 사진`} />
  </section>
) : null}
```

**Step 2: Add restrained image CSS**

In `globals.css`, add:

```css
.photo-panel {
  display: grid;
  gap: 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
  padding: 18px;
}

.photo-panel h2 {
  margin: 0;
  font-size: 1.1rem;
}

.photo-panel img {
  display: block;
  width: min(100%, 520px);
  max-height: 360px;
  border-radius: 8px;
  object-fit: contain;
  background: var(--surface-muted);
}
```

**Step 3: Run E2E to verify it passes**

Run:

```bash
npm run e2e -w pilot-booking-app -- create-booking
```

Expected: PASS.

**Step 4: Commit UI and route conversion**

```bash
git add pilot/app/src/app/bookings/new/page.tsx pilot/app/src/app/bookings/new/_components/booking-new-screen.tsx pilot/app/src/app/bookings/complete/_components/booking-complete-screen.tsx 'pilot/app/src/app/bookings/[id]/_components/booking-detail-screen.tsx' pilot/app/src/app/globals.css pilot/app/tests/e2e/create-booking.spec.ts
git commit -m "feat: show booking request photos"
```

### Task 6: Verify And Refresh WDD Evidence

**Files:**
- Modify: impacted `pilot/wiki/assets/screenshots/pages/*.png`
- Modify: impacted wiki node statuses after verification
- Modify: linked GitHub issue/PR evidence

**Step 1: Run focused unit tests**

Run:

```bash
npm run test -w pilot-booking-app -- booking create-booking
```

Expected: PASS.

**Step 2: Run focused E2E**

Run:

```bash
npm run e2e -w pilot-booking-app -- create-booking
```

Expected: PASS.

**Step 3: Refresh screenshots**

Run:

```bash
npm run wiki:screenshots -w pilot-booking-app
```

Expected: page screenshots are updated for affected booking pages.

**Step 4: Run WDD checks**

Run:

```bash
npm run wdd -- status pilot/wiki
npm run wdd -- drift pilot/wiki
npm run wdd -- ready
```

Expected: no unresolved drift for the photo attachment nodes. If unrelated pre-existing dirty work causes output noise, document it in the final response.

**Step 5: Mark wiki nodes verified**

After tests and screenshots pass, set affected product nodes back to:

```yaml
wdd_status:
  phase: verified
  code: reflected
  verification: passed
```

Update the linked GitHub issue/PR with the verification commands and screenshot evidence.

**Step 6: Commit verification state**

```bash
git add pilot/wiki pilot/app
git commit -m "chore: verify booking request photo attachment"
```
