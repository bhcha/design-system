import Link from "next/link";
import { ItemGroup } from "@/components/ui/item";
import { cn } from "@/lib/utils";

/**
 * DataGrid — 행 클릭형 목록 (**이 저장소에서 유일하다**)
 *
 * 기반 primitive: shadcn Item 계열 — 목록 상자는 `ItemGroup` 에 `role="listbox"` 를
 *   덮어 쓴다(기본 role="list" 를 교체, 항목 사이 gap 은 0). 행은 Item 의 행 개념을
 *   따르지만 **`<Item>` 루트로 그리지 않는다**: Item 은 Base UI `useRender`(내부 useRef)
 *   라 서버 컴포넌트에서 호출할 수 없고, 이 목록은 서버 컴포넌트(URL 선택 모드)에서
 *   그대로 쓰인다. 그래서 행은 `next/link` 또는 div 에 아래 rowClass 하나로 그린다.
 *   Table primitive 는 쓰지 않는다 — <tr> 은 링크가 될 수 없고 listbox/option 시맨틱과
 *   충돌한다.
 *
 * 근거: ADS 표 스펙
 *   헤더 12/16 · 600 · subtle 색 · 하단 2px 구분선 · 배경 없음
 *   셀 14/20 · padding 6×8px · 행 36~40px(한 줄) · 2줄 행 실행값 ≈48px · **세로선 없음**
 *   hover 와 선택은 반드시 구분 — 선택은 강조 배경 + 좌측 2px 바
 * 시각 값은 전부 design.md 토큰.
 *
 * 해부도
 *   ┃ [헤더 열…]                              ← aria-hidden, 시각 정렬용
 *   ┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 2px
 *   ┃ ItemGroup(role=listbox)
 *   ┃│[열][열][열]                            ← option, 좌측 2px 바
 *   ┃│[열][열][열]
 *
 * 선택 방식은 두 가지, 행 구현은 하나
 *   - **URL 선택(기본)**: `rowHref` 를 주면 행이 링크가 된다. 클라이언트 JS 가
 *     전혀 필요 없고 서버 컴포넌트에서 그대로 쓴다. 화면들이 이 방식을 쓴다.
 *   - **클라이언트 선택**: `SelectableDataGrid`(data-grid-selectable.tsx)로 감싼다.
 *     그 래퍼는 **행을 다시 만들지 않고** 이 컴포넌트를 그대로 렌더한 뒤 이벤트만
 *     위임한다. 행 마크업과 클래스가 한 곳에만 존재한다.
 *
 * 그룹
 *   `groups` 를 주면 행이 묶음별로 그려지고 묶음마다 머리글과 액션 슬롯이 붙는다.
 *   헤더 행은 목록 전체에 하나뿐이다.
 *
 * 열 정의
 *   열 폭은 임의값이 아니라 **Tailwind 폭 유틸리티 문자열**로 받는다
 *   (`className: "w-24"`). 헤더와 셀이 같은 문자열을 쓰므로 어긋날 수 없다.
 *
 * 토큰
 *   헤더 --text-xs + font-semibold + --color-charcoal + border-b-2 --color-border
 *   행   --text-base + --color-foreground + px-2 py-1.5 + min-h-9 + gap-3
 *        하단 1px --color-border + 좌측 2px(평소 --color-border) · select-none
 *   그룹 머리 --text-xs + font-semibold + --color-charcoal
 *
 * 상태
 *   기본 / hover / 선택 / 포커스 / 물러남(dimmed) / 빈 목록
 *   - hover  : --color-accent
 *   - 선택   : --color-selected + 좌측 2px --color-primary + font-medium
 *   - 포커스 : 전역 :focus-visible 링(--color-ring)
 *   - 물러남 : --color-muted 표면
 *   두 상태의 배경색이 서로 달라야 한다는 것이 ADS 요구사항이다.
 *
 * dimmed 를 투명도로 만들지 않는 이유
 *   흔히 보관 행에 `opacity: .55` 를 쓰는데, 그러면 행 안의 **모든 텍스트** 대비가
 *   함께 무너진다(측정값 2.42~3.78:1, AA 미달). 투명도 대신 표면 색을 sunken 으로
 *   내려 시각적으로 물러나게 하고, 상태 자체는 행 안의 lozenge 텍스트가 전달한다.
 *
 * 키보드·ARIA
 *   listbox / option 시맨틱. 링크 모드에서는 행이 <a> 이므로 Tab 으로 순회하고
 *   Cmd·중클릭이 동작한다. 클라이언트 선택 모드에서는 래퍼가 roving tabindex 와
 *   ↑↓ Home End Enter Space 를 처리한다.
 *   헤더 행은 `aria-hidden` — 시각적 정렬 장치이지 표 헤더가 아니다.
 *
 * 수용 기준
 *   - hover 와 선택의 배경색이 다르다.
 *   - 빈 목록에서 깨진 UI 대신 빈 상태 문구가 나온다.
 *   - 서버 컴포넌트에서 그대로 쓸 수 있다(함수 prop 을 클라이언트 경계로 넘기지 않는다).
 */
