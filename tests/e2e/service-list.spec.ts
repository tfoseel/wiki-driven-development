import { expect, test } from "@playwright/test";

test("service list shows active services", async ({ page }) => {
  await page.goto("/services");
  await expect(page.getByRole("heading", { name: "상담 예약하기" })).toBeVisible();
  await expect(page.getByTestId("app-hero")).toContainText("상담 예약");
  await expect(page.getByTestId("service-grid")).toBeVisible();
  await expect(page.getByTestId("service-card")).toHaveCount(2);
  await expect(page.getByRole("link", { name: "예약 시작" })).toHaveCount(2);
});
