import { expect, test } from "@playwright/test";

test("booking detail exposes cancellation when policy allows", async ({ page }) => {
  await page.goto("/bookings/booking-confirmed-001");
  await expect(page.getByRole("heading", { name: "예약 상세" })).toBeVisible();
  await expect(page.getByRole("button", { name: "예약 취소" })).toBeVisible();
});
