import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge-variants";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

/**
 * {component.configurator-option-chip} / -selected — 스펙 시트
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   OptionChip     → shadcn `Toggle` (Base UI Toggle — 네이티브 `<button aria-pressed>`).
 *                    `pressed` 는 `selected` 가 지배한다(제어). 호출부의 onClick 은 그대로 닿는다.
 *   OptionChipLink → Next `<Link>`. 이동이라 Toggle(aria-pressed)을 쓰지 않는다. Toggle 의
 *                    cva(toggleVariants)는 "use client" 모듈에서 오므로 서버 컴포넌트에서
 *                    부를 수 없다 — 그래서 칩 규격(chipClass)은 이 파일 한 곳에 두고
 *                    Toggle 과 Link 가 같이 쓴다. 포커스 링도 Toggle 과 같은 값을 적는다.
 *   Chip(읽기 전용) → shadcn `badgeVariants`(variant="secondary") 클래스를 `<span>` 에 쓴다.
 *                    Badge 컴포넌트는 useRender 훅이라 서버 컴포넌트에서 렌더할 수 없어
 *                    cva 만 빌린다(Chip 은 서버 화면에서 쓰인다).
 *   ToggleGroup 은 쓰지 않는다 — 칩마다 호출부가 선택을 쥐고 있고(필터 상태·URL),
 *   그룹 래퍼를 끼우면 호출부가 바뀐다.
 *
 * 해부도
 *   [ 썸네일(선택) ][ 라벨 ][ 보조값 ]
 *   4~5개가 한 행을 이루는 그리드 안의 선택 가능한 셀.
 *
 * 크기 두 단계
 *   default — design.md 의 마케팅용 설정기 옵션. px-4 py-3 (약 48px).
 *   compact — 데이터 밀도 화면(필터 칩 행)용 컨트롤. h-8(32px) · px-3(12px) ·
 *             14px/500 (design.md 적용 차이 5).
 *
 * 토큰
 *   배경 --color-background · 텍스트 --text-base · 패딩 px-4 py-3(16/12px)
 *   곡률 --radius-full
 *   기본 테두리   2px --color-border
 *   선택 테두리   2px --color-primary
 *   선택 배경     --color-selected  (hover 와 반드시 구분된다)
 *   hover 배경    --color-accent
 *   포커스        ring-3 --color-ring/50 (Toggle 과 같은 값)
 *   비활성        --color-muted 배경 + --color-mute 글자 (Toggle 의 opacity-50 은 덮는다)
 *
 * design.md 와의 관계
 *   상호작용 요소는 전부 {rounded.full} 이라는 원문 규칙에 따라 pill 이다.
 *
 * 선택 테두리에 accent-focus 를 쓰지 않는 이유
 *   design.md 원문은 선택 테두리로 primary-focus 를 적지만, 이 앱에서는 두 색의
 *   역할을 갈라 쓴다 — **선택 = --color-primary, 포커스 링 = --color-ring**.
 *   같은 색이면 "지금 포커스가 있는 칩"과 "선택된 칩"이 구분되지 않는다.
 *
 * 테두리 굵기를 두 상태 모두 2px 로 고정한 이유
 *   기본을 1px 로 두면 선택 순간 요소가 좌우 1px 씩 커져 그리드가 흔들린다.
 *   굵기를 고정하고 상태는 색·배경·굵기(weight)로 전달한다.
 *
 * 상태
 *   기본 / hover / 선택 / focus-visible / disabled
 *   선택은 테두리 색과 배경 **둘 다**로 표시한다. 색 하나에만 기대지 않는다.
 *   Toggle 원본의 `aria-pressed:bg-muted`(선택 = soft 면)는 `aria-pressed:bg-selected` 로
 *   덮어 hover(--color-accent)와 선택이 항상 다른 색이 되게 한다.
 *   default 크기는 글자 굵기(400→500)도 함께 바꾸고, compact 는 두 상태 모두 500 이다.
 *
 * 키보드·ARIA
 *   OptionChip 은 토글 버튼이므로 aria-pressed 로 선택 상태를 노출한다(Toggle).
 *   여러 개 중 하나만 고르는 자리라면 호출부가 radiogroup 으로 감싼다.
 *   OptionChipLink 의 현재 필터는 `aria-current="page"`.
 *   Chip 은 포커스를 받지 않는다.
 *   주의: Base UI Toggle 은 `value` prop 을 그룹 식별자로 쓰고 DOM 에 내리지 않는다.
 *
 * 수용 기준
 *   - 선택 상태에서 크기가 변하지 않는다(레이아웃 점프 없음).
 *   - hover 와 선택이 서로 다른 배경색이다.
 *   - compact 는 높이 32px · 14px/500 · padding 12px.
 */
type ChipShape = {
  selected?: boolean;
  /**
   * default — 큰 선택 셀(design.md 의 마케팅용 설정기 옵션). px-4 py-3
   * compact — 데이터 밀도 화면(필터 칩 행). h-8(32px) · px-3(12px) · 14px/500.
   *           목록·툴바에는 이 크기를 쓴다.
   */
  size?: "default" | "compact";
  /** 우측 개수. 필터 칩의 결과 수가 이 자리다. */
  count?: number;
};

