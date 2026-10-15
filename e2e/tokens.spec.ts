import { expect, test } from "@playwright/test";

/**
 * 토큰이 "선언"이 아니라 실제 렌더링 값으로 살아 있는지 실측한다.
 * 사람 눈이 아니라 computed style 이 판정한다.
 */
test("본문 기본 크기가 body 에 결박돼 16px 로 새지 않는다", async ({ page }) => {
  await page.goto("/");
  const computed = await page.evaluate(() => {
    const style = getComputedStyle(document.body);
    return {
      fontSize: style.fontSize,
      lineHeight: style.lineHeight,
      color: style.color,
      backgroundColor: style.backgroundColor,
    };
  });
  expect(computed.fontSize).toBe("16px"); // design.md {typography.body-md}
  expect(computed.lineHeight).toBe("24px");
  expect(computed.color).toBe("rgb(0, 0, 0)"); // design.md {colors.ink}
  expect(computed.backgroundColor).toBe("rgb(255, 255, 255)"); // {colors.canvas}
});

test("Inter(본문)가 실제로 적용된다", async ({ page }) => {
  await page.goto("/");
  const family = await page.evaluate(
    () => getComputedStyle(document.body).fontFamily,
  );
  expect(family).toContain("Inter");

  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts].some(
      (font) => font.family.includes("Inter") && font.status === "loaded",
    );
  });
  expect(loaded).toBe(true);
});

test("Tailwind 기본 팔레트 유틸리티가 존재하지 않는다", async ({ page }) => {
  await page.goto("/");
  // 기본 팔레트를 비웠으므로 bg-red-500 은 어떤 선언도 만들지 않는다.
  const applied = await page.evaluate(() => {
    const probe = document.createElement("div");
    probe.className = "bg-red-500";
    document.body.append(probe);
    const value = getComputedStyle(probe).backgroundColor;
    probe.remove();
    return value;
  });
  expect(applied).toBe("rgba(0, 0, 0, 0)");
});
