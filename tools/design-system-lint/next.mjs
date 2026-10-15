/**
 * withDesignSystemLint — 디자인 시스템 lint 를 Next.js 실행에 결박한다.
 *
 * Next.js 16 부터 `next build` 는 lint 를 돌리지 않는다(next lint 제거).
 * 이 래퍼는 next.config 가 로드되는 순간(= next build · next dev 시작) ESLint 를
 * 직접 돌리고, 오류가 하나라도 있으면 보고서를 찍고 예외를 던져 실행을 멈춘다.
 *
 *   // next.config.ts
 *   import { withDesignSystemLint } from "./tools/design-system-lint/next.mjs";
 *   export default withDesignSystemLint(nextConfig, { enabled: true });
 *
 * 끄기: 옵션 enabled:false 또는 환경 변수 DESIGN_SYSTEM_LINT=off.
 * dev 서버 실행 중의 수정은 편집기 ESLint 와 `npm run lint` 가 잡는다.
 */
import { ESLint } from "eslint";

const PHASES = new Set(["phase-production-build", "phase-development-server"]);

export function withDesignSystemLint(nextConfig = {}, { enabled = true, paths = ["src"] } = {}) {
  return async (phase, context) => {
    const resolved =
      typeof nextConfig === "function" ? await nextConfig(phase, context) : nextConfig;
    if (!enabled || process.env.DESIGN_SYSTEM_LINT === "off" || !PHASES.has(phase)) {
      return resolved;
    }
    const eslint = new ESLint();
    const results = await eslint.lintFiles(paths);
    const errorCount = results.reduce((sum, r) => sum + r.errorCount, 0);
    if (errorCount > 0) {
      const formatter = await eslint.loadFormatter("stylish");
      const report = await formatter.format(results.filter((r) => r.errorCount > 0));
      console.error(report);
      throw new Error(
        `디자인 시스템 규칙 위반 ${errorCount}건 — 고치기 전에는 ${
          phase === "phase-production-build" ? "빌드" : "개발 서버"
        }를 시작하지 않는다. (끄려면 DESIGN_SYSTEM_LINT=off)\n` +
          `필요한 컴포넌트·토큰이 없거나 오탐이면 이슈로 요청: https://github.com/bhcha/design-system/issues/new/choose`,
      );
    }
    return resolved;
  };
}

export default withDesignSystemLint;
