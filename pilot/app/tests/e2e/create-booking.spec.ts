import { expect, test } from "@playwright/test";

test("new booking page shows available slots for a selected service", async ({ page }) => {
  await page.goto("/bookings/new?serviceId=consultation");
  await expect(page.getByRole("heading", { name: "새 예약" })).toBeVisible();
  await expect(page.getByTestId("selected-service")).toContainText("초기 상담");
  await expect(page.getByTestId("slot-select")).toBeVisible();
});
