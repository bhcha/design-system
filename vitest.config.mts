import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    // Playwright 스펙은 e2e 러너가 맡는다.
    include: ["src/**/*.test.{ts,tsx}"],
    environment: "node",
  },
});
