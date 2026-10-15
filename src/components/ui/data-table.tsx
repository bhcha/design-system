import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

/**
 * DataTable — 정적 표 (읽기 전용)
 *
 * 기반 primitive: shadcn Table (Table · TableCaption · TableHeader · TableBody ·
 *   TableRow · TableHead · TableCell). Table 이 감싸는 `table-container` 가 가로 스크롤을
 *   맡는다.
 *
 * 근거: ADS 표 스펙
 *   헤더 12/16 · 600 · subtle 색 · 하단 2px 구분선 · 배경 없음
 *   셀 · padding 8px · **세로선 없음** · 행 하단 1px 구분선
 * 시각 값은 전부 design.md 토큰. 본문은 design.md body-md(16px).
 *
 * DataGrid 와의 차이
 *   행을 클릭해 선택하지 않는 **표시 전용** 표다. 행 선택이 필요하면 DataGrid 를 쓴다.
 *   두 컴포넌트를 섞지 않는다. 그래서 TableRow 의 hover 배경을 끈다 — 클릭되지 않는
 *   행이 hover 에 반응하면 선택 가능한 것처럼 보인다.
 *
 * 해부도
 *   [ TableCaption (선택 · 위쪽) ]
 *   ┃ TableHead ┃ TableHead ┃
 *   ━━━━━━━━━━━━━━━━━━━━━━━━━ 2px
 *   ┃ TableCell ┃ TableCell ┃   ← TableRow 하단 1px
 *
 * 토큰
 *   헤더 --text-xs + font-semibold + --color-charcoal + border-b-2 --color-border
 *   셀   --text-base + --color-foreground + p-2 + align-top · 줄바꿈 허용
 *   행   border-b --color-border (마지막 행 포함)
 *   행 머리(rowhead) --color-foreground + font-semibold
 *   캡션 --text-xs + --color-charcoal · 왼쪽 정렬 · 표 위
 *
 * 상태
 *   상태 없음(표시용) — hover 배경 없음.
 *
 * 키보드·ARIA
 *   진짜 <table>/<thead>/<th scope>. 행 머리 열이 있으면 `rowHeader` 로 지정해
 *   `scope="row"` 를 만든다(TableHead 를 tbody 안에서 씀). 캡션은 <caption> 으로 넣어
 *   표의 이름이 되게 한다. 좁은 폭에서는 표 자체가 가로 스크롤한다 — 페이지가 밀리지 않는다.
 *
 * 수용 기준
 *   - 세로 구분선이 없다.
 *   - 표가 넘칠 때 페이지가 아니라 표 컨테이너가 스크롤한다.
 *   - 숫자 열이 등폭으로 정렬된다.
 */
export type DataTableColumn<Row> = {
  key: string;
  header: React.ReactNode;
  cell: (row: Row) => React.ReactNode;
  /** 이 열을 행 머리(th scope="row")로 그린다. 표당 하나만 지정한다. */
  rowHeader?: boolean;
  /** 숫자 열이면 등폭 정렬을 켠다. */
  numeric?: boolean;
};

export function DataTable<Row>({
  caption,
  captionHidden = false,
  columns,
  rows,
  getRowId,
  className,
}: {
  /** 표의 이름. 스크린 리더가 표를 식별하는 근거다. */
  caption: string;
  captionHidden?: boolean;
  columns: readonly DataTableColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  className?: string;
}) {
  return (
    <div className={cn("w-full", className)}>
      <Table className="caption-top border-collapse text-base">
        <TableCaption
          className={cn(
            "mt-0 pb-2 text-left text-xs text-charcoal",
            captionHidden ? "sr-only" : undefined,
          )}
        >
          {caption}
        </TableCaption>

        <TableHeader className="[&_tr]:border-b-0">
          <TableRow className="hover:bg-transparent">
            {columns.map((column) => (
              <TableHead
                key={column.key}
                scope="col"
                className={cn(
                  "h-auto border-b-2 border-border p-2 text-left align-bottom whitespace-normal",
                  "text-xs font-semibold text-charcoal",
                  column.numeric ? "text-right tabular-nums" : undefined,
                )}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody className="[&_tr:last-child]:border-b">
          {rows.map((row) => (
            <TableRow
              key={getRowId(row)}
              className="border-border hover:bg-transparent"
            >
              {columns.map((column) =>
                column.rowHeader ? (
                  <TableHead
                    key={column.key}
                    scope="row"
                    className="h-auto p-2 text-left align-top text-base font-semibold whitespace-normal text-foreground"
                  >
                    {column.cell(row)}
                  </TableHead>
                ) : (
                  <TableCell
                    key={column.key}
                    className={cn(
                      "p-2 align-top whitespace-normal text-foreground",
                      column.numeric ? "text-right tabular-nums" : undefined,
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ),
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
