/**
 * 가드가 실제로 작동하는지 증명하는 고정 샘플이다. **고치지 않는다.**
 *
 * `npm run check:guards` 가 이 파일에 대해 ESLint 를 돌려, 아래 EXPECTED 목록의
 * 규칙이 전부 실제로 보고되는지 확인한다. 규칙이 조용해지면 검사가 실패한다.
 *
 * EXPECTED
 *   guards/no-arbitrary-class  — 임의 색·크기·폭
 *   guards/no-style-literal    — hex 색 / px 크기 리터럴
 *   guards/ui-only-elements    — raw <button> / <input> / <table>
 */

// 설명 문구에 크기가 들어가는 것은 위반이 아니다 — 스타일을 만들지 않는다.
const DOC_TEXT = "본문은 14px 이다";

export function GuardViolations() {
  return (
    <div className="bg-[#ffffff] p-[7px] text-[13px] w-[calc(100%-2px)]">
      <div className="data-[state=open]:bg-surface" />
      <div className="text-[var(--text-body)]" />
      <p>{DOC_TEXT}</p>
      <span style={{ color: "#0066cc", fontSize: "13px" }} />
      <button type="button">raw button</button>
      <input aria-label="raw input" />
      <table>
        <tbody>
          <tr>
            <td>raw table</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
