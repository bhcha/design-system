import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * DocsPager — 이전·다음 문서 이동
 *
 * 해부도
 *   [이전 문서 · ← 제목] [다음 문서 · 제목 →]. 카드 전체가 하나의 링크다.
 *
 * 토큰
 *   Card의 background·border·rounded-xl, text-xs 보조 라벨, text-sm/medium 제목.
 *   gap-4 · py-4, hover muted, focus ring-ring. 새 색·곡률·그림자는 없다.
 *
 * 상태
 *   양쪽 링크 / 이전만 / 다음만 / 둘 다 없으면 숨김 / hover / focus-visible.
 *
 * 키보드·ARIA
 *   nav에 이름을 주고 링크는 rel=prev/next와 방향을 포함한 접근 가능한 이름을 갖는다.
 *   링크마다 Tab 정지점은 하나이며 중첩된 버튼·링크가 없다.
 *
 * 수용 기준
 *   긴 제목은 줄바꿈하며 작은 화면에서는 세로로 쌓인다.
 *   없는 문서를 비활성 버튼이나 빈 카드로 표시하지 않는다.
 */
export type DocsPagerLink = { label: string; href: string };

function PagerLink({ item, direction }: { item: DocsPagerLink; direction: "prev" | "next" }) {
  const next = direction === "next";
  const label = next ? "다음 문서" : "이전 문서";
  return (
    <Card
      render={<Link href={item.href} rel={direction} aria-label={`${label}: ${item.label}`} />}
      className={cn("gap-0 py-4 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", next && "text-right sm:col-start-2")}
    >
      <CardContent className={cn("flex min-w-0 flex-col gap-2", next && "items-end")}>
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="flex items-center gap-2 text-sm font-medium">
          {!next ? <ArrowLeft className="size-4 shrink-0" aria-hidden="true" /> : null}
          <span className="min-w-0 break-words">{item.label}</span>
          {next ? <ArrowRight className="size-4 shrink-0" aria-hidden="true" /> : null}
        </span>
      </CardContent>
    </Card>
  );
}

export function DocsPager({ previous, next, label = "이전과 다음 문서" }: { previous?: DocsPagerLink; next?: DocsPagerLink; label?: string }) {
  if (!previous && !next) return null;
  return (
    <nav aria-label={label} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {previous ? <PagerLink item={previous} direction="prev" /> : null}
      {next ? <PagerLink item={next} direction="next" /> : null}
    </nav>
  );
}