export type DataGridColumn<Row> = {
  key: string;
  header: React.ReactNode;
  /** 열 폭·정렬 유틸리티. 헤더와 셀에 함께 적용된다. 없으면 남는 폭을 나눠 갖는다. */
  className?: string;
  cell: (row: Row) => React.ReactNode;
};

export type DataGridProps<Row> = {
  label: string;
  columns: readonly DataGridColumn<Row>[];
  rows: readonly Row[];
  getRowId: (row: Row) => string;
  selectedId?: string | null;
  /** 주면 행 전체가 이 주소로 가는 링크가 된다(URL 선택). */
  rowHref?: (row: Row) => string;
  /** 흐리게 표시할 행 (예: 보관 상태). 선택은 여전히 가능하다. */
  isDimmed?: (row: Row) => boolean;
  /**
   * 행을 묶어 보여줄 그룹 (예: 프로젝트별로 묶은 작업 목록).
   *
   * 주면 `rows` 대신 이 순서로 그린다. 헤더 행은 목록 전체에 하나뿐이고 그룹마다
   * 다시 나오지 않는다 — 같은 열을 여러 번 읽히면 표가 여러 개로 보인다.
   * 묶음마다 listbox 를 따로 두는데, 머리글의 링크가 하나의 listbox 안에 들어가면
   * option 이 아닌 자식이 되어 ARIA required-children 을 깨기 때문이다.
   */
  groups?: readonly {
    id: string;
    /** 그룹 이름. 보이는 머리글이자 스크린 리더가 읽는 이름이다. */
    name: string;
    /** 그룹 머리의 오른쪽 슬롯 (예: "① 상세 열기"). */
    action?: React.ReactNode;
    rows: readonly Row[];
    /** 그룹이 비었을 때의 문구. */
    empty?: React.ReactNode;
  }[];
  /** 행이 없을 때 보여줄 내용. */
  empty?: React.ReactNode;
  /**
   * 클라이언트 선택 래퍼가 켠다. 행에 roving tabindex 와 `data-row-id` 를 붙여
   * 래퍼가 이벤트를 위임할 수 있게 한다. 직접 켜지 않는다.
   */
  interactive?: boolean;
  /** 클라이언트 선택 래퍼에서 포커스를 받을 행의 순번. */
  activeIndex?: number;
  className?: string;
};

/** 행 클래스는 여기 한 곳에서만 만든다. 링크 행과 위임 행이 같은 값을 쓴다. */
function rowClass(selected: boolean, dimmed: boolean): string {
  return cn(
    "flex items-center gap-3 border-b border-l-2 border-b-border px-2 py-1.5 text-base select-none",
    "min-h-9",
    selected
      ? "border-l-primary bg-selected font-medium text-foreground"
      : "border-l-border text-foreground hover:bg-accent",
    !selected && dimmed ? "bg-muted" : undefined,
  );
}

