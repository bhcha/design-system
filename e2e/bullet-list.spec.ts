import { expect, test } from "@playwright/test";

for (const width of [1280, 390]) {
  test(`${width} — 본문 목록의 시맨틱·가독성·줄바꿈·링크 (#9)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/design", { waitUntil: "networkidle" });
    await page.addStyleTag({
      content: 'nav[aria-label="전역"], nav[aria-label="섹션"] { position: static !important; }',
    });

    const bullet = page.getByRole("list", { name: "기술 설명", exact: true });
    const numbered = page.getByRole("list", { name: "사전에 준비할 것", exact: true });
    for (const [list, tag, marker, gap] of [
      [bullet, "UL", "disc", "8px"],
      [numbered, "OL", "decimal", "4px"],
    ] as const) {
      expect(await list.evaluate((node) => node.tagName)).toBe(tag);
      await expect(list.getByRole("listitem")).toHaveCount(3);
      await expect(list).toHaveCSS("list-style-type", marker);
      await expect(list).toHaveCSS("row-gap", gap);
      for (const item of await list.getByRole("listitem").all()) {
        await expect(item).toHaveCSS("display", "list-item");
        await expect(item).toHaveCSS("font-size", "16px");
        await expect(item).toHaveCSS("line-height", "24px");
        expect(await item.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      }
      expect(await list.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
    }

    await expect(bullet.locator("code")).toHaveText("SELECT");
    await expect(numbered.locator("code")).toHaveText("olist_order_payments_dataset.payment_value");
    const empty = page.locator('[data-specimen="bullet-list.tsx"][data-specimen-state="빈 목록"]');
    await expect(empty.getByRole("list")).toHaveCount(0);
    await expect(empty.getByText("등록된 설명이 없습니다.")).toBeVisible();

    // 데스크톱은 전체 카탈로그 스냅샷에서, 좁은 폭은 여기서 표식과 긴 코드의 줄바꿈을 확인한다.
    if (width === 390) {
      for (const [name, list] of [["bullet", bullet], ["numbered", numbered]] as const) {
        await expect(list.locator('xpath=ancestor::*[@data-specimen]')).toHaveScreenshot(`bullet-list-${name}-mobile.png`);
      }
    }

    const link = bullet.getByRole("link", { name: "토큰 안내", exact: true });
    await link.focus();
    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Tab");
    await expect(link).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/design#tokens$/);
  });
}
