import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { THEME_COLOR } from "./design-tokens";

const globals = readFileSync(
  join(process.cwd(), "src/app/globals.css"),
  "utf8",
);

function tokenValue(name: string): string | undefined {
  const match = new RegExp(`^\\s*${name}:\\s*([^;]+);`, "m").exec(globals);
  return match?.[1].trim();
}

describe("토큰 정본", () => {
  it("JS 미러의 theme-color 가 globals.css 와 어긋나지 않는다", () => {
    expect(THEME_COLOR).toBe(tokenValue("--background"));
  });

  it("타입 스케일이 design.md typography 원문(= Tailwind 기본 8단계)이다", () => {
    const expected: Record<string, [string, string]> = {
      xs: ["12px", "16px"], // caption-sm
      sm: ["14px", "20px"], // body-sm
      base: ["16px", "24px"], // body-md
      lg: ["18px", "28px"], // heading-sm
      xl: ["20px", "28px"], // heading-md
      "2xl": ["24px", "32px"], // heading-lg
      "3xl": ["30px", "36px"], // display-lg
      "4xl": ["36px", "40px"], // display-xl
    };
    for (const [name, [size, lineHeight]] of Object.entries(expected)) {
      expect(tokenValue(`--text-${name}`)).toBe(size);
      expect(tokenValue(`--text-${name}--line-height`)).toBe(lineHeight);
    }
    // 밀도 절이 같은 이름을 다시 정의한다 — 이름 집합만 본다(새 크기 이름이 생기지 않는다).
    const declared = [...new Set([...globals.matchAll(/^\s*--text-([a-z0-9]+):/gm)].map(([, n]) => n))];
    expect(declared.sort()).toEqual(Object.keys(expected).sort());
  });

  it("compact 밀도는 spacing 0.8배 · 타입 스케일 안의 값 · 최소 12px 이다 (이슈 #10)", () => {
    const start = globals.indexOf(`[data-ui-density="compact"]`);
    expect(start).toBeGreaterThan(-1);
    const block = globals.slice(start, globals.indexOf("}", start));
    const value = (name: string) =>
      new RegExp(`^\\s*${name}:\\s*([^;]+);`, "m").exec(block)?.[1].trim();
    expect(value("--spacing")).toBe("3.2px");
    const scale = new Set(["12px", "14px", "16px", "18px", "20px", "24px", "30px", "36px"]);
    for (const name of ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"]) {
      const size = value(`--text-${name}`);
      expect(scale.has(size ?? ""), `--text-${name}: ${size}`).toBe(true);
      expect(Number.parseFloat(size ?? "0")).toBeGreaterThanOrEqual(12);
    }
    // 모바일(768px 미만)에서는 적용하지 않는다.
    expect(globals.lastIndexOf("@media (min-width: 768px)", start)).toBeGreaterThan(-1);
  });

  it("spacing 이 4px 그리드에 결박돼 있다", () => {
    expect(tokenValue("--spacing")).toBe("4px");
  });

  it("곡률이 design.md rounded 원문이다", () => {
    expect(tokenValue("--radius-sm")).toBe("6px");
    expect(tokenValue("--radius-md")).toBe("8px");
    expect(tokenValue("--radius-lg")).toBe("12px");
    expect(tokenValue("--radius-full")).toBe("9999px");
  });

  it("shadcn 시맨틱 색이 design.md 값이다", () => {
    expect(tokenValue("--background")).toBe("#ffffff");
    expect(tokenValue("--foreground")).toBe("#000000");
    expect(tokenValue("--primary")).toBe("#000000");
    expect(tokenValue("--primary-active")).toBe("#090909");
    expect(tokenValue("--muted")).toBe("#fafafa");
    expect(tokenValue("--muted-foreground")).toBe("#737373");
    expect(tokenValue("--border")).toBe("#e5e5e5");
    expect(tokenValue("--ring")).toBe("#3b82f6");
  });

  it("Tailwind 기본 팔레트·타입 스케일이 비워져 있다", () => {
    for (const namespace of [
      "--color-*",
      "--text-*",
      "--radius-*",
      "--shadow-*",
      "--breakpoint-*",
      "--container-*",
    ]) {
      expect(globals).toContain(`${namespace}: initial;`);
    }
  });

  it("그림자 토큰이 하나도 없다", () => {
    // design.md 가 허용하는 유일한 그림자(제품 이미지)마저 사용처가 0 이라 지웠다.
    // 층위는 표면 색 + 1px 테두리로만 만든다. 선언만 남은 그림자는 카드·패널로
    // 새는 경로가 된다.
    const shadows = [...globals.matchAll(/^\s*(--shadow-[a-z-]+):/gm)].map(
      ([, name]) => name,
    );
    expect(shadows).toEqual([]);
  });
});