function chipClass(
  { selected, size }: Required<Pick<ChipShape, "selected" | "size">>,
  className?: string,
) {
  return cn(
    "inline-flex select-none items-center gap-2 rounded-full border-2",
    "text-base text-foreground outline-none",
    "focus-visible:ring-3 focus-visible:ring-ring/50",
    "transition-transform duration-100 active:scale-95",
    "disabled:pointer-events-none disabled:bg-muted disabled:text-mute disabled:opacity-100",
    size === "compact" ? "h-8 min-w-0 px-3 text-sm" : "h-auto min-w-0 px-4 py-3",
    selected
      ? "border-primary bg-selected font-medium hover:bg-selected aria-pressed:bg-selected focus-visible:border-primary"
      : "border-border bg-background font-normal hover:bg-accent",
    // compact 는 두 상태 모두 14px/500 이다.
    size === "compact" ? "font-medium" : undefined,
    className,
  );
}

function ChipBody({
  children,
  count,
  selected,
}: {
  children: React.ReactNode;
  count?: number;
  selected: boolean;
}) {
  return (
    <>
      <span className="truncate">{children}</span>
      {typeof count === "number" ? (
        <span
          className={cn(
            "shrink-0 font-semibold tabular-nums",
            selected ? "text-primary" : "text-charcoal",
          )}
        >
          <span aria-hidden="true">{count}</span>
          <span className="sr-only">{`${count}건`}</span>
        </span>
      ) : null}
    </>
  );
}

export type OptionChipProps = Omit<React.ComponentProps<"button">, "type"> &
  ChipShape;

export function OptionChip({
  className,
  selected = false,
  size = "default",
  count,
  children,
  value,
  ...props
}: OptionChipProps) {
  return (
    <Toggle
      pressed={selected}
      // Toggle 의 value 는 그룹 식별자다. 문자열일 때만 그대로 넘긴다.
      value={typeof value === "string" ? value : undefined}
      className={chipClass({ selected, size }, className)}
      {...props}
    >
      <ChipBody count={count} selected={selected}>
        {children}
      </ChipBody>
    </Toggle>
  );
}

/**
 * OptionChipLink — 칩처럼 보이는 **이동**.
 *
 * 필터를 URL 에 두면 칩은 토글 버튼이 아니라 링크가 된다(보기 상태는 URL 에 둔다).
 * 버튼을 링크로 감싸면 상호작용 요소가 중첩돼 잘못된 마크업이 되므로, 같은
 * 클래스 계산을 공유하는 별도 진입점을 둔다 — 시각이 갈라질 수 없다.
 * 현재 필터는 `aria-current="page"` 로 알린다(aria-pressed 는 버튼 전용).
 */
export type OptionChipLinkProps = React.ComponentProps<typeof Link> & ChipShape;

export function OptionChipLink({
  className,
  selected = false,
  size = "default",
  count,
  children,
  ...props
}: OptionChipLinkProps) {
  return (
    <Link
      aria-current={selected ? "page" : undefined}
      className={chipClass({ selected, size }, className)}
      {...props}
    >
      <ChipBody count={count} selected={selected}>
        {children}
      </ChipBody>
    </Link>
  );
}

/**
 * Chip — 읽기 전용 값 칩
 *
 * OptionChip 과 형태는 같지만 **클릭 대상이 아니다.** 상세 패널에서 연결된 태그·
 * 담당자 목록처럼 값을 나열할 때 쓴다. 버튼으로 만들면 누를 수 있어 보이는데 아무 일도
 * 일어나지 않아 거짓 어포던스가 된다.
 *
 * 바탕: shadcn `badgeVariants({ variant: "secondary" })` — `<span>` 그대로.
 *
 * 토큰
 *   배경 --color-secondary(= surface-soft, --color-muted 와 같은 값) · 텍스트 --text-xs +
 *   --color-charcoal · 곡률 --radius-full · 패딩 px-2 py-1
 *   Badge 의 고정 높이(h-5)·투명 1px 테두리·font-medium·줄바꿈 금지·shrink-0 는 덮는다 —
 *   긴 값은 칩 폭 안에서 말줄임된다.
 */
const chipClassName = (selected: boolean, className?: string) =>
  cn(
    badgeVariants({ variant: "secondary" }),
    "h-auto max-w-full shrink justify-start rounded-full border-0 px-2 py-1",
    "text-xs font-normal",
    selected ? "bg-selected text-primary" : "text-charcoal",
    className,
  );

export function Chip({
  className,
  children,
  selected = false,
  ...props
}: React.ComponentProps<"span"> & {
  /** 지금 보고 있는 항목 — bg-selected + text-primary 로 구분한다. */
  selected?: boolean;
}) {
  return (
    <span className={chipClassName(selected, className)} {...props}>
      <span className="truncate">{children}</span>
    </span>
  );
}

/**
 * ChipLink — 이동하는 값 칩. Chip 과 같은 모양의 <Link>.
 * 다이어그램 안에서 연결된 항목으로 건너갈 때 쓴다. 선택 칩(OptionChipLink)과 달리
 * 고르는 것이 아니라 **값을 보여주며 그 항목으로 이동**한다. 현재 항목 표시는 호출부가
 * aria-current 로 정한다(위치가 page 가 아닐 수 있다).
 */
export function ChipLink({
  className,
  children,
  selected = false,
  ...props
}: React.ComponentProps<typeof Link> & { selected?: boolean }) {
  return (
    <Link className={chipClassName(selected, className)} {...props}>
      <span className="truncate">{children}</span>
    </Link>
  );
}
