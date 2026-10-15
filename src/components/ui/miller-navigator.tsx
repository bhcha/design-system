"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

/**
 * MillerNavigator — 계층 탐색기의 상호작용 껍데기
 *
 * `MillerColumns` 는 서버 컴포넌트로 두고 이 껍데기가 **이벤트만 위임한다.**
 * DataGrid ↔ SelectableDataGrid 와 같은 구조다 — 열 마크업이 두 벌 생기지 않는다.
 *
 * 하는 일 셋
 *   1. 키보드 — 같은 열 안에서 ↑↓ Home End, 열 사이는 ←→.
 *      Tab 만으로는 항목이 수십 개인 열을 지나갈 수 없다.
 *   2. 열 너비 — 손잡이를 끌거나 ←→ 로 16px 씩 옮긴다. 이웃한 두 열의 폭 합을
 *      유지하고 각 열은 최소 192px 아래로 내려가지 않는다(4px 그리드에 맞춘
 *      하한).
 *      [열 너비 초기화]는 인라인 폭을 지워 globals.css 의 기본 격자로 되돌린다.
 *   3. 좁은 화면 — md 미만은 한 열씩, md~xl 은 활성 열 주변 3개 창.
 *      어느 열을 보일지는 `data-mobile-active` · `data-tablet-visible` 로 표시한다.
 *
 * 구현 — shadcn/ui Button 위에 조립한다
 *   이전·다음 단계와 [열 너비 초기화]는 Button(variant="outline", size="sm") 이다.
 *   이동 바 틀은 <nav> 랜드마크라 Card(div)로 바꾸지 않고 네이티브로 둔다 — Card 를 안에
 *   한 겹 더 두면 테두리 상자 하나에 요소만 늘어난다. 열 손잡이(role="separator")는
 *   조작 가능한 window splitter 라 shadcn Separator(장식용 구분선, 값·포커스 없음)로
 *   대체하지 않는다. 키보드·드래그 위임 로직은 primitive 와 무관하게 그대로다.
 *
 * 해부도
 *   [‹ 이전 단계] [ n / 전체 · 현재 단계 ] [다음 단계 ›]   ← md 미만에서만
 *                                       [열 너비 초기화]   ← xl 이상에서만
 *   ┌ MillerColumns (children) ───────────────────────────┐
 *   │  … │ ‖ … │ ‖ …                                      │  ‖ = 열 손잡이
 *   └─────────────────────────────────────────────────────┘
 *
 * 토큰
 *   이동 바 --color-background · 테두리 --color-border · 곡률 --radius-lg
 *   단계 표시 --text-xs + --color-charcoal · 현재 단계 --text-base + font-semibold
 *   버튼은 Button 의 outline · sm(32px compact) 을 그대로 쓴다 — 여기서 새 시각 규칙을 만들지 않는다.
 *
 * 폭은 상태가 아니라 DOM 에 쓴다
 *   드래그는 초당 수십 번 일어난다. 리렌더로 처리하면 열 안의 모든 항목이 다시
 *   그려진다. 그래서 격자의 `grid-template-columns` 만 직접 갱신한다.
 *
 * 단계는 URL 에 없다
 *   "지금 몇 번째 열을 보는가"는 딥링크로 공유할 값이 아니라 화면 폭에 따른 표시
 *   상태다. 선택 자체는 여전히 URL 에 있으므로 새로고침해도 고른 항목은 남는다.
 *
 * 상태
 *   데스크톱(전 열 + 손잡이) / 태블릿(3열 창) / 모바일(1열 + 이동 바)
 *
 * 키보드·ARIA
 *   손잡이는 `role="separator"` + `tabIndex=0` 이며 ←→ 로 조작된다.
 *   이동 바는 <nav>, 현재 위치는 "n / 전체" 로 읽힌다.
 *
 * 수용 기준
 *   - ↑↓ 로 같은 열 안을 순회하고 ←→ 로 이웃 열의 선택 항목으로 넘어간다.
 *   - 초기화를 누르면 폭이 균등으로 돌아온다.
 *   - md 미만에서 한 번에 한 열만 보인다.
 */

/** 열 최소 폭. globals.css 의 `miller-grid` minmax 하한과 같은 값이다. */
const MIN_COLUMN = 192;
/** ←→ 한 번에 옮기는 폭. */
const STEP = 16;

