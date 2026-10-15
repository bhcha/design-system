import { cn } from "@/lib/utils";

/**
 * QuoteBlock — 인용과 출처 위치
 *
 * 근거: ADS 인용 해부도(좌측 강조선 + 본문 + 출처). 시각 값은 design.md 토큰.
 *
 * 규칙 — 왜 출처가 필수인가
 *   인용은 **출처 위치**(문서·회의록·녹취의 위치나 시각)를 달고 다녀야 한다. 인용은 장식이
 *   아니라 "이 문장이 어디서 나왔는가"의 증거다. 그래서 출처(`source`)를 선택이
 *   아니라 필수 prop 으로 둔다.
 *
 * 구현 — shadcn primitive 없이 네이티브 <figure>/<blockquote>/<figcaption> 으로 둔다(의도)
 *   인용 블록은 카드가 아니라 좌측 강조선이 있는 가라앉은 면이다. Card(곡률 12px · ring ·
 *   안쪽 여백)는 맞지 않고, Separator 로 좌측 선을 그리면 role="separator" 가 인용 앞에
 *   끼어 스크린 리더가 의미 없는 구분선을 읽는다. 그래서 border-l 로 그린다.
 *
 * 해부도
 *   ┃ [인용문]
 *   ┃ [출처 · 타임스탬프]
 *
 * 토큰
 *   좌측 선 2px --color-primary · 배경 --color-muted · 곡률 --radius-sm
 *   인용문 --text-base + --color-foreground · 출처 --text-xs + --color-charcoal
 *
 * 상태
 *   상태 없음(표시용).
 *
 * 키보드·ARIA
 *   <figure> + <blockquote> + <figcaption>. 인용과 출처가 시맨틱으로 묶인다.
 *   타임스탬프는 등폭으로 정렬한다.
 *
 * 수용 기준
 *   - 출처 없이 컴파일되지 않는다.
 *   - 긴 인용문이 넘치지 않는다.
 */
export function QuoteBlock({
  children,
  source,
  className,
}: {
  children: React.ReactNode;
  /** 출처 위치. 예: "리뷰 회의록 · 10:33~11:04" */
  source: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "rounded-sm border-l-2 border-primary bg-muted px-3 py-2",
        className,
      )}
    >
      <blockquote className="text-base break-words text-foreground">
        {children}
      </blockquote>
      <figcaption className="mt-1 text-xs text-charcoal tabular-nums">
        {source}
      </figcaption>
    </figure>
  );
}
