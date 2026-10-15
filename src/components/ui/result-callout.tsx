import { cva, type VariantProps } from "class-variance-authority";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

/**
 * ResultCallout — 결과·알림 블록
 *
 * 기반 primitive: shadcn Alert (Alert · AlertTitle · AlertDescription)
 *   Alert 의 해부도(제목 + 본문)를 쓰고, 테두리 상자 대신 좌측 2px 강조선 + 톤 배경으로
 *   덮어쓴다. 시각 값은 design.md 토큰.
 *
 * 해부도
 *   ┃ [AlertTitle (선택)]
 *   ┃ [AlertDescription]
 *
 * 토큰
 *   info    --color-status-info-soft / --color-status-info
 *   ok      --color-status-ok-soft / --color-status-ok
 *   warn    --color-status-warn-soft / --color-status-warn
 *   danger  --color-status-danger-soft / --color-status-danger
 *   neutral --color-muted / --color-charcoal
 *   좌측 2px 강조선 + --radius-sm + p-3 · 제목 font-semibold · 본문은 톤 글자색을 물려받는다
 *
 * 상태
 *   상태 없음. `tone` 으로 성격만 바뀐다.
 *
 * 키보드·ARIA
 *   Alert primitive 의 기본 `role="alert"`(assertive)는 **쓰지 않는다** — 항상 끈다.
 *   **동작의 결과로 나타나는** 알림에는 `live` 를 켠다 — `role="status"` +
 *   `aria-live="polite"` 가 붙는다. 처음부터 있던 안내문에는 켜지 않는다
 *   (불필요한 낭독을 만들지 않기 위해).
 *   톤은 색이지만 의미는 제목·본문 텍스트가 전달한다.
 *
 * 수용 기준
 *   - 색만으로 성격을 전달하지 않는다.
 *   - live 를 켠 경우에만 스크린 리더가 자동으로 읽는다(role="alert" 가 남지 않는다).
 */
const calloutVariants = cva(
  "flex w-auto flex-col gap-1 rounded-sm border-0 border-l-2 p-3 text-base",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-charcoal",
        info: "border-status-info bg-status-info-soft text-status-info",
        ok: "border-status-ok bg-status-ok-soft text-status-ok",
        warn: "border-status-warn bg-status-warn-soft text-status-warn",
        danger: "border-status-danger bg-status-danger-soft text-status-danger",
      },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type ResultCalloutProps = React.ComponentProps<"div"> &
  VariantProps<typeof calloutVariants> & {
    title?: React.ReactNode;
    /** 동작의 결과로 나타나는 알림이면 켠다. */
    live?: boolean;
  };

export function ResultCallout({
  className,
  tone,
  title,
  live = false,
  children,
  ...props
}: ResultCalloutProps) {
  return (
    <Alert
      // Alert 는 role="alert" 를 기본으로 붙인다. 명시적으로 덮어 live 일 때만 status 가 된다.
      role={live ? "status" : undefined}
      aria-live={live ? "polite" : undefined}
      className={cn(calloutVariants({ tone }), className)}
      {...props}
    >
      {title ? <AlertTitle className="font-semibold">{title}</AlertTitle> : null}
      <AlertDescription className="text-base text-current text-wrap md:text-wrap [&_p:not(:last-child)]:mb-0">
        {children}
      </AlertDescription>
    </Alert>
  );
}

export { calloutVariants };
