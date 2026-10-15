import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { cn } from "./utils";

const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");

describe("cn 충돌 해소", () => {
  it("크기와 색은 서로 다른 그룹이라 둘 다 살아남는다", () => {
    expect(cn("text-base", "text-charcoal")).toBe("text-base text-charcoal");
  });

  it("같은 크기 그룹이면 뒤가 이긴다", () => {
    expect(cn("text-base", "text-xl")).toBe("text-xl");
  });

  it("같은 색 그룹이면 뒤가 이긴다", () => {
    expect(cn("text-foreground", "text-charcoal")).toBe("text-charcoal");
    expect(cn("bg-background", "bg-muted")).toBe("bg-muted");
  });

  it("곡률 토큰이 서로 덮어쓴다", () => {
    expect(cn("rounded-lg", "rounded-full")).toBe("rounded-full");
  });

  it("테두리 색과 테두리 굵기는 충돌하지 않는다", () => {
    expect(cn("border", "border-border")).toBe("border border-border");
  });
});

describe("design.md 고유 색도 색 그룹으로 합쳐진다", () => {
  it("on-dark 계열이 서로 덮어쓴다", () => {
    expect(cn("text-on-dark", "text-on-dark-mute")).toBe("text-on-dark-mute");
  });

  it("상태 색과 크기는 함께 산다", () => {
    expect(cn("text-xs", "text-status-warn")).toBe("text-xs text-status-warn");
  });
});

describe("globals.css 가 shadcn 시맨틱 토큰을 모두 선언한다", () => {
  it.each([
    "background",
    "foreground",
    "card",
    "popover",
    "primary",
    "primary-foreground",
    "secondary",
    "muted",
    "muted-foreground",
    "accent",
    "destructive",
    "border",
    "input",
    "ring",
  ])("--%s", (name) => {
    expect(globals).toMatch(new RegExp(`^\\s*--${name}:`, "m"));
    expect(globals).toContain(`--color-${name}: var(--${name});`);
  });
});
