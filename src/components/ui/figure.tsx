import Image from "next/image";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

/**
 * Figure — 그림과 출처 캡션
 *
 * 근거: ADS 미디어 해부도(테두리 상자 + 이미지 + 캡션). 시각 값은 design.md 토큰.
 * 이미지에 그림자를 주지 않는다 — 이 앱에는 그림자 토큰이 없고, 도판은 표면에
 * 떠 있는 물건이 아니라 문서의 일부다.
 *
 * 규칙 — 캡션이 필수인 이유
 *   도판은 외부 문서·도서에서 가져온 로컬 스냅숏인 경우가 많다. 저작권 표기와 원 위치를
 *   반드시 함께 남겨야 하므로 `caption` 을 선택이 아니라 필수 prop 으로 둔다.
 *
 * 구현 — shadcn/ui Card 위에 조립한다
 *   Card(겉 상자) > <figure>(시맨틱) > next/image · <figcaption>.
 *   Card 는 div 만 그리므로 <figure> 를 안쪽에 한 겹 둔다 — <figcaption> 이 <figure> 의
 *   직계 자식으로 남아 HTML 이 유효하다. 호출부의 className 은 Card(보이는 상자)에 붙는다.
 *   Card 기본값(ring · rounded-xl · py-4 · gap-4)은 design.md 값으로 덮는다.
 *
 * 해부도
 *   ┌──────────────────────┐
 *   │      [이미지]        │
 *   │ [캡션 — 출처 포함]   │
 *   └──────────────────────┘
 *
 * 토큰
 *   배경 --color-background · 테두리 1px --color-border · ring 없음 · 곡률 --radius-lg · 패딩 p-3
 *   캡션 --text-xs + --color-charcoal
 *
 * 상태
 *   상태 없음(표시용).
 *
 * 키보드·ARIA
 *   `alt` 필수. 도판은 내용이므로 빈 alt 를 쓰지 않는다.
 *   `width`/`height` 를 반드시 주어 레이아웃 이동(CLS)을 막는다 — next/image 가 강제한다.
 *   접히지 않는 큰 도판은 lazy 로드한다(기본값).
 *
 * 수용 기준
 *   - alt 와 caption 없이 컴파일되지 않는다.
 *   - 폭이 좁아져도 이미지가 넘치지 않는다.
 */
export type FigureProps = {
  src: string;
  /** 그림이 무엇을 보여주는지. 장식이 아니므로 비울 수 없다. */
  alt: string;
  width: number;
  height: number;
  /** 출처를 포함한 캡션. */
  caption: React.ReactNode;
  /** 접힌 화면 위쪽이면 true — 즉시 로드한다. */
  priority?: boolean;
  className?: string;
};

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority = false,
  className,
}: FigureProps) {
  return (
    <Card render={<figure />} className={cn("gap-2 rounded-lg p-3", className)}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="h-auto w-full rounded-sm"
      />
      <figcaption className="text-xs text-charcoal">{caption}</figcaption>
    </Card>
  );
}
