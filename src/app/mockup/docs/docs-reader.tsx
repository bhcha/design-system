"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { BookOpen, Check, FileText, Layers3, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { BulletList } from "@/components/ui/bullet-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CopyButton } from "@/components/ui/copy-button";
import { DataTable } from "@/components/ui/data-table";
import { DocsSideNav, DocsToc } from "@/components/ui/docs-navigation";
import { DocsMobileMenu } from "@/components/ui/docs-mobile-menu";
import { DocsPager } from "@/components/ui/docs-pager";
import { DocsShell, DocsSection } from "@/components/ui/docs-shell";
import { GlobalNav } from "@/components/ui/global-nav";
import { Kbd } from "@/components/ui/kbd";
import { LinkTabs } from "@/components/ui/link-tabs";
import { ModalDialog } from "@/components/ui/modal-dialog";
import { NumberedSteps } from "@/components/ui/numbered-steps";
import { ResultCallout } from "@/components/ui/result-callout";
import { Separator } from "@/components/ui/separator";
import { SkipLink } from "@/components/ui/skip-link";
import { CATEGORIES, DEFAULT_DOCUMENT, DOCUMENTS, documentHref, type DocSection } from "./documents";

function subscribeToLocation(callback: () => void) {
  window.addEventListener("hashchange", callback);
  window.addEventListener("popstate", callback);
  return () => {
    window.removeEventListener("hashchange", callback);
    window.removeEventListener("popstate", callback);
  };
}

const locationSnapshot = () => window.location.hash || documentHref(DEFAULT_DOCUMENT);
const serverSnapshot = () => documentHref(DEFAULT_DOCUMENT);

function SectionBody({ section }: { section: DocSection }) {
  return (
    <>
      {section.paragraphs?.map((paragraph) => <p key={paragraph} className="text-base text-charcoal">{paragraph}</p>)}
      {section.note ? <ResultCallout tone="neutral" title={section.note.title}>{section.note.text}</ResultCallout> : null}
      {section.bullets ? <BulletList items={section.bullets.map((content) => ({ id: content, content }))} /> : null}
      {section.steps ? <NumberedSteps steps={section.steps.map((step) => ({ id: step.title, title: step.title, children: <p>{step.text}</p> }))} /> : null}
      {section.table ? (
        <DataTable
          caption={section.title}
          captionHidden
          columns={section.table.headers.map((header, index) => ({ key: header, header, rowHeader: index === 0, cell: (row: [string, string, string]) => row[index] }))}
          rows={section.table.rows}
          getRowId={(row) => row[0]}
        />
      ) : null}
      {section.code ? (
        <Card variant="muted" render={<figure />} className="gap-0 py-0">
          <figcaption className="flex items-center justify-between gap-3 px-4 py-3">
            <span className="min-w-0 truncate font-mono text-sm text-charcoal">{section.code.filename}</span>
            <CopyButton value={section.code.text} label={`${section.code.filename} 복사`} />
          </figcaption>
          <Separator />
          <CardContent className="py-4">
            <pre className="whitespace-pre-wrap break-words font-mono text-sm text-charcoal"><code>{section.code.text}</code></pre>
          </CardContent>
        </Card>
      ) : null}
    </>
  );
}

