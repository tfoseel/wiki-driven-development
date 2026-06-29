import { expect, test } from "@playwright/test";

test("wiki root shows the Korean pilot SSOT and node tabs", async ({ page }) => {
  await page.goto("/wiki");

  await expect(page.getByRole("heading", { name: "미니 예약 파일럿" })).toBeVisible();
  await expect(page.getByText("이 파일럿은 작지만 완결된 제품을 위키 페이지를 SSOT로 삼아 운영할 수 있는지 검증한다.")).toBeVisible();
  await expect(page.getByRole("tablist", { name: "위키 노드 유형" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "액션 3" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "화면 4" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "디자인 1" })).toBeVisible();
  await expect(page.getByRole("link", { name: "서비스 목록 pages/service-list" })).toBeVisible();
  await expect(page.getByRole("link", { name: "위키 브라우저 pages/wiki-browser" })).toHaveCount(0);
});

test("wiki node tabs filter the index by type", async ({ page }) => {
  await page.goto("/wiki");
  await page.getByRole("tab", { name: "액션 3" }).click();

  await expect(page).toHaveURL(/type=action/);
  await expect(page.getByRole("link", { name: "예약 취소 actions/cancel-booking" })).toBeVisible();
  await expect(page.getByRole("link", { name: "서비스 entities/services" })).toHaveCount(0);
});

test("wiki design tab shows the design system node", async ({ page }) => {
  await page.goto("/wiki?type=design");

  await expect(page.getByRole("tab", { name: "디자인 1" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("link", { name: "디자인 시스템 design/design-system" })).toBeVisible();
  await expect(page.getByRole("link", { name: "예약 취소 actions/cancel-booking" })).toHaveCount(0);
});

test("design system node explains design docs and Next.js structure", async ({ page }) => {
  await page.goto("/wiki/design/design-system");

  await expect(page.getByRole("heading", { name: "디자인 시스템" })).toBeVisible();
  await expect(page.getByRole("tab", { name: "디자인 1" })).toHaveAttribute("aria-selected", "true");
  await expect(page.getByText("예약 앱의 디자인 시스템 문서는 필요하다.")).toBeVisible();
  await expect(page.getByText("서비스 선택, 새 예약, 예약 완료, 예약 상세")).toBeVisible();
  await expect(page.getByText("src/app App Router를 사용한다.")).toBeVisible();
  await expect(page.getByText("route segment의 _components")).toBeVisible();
  await expect(page.getByText("위키 브라우저")).toHaveCount(0);
});

test("nested wiki nodes show metadata and referenced code", async ({ page }) => {
  await page.goto("/wiki/actions/cancel-booking");

  await expect(page.getByRole("heading", { name: "예약 취소" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "작업 정합성" })).toBeVisible();
  await expect(page.getByText("현재 phase: 검증 완료")).toBeVisible();
  await expect(page.getByText("코드 반영됨")).toBeVisible();
  await expect(page.getByText("검증 통과")).toBeVisible();
  await expect(page.getByText("확정 또는 일정 변경된 예약을 취소하고 해당 슬롯을 다시 예약 가능 상태로 만든다.")).toBeVisible();
  await expect(page.getByText("pilot/app/src/actions/cancel-booking.ts")).toBeVisible();
});

test("wiki markdown tables render as real tables", async ({ page }) => {
  await page.goto("/wiki/entities/availability-slots");

  await expect(page.getByRole("heading", { name: "예약 가능 슬롯" })).toBeVisible();
  await expect(page.getByRole("table")).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "필드" })).toBeVisible();
  await expect(page.getByRole("columnheader", { name: "타입" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "serviceId" })).toBeVisible();
  await expect(page.getByRole("cell", { name: "이 슬롯에서 제공되는 서비스" })).toBeVisible();
});

test("home links to the pilot wiki", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "파일럿 위키 열기" }).click();

  await expect(page).toHaveURL(/\/wiki$/);
  await expect(page.getByRole("heading", { name: "미니 예약 파일럿" })).toBeVisible();
});
