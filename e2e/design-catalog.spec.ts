import { expect, test } from "@playwright/test";

/**
 * 컴포넌트별 시각 회귀.
 *
 * 카탈로그의 전시 액자(`[data-specimen]`)를 하나씩 스냅샷으로 고정한다.
 * hover 와 focus-visible 은 정적으로 그릴 수 없으므로 여기서 **실제로**
 * 마우스를 올리고 키보드 포커스를 준 뒤 찍는다.
 *
 * 스냅샷 갱신은 의도한 시각 변경일 때만 하고, 사유를 커밋 메시지에 남긴다.
 */

/**
 * 파일 이름으로 쓸 수 있게 `{component.button-primary}` → `component-button-primary`.
 * 한글을 지우면 "data-grid.tsx" 와 "data-grid.tsx — 빈 목록" 이 같은 이름이 되므로
 * 유니코드 글자·숫자는 남긴다.
 */
function slug(name: string): string {
  return name
    .replaceAll(/[{}]/g, "")
    .replaceAll(/[^\p{L}\p{N}]+/gu, "-")
    .replaceAll(/^-|-$/g, "")
    .toLowerCase();
}

/**
 * 페이지 상단의 sticky 내비를 고정 해제한다.
 * 전시 액자를 하나씩 찍을 때 스크롤된 액자 위로 내비가 겹쳐 들어오기 때문이다.
 * 액자 안의 내비 표본은 `aria-label` 이 달라서 영향을 받지 않는다.
 */
async function unstickPageChrome(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `nav[aria-label="전역"], nav[aria-label="섹션"] { position: static !important; }`,
  });
}

test.describe("컴포넌트 스냅샷", () => {
  test("모든 전시 액자가 스냅샷과 일치한다", async ({ page }) => {
    await page.goto("/design");
    await page.evaluate(() => document.fonts.ready);
    await unstickPageChrome(page);

    const specimens = page.locator("[data-specimen]");
    const count = await specimens.count();
    expect(count).toBeGreaterThan(0);

    const seen = new Set<string>();
    for (let index = 0; index < count; index += 1) {
      const specimen = specimens.nth(index);
      const name = await specimen.getAttribute("data-specimen");
      const state = await specimen.getAttribute("data-specimen-state");
      expect(name).not.toBeNull();

      const fileName = slug([name, state].filter(Boolean).join(" "));
      expect(seen.has(fileName), `중복된 액자 이름: ${name}`).toBe(false);
      seen.add(fileName);

      await expect(specimen).toHaveScreenshot(`${fileName}.png`);
    }
  });
});

test.describe("상태 매트릭스 — 실제 hover / focus", () => {
  test("주요 버튼의 hover 와 focus-visible", async ({ page }) => {
    await page.goto("/design");
    await page.evaluate(() => document.fonts.ready);
    await unstickPageChrome(page);

    const primary = page
      .locator('[data-specimen="{component.button-primary}"]')
      .getByRole("button", { name: "Download" })
      .first();

    await primary.hover();
    await expect(primary).toHaveScreenshot("button-primary-hover.png");

    // 실제 키보드 포커스라야 :focus-visible 이 걸린다.
    await primary.evaluate((node: HTMLElement) => node.blur());
    await page.keyboard.press("Tab");
    await primary.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(primary).toHaveScreenshot("button-primary-focus.png");
  });

  test("선택 칩의 hover 는 선택 상태와 구분된다", async ({ page }) => {
    await page.goto("/design");
    await page.evaluate(() => document.fonts.ready);
    await unstickPageChrome(page);

    const chips = page.locator(
      '[data-specimen="option-chip.tsx · {component.configurator-option-chip} · {component.configurator-option-chip-selected}"]',
    );
    const unselected = chips.getByRole("button", { pressed: false }).first();
    const selected = chips.getByRole("button", { pressed: true }).first();

    const selectedBackground = await selected.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );

    await unselected.hover();
    const hoverBackground = await unselected.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );

    // ADS 요구사항: hover 와 선택이 같은 색이면 안 된다.
    expect(hoverBackground).not.toBe(selectedBackground);
    await expect(chips).toHaveScreenshot("option-chip-hover-vs-selected.png");
  });

  test("검색 입력의 포커스 링", async ({ page }) => {
    await page.goto("/design");
    await page.evaluate(() => document.fonts.ready);
    await unstickPageChrome(page);

    const specimen = page.locator(
      '[data-specimen="search-input.tsx · {component.search-input}"]',
    );
    const input = specimen.getByRole("searchbox", { name: "프로젝트 검색" });

    await input.click();
    await expect(input).toBeFocused();
    await expect(specimen).toHaveScreenshot("search-input-focused.png");
  });
});

