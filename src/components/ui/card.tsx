import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * shadcn/ui card (base-nova, Base UI) — Ollama 테마. shadcn CLI 로 설치한 원본이다.
 *
 * 해부도
 *   Card·Header·Title·Description·Action·Content·Footer
 *
 * 토큰
 *   {component.pricing-card} 문법 — bg-card · ring-1 ring-border · rounded-xl(12px) · 그림자 없음
 *
 * 상태
 *   render: <article>·<section>·<figure> 를 카드 자체로 쓴다(서버 컴포넌트 안전, 훅 없음).
 *   variant default(hairline) / dark(반전) / flat(level 0) / muted(soft surface) · size sm / default / lg(32px — pricing-card)
 *
 * 키보드·ARIA
 *   시맨틱 없음 — 호출부가 section/article 을 정한다
 *
 * 수용 기준
 *   - 그림자가 없다
 *   - 색·곡률·크기는 globals.css 의 shadcn 시맨틱 토큰에서만 나온다.
 */

const cardVariants = cva(
  "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-xl py-(--card-spacing) text-sm [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=lg]:[--card-spacing:--spacing(8)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
  {
    variants: {
      variant: {
        // design.md Elevation level 1 — 1px hairline
        default: "bg-card text-card-foreground ring-1 ring-border",
        // design.md Elevation level 2 — 반전된 어두운 면 (pricing-card-dark · cta-strip-dark)
        dark: "bg-surface-dark text-on-dark ring-1 ring-surface-dark",
        // design.md Elevation level 0 — 테두리·그림자 없음
        flat: "bg-card text-card-foreground",
        // soft surface 위의 묶음 면 (설치 명령 pill 배경과 같은 #fafafa)
        muted: "bg-muted text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type CardProps = React.ComponentProps<"div"> &
  VariantProps<typeof cardVariants> & {
    size?: "default" | "sm" | "lg";
    /**
     * 카드 자체가 될 엘리먼트 — `<article>` · `<section>` · `<figure>` 처럼 의미가 있는
     * 태그를 카드로 쓸 때. 예: `<Card render={<article aria-labelledby="x" />}>`.
     * Base UI 의 render 와 같은 모양이지만 훅을 쓰지 않아 서버 컴포넌트에서도 동작한다.
     */
    render?: React.ReactElement<Record<string, unknown>>;
  };

function Card({
  className,
  size = "default",
  variant = "default",
  render,
  ...props
}: CardProps) {
  const cardProps = {
    "data-slot": "card",
    "data-size": size,
    "data-variant": variant,
    ...props,
    className: cn(
      cardVariants({ variant }),
      render ? (render.props.className as string | undefined) : undefined,
      className,
    ),
  };
  if (render) {
    return React.cloneElement(render, { ...render.props, ...cardProps });
  }
  return <div {...cardProps} />;
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      className={cn(
        "text-base font-medium group-data-[size=sm]/card:text-sm",
        className,
      )}
      {...props}
    />
  );
}

function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      className={cn("text-sm text-muted-foreground group-data-[variant=dark]/card:text-on-dark-mute", className)}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      className={cn("px-(--card-spacing)", className)}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      className={cn(
        "flex items-center rounded-b-xl border-t border-border p-(--card-spacing) group-data-[variant=dark]/card:border-on-dark-border",
        className,
      )}
      {...props}
    />
  );
}

export {
  Card,
  cardVariants,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};
