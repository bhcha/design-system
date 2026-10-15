import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * SidePanel — 우측 상세 패널
 *
 * shadcn 기반
 *   패널 면은 shadcn `Card`(CardHeader · CardTitle · CardAction · CardContent)다.
 *   <aside> 가 위치(고정 레일)와 랜드마크를 맡고, 그 안을 Card 가 전고로 채운다.
 *   Card 의 떠 있는 카드 모양(곡률 · ring · 위아래 패딩)은 레일에 맞게 덮는다 —
 *   레일은 화면 가장자리에 붙는 면이라 곡률이 없고 경계는 aside 의 좌측 1px 선이다.
 *   닫기는 shadcn Button `variant="secondary" size="icon-sm"`(32px) 한 벌이다.
 *   `closeHref` 는 같은 변형의 ButtonLink(<a>), `onClose` 는 Button(<button>) —
 *   두 분기가 buttonVariants 를 공유하므로 hover·크기가 갈라질 수 없다.
 *   Sheet 는 쓰지 않는다 — Sheet 는 모달(포커스 가둠·배경 가림)이고 이 패널은 아니다.
 *
 * 근거: ADS 사이드 패널 해부도(고정 폭 · 헤더에 overline + 제목 + 닫기 · 스크롤되는 본문)
 * + 작업 도구(이슈 트래커)의 항목 상세 패널 패턴. 시각 값은 전부
 * design.md 토큰 — 그림자 대신 1px 테두리와 표면 색으로 분리한다.
 *
 * 모달이 아니다
 *   이 패널은 본문 옆에 나란히 서서 목록과 함께 보인다. 배경을 가리지도, 포커스를
 *   가두지도 않는다. 포커스를 가둬야 하는 흐름에는 Dialog 를 쓴다.
 *
 * 해부도
 *   <aside>
 *   ┌ Card ────────────────────┐
 *   │ CardHeader               │
 *   │  [overline]  CardAction ✕│
 *   │  CardTitle(h2)           │
 *   ├──────────────────────────┤
 *   │ CardContent — 스크롤     │
 *   └──────────────────────────┘
 *
 * 닫기는 헤더 우상단에 **항상** 있다 (작업 도구 계열)
 *   선택이 URL 에 있는 이 앱에서 닫기는 이동이므로 `closeHref`(링크)가 기본이고,
 *   클라이언트 상태로 여닫는 자리만 `onClose` 를 쓴다.
 *
 * 전고 고정 레일이다 (작업 도구 계열)
 *   lg 이상에서 `fixed`(top=상단 띠, bottom=0)로 붙이고, 흐름에서 빠진 자리는
 *   투명 스페이서가 지킨다. sticky 로는 패널 하단이 스크롤 전 화면 밖으로 잘린다.
 *   폭은 320px, 2xl(1280px) 이상에서는 384px.
 *
 * 토큰
 *   폭 w-80(320px) · 2xl w-96(384px) · 배경 --color-background
 *   좌측 테두리 --color-border · 헤더 하단 --color-border · 패딩 p-4(Card 간격 단위)
 *   층위 20 — globals.css 의 "층위(z-index) 사다리" 중 **본문 위 크롬**(SubNav 와 공유).
 *   overline --text-xs + uppercase + --color-charcoal · 제목 --text-base + font-semibold
 *   닫기 Button secondary/icon-sm — --color-secondary 면 · hover --color-accent · press scale 0.95
 *
 * 상태
 *   열림 / 닫힘(호출부가 렌더링 여부로 제어) · 닫기 hover / focus-visible / press
 *
 * 키보드·ARIA
 *   <aside aria-labelledby=제목id>. 닫기는 아이콘만 있으므로 aria-label(closeLabel)을 단다.
 *   패널이 열릴 때 포커스를 옮기지 않는다 — 목록 탐색의 흐름을 끊지 않기 위해서다.
 *
 * 수용 기준
 *   - closeHref 나 onClose 를 주면 헤더 우상단에 ✕ 이 있고 접근 가능한 이름이 closeLabel 이다.
 *   - lg 이상에서 페이지 스크롤과 무관하게 상단 띠 아래~화면 바닥에 항상 온전히 보인다.
 *   - 긴 본문에서 패널(CardContent)만 스크롤한다.
 *   - 좁은 폭(850px 미만)에서는 본문 아래로 내려온다.
 */
