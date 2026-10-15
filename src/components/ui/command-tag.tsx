import { badgeVariants } from "@/components/ui/badge-variants";
import { cn } from "@/lib/utils";

/**
 * {component.command-tag} — 스펙 시트
 *
 * 바탕 primitive (shadcn/ui base-nova)
 *   shadcn `badgeVariants({ variant: "secondary" })` 클래스를 네이티브 `<code>` 에 쓴다.
 *   Badge 컴포넌트(useRender)는 서버 컴포넌트에서 렌더할 수 없는 훅을 쓰고, 이 태그는
 *   서버 화면(/design·/design/ollama)에서 쓰이므로 cva 만 빌린다. `<code>` 시맨틱은 그대로다.
 *
 * 해부도
 *   [ 명령 ]  — 본문 흐름 안에 놓이는 작은 코드 pill
 *
 * 토큰 — design.md {component.command-tag}
 *   배경 --color-secondary(= surface-soft) · 글자 --color-foreground · {typography.code-sm}(font-mono 14/20)
 *   padding 6px 12px(py-1.5 px-3) · 곡률 --radius-full
 *   Badge 의 고정 높이(h-5)·투명 1px 테두리·12px/500·줄바꿈 금지는 덮는다 — 긴 명령은 본문처럼 감긴다.
 *
 * 상태
 *   기본 하나뿐이다(상호작용 없음).
 *
 * 키보드·ARIA
 *   <code> 시맨틱. 포커스를 받지 않는다.
 *
 * 수용 기준
 *   - 곡률 9999px · 14px 등폭 서체 · soft surface.
 */
export function CommandTag({
  className,
  ...props
}: React.ComponentProps<"code">) {
  return (
    <code
      className={cn(
        badgeVariants({ variant: "secondary" }),
        "h-auto rounded-full border-0 px-3 py-1.5 font-mono text-sm font-normal whitespace-normal text-foreground",
        className,
      )}
      {...props}
    />
  );
}
