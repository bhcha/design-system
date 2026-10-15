import { SearchIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

/**
 * {component.search-pill} — 스펙 시트
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   `InputGroup` + `InputGroupAddon`(돋보기) + `InputGroupInput`(Base UI Input 의 네이티브
 *   `<input type="search">`). 바깥의 `<label>` 은 유지한다 — 라벨이 컨트롤을 감싸
 *   id 없이도 접근 가능한 이름(searchbox 의 name)이 생기고 라벨이 클릭 대상이 된다.
 *
 * 해부도
 *   <label>
 *     [ 라벨 텍스트 (labelHidden 이면 시각적으로 숨김) ]
 *     <InputGroup>
 *       [ InputGroupAddon: 돋보기 아이콘 ][ InputGroupInput ]
 *     </InputGroup>
 *   </label>
 *
 * 토큰 — design.md {component.search-pill} / {component.search-pill-focused}
 *   높이 36px(h-9) · 곡률 --radius-full · 테두리 없음(border-transparent)
 *   배경 --color-muted(soft) → 포커스 시 --color-background(canvas) + ring-3 --color-ring/50
 *   텍스트 --text-sm + --color-foreground · placeholder --color-muted-foreground(body)
 *   돋보기 아이콘 --color-charcoal
 *
 * primitive 와 다르게 둔 점
 *   - InputGroup 기본은 1px hairline 테두리 + canvas 배경 + 40px 이다. search pill 은
 *     테두리 없는 soft 면 36px 이므로 className 으로 덮는다. 포커스 때도 테두리는 투명.
 *   - InputGroup 의 비활성 표현(opacity-50)은 쓰지 않는다 — 앱 규칙상 비활성은 토큰
 *     (--color-mute 글자)으로만 표시한다.
 *   - InputGroup·InputGroupAddon 은 `role="group"` 을 가진 div 다. 이름이 없는 그룹이라
 *     접근성 트리에서 이름 있는 그룹 질의와 겹치지 않는다.
 *
 * --color-mute 를 쓰지 않는 이유
 *   #a3a3a3 은 "비활성 컨트롤 전용(WCAG 대비 예외)"으로 결박한 값이다.
 *   돋보기와 placeholder 는 활성 상태의 콘텐츠라 쓰지 않고, 비활성일 때만 내려간다.
 *
 * 상태
 *   기본 / focus-visible(canvas 배경 + ring) / disabled / 값 있음
 *
 * 키보드·ARIA
 *   - 라벨이 컨트롤을 감싸므로 접근 가능한 이름이 항상 존재한다(타입 필수).
 *   - type="search" 로 searchbox 역할과 브라우저 지우기 어포던스를 얻는다.
 *   - autoComplete="off": 인증 필드가 아니라 비밀번호 관리자가 끼어들지 않게 한다.
 *   - 돋보기는 aria-hidden 장식이다. Addon 을 눌러도 입력으로 포커스가 간다(primitive).
 *   - 붙여넣기를 막지 않는다.
 *
 * 수용 기준
 *   - 높이 36px · 곡률 9999px · soft surface 배경.
 *   - label 없이 컴파일되지 않는다.
 *   - --color-mute 는 비활성 상태에서만 나타난다.
 */
export type SearchInputProps = Omit<
  React.ComponentProps<"input">,
  "type" | "className"
> & {
  /** 접근 가능한 이름. 비워둘 수 없다. */
  label: string;
  /** true 면 라벨을 시각적으로만 숨긴다(스크린 리더에는 남는다). */
  labelHidden?: boolean;
  className?: string;
};

export function SearchInput({
  label,
  labelHidden = false,
  className,
  ...props
}: SearchInputProps) {
  return (
    <label className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "text-xs font-medium text-charcoal",
          labelHidden ? "sr-only" : undefined,
        )}
      >
        {label}
      </span>
      <InputGroup
        className={cn(
          "h-9 border-transparent bg-muted",
          "has-[[data-slot=input-group-control]:focus-visible]:border-transparent",
          "has-[[data-slot=input-group-control]:focus-visible]:bg-background",
          "has-disabled:bg-muted has-disabled:opacity-100",
        )}
      >
        <InputGroupAddon className="text-charcoal group-has-disabled/input-group:text-mute">
          <SearchIcon aria-hidden="true" />
        </InputGroupAddon>
        <InputGroupInput
          type="search"
          autoComplete="off"
          className={cn(
            "h-full text-sm text-foreground",
            "disabled:text-mute disabled:placeholder:text-mute",
          )}
          {...props}
        />
      </InputGroup>
    </label>
  );
}
