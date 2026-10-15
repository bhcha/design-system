# 요청과 문제 보고

이 디자인 시스템을 쓰다가 컴포넌트·토큰이 모자라거나 문제가 생기면
GitHub 이슈로 올린다. 저장소: https://github.com/bhcha/design-system

쓰는 쪽 화면에서 raw 요소나 임의 값으로 직접 해결하지 않는다.
lint 가 그런 코드를 막고, 막지 못하더라도 다음에 디자인 시스템을 받아 갈 때 어긋난다.

## 어떤 양식을 고르나

| 상황 | 양식 | 라벨 |
|---|---|---|
| 필요한 컴포넌트가 없다, 기존 컴포넌트에 variant·prop 이 필요하다 | 컴포넌트 요청 | `request:component` |
| 필요한 색·간격·곡률·서체 토큰이 없다, 값을 바꾸고 싶다 | 토큰 요청 | `request:token` |
| 컴포넌트·토큰·lint 가 잘못 동작한다, 모양이 `design.md` 와 다르다 | 문제 보고 | `bug` |

## 사람이 올릴 때

https://github.com/bhcha/design-system/issues/new/choose 에서 양식을 고르고 빈칸을 채운다.

## 에이전트가 올릴 때

`gh` CLI 로 올린다. 양식의 필수 항목을 본문에 같은 제목으로 적는다.

```bash
gh issue create --repo bhcha/design-system \
  --title "[컴포넌트] 단계 표시기에 오류 상태 추가" \
  --label request:component \
  --body "$(cat <<'EOF'
### 요청한 곳
atlas-web /onboarding (Claude Code 세션)

### 종류
기존 컴포넌트에 variant 추가

### 대상 컴포넌트
numbered-steps.tsx

### 필요한 이유
검증에 실패한 단계를 표시해야 하는데 지금은 완료·진행·대기 세 상태뿐이다.

### 원하는 모양과 동작
실패한 단계 번호를 status-danger 로 칠하고 aria-invalid 를 단다.

### 지금 쓰는 임시 방법
없음. 해당 단계 설명 글에 "실패"라고 적어 둠.
EOF
)"
```

- 토큰 요청은 `[토큰]`·`request:token`, 문제 보고는 `[문제]`·`bug` 로 바꾼다.
  각 양식의 항목은 `.github/ISSUE_TEMPLATE/` 에 있다.
- 같은 요청이 이미 있는지 먼저 찾는다: `gh issue list --repo bhcha/design-system --search "단계 표시기"`
- 올린 뒤에는 이슈 번호를 쓰는 쪽 작업 기록에 남기고, 임시 방법으로 계속 진행한다.

## 처리 과정

1. 이 저장소의 에이전트가 작업을 시작할 때 열린 이슈부터 처리한다(`AGENTS.md` 의 0번 규칙).
2. 정보가 모자라면 댓글로 묻고 `needs-info` 를 단다. 답이 오면 라벨을 뗀다.
3. 작업을 시작하면 `in-progress` 를 단다.
4. 커밋 메시지에 `Closes #번호` 를 넣어 main 에 들어가면 이슈가 닫힌다.
   닫을 때 어떤 컴포넌트·토큰·variant 로 해결했는지 댓글로 남긴다.
5. 받아들이지 않는 요청은 이유를 적고 `wontfix` 로 닫는다.
