/**
 * shadcn 레지스트리 정의(registry.json) 생성기.
 *
 * `src/components/ui` 의 파일마다 항목 하나를 만든다. 파일의 import 를 읽어
 *   - `@/components/ui/x`  → 이 레지스트리의 항목 x (registryDependencies, 전체 URL)
 *   - `@/hooks/x`·`@/lib/x` → 이 레지스트리의 hook·lib 항목
 *   - 그 밖의 패키지         → npm dependencies (버전은 package.json 범위)
 * 로 나눈다. `x-variants.ts` 는 항목 x 에 함께 담는다.
 *
 * 쓰는 법:
 *   node tools/registry/generate.mjs           # registry.json 을 다시 쓴다
 *   npx shadcn build                           # registry.json → public/r/*.json
 *   (npm run registry:build 가 두 단계를 함께 한다)
 *
 * 레지스트리 주소는 REGISTRY_URL 로 바꿀 수 있다(로컬 설치 시험용).
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const DEFAULT_REGISTRY_URL =
  "https://raw.githubusercontent.com/bhcha/design-system/main/public/r";

/** 쓰는 프로젝트가 이미 가진 것 — 의존성으로 적지 않는다. */
const PROVIDED = new Set(["react", "react-dom", "next"]);

const read = (rel) => readFileSync(path.join(ROOT, rel), "utf8");

function packageName(spec) {
  const parts = spec.split("/");
  return spec.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

function importsOf(source) {
  const specs = new Set();
  for (const m of source.matchAll(/(?:import|export)[^"']*?from\s*["']([^"']+)["']|import\s*["']([^"']+)["']/g)) {
    specs.add(m[1] ?? m[2]);
  }
  return [...specs];
}

/** 파일 머리 JSDoc 의 첫 줄 — 항목 설명으로 쓴다. */
function descriptionOf(source, fallback) {
  const m = source.match(/\/\*\*\s*\n\s*\*\s*(.+)/);
  return (m ? m[1] : fallback).trim();
}

function ownerOf(uiFile) {
  return uiFile.replace(/\.(tsx|ts)$/, "").replace(/-variants$/, "");
}

export function buildRegistry(registryUrl = DEFAULT_REGISTRY_URL) {
  const pkg = JSON.parse(read("package.json"));
  const versions = { ...pkg.dependencies, ...pkg.devDependencies };
  const url = (name) => `${registryUrl}/${name}.json`;
  const npm = (name) => (versions[name] ? `${name}@${versions[name]}` : name);

  /** 파일 목록 → { dependencies, registryDependencies } */
  function resolveDeps(files, self) {
    const deps = new Set();
    const regDeps = new Set();
    for (const file of files) {
      for (const spec of importsOf(read(file))) {
        if (spec.startsWith("@/components/ui/")) {
          const owner = ownerOf(spec.slice("@/components/ui/".length));
          if (owner !== self) regDeps.add(url(owner));
        } else if (spec.startsWith("@/hooks/") || spec.startsWith("@/lib/")) {
          const name = spec.split("/").pop();
          if (name !== self) regDeps.add(url(name));
        } else if (!spec.startsWith(".") && !spec.startsWith("node:")) {
          const name = packageName(spec);
          if (!PROVIDED.has(name)) deps.add(npm(name));
        }
      }
    }
    return {
      ...(deps.size ? { dependencies: [...deps].sort() } : {}),
      ...(regDeps.size ? { registryDependencies: [...regDeps].sort() } : {}),
    };
  }

  const items = [];

  // lib · hook — 컴포넌트가 import 하는 것
  for (const [name, file, type] of [
    ["utils", "src/lib/utils.ts", "registry:lib"],
    ["use-mobile", "src/hooks/use-mobile.ts", "registry:hook"],
  ]) {
    items.push({
      name,
      type,
      title: name,
      description: descriptionOf(read(file), name),
      ...resolveDeps([file], name),
      files: [{ path: file, type }],
    });
  }

  // 토큰과 서체 — 쓰는 프로젝트의 globals.css 를 이 파일로 바꾼다.
  const themeFiles = [
    { path: "src/app/globals.css", type: "registry:file", target: "src/app/globals.css" },
    { path: "src/lib/fonts.ts", type: "registry:lib" },
    { path: "src/lib/design-tokens.ts", type: "registry:lib" },
  ];
  items.push({
    name: "theme",
    type: "registry:item",
    title: "theme",
    description:
      "토큰(globals.css)·서체(Inter·Nunito·Pretendard)·theme-color 값. 컴포넌트보다 먼저 설치한다.",
    dependencies: [npm("tw-animate-css"), npm("shadcn"), npm("pretendard")].sort(),
    devDependencies: [npm("tailwindcss"), npm("@tailwindcss/postcss")].sort(),
    files: themeFiles,
  });

  // 컴포넌트
  const uiFiles = readdirSync(path.join(ROOT, "src/components/ui"))
    .filter((f) => /\.(tsx|ts)$/.test(f) && !/\.test\./.test(f))
    .sort();
  const groups = new Map();
  for (const f of uiFiles) {
    const owner = ownerOf(f);
    groups.set(owner, [...(groups.get(owner) ?? []), `src/components/ui/${f}`]);
  }
  const componentNames = [];
  for (const [name, files] of groups) {
    const main = files.find((f) => !f.endsWith("-variants.ts")) ?? files[0];
    componentNames.push(name);
    items.push({
      name,
      type: "registry:ui",
      title: name,
      description: descriptionOf(read(main), name),
      ...resolveDeps(files, name),
      files: files.map((f) => ({ path: f, type: "registry:ui" })),
    });
  }

  // lint — 쓰는 프로젝트의 tools/ 아래에 그대로 놓는다.
  const lintFiles = [
    ...readdirSync(path.join(ROOT, "tools/design-system-lint"))
      .filter((f) => /\.(mjs|d\.mts)$/.test(f))
      .map((f) => `tools/design-system-lint/${f}`),
    "tools/eslint-rules/index.mjs",
  ].sort();
  items.push({
    name: "lint",
    type: "registry:item",
    title: "lint",
    description: "토큰 밖의 값과 컴포넌트 밖에서 새로 만든 UI 를 오류로 막는 ESLint 묶음.",
    devDependencies: [npm("@shadcn/lint"), npm("@typescript-eslint/parser"), npm("eslint")].sort(),
    files: lintFiles.map((f) => ({ path: f, type: "registry:file", target: `~/${f}` })),
  });

  // 한 번에 설치
  items.push({
    name: "all",
    type: "registry:item",
    title: "all",
    description: "theme 과 모든 컴포넌트.",
    registryDependencies: [url("theme"), ...componentNames.map(url)],
    files: [],
  });

  return {
    $schema: "https://ui.shadcn.com/schema/registry.json",
    name: "bhcha",
    homepage: "https://github.com/bhcha/design-system",
    items,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const registry = buildRegistry(process.env.REGISTRY_URL || DEFAULT_REGISTRY_URL);
  writeFileSync(path.join(ROOT, "registry.json"), `${JSON.stringify(registry, null, 2)}\n`);
  console.log(`registry.json — 항목 ${registry.items.length}개`);
}
