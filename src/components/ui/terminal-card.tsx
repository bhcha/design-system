import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * {component.terminal-card} · {component.terminal-traffic-lights} — 스펙 시트
 *
 * 구현 — shadcn/ui Card 위에 조립한다
 *   Card(겉 상자) > <figure>(시맨틱) > 신호등 · <pre> · <figcaption>.
 *   Card 는 div 만 그리므로 <figure> 를 안쪽에 한 겹 둔다 — <figcaption> 이 <figure> 의
 *   직계 자식으로 남아 HTML 이 유효하고, 캡션은 이전처럼 상자 안에 있다.
 *   Card 기본값(ring · rounded-xl · py-4 · gap-4)은 design.md 값으로 덮는다.
 *
 * 해부도
 *   ┌───────────────────────────────┐
 *   │ ● ● ●                          │  ← 머리: 신호등 3점(12px, 간격 4px)
 *   ├───────────────────────────────┤  ← hairline(Separator)
 *   │ $ 명령                          │  ← kind="command" — ink
 *   │ 출력…                           │  ← kind="output"  — 보조 회색
 *   │ → 결과                          │  ← kind="result"  — ink
 *   └───────────────────────────────┘
 *
 * 토큰 — design.md {component.terminal-card}
 *   배경 --color-background · 1px --color-border · ring 없음 · 곡률 --radius-lg(12px) · padding 16px(p-4)
 *   본문 {typography.code-sm}(font-mono 14/20)
 *   신호등 --color-terminal-red · --color-terminal-yellow · --color-terminal-green, 12px(size-3) 원형
 *   출력 줄 --color-charcoal — design.md 의 mute(#a3a3a3)는 AA 미달이라
 *   이 시스템에서 비활성 전용이다(design.md 적용 차이 4).
 *
 * 상태
 *   정적 표시 하나뿐이다.
 *
 * 키보드·ARIA
 *   <figure> + 선택적 <figcaption>. 신호등은 장식이라 aria-hidden.
 *   줄은 <pre> 안의 텍스트라 스크린 리더가 순서대로 읽는다.
 *
 * 수용 기준
 *   - 신호등 3점이 12px 이고 terminal 토큰 색이다.
 *   - 곡률 12px · 1px hairline · 그림자·ring 없음.
 */
export type TerminalLine = {
  kind: "command" | "output" | "result";
  text: string;
};

export function TerminalTrafficLights() {
  return (
    <div aria-hidden="true" className="flex items-center gap-1">
      <span className="size-3 rounded-full bg-terminal-red" />
      <span className="size-3 rounded-full bg-terminal-yellow" />
      <span className="size-3 rounded-full bg-terminal-green" />
    </div>
  );
}

export function TerminalCard({
  lines,
  caption,
  className,
}: {
  lines: readonly TerminalLine[];
  caption?: React.ReactNode;
  className?: string;
}) {
  return (
    <Card
      render={<figure />}
      className={cn("gap-0 rounded-lg py-0", className)}
    >
      {/* 머리 — 신호등 줄 아래 hairline 하나로 본문과 나뉜다(Ollama terminal-card 원본). */}
      <div className="px-4 py-3">
        <TerminalTrafficLights />
      </div>
      <Separator />
      <pre className="overflow-x-auto p-4 font-mono text-sm">
        {lines.map((line, index) => (
          <span
            key={`${index}-${line.text}`}
            className={cn(
              "block",
              line.kind === "output" ? "text-charcoal" : "text-foreground",
            )}
          >
            {line.kind === "command" ? (
              <span className="text-charcoal">$ </span>
            ) : line.kind === "result" ? (
              "→ "
            ) : null}
            {line.text}
          </span>
        ))}
      </pre>
      {caption ? (
        <figcaption className="px-4 pb-4 text-xs text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </Card>
  );
}
