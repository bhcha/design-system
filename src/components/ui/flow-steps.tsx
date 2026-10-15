import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { CountBadge } from "@/components/ui/count-badge";
import { Item } from "@/components/ui/item";
import { cn } from "@/lib/utils";

/**
 * FlowSteps — 구분자로 이어지는 가로 흐름
 *
 * 근거: ADS 진행 표시(단계 + 구분자 + 현재 단계 강조). 같은 위상의 여러 흐름
 * 표시(파이프라인 · 단계 칩 · 이동 띠)를 **하나로 합치고 `density` 로 구분**했다.
 * 시각 값은 전부 design.md 토큰.
 *
 * 구현 — shadcn/ui Item 위에 조립한다
 *   단계 상자 하나 = Item(size="xs"). 링크 단계는 `render={<Link href />}` 로 같은 Item 을
 *   <a> 로 그린다 — 링크든 아니든 시각 계산은 Item + stepVariants 한 벌이다.
 *   포커스 표시는 Item 의 focus-visible ring(ring 3px · ring/50)을 쓴다.
 *   Item 의 `[a]:hover:bg-muted` 는 톤별 hover 로 덮는다(현재 단계는 hover 해도 selected 유지).
 *   Badge 는 맞지 않아 쓰지 않는다 — Badge 는 한 줄짜리 h-5 알약이고 단계는 최대 3줄 상자다.
 *   개수는 기존 CountBadge(스크린 리더 단위 포함)를 그대로 쓴다.
 *
 * 해부도
 *   [단계] › [단계] › [단계]
 *   단계 = [라벨] (+ [값]) (+ [보조])
 *
 * 토큰
 *   단계 배경 --color-muted · 곡률 --radius-lg(두 줄 카드)
 *   강조 단계 --color-selected + --color-primary
 *   경고 단계 --color-status-warn-soft + --color-status-warn
 *   흐린 단계 --color-charcoal (내용이므로 AA 유지. 비활성 컨트롤이 아니다)
 *   라벨 --text-xs + font-semibold · 값 --text-base + font-semibold
 *   구분자 --color-charcoal
 *
 * density
 *   compact — 라벨 한 줄 (단계 칩 · 이동 띠)
 *   full    — 라벨 + 값 + 보조 3줄 (파이프라인)
 *
 * 단계가 이동 수단일 때 (`href`)
 *   이동 띠는 눌러서 그 단계로 가는 띠다. `href` 가 있으면 단계 상자
 *   전체가 링크가 된다 — 라벨만 링크로 만들면 칩은 보이는데 눌리는 곳은 글자뿐인
 *   어긋난 클릭 영역이 된다. 현재 단계(`tone="current"`)에는 `aria-current="page"`
 *   를 준다(표시용 단계의 `step` 과 달리 실제 위치이기 때문이다).
 *
 * 상태
 *   기본 / 강조(current) / 경고 / 흐림(dim) / hover·focus(링크일 때만)
 *
 * 키보드·ARIA
 *   표시용이므로 <ol> 로 순서를 시맨틱하게 남기고 구분자는 `aria-hidden`.
 *   현재 단계는 `aria-current` 로 알린다 — 색에만 기대지 않는다.
 *   `href` 가 있는 단계는 링크라 Tab 으로 닿고 포커스 링이 보인다.
 *
 * 수용 기준
 *   - 좁은 폭에서 가로 스크롤한다(줄바꿈으로 순서가 흐트러지지 않는다).
 *   - 구분자를 스크린 리더가 읽지 않는다.
 *   - 링크 단계는 상자 전체가 클릭 영역이다.
 */
const stepVariants = cva(
  "w-auto shrink-0 flex-col flex-nowrap items-start gap-0.5 rounded-lg border-0 px-3 py-2",
  {
    variants: {
      tone: {
        neutral: "bg-muted text-foreground",
        current: "bg-selected text-primary",
        warn: "bg-status-warn-soft text-status-warn",
        dim: "bg-muted text-charcoal",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type FlowStep = {
  id: string;
  label: React.ReactNode;
  /** 단계의 현재 값 (full 밀도에서만 보인다). */
  value?: React.ReactNode;
  /** 값 아래 보조 설명 (full 밀도에서만 보인다). */
  hint?: React.ReactNode;
  /** 있으면 단계 상자 전체가 이 주소로 가는 링크가 된다. */
  href?: string;
  /** 라벨 옆 개수 (compact 밀도의 카운트 배지). */
  count?: number;
} & VariantProps<typeof stepVariants>;

export function FlowSteps({
  label,
  steps,
  density = "full",
  separator = "›",
  className,
}: {
  /** 흐름 전체의 이름. */
  label: string;
  steps: readonly FlowStep[];
  density?: "compact" | "full";
  separator?: string;
  className?: string;
}) {
  return (
    <ol
      aria-label={label}
      className={cn("flex items-stretch gap-2 overflow-x-auto pb-1", className)}
    >
      {steps.map((step, index) => (
        <li key={step.id} className="flex shrink-0 items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-base text-charcoal">
              {separator}
            </span>
          ) : null}

          <StepBox step={step} density={density} />
        </li>
      ))}
    </ol>
  );
}

/** 단계 상자 하나. 링크든 아니든 시각 계산은 한 벌이라 갈라질 수 없다. */
function StepBox({
  step,
  density,
}: {
  step: FlowStep;
  density: "compact" | "full";
}) {
  const className = cn(
    stepVariants({ tone: step.tone }),
    density === "compact" ? "py-1.5" : undefined,
    step.href ? "[a]:hover:bg-accent" : undefined,
    // 선택된 단계는 hover 색으로 덮이지 않는다 — hover 와 현재 위치는 다른 뜻이다.
    step.href && step.tone === "current" ? "[a]:hover:bg-selected" : undefined,
  );

  const body = (
    <>
      <span className="flex items-center gap-1.5 text-xs font-semibold">
        {step.label}
        {step.count === undefined ? null : <CountBadge value={step.count} />}
      </span>

      {density === "full" && step.value ? (
        <span className="text-base font-semibold">{step.value}</span>
      ) : null}

      {density === "full" && step.hint ? (
        <span className="text-xs text-charcoal">{step.hint}</span>
      ) : null}
    </>
  );

  if (step.href) {
    return (
      <Item
        size="xs"
        render={<Link href={step.href} />}
        aria-current={step.tone === "current" ? "page" : undefined}
        className={className}
      >
        {body}
      </Item>
    );
  }

  return (
    <Item
      size="xs"
      aria-current={step.tone === "current" ? "step" : undefined}
      className={className}
    >
      {body}
    </Item>
  );
}

export { stepVariants };