export function DataGrid<Row>({
  label,
  columns,
  rows,
  getRowId,
  selectedId = null,
  rowHref,
  isDimmed,
  groups,
  empty,
  interactive = false,
  activeIndex = 0,
  className,
}: DataGridProps<Row>) {
  const grouped = groups !== undefined;
  const total = grouped
    ? groups.reduce((sum, group) => sum + group.rows.length, 0)
    : rows.length;

  if (total === 0) {
    return <div className={className}>{empty}</div>;
  }

  /** 행 순번은 그룹을 가로질러 이어진다 — roving tabindex 가 어긋나지 않게. */
  let cursor = 0;

  const renderRow = (row: Row) => {
    const id = getRowId(row);
    const index = cursor++;
    const selected = id === selectedId;
    const cells = columns.map((column) => (
      <div
        key={column.key}
        // overflow-hidden 은 안전망이다 — 인라인 span 은 overflow 규칙을 받지
        // 않아 truncate 가 무시되고(고정 폭 셀 밖으로 흘러넘친 사례), 셀 단위로
        // 잘라 두면 어떤 내용이 와도 행 밖으로 새지 않는다.
        className={cn("min-w-0 overflow-hidden", column.className ?? "flex-1")}
      >
        {column.cell(row)}
      </div>
    ));

    const shared = {
      role: "option" as const,
      "aria-selected": selected,
      className: rowClass(selected, Boolean(isDimmed?.(row))),
    };

    if (rowHref) {
      return (
        <Link key={id} href={rowHref(row)} {...shared}>
          {cells}
        </Link>
      );
    }

    return (
      <div
        key={id}
        {...shared}
        data-row-id={interactive ? id : undefined}
        tabIndex={interactive ? (index === activeIndex ? 0 : -1) : undefined}
        className={cn(
          shared.className,
          interactive ? "cursor-pointer" : undefined,
        )}
      >
        {cells}
      </div>
    );
  };

  return (
    // @container — 보조 열 접힘(@md:block)의 기준이 되는 컨테이너. 우측 패널이
    // 열려 목록이 절반 폭이 되면 뷰포트가 넓어도 열이 접힌다.
    <div className={cn("@container flex flex-col", className)}>
      {/* 좌측 투명 2px 는 행의 선택 바와 같은 자리 — 헤더와 셀 텍스트가 수직으로
          정렬된다. pl 로 보정하면 홀수 px 가 생겨 4px 그리드를 깬다. */}
      <div
        aria-hidden="true"
        className="flex items-center gap-3 border-b-2 border-l-2 border-border border-l-transparent px-2 py-1 text-xs font-semibold text-charcoal"
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className={cn("min-w-0 overflow-hidden", column.className ?? "flex-1")}
          >
            {column.header}
          </div>
        ))}
      </div>

      {grouped ? (
        // 묶음마다 별도의 listbox 다. 하나의 listbox 안에 머리글을 넣으면 그 안의
        // 링크가 option 이 아니어서 required-children 을 깬다(axe 검사 결과).
        groups.map((group) => (
          <div key={group.id} className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 px-2 pt-3 pb-1">
              <span className="min-w-0 text-xs font-semibold text-charcoal">
                {group.name}
              </span>
              {group.action}
            </div>
            {group.rows.length > 0 ? (
              <ItemGroup
                role="listbox"
                aria-label={`${label} — ${group.name}`}
                className="gap-0"
              >
                {group.rows.map(renderRow)}
              </ItemGroup>
            ) : (
              <p className="px-2 py-2 text-xs text-charcoal">
                {group.empty ?? "이 묶음에 해당하는 항목이 없습니다."}
              </p>
            )}
          </div>
        ))
      ) : (
        <ItemGroup role="listbox" aria-label={label} className="gap-0">
          {rows.map(renderRow)}
        </ItemGroup>
      )}
    </div>
  );
}
