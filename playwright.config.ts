import { defineConfig, devices } from "@playwright/test";

const PORT = 3210;
const BASE_URL = `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  /**
   * 상태를 JSON 파일에 남기므로 테스트가 **하나의 서버 상태를 공유한다.**
   * 병렬로 돌리면 쓰기 테스트가 읽기 테스트의 전제를 흔든다. 스위트가 십여 초라
   * 결정성을 택했다. 각 스펙은 필요하면 `/api/test-reset` 으로 자기 전제를 세운다.
   */
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: process.env.CI ? "line" : [["list"], ["html", { open: "never" }]],
  // 시각 회귀는 의도한 변경일 때만 갱신한다. 갱신 사유를 커밋 메시지에 남긴다.
  expect: {
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } },
    },
  ],
  webServer: {
    command: `npm run start -- --port ${PORT}`,
    // 테스트 전용 초기화 통로를 연다. 앱 실행에는 이 값이 없다.
    env: { DISCOVERY_TEST_RESET: "1" },
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
