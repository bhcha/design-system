import { cn } from "@/lib/utils";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Item } from "@/components/ui/item";
import { CountBadge } from "./count-badge";

/**
 * MillerColumns — 계층 탐색기
 *
 * 근거: macOS Finder 형 다단 열 탐색 패턴. ADS 에 대응 패턴이 없다. 시각 값은 design.md 토큰.
 *
 * 해부도
 *   ┌ 프로젝트 ────┐┌ 마일스톤 ────┐┌ 작업 ────────┐┌ 리뷰 ────────────┐
 *   │ 1  [n]       ││ 2  [n]       ││ 3  [n]       ││ 4  [n]           │
 *   ├──────────────┤├──────────────┤├──────────────┤├──────────────────┤
 *   │ [항목]       ││ [항목]       ││ [항목]       ││ [항목]           │
 *   │ [항목]       ││              ││              ││                  │
 *   └──────────────┘└──────────────┘└──────────────┘└──────────────────┘
 *
 *   항목 하나
 *   ┌──────────────────────┐
 *   │ [코드]      [상태]   │  ← 윗줄. 상태 배지가 이름과 폭을 다투지 않는다.
 *   │ [이름]               │
 *   │ [보조 한 줄]         │
 *   └──────────────────────┘
 *   배지를 이름 오른쪽에 두면 좁은 열(태블릿 3열 ≈ 200px)에서 이름이 한 글자씩
 *   끊긴다. 그래서 배지를 윗줄로 올린다.
 *
 * 항목 목록은 **DataGrid 를 쓰지 않는다**
 *   DataGrid 는 열이 있는 표 형태의 목록이다. 여기 열은 계층의 한 단계이고 항목은
 *   단일 열이므로 목록 시맨틱(listbox/option)만 공유하고 표 헤더를 쓰지 않는다.
 *   DataGrid 의 pointerdown 확정 규칙은 **여기에 해당하지 않는다** — 항목은
 *   클릭으로 상태를 확정하는 행이 아니라 <Link> 이동이고, 선택의 정본은 URL 이다.
 *   눌렀다 떼는 사이에 취소될 클라이언트 선택 자체가 없다.
 *
 * 구현 — shadcn/ui Card · Item 위에 조립한다
 *   열 하나 = <section>(격자 칸 · data-miller-column · 좁은 화면 숨김) > Card(보이는 상자)
 *   > CardHeader(번호 · CardTitle 안의 <h3> · 개수) · 검색 슬롯 · 항목 목록.
 *   <section> 을 바깥에 두는 이유: MillerNavigator 가 `[data-miller-column]` 의 폭을 재고
 *   data-* 를 바꿔 열을 숨기므로 격자 칸 자체가 그 요소여야 한다. 열 손잡이는 Card 의
 *   overflow-hidden 에 잘리지 않게 Card 바깥, <section> 안에 둔다.
 *   항목 한 행 — 기본 렌더러는 <Item size="xs">, 호출부의 <Link> 는 `millerItemClass()` 를
 *   받는다. item.tsx 가 `itemVariants` 를 내보내지 않아 millerItemClass 는 Item xs 의 겉
 *   (곡률 · 전환 · focus-visible ring 3px · ring/50)을 같은 값으로 적는다. 기본 렌더러에서는
 *   Item 의 1px 투명 테두리를 border-0 으로 지워 링크 행과 크기가 같다.
 *   가로 스크롤 틀은 ScrollArea 가 아니라 네이티브 overflow-x-auto 로 둔다 — ScrollArea 는
 *   스크롤이 안쪽 Viewport 에서 일어나 role="group" · aria-label · tabIndex 를 가진 바깥
 *   요소가 더 이상 키보드 스크롤 대상이 아니게 되고, 격자의 인라인 grid-template-columns
 *   폭 계산도 Viewport 기준으로 바뀐다.
 *
 * 토큰
 *   열 배경 --color-background · 테두리 1px --color-border · ring 없음 · 곡률 --radius-lg
 *   열 헤더 --text-xs + font-semibold + --color-charcoal + 하단 2px --color-border
 *   항목 --text-base · hover --color-accent
 *   선택 --color-selected + 좌측 2px --color-primary
 *   항목 한 행의 클래스는 `millerItemClass()` 하나뿐이다 — 기본 렌더러와 화면의
 *   링크 렌더러가 같은 함수를 부른다(DataGrid 의 rowClass 와 같은 문법).
 *
 * 열 너비 — 격자와 리사이저
 *   열 개수가 자료마다 달라 Tailwind 의 고정 `grid-cols-N` 을 쓸 수 없다. 개수는
 *   `--miller-count` 로 넘기고 격자 정의는 globals.css 의 `miller-grid` 한 곳에만 둔다.
 *   열 사이의 손잡이(`role="separator"`)는 **표시만** 이 파일이 하고, 드래그와
 *   ←→ 키 조작은 `MillerNavigator` 가 위임으로 처리한다.
 *
 * 좁은 화면
 *   xl(1069px) 미만에서는 손잡이를 숨긴다 — 열이 이미 3개·1개로 접혀 폭을 나눌 대상이
 *   없다. md 미만에서는 활성 열 하나만, md~xl 에서는 3개 창만 보인다. 어느 열을 보일지는
 *   `data-mobile-active` · `data-tablet-visible` 이 정하고 `MillerNavigator` 가 갱신한다.
 *
 * 열 검색
 *   `search` 슬롯에 컨트롤을 넣으면 헤더 아래에 붙는다. 검색 중에는 헤더 카운트가
 *   `보이는/전체` 로 바뀐다 — 몇 개가 숨었는지 보이지 않으면 목록을 신뢰할 수 없다.
 *
 * 상태
 *   기본 / hover / 선택 / 빈 열 / 좁은 화면에서 숨은 열
 *
 * 키보드·ARIA
 *   열은 <section aria-labelledby>, 항목 목록은 listbox/option.
 *   현재 경로는 Breadcrumb 이 따로 표시한다 — 여기서 중복해 읽히지 않게 한다.
 *   ↑↓ Home End(같은 열) · ←→(열 이동) 은 MillerNavigator 가 붙인다.
 *
 * 수용 기준
 *   - 좁은 폭에서 가로 스크롤한다(열이 세로로 접히지 않는다).
 *   - 빈 열에 빈 상태 문구가 나온다.
 */
