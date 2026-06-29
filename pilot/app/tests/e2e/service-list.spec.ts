import { expect, test } from "@playwright/test";

test("service list shows active services", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { name: "Book a consultation" })).toBeVisible();
  await expect(page.getByTestId("service-card")).toHaveCount(2);
});
