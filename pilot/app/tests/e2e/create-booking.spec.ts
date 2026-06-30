import { expect, test } from "@playwright/test";

test("new booking page shows available slots for a selected service", async ({ page }) => {
  await page.goto("/bookings/new?serviceId=consultation");
  await expect(page.getByRole("heading", { name: "새 예약" })).toBeVisible();
  await expect(page.getByTestId("app-hero")).toContainText("예약 정보");
  await expect(page.getByTestId("booking-progress")).toContainText("1 / 3");
  await expect(page.getByTestId("booking-form-panel")).toBeVisible();
  await expect(page.getByTestId("selected-service")).toContainText("초기 상담");
  await expect(page.getByTestId("slot-select")).toBeVisible();
});

test("creating a booking with a customer note shows the note on completion and detail", async ({ page }) => {
  const note = "지난 상담 자료를 먼저 확인해 주세요.";
  await page.goto("/bookings/new?serviceId=follow-up&wddSeed=reset");
  await page.getByTestId("customer-name").fill("Jamie Lee");
  await page.getByTestId("customer-email").fill("jamie@example.com");
  await page.getByTestId("customer-note").fill(note);
  await page.getByRole("button", { name: "예약 생성" }).click();

  await expect(page).toHaveURL(/\/bookings\/complete\?bookingId=booking-\d+$/);
  await expect(page.getByRole("heading", { name: "예약 완료" })).toBeVisible();
  await expect(page.getByTestId("status-badge")).toContainText("confirmed");
  await expect(page.getByTestId("booking-summary-panel")).toBeVisible();
  await expect(page.getByTestId("customer-note")).toContainText(note);

  await page.getByRole("link", { name: "예약 관리" }).click();
  await expect(page.getByRole("heading", { name: "예약 상세" })).toBeVisible();
  await expect(page.getByTestId("customer-note")).toContainText(note);
});

test("creating a booking with a request photo shows the photo on completion and detail", async ({ page }) => {
  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII=",
    "base64"
  );

  await page.goto("/bookings/new?serviceId=follow-up&wddSeed=reset");
  await page.getByTestId("customer-name").fill("Jamie Lee");
  await page.getByTestId("customer-email").fill("jamie@example.com");
  await page.setInputFiles("[data-testid='request-photo-input']", {
    name: "request-room.png",
    mimeType: "image/png",
    buffer: tinyPng
  });
  await page.getByRole("button", { name: "예약 생성" }).click();

  await expect(page).toHaveURL(/\/bookings\/complete\?bookingId=booking-\d+$/);
  await expect(page.getByTestId("attached-photo")).toBeVisible();
  await expect(page.getByRole("img", { name: "request-room.png 첨부 사진" })).toBeVisible();

  await page.getByRole("link", { name: "예약 관리" }).click();
  await expect(page.getByRole("heading", { name: "예약 상세" })).toBeVisible();
  await expect(page.getByTestId("attached-photo")).toBeVisible();
  await expect(page.getByRole("img", { name: "request-room.png 첨부 사진" })).toBeVisible();
});
