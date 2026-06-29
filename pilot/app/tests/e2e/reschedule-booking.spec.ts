import { expect, test } from "@playwright/test";

test("booking detail exposes reschedule when policy allows", async ({ page }) => {
  await page.goto("/bookings/booking-confirmed-001");
  await expect(page.getByRole("heading", { name: "Booking detail" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Reschedule booking" })).toBeVisible();
});
