"use client";

import { useCallback, useRef, useState } from "react";
import { DataGrid, type DataGridProps } from "./data-grid";
import { cn } from "@/lib/utils";

/**
 * SelectableDataGrid — 이동하지 않고 **그 자리에서 고르는** 목록.
 *
 * 기반 primitive: 자체 시각 요소가 없다. DataGrid(shadcn `ItemGroup` 위의 listbox)를
 *   그대로 렌더하고, 감싸는 div 하나로 포인터·키보드 이벤트만 위임한다.
 *
 * 행 마크업을 다시 만들지 않는다
 *   DataGrid 를 그대로 렌더하고 이벤트만 위임한다. 행의 클래스·시맨틱·상태 표시는
 *   전부 DataGrid 한 곳에 있으므로 두 모드가 시각적으로 갈라질 수 없다.
 *   화면들은 대부분 URL 선택(DataGrid 의 `rowHref`)을 쓴다. 이 래퍼는 선택이
 *   이동이 아닐 때만 쓴다.
 *
 * 선택 확정 시점
 *   **마우스는 pointerdown 에서 확정**한다. click(mouseup)에만 걸면 길게 누르기나
 *   미세 드래그로 click 이 취소되는 환경에서 "눌렀다 떼면 선택이 사라지는" 증상이 난다.
 *   키보드·터치는 click 에서 확정한다.
 *
 * 해부도
 *   DataGrid 와 동일. 이 컴포넌트는 감싸는 상자 하나만 더한다.
 *
 * 토큰
 *   자체 시각 값이 없다 — 전부 DataGrid 의 것이다.
 *
 * 상태
 *   DataGrid 와 동일 + 포커스 이동(roving tabindex).
 *
 * 키보드·ARIA
 *   ↑↓ 이동, Home/End 처음·끝, Enter·Space 선택. 포커스는 위임 컨테이너가 옮긴다.
 *
 * 수용 기준
 *   - 마우스로 길게 눌렀다 떼도 선택이 유지된다.
 *   - 키보드만으로 모든 행에 도달하고 선택할 수 있다.
 *   - 호출부의 폭·배치는 바깥 래퍼에 적용하고 DataGrid는 그 폭을 채운다.
 *     flex 안에서도 보이는 열과 행의 클릭 영역이 같은 폭을 갖는다.
 */
export type SelectableDataGridProps<Row> = Omit<
  DataGridProps<Row>,
  "rowHref" | "interactive" | "activeIndex" | "selectedId"
> & {
  defaultSelectedId?: string | null;
  onSelectRow?: (id: string) => void;
};

export function SelectableDataGrid<Row>({
  defaultSelectedId = null,
  onSelectRow,
  rows,
  getRowId,
  className,
  ...props
}: SelectableDataGridProps<Row>) {
  const [selectedId, setSelectedId] = useState<string | null>(defaultSelectedId);
  const containerRef = useRef<HTMLDivElement>(null);
  // 마우스 pointerdown 에서 이미 확정했는지. 뒤따르는 click 의 중복 처리를 막는다.
  const confirmedByPointer = useRef(false);

  const select = useCallback(
    (id: string) => {
      setSelectedId(id);
      onSelectRow?.(id);
    },
    [onSelectRow],
  );

  const rowIdFrom = (target: EventTarget | null): string | null => {
    if (!(target instanceof Element)) return null;
    return target.closest<HTMLElement>("[data-row-id]")?.dataset.rowId ?? null;
  };

  const optionsOf = () =>
    Array.from(
      containerRef.current?.querySelectorAll<HTMLElement>("[data-row-id]") ?? [],
    );

  const activeIndex = Math.max(
    rows.findIndex((row) => getRowId(row) === selectedId),
    0,
  );

  return (
    <div
      ref={containerRef}
      className={cn("min-w-0 w-full", className)}
      onPointerDown={(event) => {
        if (event.pointerType !== "mouse") return;
        const id = rowIdFrom(event.target);
        if (!id) return;
        confirmedByPointer.current = true;
        select(id);
      }}
      onClick={(event) => {
        const id = rowIdFrom(event.target);
        if (!id) return;
        if (confirmedByPointer.current) {
          confirmedByPointer.current = false;
          return;
        }
        select(id);
      }}
      onKeyDown={(event) => {
        const options = optionsOf();
        const index = options.findIndex((node) => node === event.target);
        if (index < 0) return;
        const last = options.length - 1;

        switch (event.key) {
          case "ArrowDown":
            event.preventDefault();
            options[Math.min(index + 1, last)]?.focus();
            break;
          case "ArrowUp":
            event.preventDefault();
            options[Math.max(index - 1, 0)]?.focus();
            break;
          case "Home":
            event.preventDefault();
            options[0]?.focus();
            break;
          case "End":
            event.preventDefault();
            options[last]?.focus();
            break;
          case "Enter":
          case " ": {
            event.preventDefault();
            const id = options[index]?.dataset.rowId;
            if (id) select(id);
            break;
          }
          default:
            break;
        }
      }}
    >
      <DataGrid
        {...props}
        className="w-full"
        rows={rows}
        getRowId={getRowId}
        selectedId={selectedId}
        interactive
        activeIndex={activeIndex}
      />
    </div>
  );
}
