import { expect, test, type Locator, type Page } from "@playwright/test";

/**
 * 이슈 #10 — compact 밀도를 브라우저 100% 배율에서 실측한다.
 * /design 의 "밀도" 절에 같은 워크벤치 조립이 기본·compact 범위로 한 벌씩 있다.
 */

const scope = (page: Page, state: "기본" | "compact") =>
  page.locator(`[data-specimen="density.tsx"][data-specimen-state="${state}"]`);

async function box(locator: Locator) {
  const rect = await locator.boundingBox();
  if (!rect) throw new Error("요소가 보이지 않는다");
  return rect;
}

const css = (locator: Locator, property: string) =>
  locator.evaluate((node, name) => getComputedStyle(node).getPropertyValue(name), property);

async function measure(page: Page, state: "기본" | "compact") {
  const root = scope(page, state);
  const nav = root.getByRole("navigation", { name: /워크벤치 상단/ });
  const menu = root.getByRole("button", { name: "질문", exact: true });
  const tabs = root.getByRole("tablist", { name: /변환 학습/ });
  const textarea = root.getByRole("textbox", { name: "질문" });
  const select = root.getByRole("combobox", { name: "데이터베이스" });
  const cell = root.getByRole("cell").first();
  return {
    sidebar: (await box(root.locator('[data-slot="sidebar-container"]'))).width,
    menuHeight: (await box(menu)).height,
    menuFont: await css(menu, "font-size"),
    navHeight: (await box(nav.locator("> div").first())).height,
    navPadding: await css(nav.locator("> div > div").first(), "padding-left"),
    button: (await box(root.getByRole("button", { name: "SQL 생성" }))).height,
    tabsHeight: (await box(tabs)).height,
    tabFont: await css(tabs.getByRole("tab").first(), "font-size"),
    textareaFont: await css(textarea, "font-size"),
    textareaPadding: await css(textarea, "padding-left"),
    selectHeight: (await box(select)).height,
    selectFont: await css(select, "font-size"),
    cardPadding: await css(root.locator('[data-ui-density] [data-slot="card-header"]').first(), "padding-left"),
    // 표본 액자가 Card size="sm" 이라 안쪽 카드 제목도 sm 크기(14px)다.
    cardTitle: await css(root.locator('[data-slot="card-title"]').first(), "font-size"),
    codeFont: await css(root.locator("pre").first(), "font-size"),
    codeLine: await css(root.locator("pre").first(), "line-height"),
    cellFont: await css(cell, "font-size"),
    cellPadding: await css(cell, "padding-left"),
  };
}

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/design", { waitUntil: "networkidle" });
  await page.addStyleTag({
    content: 'nav[aria-label="전역"], nav[aria-label="섹션"] { position: static !important; }',
  });
});

test("compact 는 실제 CSS 크기·간격을 줄이고 기본은 그대로다", async ({ page }) => {
  const base = await measure(page, "기본");
  const compact = await measure(page, "compact");

  expect(base).toEqual({
    sidebar: 256,
    menuHeight: 32,
    menuFont: "14px",
    navHeight: 56,
    navPadding: "24px",
    button: 32,
    tabsHeight: 32,
    tabFont: "14px",
    textareaFont: "16px",
    textareaPadding: "16px",
    selectHeight: 40,
    selectFont: "16px",
    cardPadding: "16px",
    cardTitle: "14px",
    codeFont: "14px",
    codeLine: "20px",
    cellFont: "16px",
    cellPadding: "8px",
  });

  const near = (actual: number, expected: number) => expect(actual).toBeCloseTo(expected, 0);
  near(compact.sidebar, 204.8);
  near(compact.menuHeight, 25.6);
  near(compact.navHeight, 44.8);
  near(compact.button, 25.6);
  near(compact.tabsHeight, 25.6);
  near(compact.selectHeight, 32);
  expect(compact).toMatchObject({
    menuFont: "12px",
    navPadding: "19.2px",
    tabFont: "12px",
    textareaFont: "14px",
    textareaPadding: "12.8px",
    selectFont: "14px",
    cardPadding: "12.8px",
    cardTitle: "12px",
    codeFont: "12px",
    codeLine: "16px",
    cellFont: "14px",
    cellPadding: "6.4px",
  });

  // 확대·축소로 흉내 내지 않는다.
  for (const node of [page.locator("html"), scope(page, "compact").locator('[data-ui-density="compact"] > *').first()]) {
    expect(await css(node, "zoom")).toBe("1");
    expect(await css(node, "transform")).toBe("none");
  }
});

test("compact 코드의 줄 번호·강조 줄과 표의 머리·칸이 맞는다", async ({ page }) => {
  const root = scope(page, "compact");
  for (const n of [1, 4, 7]) {
    const line = root.locator(`#density-compact-sql-L${n}`);
    const [number, code] = await line.locator("> span").all();
    const a = await box(number);
    const b = await box(code);
    expect(a.y).toBeCloseTo(b.y, 0);
    expect(a.height).toBeCloseTo(b.height, 0);
  }
  await expect(root.locator("[data-highlighted]")).toHaveCount(2);

  const headers = await root.getByRole("columnheader").all();
  const firstRow = root.getByRole("row").nth(1);
  const cells = await firstRow.locator("th, td").all();
  expect(cells).toHaveLength(headers.length);
  for (let i = 0; i < headers.length; i++) {
    const head = await box(headers[i]);
    const cell = await box(cells[i]);
    expect(head.x).toBeCloseTo(cell.x, 0);
    expect(head.width).toBeCloseTo(cell.width, 0);
  }
});

