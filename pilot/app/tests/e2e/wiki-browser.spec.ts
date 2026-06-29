import { expect, test } from "@playwright/test";

test("wiki root shows the pilot SSOT and node index", async ({ page }) => {
  await page.goto("/wiki");

  await expect(page.getByRole("heading", { name: "Mini Booking Pilot" })).toBeVisible();
  await expect(page.getByText("This pilot proves that a small but complete product can be driven from wiki pages as the SSOT.")).toBeVisible();
  await expect(page.getByRole("link", { name: "Wiki Browser" })).toBeVisible();
});

test("nested wiki nodes show metadata and referenced code", async ({ page }) => {
  await page.goto("/wiki/actions/cancel-booking");

  await expect(page.getByRole("heading", { name: "Cancel Booking" })).toBeVisible();
  await expect(page.getByText("Cancel a confirmed or rescheduled booking and make the slot available again.")).toBeVisible();
  await expect(page.getByText("pilot/app/src/actions/cancel-booking.ts")).toBeVisible();
});

test("home links to the pilot wiki", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Open pilot wiki" }).click();

  await expect(page).toHaveURL(/\/wiki$/);
  await expect(page.getByRole("heading", { name: "Mini Booking Pilot" })).toBeVisible();
});
