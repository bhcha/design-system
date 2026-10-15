import {
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { cn } from "@/lib/utils";

/**
 * GapChecklist — 빈 항목(확인 필요) 점검 목록
 *
 * 근거: ADS 목록 해부도(상태 표식 + 라벨 + 보조 설명). 시각 값은 design.md 토큰.
 *
 * 기반 primitive: shadcn Item 의 하위 조각(ItemMedia · ItemContent · ItemTitle ·
 *   ItemDescription)을 네이티브 <ul>/<li> 안에 넣는다. `<Item>`·`ItemGroup` 루트는
 *   쓰지 않는다 — ItemGroup 은 div[role=list] 라 <ul> 시맨틱을 대신할 수 없고, Item 루트는
 *   Base UI `useRender`(내부 useRef)라 서버 컴포넌트에서 호출할 수 없다.
 *
 * 규칙
 *   빈 항목은 **오류가 아니라 미확인**이다(모르는 것은 추측해 채우지 않고 "확인 필요"로
 *   남긴다). 그래서 danger 가 아니라 warn 톤을 쓰고, 해소된 항목만 ok 로 바뀐다.
 *
 * 해부도
 *   li ─ [ItemMedia 표식] [ItemContent: ItemTitle 항목 이름 / ItemDescription 확인할 것]
 *
 * 토큰
 *   미해소 표식 --color-status-warn · 해소 표식 --color-status-ok
 *   이름 --text-base + font-medium(ItemTitle 의 한 줄 자르기는 끈다 — 줄바꿈 허용)
 *   설명 --text-xs + --color-charcoal(ItemDescription 의 두 줄 자르기도 끈다)
 *
 * 상태
 *   미해소 / 해소
 *
 * 키보드·ARIA
 *   표식 문자는 `aria-hidden`. 상태는 스크린 리더용 텍스트로 따로 읽힌다
 *   — 색·기호만으로 상태를 전달하지 않는다.
 *
 * 충족 항목도 함께 보여준다
 *   해소된 항목도 ✓ 로 나열한다. 남은 것만 보면 "얼마나 남았나"는 알아도
 *   "무엇을 이미 채웠나"는 모른다. 전체 대비로 읽혀야 완료까지의 거리가 보인다.
 *
 * 수용 기준
 *   - 해소·미해소가 색 외에 기호와 텍스트로도 구분된다.
 *   - 항목이 없으면 아무것도 그리지 않는다(호출부가 빈 상태를 판단).
 */
export type GapItem = {
  id: string;
  label: React.ReactNode;
  /** 무엇을 확인하면 해소되는지. */
  hint?: React.ReactNode;
  resolved?: boolean;
};

export function GapChecklist({
  items,
  summary,
  className,
}: {
  items: readonly GapItem[];
  /** "6개 중 4개 채움" 같은 한 줄 요약. */
  summary?: React.ReactNode;
  className?: string;
}) {
  return (
    <ul className={cn("flex flex-col gap-1.5", className)}>
      {summary ? (
        <li className="text-xs font-semibold text-charcoal">{summary}</li>
      ) : null}
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2">
          <ItemMedia
            aria-hidden="true"
            className={cn(
              "mt-0.5 text-base font-semibold",
              item.resolved ? "text-status-ok" : "text-status-warn",
            )}
          >
            {item.resolved ? "✓" : "!"}
          </ItemMedia>

          <span className="sr-only">
            {item.resolved ? "해소됨: " : "미해소: "}
          </span>

          <ItemContent className="min-w-0 gap-0">
            <ItemTitle
              className={cn(
                "line-clamp-none text-base font-medium",
                item.resolved ? "text-charcoal" : "text-foreground",
              )}
            >
              {item.label}
            </ItemTitle>
            {item.hint ? (
              <ItemDescription className="line-clamp-none text-xs text-charcoal">
                {item.hint}
              </ItemDescription>
            ) : null}
          </ItemContent>
        </li>
      ))}
    </ul>
  );
}
