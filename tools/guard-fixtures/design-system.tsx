/**
 * 디자인 시스템 lint(tools/design-system-lint)가 실제로 작동하는지 증명하는 고정 샘플.
 * **고치지 않는다.** `npm run check:guards` 가 아래 규칙이 전부 보고되는지 확인한다.
 *
 * 토큰 밖의 값
 *   shadcn/no-raw-colors         bg-pink-500
 *   shadcn/no-unknown-classes    text-5xl (테마에 없는 크기)
 *   shadcn/no-arbitrary-values   p-[13px]
 *   shadcn/no-inline-styles      style={{…}}
 *   shadcn/require-static-classes <Button className={`w-${tone}`}> (컴포넌트에 넘기는 동적 클래스)
 * 컴포넌트 밖에서 새로 만든 UI
 *   shadcn/no-restyle            <Button className="p-4 rounded-none">
 *   guards/no-surface-styling    raw <div> 에 rounded·border·bg 로 만든 카드, 면을 입힌 next/link <Link>
 *   guards/ui-only-elements      raw <a> · <label>
 */
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DesignSystemViolations({ tone }: { tone: string }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="bg-pink-500">팔레트 색</p>
      <p className="text-5xl">테마에 없는 크기</p>
      <p className="p-[13px]">임의값</p>
      <p style={{ marginTop: 4 }}>인라인 스타일</p>
      <Button className={`w-${tone}`}>읽을 수 없는 클래스</Button>
      <Button className="p-4 rounded-none">재스타일한 버튼</Button>
      <div className="rounded-lg border border-border bg-muted p-4">손으로 만든 카드</div>
      <Link href="/design" className="rounded-full border border-border bg-background p-2">손으로 만든 링크 버튼</Link>
      <a href="/design">raw 링크</a>
      <label>raw 라벨</label>
    </div>
  );
}
