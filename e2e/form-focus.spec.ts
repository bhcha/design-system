import { expect, test } from "@playwright/test";

for (const width of [1280, 390]) {
  test(`${width} — 입력 포커스가 검은 이중 테두리를 만들지 않는다 (#8)`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/design", { waitUntil: "networkidle" });
    await page.addStyleTag({
      content: 'nav[aria-label="전역"], nav[aria-label="섹션"] { position: static !important; }',
    });

    const specimen = page.locator('[data-specimen="text-input.tsx"][data-specimen-state="Textarea / Select / compact"]');
    const controls = [
      { name: "textarea", element: specimen.getByRole("textbox", { name: "설명", exact: true }) },
      { name: "select", element: specimen.getByRole("combobox", { name: "소속 프로젝트" }) },
      { name: "input", element: specimen.getByRole("textbox", { name: "코드 (compact)" }) },
    ];
    const initial = await Promise.all(controls.map(({ element }) => element.evaluate((node) => {
      const style = getComputedStyle(node);
      return { border: style.borderColor, width: style.width, height: style.height, radius: style.borderRadius };
    })));

    for (const [index, { name, element }] of controls.entries()) {
      // 제보의 클릭 경로와 실제 Tab 이동을 모두 확인한다.
      if (index === 0) await element.click();
      else await page.keyboard.press("Tab");

      await expect(element).toBeFocused();
      await expect(element).toHaveCSS("border-color", initial[index].border);
      await expect(element).toHaveCSS("box-shadow", /rgb\(59, 130, 246\) 0px 0px 0px 2px/);
      await expect(element).toHaveCSS("width", initial[index].width);
      await expect(element).toHaveCSS("height", initial[index].height);
      await expect(element).toHaveCSS("border-radius", initial[index].radius);
      // 액자 전체를 찍어 요소 바깥 링과 둥근 모서리까지 포함한다.
      await expect(specimen).toHaveScreenshot(`form-${width}-${name}-focus.png`);
    }

    await page.keyboard.press("Shift+Tab");
    await page.keyboard.press("Shift+Tab");
    await expect(controls[0].element).toBeFocused();
    await expect(controls[0].element).toHaveCSS("border-color", initial[0].border);
    await expect(controls[0].element).toHaveCSS("box-shadow", /rgb\(59, 130, 246\) 0px 0px 0px 2px/);

    const groupSpecimen = page.locator('[data-specimen="input-group.tsx"]');
    const group = groupSpecimen.locator('[data-slot="input-group"]');
    const groupBorder = await group.evaluate((node) => getComputedStyle(node).borderColor);
    await groupSpecimen.getByRole("textbox", { name: "검색", exact: true }).click();
    await expect(group).toHaveCSS("border-color", groupBorder);
    await expect(group).toHaveCSS("box-shadow", /rgb\(59, 130, 246\) 0px 0px 0px 2px/);
    await expect(groupSpecimen).toHaveScreenshot(`form-${width}-input-group-focus.png`);
  });
}

test("오류 입력의 테두리는 포커스 후에도 오류 색을 유지한다 (#8)", async ({ page }) => {
  await page.goto("/design", { waitUntil: "networkidle" });
  const specimen = page.locator('[data-specimen="field.tsx · text-input.tsx"]');
  const invalid = specimen.getByRole("textbox", { name: "완료 기준" });
  const border = await invalid.evaluate((node) => getComputedStyle(node).borderColor);

  await invalid.click();
  await expect(invalid).toBeFocused();
  await expect(invalid).toHaveAttribute("aria-invalid", "true");
  await expect(invalid).toHaveCSS("border-color", border);
  await expect(specimen.getByRole("textbox", { name: "프로젝트 ID" })).toBeDisabled();
});
