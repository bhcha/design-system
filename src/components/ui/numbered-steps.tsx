import { ItemContent, ItemMedia } from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * NumberedSteps — 번호가 붙은 설명 단계
 *
 * 근거: ADS 단계 목록 해부도(원형 번호 + 제목 + 본문). 시각 값은 design.md 토큰.
 *
 * 기반 primitive: shadcn Separator(단계 사이 구분선) + Item 의 하위 조각(ItemMedia 번호 원 ·
 *   ItemContent 본문). 목록은 네이티브 <ol>/<li> 다 — ItemGroup 은 div[role=list] 라 순서
 *   시맨틱을 잃고, Item 루트는 Base UI `useRender`(내부 useRef)라 서버 컴포넌트에서 호출할
 *   수 없다. 제목은 ItemTitle(div) 대신 <h3> 를 유지해 문서 제목 구조를 지킨다.
 *
 * FlowSteps 와의 차이
 *   FlowSteps 는 가로로 진행을 보여주는 **상태 표시**다. NumberedSteps 는 세로로 읽는
 *   **설명 문서**다(온보딩의 "입력 권장 순서" 같은 자리).
 *
 * 해부도
 *   (1) [제목]            ← ItemMedia 번호 원 + ItemContent(h3 + 본문)
 *       [본문]
 *   ──────────────── ← Separator (첫 단계 위에는 없음)
 *   (2) [제목]
 *       [본문]
 *
 * 토큰
 *   번호 --color-primary 배경 + --color-primary-foreground · 원형 size-8
 *   흐린 단계 --color-border 배경 + --color-charcoal
 *   구분선 --color-border · 제목 --text-base + font-semibold
 *
 * 상태
 *   기본 / 흐림(dim — 지금 필요 없는 단계)
 *
 * 키보드·ARIA
 *   <ol>/<li> 로 순서를 시맨틱하게 남긴다. 번호 원은 `aria-hidden` —
 *   순서는 목록 시맨틱이 이미 전달한다. 구분선은 Separator(role="separator")로
 *   <li> 안 첫머리에 둔다 — <ol> 의 직계 자식은 <li> 뿐이어야 한다.
 *
 * 수용 기준
 *   - 첫 단계 위에 구분선이 생기지 않는다.
 *   - 흐린 단계도 읽을 수 있는 대비를 유지한다.
 */
export type NumberedStep = {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
  dim?: boolean;
};

export function NumberedSteps({
  steps,
  className,
}: {
  steps: readonly NumberedStep[];
  className?: string;
}) {
  return (
    <ol className={cn("flex flex-col", className)}>
      {steps.map((step, index) => (
        <li key={step.id} className="flex flex-col">
          {index > 0 ? <Separator /> : null}

          <div className="flex gap-3 py-4">
            <ItemMedia
              aria-hidden="true"
              className={cn(
                "size-8 rounded-full text-base font-semibold tabular-nums",
                step.dim
                  ? "bg-border text-charcoal"
                  : "bg-primary text-primary-foreground",
              )}
            >
              {index + 1}
            </ItemMedia>

            <ItemContent className="min-w-0 gap-2">
              <h3
                className={cn(
                  "text-base font-semibold",
                  step.dim ? "text-charcoal" : "text-foreground",
                )}
              >
                {step.title}
              </h3>
              <div className="flex flex-col gap-2 text-base text-charcoal">
                {step.children}
              </div>
            </ItemContent>
          </div>
        </li>
      ))}
    </ol>
  );
}
