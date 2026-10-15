import { cn } from "@/lib/utils";

/**
 * {component.faq-row} — 스펙 시트
 *
 * 기반 primitive: 없음 — 네이티브 <dl>/<div>/<dt>/<dd> 를 의도적으로 유지한다.
 *   행 아래 hairline 은 Separator 와 같은 토큰(--color-border 1px)이지만 Separator 요소를
 *   끼울 수 없다: <dl> 의 직계 자식과 묶음 div 의 자식은 <dt>/<dd>(와 div 묶음)뿐이어야
 *   한다. 그래서 묶음 div 의 border-b 로 그린다.
 *
 * 해부도
 *   [ 질문 — heading-sm ]
 *   [ 답 — body-md, body 색 ]
 *   ───────────────────── (아래 1px hairline)
 *   항상 펼쳐져 있다 — 아코디언으로 접지 않는다(design.md).
 *
 * 토큰 — design.md {component.faq-row}
 *   배경 --color-background · padding 16px 0(py-4) · 아래 1px --color-border · 곡률 none
 *   질문 --text-lg + font-medium + --color-foreground
 *   답   --text-base + --color-muted-foreground · 질문과 답 사이 4px(gap-1)
 *
 * 상태
 *   정적 하나뿐이다.
 *
 * 키보드·ARIA
 *   <dl> 안의 <dt>/<dd> 쌍. 포커스를 받지 않는다.
 *
 * 수용 기준
 *   - 접기 장치가 없다.
 *   - 행 사이 구분은 hairline 하나뿐이다(카드·배경 없음).
 */
export type FaqItem = { question: React.ReactNode; answer: React.ReactNode };

export function FaqRow({ question, answer }: FaqItem) {
  return (
    <div className="flex flex-col gap-1 border-b border-border bg-background py-4">
      <dt className="text-lg font-medium text-foreground">{question}</dt>
      <dd className="text-base text-muted-foreground">{answer}</dd>
    </div>
  );
}

export function FaqList({
  items,
  className,
}: {
  items: readonly FaqItem[];
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-col", className)}>
      {items.map((item, index) => (
        <FaqRow key={index} question={item.question} answer={item.answer} />
      ))}
    </dl>
  );
}
