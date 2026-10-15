import type { NextConfig } from "next";

import { withDesignSystemLint } from "./tools/design-system-lint/next.mjs";

const nextConfig: NextConfig = {};

/**
 * 디자인 시스템 lint 결박 — `next build` · `next dev` 시작 시 src 를 lint 하고
 * 위반(토큰 밖의 값 · 컴포넌트 밖에서 만든 UI)이 하나라도 있으면 시작하지 않는다.
 * 끄기: enabled:false 또는 DESIGN_SYSTEM_LINT=off.
 */
export default withDesignSystemLint(nextConfig, { enabled: true });
