import { cn } from "@/lib/utils";
import { Card, CardTitle } from "@/components/ui/card";

/**
 * {component.store-utility-card} — 스펙 시트
 *
 * 구현 — shadcn/ui Card 위에 조립한다
 *   Card(겉 상자) > <article>(시맨틱, 나머지 props 전달) > 이미지 · CardTitle(<h3>) · 보조 · 액션.
 *   Card 는 div 만 그리므로 <article> 을 안쪽에 한 겹 둔다. className 은 Card(보이는 상자)에,
 *   그 밖의 props(id · aria-* · data-* …)는 이전과 같이 <article> 에 붙는다.
 *   Card 기본값(ring · rounded-xl · py-4)은 design.md 값으로 덮는다.
 *
 * 해부도
 *   [ 1:1 이미지 (rounded-sm) ]
 *   [ 이름 (semibold) ]
 *   [ 보조 정보 ]
 *   [ 링크 슬롯 ]
 *
 * 토큰
 *   배경 --color-background · 테두리 1px --color-border · ring 없음 · 곡률 --radius-lg(12px)
 *   패딩 p-6(24px) · 간격 gap-3(12px)
 *   이름 --text-base + font-semibold (design.md 는 17px/600, 확정 스케일로 14px)
 *   보조 --text-base + text-charcoal
 *
 * design.md 원칙
 *   카드 자체에는 그림자가 없다. 이 앱에는 그림자 토큰이 없고 면과 테두리로만
 *   층을 만든다 — 무게가 필요하면 표면 색을 한 단계 내린다.
 *
 * 상태
 *   기본 / hover(표면 강조) — 카드 자체는 클릭 대상이 아니다.
 *   행 전체를 클릭 대상으로 만드는 패턴은 별도 컴포넌트(DataGrid 등)로 다룬다.
 *
 * 키보드·ARIA
 *   카드는 <article>. 이동은 내부 링크가 담당한다(카드 전체 onClick 금지).
 *
 * 수용 기준
 *   - 곡률 12px, 테두리 1px, 그림자·ring 0.
 *   - 이미지 슬롯이 비어도 레이아웃이 깨지지 않는다.
 *   - 긴 이름이 넘치지 않는다(break-words).
 */
export type StoreUtilityCardProps = React.ComponentProps<"article"> & {
  /** 1:1 이미지 슬롯. width/height 를 지정한 <Image>/<img> 를 넣는다. */
  media?: React.ReactNode;
  name: React.ReactNode;
  /** 가격·요약 등 보조 한 줄. */
  meta?: React.ReactNode;
  /** TextLink 등 액션 슬롯. */
  action?: React.ReactNode;
};

export function StoreUtilityCard({
  className,
  media,
  name,
  meta,
  action,
  children,
  ...props
}: StoreUtilityCardProps) {
  return (
    <Card
      className={cn(
        "gap-0 rounded-lg border border-border bg-background p-6 text-base text-foreground ring-0",
        className,
      )}
    >
      <article className="flex flex-1 flex-col gap-3" {...props}>
        {media ? (
          <div className="aspect-square overflow-hidden rounded-sm bg-muted">
            {media}
          </div>
        ) : null}

        <CardTitle className="text-base font-semibold break-words text-foreground">
          <h3>{name}</h3>
        </CardTitle>

        {meta ? <p className="text-base text-charcoal">{meta}</p> : null}

        {children}

        {action ? <div className="mt-auto pt-1 text-base">{action}</div> : null}
      </article>
    </Card>
  );
}