export type SidePanelProps = React.ComponentProps<"aside"> & {
  /** 제목 id — aria-labelledby 대상. */
  id: string;
  overline?: React.ReactNode;
  title: React.ReactNode;
  /** 닫기 링크 주소 — 선택 파라미터를 지운 주소를 준다. 서버 컴포넌트용 기본형. */
  closeHref?: string;
  /** 클라이언트 상태로 여닫는 자리의 닫기 콜백. closeHref 와 함께 주지 않는다. */
  onClose?: () => void;
  closeLabel?: string;
  /** 위에 깔린 고정 띠의 구성. AppShell 과 같은 값을 준다. */
  chrome?: "nav" | "nav-subnav";
};

/** 닫기 버튼 — 두 분기가 같은 shadcn 변형을 쓴다. press 축소만 덧붙인다. */
const CLOSE_VARIANT = { variant: "secondary", size: "icon-sm" } as const;
const CLOSE_EXTRA = "active:scale-95";

export function SidePanel({
  className,
  id,
  overline,
  title,
  closeHref,
  onClose,
  closeLabel = "패널 닫기",
  chrome = "nav-subnav",
  children,
  ...props
}: SidePanelProps) {
  const titleId = `${id}-title`;
  return (
    <>
      {/* fixed 는 흐름에서 빠진다 — 목록이 패널 밑으로 흐르지 않게 자리를 지킨다.
          폭은 패널 폭 − 본문 우측 패딩 24px(296 · 360). 본문 패딩이 패널 아래 깔리는
          몫을 빼야 목록과 패널 사이가 본문 리듬과 같은 24px 이 된다 — 패널 폭
          그대로 두면 갭이 48px 로 벌어지고, 1441px 에서 패널이 384px 로
          커지는 순간 목록 컨테이너가 736px 아래로 떨어져 뷰포트를 넓혔는데 열이
          접히는 6px 역전 구간(1441~1446)이 생겼다. */}
      <div aria-hidden="true" className="hidden shrink-0 lg:block lg:w-74 2xl:w-90" />

      <aside
        aria-labelledby={titleId}
        className={cn(
          "flex w-full shrink-0 flex-col border-t border-border bg-background",
          "lg:fixed lg:right-0 lg:bottom-0 lg:z-20 lg:w-80 lg:border-t-0 lg:border-l",
          "2xl:w-96",
          chrome === "nav" ? "lg:top-14" : "lg:top-27",
          className,
        )}
        {...props}
      >
        <Card className="min-h-0 flex-1 gap-0 rounded-none bg-transparent py-0 text-base ring-0">
          <CardHeader className="gap-x-2 gap-y-0.5 border-b border-border py-4">
            {overline ? (
              <p className="text-xs font-medium text-charcoal uppercase">
                {overline}
              </p>
            ) : null}
            <CardTitle className="min-w-0">
              <h2
                id={titleId}
                className="text-base font-semibold break-words text-foreground"
              >
                {title}
              </h2>
            </CardTitle>

            {closeHref ? (
              <CardAction>
                <ButtonLink
                  href={closeHref}
                  aria-label={closeLabel}
                  {...CLOSE_VARIANT}
                  className={CLOSE_EXTRA}
                >
                  <span aria-hidden="true" className="text-base">
                    ✕
                  </span>
                </ButtonLink>
              </CardAction>
            ) : onClose ? (
              <CardAction>
                <Button
                  aria-label={closeLabel}
                  onClick={onClose}
                  {...CLOSE_VARIANT}
                  className={CLOSE_EXTRA}
                >
                  <span aria-hidden="true" className="text-base">
                    ✕
                  </span>
                </Button>
              </CardAction>
            ) : null}
          </CardHeader>

          <CardContent className="min-h-0 flex-1 overflow-y-auto p-4">
            {children}
          </CardContent>
        </Card>
      </aside>
    </>
  );
}
