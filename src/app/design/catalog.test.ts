import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** /design 라우트의 모든 소스를 한 덩어리로 읽는다(페이지 + 섹션 파일). */
function readCatalogSource(): string {
  const root = join(process.cwd(), "src/app/design");
  const parts: string[] = [];
  for (const entry of readdirSync(root, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile() || !entry.name.endsWith(".tsx")) continue;
    parts.push(readFileSync(join(entry.parentPath, entry.name), "utf8"));
  }
  return parts.join("\n");
}

const catalog = readCatalogSource();
const globals = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
const designDoc = readFileSync(join(process.cwd(), "design.md"), "utf8");

/**
 * design.md 의 `## Components` 절에서 선언된 컴포넌트 키를 뽑는다.
 * 선언 형태는 줄 맨 앞의 `**\`key\`** — 설명` 이다.
 */
function declaredComponents(): string[] {
  const start = designDoc.indexOf("\n## Components");
  const end = designDoc.indexOf("\n## Do's and Don'ts");
  const section = designDoc.slice(start, end);
  return [...section.matchAll(/^\*\*`([a-z0-9-]+)`\*\*/gm)].map(([, key]) => key);
}

/** globals.css 에 선언된 색 토큰 이름. */
function declaredColors(): string[] {
  return [...globals.matchAll(/^\s*--color-([a-z0-9-]+):/gm)].map(
    ([, name]) => name,
  );
}

describe("디자인 시스템 카탈로그", () => {
  const components = declaredComponents();

  it("design.md 가 19개 컴포넌트를 선언한다", () => {
    expect(components).toHaveLength(19);
  });

  it.each(components)("%s 가 카탈로그에 등재돼 있다", (key) => {
    expect(catalog).toContain(`{component.${key}}`);
  });

  it.each(declaredColors())("색 토큰 %s 에 견본이 있다", (name) => {
    expect(catalog).toContain(`<Swatch name="${name}"`);
  });
});

describe("ui/ 컴포넌트 전수 등재", () => {
  /**
   * components/ui 의 모든 파일이 카탈로그에 등장해야 한다.
   * 카탈로그에 없는 컴포넌트는 상태 매트릭스도 스냅샷도 없다는 뜻이므로
   * 조용히 드리프트하기 시작한다.
   */
  const files = readdirSync(join(process.cwd(), "src/components/ui"))
    .filter((name) => name.endsWith(".tsx"))
    .map((name) => name.replace(/\.tsx$/, ""));

  it("컴포넌트가 40개 이상이다", () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it.each(files)("%s 가 카탈로그에서 import 된다", (name) => {
    expect(catalog).toContain(`@/components/ui/${name}`);
  });

  it.each(files)("%s.tsx 에 스펙 시트 주석이 있다", (name) => {
    const source = readFileSync(
      join(process.cwd(), "src/components/ui", `${name}.tsx`),
      "utf8",
    );
    // 해부도·토큰·상태·키보드/ARIA·수용 기준 — 다섯 항목이 스펙 시트의 최소 골격이다.
    for (const heading of ["해부도", "토큰", "상태", "키보드·ARIA", "수용 기준"]) {
      expect(source, `${name}.tsx 에 "${heading}" 항목이 없다`).toContain(heading);
    }
  });
});
