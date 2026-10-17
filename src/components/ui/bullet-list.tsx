import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * BulletList — 설명 본문의 점·번호 목록
 *
 * 근거: design.md 적용 차이 8. feature-bullet의 charcoal·간격 토큰을 재사용하되,
 * 체크 표식 대신 네이티브 목록 표식을 쓰고 설명 문장은 body-md로 읽히게 한다.
 * 상태·선택·순서 편집이 없는 정적 목록이라 클라이언트 경계나 훅이 필요하지 않다.
 *
 * 해부도
 *   <ul> 또는 <ol> → <li>[인라인 텍스트 · code · TextLink]</li> × n
 *   표식은 ::marker로 그려 긴 문장의 다음 줄도 본문 시작점에 맞춘다.
 *
 * 토큰
 *   본문 --text-base(16px/24px) · 본문·표식 --color-charcoal
 *   들여쓰기 ps-6 · 항목 간격 default gap-2 / compact gap-1
 *   배경·테두리·그림자 없음. SectionPanel·CardContent 안에 그대로 넣는다.
 *
 * 상태
 *   variant: bullet(점, 기본) / numbered(번호)
 *   size: default / compact(글자 크기는 유지하고 항목 간격만 줄인다)
 *   빈 items: 아무것도 렌더하지 않으며 빈 상태 문구는 호출부가 정한다.
 *
 * 키보드·ARIA
 *   네이티브 ul/ol/li 시맨틱. 목록 자체는 Tab 순서에 넣지 않는다.
 *   인라인 링크의 키보드 동작을 유지한다. aria-label·aria-labelledby를 전달할 수 있다.
 *   항목 id를 React key로 사용하므로 재정렬 시에도 항목의 정체성이 유지된다.
 *
 * 수용 기준
 *   - 본문과 compact 모두 body-md로 읽힌다.
 *   - 긴 문장·연속된 코드 문자열이 좁은 패널 안에서 줄바꿈된다.
 *   - 점·번호가 본문 밖에 정렬되고 인라인 코드·링크가 그대로 렌더된다.
 */
export type BulletListItem = {
  /** 목록 안에서 유일하고 재정렬해도 바뀌지 않는 값. */
  id: string;
  content: ReactNode;
};

export type BulletListProps = Omit<
  HTMLAttributes<HTMLUListElement | HTMLOListElement>,
  "children"
> & {
  items: readonly BulletListItem[];
  variant?: "bullet" | "numbered";
  size?: "default" | "compact";
};

export function BulletList({
  items,
  variant = "bullet",
  size = "default",
  className,
  ...props
}: BulletListProps) {
  if (items.length === 0) return null;

  const List = variant === "numbered" ? "ol" : "ul";
  return (
    <List
      data-slot="bullet-list"
      data-variant={variant}
      data-size={size}
      className={cn(
        "flex min-w-0 flex-col list-outside ps-6 text-base text-charcoal marker:text-charcoal",
        variant === "numbered" ? "list-decimal" : "list-disc",
        size === "compact" ? "gap-1" : "gap-2",
        className,
      )}
      {...props}
    >
      {items.map((item) => (
        <li key={item.id} className="min-w-0 break-words">
          {item.content}
        </li>
      ))}
    </List>
  );
}
