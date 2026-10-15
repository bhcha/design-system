import { cn } from "@/lib/utils";

/**
 * PageHeader — 화면 제목 골격
 *
 * shadcn 기반
 *   대응하는 shadcn 프리미티브가 없다(shadcn 은 페이지 헤더를 컴포넌트로 두지 않는다).
 *   Card 의 CardHeader/CardTitle 은 "카드 안 머리"라 랜드마크 <header>·h1 과 역할이
 *   다르고, 덮어야 할 기본값(grid · px · 곡률 맥락)이 더 많아 쓰지 않는다.
 *   네이티브 <header> + 토큰 유틸리티로 남기고, 액션 슬롯에는 호출부가 shadcn
 *   Button/ButtonLink 를 넣는다.
 *
 * 근거: ADS 페이지 헤더 해부도(overline → 제목 → 설명 → 우측 액션). 제목 크기는
 * ADS 제목 20/24(--text-xl). 시각 값은 design.md 토큰.
 *
 * 해부도
 *   [ eyebrow (overline) ]                  [ 액션 슬롯 ]
 *   [ 제목 h1 ]                             [ 상태 슬롯 ]
 *   [ 설명 ]
 *
 * 토큰
 *   eyebrow --text-xs + uppercase + --color-charcoal
 *   제목    --text-xl + font-semibold + --color-foreground
 *   설명    --text-base + --color-charcoal
 *   간격    안쪽 gap-1(세로) · gap-x-6/gap-y-3(제목 ↔ 액션)
 *
 * 바깥 여백은 이 컴포넌트가 갖지 않는다
 *   헤더가 스스로 mb 를 들면 화면마다 그 값을 다시 상쇄해야 하고, 결국 화면 파일에
 *   `-mt-*` 같은 보정이 생긴다. 위아래 간격은 헤더를 담은 레이아웃의 flex gap 이
 *   정한다(현재 화면들은 gap-6). 예외가 필요하면 호출부가 className 으로 준다.
 *
 * 상태
 *   상태 없음(표시용 컨테이너).
 *
 * 키보드·ARIA
 *   제목 요소는 `as` 로 지정한다(화면당 h1 하나, 패널 안에서는 h2).
 *
 * 수용 기준
 *   - 액션이 길어져도 제목이 밀리지 않는다(min-w-0 + flex-wrap).
 *   - eyebrow·설명이 없어도 레이아웃이 무너지지 않는다.
 */
export type PageHeaderProps = {
  /** overline. 화면의 분류를 짧게 적는다. */
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  /** 제목 태그. 화면 최상위는 h1, 패널 안은 h2. */
  as?: "h1" | "h2";
  /** 제목 id — aria-labelledby 대상으로 쓴다. */
  titleId?: string;
  description?: React.ReactNode;
  /** 우측 액션 슬롯(Button 등). */
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({
  eyebrow,
  title,
  as: Heading = "h1",
  titleId,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn("flex flex-wrap items-start gap-x-6 gap-y-3", className)}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {eyebrow ? (
          <p className="text-xs font-medium text-charcoal uppercase">
            {eyebrow}
          </p>
        ) : null}

        <Heading
          id={titleId}
          className="text-xl font-semibold break-words text-foreground"
        >
          {title}
        </Heading>

        {description ? (
          <p className="max-w-reading text-base text-charcoal">{description}</p>
        ) : null}
      </div>

      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </header>
  );
}
