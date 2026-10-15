import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ColorSample, type ColorToken } from "@/components/ui/token-sample";
import { cn } from "@/lib/utils";

/**
 * /design 카탈로그의 뼈대 요소들. 컴포넌트 정본이 아니라 **전시용 액자**다.
 * 여기에 새 시각 규칙을 만들지 않는다 — 토큰 유틸리티만 조립한다.
 */

export function Section({
  id,
  title,
  note,
  children,
}: {
  id: string;
  title: string;
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 id={id} className="text-xl font-semibold text-foreground">
          {title}
        </h2>
        {note ? <p className="text-base text-charcoal">{note}</p> : null}
      </div>
      <div className="flex flex-col gap-6">{children}</div>
    </section>
  );
}

export function Specimen({
  name,
  state,
  span,
  note,
  children,
}: {
  /** design.md 컴포넌트 키 또는 컴포넌트 파일 이름. 추적 가능한 원문 이름을 쓴다. */
  name: string;
  /** 상태 매트릭스에서의 자리 — 기본 / 비활성 / 선택 등. */
  state?: string;
  /** true 면 전시 액자가 한 행을 통째로 쓴다. */
  span?: boolean;
  /** 액자 아래 한 줄 메모 — 근거·제약·미사용 표시. */
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div
      // 스냅샷 회귀가 이 두 속성으로 액자를 하나씩 집어간다.
      // 같은 컴포넌트를 상태별로 여러 액자에 걸므로 이름만으로는 유일하지 않다.
      data-specimen={name}
      data-specimen-state={state}
      className={cn("flex", span ? "col-span-full" : undefined)}
    >
      <Card size="sm" className="w-full">
        <CardHeader>
          <p className="flex flex-wrap items-baseline gap-2">
            <code className="font-mono text-xs text-foreground">{name}</code>
            {state ? <span className="text-xs text-charcoal">{state}</span> : null}
          </p>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-3">{children}</CardContent>
        {note ? (
          <CardContent>
            <p className="text-xs text-charcoal">{note}</p>
          </CardContent>
        ) : null}
      </Card>
    </div>
  );
}

export function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">{children}</div>
  );
}

export function Swatch({
  name,
  contrast,
}: {
  /** globals.css 의 --color-* 토큰 이름. */
  name: ColorToken;
  contrast?: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <ColorSample token={name} />
      <span className="flex min-w-0 flex-col">
        <code className="truncate font-mono text-xs text-foreground">{name}</code>
        {contrast ? <span className="text-xs text-charcoal">{contrast}</span> : null}
      </span>
    </div>
  );
}
