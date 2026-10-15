import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommandTag } from "@/components/ui/command-tag";
import { CtaStripDark } from "@/components/ui/cta-strip";
import { FaqList } from "@/components/ui/faq-row";
import { FormField } from "@/components/ui/form-field";
import { GlobalNav } from "@/components/ui/global-nav";
import { InstallSnippet } from "@/components/ui/install-snippet";
import { PricingCard } from "@/components/ui/pricing-card";
import { SearchInput } from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import { SiteFooter } from "@/components/ui/site-footer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TerminalCard } from "@/components/ui/terminal-card";
import { TextInput } from "@/components/ui/text-input";
import {
  ColorSample,
  RadiusSample,
  SpaceSample,
  type ColorToken,
} from "@/components/ui/token-sample";

export const metadata: Metadata = {
  title: "Ollama 비교",
  description:
    "getdesign.md 의 Ollama 미리보기(preview.html)를 이 디자인 시스템(shadcn/ui + Ollama 토큰)의 컴포넌트만으로 다시 조립한 비교용 화면.",
};

/**
 * 비교용 화면 — getdesign.md/design-md/ollama/preview.html 의 구성을 그대로 따른다.
 * 규칙: 모양은 전부 components/ui(shadcn/ui + 앱 컴포넌트)에서 나온다. 화면 코드는
 * 배치·간격·글자만 정하고 면(배경·테두리·곡률)을 직접 만들지 않는다(design-system lint).
 * 미리보기 페이지 자체의 크롬(56px 제목·18px 리드 등)은 design.md 토큰이 아니므로
 * 가장 가까운 design.md 토큰으로 렌더한다.
 */

const NAV_ITEMS = [
  { label: "Colors", href: "/design/ollama#colors" },
  { label: "Typography", href: "/design/ollama#typography" },
  { label: "Components", href: "/design/ollama#components" },
  { label: "Layout", href: "/design/ollama#layout" },
] as const;

