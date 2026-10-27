"use client";

import { useState, type FormEvent } from "react";
import {
  ArrowDownWideNarrow, ArrowRight, ArrowUpRight, BookOpen, Check,
  ChevronRight, CircleHelp, Clock3, FileText, Fingerprint, Folder,
  Grid2X2, Layers3, LayoutTemplate, List, Plus, Star,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { DefinitionList } from "@/components/ui/definition-list";
import { EmptyState } from "@/components/ui/empty-state";
import { FormField } from "@/components/ui/form-field";
import { GlobalNav } from "@/components/ui/global-nav";
import { Lozenge } from "@/components/ui/lozenge";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { OptionChip } from "@/components/ui/option-chip";
import { SearchInput } from "@/components/ui/search-input";
import { Separator } from "@/components/ui/separator";
import { SiteFooter } from "@/components/ui/site-footer";
import { SkipLink } from "@/components/ui/skip-link";
import { Textarea, TextInput } from "@/components/ui/text-input";

type Project = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  status: "진행 중" | "검토 중" | "완료";
  files: number;
  updated: string;
  favorite: boolean;
};

const INITIAL_PROJECTS: Project[] = [
  { id: "brand", title: "브랜드 리뉴얼", subtitle: "Brand refresh", category: "브랜딩", status: "진행 중", files: 12, updated: "2시간 전", favorite: true, description: "브랜드의 다음 장을 위한 시각 언어와 새로운 가이드라인." },
  { id: "website", title: "제품 웹사이트", subtitle: "A new digital home", category: "웹사이트", status: "검토 중", files: 8, updated: "4시간 전", favorite: false, description: "우리 제품의 이야기를 가장 명료하게 전달하는 웹 경험." },
  { id: "system", title: "디자인 시스템", subtitle: "Less, but consistent", category: "시스템", status: "진행 중", files: 24, updated: "어제", favorite: true, description: "작은 컴포넌트에서 시작하는 일관된 제품 경험의 기반." },
  { id: "research", title: "사용자 리서치", subtitle: "Listen before you build", category: "리서치", status: "완료", files: 6, updated: "어제", favorite: false, description: "사용자의 목소리에서 발견한 질문과 다음 작업의 실마리." },
  { id: "app", title: "모바일 앱", subtitle: "Made for everyday", category: "프로덕트", status: "진행 중", files: 16, updated: "10월 24일", favorite: false, description: "매일의 작은 불편을 덜어내는, 손안의 간결한 도구." },
  { id: "archive", title: "10월 아카이브", subtitle: "Things worth keeping", category: "컬렉션", status: "완료", files: 18, updated: "10월 22일", favorite: false, description: "다시 꺼내 보고 싶은 레퍼런스, 문장, 그리고 아이디어." },
];

const STATUS_TONE = { "진행 중": "neutral", "검토 중": "warn", "완료": "ok" } as const;
const PROJECT_ICONS = [Fingerprint, LayoutTemplate, Layers3, BookOpen, Grid2X2, Folder];
const INITIAL_ACTIVITY = [
  { id: "brand", title: "브랜드 리뉴얼", action: "브랜드 가이드 업데이트", time: "2시간 전", icon: FileText },
  { id: "website", title: "제품 웹사이트", action: "검토 준비 완료", time: "4시간 전", icon: Clock3 },
  { id: "research", title: "사용자 리서치", action: "프로젝트 완료", time: "어제", icon: Check },
];