export function MillerNavigator({
  titles,
  children,
  className,
}: {
  /** 열 이름. 이동 바가 "지금 어느 단계인지"를 읽는 데 쓴다. */
  titles: readonly string[];
  /** `<MillerColumns …/>`. 서버에서 그려 넘긴다. */
  children: React.ReactNode;
  className?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [level, setLevel] = useState(0);

  const columnsOf = useCallback(
    () =>
      Array.from(
        rootRef.current?.querySelectorAll<HTMLElement>("[data-miller-column]") ??
          [],
      ),
    [],
  );

  const gridOf = useCallback(
    () =>
      rootRef.current?.querySelector<HTMLElement>("[data-miller-grid]") ?? null,
    [],
  );

  /** 좁은 화면 창 갱신 — 어느 열을 보일지 표시한다. */
  useEffect(() => {
    const columns = columnsOf();
    const start = Math.max(0, Math.min(Math.max(0, columns.length - 3), level - 1));
    for (const [index, column] of columns.entries()) {
      column.dataset.tabletVisible =
        index >= start && index < start + 3 ? "true" : "false";
      column.dataset.mobileActive = index === level ? "true" : "false";
    }
  }, [columnsOf, level, titles.length]);

  /** 그 열의 선택 항목(없으면 첫 항목)으로 포커스를 옮긴다. */
  const focusColumn = useCallback(
    (index: number) => {
      const column = columnsOf()[index];
      if (!column) return;
      const items = itemsIn(column);
      const current = items.find(
        (item) => item.getAttribute("aria-current") === "true",
      );
      (current ?? items[0])?.focus();
    },
    [columnsOf],
  );

  /**
   * 두 이웃 열의 폭 합을 유지한 채 경계를 옮긴다.
   * 손잡이의 `aria-valuenow` 도 함께 갱신한다 — 값 없는 splitter 는 읽히지 않는다.
   */
  const applyWidths = useCallback(
    (handle: HTMLElement, index: number, base: number[], nextLeftRaw: number) => {
      const grid = gridOf();
      if (!grid || base.length <= index + 1) return;
      const widths = [...base];
      const pair = widths[index] + widths[index + 1];
      const nextLeft = Math.max(
        MIN_COLUMN,
        Math.min(pair - MIN_COLUMN, nextLeftRaw),
      );
      widths[index] = nextLeft;
      widths[index + 1] = pair - nextLeft;
      grid.style.gridTemplateColumns = widths
        .map((width) => `${Math.round(width)}px`)
        .join(" ");
      handle.setAttribute(
        "aria-valuenow",
        String(Math.round((nextLeft / pair) * 100)),
      );
    },
    [gridOf],
  );

  const widthsNow = useCallback(
    () => columnsOf().map((column) => column.getBoundingClientRect().width),
    [columnsOf],
  );

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const handle = target.closest<HTMLElement>("[data-miller-resizer]");
    if (!handle) return;
    // 손잡이는 xl 이상에서만 보인다. 접힌 격자에서는 나눌 폭이 없다.
    if (handle.offsetParent === null) return;

    event.preventDefault();
    const index = Number(handle.dataset.millerResizer);
    const startX = event.clientX;
    const startWidths = widthsNow();
    handle.dataset.dragging = "true";
    handle.setPointerCapture(event.pointerId);

    const move = (moveEvent: PointerEvent) => {
      applyWidths(
        handle,
        index,
        startWidths,
        startWidths[index] + moveEvent.clientX - startX,
      );
    };

    const end = () => {
      handle.dataset.dragging = "false";
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
    };

    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    const handle = target.closest<HTMLElement>("[data-miller-resizer]");
    if (handle) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const index = Number(handle.dataset.millerResizer);
      const base = widthsNow();
      applyWidths(
        handle,
        index,
        base,
        base[index] + (event.key === "ArrowRight" ? STEP : -STEP),
      );
      return;
    }

    const column = target.closest<HTMLElement>("[data-miller-column]");
    if (!column || !target.closest("[data-miller-item]")) return;

    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      const items = itemsIn(column);
      const at = items.indexOf(target);
      if (at < 0 || items.length === 0) return;
      const next =
        event.key === "ArrowDown"
          ? (at + 1) % items.length
          : event.key === "ArrowUp"
            ? (at - 1 + items.length) % items.length
            : event.key === "Home"
              ? 0
              : items.length - 1;
      items[next]?.focus();
      return;
    }

    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      event.preventDefault();
      const at = Number(column.dataset.millerColumn);
      const next = Math.max(
        0,
        Math.min(titles.length - 1, at + (event.key === "ArrowRight" ? 1 : -1)),
      );
      setLevel(next);
      // 표시 갱신(useEffect)이 끝난 다음 프레임에 포커스를 옮긴다.
      requestAnimationFrame(() => focusColumn(next));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* 이동 바는 **열이 전부 보이지 않는 폭 전체**에서 필요하다. md(736px)에서
          숨겼더니 736~1068px 구간에서 3열 창만 열리고(4열은 창 밖) 이동 수단이
          없어, 포인터로는 마지막 열에 도달할 방법이 아예 없었다. 전 열이 한눈에
          들어오는 xl(1069px) 부터 감춘다. */}
      <nav
        aria-label="계층 단계 이동"
        className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 xl:hidden"
      >
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={level === 0}
          onClick={() => {
            const next = Math.max(0, level - 1);
            setLevel(next);
            requestAnimationFrame(() => focusColumn(next));
          }}
        >
          {level === 0 ? "첫 단계" : `‹ ${titles[level - 1]}`}
        </Button>

        <span className="min-w-0 text-right">
          <span className="block text-xs text-charcoal tabular-nums">
            {`${level + 1} / ${titles.length}`}
          </span>
          <strong className="block truncate text-base font-semibold text-foreground">
            {titles[level]}
          </strong>
        </span>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={level >= titles.length - 1}
          onClick={() => {
            const next = Math.min(titles.length - 1, level + 1);
            setLevel(next);
            requestAnimationFrame(() => focusColumn(next));
          }}
        >
          {level >= titles.length - 1 ? "끝 단계" : `${titles[level + 1]} ›`}
        </Button>
      </nav>

      <div className="hidden justify-end xl:flex">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => {
            const grid = gridOf();
            if (grid) grid.style.gridTemplateColumns = "";
            for (const handle of rootRef.current?.querySelectorAll(
              "[data-miller-resizer]",
            ) ?? []) {
              handle.setAttribute("aria-valuenow", "50");
            }
          }}
        >
          열 너비 초기화
        </Button>
      </div>

      <div ref={rootRef} onPointerDown={onPointerDown} onKeyDown={onKeyDown}>
        {children}
      </div>
    </div>
  );
}

/** 한 열 안에서 포커스를 받을 수 있는 항목들. */
function itemsIn(column: HTMLElement): HTMLElement[] {
  return Array.from(
    column.querySelectorAll<HTMLElement>(
      "[data-miller-item] a[href], [data-miller-item] button:not(:disabled)",
    ),
  );
}
