import { Button } from "@/components/ui/button";
import { ActionFooter } from "@/components/ui/action-footer";
import { Card } from "@/components/ui/card";
import { DefinitionList } from "@/components/ui/definition-list";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { DisclosureTray } from "@/components/ui/disclosure-tray";
import { Lozenge } from "@/components/ui/lozenge";
import { InfoPopover } from "@/components/ui/info-popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { SectionPanel } from "@/components/ui/section-panel";
import { SidePanel } from "@/components/ui/side-panel";
import { Grid, Section, Specimen } from "../_catalog";

export function PanelsSection() {
  return (
    <Section
      id="panels"
      title="패널·오버레이"
      note="포커스를 가둬야 하면 Dialog, 곁에서 읽는 것이면 SidePanel·Popover 다."
    >
      <Grid>
        <Specimen name="section-panel.tsx" state="제목 + 메타 + 우측 슬롯 + 각주">
          <SectionPanel
            className="w-full"
            id="design-sect-demo"
            title="리뷰 결정"
            meta="화면은 어떤 결정도 자동으로 고르지 않습니다"
            actions={<Lozenge tone="danger">리뷰어 없음 — 승인 차단</Lozenge>}
            note="리뷰어가 지정되기 전에는 결정을 기록할 수 없고 자료만 검토합니다."
          >
            <div className="flex flex-wrap gap-2">
              <Button>승인</Button>
              <Button variant="outline">수정 요청</Button>
              <Button variant="outline">보류</Button>
              <Button variant="outline">반려</Button>
            </div>
          </SectionPanel>
        </Specimen>

        <Specimen name="disclosure-tray.tsx" state="접힘 / 펼침">
          <div className="flex w-full flex-col gap-2">
            <DisclosureTray
              summary="더 큰 전체 그림 — 워크스페이스 구조"
              meta="참고용"
            >
              <p className="text-base text-charcoal">
                프로젝트 화면은 이 큰 그림에서 마일스톤 주변만 잘라 단순화한 것입니다.
              </p>
            </DisclosureTray>
            <DisclosureTray
              open
              summary="작업 후보 (펼침 상태)"
              meta="초안 3건"
            >
              <p className="text-base text-charcoal">
                정해지지 않은 값은 확인 필요로 남습니다.
              </p>
            </DisclosureTray>
          </div>
        </Specimen>

        <Specimen
          name="dialog.tsx"
          state="트리거 → 모달"
          note="ESC·백드롭으로 닫히고 포커스가 트리거로 돌아온다. Base UI 가 포커스를 관리한다."
        >
          <ModalDialog
            trigger={<Button variant="outline">워크스페이스 개념 안내 열기</Button>}
            title="워크스페이스 개념 안내"
            description="프로젝트 · 마일스톤 · 작업 · 리뷰의 관계"
            footer={<Button>이해했습니다</Button>}
          >
            <DefinitionList
              items={[
                { term: "프로젝트", description: "하나의 목표를 향한 작업 묶음 전체" },
                { term: "마일스톤", description: "프로젝트를 이루는 순서 있는 구간. 완료 조건 = 다음 시작 조건" },
                { term: "작업", description: "마일스톤 안에서 한 사람이 맡는 일 하나" },
                { term: "리뷰", description: "마일스톤을 승인하거나 수정 요청하는 절차" },
              ]}
            />
          </ModalDialog>
        </Specimen>

        <Specimen
          name="popover.tsx"
          state="트리거 → 팝오버"
          note="배경을 가리지 않고 포커스를 가두지 않는다. 읽고 지나가는 보충 설명용."
        >
          <InfoPopover
            trigger={<Button variant="outline" size="sm">이 화면의 상태</Button>}
            title="작업은 재료, 마일스톤은 결과물"
          >
            <p>
              작업은 한 사람이 맡는 일 하나입니다. 작업마다 마일스톤이 생기지 않습니다.
              승인은 리뷰어가 하며, 정해지지 않은 값은 확인 필요로 남습니다.
            </p>
          </InfoPopover>
        </Specimen>
      </Grid>

      <Specimen
        name="modal-dialog.tsx"
        state="full-width 폼 · 짧은 본문 / 긴 본문"
        note="본문이 포커스 링 공간을 확보한다. 별도 여백 없이 NativeSelect·Input을 폭에 맞추고 Tab으로 이동한다."
      >
        {[{ id: "short", length: "짧은 본문" }, { id: "long", length: "긴 본문" }].map(({ id, length }) => (
          <ModalDialog
            key={id}
            trigger={<Button variant="outline">{length} 폼 열기</Button>}
            title={`${length} 폼`}
            description="Tab으로 테이블 선택과 메모 입력의 포커스 링을 확인합니다."
            footer={<Button>저장</Button>}
          >
            <div className="flex flex-col gap-4">
              <Label htmlFor={`modal-table-${id}`} className="sr-only">테이블</Label>
              <NativeSelect id={`modal-table-${id}`} className="w-full">
                <NativeSelectOption>olist_order_payments_dataset</NativeSelectOption>
                <NativeSelectOption>olist_orders_dataset</NativeSelectOption>
              </NativeSelect>
              {length === "긴 본문" ? Array.from({ length: 16 }, (_, index) => (
                <p key={index} className="text-base text-charcoal">
                  {index + 1}. 테이블의 키와 관계를 검토합니다. 긴 본문에서는 제목과 하단 액션을 유지하고 본문만 스크롤합니다.
                </p>
              )) : null}
              <Label htmlFor={`modal-memo-${id}`} className="sr-only">메모</Label>
              <Input id={`modal-memo-${id}`} placeholder="검토 메모" />
            </div>
          </ModalDialog>
        ))}
      </Specimen>

      <Specimen
        name="side-panel.tsx"
        state="표본 (고정 해제)"
        span
        note="목록을 보면서 곁에서 읽는 패널이라 포커스를 가두지 않는다."
      >
        <Card className="w-full gap-0 overflow-hidden py-0">
          <SidePanel
            id="design-side-panel"
            overline="선택한 프로젝트"
            title="가입 후 첫 작업까지 걸리는 단계를 줄인다"
            closeHref="/design#panels"
            className="w-full lg:static lg:z-auto lg:h-auto lg:w-full"
          >
            <DefinitionList
              items={[
                { term: "코드", description: "PRJ-02" },
                { term: "상태", description: "검토 중" },
                { term: "현재 마일스톤", description: "MS-02" },
                {
                  term: "리뷰어",
                  description: "확인 필요 — 아직 지정되지 않음",
                  missing: true,
                },
              ]}
            />
          </SidePanel>
        </Card>
      </Specimen>

      <Specimen name="action-footer.tsx" state="기본 / sticky" note="폼·패널 하단의 액션 줄. sticky 는 스크롤 컨테이너 바닥에 붙는다.">
        <div className="flex w-full flex-col">
          <p className="pb-3 text-sm text-charcoal">폼 본문</p>
          <ActionFooter>
            <Button>수정 저장</Button>
            <Button variant="outline">취소</Button>
          </ActionFooter>
        </div>
      </Specimen>
    </Section>
  );
}
