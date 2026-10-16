import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { CommandTag } from "@/components/ui/command-tag";
import { CtaStripDark } from "@/components/ui/cta-strip";
import { FaqList } from "@/components/ui/faq-row";
import { FloatingStickyBar } from "@/components/ui/floating-sticky-bar";
import { GlobalNav } from "@/components/ui/global-nav";
import { IconButton, IconButtonLink } from "@/components/ui/icon-button";
import { InstallSnippet } from "@/components/ui/install-snippet";
import { PricingCard } from "@/components/ui/pricing-card";
import { SearchInput } from "@/components/ui/search-input";
import { SiteFooter } from "@/components/ui/site-footer";
import { TerminalCard, TerminalTrafficLights } from "@/components/ui/terminal-card";
import { TextInput } from "@/components/ui/text-input";
import { TextLink } from "@/components/ui/text-link";
import { Grid, Section, Specimen, Swatch } from "./_catalog";
import { AppFrameSection } from "./_sections/app-frame";
import { ShadcnSection } from "./_sections/shadcn";
import { ShadcnMoreSection } from "./_sections/shadcn-more";
import { DataSection } from "./_sections/data";
import { DiagramsSection } from "./_sections/diagrams";
import { CodeSection } from "./_sections/code";
import { GraphSection } from "./_sections/graph";
import { FormsSection } from "./_sections/forms";
import { NarrativeSection } from "./_sections/narrative";
import { PanelsSection } from "./_sections/panels";

export const metadata: Metadata = {
  title: "디자인 시스템",
  description:
    "design.md 가 선언한 컴포넌트의 상태 매트릭스. 컴포넌트 정본의 시각 카탈로그다.",
};

/** 카탈로그 안에서만 쓰는 예시 데이터. 업무 데이터가 아니다. */
const NAV_ITEMS = [
  { label: "개요", href: "/design", current: true },
  { label: "토큰", href: "/design#tokens" },
  { label: "버튼", href: "/design#buttons" },
  { label: "타일", href: "/design#tiles" },
] as const;

const FOOTER_COLUMNS = [
  {
    id: "footer-col-method",
    title: "문서",
    links: [
      { label: "토큰 안내", href: "/design#tokens" },
      { label: "컴포넌트 목록", href: "/design#tokens" },
    ],
  },
  {
    id: "footer-col-stage",
    title: "워크스페이스",
    links: [
      { label: "프로젝트", href: "/design#buttons" },
      { label: "마일스톤", href: "/design#tiles" },
    ],
  },
] as const;

