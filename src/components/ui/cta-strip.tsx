import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * {component.cta-strip-dark} — 스펙 시트
 *
 * 구현 — shadcn/ui Card 위에 조립한다
 *   Card(어두운 면) > <section>(랜드마크). Card 는 div 만 그리므로 <section> 을 안쪽에
 *   한 겹 둔다. 호출부의 className 은 Card(보이는 띠)에 붙는다.
 *   Card 기본값(ring · rounded-xl · bg-card · py-4)은 design.md 값으로 덮는다.
 *
 * 해부도
 *   [ 제목 — heading-lg ........................ ][ 액션 슬롯 ]
 *   좁은 폭에서는 두 줄로 감긴다.
 *
 * 토큰 — design.md {component.cta-strip-dark}
 *   배경 --color-surface-dark(#171717) · 글자 --color-on-dark · ring/테두리 없음
 *   제목 --text-2xl + font-heading + font-semibold
 *   padding 24px 32px(py-6 px-8) · 곡률 --radius-lg(12px)
 *
 * 상태
 *   정적 하나뿐이다. 액션은 on-dark 버튼을 쓴다(호출부).
 *
 * 키보드·ARIA
 *   <section aria-labelledby=제목>. 포커스는 액션 버튼만 받는다.
 *
 * 수용 기준
 *   - design.md: 섹션 사이에 드물게 쓴다. 어두운 면은 한 화면에 한 번만.
 *   - 곡률 12px · 그림자·ring 없음.
 */
export function CtaStripDark({
  id,
  title,
  action,
  className,
}: {
  id: string;
  title: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      variant="dark"
      render={<section aria-labelledby={id} />}
      className={cn(
        "flex-row flex-wrap items-center justify-between gap-4 rounded-lg px-8 py-6 text-base",
        className,
      )}
    >
      <h2 id={id} className="font-heading text-2xl font-semibold">
        {title}
      </h2>
      {action}
    </Card>
  );
}
