import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Item, ItemActions, ItemContent, ItemMedia } from "@/components/ui/item";

/**
 * OrderList — 순서 편집 목록 + 이음매 검사
 *
 * 근거: ADS 재정렬 목록 해부도(번호 + 이름 + 상하 이동 버튼). 드래그가 아니라
 * **버튼 이동**을 기본으로 둔다 — 키보드만으로도 순서를 바꿀 수 있어야 하기 때문이다.
 * 시각 값은 전부 design.md 토큰.
 *
 * 규칙 — 이음매(seam)
 *   순서가 있는 단계는 흔히 "앞 단계의 끝 조건 = 다음 단계의 시작 조건" 규칙으로
 *   이어진다. 항목 사이에 그 정합 여부를 표시하며, 어긋나면 경고 톤으로 알린다.
 *   틀린 값이 아니라 **확인이 필요한 자리**이므로 danger 가 아니라 warn 이다.
 *
 * 구현 — shadcn/ui Item + Button 위에 조립한다
 *   행 하나 = Item(variant="muted", size="xs") > ItemMedia(번호) · ItemContent(이름) ·
 *   ItemActions(이동 컨트롤). 내장 ↑↓ 는 Button(variant="outline", size="icon-sm", 32px 정사각)이다.
 *   Item 의 muted 면(bg-muted/50)은 불투명 --color-muted 로 덮는다 — 행 대비를 이전과 같게 둔다.
 *   이음매 줄은 대응 primitive 가 없어 네이티브 <p> 다.
 *
 * 해부도
 *   [1] [이름]                    [↑][↓]
 *    └ 이음매: 끝 조건 → 시작 조건 일치 / 불일치
 *   [2] [이름]                    [↑][↓]
 *
 * 토큰
 *   행 배경 --color-muted · 곡률 --radius-lg · 번호 --color-primary + font-semibold
 *   이동 버튼 Button outline · icon-sm(32px)
 *   이음매 ok --color-status-ok · 불일치 --color-status-warn
 *
 * 행 배경이 중립 면인 이유
 *   --color-selected 는 이 앱 전체에서 "지금 선택된 것" 하나를 가리키는
 *   색이다(DataGrid·SideNav·MillerColumns). 순서 목록의 **모든** 행에 그 색을 깔면
 *   화면 어디서도 선택 신호가 읽히지 않고, ADS 의 "hover 와 선택은 색으로 구분"
 *   요구와도 어긋난다. 여기 행들은 서로 동등하므로 가라앉은 중립 면을 쓴다.
 *
 * 상태
 *   기본 / 첫 항목(↑ 비활성) / 마지막 항목(↓ 비활성) / 읽기 전용
 *
 * 이동 컨트롤은 세 가지 모드
 *   - 없음      : `onMove` 도 `renderControls` 도 없으면 버튼을 그리지 않는다.
 *                 아무 일도 하지 않는 버튼은 거짓 어포던스이기 때문이다.
 *   - 클라이언트: `onMove` 를 주면 내장 ↑↓ 버튼이 그것을 부른다.
 *   - 서버 액션 : `renderControls` 로 호출부가 폼을 넣는다. 서버 컴포넌트에서는
 *                 이벤트 핸들러를 만들 수 없으므로 이 통로가 필요하다.
 *   행 구성과 이음매 표시는 어느 모드에서나 이 컴포넌트 하나가 그린다.
 *
 * 키보드·ARIA
 *   이동 버튼에 항목 이름을 포함한 aria-label 을 준다("2번째 항목을 위로").
 *   순서 변경 결과는 `aria-live="polite"` 영역이 알린다.
 *
 * 수용 기준
 *   - 마우스 없이 순서를 바꿀 수 있다.
 *   - 첫·마지막 항목의 이동 버튼이 비활성이다.
 *   - 이음매 불일치가 색 외에 텍스트로도 보인다.
 */
export type OrderItem = {
  id: string;
  label: React.ReactNode;
  /** 이 항목과 다음 항목 사이의 이음매 상태. 마지막 항목에는 없다. */
  seam?: { ok: boolean; message: React.ReactNode };
};

export function OrderList({
  items,
  onMove,
  renderControls,
  className,
}: {
  items: readonly OrderItem[];
  onMove?: (id: string, direction: -1 | 1) => void;
  /** 서버 액션 폼 등 호출부가 직접 넣는 이동 컨트롤. */
  renderControls?: (item: OrderItem, index: number, total: number) => React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col", className)}>
      <ol className="flex flex-col gap-1">
        {items.map((item, index) => (
          <li key={item.id} className="flex flex-col gap-1">
            <Item
              variant="muted"
              size="xs"
              className="flex-nowrap gap-2 rounded-lg border-0 bg-muted px-2 py-1.5"
            >
              <ItemMedia className="text-base font-semibold text-primary tabular-nums">
                {index + 1}
              </ItemMedia>
              <ItemContent className="min-w-0 text-base font-medium text-foreground">
                <span>{item.label}</span>
              </ItemContent>
              {renderControls ? (
                <ItemActions className="shrink-0 gap-1">
                  {renderControls(item, index, items.length)}
                </ItemActions>
              ) : onMove ? (
                <ItemActions className="shrink-0 gap-1">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={index === 0}
                    aria-label={`${index + 1}번째 항목을 위로`}
                    onClick={() => onMove(item.id, -1)}
                  >
                    <span aria-hidden="true">↑</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    disabled={index === items.length - 1}
                    aria-label={`${index + 1}번째 항목을 아래로`}
                    onClick={() => onMove(item.id, 1)}
                  >
                    <span aria-hidden="true">↓</span>
                  </Button>
                </ItemActions>
              ) : null}
            </Item>

            {item.seam ? (
              <p
                className={cn(
                  "px-2 text-xs",
                  item.seam.ok ? "text-status-ok" : "text-status-warn",
                )}
              >
                <span aria-hidden="true">{item.seam.ok ? "✓ " : "! "}</span>
                <span className="sr-only">
                  {item.seam.ok ? "이음매 일치: " : "이음매 확인 필요: "}
                </span>
                {item.seam.message}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
    </div>
  );
}
