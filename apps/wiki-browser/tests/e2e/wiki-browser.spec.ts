import { expect, test } from "@playwright/test";

test("wiki root shows the node index and type tabs", async ({ page }) => {
  await page.goto("/wiki");

  await expect(page.locator(".wiki-article h1")).toBeVisible();
  await expect(page.getByRole("tablist", { name: "위키 노드 유형" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "액션 3" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "화면 4" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "디자인 1" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "작업 1" })).toHaveCount(0);
  await expect(page.locator(".wiki-index .wiki-node-link .wiki-type")).toHaveCount(0);
});

test("wiki node tabs use static type routes", async ({ page }) => {
  await page.goto("/wiki");
  await page.getByRole("tab", { name: "액션 3" }).click();

  await expect(page).toHaveURL(/\/wiki\/type\/action\/?$/);
  const index = page.locator(".wiki-index");
  await expect(index.getByRole("link", { name: "예약 생성" })).toBeVisible();
  await expect(index.getByRole("link", { name: "예약 일정 변경" })).toBeVisible();
  await expect(index.getByRole("link", { name: "예약 취소" })).toBeVisible();
  await expect(index.getByRole("link", { name: /actions\/cancel-booking/ })).toHaveCount(0);
  await expect(index.getByRole("link", { name: "서비스 목록" })).toHaveCount(0);
});

test("detail pages infer their selected type without query strings", async ({ page }) => {
  await page.goto("/wiki/actions/create-booking");

  await expect(page).toHaveURL(/\/wiki\/actions\/create-booking\/?$/);
  await expect(page.locator(".wiki-article h1")).toHaveText("예약 생성");
  await expect(page.getByRole("tab", { name: "액션 3" })).toHaveAttribute("aria-selected", "true");
  const header = page.locator(".wiki-article header");
  await expect(header.getByRole("link", { name: "미니 예약 파일럿" })).toHaveCount(0);
  await expect(header.locator(".wiki-type")).toHaveCount(0);
  await expect(page.getByLabel("위키 상태").getByText("검증 완료")).toBeVisible();
  await expect(page.getByText("영향 범위와 구현 메타")).toBeVisible();
  await expect(page.locator(".wiki-technical-content")).toHaveCSS("display", "none");
});

test("wiki markdown tables, diagrams, and screenshots render", async ({ page }) => {
  await page.goto("/wiki/entities/availability-slots");
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "필드" })).toBeVisible();

  await page.goto("/wiki/flows/create-booking-flow");
  await expect(page.getByRole("heading", { name: "플로우 다이어그램" })).toBeVisible();
  await expect(page.locator(".wiki-mermaid svg")).toBeVisible();
  await expect(page.locator(".wiki-code-block").filter({ hasText: "flowchart TD" })).toHaveCount(0);

  await page.goto("/wiki/pages/booking-complete");
  await expect(page.getByRole("heading", { name: "QA 화면" })).toBeVisible();
  await expect(page.locator(".wiki-screenshot img")).toBeVisible();
});