test("compact 관계도의 노드 실측 크기가 배치와 같고 클릭 위치에 노드가 있다", async ({ page }) => {
  const root = scope(page, "compact");
  await root.getByRole("tab", { name: "질의 트리" }).click();
  const nodes = root.locator(".react-flow__node");
  await expect(nodes).toHaveCount(3);
  for (const node of await nodes.all()) {
    await node.scrollIntoViewIfNeeded();
    const wrapper = await box(node);
    const button = await box(node.getByRole("button"));
    expect(button.width).toBeCloseTo(wrapper.width, 0);
    expect(button.height).toBeCloseTo(wrapper.height, 0);
    // 화면 배율(fitView)과 무관하게 노드 폭:높이 = 44:15(spacing 배수)
    expect(wrapper.width / wrapper.height).toBeCloseTo(44 / 15, 1);
    const hit = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.closest("button")?.getAttribute("aria-label"),
      { x: button.x + button.width / 2, y: button.y + button.height / 2 },
    );
    expect(hit).toBe(await node.getByRole("button").getAttribute("aria-label"));
  }
  const unscaled = await root.locator(".react-flow__node").first().evaluate((node) => node.style.width);
  expect(Number.parseFloat(unscaled)).toBeCloseTo(140.8, 1);
});

test("compact 범위에서 연 대화상자는 포털이어도 compact 이고 포커스가 돌아온다", async ({ page }) => {
  const root = scope(page, "compact");
  const trigger = root.getByRole("button", { name: "명세 보기" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Olist 데이터 명세" });
  await expect(dialog).toBeVisible();
  expect(await dialog.evaluate((node) => node.closest("[data-ui-density]")?.getAttribute("data-ui-density"))).toBe(
    "compact",
  );
  await expect(dialog.getByRole("heading", { name: "Olist 데이터 명세" })).toHaveCSS("font-size", "18px");
  await expect(dialog.getByRole("button", { name: "확인" })).toHaveCSS("font-size", "12px");
  // sm 선택 상자의 내용 칸이 글자 줄 높이를 담는다 — 글자 아래가 잘리지 않는다(#11).
  expect(
    await dialog.getByRole("combobox").evaluate((node) => {
      const style = getComputedStyle(node);
      const inner = node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
      return inner >= parseFloat(style.lineHeight);
    }),
  ).toBe(true);

  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("compact 상태 — 선택·비활성·포커스·키보드 이동·접힌 Sidebar", async ({ page }) => {
  const root = scope(page, "compact");

  const tabs = root.getByRole("tablist", { name: /변환 학습/ });
  const first = tabs.getByRole("tab", { name: "변환 단계" });
  await expect(first).toHaveAttribute("aria-selected", "true");
  await expect(tabs.getByRole("tab", { name: "근거" })).toBeDisabled();
  await first.focus();
  await page.keyboard.press("ArrowRight");
  const second = tabs.getByRole("tab", { name: "질의 트리" });
  await expect(second).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(second).toHaveAttribute("aria-selected", "true");
  // 포커스 링이 탭 목록을 넘어 그려져도 조상이 자르지 않는다.
  expect(
    await tabs.evaluate((node) => {
      for (let el = node.parentElement; el && !el.matches("[data-specimen]"); el = el.parentElement) {
        const style = getComputedStyle(el);
        if (style.overflowX !== "visible" && el.getBoundingClientRect().left > node.getBoundingClientRect().left - 4) return false;
      }
      return true;
    }),
  ).toBe(true);

  // 툴팁이 달린 메뉴 버튼도 disabled 가 버튼에 남는다(#12).
  await expect(root.getByRole("button", { name: "설정", exact: true })).toBeDisabled();
  await expect(root.getByRole("button", { name: "실행 결과" })).toBeDisabled();

  // 접힌 Sidebar — 아이콘 폭 spacing×12(38.4px)에 메뉴 칸 spacing×8, 툴팁도 compact.
  const container = root.locator('[data-slot="sidebar-container"]');
  await root.getByRole("button", { name: /사이드바/ }).click();
  await expect(root.locator('[data-slot="sidebar"][data-state="collapsed"]')).toHaveCount(1);
  await expect.poll(async () => Math.round((await box(container)).width)).toBeLessThan(50);
  const menu = root.getByRole("button", { name: "질문", exact: true });
  expect((await box(menu)).width).toBeCloseTo(25.6, 0);
  await menu.hover();
  const tooltip = page.locator('[data-slot="tooltip-content"]', { hasText: "질문" });
  await expect(tooltip).toBeVisible();
  expect(await tooltip.evaluate((node) => node.closest("[data-ui-density]")?.getAttribute("data-ui-density"))).toBe(
    "compact",
  );
  await expect(tooltip).toHaveCSS("font-size", "12px");
});

test("768px 미만에서는 compact 범위도 기본 크기다", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  for (const state of ["기본", "compact"] as const) {
    const root = scope(page, state);
    expect((await box(root.getByRole("button", { name: "SQL 생성" }))).height).toBe(32);
    await expect(root.getByRole("textbox", { name: "질문" })).toHaveCSS("font-size", "16px");
  }
});

test("기본 밀도에서도 sm 선택 상자의 글자가 잘리지 않는다 (#11)", async ({ page }) => {
  await scope(page, "기본").getByRole("button", { name: "명세 보기" }).click();
  const select = page.getByRole("dialog").getByRole("combobox");
  const fits = await select.evaluate((node) => {
    const style = getComputedStyle(node);
    const inner = node.clientHeight - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom);
    return inner >= parseFloat(style.lineHeight);
  });
  expect(fits).toBe(true);
  await expect(select).toHaveCSS("height", "32px");
});
