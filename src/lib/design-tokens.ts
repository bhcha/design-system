export const THEME_COLOR = "#ffffff"; // globals.css `--color-background` (design.md {colors.canvas}) — body 배경

/*
 * globals.css 토큰의 JS 미러 — **유일하게 허용된 예외 파일**이다.
 *
 * 원칙은 "색·크기 리터럴은 globals.css 안에만 존재한다"이지만, 브라우저 크롬에
 * 전달되는 값(<meta name="theme-color">)처럼 CSS 로는 표현할 수 없는 자리가 있다.
 * 그런 값만 여기에 모으고, lint 가 이 파일 하나만 예외로 허용한다
 * (tools/design-system-lint 의 tokenMirror 옵션).
 *
 * 값을 바꿀 때는 반드시 globals.css 의 대응 토큰을 함께 바꾼다.
 * 이 설명이 파일 맨 앞에 있지 않은 것은 shadcn CLI 가 설치할 때 맨 앞 주석을 지우기 때문이다.
 */
