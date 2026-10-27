import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("project library searches, filters, opens details, and adds a project", async ({ page }) => {
  await page.goto("/mockup");
  const projects = page.getByTestId("project-list").getByRole("article");
  await expect(projects).toHaveCount(6);
  await page.getByRole("searchbox", { name: "프로젝트 검색" }).fill("없는 프로젝트");
  await expect(page.getByText("프로젝트가 보이지 않아요")).toBeVisible();
  await page.getByRole("button", { name: "전체 프로젝트 보기" }).click();
  await page.getByRole("group", { name: "프로젝트 필터" }).getByRole("button", { name: /즐겨찾기/ }).click();
  await expect(projects).toHaveCount(2);
  await page.getByRole("button", { name: "브랜드 리뉴얼 즐겨찾기", exact: true }).click();
  await expect(projects).toHaveCount(1);
  await page.getByRole("button", { name: "디자인 시스템 열기" }).click();
  await expect(page.getByRole("dialog", { name: "디자인 시스템", exact: true })).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "새 프로젝트", exact: true }).click();
  await page.getByRole("textbox", { name: "프로젝트 이름 필수" }).fill("목업 검증 프로젝트");
  await page.getByRole("textbox", { name: "한 줄 소개" }).fill("브라우저에서 추가한 프로젝트입니다.");
  await page.getByRole("button", { name: "프로젝트 만들기" }).click();
  await expect(projects).toHaveCount(7);
  await expect(projects.first().getByRole("heading", { name: "목업 검증 프로젝트" })).toBeVisible();
  await page.getByRole("button", { name: "목록 보기", exact: true }).click();
  await expect(page.getByRole("button", { name: "목록 보기", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("combobox", { name: "프로젝트 정렬" }).selectOption("name");
  await expect(projects.first().getByRole("heading", { name: "10월 아카이브" })).toBeVisible();
});

test("project library fits mobile and passes accessibility checks", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/mockup");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
  await page.getByRole("button", { name: "새 프로젝트", exact: true }).click();
  await expect(page.getByRole("dialog", { name: "새 프로젝트", exact: true })).toBeVisible();
  expect((await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze()).violations).toEqual([]);
});
