import { expect, test } from "@playwright/test";

test("home links to the booking flow", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "서비스 선택하기" })).toHaveAttribute("href", "/services");
});

test("product app does not serve wiki markdown", async ({ page }) => {
  const response = await page.goto("/wiki");

  expect(response?.status()).toBe(404);
});
