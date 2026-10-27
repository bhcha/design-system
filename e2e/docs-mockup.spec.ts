import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("docs navigation keeps document pages, categories, and section anchors distinct", async ({ page }) => {
  await page.goto("/mockup/docs");
  const sidebar = page.locator('[data-slot="docs-sidebar"]');
  const toc = page.locator('[data-slot="docs-toc"]');
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("읽기 쉬운 문서 만들기");
  await expect(sidebar.getByRole("link", { name: "읽기 쉬운 문서 만들기", exact: true })).toHaveAttribute("aria-current", "page");
  const groupToggle = sidebar.locator("summary").filter({ hasText: "함께 관리하기" });
  await groupToggle.focus();
  await page.keyboard.press("Enter");
  await expect(sidebar.getByRole("link", { name: "검토와 업데이트" })).toBeHidden();
  await page.keyboard.press("Space");
  await expect(sidebar.getByRole("link", { name: "검토와 업데이트" })).toBeVisible();
  await toc.getByRole("link", { name: "바로 쓰는 문서 템플릿" }).click();
  await expect(page).toHaveURL(/doc=writing&section=template$/);
  await expect(page.getByRole("heading", { name: "바로 쓰는 문서 템플릿" })).toBeInViewport();
  const categoryMenu = page.getByRole("navigation", { name: "문서 카테고리" });
  await expect(categoryMenu).toBeInViewport();
  const categoryBounds = await categoryMenu.boundingBox();
  const headingBounds = await page.getByRole("heading", { name: "바로 쓰는 문서 템플릿" }).boundingBox();
  expect(headingBounds!.y).toBeGreaterThanOrEqual(categoryBounds!.y + categoryBounds!.height);
  await sidebar.getByRole("link", { name: "정보 구조와 탐색" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("정보 구조와 탐색");
  await page.reload();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("정보 구조와 탐색");
  await page.getByRole("navigation", { name: "문서 카테고리" }).getByRole("link", { name: "콘텐츠 블록" }).click();
  await expect(sidebar.getByRole("link", { name: "표와 코드 예시" })).toBeVisible();
  await expect(sidebar.getByRole("link", { name: "검토와 업데이트" })).toHaveCount(0);
  await page.goBack();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("정보 구조와 탐색");
});

test("docs search supports shortcuts, keyboard selection, and an empty result", async ({ page }) => {
  await page.goto("/mockup/docs");
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog", { name: "문서 검색", exact: true })).toBeVisible();
  await expect(page.getByRole("combobox", { name: "문서 검색어" })).toBeFocused();
  await page.getByRole("combobox", { name: "문서 검색어" }).fill("없는문서123456");
  await expect(page.getByText("일치하는 문서가 없습니다. 다른 단어로 찾아보세요.")).toBeVisible();
  await page.getByRole("combobox", { name: "문서 검색어" }).fill("표와 코드");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("표와 코드 예시");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "문서 검색 열기" }).click();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "문서 검색 열기" })).toBeFocused();
});

test("docs mobile menu closes, restores focus, and opens the chosen page", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mockup/docs");
  await expect(page.locator('[data-slot="docs-sidebar"]')).toBeHidden();
  await expect(page.locator('[data-slot="docs-toc"]')).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  const trigger = page.getByRole("button", { name: "문서 메뉴 열기" });
  await trigger.click();
  const menu = page.getByRole("dialog", { name: "문서 메뉴", exact: true });
  await expect(menu).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await menu.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await menu.evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)));
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await menu.getByRole("link", { name: "검토와 업데이트" }).click();
  await expect(menu).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("검토와 업데이트");
});

test("docs menu releases the page and focuses the content when the viewport grows", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mockup/docs");
  await page.getByRole("button", { name: "문서 메뉴 열기" }).click();
  await expect(page.getByRole("dialog", { name: "문서 메뉴", exact: true })).toBeVisible();
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(page.getByRole("dialog", { name: "문서 메뉴", exact: true })).toBeHidden();
  await expect(page.locator("#docs-main")).toBeFocused();
  await expect(page.locator('[data-slot="docs-sidebar"]')).toBeVisible();
  await page.mouse.wheel(0, 400);
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
});

test("docs pager links the whole card and omits missing directions", async ({ page }) => {
  await page.goto("/mockup/docs#doc=overview");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("문서 공간 둘러보기");
  const pager = page.getByRole("navigation", { name: "이전과 다음 문서" });
  await expect(pager.getByRole("link")).toHaveCount(1);
  await pager.getByRole("link", { name: "다음 문서: 첫 문서 시작하기" }).click({ position: { x: 5, y: 5 } });
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("첫 문서 시작하기");
  await expect(pager.getByRole("link")).toHaveCount(2);
  await pager.getByRole("link", { name: "이전 문서: 문서 공간 둘러보기" }).click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("문서 공간 둘러보기");
  await page.setViewportSize({ width: 1280, height: 2400 });
  await page.goto("/mockup/docs#doc=shortcuts");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("단축키와 읽기 도구");
  await expect(pager.getByRole("link")).toHaveCount(1);
  await expect(pager.getByRole("link")).toHaveAttribute("rel", "prev");
  await expect(page.locator('[data-slot="docs-toc"] a').first()).toHaveAttribute("aria-current", "location");
});

test("the catalog docs menu manages its own state and collapsed groups", async ({ page }) => {
  await page.goto("/design", { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const trigger = page.getByRole("button", { name: "문서 메뉴 표본 열기" });
  await trigger.click();
  const menu = page.getByRole("dialog", { name: "문서 메뉴", exact: true });
  await expect(menu).toBeVisible();
  await expect(menu).not.toHaveAttribute("data-starting-style");
  await menu.evaluate((element) => Promise.all(element.getAnimations({ subtree: true }).map((animation) => animation.finished)));
  await expect(menu.getByRole("link", { name: "검토와 업데이트" })).toBeHidden();
  await menu.locator("summary").filter({ hasText: "함께 관리하기" }).focus();
  await page.keyboard.press("Space");
  await expect(menu.getByRole("link", { name: "검토와 업데이트" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});
