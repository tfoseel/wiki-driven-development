import { expect, test } from "@playwright/test";

test("new booking page shows available slots for a selected service", async ({ page }) => {
  await page.goto("/bookings/new?serviceId=consultation");
  await expect(page.getByRole("heading", { name: "New booking" })).toBeVisible();
  await expect(page.getByTestId("selected-service")).toContainText("Initial consultation");
  await expect(page.getByTestId("slot-select")).toBeVisible();
});
