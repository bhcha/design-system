import { AppShell } from "@/components/ui/app-shell";
import { Card } from "@/components/ui/card";
import { Item, ItemContent, ItemMedia, ItemTitle } from "@/components/ui/item";
import { CodeAvatar } from "@/components/ui/code-avatar";
import { PathBreadcrumb } from "@/components/ui/path-breadcrumb";
import { Button } from "@/components/ui/button";
import { GlobalNav } from "@/components/ui/global-nav";
import { DocsSideNav, DocsToc } from "@/components/ui/docs-navigation";
import { DocsShell, DocsSection } from "@/components/ui/docs-shell";
import { DocsMobileMenu } from "@/components/ui/docs-mobile-menu";
import { DocsPager } from "@/components/ui/docs-pager";
import { PageHeader } from "@/components/ui/page-header";
import { SideNav } from "@/components/ui/side-nav";
import { SkipLink } from "@/components/ui/skip-link";
import { LinkTabs } from "@/components/ui/link-tabs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

/** 문서·작업 도구형 좌측 탐색 표본 — compact 밀도. */
const DOC_NAV_GROUPS = [
  {
    id: "demo-doc-learn",
    label: "학습",
    items: [
      { label: "질문 입력", href: "/design#app-frame", description: "자연어 질문" },
      { label: "변환 단계", href: "/design#app-frame", current: true },
      { label: "생성 SQL", href: "/design#app-frame", count: 3 },
    ],
  },
  {
    id: "demo-doc-ref",
    label: "참고",
    items: [
      { label: "스키마", href: "/design#app-frame" },
      { label: "실행 기록", href: "/design#app-frame", disabled: true },
    ],
  },
] as const;

const READER_NAV_GROUPS = [
  { id: "docs-demo-writing", label: "문서 만들기", items: [
    { label: "읽기 쉬운 문서 만들기", href: "/mockup/docs#doc=writing", current: true },
    { label: "정보 구조와 탐색", href: "/mockup/docs#doc=navigation" },
  ] },
  { id: "docs-demo-sharing", label: "함께 관리하기", defaultOpen: false, items: [
    { label: "검토와 업데이트", href: "/mockup/docs#doc=reviewing" },
  ] },
] as const;

/** 내비게이션 사용 기준 — 어떤 자리에 어떤 컴포넌트를 쓰나. */
const NAV_GUIDE = [
  { place: "전역 상단", component: "GlobalNav", when: "제품 전체에 걸친 이동·위치(브레드크럼)" },
  { place: "앱 좌측 탐색", component: "SideNav", when: "작업 화면 사이 이동. 촘촘한 도구 목록은 density=\"compact\"" },
  { place: "문서 읽기 화면", component: "DocsShell · DocsSideNav · DocsToc", when: "3열 배치 + 카테고리별 문서 + 현재 본문 절. 상단은 docs 변형" },
  { place: "문서 모바일 탐색", component: "DocsMobileMenu", when: "1024px 미만에서 현재 카테고리의 문서를 서랍으로 탐색" },
  { place: "문서 본문·이동", component: "DocsSection · DocsPager", when: "고정 메뉴를 피하는 H2 앵커와 이전·다음 문서 이동" },
  { place: "접히는 좌측 탐색", component: "Sidebar", when: "아이콘 모드·오프캔버스로 접어야 할 때" },
  { place: "프로젝트 수평 탭", component: "LinkTabs", when: "탭마다 주소가 바뀐다(새로고침·딥링크 유지)" },
  { place: "상세 보기 탭", component: "Tabs", when: "같은 화면 안에서 패널만 바꾼다(주소 그대로)" },
] as const;

