import { cn } from "@/lib/utils";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Lozenge } from "./lozenge";

/**
 * StageFlow — 단계 카드 흐름
 *
 * 근거: ADS 카드 흐름 해부도(가로 스크롤 + 동일 폭 카드 + 카드 안 요약).
 * 시각 값은 전부 design.md 토큰.
 *
 * FlowSteps 와의 차이
 *   FlowSteps 는 한두 줄짜리 단계 표시다. StageFlow 는 각 걸음마다 **상태·연결 요약을
 *   담은 카드**가 필요할 때 쓴다(예: 마일스톤별 작업 요약, 단계별 리뷰 상태).
 *
 * 구현 — shadcn/ui Card 위에 조립한다
 *   각 걸음 = <li> > Card(겉 상자) > overline · CardTitle(이름) · Lozenge 줄 · CardDescription(본문).
 *   상태 표시는 shadcn Badge 가 아니라 Lozenge 를 쓴다 — Badge 의 변형(default·secondary·
 *   destructive…)에는 ok·info·warn·danger 상태 팔레트(design.md 적용 차이 3)가 없다.
 *   Card 기본값(ring · rounded-xl · py-4 · gap-4 · text-sm)은 design.md 값으로 덮는다.
 *
 * 해부도
 *   ┌──────────┐  ┌──────────┐
 *   │ [번호·코드]│  │           │
 *   │ [이름]    │  │           │
 *   │ [상태들]  │  │           │
 *   │ [본문]    │  │           │
 *   └──────────┘  └──────────┘
 *
 * 토큰
 *   카드 배경 --color-background · 테두리 1px --color-border · ring 없음 · 곡률 --radius-lg · 패딩 p-3
 *   overline --text-xs + uppercase + --color-charcoal
 *   이름 --text-base + font-semibold
 *   카드 폭 w-56(224px) 고정 — 가로 스크롤에서 리듬이 유지된다
 *
 * 상태
 *   기본 / 강조(현재 단계 등)
 *
 * 키보드·ARIA
 *   <ol> 로 순서를 남기고, 가로 스크롤 컨테이너에 `tabIndex={0}` + `aria-label` 을 줘
 *   키보드만으로도 스크롤할 수 있게 한다.
 *
 * 수용 기준
 *   - 카드가 세로로 접히지 않는다(다이어그램이 목록으로 변질되지 않는다).
 *   - 스크롤 영역이 키보드로 조작된다.
 */
export type StageCard = {
  id: string;
  /** 카드 상단 코드·순번. */
  overline?: React.ReactNode;
  title: React.ReactNode;
  /** 상태 lozenge 목록. */
  statuses?: readonly { label: string; tone?: "neutral" | "ok" | "info" | "warn" | "danger" }[];
  children?: React.ReactNode;
  highlighted?: boolean;
};

export function StageFlow({
  label,
  stages,
  className,
}: {
  label: string;
  stages: readonly StageCard[];
  className?: string;
}) {
  return (
    <div
      tabIndex={0}
      role="group"
      aria-label={label}
      className={cn("w-full overflow-x-auto", className)}
    >
      <ol className="flex items-stretch gap-2 pb-2">
        {stages.map((stage) => (
          <li key={stage.id} className="shrink-0">
            <Card
              className={cn(
                "h-full w-56 gap-1.5 rounded-lg border p-3 ring-0",
                stage.highlighted
                  ? "border-primary bg-selected"
                  : "border-border bg-background",
              )}
            >
              {stage.overline ? (
                <p className="text-xs font-medium text-charcoal uppercase">
                  {stage.overline}
                </p>
              ) : null}

              <CardTitle className="text-base font-semibold break-words text-foreground">
                <p>{stage.title}</p>
              </CardTitle>

              {stage.statuses && stage.statuses.length > 0 ? (
                <div className="flex flex-wrap gap-1">
                  {stage.statuses.map((status) => (
                    <Lozenge key={status.label} tone={status.tone}>
                      {status.label}
                    </Lozenge>
                  ))}
                </div>
              ) : null}

              {stage.children ? (
                <CardDescription className="text-xs text-charcoal">
                  {stage.children}
                </CardDescription>
              ) : null}
            </Card>
          </li>
        ))}
      </ol>
    </div>
  );
}
