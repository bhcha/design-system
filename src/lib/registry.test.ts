import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildRegistry } from "../../tools/registry/generate.mjs";

const root = process.cwd();
const read = (rel: string) => readFileSync(join(root, rel), "utf8");

type RegistryFile = { path: string; content?: string };
type RegistryItem = { name: string; files: RegistryFile[] };

describe("shadcn 레지스트리", () => {
  it("registry.json 이 소스와 맞는다 (npm run registry:build 로 다시 만든다)", () => {
    expect(JSON.parse(read("registry.json"))).toEqual(buildRegistry());
  });

  it("public/r 의 항목 내용이 소스 파일과 같다", () => {
    const registry = JSON.parse(read("registry.json")) as { items: RegistryItem[] };
    for (const { name } of registry.items) {
      const builtPath = join(root, "public/r", `${name}.json`);
      expect(existsSync(builtPath), `public/r/${name}.json 없음`).toBe(true);
      const built = JSON.parse(readFileSync(builtPath, "utf8")) as RegistryItem;
      for (const file of built.files) {
        expect(file.content, `${name}: ${file.path}`).toBe(read(file.path));
      }
    }
  });

  it("설치되는 .ts·.tsx 가 주석으로 시작하지 않는다 (shadcn CLI 가 변환하면서 맨 앞 주석을 지운다)", () => {
    const registry = JSON.parse(read("registry.json")) as { items: RegistryItem[] };
    const offenders = registry.items
      .flatMap((item) => item.files.map((f) => f.path))
      .filter((p) => /\.tsx?$/.test(p) && read(p).startsWith("/*"));
    expect(offenders).toEqual([]);
  });
});