function Block({
  id,
  index,
  eyebrow,
  title,
  lead,
  children,
}: {
  id: string;
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col">
      <Separator />
      <div className="mx-auto flex w-full max-w-app flex-col gap-8 px-12 py-22">
        <div className="flex max-w-reading flex-col gap-3">
          <p className="text-xs font-medium uppercase text-muted-foreground">
            {index} — {eyebrow}
          </p>
          <h2 id={id} className="font-heading text-3xl font-medium text-foreground">
            {title}
          </h2>
          <p className="text-base text-muted-foreground">{lead}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

function GroupLabel({ children }: { children: React.ReactNode }) {
  return <h3 className="text-xs font-semibold uppercase text-foreground">{children}</h3>;
}

/* ---------------------------------------------------------------- 01 Color */

type ColorCard = { name: string; token: ColorToken; role: string };

const COLOR_GROUPS: readonly { label: string; cards: readonly ColorCard[] }[] = [
  {
    label: "Brand",
    cards: [
      { name: "Pure Black (primary)", token: "primary", role: "Every primary CTA, every black pill, every nav link, every solid icon" },
      { name: "Ink Deep", token: "primary-active", role: "Pressed-state black for the primary pill" },
    ],
  },
  {
    label: "Surface",
    cards: [
      { name: "Canvas", token: "background", role: "The page itself — nearly every surface" },
      { name: "Soft Surface", token: "muted", role: "Install-snippet pill, search pill, secondary chip backgrounds" },
      { name: "Surface Dark", token: "surface-dark", role: "The single inverted \"Max\" pricing card surface" },
      { name: "Hairline", token: "border", role: "1px card border, FAQ row divider, footer top-line" },
      { name: "Hairline Strong", token: "hairline-strong", role: "Slightly stronger divider where extra separation is needed" },
    ],
  },
  {
    label: "Text",
    cards: [
      { name: "Ink", token: "foreground", role: "Headlines, primary nav links, button text on light, prices" },
      { name: "Charcoal", token: "charcoal", role: "List-item text and secondary copy" },
      { name: "Body", token: "muted-foreground", role: "Default body color, FAQ answers, footer link text" },
      { name: "Mute", token: "mute", role: "Caption text, terminal \"comment\" gray, lowest-emphasis" },
    ],
  },
  {
    label: "Terminal Traffic Lights (mockup only)",
    cards: [
      { name: "Terminal Red", token: "terminal-red", role: "Close-window dot" },
      { name: "Terminal Yellow", token: "terminal-yellow", role: "Minimize dot" },
      { name: "Terminal Green", token: "terminal-green", role: "Zoom dot" },
    ],
  },
];

function ColorSection() {
  return (
    <Block
      id="colors"
      index="01"
      eyebrow="Color"
      title="Color Palette"
      lead="Pure black on pure white with three neutral grays for body and metadata. The single inverted dark surface — used for the &quot;Max&quot; pricing card — is the only colored moment in the entire system."
    >
      {COLOR_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-3">
          <GroupLabel>{group.label}</GroupLabel>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
            {group.cards.map((card) => (
              <Card key={card.name} className="gap-0 pt-0">
                <ColorSample token={card.token} size="lg" />
                <CardHeader className="pt-4">
                  <h4 className="text-sm font-semibold text-foreground">{card.name}</h4>
                  <p className="font-mono text-xs text-muted-foreground">--{card.token}</p>
                  <p className="text-xs text-charcoal">{card.role}</p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </Block>
  );
}

/* ----------------------------------------------------------- 02 Typography */

const TYPE_ROWS = [
  { name: "display-xl", spec: "Nunito · 36px / 500 / lh 1.11", className: "font-heading text-4xl font-medium", sample: "The easiest way to build with open models" },
  { name: "display-lg", spec: "Nunito · 30px / 500 / lh 1.2", className: "font-heading text-3xl font-medium", sample: "Pricing" },
  { name: "heading-lg", spec: "Nunito · 24px / 600 / lh 1.33", className: "font-heading text-2xl font-semibold", sample: "Automate your work" },
  { name: "heading-md", spec: "Inter · 20px / 500 / lh 1.4", className: "text-xl font-medium", sample: "Pro tier name or in-card title" },
  { name: "heading-sm", spec: "Inter · 18px / 500 / lh 1.56", className: "text-lg font-medium", sample: "FAQ question label" },
  { name: "body-md", spec: "Inter · 16px / 400 / lh 1.5", className: "text-base", sample: "Default body copy carries every paragraph, FAQ answer, and long-form prose section at 16px regular weight." },
  { name: "body-strong", spec: "Inter · 16px / 500 / lh 1.5", className: "text-base font-medium", sample: "Inline emphasis or primary nav link" },
  { name: "body-sm", spec: "Inter · 14px / 400 / lh 1.43", className: "text-sm", sample: "Feature bullet or footer link" },
  { name: "body-sm-strong", spec: "Inter · 14px / 500 / lh 1.43", className: "text-sm font-medium", sample: "Button label, pricing eyebrow" },
  { name: "caption-sm", spec: "Inter · 12px / 400 / lh 1.33", className: "text-xs", sample: "Footer copyright row" },
  { name: "code-md", spec: "ui-monospace · 16px / 400 / lh 1.5", className: "font-mono text-base", sample: "curl -fsSL https://example.com/install.sh | sh" },
  { name: "code-sm", spec: "ui-monospace · 14px / 400 / lh 1.43", className: "font-mono text-sm", sample: "$ ollama --version" },
  { name: "button-md", spec: "Inter · 14px / 500 / lh 1", className: "text-sm font-medium", sample: "Download" },
] as const;

function TypographySection() {
  return (
    <Block
      id="typography"
      index="02"
      eyebrow="Typography"
      title="Typography Scale"
      lead="SF Pro Rounded for display, system sans for body, ui-monospace for code. 이 시스템은 공개 대체 서체 Nunito · Inter 를 쓴다(한글은 Pretendard)."
    >
      <div className="flex flex-col">
        {TYPE_ROWS.map((row) => (
          <div key={row.name} className="flex flex-col">
            <div className="grid grid-cols-1 gap-3 py-6 md:grid-cols-4">
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-foreground">{row.name}</p>
                <p className="text-xs text-muted-foreground">{row.spec}</p>
              </div>
              <p className={`text-foreground md:col-span-3 ${row.className}`}>{row.sample}</p>
            </div>
            <Separator />
          </div>
        ))}
      </div>
    </Block>
  );
}

/* ----------------------------------------------------------- 03 Components */

function Tile({
  name,
  spec,
  dark,
  span,
  children,
}: {
  name: string;
  spec: string;
  dark?: boolean;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Card variant={dark ? "dark" : "default"} className={span ? "md:col-span-2" : undefined}>
      <CardContent className="flex flex-wrap items-center gap-3">{children}</CardContent>
      <CardHeader>
        <h4 className={dark ? "text-xs font-semibold uppercase text-on-dark" : "text-xs font-semibold uppercase text-foreground"}>
          {name}
        </h4>
        <p className={dark ? "font-mono text-xs text-on-dark-mute" : "font-mono text-xs text-muted-foreground"}>
          {spec}
        </p>
      </CardHeader>
    </Card>
  );
}

function ComponentsSection() {
  return (
    <Block
      id="components"
      index="03"
      eyebrow="Components"
      title="Button Variants"
      lead="A black pill, a white outlined pill, a white pill on dark, and a disabled state. That is the entire button vocabulary."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Tile name="button-primary" spec="bg primary · text on-primary · rounded full · 36px height">
          <Button>Download</Button>
        </Tile>
        <Tile name="button-primary-active" spec="bg ink-deep · text on-primary">
          <Button data-pressed="">Pressed</Button>
        </Tile>
        <Tile name="button-secondary" spec="bg canvas · text ink · 1px hairline-strong · rounded full">
          <Button variant="outline">Sign in</Button>
        </Tile>
        <Tile name="button-pill-on-dark" spec="bg canvas · text ink · sits inside dark Max pricing card" dark>
          <Button variant="on-dark">Get Max</Button>
        </Tile>
        <Tile name="button-disabled" spec="bg surface-soft · text mute">
          <Button disabled>Disabled</Button>
        </Tile>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Tile name="search-pill" spec="bg surface-soft · rounded full · 36px height · centered in nav" span>
          <SearchInput label="Search models" labelHidden placeholder="Search models" className="w-80" />
        </Tile>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Tile name="install-snippet" spec="bg surface-soft · code-md · 48px height · rounded full · the home page's signature CTA pill" span>
          <InstallSnippet command="curl -fsSL https://ollama.com/install.sh | sh" className="w-full" />
        </Tile>
        <Tile name="command-tag" spec="bg surface-soft · code-sm · rounded full · padding 6/12">
          <CommandTag>ollama launch openclaw</CommandTag>
        </Tile>
      </div>
    </Block>
  );
}

/* ---------------------------------------------------------------- 04 Cards */

function CardsSection() {
  return (
    <Block
      id="cards"
      index="04"
      eyebrow="Cards"
      title="Card Examples"
      lead="Two card families: the terminal mockup with macOS traffic lights, and the pricing tier card. The third tier flips to the dark inverted variant."
    >
      <div className="flex flex-col gap-3">
        <GroupLabel>Terminal Card</GroupLabel>
        <TerminalCard
          className="max-w-reading"
          lines={[
            { kind: "command", text: "ollama launch openclaw" },
            { kind: "output", text: "Downloading model..." },
            { kind: "output", text: "Configuring weights..." },
            { kind: "output", text: "Setting user limits..." },
            { kind: "result", text: "openclaw is running" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Pricing Cards</GroupLabel>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <PricingCard
            id="plan-free"
            icon={<span aria-hidden="true">🦙</span>}
            name="Free"
            tagline="Get started with Ollama"
            price="$0"
            action={<Button variant="outline">Download</Button>}
            features={[
              "Automate coding, document analysis, and other tasks with open models",
              "Keep your data private",
              "Run models on your hardware",
            ]}
          />
          <PricingCard
            id="plan-pro"
            icon={<span aria-hidden="true">🦙</span>}
            name="Pro"
            tagline="Solve harder tasks, faster"
            price="$20"
            period="/mo"
            action={<Button>Get Pro</Button>}
            features={[
              "Everything in Free, plus:",
              "Access larger, more powerful cloud models",
              "Run a model at a time with 60s cloud usage",
              "Upload and share private models",
            ]}
          />
          <PricingCard
            id="plan-max"
            tone="dark"
            icon={<span aria-hidden="true">🦙</span>}
            name="Max"
            tagline="For your most demanding work"
            price="$100"
            period="/mo"
            action={<Button variant="on-dark">Get Max</Button>}
            features={[
              "Everything in Pro, plus:",
              "Run 10 cloud models at a time",
              "10x more usage than Pro",
            ]}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <GroupLabel>Dark CTA Strip</GroupLabel>
        <CtaStripDark
          id="cta-strip"
          title="Get started with Ollama"
          action={<Button variant="on-dark">Download</Button>}
        />
      </div>
    </Block>
  );
}

/* ----------------------------------------------------------- 05 Disclosure */

const FAQ = [
  { question: "Which models are available?", answer: "See the full list of cloud-enabled models in the documentation." },
  { question: "Do models support tool calling?", answer: "Models support tool calling and run agent workflows before they go live. If something isn't working, let us know." },
  { question: "What quantization or data format do cloud models use?", answer: "Native weights, as released by the model provider. On modern NVIDIA hardware, models may use accelerated data formats supported by Blackwell and Hopper architectures." },
  { question: "How fast is Ollama?", answer: "Speed depends on model size, architecture, and hardware optimization. We target and monitor for low time-to-first-token and high throughput across all cloud models." },
] as const;

function FaqSection() {
  return (
    <Block
      id="faq"
      index="05"
      eyebrow="Disclosure"
      title="FAQ Rows"
      lead="Stacked rows with 16px vertical padding and a 1px Hairline divider below each. Always expanded — no accordion collapse."
    >
      <FaqList className="max-w-reading" items={FAQ} />
    </Block>
  );
}

/* ---------------------------------------------------------------- 06 Forms */

function FormsSection() {
  return (
    <Block
      id="forms"
      index="06"
      eyebrow="Forms"
      title="Form Elements"
      lead="All inputs are pills with rounded-full corners. Focus uses a blue ring — the only blue in the system."
    >
      <div className="grid max-w-reading grid-cols-1 gap-6 md:grid-cols-2">
        <FormField label="Default Input" hint="canvas bg · 1px hairline · rounded full · 40px height">
          <TextInput placeholder="Email address" />
        </FormField>
        <FormField label="Focused Input" hint="canvas bg · ink border · focus ring (Tab 으로 확인)">
          <TextInput defaultValue="user@example.com" />
        </FormField>
        <SearchInput label="Search Pill" placeholder="Search models" />
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-charcoal">Submit</p>
          <Button className="w-full">Sign Up</Button>
        </div>
      </div>
    </Block>
  );
}

/* --------------------------------------------------------------- 07 Layout */

const SPACING = [
  { name: "xxs · 2", step: "xxs" },
  { name: "xs · 4", step: "xs" },
  { name: "sm · 8", step: "sm" },
  { name: "md · 12", step: "md" },
  { name: "lg · 16", step: "lg" },
  { name: "xl · 24", step: "xl" },
  { name: "xxl · 32", step: "xxl" },
  { name: "section · 88", step: "section" },
] as const;

function LayoutSection() {
  return (
    <Block
      id="layout"
      index="07"
      eyebrow="Layout"
      title="Spacing Scale"
      lead="8px base unit with finer 2/4/6px steps. Section rhythm sits at 88px — the universal vertical gap between major content blocks."
    >
      <div className="flex flex-wrap items-end gap-6">
        {SPACING.map((space) => (
          <div key={space.name} className="flex flex-col items-start gap-2">
            <SpaceSample step={space.step} />
            <span className="font-mono text-xs text-muted-foreground">{space.name}</span>
          </div>
        ))}
      </div>
    </Block>
  );
}

/* --------------------------------------------------------------- 08 Shapes */

const RADII = [
  { name: "none · 0", radius: "none", use: "Nav, footer, FAQ row dividers" },
  { name: "sm · 6", radius: "sm", use: "Inline code chips, command tags" },
  { name: "md · 8", radius: "md", use: "Rare medium-radius surfaces" },
  { name: "lg · 12", radius: "lg", use: "Pricing cards, terminal mockup" },
  { name: "full · 9999", radius: "full", use: "Every button, pill input, traffic-light dot" },
] as const;

function ShapesSection() {
  return (
    <Block
      id="shapes"
      index="08"
      eyebrow="Shapes"
      title="Border Radius Scale"
      lead="Two values do all the work: pill (9999px) for every interactive element and 12px for cards. Nothing in between."
    >
      <div className="flex flex-wrap gap-6">
        {RADII.map((r) => (
          <div key={r.name} className="flex w-32 flex-col items-center gap-2 text-center">
            <RadiusSample radius={r.radius} />
            <span className="font-mono text-xs text-muted-foreground">{r.name}</span>
            <span className="text-xs text-charcoal">{r.use}</span>
          </div>
        ))}
      </div>
    </Block>
  );
}

/* ---------------------------------------------------------------- 09 Depth */

function DepthSection() {
  return (
    <Block
      id="depth"
      index="09"
      eyebrow="Depth"
      title="Elevation & Depth"
      lead="No drop shadows. The only &quot;elevation&quot; beyond a 1px hairline border is the inverted dark surface used on the highest-tier pricing card."
    >
      <Card variant="muted" size="lg" className="flex-row flex-wrap gap-4 px-6">
        <Card variant="flat" className="h-36 w-64 justify-between">
          <CardHeader>
            <h4 className="text-sm font-semibold">Level 0 — Flat</h4>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs text-muted-foreground">no border / no shadow</p>
          </CardContent>
        </Card>
        <Card className="h-36 w-64 justify-between">
          <CardHeader>
            <h4 className="text-sm font-semibold">Level 1 — Hairline</h4>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs text-muted-foreground">1px solid hairline</p>
          </CardContent>
        </Card>
        <Card variant="dark" className="h-36 w-64 justify-between">
          <CardHeader>
            <h4 className="text-sm font-semibold">Level 2 — Inverted Dark</h4>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-xs text-on-dark-mute">
              bg surface-dark · the system&apos;s only &quot;elevated&quot; surface
            </p>
          </CardContent>
        </Card>
      </Card>
    </Block>
  );
}

/* ----------------------------------------------------------- 10 Responsive */

const BREAKPOINTS = [
  { name: "desktop-large", width: "1280px+", change: "Default — 720px content column, 3-up pricing" },
  { name: "desktop", width: "1024px", change: "Same layout; nav remains horizontal" },
  { name: "tablet", width: "850px", change: "Pricing 3-up → 2+1; search pill compresses" },
  { name: "tablet-narrow", width: "768px", change: "Pricing collapses to 1-up stacked; nav becomes hamburger" },
  { name: "mobile", width: "640px", change: "Hero drops 36px → ~28px; install-snippet wraps" },
] as const;

function ResponsiveSection() {
  return (
    <Block
      id="responsive"
      index="10"
      eyebrow="Responsive"
      title="Responsive Behavior"
      lead="5 breakpoint zones with a documentation-first collapse strategy. Section rhythm shrinks 88px → 64px → 48px on the way down."
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Width</TableHead>
            <TableHead>Key Changes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {BREAKPOINTS.map((row) => (
            <TableRow key={row.name}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.width}</TableCell>
              <TableCell>{row.change}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Block>
  );
}

/* ------------------------------------------------------------------ Page */

export default function OllamaComparisonPage() {
  return (
    <>
      <GlobalNav
        brand="getdesign.md"
        items={NAV_ITEMS}
        label="전역"
        actions={<Button>Download</Button>}
      />
      <main id="ollama-main" tabIndex={-1} className="flex flex-col">
        <header className="mx-auto flex w-full max-w-app flex-col gap-6 px-12 py-22">
          <h1 className="font-heading text-4xl font-medium text-foreground">
            Design System Analysis of Ollama
          </h1>
          <p className="max-w-reading text-base text-muted-foreground">
            An almost defiantly minimal documentation-first system that treats the
            home page like a Markdown README — paper-white canvas, center-aligned
            headline, a single black pill CTA, an inline terminal install snippet.
            No gradient, no hero photography, no marketing pyrotechnics.
          </p>
          <div className="flex gap-3">
            <Button>Download</Button>
            <ButtonLink href="/design" variant="outline">
              Sign in
            </ButtonLink>
          </div>
        </header>
        <ColorSection />
        <TypographySection />
        <ComponentsSection />
        <CardsSection />
        <FaqSection />
        <FormsSection />
        <LayoutSection />
        <ShapesSection />
        <DepthSection />
        <ResponsiveSection />
      </main>
      <SiteFooter legal="Rebuilt with this design system (shadcn/ui + Ollama tokens) · getdesign.md/ollama 미리보기 기준" />
    </>
  );
}
