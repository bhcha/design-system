import { cn } from "@/lib/utils";

/**
 * AppShell — 사이드바 + 작업 영역 2열 셸
 *
 * shadcn 기반
 *   레이아웃 컨테이너라 대응하는 shadcn 프리미티브가 없다(Sidebar 는 설치돼 있지 않다).
 *   ScrollArea 는 **쓰지 않는다** — 다음 세 가지를 깨기 때문이다.
 *   1. e2e 가 `main` 의 바로 앞 형제(= <aside>)에서 배경(--color-muted)과 top 56px ·
 *      bottom = 뷰포트를 잰다. ScrollArea 는 Root·Viewport 두 겹 div 를 끼우고
 *      Viewport 가 size-full 로 **정해진 높이**를 요구하는데, lg 미만에서 사이드바는
 *      높이가 자연 높이(auto)라 Viewport 크기가 정해지지 않는다.
 *   2. ScrollArea 는 클라이언트 컴포넌트다. 셸은 서버 컴포넌트로 남아야 한다.
 *   3. 스크롤 가능한 Viewport 가 탭 정지점을 하나 더 만든다(사이드바 링크 앞).
 *   그래서 sticky + 네이티브 overflow-y-auto 를 유지한다.
 *
 * 해부도
 *   ┌──────────┬───────────────────────────┐
 *   │ sidebar  │ main (id=main, tabindex=-1)│
 *   │ 240px    │ 남는 폭 전부               │
 *   └──────────┴───────────────────────────┘
 *   sidebar 는 sticky. lg(850px) 미만에서는 본문 위로 접혀 가로 배치가 풀린다.
 *
 * 토큰
 *   사이드바 폭 w-60(240px) · 배경 --color-muted · 우측 경계 --color-border
 *   본문 배경 --color-background(흰 면) · 패딩 p-6(24px), 좁은 폭 p-4
 *
 *   작업 도구 계열 배치를 따른다 — 상단바와 본문이 흰 면이고
 *   사이드바만 한 단계 가라앉아 경계를 만든다.
 *
 * 고정 오프셋
 *   상단 global-nav(56px)만큼 사이드바를 내려야 화면 밖으로 넘치지 않는다 — top-14 · h-below-nav.
 *
 * 상태
 *   상태 없음(레이아웃 컨테이너).
 *
 * 키보드·ARIA
 *   본문은 <main id> + tabindex="-1" — SkipLink 의 착지점이 된다.
 *   사이드바는 <aside>. 안에 들어가는 <nav> 가 랜드마크 이름을 갖는다.
 *
 * 수용 기준
 *   - 본문이 가로로 넘치지 않는다(min-w-0).
 *   - 사이드바가 길어지면 자체 스크롤한다(본문 스크롤을 뺏지 않는다).
 *   - 사이드바가 56px 에서 시작해 뷰포트 바닥에서 끝난다.
 */
export type AppShellProps = {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  /** SkipLink 착지점 id. */
  mainId?: string;
  className?: string;
};

export function AppShell({
  sidebar,
  children,
  mainId = "main",
  className,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col bg-background lg:flex-row",
        className,
      )}
    >
      <aside
        className={cn(
          "shrink-0 border-b border-border bg-muted",
          "lg:sticky lg:w-60 lg:overflow-y-auto lg:border-r lg:border-b-0",
          "lg:top-14 lg:h-below-nav",
        )}
      >
        <div className="p-3">{sidebar}</div>
      </aside>

      <main id={mainId} tabIndex={-1} className="min-w-0 flex-1 p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
}
