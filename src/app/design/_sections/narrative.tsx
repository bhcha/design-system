import { Figure } from "@/components/ui/figure";
import { HistoryList } from "@/components/ui/history-list";
import { NumberedSteps } from "@/components/ui/numbered-steps";
import { QuoteBlock } from "@/components/ui/quote-block";
import { ResultCallout } from "@/components/ui/result-callout";
import { Grid, Section, Specimen } from "../_catalog";

export function NarrativeSection() {
  return (
    <Section
      id="narrative"
      title="서술·근거"
      note="결정에는 근거 위치가 따라붙는다. 인용은 장식이 아니라 증거다."
    >
      <Grid>
        <Specimen
          name="quote-block.tsx"
          state="인용 + 근거 위치"
          note="출처(source)는 선택이 아니라 필수 prop 이다."
        >
          <QuoteBlock className="w-full" source="리뷰 노트 · 3쪽">
            첫 화면에서 다음에 할 일이 바로 보여야 합니다. 설정은 그다음에 찾아도
            충분해요.
          </QuoteBlock>
        </Specimen>

        <Specimen name="result-callout.tsx" state="5톤 / live">
          <div className="flex w-full flex-col gap-2">
            <ResultCallout tone="ok" title="승인 완료" live>
              MS-02 마일스톤이 승인됐습니다.
            </ResultCallout>
            <ResultCallout tone="warn" title="마일스톤 연결 — 확인 필요">
              작업 TSK-03 이 아직 어느 마일스톤에도 속하지 않습니다.
            </ResultCallout>
            <ResultCallout tone="info">
              작성 가이드는 필수 규칙이 아니라 참고 지침입니다.
            </ResultCallout>
            <ResultCallout tone="danger" title="승인 차단">
              리뷰어가 지정되지 않으면 승인을 기록할 수 없습니다.
            </ResultCallout>
            <ResultCallout>
              보관된 프로젝트는 읽기 전용입니다.
            </ResultCallout>
          </div>
        </Specimen>

        <Specimen name="history-list.tsx" state="이력">
          <HistoryList
            className="w-full"
            label="상태 변경 이력"
            entries={[
              {
                id: "h3",
                dateTime: "2026-08-17T09:20:00+09:00",
                displayTime: "08-17 09:20",
                actor: "나",
                children: "초안 → 검토 중",
              },
              {
                id: "h2",
                dateTime: "2026-08-14T15:02:00+09:00",
                displayTime: "08-14 15:02",
                actor: "나",
                children: "리뷰어 지정",
              },
              {
                id: "h1",
                dateTime: "2026-08-12T11:00:00+09:00",
                displayTime: "08-12 11:00",
                actor: "나",
                children: "PRJ-01 아래에 등록",
              },
            ]}
          />
        </Specimen>

        <Specimen
          name="figure.tsx"
          state="도판 + 출처 캡션"
          note="alt 와 caption 이 필수다. 외부에서 가져온 도판은 출처 표기가 빠질 수 없다."
        >
          <Figure
            className="w-full"
            src="/design-samples/figure-placeholder.svg"
            alt="프로젝트가 마일스톤을 포함하고, 마일스톤이 작업을 묶으며, 리뷰가 마일스톤을 승인하는 관계도"
            width={480}
            height={240}
            caption="자리표시 도판. 실제 화면에서는 출처가 있는 도판이 들어가고 캡션에 출처를 적는다."
          />
        </Specimen>
      </Grid>

      <Specimen name="numbered-steps.tsx" state="기본 / 흐림" span>
        <NumberedSteps
          className="w-full"
          steps={[
            {
              id: "n1",
              title: "① 프로젝트 정의부터",
              children: (
                <p>
                  목표·담당·완료 기준을 먼저 채우면 빠진 항목이 바로 드러나 다음
                  리뷰의 질문이 됩니다.
                </p>
              ),
            },
            {
              id: "n2",
              title: "마일스톤 나누기",
              children: <p>시작·완료 조건을 채우면 이음매 검사가 빈 곳을 짚어줍니다.</p>,
            },
            {
              id: "n3",
              title: "로드맵 한 장은 지금 불필요",
              dim: true,
              children: <p>여러 프로젝트를 한눈에 봐야 할 때 그리면 됩니다.</p>,
            },
          ]}
        />
      </Specimen>
    </Section>
  );
}