export type MillerItem = {
  id: string;
  /** 윗줄 왼쪽 — 코드 같은 짧은 식별자. */
  overline?: React.ReactNode;
  label: React.ReactNode;
  /** 항목 아래 보조 한 줄. */
  meta?: React.ReactNode;
  /** 윗줄 오른쪽 상태 슬롯 (Lozenge 등). */
  badge?: React.ReactNode;
};

/**
 * 항목 한 행의 **겉** — 기본 렌더러와 호출부의 링크·버튼이 같은 한 벌을 쓴다.
 * (DataGrid 의 `rowClass()` 와 같은 문법. 화면이 이 클래스를 손으로 베끼는 순간
 *  카탈로그 표본과 실제 화면이 다른 물건이 된다 — 실제로 그렇게 갈라져 있었다.)
 *
 * hover 는 **여기에 포함된다**. 화면이 `hover:bg-accent` 를 덧붙여야 하는
 * 구조면 덧붙이지 않은 화면이 반드시 생긴다. 선택된 항목에는 hover 를 주지 않는다 —
 * ADS 는 hover 와 선택이 색으로 구분될 것을 요구하고, 선택 위에 hover 를 덮으면
 * 두 상태가 같아 보인다.
 *
 * @param selected 이 항목이 현재 선택(=URL 이 가리키는 항목)인가.
 */
export function millerItemClass(selected: boolean): string {
  return cn(
    // Item(size="xs") 의 겉 — 곡률 · 전환 · focus-visible ring 을 같은 값으로 맞춘다.
    // border-0 이 Item 의 1px 투명 테두리를 지워 기본 렌더러(<Item>)와 링크가 같은 크기다.
    "flex w-full items-start gap-2 rounded-lg border-0 border-l-2 px-2 py-2 transition-colors duration-100 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/50",
    selected
      ? "border-l-primary bg-selected"
      : "border-l-border hover:bg-accent",
  );
}

/**
 * 항목 한 칸의 속. 기본 표시와 호출부의 링크·버튼이 **같은 한 벌**을 쓴다 —
 * 두 벌이 되는 순간 드리프트가 시작된다.
 */
export function MillerItemBody({ item }: { item: MillerItem }) {
  return (
    <span className="flex min-w-0 flex-1 flex-col gap-1">
      {item.overline || item.badge ? (
        <span className="flex items-center justify-between gap-2">
          <span className="min-w-0 truncate text-xs font-semibold text-charcoal">
            {item.overline}
          </span>
          {item.badge ? <span className="shrink-0">{item.badge}</span> : null}
        </span>
      ) : null}

      <span className="text-base break-words text-foreground">
        {item.label}
      </span>

      {item.meta ? (
        <span className="text-xs break-words text-charcoal">{item.meta}</span>
      ) : null}
    </span>
  );
}

export type MillerColumn = {
  id: string;
  title: string;
  items: readonly MillerItem[];
  selectedId?: string | null;
  /** 검색 전 전체 개수. 주면 헤더가 `보이는/전체` 로 표시된다. */
  total?: number;
  /** 열 검색 슬롯. 호출부가 컨트롤을 넣는다. */
  search?: React.ReactNode;
  /** 항목이 없을 때의 문구. */
  emptyMessage?: React.ReactNode;
};

