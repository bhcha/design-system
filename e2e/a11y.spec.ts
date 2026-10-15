import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * 접근성 게이트 — 0 violation.
 * 라우트가 늘어나면 여기에 경로를 추가한다. `/design` 카탈로그가
 * 컴포넌트 상태 매트릭스 전체를 이 게이트에 태운다.
 */
const ROUTES = ["/design", "/design/ollama"];

for (const route of ROUTES) {
  test(`${route} 은 axe 위반이 없다`, async ({ page }) => {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