const CRUMBS = [
  { label: "워크스페이스", href: "/design#app-frame" },
  { label: "Sample", href: "/design#app-frame" },
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
          <CodeAvatar initials="SA" size="sm" />
          <CodeAvatar initials="SA" size="md" />
          <CodeAvatar initials="SA" size="lg" />
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
              eyebrow="Sample · 프로젝트"
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
              brand="Sample"
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
              brand="Sample"
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
                  <CodeAvatar initials="SA" size="md" />
                </ItemMedia>
                <ItemContent>
                  <ItemTitle>Sample</ItemTitle>
                </ItemContent>
              </Item>
            }
          />
        </Card>
      </Specimen>

      <Specimen
        name="side-nav.tsx · density"
        state="default / compact (문서·작업 도구)"
        span
        note="compact — 메뉴 14px/20px · 한 줄 32px · 그룹 12px/16px · 선택은 옅은 면 + 굵기. 부제는 showDescription 으로만 켠다."
      >
        <div className="flex w-full flex-wrap gap-4">
          <Card className="w-64 gap-0 p-3">
            <SideNav groups={DOC_NAV_GROUPS} idPrefix="density-default-" />
          </Card>
          <Card variant="muted" className="w-60 gap-0 p-2">
            <SideNav groups={DOC_NAV_GROUPS} idPrefix="density-compact-" density="compact" />
          </Card>
        </div>
      </Specimen>

      <Specimen
        name="docs-shell.tsx · docs-navigation.tsx"
        state="문서용 상단 · 3열 셸 · 접이식 목록 · 본문 목차"
        span
        note="대웅 문서 시스템의 배치만 참고한다. GlobalNav layout=docs · LinkTabs variant=docs, 기존 색·서체를 공유한다."
      >
        <Card className="w-full gap-0 overflow-hidden py-0">
          <GlobalNav
            brand={<span className="flex items-center gap-3"><DocsMobileMenu title="작성 가이드" groups={READER_NAV_GROUPS} returnFocusId="catalog-docs-main" />Sample Docs</span>}
            layout="docs" label="문서 상단 (표본)" className="static"
          />
          <LinkTabs
            variant="docs"
            className="static"
            label="문서 카테고리 (표본)"
            current="docs-guide"
            items={[
              { value: "docs-start", label: "시작하기", href: "/mockup/docs#doc=overview" },
              { value: "docs-guide", label: "작성 가이드", href: "/mockup/docs#doc=writing" },
              { value: "docs-ref", label: "참고 자료", href: "/mockup/docs#doc=shortcuts" },
            ]}
          />
          <DocsShell
            contentAs="section" sticky={false} mainId="catalog-docs-main" articleLabelledBy="catalog-docs-title" sidebarLabel="문서 탐색 (표본)"
            sidebar={<DocsSideNav title="작성 가이드" label="문서 목록 (표본)" groups={READER_NAV_GROUPS} />}
            toc={<DocsToc label="본문 목차 (표본)" items={[{ label: "문서의 기본 구조", href: "#catalog-docs-structure", current: true }]} />}
          >
            <header className="flex flex-col gap-3">
              <h2 id="catalog-docs-title" className="font-heading text-2xl font-semibold">읽기 쉬운 문서 만들기</h2>
              <p className="text-sm text-charcoal">상단에서 주제를, 왼쪽에서 문서를, 오른쪽에서 본문 절을 고릅니다.</p>
            </header>
            <DocsSection id="catalog-docs-structure" title="문서의 기본 구조">
              <p className="text-sm text-charcoal">읽는 사람이 알아야 할 목적, 조건, 다음 행동을 순서대로 정리합니다.</p>
            </DocsSection>
            <DocsPager label="문서 이동 (셸 표본)" previous={{ label: "첫 문서 시작하기", href: "/mockup/docs#doc=quick-start" }} next={{ label: "정보 구조와 탐색", href: "/mockup/docs#doc=navigation" }} />
          </DocsShell>
        </Card>
      </Specimen>

      <Grid>
        <Specimen name="docs-mobile-menu.tsx" state="독립 호출 · 접힌 그룹 · Esc와 포커스 복귀" note="기본 호출 버튼은 1024px 미만에서 보인다. 이 표본은 trigger 슬롯으로 모든 폭에서 연다.">
          <DocsMobileMenu title="작성 가이드" groups={READER_NAV_GROUPS} returnFocusId="design-main" trigger={<Button variant="outline">문서 메뉴 표본 열기</Button>} />
        </Specimen>
        <Specimen name="docs-pager.tsx" state="다음만 / 이전만 · 긴 제목">
          <div className="flex w-full flex-col gap-4">
            <DocsPager label="다음 문서만 (표본)" next={{ label: "팀이 함께 읽고 계속 업데이트하는 문서 만들기", href: "/mockup/docs#doc=writing" }} />
            <DocsPager label="이전 문서만 (표본)" previous={{ label: "첫 문서 시작하기", href: "/mockup/docs#doc=quick-start" }} />
          </div>
        </Specimen>
      </Grid>

      <Specimen
        name="내비게이션 사용 기준"
        state="전역 상단 · 좌측 탐색 · 프로젝트 탭 · 상세 보기 탭"
        span
      >
        <div className="flex w-full flex-col gap-4">
          <Card className="w-full gap-0 overflow-hidden py-0">
            <GlobalNav
              brand="Sample"
              label="전역 (사용 기준 표본)"
              className="static"
              breadcrumb={<PathBreadcrumb items={CRUMBS} label="위치 (사용 기준 표본)" />}
            />
            <div className="flex">
              <Card variant="muted" className="m-2 w-56 shrink-0 gap-0 p-2">
                <SideNav groups={DOC_NAV_GROUPS} idPrefix="guide-" density="compact" />
              </Card>
              <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">
                <LinkTabs
                  label="프로젝트 (사용 기준 표본)"
                  current="steps"
                  items={[
                    { value: "steps", label: "변환 단계", href: "/design#app-frame" },
                    { value: "schema", label: "스키마", href: "/design#app-frame" },
                    { value: "history", label: "기록", href: "/design#app-frame" },
                  ]}
                />
                <Tabs defaultValue="sql">
                  <TabsList aria-label="상세 보기 (사용 기준 표본)">
                    <TabsTrigger value="sql">SQL</TabsTrigger>
                    <TabsTrigger value="tree">질의 트리</TabsTrigger>
                  </TabsList>
                  <TabsContent value="sql" className="mt-2">
                    <p className="text-sm text-charcoal">같은 화면 안에서 패널만 바뀐다.</p>
                  </TabsContent>
                  <TabsContent value="tree" className="mt-2">
                    <p className="text-sm text-charcoal">주소는 그대로다.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </Card>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>자리</TableHead>
                <TableHead>컴포넌트</TableHead>
                <TableHead>언제</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NAV_GUIDE.map((row) => (
                <TableRow key={row.place}>
                  <TableCell>{row.place}</TableCell>
                  <TableCell>
                    <span className="font-mono">{row.component}</span>
                  </TableCell>
                  <TableCell>{row.when}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Specimen>

      <Specimen
        name="app-shell.tsx"
        state="사이드바 + 작업 영역"
        span
        note="834px 미만에서는 사이드바가 본문 위로 접힌다."
      >
        <Card className="w-full gap-0 overflow-hidden py-0">
          <GlobalNav
            brand="Sample"
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
