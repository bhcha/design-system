import { cva, type VariantProps } from "class-variance-authority";
import { badgeVariants } from "@/components/ui/badge-variants";
import { cn } from "@/lib/utils";

/**
 * Lozenge — 상태 표시
 *
 * 기반 primitive: shadcn Badge (`@/components/ui/badge` 의 `badgeVariants`)
 *   Badge 의 해부도(알약 · 캡션 크기 · 가운데 정렬 · 아이콘 슬롯)를 그대로 쓰고 톤 색만
 *   덧입힌다. `<Badge>` 컴포넌트 대신 `badgeVariants` 를 쓰는 이유: Badge 는 Base UI
 *   `useRender`(내부 useRef)로 그려져 서버 컴포넌트에서 호출할 수 없는데, Lozenge 는
 *   DataGrid 셀 등 서버 컴포넌트 안에서 쓰인다. 클래스 정의는 한 곳(badge.tsx)뿐이다.
 *
 * design.md 와의 관계
 *   상태 색은 design.md 적용 차이 3 — **상태 표시 전용**이며 상호작용 신호로 쓰지 않는다.
 *   클릭 가능한 것을 가리키는 색은 여전히 --color-primary 하나뿐이다.
 *
 * 해부도
 *   [ 라벨 ]  — Badge 알약(h-5 · px-2 py-0.5 · gap-1), data-slot="badge"
 *
 * 토큰
 *   --text-xs · font-semibold · --radius-full (pill)
 *   neutral --color-muted / --color-charcoal
 *   ok      --color-status-ok-soft / --color-status-ok        (6.44:1)
 *   info    --color-status-info-soft / --color-status-info    (7.05:1)
 *   warn    --color-status-warn-soft / --color-status-warn    (6.37:1)
 *   danger  --color-status-danger-soft / --color-status-danger(8.25:1)
 *
 * 상태
 *   상태 없음(표시용). 클릭 가능한 lozenge 가 필요하면 Button 을 쓴다.
 *
 * 키보드·ARIA
 *   색만으로 의미를 전달하지 않는다 — 라벨 텍스트가 항상 상태 이름을 담는다
 *   (초안 · 검토 중 · 승인 · 보관 · 확인 필요 …).
 *   목록 안에서 상태 열의 의미가 모호하면 호출부가 `srLabel` 로 문맥을 준다.
 *
 * 수용 기준
 *   - 라벨 없이 색만 있는 사용이 불가능하다(children 필수).
 *   - 어떤 톤이든 배경 대비 AA 이상.
 *   - 좁은 셀에서는 알약이 줄어들고 라벨이 말줄임된다(shrink 허용).
 */
/** Lozenge 의 tone → Badge 상태 variant. 색은 Badge 한 곳에만 있다. */
const TONE_TO_BADGE = {
  neutral: "muted",
  ok: "success",
  info: "info",
  warn: "warning",
  danger: "danger",
} as const;

const lozengeVariants = cva(
  // Badge 기본값 위에 덮는 것만 적는다. shrink 는 Badge 의 shrink-0 을 풀어 좁은
  // 셀에서 말줄임이 동작하게 한다.
  "max-w-full shrink rounded-full font-semibold",
  {
    variants: {
      tone: { neutral: "", ok: "", info: "", warn: "", danger: "" },
    },
    defaultVariants: { tone: "neutral" },
  },
);

export type LozengeProps = React.ComponentProps<"span"> &
  VariantProps<typeof lozengeVariants> & {
    children: React.ReactNode;
    /** 스크린 리더에만 덧붙일 문맥 (예: "상태"). */
    srLabel?: string;
  };

export function Lozenge({
  className,
  tone,
  children,
  srLabel,
  ...props
}: LozengeProps) {
  return (
    <span
      data-slot="badge"
      className={cn(
        badgeVariants({ variant: TONE_TO_BADGE[tone ?? "neutral"] }),
        lozengeVariants({ tone }),
        className,
      )}
      {...props}
    >
      {srLabel ? <span className="sr-only">{`${srLabel} `}</span> : null}
      <span className="truncate">{children}</span>
    </span>
  );
}

export { lozengeVariants };
