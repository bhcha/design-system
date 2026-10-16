import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

/**
 * 접근성 게이트 — 0 violation.
 * 라우트가 늘어나면 여기에 경로를 추가한다. `/design` 카탈로그가
 * 컴포넌트 상태 매트릭스 전체를 이 게이트에 태운다.
 */
const ROUTES = ["/design"];

for (const route of ROUTES) {
  test(`${route} 은 axe 위반이 없다`, async ({ page }) => {
    // 하이드레이션 뒤의 ARIA(Base UI·패널 핸들이 마운트 후에 다는 속성)까지 검사한다.
    await page.goto(route, { waitUntil: "networkidle" });
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