export function DocsReader() {
  const hash = useSyncExternalStore(subscribeToLocation, locationSnapshot, serverSnapshot);
  const params = new URLSearchParams(hash.slice(1));
  const page = DOCUMENTS.find((item) => item.id === params.get("doc")) ?? DOCUMENTS.find((item) => item.id === DEFAULT_DOCUMENT)!;
  const requestedSection = params.get("section");
  const category = CATEGORIES.find((item) => item.id === page.category)!;
  const categoryPages = DOCUMENTS.filter((item) => item.category === category.id);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [activeSection, setActiveSection] = useState(page.sections[0].id);

  const navigate = useCallback((href: string) => {
    setMenuOpen(false);
    setSearchOpen(false);
    if (window.location.hash !== href) {
      window.history.pushState(null, "", href);
      window.dispatchEvent(new Event("hashchange"));
    } else {
      const target = new URLSearchParams(href.slice(1));
      const section = target.get("section");
      if (section) document.getElementById(`${target.get("doc")}-${section}`)?.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0 });
    }
  }, [setMenuOpen, setSearchOpen]);

  // Use native fragment links in both the Next route and the standalone file.
  // Capture first so Next Link does not start a competing router transition.
  useEffect(() => {
    function followDocumentLink(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target instanceof Element ? event.target.closest("a") : null;
      const href = anchor?.getAttribute("href");
      if (!href?.startsWith("#doc=")) return;
      event.preventDefault();
      navigate(href);
    }
    document.addEventListener("click", followDocumentLink, true);
    return () => document.removeEventListener("click", followDocumentLink, true);
  }, [navigate]);

  useEffect(() => {
    function shortcut(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k" && !menuOpen) {
        event.preventDefault();
        setSearchOpen((open) => !open);
        setSearchValue("");
      }
    }
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, [menuOpen]);

  useEffect(() => {
    document.title = `${page.title} · Folio Docs`;
    const frame = window.requestAnimationFrame(() => {
      const target = requestedSection ? document.getElementById(`${page.id}-${requestedSection}`) : null;
      if (target) target.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0 });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [page.id, page.title, requestedSection]);

  useEffect(() => {
    let frame = 0;
    function updateSection() {
      frame = 0;
      if (window.scrollY <= 0) {
        setActiveSection(page.sections[0].id);
        return;
      }
      const headings = page.sections.map((section) => ({ id: section.id, top: document.getElementById(`${page.id}-${section.id}`)?.getBoundingClientRect().top ?? Infinity }));
      const passed = headings.filter((heading) => heading.top <= window.innerHeight / 3);
      const atBottom = window.scrollY > 0 && Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight;
      setActiveSection(atBottom ? page.sections.at(-1)!.id : passed.at(-1)?.id ?? page.sections[0].id);
    }
    function scheduleUpdate() {
      if (!frame) frame = window.requestAnimationFrame(updateSection);
    }
    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [page]);

  const groups = [...new Set(categoryPages.map((item) => item.group))].map((group) => ({
    id: `${category.id}-${group.replaceAll(" ", "-")}`,
    label: group,
    items: categoryPages.filter((item) => item.group === group).map((item) => ({ label: item.title, href: documentHref(item.id), current: item.id === page.id })),
  }));
  const pageIndex = DOCUMENTS.indexOf(page);
  const previous = DOCUMENTS[pageIndex - 1];
  const next = DOCUMENTS[pageIndex + 1];
  const currentLink = typeof window === "undefined" ? hash : `${window.location.href.split("#")[0]}${hash}`;

  return (
    <>
      <SkipLink targetId="docs-main" />
      <GlobalNav
        layout="docs"
        label="Folio Docs 상단 메뉴"
        brand={<span className="flex items-center gap-3">
          <DocsMobileMenu title={category.label} groups={groups} open={menuOpen} onOpenChange={setMenuOpen} />
          <span className="flex items-center gap-2 font-heading text-2xl font-semibold"><Layers3 className="size-6" aria-hidden="true" />folio<span className="text-muted-foreground">.</span></span>
          <span className="hidden text-sm font-normal text-muted-foreground sm:inline">/</span><span className="hidden text-sm font-medium sm:inline">Docs</span>
        </span>}
        actions={<>
          <ModalDialog
            title="문서 검색"
            description="제목과 본문에서 필요한 내용을 찾아보세요."
            open={searchOpen}
            onOpenChange={(open) => { setSearchOpen(open); if (open) setSearchValue(""); }}
            trigger={<Button variant="secondary" aria-label="문서 검색 열기"><Search aria-hidden="true" /><span className="hidden sm:inline">문서 검색</span><span className="hidden sm:inline"><Kbd>⌘ K</Kbd></span></Button>}
          >
            <Command loop>
              <CommandInput autoFocus aria-label="문서 검색어" placeholder="궁금한 내용을 입력하세요…" value={searchValue} onValueChange={setSearchValue} />
              <CommandList aria-label="문서 검색 결과">
                <CommandEmpty>일치하는 문서가 없습니다. 다른 단어로 찾아보세요.</CommandEmpty>
                {CATEGORIES.map((group) => <CommandGroup key={group.id} heading={group.label}>
                  {DOCUMENTS.filter((doc) => doc.category === group.id).map((doc) => <CommandItem key={doc.id} value={doc.title} keywords={[doc.summary, ...doc.sections.flatMap((section) => [section.title, ...(section.paragraphs ?? []), ...(section.bullets ?? [])])]} onSelect={() => navigate(documentHref(doc.id))}><FileText aria-hidden="true" /><span>{doc.title}</span></CommandItem>)}
                </CommandGroup>)}
              </CommandList>
            </Command>
            <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Kbd>↑ ↓</Kbd>선택<Kbd>Enter</Kbd>열기<Kbd>Esc</Kbd>닫기</p>
          </ModalDialog>
          <span className="hidden sm:inline"><Badge variant="outline">v1.0</Badge></span>
        </>}
      />

      <LinkTabs variant="docs" label="문서 카테고리" current={category.id} items={CATEGORIES.map((item) => ({ value: item.id, label: item.label, href: documentHref(DOCUMENTS.find((doc) => doc.category === item.id)!.id) }))} />

      <DocsShell
        articleLabelledBy="document-title"
        sidebar={<DocsSideNav title={category.label} groups={groups} />}
        toc={<DocsToc items={page.sections.map((section) => ({ label: section.title, href: documentHref(page.id, section.id), current: activeSection === section.id }))} />}
      >
            <Breadcrumb aria-label="문서 위치"><BreadcrumbList><BreadcrumbItem><BreadcrumbLink href={documentHref("overview")}>문서 홈</BreadcrumbLink></BreadcrumbItem><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>{category.label}</BreadcrumbPage></BreadcrumbItem></BreadcrumbList></Breadcrumb>
            <header className="flex flex-col gap-4">
              <h1 id="document-title" tabIndex={-1} className="font-heading text-3xl font-semibold sm:text-4xl">{page.title}</h1>
              <p className="text-base text-charcoal sm:text-lg">{page.summary}</p>
              <div className="flex flex-wrap items-center justify-between gap-3"><p className="flex items-center gap-2 text-xs text-muted-foreground"><BookOpen className="size-3" aria-hidden="true" />{category.label}<span aria-hidden="true">·</span>문서 샘플</p><div className="flex items-center gap-1"><span className="text-xs text-muted-foreground">링크 복사</span><CopyButton value={currentLink} label="현재 문서 링크 복사" /></div></div>
            </header>
            <Separator />

            {page.sections.map((section) => (
              <DocsSection key={`${page.id}-${section.id}`} id={`${page.id}-${section.id}`} title={section.title}>
                <SectionBody section={section} />
              </DocsSection>
            ))}

            <Separator />
            <DocsPager
              previous={previous ? { label: previous.title, href: documentHref(previous.id) } : undefined}
              next={next ? { label: next.title, href: documentHref(next.id) } : undefined}
            />
            <footer className="flex flex-wrap items-center justify-between gap-3 pb-4 text-xs text-muted-foreground"><span className="flex items-center gap-1"><Check className="size-3" aria-hidden="true" />작은 기록에서 시작하는, 함께 아는 일.</span><span>Folio Docs · 인터랙티브 목업</span></footer>
      </DocsShell>
    </>
  );
}
