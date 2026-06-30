import { expect, test } from "@playwright/test";

test("home links to the separate wiki browser app", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("link", { name: "파일럿 위키 열기" })).toHaveAttribute("href", "http://127.0.0.1:3002/wiki");
  await expect(page.getByRole("link", { name: "서비스 선택하기" })).toHaveAttribute("href", "/services");
});

test("product app does not serve the wiki browser", async ({ page }) => {
  const response = await page.goto("/wiki");

  expect(response?.status()).toBe(404);
});