export function MillerColumns({
  label,
  columns,
  renderItem,
  className,
}: {
  label: string;
  columns: readonly MillerColumn[];
  /**
   * 항목을 실제 클릭 대상으로 만드는 함수. 선택 확정 규칙(pointerdown)이 필요한
   * 클라이언트 동작이므로 이 컴포넌트는 표시만 하고 상호작용은 호출부가 넣는다.
   */
  renderItem?: (item: MillerItem, column: MillerColumn) => React.ReactNode;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      tabIndex={0}
      className={cn("w-full overflow-x-auto", className)}
    >
      <div
        data-miller-grid=""
        style={{ "--miller-count": columns.length } as React.CSSProperties}
        className={cn(
          "miller-grid gap-3 pb-2",
          // 좁은 화면에서는 드래그로 넣은 인라인 폭을 무시하고 접힌 격자를 강제한다.
          "max-md:grid-cols-1!",
          "md:max-xl:grid-cols-3!",
        )}
      >
        {columns.map((column, index) => {
          const headingId = `${column.id}-heading`;
          return (
            <section
              key={column.id}
              aria-labelledby={headingId}
              data-miller-column={index}
              data-mobile-active={index === 0 ? "true" : "false"}
              data-tablet-visible={index < 3 ? "true" : "false"}
              className={cn(
                "relative flex min-w-0 flex-col",
                "max-md:data-[mobile-active=false]:hidden",
                "md:max-xl:data-[tablet-visible=false]:hidden",
              )}
            >
              <Card className="flex-1 gap-0 rounded-lg border border-border bg-background py-0 text-base text-foreground ring-0">
                <CardHeader className="flex items-center gap-2 border-b-2 border-border px-3 py-2">
                  <span className="text-xs font-semibold text-primary tabular-nums">
                    {index + 1}
                  </span>
                  <CardTitle className="min-w-0 flex-1 truncate text-xs font-semibold text-charcoal uppercase">
                    <h3 id={headingId} className="truncate">
                      {column.title}
                    </h3>
                  </CardTitle>
                  {typeof column.total === "number" &&
                  column.total !== column.items.length ? (
                    <span className="shrink-0 text-xs font-semibold text-charcoal tabular-nums">
                      <span aria-hidden="true">{`${column.items.length}/${column.total}`}</span>
                      <span className="sr-only">{`${column.total}개 중 ${column.items.length}개`}</span>
                    </span>
                  ) : (
                    <CountBadge value={column.items.length} label="개" />
                  )}
                </CardHeader>

                {column.search ? (
                  <div className="border-b border-border p-2">
                    {column.search}
                  </div>
                ) : null}

                {column.items.length === 0 ? (
                  // 기본 문구를 두지 않는다 — 첫 열에는 "앞 단계"가 없어서 그 문구가
                  // 성립하지 않는데, 기본값이 있으면 지정을 빠뜨린 열에서 조용히
                  // 거짓말을 한다. 왜 비었는지는 열마다 다르므로 호출부가 말한다.
                  // 검색 결과는 제출 뒤 바뀌는 동적 빈 상태라 aria-live 로 알린다.
                  <p aria-live="polite" className="p-3 text-xs text-charcoal">
                    {column.emptyMessage}
                  </p>
                ) : (
                  <ul className="flex flex-col p-1">
                    {column.items.map((item) => (
                      <li key={item.id} data-miller-item="">
                        {renderItem ? (
                          renderItem(item, column)
                        ) : (
                          <Item
                            size="xs"
                            className={millerItemClass(
                              item.id === column.selectedId,
                            )}
                          >
                            <MillerItemBody item={item} />
                          </Item>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              {index < columns.length - 1 ? (
                <span
                  role="separator"
                  aria-orientation="vertical"
                  aria-label={`${column.title} 열 너비 조절`}
                  // 조작할 수 있는 separator 는 window splitter 다 — 현재 값이 없으면
                  // 스크린 리더가 "얼마나 옮겼는지"를 읽을 수 없다(axe aria-required-attr).
                  // 값은 이웃한 두 열이 나눠 갖는 폭에서 왼쪽 열의 몫(%)이고,
                  // 기본은 균등이라 50 에서 시작한다. 끌면 MillerNavigator 가 갱신한다.
                  aria-valuenow={50}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  tabIndex={0}
                  data-miller-resizer={index}
                  className={cn(
                    "group absolute inset-y-0 -right-2 hidden w-4 cursor-col-resize touch-none",
                    "xl:block",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "pointer-events-none absolute top-1/2 left-1/2 h-8 w-0.5",
                      "-translate-x-1/2 -translate-y-1/2 rounded-full bg-border",
                      "group-hover:bg-primary group-focus-visible:bg-primary",
                      "group-data-[dragging=true]:bg-primary",
                    )}
                  />
                </span>
              ) : null}
            </section>
          );
        })}
      </div>
    </div>
  );
}
