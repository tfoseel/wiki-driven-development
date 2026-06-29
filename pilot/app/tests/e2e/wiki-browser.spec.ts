import { expect, test } from "@playwright/test";

test("wiki root shows the Korean pilot SSOT and node tabs", async ({ page }) => {
  await page.goto("/wiki");

  await expect(page.getByRole("heading", { name: "미니 예약 파일럿" })).toBeVisible();
  await expect(page.getByText("이 파일럿은 작지만 완결된 제품을 위키 페이지를 SSOT로 삼아 운영할 수 있는지 검증한다.")).toBeVisible();
  await expect(page.getByRole("tab", { name: "액션 3" })).toBeVisible();
  await expect(page.getByRole("link", { name: "위키 브라우저 pages/wiki-browser" })).toBeVisible();
});

test("wiki node tabs filter the index by type", async ({ page }) => {
  await page.goto("/wiki");
  await page.getByRole("tab", { name: "액션 3" }).click();

  await expect(page).toHaveURL(/type=action/);
  await expect(page.getByRole("link", { name: "예약 취소 actions/cancel-booking" })).toBeVisible();
  await expect(page.getByRole("link", { name: "서비스 entities/services" })).toHaveCount(0);
});

test("nested wiki nodes show metadata and referenced code", async ({ page }) => {
  await page.goto("/wiki/actions/cancel-booking");

  await expect(page.getByRole("heading", { name: "예약 취소" })).toBeVisible();
  await expect(page.getByText("확정 또는 일정 변경된 예약을 취소하고 해당 슬롯을 다시 예약 가능 상태로 만든다.")).toBeVisible();
  await expect(page.getByText("pilot/app/src/actions/cancel-booking.ts")).toBeVisible();
});

test("home links to the pilot wiki", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "파일럿 위키 열기" }).click();

  await expect(page).toHaveURL(/\/wiki$/);
  await expect(page.getByRole("heading", { name: "미니 예약 파일럿" })).toBeVisible();
});
