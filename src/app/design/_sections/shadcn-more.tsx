"use client";

import * as React from "react";
import {
  ArchiveIcon,
  CopyIcon,
  FolderIcon,
  ListChecksIcon,
  MilestoneIcon,
  PencilIcon,
  SearchCheckIcon,
  Trash2Icon,
} from "lucide-react";
import { ko } from "react-day-picker/locale";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import { Toaster } from "@/components/ui/sonner";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import { TextLink } from "@/components/ui/text-link";
import { Grid, Section, Specimen } from "../_catalog";

/** 카탈로그 안에서만 쓰는 예시 데이터(Sample). 업무 데이터가 아니다. */
const STATUS_ITEMS = [
  { label: "초안", value: "draft" },
  { label: "검토 중", value: "review" },
  { label: "승인", value: "approved" },
  { label: "보관", value: "archived" },
  { label: "확인 필요", value: "attention" },
];

const PROJECTS = [
  "Sample 웹 개편",
  "Sample 모바일",
  "디자인 시스템 정비",
  "검색 품질 개선",
  "리뷰 자동화",
];

const REVIEWERS = ["김하늘", "박서준", "이도윤", "최유나", "정민호"];

function ComboboxChipsDemo() {
  const anchor = useComboboxAnchor();
  return (
    <Combobox multiple items={REVIEWERS} defaultValue={["김하늘", "이도윤"]}>
      <ComboboxChips ref={anchor} className="w-80">
        <ComboboxValue>
          {(values: string[]) => (
            <>
              {values.map((value) => (
                <ComboboxChip key={value} removeLabel={`${value} 선택 해제`}>
                  {value}
                </ComboboxChip>
              ))}
              <ComboboxChipsInput aria-label="리뷰어 추가" placeholder="리뷰어 추가…" />
            </>
          )}
        </ComboboxValue>
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>일치하는 리뷰어가 없습니다.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        명령 팔레트 열기
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput aria-label="명령 검색" placeholder="명령 검색…" />
          <CommandList>
            <CommandEmpty>결과가 없습니다.</CommandEmpty>
            <CommandGroup heading="작업">
              <CommandItem onSelect={() => setOpen(false)}>
                <ListChecksIcon aria-hidden="true" />새 작업 만들기
              </CommandItem>
              <CommandItem onSelect={() => setOpen(false)}>
                <SearchCheckIcon aria-hidden="true" />
                리뷰 요청
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}

/**
 * shadcn/ui 원본 컴포넌트 2차분(base-nova · Base UI) 전시 — Ollama 테마가 입혀진 상태.
 * 메뉴·선택·피드백·내비게이션·패널 계열 18종.
 */
export function ShadcnMoreSection() {
  const [date, setDate] = React.useState<Date | undefined>(
    () => new Date(2026, 9, 15),
  );
  const [statusFilter, setStatusFilter] = React.useState("review");
  const [showArchived, setShowArchived] = React.useState(false);

  return (
    <Section
      id="shadcn-more"
      title="shadcn/ui 원본 — 메뉴 · 선택 · 피드백 · 내비게이션"
      note="한 줄 상호작용 컨트롤(트리거·선택·콤보·스위치·페이지 링크·내비 트리거)은 pill, 메뉴·팝오버·패널은 rounded-lg + hairline 링. 그림자·blur 없음."
    >
      <Grid>
        <Specimen name="dropdown-menu.tsx" state="트리거 pill · 그룹 · 체크 · 라디오 · 하위 메뉴 · 비활성 · 위험">
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              작업 메뉴
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel>작업</DropdownMenuLabel>
                <DropdownMenuItem>
                  <PencilIcon aria-hidden="true" />
                  편집
                  <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CopyIcon aria-hidden="true" />
                  복제
                </DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>상태 변경</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={statusFilter}
                      onValueChange={setStatusFilter}
                    >
                      {STATUS_ITEMS.map((item) => (
                        <DropdownMenuRadioItem key={item.value} value={item.value}>
                          {item.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
                <DropdownMenuItem disabled>
                  <ArchiveIcon aria-hidden="true" />
                  보관 (권한 없음)
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={showArchived}
                onCheckedChange={setShowArchived}
              >
                보관된 작업 표시
              </DropdownMenuCheckboxItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2Icon aria-hidden="true" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </Specimen>

        <Specimen name="select.tsx" state="기본 / compact / 비활성">
          <Select items={STATUS_ITEMS} defaultValue="review">
            <SelectTrigger aria-label="작업 상태" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>상태</SelectLabel>
                {STATUS_ITEMS.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Select items={STATUS_ITEMS} defaultValue="draft">
            <SelectTrigger size="sm" aria-label="작업 상태 (compact)" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select items={STATUS_ITEMS} defaultValue="archived" disabled>
            <SelectTrigger aria-label="작업 상태 (비활성)" className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_ITEMS.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Specimen>

        <Specimen name="combobox.tsx" state="입력 pill · 지우기 / 다중 선택 칩">
          <Combobox items={PROJECTS}>
            <ComboboxInput aria-label="프로젝트 검색" placeholder="프로젝트 검색…" showClear className="w-72" />
            <ComboboxContent>
              <ComboboxEmpty>일치하는 프로젝트가 없습니다.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <ComboboxChipsDemo />
        </Specimen>

        <Specimen
          name="command.tsx"
          state="인라인 / 대화상자"
          note="대화상자 표본은 버튼으로 연다 — 정적 전시에서는 닫혀 있다."
        >
          <Card size="sm" className="w-full max-w-96 gap-0 overflow-hidden py-0">
            <Command>
              <CommandInput aria-label="작업 명령 검색" placeholder="명령 검색…" />
              <CommandList>
                <CommandEmpty>결과가 없습니다.</CommandEmpty>
                <CommandGroup heading="이동">
                  <CommandItem>
                    <FolderIcon aria-hidden="true" />
                    프로젝트
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <MilestoneIcon aria-hidden="true" />
                    마일스톤
                    <CommandShortcut>⌘M</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="작업">
                  <CommandItem>
                    <SearchCheckIcon aria-hidden="true" />
                    리뷰 요청
                  </CommandItem>
                  <CommandItem disabled>
                    <ArchiveIcon aria-hidden="true" />
                    보관 (권한 없음)
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </Card>
          <CommandDialogDemo />
        </Specimen>

        <Specimen name="switch.tsx" state="꺼짐 / 켜짐 / compact / 비활성">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Switch aria-labelledby="more-switch-1-label" />
              <Label id="more-switch-1-label">리뷰 알림 받기</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch aria-labelledby="more-switch-2-label" defaultChecked />
              <Label id="more-switch-2-label">승인 시 자동 보관</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch size="sm" aria-labelledby="more-switch-3-label" defaultChecked />
              <Label id="more-switch-3-label">마일스톤 요약 (compact)</Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch aria-labelledby="more-switch-4-label" disabled />
              <Label id="more-switch-4-label">외부 공유 (비활성)</Label>
            </div>
          </div>
        </Specimen>

        <Specimen name="slider.tsx" state="단일 / 범위 / 비활성">
          <div className="flex w-full max-w-80 flex-col gap-6">
            <Slider defaultValue={[60]} getAriaLabel={() => "검토 진행률"} />
            <Slider
              defaultValue={[20, 80]}
              getAriaLabel={(index) => (index === 0 ? "기간 시작" : "기간 끝")}
            />
            <Slider defaultValue={[40]} disabled getAriaLabel={() => "우선순위 (비활성)"} />
          </div>
        </Specimen>

        <Specimen name="input-otp.tsx" state="기본 / 비활성">
          <InputOTP maxLength={6} aria-label="인증 코드">
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
          <InputOTP maxLength={4} aria-label="인증 코드 (비활성)" disabled>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
            </InputOTPGroup>
          </InputOTP>
        </Specimen>

        <Specimen name="calendar.tsx" state="단일 선택 · 한국어 로캘">
          <Card size="sm" className="w-fit">
            <Calendar
              mode="single"
              locale={ko}
              selected={date}
              onSelect={setDate}
              defaultMonth={new Date(2026, 9, 1)}
            />
          </Card>
        </Specimen>

        <Specimen
          name="sonner.tsx"
          state="기본 / 성공"
          note="버튼을 누르면 화면 오른쪽 아래에 토스트가 뜬다. <Toaster /> 는 이 표본 안에 둔다."
        >
          <Button
            variant="outline"
            onClick={() =>
              toast("리뷰 요청을 보냈습니다", {
                description: "Sample 웹 개편 · 마일스톤 2 · 작업 3건",
              })
            }
          >
            리뷰 요청 알림
          </Button>
          <Button onClick={() => toast.success("작업이 승인되었습니다")}>승인 알림</Button>
          <Toaster />
        </Specimen>

        <Specimen name="progress.tsx" state="진행 중 / 완료">
          <div className="flex w-full max-w-80 flex-col gap-4">
            <Progress value={60}>
              <ProgressLabel>마일스톤 2 진행률</ProgressLabel>
              <ProgressValue />
            </Progress>
            <Progress value={100}>
              <ProgressLabel>마일스톤 1 진행률</ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
        </Specimen>

        <Specimen name="skeleton.tsx" state="불러오는 중">
          <div aria-busy="true" aria-label="작업 목록 불러오는 중" role="status" className="flex w-full max-w-80 items-center gap-3">
            <Skeleton className="size-10" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Specimen>

        <Specimen name="spinner.tsx" state="단독 / 버튼 안">
          <Spinner />
          <Button disabled>
            <Spinner aria-label="저장 중" />
            저장 중
          </Button>
        </Specimen>

        <Specimen name="pagination.tsx" state="이전 · 번호 · 현재 · 생략 · 다음" span>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="/design#shadcn-more" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="/design#shadcn-more" aria-label="1페이지">
                  1
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="/design#shadcn-more" isActive aria-label="2페이지, 현재">
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="/design#shadcn-more" aria-label="3페이지">
                  3
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="/design#shadcn-more" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </Specimen>

        <Specimen name="navigation-menu.tsx" state="트리거 pill · 열림 패널" span>
          <NavigationMenu aria-label="Sample 탐색 (표본)">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>프로젝트</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-80 gap-1">
                    <NavigationMenuLink href="/design#shadcn-more">
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">Sample 웹 개편</span>
                        <span className="text-muted-foreground">검토 중 · 작업 12건</span>
                      </span>
                    </NavigationMenuLink>
                    <NavigationMenuLink href="/design#shadcn-more">
                      <span className="flex flex-col gap-0.5">
                        <span className="font-medium">디자인 시스템 정비</span>
                        <span className="text-muted-foreground">승인 · 작업 4건</span>
                      </span>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>마일스톤</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-64 gap-1">
                    <NavigationMenuLink href="/design#shadcn-more">마일스톤 1 · 승인</NavigationMenuLink>
                    <NavigationMenuLink href="/design#shadcn-more">마일스톤 2 · 검토 중</NavigationMenuLink>
                    <NavigationMenuLink href="/design#shadcn-more">마일스톤 3 · 초안</NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </Specimen>

        <Specimen
          name="sidebar.tsx"
          state="상자 안 표본 (collapsible=none)"
          span
          note="기본 사이드바(offcanvas·icon)는 fixed · h-svh 로 화면 전체에 붙어 카탈로그 안에 담을 수 없다. 고정 높이 Card 안의 SidebarProvider 에 collapsible=&quot;none&quot; 으로 전시한다. 접힘·모바일 Sheet 는 실제 앱 화면에서 확인한다."
        >
          <Card size="sm" className="h-80 w-full gap-0 overflow-hidden py-0">
            <SidebarProvider className="h-full min-h-0">
              <Sidebar collapsible="none" aria-label="Sample 사이드바 (표본)">
                <SidebarHeader>
                  <p className="px-2 text-sm font-semibold text-foreground">Sample</p>
                </SidebarHeader>
                <SidebarSeparator />
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>워크스페이스</SidebarGroupLabel>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton isActive>
                            <FolderIcon aria-hidden="true" />
                            <span>프로젝트</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>5</SidebarMenuBadge>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <MilestoneIcon aria-hidden="true" />
                            <span>마일스톤</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <ListChecksIcon aria-hidden="true" />
                            <span>작업</span>
                          </SidebarMenuButton>
                          <SidebarMenuBadge>12</SidebarMenuBadge>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                          <SidebarMenuButton disabled>
                            <SearchCheckIcon aria-hidden="true" />
                            <span>리뷰 (권한 없음)</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                  <p className="px-2 text-xs text-muted-foreground">확인 필요 2건</p>
                </SidebarFooter>
              </Sidebar>
              <SidebarInset>
                <div className="flex flex-col gap-2 p-4">
                  <p className="text-base font-medium text-foreground">프로젝트</p>
                  <p className="text-sm text-muted-foreground">
                    Sample 웹 개편 · 검토 중 — 본문 영역(SidebarInset)이다.
                  </p>
                </div>
              </SidebarInset>
            </SidebarProvider>
          </Card>
        </Specimen>

        <Specimen name="accordion.tsx" state="하나만 펼침 · 첫 항목 펼침">
          <Accordion defaultValue={["scope"]} className="w-full max-w-96">
            <AccordionItem value="scope">
              <AccordionTrigger>마일스톤 2 범위</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">작업 12건 · 리뷰 3건 · 확인 필요 2건.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="review">
              <AccordionTrigger>리뷰 기준</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">승인 전에 리뷰어 두 명이 검토한다.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="archive" disabled>
              <AccordionTrigger>보관 정책 (비활성)</AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">보관된 작업은 읽기 전용이다.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </Specimen>

        <Specimen name="hover-card.tsx" state="링크에 hover · focus">
          <HoverCard>
            <HoverCardTrigger render={<TextLink href="/design#shadcn-more" />}>
              Sample 웹 개편
            </HoverCardTrigger>
            <HoverCardContent>
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">Sample 웹 개편</p>
                <p className="text-muted-foreground">마일스톤 2 · 검토 중 · 작업 12건</p>
              </div>
            </HoverCardContent>
          </HoverCard>
        </Specimen>

        <Specimen name="drawer.tsx" state="아래에서 올라옴" note="버튼으로 연다 — 정적 전시에서는 닫혀 있다.">
          <Drawer>
            <DrawerTrigger render={<Button variant="outline" />}>작업 상세 열기</DrawerTrigger>
            <DrawerContent>
              <div className="mx-auto flex w-full max-w-96 flex-col">
                <DrawerHeader>
                  <DrawerTitle>리뷰 요청</DrawerTitle>
                  <DrawerDescription>
                    Sample 웹 개편 · 마일스톤 2 의 작업 3건을 리뷰어에게 보낸다.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">상태: 초안 → 검토 중</p>
                </div>
                <DrawerFooter>
                  <DrawerClose render={<Button />}>요청 보내기</DrawerClose>
                  <DrawerClose render={<Button variant="outline" />}>취소</DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </Specimen>
      </Grid>
    </Section>
  );
}
