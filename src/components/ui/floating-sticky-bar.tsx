import { cn } from "@/lib/utils";

/**
 * {component.floating-sticky-bar} — 스펙 시트
 *
 * shadcn 기반
 *   대응하는 shadcn 프리미티브가 없다(고정 위치 띠는 shadcn 범위 밖이다).
 *   네이티브 <div role="region"> + 토큰 유틸리티로 남기고, 액션 슬롯에는 호출부가
 *   shadcn Button/ButtonLink 를 넣는다.
 *
 * 해부도
 *   [ 좌측 요약(합계·상태) ................ ][ 우측 주요 액션 ]
 *   뷰포트 하단에 고정돼 스크롤 위에 떠 있는 반투명 유리 띠.
 *
 * 토큰
 *   높이 min-h-16(64px) · 패딩 px-8 py-3(32/12px) + 하단 안전 영역
 *   배경 --color-muted 80% + backdrop-blur-frosted
 *   상단 구분선 1px --color-border
 *
 * design.md 원칙
 *   "떠 있는" 느낌은 그림자가 아니라 backdrop-filter 가 만든다. 그림자를 주지 않는다.
 *
 * 반응형·안전 영역
 *   전체 폭에 닿는 고정 요소이므로 하단에 env(safe-area-inset-bottom) 을 더한다.
 *   globals.css 의 `pb-safe` 유틸리티가 그 값을 감싼다.
 *
 * 상태
 *   상태 없음(표시용 컨테이너).
 *
 * 키보드·ARIA
 *   화면 콘텐츠를 가리므로 <div role="region" aria-label> 로 이름을 준다.
 *   호출부는 본문 하단에 이 바 높이만큼 여백을 확보한다.
 *
 * 수용 기준
 *   - 하단 고정, 콘텐츠 위(z-40).
 *   - 좌측 요약이 길어져도 우측 액션을 밀어내지 않는다(min-w-0 + truncate).
 */
export type FloatingStickyBarProps = React.ComponentProps<"div"> & {
  /** 좌측 요약 슬롯. */
  summary: React.ReactNode;
  /** 우측 주요 액션 슬롯. */
  action?: React.ReactNode;
  /** 랜드마크 이름. */
  label: string;
};

export function FloatingStickyBar({
  className,
  summary,
  action,
  label,
  ...props
}: FloatingStickyBarProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border",
        "bg-muted/80 backdrop-blur-frosted backdrop-saturate-180",
        className,
      )}
      {...props}
    >
      <div className="mx-auto flex min-h-16 max-w-app items-center gap-4 px-8 pt-3 pb-safe">
        <div className="min-w-0 flex-1 truncate text-base text-foreground">
          {summary}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}
