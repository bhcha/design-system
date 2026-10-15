"use client"

/**
 * shadcn/ui command (base-nova, cmdk) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   Command ─ Input(검색 pill) · List ─ Group(heading) · Item(+ Shortcut) · Separator · Empty
 *   CommandDialog = Dialog 안의 Command(명령 팔레트)
 *
 * 토큰
 *   패널 bg-popover · rounded-xl(12px) · 검색 입력 h-9 rounded-full bg-muted(search-pill) · 항목 선택 bg-accent
 *   그림자 없음 · 단축키 text-xs text-muted-foreground
 *
 * 상태
 *   기본 / 필터 중 / 결과 없음 / 항목 선택(data-selected) / 비활성(text-mute)
 *
 * 키보드·ARIA
 *   cmdk — 입력 role=combobox, 목록 role=listbox, 항목 role=option. ↑↓ 이동, Enter 실행.
 *   구분선은 listbox 허용 자식이 아니라 role="none" 장식 div 로 그린다.
 *   CommandDialog 는 Dialog 라 포커스 가둠·Esc·제목(sr-only)을 갖는다. 입력에는 aria-label 을 준다.
 *
 * 수용 기준
 *   - 검색 입력은 pill 이다.
 *   - Dialog 로 열면 접근 가능한 제목이 있다.
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */
import * as React from "react"
import { Command as CommandPrimitive, useCommandState } from "cmdk"
import { cn } from "@/lib/utils"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  InputGroup,
  InputGroupAddon,
} from "@/components/ui/input-group"
import { SearchIcon, CheckIcon } from "lucide-react"

function Command({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground",
        className
      )}
      {...props}
    />
  )
}

function CommandDialog({
  title = "명령 팔레트",
  description = "실행할 명령을 검색합니다.",
  children,
  className,
  showCloseButton = false,
  ...props
}: Omit<React.ComponentProps<typeof Dialog>, "children"> & {
  title?: string
  description?: string
  className?: string
  showCloseButton?: boolean
  children: React.ReactNode
}) {
  return (
    <Dialog {...props}>
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent
        className={cn(
          "top-1/3 translate-y-0 overflow-hidden rounded-xl! p-0",
          className
        )}
        showCloseButton={showCloseButton}
      >
        {children}
      </DialogContent>
    </Dialog>
  )
}

function CommandInput({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Input>) {
  return (
    <div data-slot="command-input-wrapper" className="p-1 pb-0">
      <InputGroup className="h-9! border-transparent bg-muted *:data-[slot=input-group-addon]:pl-3!">
        <CommandPrimitive.Input
          data-slot="command-input"
          className={cn(
            "w-full text-sm outline-hidden disabled:cursor-not-allowed disabled:text-mute",
            className
          )}
          {...props}
        />
        <InputGroupAddon>
          <SearchIcon className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        </InputGroupAddon>
      </InputGroup>
    </div>
  )
}

function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
        className
      )}
      {...props}
    />
  )
}

function CommandEmpty({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className={cn("py-6 text-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function CommandGroup({
  className,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Group>) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "overflow-hidden p-1 text-foreground **:[[cmdk-group-heading]]:px-2 **:[[cmdk-group-heading]]:py-1.5 **:[[cmdk-group-heading]]:text-xs **:[[cmdk-group-heading]]:font-medium **:[[cmdk-group-heading]]:text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

/**
 * cmdk 의 Separator 는 role="separator" 를 강제한다. listbox 안의 separator 는
 * ARIA 허용 자식이 아니라(axe aria-required-children) 장식 div 로 대신 그린다.
 * 검색어가 있으면 숨는 cmdk 동작은 useCommandState 로 그대로 따른다.
 */
function CommandSeparator({
  className,
  alwaysRender = false,
  ...props
}: React.ComponentProps<"div"> & { alwaysRender?: boolean }) {
  const searching = useCommandState((state) => state.search !== "")
  if (searching && !alwaysRender) return null
  return (
    <div
      data-slot="command-separator"
      role="none"
      className={cn("-mx-1 h-px bg-border", className)}
      {...props}
    />
  )
}

function CommandItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "group/command-item relative flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:text-mute data-selected:bg-accent data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
        className
      )}
      {...props}
    >
      {children}
      <CheckIcon className="ml-auto opacity-0 group-has-data-[slot=command-shortcut]/command-item:hidden group-data-[checked=true]/command-item:opacity-100" />
    </CommandPrimitive.Item>
  )
}

function CommandShortcut({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "ml-auto text-xs text-muted-foreground group-data-selected/command-item:text-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
