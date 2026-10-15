import type { NextConfig } from "next";

type ConfigInput =
  | NextConfig
  | ((phase: string, context: { defaultConfig: NextConfig }) => NextConfig | Promise<NextConfig>);

export function withDesignSystemLint(
  nextConfig?: ConfigInput,
  options?: { enabled?: boolean; paths?: string[] },
): (phase: string, context: { defaultConfig: NextConfig }) => Promise<NextConfig>;

export default withDesignSystemLint;
