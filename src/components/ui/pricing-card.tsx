import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * {component.pricing-card} · {component.pricing-card-dark} · {component.feature-bullet} — 스펙 시트
 *
 * 구현 — shadcn/ui Card 위에 조립한다
 *   Card(겉 상자) > <article>(시맨틱) > CardContent(아이콘) · CardHeader(CardTitle + CardDescription)
 *   · CardContent(가격 · CTA · 기능 목록). Card 는 div 만 그리므로 <article> 을 Card 안쪽에
 *   한 겹 둔다 — 호출부의 className 은 Card(보이는 상자)에 붙는다.
 *   Card 기본값(ring · rounded-xl · text-sm · py-4)은 design.md 값으로 덮는다.
 *
 * 해부도
 *   [ 아이콘 슬롯(32px) ]
 *   [ 이름 — heading-md ]
 *   [ 한 줄 설명 ]
 *   [ 가격 — display-lg ][ /주기 ]
 *   [ CTA 슬롯 — Button 하나, 전체 폭 ]
 *   ─────────────── (hairline)
 *   [ ✓ feature-bullet ] × n
 *
 * 토큰 — design.md {component.pricing-card} / {component.pricing-card-dark}
 *   tone="light" 배경 --color-background · 1px --color-border · 글자 --color-foreground
 *   tone="dark"  배경 --color-surface-dark(#171717) · 글자 --color-on-dark
 *                보조 글자 --color-on-dark-mute · 구분선 --color-on-dark-border
 *   곡률 --radius-lg(12px) · padding 32px(--card-spacing = spacing 8) · 본문 {typography.body-md}
 *   ring 없음(ring-0) — 테두리는 1px border 하나다.
 *   이름 --text-xl + font-medium · 가격 --text-3xl + font-heading + font-medium
 *   feature-bullet: ✓(ink) + {typography.body-sm} --color-charcoal(charcoal), 행 간격 8px
 *
 * 상태
 *   light / dark. design.md: 어두운 카드는 **한 화면에 하나만** 쓴다(호출부 책임).
 *
 * 키보드·ARIA
 *   <article aria-labelledby=이름>. 이름은 CardTitle 안의 <h3 id>. 기능 목록은 <ul>.
 *   ✓ 는 장식이라 aria-hidden. CTA 는 호출부가 넘기는 Button/ButtonLink 가 키보드를 책임진다.
 *
 * 수용 기준
 *   - 곡률 12px · padding 32px · 그림자·ring 없음.
 *   - dark 의 보조 글자가 on-dark-mute 이고 CTA 는 on-dark 버튼이다(호출부).
 */
export type PricingCardProps = {
  id: string;
  name: React.ReactNode;
  tagline?: React.ReactNode;
  price: React.ReactNode;
  period?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  features?: readonly React.ReactNode[];
  tone?: "light" | "dark";
  className?: string;
};

export function FeatureBullet({
  children,
  tone = "light",
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <li
      className={cn(
        "flex gap-2 text-sm",
        tone === "dark" ? "text-on-dark-mute" : "text-charcoal",
      )}
    >
      <span
        aria-hidden="true"
        className={tone === "dark" ? "text-on-dark" : "text-foreground"}
      >
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}

export function PricingCard({
  id,
  name,
  tagline,
  price,
  period,
  icon,
  action,
  features = [],
  tone = "light",
  className,
}: PricingCardProps) {
  const dark = tone === "dark";
  return (
    <Card
      className={cn(
        "gap-0 rounded-lg border text-base ring-0 [--card-spacing:--spacing(8)]",
        dark
          ? "border-surface-dark bg-surface-dark text-on-dark"
          : "border-border bg-background text-foreground",
        className,
      )}
    >
      <article aria-labelledby={id} className="flex flex-1 flex-col gap-4">
        {icon ? <CardContent className="text-xl">{icon}</CardContent> : null}
        <CardHeader className="gap-2">
          <CardTitle className="text-xl font-medium">
            <h3 id={id}>{name}</h3>
          </CardTitle>
          {tagline ? (
            <CardDescription
              className={cn("text-sm", dark ? "text-on-dark" : "text-charcoal")}
            >
              <p>{tagline}</p>
            </CardDescription>
          ) : null}
        </CardHeader>
        <CardContent>
          <p className="flex items-baseline gap-1">
            <span className="font-heading text-3xl font-medium">{price}</span>
            {period ? (
              <span
                className={cn(
                  "text-sm",
                  dark ? "text-on-dark-mute" : "text-charcoal",
                )}
              >
                {period}
              </span>
            ) : null}
          </p>
        </CardContent>
        {action ? (
          <CardContent className="flex flex-col">{action}</CardContent>
        ) : null}
        {features.length > 0 ? (
          <CardContent>
            <ul
              className={cn(
                "flex flex-col gap-2 border-t pt-4",
                dark ? "border-on-dark-border" : "border-border",
              )}
            >
              {features.map((feature, index) => (
                <FeatureBullet key={index} tone={tone}>
                  {feature}
                </FeatureBullet>
              ))}
            </ul>
          </CardContent>
        ) : null}
      </article>
    </Card>
  );
}
