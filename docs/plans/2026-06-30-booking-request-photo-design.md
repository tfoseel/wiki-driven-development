# Booking Request Photo Attachment Design

Date: 2026-06-30

## Purpose

Allow the mini booking pilot to demonstrate attaching one photo to the optional booking request. The photo is added on the new booking page and can be viewed after the booking is created.

## Chosen Approach

Use a demo-friendly single image attachment stored directly on the booking record as a data URL.

This avoids real object storage, upload infrastructure, and deployment-specific file writes while still letting the user select a real image and view it on the booking confirmation and detail screens.

## Scope

Included:

- Add one optional photo input to the new booking form near the request note.
- Accept `image/png`, `image/jpeg`, and `image/webp`.
- Convert the selected file to a data URL in the create booking server action.
- Store attachment metadata on the booking model: file name, MIME type, and data URL.
- Show the attached photo on the booking complete and booking detail screens.
- Add model, action, and E2E coverage for the attachment path.

Excluded:

- Multiple photos.
- Persistent file storage, upload directories, object storage, or CDN behavior.
- Image editing, cropping, or compression UI.
- Photo attachments on reschedule or cancellation actions.

## Product Wiki Impact

The change should be captured through a GitHub issue and then reflected into these product nodes on the implementation branch:

- `entities/bookings`
- `models/booking`
- `actions/create-booking`
- `pages/booking-new`
- `pages/booking-complete`
- `pages/booking-detail`
- `flows/create-booking-flow`
- `qa/create-booking-e2e`

## Data Contract

Add an optional booking field:

```ts
type BookingRequestPhoto = {
  name: string;
  type: "image/png" | "image/jpeg" | "image/webp";
  dataUrl: string;
};
```

Validation rules:

- Attachment is optional.
- Only one file is accepted.
- Empty file input is treated as no attachment.
- MIME type must be PNG, JPEG, or WebP.
- The data URL must start with the matching `data:<type>;base64,` prefix.
- A small size limit should be enforced for the pilot so tests and screenshots stay stable.

## UI Flow

On `pages/booking-new`, add a photo file input below the request note. The form should keep the current service, slot, contact, request note, and submit order intact.

On `pages/booking-complete` and `pages/booking-detail`, show an "첨부 사진" section only when the booking has an attachment. The section displays the actual image with useful alt text derived from the file name.

## Error Handling

If the uploaded file has an unsupported type or exceeds the pilot size limit, `actions/create-booking` returns `invalid_input`. The existing new booking redirect/error path is sufficient for the first pass.

## Verification

Focused checks:

- Booking model accepts a valid request photo.
- Booking model rejects unsupported image types or malformed data URLs.
- Create booking stores a valid uploaded photo with the booking.
- Create booking rejects unsupported uploads.
- E2E creates a booking with a photo and sees the photo on the complete and detail screens.

Regression checks:

- Creating a booking without a note or photo still works.
- Existing request note behavior still works.
- Calendar download and booking management links remain visible on the complete screen.