test.describe("DataGrid — 행 클릭형 목록의 계약", () => {
  const GRID = '[data-specimen="data-grid.tsx"]';

  test("마우스를 길게 눌렀다 떼도 선택이 유지된다", async ({ page }) => {
    await page.goto("/design");
    await unstickPageChrome(page);
    const row = page.locator(GRID).getByRole("option", { name: /PRJ-03/ });

    // pointerdown 에서 확정된다. 길게 누른 뒤 미세 이동으로 click 이 취소돼도
    // 선택이 사라지면 안 된다 (data-grid.tsx 의 pointerdown 확정 규칙).
    await row.hover();
    const box = await row.boundingBox();
    if (!box) throw new Error("행의 위치를 찾지 못했다");
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 + 4, box.y + box.height / 2 + 3);
    await expect(row).toHaveAttribute("aria-selected", "true");
    await page.mouse.up();
    await expect(row).toHaveAttribute("aria-selected", "true");
  });

  test("키보드만으로 이동하고 선택한다", async ({ page }) => {
    await page.goto("/design");
    await unstickPageChrome(page);
    const grid = page.locator(GRID);
    const first = grid.getByRole("option").first();

    await first.focus();
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("Enter");

    const second = grid.getByRole("option").nth(1);
    await expect(second).toHaveAttribute("aria-selected", "true");

    await page.keyboard.press("End");
    await page.keyboard.press(" ");
    await expect(grid.getByRole("option").last()).toHaveAttribute(
      "aria-selected",
      "true",
    );
  });

  test("hover 와 선택의 배경색이 다르다", async ({ page }) => {
    await page.goto("/design");
    await unstickPageChrome(page);
    const grid = page.locator(GRID);
    const selected = grid.getByRole("option", { selected: true }).first();
    const other = grid.getByRole("option", { selected: false }).first();

    const selectedBackground = await selected.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );
    await other.hover();
    const hoverBackground = await other.evaluate(
      (node) => getComputedStyle(node).backgroundColor,
    );

    expect(hoverBackground).not.toBe(selectedBackground);
    // 선택 행에는 좌측 강조 바가 있다.
    const borderColor = await selected.evaluate(
      (node) => getComputedStyle(node).borderLeftColor,
    );
    expect(borderColor).toBe("rgb(0, 0, 0)"); // design.md {colors.primary}
  });
});

test.describe("토큰 실측", () => {
  test("컨트롤 기하가 확정값과 일치한다", async ({ page }) => {
    await page.goto("/design");

    const box = await page
      .locator('[data-specimen="{component.button-primary}"]')
      .getByRole("button", { name: "Download" })
      .first()
      .evaluate((node) => {
        const style = getComputedStyle(node);
        return {
          height: node.getBoundingClientRect().height,
          radius: style.borderTopLeftRadius,
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
        };
      });

    expect(box.height).toBe(36); // design.md {component.button-primary} height
    expect(box.radius).toBe("9999px"); // design.md {rounded.full}
    expect(box.fontSize).toBe("14px");
    expect(box.fontWeight).toBe("500");
  });

  test("전역 내비의 높이", async ({ page }) => {
    await page.goto("/design");

    const navHeight = await page
      .getByRole("navigation", { name: "전역" })
      .locator("div")
      .first()
      .evaluate((node) => node.getBoundingClientRect().height);
    expect(navHeight).toBe(56); // design.md {component.primary-nav}
  });

  test("아이콘 버튼은 44 × 44 이고 접근 가능한 이름이 있다", async ({ page }) => {
    await page.goto("/design");

    const iconButton = page.getByRole("button", { name: "다음 항목", exact: true });
    const box = await iconButton.boundingBox();
    expect(box?.width).toBe(44);
    expect(box?.height).toBe(44);
  });
});
