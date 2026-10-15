import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * SectionPanel — 구획 패널
 *
 * shadcn 기반
 *   shadcn `Card` 한 벌이다 — CardHeader(CardTitle · 메타 · CardAction · CardDescription)
 *   → CardContent(본문) → CardFooter(각주). 바깥 <section aria-labelledby> 는 랜드마크만
 *   맡고 시각은 전부 Card 가 든다(Card 는 render prop 이 없어 section 으로 렌더할 수 없다).
 *   Card 기본값에서 덮는 몫: 테두리 ring 색을 --color-border(hairline)로,
 *   글자 크기를 본문(--text-base)으로, 간격을 gap-3 으로, overflow 를 visible 로
 *   (본문 안 포커스 링·펼침 요소가 카드 가장자리에서 잘리지 않게).
 *   CardFooter 의 회색 띠·상단 선은 쓰지 않는다 — 각주는 본문과 같은 면에 놓인 한 줄이다.
 *
 * 근거: ADS 섹션/카드 해부도(제목 + 보조 메타 + 우측 슬롯 + 본문 + 각주).
 * 시각 값은 design.md 토큰 — 그림자는 쓰지 않고 표면 색과 1px 선으로 구분한다.
 *
 * 해부도
 *   <section>
 *   ┌ Card ─────────────────────────────────────┐
 *   │ CardHeader                                │
 *   │  CardTitle(h2) [메타]        CardAction   │
 *   │  CardDescription                          │
 *   │ CardContent [본문]                        │
 *   │ CardFooter  [각주]                        │
 *   └───────────────────────────────────────────┘
 *
 * 토큰
 *   배경 --color-card(흰 면) · 선 1px ring --color-border · 곡률 --radius-xl(=12px, rounded.lg)
 *   패딩 --card-spacing 16px(p-4) · 구획 간격 gap-3
 *   제목 --text-base + font-semibold · 메타·부제·각주 --text-xs + --color-charcoal
 *
 * 상태
 *   상태 없음(표시용 컨테이너).
 *
 * 키보드·ARIA
 *   <section aria-labelledby=제목id>. 제목 id 는 필수 — 랜드마크 이름이 된다.
 *
 * 수용 기준
 *   - 제목이 길어도 우측 슬롯(CardAction)을 밀어내지 않는다.
 *   - 각주가 없으면 하단 여백이 생기지 않는다(CardFooter 를 렌더하지 않는다).
 */
export type SectionPanelProps = React.ComponentProps<"section"> & {
  /** 제목 id — aria-labelledby 대상. */
  id: string;
  title: React.ReactNode;
  /** 제목 옆 한 줄 메타. */
  meta?: React.ReactNode;
  /** 제목 아래 부제. */
  description?: React.ReactNode;
  /** 헤더 우측 슬롯(상태 lozenge·액션). */
  actions?: React.ReactNode;
  /** 본문 아래 각주. */
  note?: React.ReactNode;
};

export function SectionPanel({
  className,
  id,
  title,
  meta,
  description,
  actions,
  note,
  children,
  ...props
}: SectionPanelProps) {
  const titleId = `${id}-title`;
  return (
    <section
      aria-labelledby={titleId}
      className={cn("flex flex-col", className)}
      {...props}
    >
      <Card className="flex-1 gap-3 overflow-visible text-base ring-border">
        <CardHeader className="gap-x-3 gap-y-1">
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
            <CardTitle className="min-w-0">
              <h2 id={titleId} className="text-base font-semibold text-foreground">
                {title}
              </h2>
            </CardTitle>
            {meta ? (
              <span className="min-w-0 flex-1 text-xs text-charcoal">{meta}</span>
            ) : null}
          </div>

          {actions ? (
            <CardAction className="flex items-center gap-2">{actions}</CardAction>
          ) : null}

          {description ? (
            <CardDescription className="text-xs text-charcoal">
              {description}
            </CardDescription>
          ) : null}
        </CardHeader>

        {children != null && children !== false ? (
          <CardContent className="flex flex-col gap-3">{children}</CardContent>
        ) : null}

        {note ? (
          <CardFooter className="border-t-0 bg-transparent pt-0 text-xs text-charcoal">
            <p>{note}</p>
          </CardFooter>
        ) : null}
      </Card>
    </section>
  );
}
