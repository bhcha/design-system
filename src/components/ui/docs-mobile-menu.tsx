"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type ReactElement } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocsSideNav, type DocsNavGroup } from "@/components/ui/docs-navigation";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

/**
 * DocsMobileMenu — 문서용 모바일 메뉴 (Sheet + DocsSideNav)
 *
 * 해부도
 *   메뉴 버튼 → 왼쪽 서랍 [제목·닫기] [현재 카테고리의 문서 목록].
 *   기본 버튼은 xl 미만에서 보이며 trigger로 다른 호출 버튼을 넣을 수 있다.
 *
 * 토큰
 *   Sheet의 popover·border·overlay, Button ghost icon/icon-sm을 그대로 쓴다.
 *   목록 영역은 flex-1 min-h-0 overflow-y-auto로 화면 높이에 맞춘다.
 *
 * 상태
 *   열림 / 닫힘 · 제어(open/onOpenChange) / 비제어.
 *   문서 선택 시 닫는다. Ctrl/⌘ 클릭은 메뉴를 닫지 않는다.
 *   화면 확대로 기본 호출 버튼이 숨겨지면 열린 서랍도 닫는다.
 *
 * 키보드·ARIA
 *   Sheet가 aria-expanded/controls, 포커스 가둠, Esc·배경 닫기, 스크롤 잠금을 맡는다.
 *   닫으면 호출 버튼으로 복귀한다. 버튼이 숨겨졌다면 returnFocusId 본문으로 이동한다.
 *
 * 수용 기준
 *   닫힌 메뉴는 Tab 순서에서 빠진다. 긴 목록에서도 제목과 닫기 버튼은 남는다.
 *   링크 이동·새 탭 열기 동작을 가로채지 않으며 좁은 화면의 가로 넘침이 없다.
 */
export type DocsMobileMenuProps = {
  title: string;
  groups: readonly DocsNavGroup[];
  trigger?: ReactElement<Record<string, unknown>>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  returnFocusId?: string;
};

export function DocsMobileMenu({ title, groups, trigger, open, onOpenChange, returnFocusId = "docs-main" }: DocsMobileMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isOpen = open ?? uncontrolledOpen;
  const triggerRef = useRef<HTMLButtonElement>(null);
  const changeOpen = useCallback((nextOpen: boolean) => {
    if (open === undefined) setUncontrolledOpen(nextOpen);
    onOpenChange?.(nextOpen);
  }, [open, onOpenChange, setUncontrolledOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function closeHiddenMenu() {
      if (triggerRef.current?.getClientRects().length === 0) changeOpen(false);
    }
    window.addEventListener("resize", closeHiddenMenu);
    return () => window.removeEventListener("resize", closeHiddenMenu);
  }, [isOpen, changeOpen]);

  function followLink(event: MouseEvent<HTMLDivElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
    if (anchor && anchor.getAttribute("target") !== "_blank" && !anchor.hasAttribute("download")) changeOpen(false);
  }

  return (
    <Sheet open={isOpen} onOpenChange={changeOpen}>
      <SheetTrigger ref={triggerRef} render={trigger ?? <Button variant="ghost" size="icon" className="xl:hidden" aria-label="문서 메뉴 열기"><Menu aria-hidden="true" /></Button>} />
      <SheetContent side="left" showCloseButton={false} finalFocus={() => {
        if (triggerRef.current?.getClientRects().length) return triggerRef.current;
        // Base UI는 tabIndex=-1 컨테이너 대신 첫 링크를 고른다. 배경의 inert가
        // 해제된 다음 프레임에 본문 자체를 포커스해 읽던 위치를 유지한다.
        const content = document.getElementById(returnFocusId);
        window.requestAnimationFrame(() => {
          if (content?.isConnected) content.focus({ preventScroll: true });
        });
        return false;
      }}>
        <SheetHeader>
          <div className="flex items-center justify-between gap-3">
            <SheetTitle>문서 메뉴</SheetTitle>
            <SheetClose render={<Button variant="ghost" size="icon-sm" aria-label="문서 메뉴 닫기" />}><X aria-hidden="true" /></SheetClose>
          </div>
          <SheetDescription>문서를 선택해 읽기를 이어가세요.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6" onClickCapture={followLink}>
          <DocsSideNav title={title} groups={groups} label="모바일 문서 목록" />
        </div>
      </SheetContent>
    </Sheet>
  );
}
