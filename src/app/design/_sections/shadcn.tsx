"use client";

import { BellIcon, SearchIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { Kbd } from "@/components/ui/kbd";
import { Label } from "@/components/ui/label";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Grid, Section, Specimen } from "../_catalog";

/**
 * shadcn/ui 원본 컴포넌트(base-nova · Base UI) 전시 — Ollama 테마가 입혀진 상태.
 * 앱 컴포넌트는 이 부품들을 조립해 만든다. 여기에는 원본을 그대로 쓴 표본만 둔다.
 */
export function ShadcnSection() {
  return (
    <Section
      id="shadcn"
      title="shadcn/ui 원본"
      note="shadcn CLI 로 설치한 Base UI 컴포넌트에 design.md(Ollama) 토큰을 입힌 상태. 앱 컴포넌트는 전부 이 부품의 조립이다."
    >
      <Grid>
        <Specimen name="button.tsx" state="default · outline · secondary · ghost · destructive · link">
          <Button>Default</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
          <Button size="icon" aria-label="알림">
            <BellIcon />
          </Button>
        </Specimen>

        <Specimen name="button-group.tsx" state="이어 붙인 묶음">
          <ButtonGroup aria-label="정렬">
            <Button variant="outline" size="sm">
              최신
            </Button>
            <Button variant="outline" size="sm">
              이름
            </Button>
            <Button variant="outline" size="sm">
              상태
            </Button>
          </ButtonGroup>
        </Specimen>

        <Specimen name="input.tsx · label.tsx" state="기본 / 비활성 / 오류">
          <div className="flex w-full flex-col gap-2">
            <Label htmlFor="shadcn-input-email">이메일</Label>
            <Input id="shadcn-input-email" placeholder="user@example.com" />
            <Input aria-label="비활성 입력" placeholder="비활성" disabled />
            <Input aria-label="오류 입력" aria-invalid defaultValue="잘못된 값" />
          </div>
        </Specimen>

        <Specimen name="input-group.tsx" state="앞 아이콘 + 단축키">
          <InputGroup className="w-full">
            <InputGroupAddon>
              <SearchIcon aria-hidden="true" />
            </InputGroupAddon>
            <InputGroupInput aria-label="검색" placeholder="Search models" />
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </Specimen>

        <Specimen name="textarea.tsx · native-select.tsx" state="기본">
          <div className="flex w-full flex-col gap-2">
            <Textarea aria-label="메모" placeholder="메모를 적습니다…" rows={3} />
            <NativeSelect aria-label="상태" defaultValue="draft" className="w-full">
              <NativeSelectOption value="draft">초안</NativeSelectOption>
              <NativeSelectOption value="review">검토 중</NativeSelectOption>
            </NativeSelect>
          </div>
        </Specimen>

        <Specimen name="field.tsx" state="라벨 + 설명">
          <Field className="w-full">
            <FieldLabel htmlFor="shadcn-field-name">프로젝트 이름</FieldLabel>
            <Input id="shadcn-field-name" placeholder="예: 웹 대시보드 개편…" />
            <FieldDescription>동사-명사로 짧게 적습니다.</FieldDescription>
          </Field>
        </Specimen>

        <Specimen name="checkbox.tsx · radio-group.tsx" state="선택 / 미선택 / 비활성">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Checkbox aria-labelledby="shadcn-cb-1-label" defaultChecked />
              <Label id="shadcn-cb-1-label">요구사항 정리</Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox aria-labelledby="shadcn-cb-2-label" />
              <Label id="shadcn-cb-2-label">시안 작성</Label>
            </div>
            <RadioGroup defaultValue="a" aria-label="다음 단계">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="a" aria-labelledby="shadcn-r-a-label" />
                <Label id="shadcn-r-a-label">보관</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="b" aria-labelledby="shadcn-r-b-label" />
                <Label id="shadcn-r-b-label">리뷰 요청</Label>
              </div>
            </RadioGroup>
          </div>
        </Specimen>

        <Specimen name="toggle.tsx · toggle-group.tsx" state="켜짐 / 꺼짐">
          <Toggle aria-label="굵게" defaultPressed>
            굵게
          </Toggle>
          <ToggleGroup aria-label="보기">
            <ToggleGroupItem value="table">표</ToggleGroupItem>
            <ToggleGroupItem value="matrix">매트릭스</ToggleGroupItem>
          </ToggleGroup>
        </Specimen>

        <Specimen name="badge.tsx · avatar.tsx · kbd.tsx" state="variant · 상태 색">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">승인</Badge>
          <Badge variant="info">검토 중</Badge>
          <Badge variant="warning">확인 필요</Badge>
          <Badge variant="danger">반려</Badge>
          <Badge variant="muted">초안</Badge>
          <Avatar>
            <AvatarFallback>AT</AvatarFallback>
          </Avatar>
          <Kbd>Esc</Kbd>
        </Specimen>

        <Specimen name="tabs.tsx" state="default · line">
          <Tabs defaultValue="over" className="w-full">
            <TabsList>
              <TabsTrigger value="over">개요</TabsTrigger>
              <TabsTrigger value="diagram">다이어그램</TabsTrigger>
            </TabsList>
            <TabsContent value="over">개요 패널</TabsContent>
            <TabsContent value="diagram">다이어그램 패널</TabsContent>
          </Tabs>
          <Tabs defaultValue="a" className="w-full">
            <TabsList variant="line">
              <TabsTrigger value="a">표</TabsTrigger>
              <TabsTrigger value="b">매트릭스</TabsTrigger>
            </TabsList>
          </Tabs>
        </Specimen>

        <Specimen name="breadcrumb.tsx" state="링크 / 현재">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/design">워크스페이스</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>프로젝트</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </Specimen>

        <Specimen name="card.tsx" state="헤더 · 본문 · 푸터 / render=article · dark">
          <Card render={<article aria-labelledby="shadcn-card-article" />} variant="dark" size="sm" className="w-full">
            <CardHeader>
              <CardTitle>
                <h4 id="shadcn-card-article">article 로 렌더한 카드</h4>
              </CardTitle>
              <CardDescription>render 로 의미 태그 자체가 카드가 된다.</CardDescription>
            </CardHeader>
          </Card>
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sample 웹 개편</CardTitle>
              <CardDescription>마일스톤 5 · 작업 14</CardDescription>
            </CardHeader>
            <CardContent>카드 본문은 그림자 없이 hairline 하나로 나뉜다.</CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                열기
              </Button>
            </CardFooter>
          </Card>
        </Specimen>

        <Specimen name="item.tsx · separator.tsx" state="목록 행 · 구분선">
          <ItemGroup className="w-full">
            <Item variant="outline" role="listitem">
              <ItemContent>
                <ItemTitle>디자인 팀</ItemTitle>
                <ItemDescription>프로젝트 3 · 확인 필요 1</ItemDescription>
              </ItemContent>
            </Item>
            <Item variant="muted" role="listitem">
              <ItemContent>
                <ItemTitle>프론트엔드 팀</ItemTitle>
                <ItemDescription>프로젝트 1</ItemDescription>
              </ItemContent>
            </Item>
          </ItemGroup>
          <Separator />
        </Specimen>

        <Specimen name="alert.tsx · empty.tsx" state="default · destructive · 빈 상태">
          <div className="flex w-full flex-col gap-3">
            <Alert>
              <AlertTitle>승인 완료</AlertTitle>
              <AlertDescription>MS-02 마일스톤이 승인됐습니다.</AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertTitle>승인 차단</AlertTitle>
              <AlertDescription>리뷰어가 없으면 승인을 기록할 수 없습니다.</AlertDescription>
            </Alert>
            <Empty>
              <EmptyHeader>
                <EmptyTitle>아직 만든 프로젝트가 없습니다</EmptyTitle>
                <EmptyDescription>프로젝트를 만들면 여기에 나타납니다.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          </div>
        </Specimen>

        <Specimen name="table.tsx" state="정적 표" span>
          <Table>
            <TableCaption>워크스페이스 관계</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>주어</TableHead>
                <TableHead>동사</TableHead>
                <TableHead>목적어</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>프로젝트</TableCell>
                <TableCell>포함한다</TableCell>
                <TableCell>마일스톤</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>마일스톤</TableCell>
                <TableCell>묶는다</TableCell>
                <TableCell>작업</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Specimen>

        <Specimen name="scroll-area.tsx · collapsible.tsx" state="스크롤 · 접힘/펼침">
          <ScrollArea className="h-24 w-full" aria-label="작업 목록">
            <div className="flex flex-col gap-2 p-2 text-sm">
              {["요구사항 정리", "시안 작성", "구현", "리뷰", "릴리스"].map(
                (label) => (
                  <span key={label}>{label}</span>
                ),
              )}
            </div>
          </ScrollArea>
          <Collapsible>
            <CollapsibleTrigger render={<Button variant="outline" size="sm" />}>
              작업 후보 펼치기
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="pt-2 text-sm text-charcoal">정해지지 않은 값은 확인 필요로 남깁니다.</p>
            </CollapsibleContent>
          </Collapsible>
        </Specimen>

        <Specimen
          name="dialog.tsx · alert-dialog.tsx · sheet.tsx · popover.tsx · tooltip.tsx"
          state="트리거 → 오버레이"
          span
        >
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>Dialog</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>워크스페이스 개념 안내</DialogTitle>
                <DialogDescription>Esc 로 닫고 트리거로 포커스가 돌아갑니다.</DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>AlertDialog</AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>보관할까요?</AlertDialogTitle>
                <AlertDialogDescription>삭제가 아니라 상태 변경입니다.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>취소</AlertDialogCancel>
                <AlertDialogAction>보관</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>Sheet</SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>선택한 프로젝트</SheetTitle>
                <SheetDescription>화면 가장자리에서 나오는 모달 패널.</SheetDescription>
              </SheetHeader>
            </SheetContent>
          </Sheet>
          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>Popover</PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>이 화면의 상태</PopoverTitle>
                <PopoverDescription>배경을 가리지 않습니다.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>Tooltip</TooltipTrigger>
              <TooltipContent>보조 설명</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Specimen>
      </Grid>
    </Section>
  );
}
