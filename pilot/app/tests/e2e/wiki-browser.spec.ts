import { expect, test } from "@playwright/test";

test("wiki root shows the node index and type tabs", async ({ page }) => {
  await page.goto("/wiki");

  await expect(page.locator(".wiki-article h1")).toBeVisible();
  await expect(page.getByRole("tablist", { name: "위키 노드 유형" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "액션 3" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "화면 4" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "디자인 1" })).toBeVisible();
  await expect(page.getByRole("link", { name: "위키 브라우저 pages/wiki-browser" })).toHaveCount(0);
});

test("wiki node tabs filter the index by type", async ({ page }) => {
  await page.goto("/wiki");
  await page.getByRole("tab", { name: "액션 3" }).click();

  await expect(page).toHaveURL(/type=action/);
  const visibleTypes = await page.locator(".wiki-node-link .wiki-type").allTextContents();
  expect(visibleTypes.length).toBeGreaterThan(0);
  expect(visibleTypes.every((type) => type === "action")).toBe(true);
});

test("wiki design tab filters the index by design nodes", async ({ page }) => {
  await page.goto("/wiki?type=design");

  await expect(page.getByRole("tab", { name: "디자인 1" })).toHaveAttribute("aria-selected", "true");
  const visibleTypes = await page.locator(".wiki-node-link .wiki-type").allTextContents();
  expect(visibleTypes).toEqual(["design"]);
});

test("detail pages show workflow status and references", async ({ page }) => {
  await page.goto("/wiki?type=action");
  await page.locator(".wiki-node-link").first().click();

  await expect(page).toHaveURL(/\/wiki\/actions\//);
  await expect(page.locator(".wiki-article h1")).toBeVisible();
  await expect(page.getByRole("heading", { name: "작업 정합성" })).toBeVisible();
  await expect(page.getByText("현재 phase: 검증 완료")).toBeVisible();
  await expect(page.getByText("코드 반영됨")).toBeVisible();
  await expect(page.getByText("검증 통과")).toBeVisible();
  await expect(page.getByRole("heading", { name: "구현" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "검증" })).toBeVisible();
});

test("wiki markdown tables render as real tables", async ({ page }) => {
  await page.goto("/wiki?type=entity");
  await page.locator(".wiki-node-link").first().click();

  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "필드" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "타입" })).toBeVisible();
});

test("home links to the wiki", async ({ page }) => {
  await page.goto("/");
  await page.locator('a[href="/wiki"]').click();

  await expect(page).toHaveURL(/\/wiki$/);
  await expect(page.locator(".wiki-article h1")).toBeVisible();
});
