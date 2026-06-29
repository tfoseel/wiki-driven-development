import { expect, test } from "@playwright/test";

test("new booking page shows available slots for a selected service", async ({ page }) => {
  await page.goto("/bookings/new?serviceId=consultation");
  await expect(page.getByRole("heading", { name: "새 예약" })).toBeVisible();
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
  await expect(page.getByTestId("customer-note")).toContainText(note);

  await page.getByRole("link", { name: "예약 관리" }).click();
  await expect(page.getByRole("heading", { name: "예약 상세" })).toBeVisible();
  await expect(page.getByTestId("customer-note")).toContainText(note);
});
