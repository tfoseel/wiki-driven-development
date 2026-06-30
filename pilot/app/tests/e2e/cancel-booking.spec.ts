import { expect, test } from "@playwright/test";

test("booking detail exposes cancellation when policy allows", async ({ page }) => {
  await page.goto("/bookings/booking-confirmed-001");
  await expect(page.getByRole("heading", { name: "예약 상세" })).toBeVisible();
  await expect(page.getByTestId("app-hero")).toContainText("예약 관리");
  await expect(page.getByTestId("status-badge")).toContainText("confirmed");
  await expect(page.getByTestId("booking-summary-panel")).toBeVisible();
  await expect(page.getByRole("button", { name: "예약 취소" })).toBeVisible();
});
