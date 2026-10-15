import { cn } from "@/lib/utils";

/**
 * HistoryList — 변경 이력
 *
 * 근거: ADS 활동 로그 해부도(시각 + 행위자 + 내용). 시각 값은 design.md 토큰.
 *
 * 기반 primitive: 없음 — 네이티브 <ol reversed>/<li>/<time> 를 의도적으로 유지한다.
 *   ItemGroup 은 div[role=list] 라 `reversed`(최신이 위) 순서 시맨틱을 표현하지 못하고,
 *   Item 루트(`render` 로 li 대체)는 Base UI `useRender`(내부 useRef)라 서버 컴포넌트에서
 *   호출할 수 없다. 한 줄에 흘러가는 [일시][행위자][내용] 배치는 Item 의
 *   media/content 2단 배치와도 맞지 않는다.
 *
 * 쓰임
 *   상태 변경(초안 → 검토 중 → 승인)과 리뷰 결정은 **되돌릴 수 있는 결정**이다.
 *   보관도 삭제가 아니라 상태 변경이다. 그래서 이력은 부가 정보가 아니라 화면의
 *   일부이며, 결정한 사람·일자·근거가 함께 남아야 한다.
 *
 * 해부도
 *   [일시] [행위자] [내용]
 *   [일시] [행위자] [내용]
 *
 * 토큰
 *   --text-base + --color-charcoal · 일시는 등폭(tabular-nums) · 행위자는 --color-foreground
 *   이력 내용은 "누가 무엇을 왜 바꿨는가"를 읽는 문장이므로 본문 14/20 이다.
 *   ADS 스펙의 캡션 12/16 은 표 헤더·라벨 전용이고, 결정 근거가 화면에서 가장
 *   작은 글씨가 되면 이력이 각주처럼 읽힌다.
 *
 * 상태
 *   상태 없음(표시용).
 *
 * 키보드·ARIA
 *   <ol reversed> — 최신이 위에 오는 목록임을 시맨틱으로 알린다.
 *   시각은 <time dateTime> 으로 기계 판독 가능한 값을 함께 남긴다.
 *   날짜 표시는 호출부가 `Intl.DateTimeFormat` 으로 만든 문자열을 넘긴다
 *   (형식을 하드코딩하지 않는다).
 *
 * 수용 기준
 *   - 시각이 등폭으로 정렬된다.
 *   - dateTime 속성에 ISO 값이 들어간다.
 */
export type HistoryEntry = {
  id: string;
  /** ISO 8601 값. 기계 판독용. */
  dateTime: string;
  /** 화면에 보일 시각 문자열. Intl.DateTimeFormat 결과를 넘긴다. */
  displayTime: string;
  actor?: React.ReactNode;
  children: React.ReactNode;
};

export function HistoryList({
  label,
  entries,
  className,
}: {
  label: string;
  entries: readonly HistoryEntry[];
  className?: string;
}) {
  return (
    <ol
      reversed
      aria-label={label}
      className={cn("flex flex-col gap-1", className)}
    >
      {entries.map((entry) => (
        <li key={entry.id} className="flex flex-wrap gap-x-2 text-base text-charcoal">
          <time dateTime={entry.dateTime} className="shrink-0 tabular-nums">
            {entry.displayTime}
          </time>
          {entry.actor ? (
            <span className="shrink-0 font-medium text-foreground">{entry.actor}</span>
          ) : null}
          <span className="min-w-0">{entry.children}</span>
        </li>
      ))}
    </ol>
  );
}
