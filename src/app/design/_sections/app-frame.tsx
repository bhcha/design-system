import { AppShell } from "@/components/ui/app-shell";
import { Card } from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { CodeAvatar } from "@/components/ui/code-avatar";
import { PathBreadcrumb } from "@/components/ui/path-breadcrumb";
import { Button } from "@/components/ui/button";
import { GlobalNav } from "@/components/ui/global-nav";
import { PageHeader } from "@/components/ui/page-header";
import { SideNav } from "@/components/ui/side-nav";
import { SkipLink } from "@/components/ui/skip-link";
import { Grid, Section, Specimen } from "../_catalog";

const SIDE_NAV_GROUPS = [
  {
    id: "demo-nav-explore",
    label: "탐색",
    items: [
      {
        label: "프로젝트 구조",
        href: "/design#app-frame",
        description: "프로젝트에서 작업까지",
        current: true,
      },
      {
        label: "팀 관점",
        href: "/design#app-frame",
        description: "현재 프로젝트의 팀별 기여",
      },
    ],
  },
  {
    id: "demo-nav-review",
    label: "리뷰",
    items: [{ label: "리뷰 요청", href: "/design#app-frame", count: 9 }],
  },
  {
    id: "demo-nav-plan",
    label: "계획",
    items: [
      { label: "① 프로젝트 정의", href: "/design#app-frame", count: 1 },
      { label: "② 마일스톤", href: "/design#app-frame", count: 2 },
      { label: "③ 작업", href: "/design#app-frame", count: 0 },
      { label: "④ 릴리스", href: "/design#app-frame", count: 2, disabled: true },
    ],
  },
] as const;

const CRUMBS = [
  { label: "워크스페이스", href: "/design#app-frame" },
  { label: "Atlas", href: "/design#app-frame" },
  { label: "웹 개편", relation: "구성 1:N" },
] as const;

export function AppFrameSection() {
  return (
    <Section
      id="app-frame"
      title="앱 프레임"
      note="design.md 에 해부도가 없어 ADS 스펙으로 신설한 것들이다. 시각 값은 전부 우리 토큰."
    >
      <Grid>
        <Specimen
          name="skip-link.tsx"
          state="포커스 시 표시"
          note="Tab 을 눌러야 보인다. Playwright 가 실제 포커스로 검증한다."
        >
          <Card variant="muted" className="relative h-10 w-full py-0">
            <SkipLink targetId="design-main" />
            <span className="p-2 text-xs text-charcoal">
              이 액자 안에서 Tab 을 누르면 나타난다
            </span>
          </Card>
        </Specimen>

        <Specimen name="avatar.tsx" state="neutral / accent · sm / md / lg">
          <CodeAvatar initials="AT" size="sm" />
          <CodeAvatar initials="AT" size="md" />
          <CodeAvatar initials="AT" size="lg" />
          <CodeAvatar initials="PM" tone="primary" size="md" />
          <CodeAvatar initials="TM" tone="primary" size="lg" label="팀 관점" />
        </Specimen>

        <Specimen name="breadcrumb.tsx" state="관계 라벨 포함" span>
          <PathBreadcrumb items={CRUMBS} />
        </Specimen>

        <Specimen name="page-header.tsx" state="전체 / 최소" span>
          <div className="flex w-full flex-col gap-6">
            <PageHeader
              as="h2"
              eyebrow="Atlas · 프로젝트"
              title="프로젝트 탐색기"
              description="선택한 워크스페이스의 프로젝트부터 마일스톤·작업까지 탐색합니다."
              actions={
                <>
                  <Button variant="outline" size="sm">
                    열 너비 초기화
                  </Button>
                  <Button size="sm">프로젝트 만들기</Button>
                </>
              }
            />
            <PageHeader as="h2" title="리뷰" />
          </div>
        </Specimen>
      </Grid>

      <Specimen
        name="global-nav.tsx"
        state="light(앱 기본) / dark(design.md 원문)"
        span
        note="작업 도구의 상단바는 흰 면이 기본이다. design.md 가 규정한 검정 띠는 tone=&quot;dark&quot; 로 남아 있다."
      >
        <div className="flex w-full flex-col gap-3">
          <Card className="gap-0 overflow-hidden py-0">
            <GlobalNav
              brand="Atlas"
              label="전역 (브레드크럼)"
              className="static"
              breadcrumb={<PathBreadcrumb items={CRUMBS} label="위치 (표본)" />}
              actions={
                <Button variant="outline" size="sm">
                  워크스페이스 전환
                </Button>
              }
            />
          </Card>

          <Card className="gap-0 overflow-hidden py-0">
            <GlobalNav
              brand="Atlas"
              tone="dark"
              label="전역 (검정 · design.md)"
              className="static"
              breadcrumb={
                <PathBreadcrumb items={CRUMBS} surface="dark" label="위치 (검정 표본)" />
              }
              actions={
                <Button size="sm">
                  워크스페이스 전환
                </Button>
              }
            />
          </Card>
        </div>
      </Specimen>

      <Specimen name="side-nav.tsx" state="그룹 / 선택 / 카운트 / 비활성 / 부제" span>
        <Card className="w-64 gap-0 p-3">
          <SideNav
            groups={SIDE_NAV_GROUPS}
            header={
              <Item variant="muted" size="sm">
                <ItemMedia>
                  <CodeAvatar initials="AT" size="md" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Atlas</ItemTitle>
                </ItemContent>
              </Item>
            }
          />
        </Card>
      </Specimen>

      <Specimen
        name="app-shell.tsx"
        state="사이드바 + 작업 영역"
        span
        note="834px 미만에서는 사이드바가 본문 위로 접힌다."
      >
        <Card className="w-full gap-0 overflow-hidden py-0">
          <GlobalNav
            brand="Atlas"
            label="전역 (셸 표본)"
            className="static"
            breadcrumb={<PathBreadcrumb items={CRUMBS} label="위치 (셸 표본)" />}
          />
          <AppShell
            mainId="design-shell-main"
            sidebar={<SideNav groups={SIDE_NAV_GROUPS.slice(0, 2)} />}
          >
            <PageHeader
              as="h2"
              eyebrow="작업 영역"
              title="본문이 들어오는 자리"
              description="사이드바는 sticky, 본문만 스크롤한다."
            />
          </AppShell>
        </Card>
      </Specimen>
    </Section>
  );
}
