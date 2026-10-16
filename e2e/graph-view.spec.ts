import { expect, test } from "@playwright/test";

const SCHEMA = '[data-specimen="graph-view.tsx"][data-specimen-state^="스키마"]';
const TREE = '[data-specimen="graph-view.tsx"][data-specimen-state^="질의 트리"]';

test.beforeEach(async ({ page }) => {
  await page.goto("/design", { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: 'nav[aria-label="전역"], nav[aria-label="섹션"] { position: static !important; }',
  });
});

test("읽기 전용 LR 노드의 실제 마우스 클릭이 선택과 상세를 바꾼다 (#7)", async ({ page }) => {
  const specimen = page.locator(SCHEMA);
  const orders = specimen.getByRole("button", { name: "orders, 테이블, 경로에 포함", exact: true });
  await expect(orders).toHaveAttribute("aria-pressed", "true");

  for (const [name, label] of [
    ["payments, 테이블", "payments"],
    ["regions, 테이블, 미확인", "regions"],
    ["customers, 테이블, 경로에 포함", "customers"],
  ]) {
    const node = specimen.getByRole("button", { name, exact: true });
    // force/dispatchEvent는 실제 hit testing을 우회하므로 사용하지 않는다.
    await node.click({ timeout: 3000 });
    await expect(node).toHaveAttribute("aria-pressed", "true");
    await expect(specimen.locator('button[aria-pressed="true"]')).toHaveCount(1);
    await expect(orders).toHaveAttribute("aria-pressed", "false");
    await expect(specimen.locator('[data-slot="card-title"]')).toHaveText(label);
  }
});

test("TB 노드도 마우스로 선택할 수 있다", async ({ page }) => {
  const specimen = page.locator(TREE);
  const customers = specimen.getByRole("button", { name: "customers, 테이블", exact: true });
  const orders = specimen.getByRole("button", { name: "orders, 테이블", exact: true });
  await customers.click();
  await expect(customers).toHaveAttribute("aria-pressed", "true");
  await orders.click();
  await expect(orders).toHaveAttribute("aria-pressed", "true");
  await expect(customers).toHaveAttribute("aria-pressed", "false");
});

test("Tab·Enter·Space로도 노드를 선택한다", async ({ page }) => {
  const specimen = page.locator(SCHEMA);
  const customers = specimen.getByRole("button", { name: "customers, 테이블, 경로에 포함", exact: true });
  const orders = specimen.getByRole("button", { name: "orders, 테이블, 경로에 포함", exact: true });
  await specimen.getByRole("button", { name: "처음 위치로", exact: true }).focus();
  await page.keyboard.press("Tab");
  // Base UI의 그래프 탭 패널이 노드 앞에서 한 번 포커스를 받는다.
  await expect(specimen.getByRole("tabpanel", { name: "그래프", exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(customers).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(customers).toHaveAttribute("aria-pressed", "true");
  await expect(specimen.locator('[data-slot="card-title"]')).toHaveText("customers");
  await page.keyboard.press("Tab");
  await expect(orders).toBeFocused();
  await page.keyboard.press("Space");
  await expect(orders).toHaveAttribute("aria-pressed", "true");
  await expect(customers).toHaveAttribute("aria-pressed", "false");
  await expect(specimen.locator('[data-slot="card-title"]')).toHaveText("orders");
});

test("노드를 누른 채 움직여도 배치·캔버스는 고정되고 빈 배경은 팬할 수 있다", async ({ page }) => {
  const specimen = page.locator(SCHEMA);
  const button = specimen.getByRole("button", { name: "payments, 테이블", exact: true });
  await button.hover();
  const node = specimen.locator('.react-flow__node[data-id="payments"]');
  const viewport = specimen.locator(".react-flow__viewport");
  const nodePosition = await node.evaluate((element) => element.style.transform);
  const canvasPosition = await viewport.evaluate((element) => element.style.transform);
  const bounds = await button.boundingBox();
  if (!bounds) throw new Error("노드 버튼 위치를 찾지 못했다");
  await page.mouse.down();
  await page.mouse.move(bounds.x + bounds.width / 2 + 30, bounds.y + bounds.height / 2 + 20, { steps: 5 });
  await page.mouse.up();
  expect(await node.evaluate((element) => element.style.transform)).toBe(nodePosition);
  expect(await viewport.evaluate((element) => element.style.transform)).toBe(canvasPosition);

  const pane = await specimen.locator(".react-flow__pane").boundingBox();
  if (!pane) throw new Error("캔버스 위치를 찾지 못했다");
  await page.mouse.move(pane.x + 12, pane.y + 12);
  await page.mouse.down();
  await page.mouse.move(pane.x + 42, pane.y + 32, { steps: 5 });
  await page.mouse.up();
  await expect.poll(() => viewport.evaluate((element) => element.style.transform)).not.toBe(canvasPosition);
  expect(await node.evaluate((element) => element.style.transform)).toBe(nodePosition);
});
