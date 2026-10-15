/**
 * 가드 자체를 검사한다.
 *
 * tools/guard-fixtures/violations.tsx 에 심어둔 위반이 ESLint 에서 실제로
 * 보고되는지, 그리고 허용해야 할 표현(`data-[state=open]`, `[var(--토큰)]`)이
 * 잘못 보고되지는 않는지 확인한다. 규칙이 조용해지면 여기서 실패한다.
 */
import { ESLint } from "eslint";

const FIXTURE = "tools/guard-fixtures/violations.tsx";

/** 이 파일에서 반드시 나와야 하는 규칙과 최소 건수. */
const EXPECTED = [
  ["guards/no-arbitrary-class", 4], // bg-[#ffffff] p-[7px] text-[13px] w-[calc(...)]
  ["guards/no-style-literal", 2], // "#0066cc", "13px"
  ["guards/ui-only-elements", 3], // button, input, table
];

/** 이 표현들은 위반으로 보고되면 안 된다. */
const ALLOWED_SNIPPETS = [
  "data-[state=open]",
  "[var(--text-body)]",
  // 설명 문구 안의 크기는 스타일이 아니다.
  "본문은 14px 이다",
];

const eslint = new ESLint();
const [result] = await eslint.lintFiles([FIXTURE]);

if (!result) {
  console.error(`가드 검사 실패: ${FIXTURE} 를 lint 하지 못했다.`);
  process.exit(1);
}

const counts = new Map();
for (const message of result.messages) {
  if (!message.ruleId) continue;
  counts.set(message.ruleId, (counts.get(message.ruleId) ?? 0) + 1);
}

const failures = [];

for (const [ruleId, minimum] of EXPECTED) {
  const actual = counts.get(ruleId) ?? 0;
  if (actual < minimum) {
    failures.push(
      `${ruleId}: ${minimum}건 이상을 기대했지만 ${actual}건이 보고됐다. 규칙이 죽었는지 확인한다.`,
    );
  }
}

const source = result.source ?? "";
for (const snippet of ALLOWED_SNIPPETS) {
  const line = source.split("\n").findIndex((text) => text.includes(snippet)) + 1;
  if (line === 0) {
    failures.push(`허용 표현 \`${snippet}\` 이 고정 샘플에서 사라졌다.`);
    continue;
  }
  const wrong = result.messages.filter(
    (message) => message.line === line && message.ruleId?.startsWith("guards/"),
  );
  if (wrong.length > 0) {
    failures.push(
      `허용 표현 \`${snippet}\` (${line}행)이 ${wrong.map((m) => m.ruleId).join(", ")} 로 잘못 보고됐다.`,
    );
  }
}

// 디자인 시스템 lint(@shadcn/lint + 자체 가드) — 규칙마다 최소 1건이 보고돼야 한다.
const DS_FIXTURE = "tools/guard-fixtures/design-system.tsx";
const DS_EXPECTED = [
  "shadcn/no-raw-colors",
  "shadcn/no-unknown-classes",
  "shadcn/no-arbitrary-values",
  "shadcn/no-inline-styles",
  "shadcn/require-static-classes",
  "shadcn/no-restyle",
  "guards/no-surface-styling",
  "guards/ui-only-elements",
];
const [dsResult] = await eslint.lintFiles([DS_FIXTURE]);
const dsCounts = new Map();
for (const message of dsResult?.messages ?? []) {
  if (!message.ruleId) continue;
  dsCounts.set(message.ruleId, (dsCounts.get(message.ruleId) ?? 0) + 1);
}
for (const ruleId of DS_EXPECTED) {
  if (!dsCounts.get(ruleId)) {
    failures.push(`${DS_FIXTURE}: ${ruleId} 가 보고되지 않았다. 디자인 시스템 lint 가 꺼졌는지 확인한다.`);
  }
}
for (const message of dsResult?.messages ?? []) {
  if (message.severity !== 2 && message.ruleId && DS_EXPECTED.includes(message.ruleId)) {
    failures.push(`${DS_FIXTURE}: ${message.ruleId} 가 error 가 아니다(severity ${message.severity}).`);
  }
}

if (failures.length > 0) {
  console.error("가드 검사 실패\n" + failures.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}

const summary = EXPECTED.map(
  ([ruleId]) => `${ruleId}=${counts.get(ruleId) ?? 0}`,
).join(" · ");
const dsSummary = DS_EXPECTED.map((ruleId) => `${ruleId}=${dsCounts.get(ruleId) ?? 0}`).join(" · ");
console.log(`가드 검사 통과 — ${FIXTURE} 에서 ${summary}`);
console.log(`디자인 시스템 lint 통과 — ${DS_FIXTURE} 에서 ${dsSummary}`);