/** 아이콘 예시 — 데코레이션이므로 aria-hidden 이다. */
function ChevronIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="m6 3 5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function DesignSystemPage() {
  return (
    <>
      <GlobalNav
        brand="Sample"
        items={NAV_ITEMS}
        label="전역"
        actions={<Button size="sm">액션</Button>}
      />
      <main
        id="design-main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-app flex-col gap-12 px-4 py-8"
      >
        <header className="flex flex-col gap-2">
          <h1 className="text-xl font-semibold text-foreground">
            디자인 시스템 카탈로그
          </h1>
          <p className="max-w-reading text-base text-charcoal">
            컴포넌트를 상태별로 전시한다. hover 와 focus-visible 은 정적으로
            흉내내면 실제 규칙과 어긋나므로 여기에 그리지 않는다. Playwright 가
            실제로 마우스를 올리고 키보드 포커스를 준 뒤 스냅샷으로 검증한다.
          </p>
          <p className="max-w-reading text-base text-charcoal">
            <strong className="font-semibold text-foreground">근거</strong> — 시각 값(색 ·
            곡률 · 타이포 · 엘리베이션)은 전부 design.md 토큰이다. design.md 가
            해부도를 정의하지 않는 앱 컴포넌트는 ADS 실측 스펙을 구조 근거로 삼고,
            ADS 에도 없는 것(단계 흐름 · 카드 흐름 · Miller Columns · 리치 텍스트
            편집기)은 구조를 직접 정의했다.
          </p>
        </header>

        <Section
          id="tokens"
          title="색 토큰"
          note="이름은 shadcn 시맨틱 토큰, 값은 design.md(Ollama) 원문. 상태 색(status-*)만 앱 확장으로 더했다."
        >
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Swatch name="background" />
            <Swatch name="foreground" contrast="21:1" />
            <Swatch name="card" />
            <Swatch name="card-foreground" />
            <Swatch name="popover" />
            <Swatch name="popover-foreground" />
            <Swatch name="primary" contrast="흰 면 21:1" />
            <Swatch name="primary-foreground" />
            <Swatch name="primary-active" contrast="눌림 ink-deep" />
            <Swatch name="secondary" />
            <Swatch name="secondary-foreground" />
            <Swatch name="muted" />
            <Swatch name="muted-foreground" contrast="body 4.7:1" />
            <Swatch name="accent" contrast="hover 면" />
            <Swatch name="accent-foreground" />
            <Swatch name="selected" contrast="선택 면" />
            <Swatch name="destructive" contrast="= status-danger" />
            <Swatch name="border" />
            <Swatch name="input" />
            <Swatch name="sidebar" contrast="사이드바 면" />
            <Swatch name="sidebar-foreground" />
            <Swatch name="sidebar-primary" />
            <Swatch name="sidebar-primary-foreground" />
            <Swatch name="sidebar-accent" contrast="사이드바 hover" />
            <Swatch name="sidebar-accent-foreground" />
            <Swatch name="sidebar-border" />
            <Swatch name="sidebar-ring" />
            <Swatch name="ring" contrast="포커스 링 3.7:1" />
            <Swatch name="black" contrast="오버레이 전용" />
            <Swatch name="white" />
            <Swatch name="charcoal" contrast="7.8:1" />
            <Swatch name="mute" contrast="비활성 전용" />
            <Swatch name="hairline-strong" />
            <Swatch name="surface-dark" />
            <Swatch name="nav" />
            <Swatch name="on-dark" />
            <Swatch name="on-dark-mute" />
            <Swatch name="on-dark-border" contrast="어두운 면 구분선" />
            <Swatch name="terminal-red" contrast="terminal 전용" />
            <Swatch name="terminal-yellow" contrast="terminal 전용" />
            <Swatch name="terminal-green" contrast="terminal 전용" />
            <Swatch name="status-ok" contrast="6.44:1" />
            <Swatch name="status-ok-soft" />
            <Swatch name="status-info" contrast="7.05:1" />
            <Swatch name="status-info-soft" />
            <Swatch name="status-warn" contrast="6.37:1" />
            <Swatch name="status-warn-soft" />
            <Swatch name="status-danger" contrast="8.25:1" />
            <Swatch name="status-danger-soft" />
            <Swatch name="syntax-keyword" contrast="6.76:1" />
            <Swatch name="syntax-string" contrast="6.17:1" />
            <Swatch name="syntax-constant" contrast="6.10:1" />
            <Swatch name="syntax-function" contrast="7.07:1" />
            <Swatch name="syntax-comment" contrast="5.26:1" />
            <Swatch name="syntax-punctuation" contrast="7.49:1" />
          </div>
        </Section>

        <Section
          id="type"
          title="타입 스케일"
          note="design.md typography 원문. 제목 3단계(display-xl · display-lg · heading-lg)는 Nunito, 나머지는 Inter. letter-spacing 0."
        >
          <Grid>
            <Specimen name="{typography.display-xl}" state="36 / 500 / 1.11">
              <span className="font-heading text-4xl font-medium text-foreground">작업 흐름 정리</span>
            </Specimen>
            <Specimen name="{typography.display-lg}" state="30 / 500 / 1.2">
              <span className="font-heading text-3xl font-medium text-foreground">작업 흐름 정리</span>
            </Specimen>
            <Specimen name="{typography.heading-lg}" state="24 / 600 / 1.33">
              <span className="font-heading text-2xl font-semibold text-foreground">작업 흐름 정리</span>
            </Specimen>
            <Specimen name="{typography.heading-md}" state="20 / 500 / 1.4">
              <span className="text-xl font-medium text-foreground">작업 흐름 정리</span>
            </Specimen>
            <Specimen name="{typography.heading-sm}" state="18 / 500 / 1.56">
              <span className="text-lg font-medium text-foreground">작업 흐름 정리</span>
            </Specimen>
            <Specimen name="{typography.body-md}" state="16 / 400 / 1.5 — 기본">
              <span className="text-base text-foreground">작업 흐름 정리 · 16px</span>
            </Specimen>
            <Specimen name="{typography.body-sm}" state="14 / 400 / 1.43">
              <span className="text-sm text-foreground">작업 흐름 정리 · 14px</span>
            </Specimen>
            <Specimen name="{typography.caption-sm}" state="12 / 400 / 1.33">
              <span className="text-xs text-foreground">작업 흐름 정리 · 12px</span>
            </Specimen>
            <Specimen name="{typography.code-md} · {typography.code-sm}" state="16 · 14 등폭">
              <span className="font-mono text-base text-foreground">curl -fsSL …/install.sh | sh</span>
              <span className="font-mono text-sm text-foreground">$ ollama --version</span>
            </Specimen>
          </Grid>
        </Section>

        <Section
          id="buttons"
          title="버튼"
          note="design.md: 검정 pill · 흰 외곽 pill · 어두운 면 위 흰 pill · 비활성. 높이 36px, compact 32px(적용 차이 5)."
        >
          <Grid>
            <Specimen name="{component.button-primary}" state="기본 / compact / 비활성">
              <Button>Download</Button>
              <Button size="sm">
                Download
              </Button>
              <Button disabled>
                Download
              </Button>
            </Specimen>

            <Specimen
              name="{component.button-primary-active}"
              state="눌림"
              note="정적으로 흉내내지 않는다 — :active 에서 배경이 ink-deep 으로 내려간다."
            >
              <Button>Pressed</Button>
            </Specimen>

            {/* 비활성 링크는 표준이 없다. `disabled` 를 준 ButtonLink 는 링크가
                아니라 비활성 버튼으로 렌더된다 — 화면이 aria-disabled·opacity 로
                비활성을 흉내내지 않게 하려고 이 상태를 카탈로그에 남긴다. */}
            <Specimen name="button.tsx" state="ButtonLink — 링크 / 비활성">
              <ButtonLink href="/design" variant="outline" size="sm">
                이전
              </ButtonLink>
              <ButtonLink href="/design" variant="outline" size="sm" disabled>
                이전
              </ButtonLink>
            </Specimen>

            <Specimen name="{component.button-secondary}" state="기본 / compact / 비활성">
              <Button variant="outline">Sign in</Button>
              <Button variant="outline" size="sm">
                Sign in
              </Button>
              <Button variant="outline" disabled>
                Sign in
              </Button>
            </Specimen>

            <Specimen name="{component.button-pill-on-dark}" state="어두운 면">
              <Card variant="dark" className="flex-row gap-3 p-4">
                <Button variant="on-dark">Get Max</Button>
                <Button variant="on-dark" size="sm">
                  Get Max
                </Button>
              </Card>
            </Specimen>

            <Specimen name="{component.button-disabled}" state="비활성">
              <Button disabled>Disabled</Button>
            </Specimen>

            <Specimen
              name="icon-button.tsx"
              state="기본 / 비활성 / 링크"
              note="design.md 밖 앱 컴포넌트 — 아이콘만 있는 원형 버튼. 주소를 바꾸면 IconButtonLink."
            >
              <IconButton aria-label="다음 항목">
                <ChevronIcon />
              </IconButton>
              <IconButton aria-label="다음 항목 (비활성)" disabled>
                <ChevronIcon />
              </IconButton>
              <IconButtonLink href="/design#buttons" aria-label="버튼 구역으로 이동">
                <ChevronIcon />
              </IconButtonLink>
            </Specimen>

            <Specimen name="{component.link-inline}" state="밝은 면 / 어두운 면">
              <TextLink href="/design#buttons">근거 문서 열기</TextLink>
              <Card variant="dark" className="px-3 py-2">
                <TextLink href="/design#buttons" surface="dark">
                  근거 문서 열기
                </TextLink>
              </Card>
            </Specimen>

            <Specimen name="{component.link-mute}" state="보조 링크">
              <TextLink href="/design#buttons" tone="mute">
                hello@example.com
              </TextLink>
            </Specimen>
          </Grid>
        </Section>

        <Section
          id="pills"
          title="입력 · 코드 pill"
          note="design.md: 상호작용 요소와 코드 조각은 전부 rounded.full 이다."
        >
          <Grid>
            <Specimen name="{component.search-pill}" state="기본 / 비활성">
              <SearchInput label="모델 검색" labelHidden placeholder="Search models…" className="w-72" />
              <SearchInput label="모델 검색 (비활성)" labelHidden placeholder="Search models…" disabled className="w-72" />
            </Specimen>
            <Specimen name="{component.text-input}" state="기본 / 값 있음 / 비활성">
              <TextInput aria-label="이메일" placeholder="Email address" className="w-72" />
              <TextInput aria-label="이메일 (값 있음)" defaultValue="user@example.com" className="w-72" />
              <TextInput aria-label="이메일 (비활성)" placeholder="Email address" disabled className="w-72" />
            </Specimen>
            <Specimen name="{component.install-snippet}" state="기본" span>
              <InstallSnippet command="curl -fsSL https://ollama.com/install.sh | sh" className="w-full max-w-reading" />
            </Specimen>
            <Specimen name="{component.command-tag}" state="기본">
              <CommandTag>ollama launch openclaw</CommandTag>
            </Specimen>
          </Grid>
        </Section>

        <Section
          id="ollama-cards"
          title="카드 · FAQ · CTA"
          note="design.md: 카드는 rounded.lg(12px) + 1px hairline 이거나 어두운 면 반전, 둘뿐이다. 그림자 없음."
        >
          <Grid>
            <Specimen name="{component.terminal-card}" state="기본">
              <TerminalCard
                className="w-full"
                lines={[
                  { kind: "command", text: "ollama launch openclaw" },
                  { kind: "output", text: "Downloading model..." },
                  { kind: "output", text: "Configuring weights..." },
                  { kind: "result", text: "openclaw is running" },
                ]}
              />
            </Specimen>
            <Specimen name="{component.terminal-traffic-lights}" state="12px × 3">
              <TerminalTrafficLights />
            </Specimen>
          </Grid>
          <Specimen
            name="{component.pricing-card} · {component.pricing-card-dark} · {component.feature-bullet}"
            state="light / light / dark"
            span
          >
            <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-3">
              <PricingCard
                id="catalog-plan-free"
                name="Free"
                tagline="Get started with Ollama"
                price="$0"
                action={<Button variant="outline">Download</Button>}
                features={["Run models on your hardware", "Keep your data private"]}
              />
              <PricingCard
                id="catalog-plan-pro"
                name="Pro"
                tagline="Solve harder tasks, faster"
                price="$20"
                period="/mo"
                action={<Button>Get Pro</Button>}
                features={["Everything in Free, plus:", "Access larger cloud models"]}
              />
              <PricingCard
                id="catalog-plan-max"
                tone="dark"
                name="Max"
                tagline="For your most demanding work"
                price="$100"
                period="/mo"
                action={<Button variant="on-dark">Get Max</Button>}
                features={["Everything in Pro, plus:", "10x more usage than Pro"]}
              />
            </div>
          </Specimen>
          <Specimen name="{component.faq-row}" state="항상 펼침" span>
            <FaqList
              className="w-full max-w-reading"
              items={[
                { question: "Which models are available?", answer: "See the full list of cloud-enabled models in the documentation." },
                { question: "How fast is Ollama?", answer: "Speed depends on model size, architecture, and hardware optimization." },
              ]}
            />
          </Specimen>
          <Specimen name="{component.cta-strip-dark}" state="기본" span>
            <CtaStripDark
              id="catalog-cta"
              className="w-full"
              title="Get started with Ollama"
              action={<Button variant="on-dark">Download</Button>}
            />
          </Specimen>
        </Section>

        <ShadcnSection />
        <ShadcnMoreSection />
        <AppFrameSection />
        <DataSection />
        <FormsSection />
        <PanelsSection />
        <DiagramsSection />
        <CodeSection />
        <GraphSection />
        <NarrativeSection />

        <Section
          id="nav"
          title="내비게이션"
          note="이 페이지 상단의 흰 띠가 실제 사용례다. 아래는 고정 해제 상태의 표본이다."
        >
          <Specimen name="{component.primary-nav}" state="표본" span>
            <Card className="w-full gap-0 overflow-hidden py-0">
              <GlobalNav
                brand="Sample"
                items={NAV_ITEMS}
                label="전역 (표본)"
                className="static"
                actions={<Button size="sm">액션</Button>}
              />
            </Card>
          </Specimen>

        </Section>



        <Section
          id="bars"
          title="앱 확장 — 고정 바"
          note="design.md 밖 앱 컴포넌트. 떠 있는 느낌은 그림자가 아니라 backdrop-filter 가 만든다."
        >
          <Specimen
            name="floating-sticky-bar.tsx"
            state="표본 (고정 해제)"
            span
            note="카탈로그 전시용 · 미사용."
          >
            <Card className="w-full gap-0 overflow-hidden py-0">
              <FloatingStickyBar
                label="선택 요약 (표본)"
                className="static"
                summary="선택한 작업 3개 · 확인 필요 2건"
                action={<Button>리뷰 요청</Button>}
              />
            </Card>
          </Specimen>
        </Section>

        <Section id="footer" title="푸터" note="이 페이지 하단이 실제 사용례다.">
          <Specimen name="{component.footer-section}" state="페이지 하단" span>
            <p className="text-base text-muted-foreground">
              canvas 배경 위에 hairline 하나로 본문과 나뉜다. 링크는 link-mute,
              고지 행은 caption-sm 이고 색은 design.md 가 지정한 body 색이다.
            </p>
          </Specimen>
        </Section>
      </main>

      <SiteFooter
        columns={FOOTER_COLUMNS}
        legal="이 카탈로그의 예시 문구와 데이터는 UI 검토용 가상 예시다."
      />
    </>
  );
}
