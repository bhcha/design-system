import { expect, test, type Locator } from "@playwright/test";

/** 포커스 링 전체가 실제 스크롤 클리핑 영역 안에 있어야 한다. */
async function expectUnclippedFocusRing(control: Locator) {
  await expect(control).toBeFocused();
  const geometry = await control.evaluate((node) => {
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    const clearances: number[] = [];
    for (let ancestor = node.parentElement; ancestor; ancestor = ancestor.parentElement) {
      const overflow = getComputedStyle(ancestor);
      const bounds = ancestor.getBoundingClientRect();
      const left = bounds.left + ancestor.clientLeft;
      const top = bounds.top + ancestor.clientTop;
      if (/(auto|scroll|hidden|clip)/.test(overflow.overflowX)) {
        clearances.push(rect.left - left, left + ancestor.clientWidth - rect.right);
      }
      if (/(auto|scroll|hidden|clip)/.test(overflow.overflowY)) {
        clearances.push(rect.top - top, top + ancestor.clientHeight - rect.bottom);
      }
    }
    return {
      focusVisible: node.matches(":focus-visible"),
      shadow: style.boxShadow,
      clearances,
    };
  });
  expect(geometry.focusVisible).toBe(true);
  expect(geometry.shadow).toContain("0px 0px 0px 2px");
  expect(geometry.clearances.length).toBeGreaterThan(0);
  for (const clearance of geometry.clearances) expect(clearance).toBeGreaterThanOrEqual(2);
}

for (const viewport of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
  for (const length of ["짧은 본문", "긴 본문"]) {
    test(`${viewport.width} — ${length} full-width 컨트롤의 포커스 링이 잘리지 않는다 (#6)`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/design", { waitUntil: "networkidle" });
      const trigger = page.getByRole("button", { name: `${length} 폼 열기`, exact: true });
      await trigger.click();
      const dialog = page.getByRole("dialog", { name: `${length} 폼`, exact: true });
      const select = dialog.getByRole("combobox", { name: "테이블" });
      const input = dialog.getByRole("textbox", { name: "메모" });
      await expect(dialog.getByRole("button", { name: "닫기", exact: true })).toBeFocused();
      await page.keyboard.press("Tab");
      await expectUnclippedFocusRing(select);

      const body = dialog.locator('[data-slot="modal-dialog-body"]');
      expect(await body.evaluate((node) => node.scrollHeight > node.clientHeight)).toBe(length === "긴 본문");
      expect(await body.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
      await expect(dialog).toHaveScreenshot(`modal-${viewport.width}-${length}-select-focus.png`);

      await page.keyboard.press("Tab");
      await expectUnclippedFocusRing(input);
      if (length === "긴 본문") expect(await body.evaluate((node) => node.scrollTop)).toBeGreaterThan(0);
      await expect(dialog.getByRole("button", { name: "저장", exact: true })).toBeInViewport();
      await expect(dialog).toHaveScreenshot(`modal-${viewport.width}-${length}-input-focus.png`);

      await page.keyboard.press("Escape");
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  }
}
