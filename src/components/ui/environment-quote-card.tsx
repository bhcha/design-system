import { cn } from "@/lib/utils";

/**
 * {component.environment-quote-card} — 스펙 시트
 *
 * 구현 — shadcn primitive 없이 네이티브 <section> 으로 둔다(의도)
 *   이름은 card 지만 실제로는 사진 배경 위에 화면 폭으로 깔리는 편집형 히어로 띠다
 *   (곡률 0 · 테두리 0 · 절대 위치 backdrop · isolate). shadcn Card 의 곡률 · ring ·
 *   안쪽 여백 · flex 간격을 전부 덮어야 해서 Card 위에 올리지 않는다.
 *   CTA 는 호출부가 Button/ButtonLink(shadcn Button, 어두운 면에서는 variant="on-dark")로 넣는다.
 *
 * 해부도
 *   [ 상단 마크 슬롯 (선택) ]
 *   [ 중앙 정렬 헤드라인 ]
 *   [ CTA 슬롯 ]
 *   사진 배경 위에 놓이는 편집형 히어로. 사진이 없을 때의 색은 --color-surface-dark.
 *
 * 토큰
 *   배경 --color-surface-dark (사진 실패 시 폴백) · 텍스트 --color-on-dark
 *   헤드라인 --text-4xl font-heading(40px/1.10) · 패딩 py-20(80px)
 *
 * design.md 원칙
 *   분위기는 CSS 그라디언트가 아니라 사진이 만든다. 장식용 그라디언트를 얹지 않는다.
 *   배경 이미지는 콘텐츠 자산이지 토큰이 아니다 — 호출부가 넣는다.
 *
 * 상태
 *   상태 없음(표시용). 내부 CTA 가 자기 상태를 가진다.
 *
 * 키보드·ARIA
 *   헤드라인은 <h2> 고정이다 — 화면의 한 구획이지 문서 최상위가 아니다.
 *   <section> 에 랜드마크 이름이 필요하면 호출부가 `aria-label` 을 준다
 *   (props 는 그대로 <section> 으로 전달된다). 헤드라인 id 를 만들지 않으므로
 *   aria-labelledby 로 자동 연결되지는 않는다.
 *   배경 이미지는 장식이므로 CSS 배경으로 두거나 alt="" 를 준다.
 *
 * 수용 기준
 *   - 사진이 로드되지 않아도 텍스트 대비가 AA 이상(#fff on #171717 = 17.9:1).
 *   - 그라디언트 배경을 쓰지 않는다.
 */
export type EnvironmentQuoteCardProps = React.ComponentProps<"section"> & {
  /** 헤드라인 위의 작은 마크·라벨. */
  eyebrow?: React.ReactNode;
  headline: React.ReactNode;
  action?: React.ReactNode;
  /** 배경 사진 슬롯. 절대 위치로 깔리며 텍스트 아래에 놓인다. */
  backdrop?: React.ReactNode;
};

export function EnvironmentQuoteCard({
  className,
  eyebrow,
  headline,
  action,
  backdrop,
  ...props
}: EnvironmentQuoteCardProps) {
  return (
    <section
      className={cn(
        "relative isolate overflow-hidden bg-surface-dark px-4 py-20 text-center text-on-dark",
        className,
      )}
      {...props}
    >
      {backdrop ? (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          {backdrop}
        </div>
      ) : null}

      <div className="mx-auto flex max-w-reading flex-col items-center gap-6">
        {eyebrow ? (
          <div className="text-base font-medium text-on-dark-mute">
            {eyebrow}
          </div>
        ) : null}

        <h2 className="text-4xl font-heading font-semibold">{headline}</h2>

        {action ? <div>{action}</div> : null}
      </div>
    </section>
  );
}
