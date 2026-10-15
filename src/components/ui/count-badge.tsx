import { badgeVariants } from "@/components/ui/badge-variants";
import { cn } from "@/lib/utils";

/**
 * CountBadge — 숫자 배지
 *
 * 기반 primitive: shadcn Badge (`badgeVariants`, variant "ghost")
 *   ghost 배지(배경·테두리 없음)를 쓰고 여백을 걷어 숫자만 남긴다. 카운트는 이미 알약인
 *   내비 항목·칩 **안에** 들어가므로 배경을 깔면 면이 이중으로 겹친다.
 *   `<Badge>` 대신 `badgeVariants` 를 쓰는 이유는 Lozenge 와 같다 — Badge 는 Base UI
 *   `useRender`(내부 useRef)라 서버 컴포넌트에서 호출할 수 없다.
 *
 * 해부도
 *   [ 숫자 ]  — 등폭 숫자로 자릿수가 바뀌어도 정렬이 흔들리지 않는다.
 *
 * 토큰
 *   --text-xs · font-semibold · --color-charcoal
 *   `font-variant-numeric: tabular-nums` (`tabular-nums` 유틸리티)
 *   ghost 의 hover 배경·글자색은 끈다 — 카운트는 상호작용 요소가 아니다.
 *
 * 상태
 *   기본 / 0 — 0 은 "없음"이므로 굵기를 낮춰 물러난다.
 *   색으로 내리지 않는다: --color-mute 는 비활성 컨트롤 전용(대비 예외)이고,
 *   0 은 읽어야 하는 내용이므로 AA 를 지켜야 한다.
 *
 * 키보드·ARIA
 *   숫자만으로는 의미가 없으므로 `label` 을 받아 스크린 리더 문장을 만든다.
 *   (예: "9건") 시각적으로는 숫자만 보인다.
 *
 * 수용 기준
 *   - 자릿수가 달라도 좌우 흔들림이 없다.
 *   - 스크린 리더가 숫자만 읽고 끝나지 않는다.
 */
export function CountBadge({
  value,
  label,
  className,
}: {
  value: number;
  /** 스크린 리더용 단위. 기본 "건". */
  label?: string;
  className?: string;
}) {
  const unit = label ?? "건";
  return (
    <span
      data-slot="badge"
      className={cn(
        badgeVariants({ variant: "ghost" }),
        "h-auto rounded-none border-0 p-0 text-xs font-semibold text-charcoal tabular-nums",
        "hover:bg-transparent hover:text-charcoal dark:hover:bg-transparent",
        value === 0 ? "font-normal" : undefined,
        className,
      )}
    >
      <span aria-hidden="true">{value}</span>
      <span className="sr-only">{`${value}${unit}`}</span>
    </span>
  );
}