export function ProjectLibrary() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("recent");
  const [view, setView] = useState("grid");
  const [createOpen, setCreateOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");

  const favoriteCount = projects.filter((project) => project.favorite).length;
  const completeCount = projects.filter((project) => project.status === "완료").length;
  const activeCount = projects.filter((project) => project.status === "진행 중").length;
  const search = query.trim().toLocaleLowerCase("ko");
  const visibleProjects = projects.filter((project) => {
    const matchesFilter = filter === "all" || (filter === "favorites" ? project.favorite : project.status === "완료");
    return matchesFilter && `${project.title} ${project.subtitle} ${project.description} ${project.category}`.toLocaleLowerCase("ko").includes(search);
  }).sort((a, b) => sort === "name" ? a.title.localeCompare(b.title, "ko") : 0);

  function toggleFavorite(id: string) {
    setProjects((current) => current.map((project) => project.id === id ? { ...project, favorite: !project.favorite } : project));
  }

  function addProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const title = String(form.get("title") ?? "").trim();
    if (!title) {
      setFormError("프로젝트 이름을 입력해 주세요.");
      return;
    }
    const description = String(form.get("description") ?? "").trim();
    setProjects((current) => [{
      id: crypto.randomUUID(), title, description: description || "새로운 아이디어를 차곡차곡 모아보세요.",
      subtitle: "A fresh start", category: String(form.get("category") ?? "프로덕트"),
      status: "진행 중", files: 0, updated: "방금 전", favorite: false,
    }, ...current]);
    setFilter("all");
    setQuery("");
    setSort("recent");
    setCreateOpen(false);
    setNotice(`‘${title}’ 프로젝트를 만들었습니다.`);
  }

  return (
    <>
      <SkipLink targetId="main-content" />
      <GlobalNav
        label="Folio 내비게이션"
        brand={<span className="flex items-center gap-2 font-heading text-2xl font-semibold"><Layers3 className="size-6" aria-hidden="true" />folio<span className="text-muted-foreground">.</span></span>}
        breadcrumb={<span className="hidden items-center gap-3 text-sm text-muted-foreground sm:flex"><span>나의 워크스페이스</span><ChevronRight className="size-3" aria-hidden="true" /><span className="text-foreground">프로젝트</span></span>}
        actions={<>
          <Badge variant="outline">개인 공간</Badge>
          <ModalDialog
            title="Folio에 오신 것을 환영해요"
            description="아이디어부터 결과물까지, 작업을 차곡차곡."
            trigger={<Button variant="ghost" size="icon" aria-label="도움말"><CircleHelp aria-hidden="true" /></Button>}
          >
            <div className="flex flex-col gap-4 py-2 text-sm text-charcoal">
              <p>프로젝트를 검색하거나 즐겨찾기로 모아보세요. 카드의 ‘열기’ 버튼으로 작업의 개요를 확인할 수 있습니다.</p>
              <p>‘새 프로젝트’에서 이름과 설명을 입력하면 목록에 바로 추가됩니다.</p>
              <p>이 페이지는 샘플 데이터로 구성된 목업입니다. 변경 사항은 현재 화면에서만 유지되며, 새로고침하면 처음 상태로 돌아갑니다.</p>
            </div>
          </ModalDialog>
          <Avatar aria-label="나의 프로필"><AvatarFallback>나</AvatarFallback></Avatar>
        </>}
      />

      <main id="main-content" tabIndex={-1} className="mx-auto flex w-full max-w-app flex-1 flex-col gap-8 px-6 py-10 lg:px-12 lg:py-12">
        <header className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex flex-col gap-3">
            <p className="font-heading text-sm text-muted-foreground">A little space for your next big idea.</p>
            <h1 className="font-heading text-3xl font-semibold sm:text-4xl">좋은 작업이 쌓이는 곳.</h1>
            <p className="text-sm text-charcoal sm:text-base">흩어진 아이디어부터 완성된 결과물까지, 한 공간에서 이어가세요.</p>
          </div>
          <ModalDialog
            title="새 프로젝트"
            description="이름 하나면 충분해요. 나머지는 천천히 채워가세요."
            open={createOpen}
            onOpenChange={(open) => { setCreateOpen(open); setFormError(""); }}
            trigger={<Button><Plus data-icon="inline-start" aria-hidden="true" />새 프로젝트</Button>}
            footer={<><Button type="submit" form="new-project">프로젝트 만들기<ArrowRight aria-hidden="true" /></Button><Button variant="ghost" onClick={() => setCreateOpen(false)}>취소</Button></>}
          >
            <form id="new-project" onSubmit={addProject} className="flex flex-col gap-5 py-2">
              <FormField label="프로젝트 이름" required error={formError}>
                <TextInput name="title" required maxLength={60} placeholder="어떤 작업을 시작할까요?" invalid={Boolean(formError)} onChange={() => setFormError("")} />
              </FormField>
              <FormField label="분류"><NativeSelect name="category" className="w-full">{["프로덕트", "브랜딩", "웹사이트", "시스템", "리서치", "컬렉션"].map((category) => <NativeSelectOption key={category} value={category}>{category}</NativeSelectOption>)}</NativeSelect></FormField>
              <FormField label="한 줄 소개"><Textarea name="description" maxLength={240} rows={3} placeholder="프로젝트의 시작점이 될 생각을 적어주세요." /></FormField>
            </form>
          </ModalDialog>
        </header>

        <dl className="grid grid-cols-2 gap-6 py-2 sm:grid-cols-4">
          {[{ label: "전체 프로젝트", value: projects.length, note: "차곡차곡 모은 작업" }, { label: "진행 중", value: activeCount, note: "조금씩 나아가는 중" }, { label: "완료", value: completeCount, note: "하나의 마침표" }, { label: "즐겨찾기", value: favoriteCount, note: "자주 꺼내 보는 작업" }].map((stat) => <div key={stat.label} className="flex flex-col gap-1"><dt className="text-sm text-charcoal">{stat.label}</dt><dd className="font-heading text-3xl font-semibold tabular-nums">{String(stat.value).padStart(2, "0")}</dd><dd className="text-xs text-muted-foreground">{stat.note}</dd></div>)}
        </dl>
        <Separator />

        <div className="grid grid-cols-1 items-start gap-10 xl:grid-cols-4">
          <section id="projects" aria-labelledby="projects-title" className="flex min-w-0 flex-col gap-5 xl:col-span-3">
            <div className="flex items-center justify-between gap-4">
              <h2 id="projects-title" className="text-xl font-semibold">나의 프로젝트 <span className="ml-1 font-normal text-muted-foreground">{projects.length}</span></h2>
              <div role="group" aria-label="프로젝트 보기 방식" className="flex items-center gap-1">
                <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon-sm" aria-label="카드 보기" aria-pressed={view === "grid"} onClick={() => setView("grid")}><Grid2X2 aria-hidden="true" /></Button>
                <Button variant={view === "list" ? "secondary" : "ghost"} size="icon-sm" aria-label="목록 보기" aria-pressed={view === "list"} onClick={() => setView("list")}><List aria-hidden="true" /></Button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="프로젝트 필터">
              <OptionChip size="compact" selected={filter === "all"} count={projects.length} onClick={() => setFilter("all")}>전체</OptionChip>
              <OptionChip size="compact" selected={filter === "favorites"} count={favoriteCount} onClick={() => setFilter("favorites")}>즐겨찾기</OptionChip>
              <OptionChip size="compact" selected={filter === "completed"} count={completeCount} onClick={() => setFilter("completed")}>완료</OptionChip>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <SearchInput label="프로젝트 검색" labelHidden placeholder="이름, 설명, 분류로 검색" value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1" />
              <div className="flex shrink-0 items-center gap-2"><ArrowDownWideNarrow className="hidden size-4 text-muted-foreground sm:block" aria-hidden="true" /><NativeSelect size="sm" aria-label="프로젝트 정렬" value={sort} onChange={(event) => setSort(event.target.value)}><NativeSelectOption value="recent">최근 수정순</NativeSelectOption><NativeSelectOption value="name">이름순</NativeSelectOption></NativeSelect></div>
            </div>

            <p aria-live="polite" role="status" className="sr-only">{notice || `${visibleProjects.length}개의 프로젝트`}</p>
            {visibleProjects.length ? (
              <div className={view === "grid" ? "grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3" : "grid grid-cols-1 gap-4"} data-testid="project-list">
                {visibleProjects.map((project) => {
                  const Icon = PROJECT_ICONS[Math.max(0, INITIAL_PROJECTS.findIndex((item) => item.id === project.id))];
                  return (
                    <Card key={project.id} render={<article aria-labelledby={`${project.id}-title`} />} className="h-full">
                      <CardHeader className="gap-4">
                        <div className="flex items-center justify-between gap-3">
                          <Icon className="size-6 text-charcoal" strokeWidth={1.5} aria-hidden="true" />
                          <Button variant={project.favorite ? "secondary" : "ghost"} size="icon-sm" aria-label={`${project.title} 즐겨찾기`} aria-pressed={project.favorite} onClick={() => toggleFavorite(project.id)}><Star aria-hidden="true" fill={project.favorite ? "currentColor" : "none"} /></Button>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="font-heading text-xs text-muted-foreground">{project.subtitle}</p>
                          <h3 id={`${project.id}-title`} className="text-lg font-medium break-words">{project.title}</h3>
                        </div>
                      </CardHeader>
                      <CardContent className="flex flex-1 flex-col gap-4">
                        <p className="text-sm break-words text-charcoal">{project.description}</p>
                        <div className="mt-auto flex flex-wrap items-center gap-2"><Lozenge tone={STATUS_TONE[project.status]}>{project.status}</Lozenge><span className="text-xs text-muted-foreground">{project.category}</span></div>
                      </CardContent>
                      <CardFooter className="justify-between gap-2">
                        <div className="flex flex-col gap-1"><span className="flex items-center gap-1 text-xs text-charcoal"><FileText className="size-3" aria-hidden="true" />문서 {project.files}</span><span className="text-xs text-muted-foreground">{project.updated}</span></div>
                        <ModalDialog
                          title={project.title}
                          description={project.description}
                          trigger={<Button variant="ghost" size="sm" aria-label={`${project.title} 열기`}>열기<ArrowUpRight aria-hidden="true" /></Button>}
                        >
                          <div className="flex flex-col gap-6 py-3">
                            <DefinitionList layout="inline" items={[{ term: "분류", description: project.category }, { term: "진행 상태", description: <Lozenge tone={STATUS_TONE[project.status]}>{project.status}</Lozenge> }, { term: "마지막 작업", description: project.updated }, { term: "모아둔 문서", description: `${project.files}개` }]} />
                            <Separator />
                            <p className="text-sm text-charcoal">{project.files > 0 ? "문서 수는 목업용 예시입니다. 실제 문서 파일은 연결되어 있지 않습니다." : "첫 아이디어를 담을 준비가 되었어요. 아직 추가된 문서는 없습니다."}</p>
                            <Button variant="outline" className="self-start" aria-pressed={project.favorite} onClick={() => toggleFavorite(project.id)}><Star aria-hidden="true" />{project.favorite ? "즐겨찾기에서 빼기" : "즐겨찾기에 담기"}</Button>
                          </div>
                        </ModalDialog>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <EmptyState title="프로젝트가 보이지 않아요" description="검색어를 바꾸거나 다른 필터를 선택해 보세요." action={<Button variant="outline" onClick={() => { setQuery(""); setFilter("all"); }}>전체 프로젝트 보기</Button>} />
            )}
            <p className="text-xs text-muted-foreground">{visibleProjects.length}개의 프로젝트 · 작은 기록이 다음 작업의 시작이 됩니다.</p>
          </section>

          <aside aria-label="워크스페이스 소식" className="flex min-w-0 flex-col gap-8">
            <section id="activity" aria-labelledby="activity-title" className="flex flex-col gap-5">
              <div className="flex items-center justify-between"><h2 id="activity-title" className="text-base font-semibold">최근 활동</h2><Clock3 className="size-4 text-muted-foreground" aria-hidden="true" /></div>
              <ol className="flex flex-col gap-6">
                {projects.filter((project) => !INITIAL_PROJECTS.some((item) => item.id === project.id)).slice(0, 2).map((project) => <li key={project.id} className="flex items-start gap-3"><Plus className="mt-1 size-4 shrink-0 text-charcoal" aria-hidden="true" /><div className="flex min-w-0 flex-col gap-1"><p className="text-sm font-medium break-words">{project.title}</p><p className="text-xs text-charcoal">새 프로젝트 시작</p><p className="text-xs text-muted-foreground">방금 전</p></div></li>)}
                {INITIAL_ACTIVITY.map(({ id, title, action, time, icon: Icon }) => <li key={id} className="flex items-start gap-3"><Icon className="mt-1 size-4 shrink-0 text-charcoal" aria-hidden="true" /><div className="flex flex-col gap-1"><p className="text-sm font-medium">{title}</p><p className="text-xs text-charcoal">{action}</p><p className="text-xs text-muted-foreground">{time}</p></div></li>)}
              </ol>
            </section>
            <Separator />
            <Card variant="dark">
              <CardHeader className="gap-4"><Layers3 className="size-6" strokeWidth={1.5} aria-hidden="true" /><p className="font-heading text-xs text-on-dark-mute">MAKE ROOM FOR IDEAS</p><h2 className="text-xl font-medium">시작은 가볍게.<br />가능성은 넓게.</h2></CardHeader>
              <CardContent className="flex flex-col gap-5"><p className="text-sm text-on-dark-mute">아직 다듬어지지 않은 생각도 좋아요. 새로운 프로젝트에 담아보세요.</p><Button variant="on-dark" className="self-start" onClick={() => { setFormError(""); setCreateOpen(true); }}>아이디어 담기<ArrowRight aria-hidden="true" /></Button></CardContent>
            </Card>
            <div className="flex items-start gap-3 text-muted-foreground"><BookOpen className="mt-0.5 size-4 shrink-0" aria-hidden="true" /><p className="text-xs">완성하지 않아도 괜찮아요.<br />오늘의 기록은 내일의 힌트니까요.</p></div>
          </aside>
        </div>
      </main>
      <SiteFooter legal={<span className="flex flex-wrap items-center justify-between gap-3"><span className="font-heading">folio. A place for work in progress.</span><span>나만의 속도로, 차곡차곡. · 인터랙티브 목업</span></span>} />
    </>
  );
}
