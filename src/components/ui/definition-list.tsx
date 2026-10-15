import { cn } from "@/lib/utils";

/**
 * DefinitionList — 키-값 목록
 *
 * 근거: ADS 상세 패널의 키-값 배치(라벨은 캡션·subtle, 값은 본문). 같은 역할의 여러
 * 변형을 하나로 합치고 `missing` 상태만 남겼다.
 *
 * 기반 primitive: 없음 — 네이티브 <dl>/<div>/<dt>/<dd> 를 의도적으로 유지한다.
 *   HTML 규칙상 <dl> 안의 묶음 div 는 <dt>/<dd> 만 자식으로 가질 수 있어 Item 하위 조각
 *   (div·p)이나 Separator 를 끼울 수 없다. Item 루트(`render` 로 div 대체)는 Base UI
 *   `useRender`(내부 useRef)라 서버 컴포넌트에서 호출할 수 없는데 이 목록은 서버 화면에서
 *   쓰인다. item.tsx 가 클라이언트 경계("use client")를 갖게 되면 `<Item render={<div />}>`
 *   로 묶음 상자를 옮길 수 있다.
 *
 * 해부도
 *   stacked : [라벨]        inline : [라벨][값]      [보조]
 *             [값]
 *
 * 토큰
 *   라벨 --text-xs + font-semibold + --color-charcoal
 *   값   --text-base + --color-foreground
 *   미확인 배경 --color-status-warn-soft + 좌측 2px --color-status-warn
 *   보조(타임스탬프 등) --text-xs + --color-charcoal
 *
 * 상태
 *   기본 / 미확인(missing) — 값이 아직 확인되지 않아 채워야 하는 자리
 *
 * design.md 규칙
 *   미확인 값을 붉은 오류색이 아니라 **경고(warn)** 색으로 칠한다. "확인 필요"는 틀린
 *   값이 아니라 아직 확인되지 않은 값이기 때문이다(모르는 것은 추측해 채우지 않는다).
 *
 * 키보드·ARIA
 *   <dl>/<dt>/<dd> 시맨틱을 유지한다. 미확인은 색이 아니라 값 텍스트(예: "확인 필요")가 알린다.
 *
 * 수용 기준
 *   - 값이 길어도 라벨 열이 무너지지 않는다.
 *   - 미확인 표시가 색 하나에만 기대지 않는다.
 */
export type DefinitionItem = {
  term: React.ReactNode;
  description: React.ReactNode;
  /** 우측 보조 정보 (출처·타임스탬프 등). */
  aside?: React.ReactNode;
  /** 아직 확인되지 않은 값. */
  missing?: boolean;
};

export function DefinitionList({
  items,
  layout = "stacked",
  className,
}: {
  items: readonly DefinitionItem[];
  /** stacked = 라벨 위 값 아래 · inline = 라벨 왼쪽 값 오른쪽 */
  layout?: "stacked" | "inline";
  className?: string;
}) {
  return (
    <dl className={cn("flex flex-col gap-2", className)}>
      {items.map((item, index) => (
        <div
          key={index}
          className={cn(
            "min-w-0 rounded-sm",
            item.missing
              ? "border-l-2 border-status-warn bg-status-warn-soft px-2 py-1.5"
              : undefined,
            layout === "inline"
              ? "flex flex-wrap items-baseline gap-x-3 gap-y-1"
              : "flex flex-col gap-0.5",
          )}
        >
          <dt
            className={cn(
              "text-xs font-semibold",
              item.missing ? "text-status-warn" : "text-charcoal",
              layout === "inline" ? "w-32 shrink-0" : undefined,
            )}
          >
            {item.term}
          </dt>

          <dd className="min-w-0 flex-1 text-base break-words text-foreground">
            {item.description}
          </dd>

          {item.aside ? (
            <dd className="shrink-0 text-xs text-charcoal tabular-nums">
              {item.aside}
            </dd>
          ) : null}
        </div>
      ))}
    </dl>
  );
}
