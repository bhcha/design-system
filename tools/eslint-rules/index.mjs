/**
 * 드리프트 방지 규칙 (디자인 시스템 로컬 ESLint 플러그인).
 *
 * 목적은 "화면마다 같은 것을 다시 만드는" 경로를 문법 수준에서 막는 것이다.
 * 스타일 값은 globals.css 의 토큰에서만 나오고, 화면은 components/ui 조립만 한다.
 *
 * 규칙
 *   no-arbitrary-class : Tailwind 임의값 `x-[...]` 금지. var(--토큰) 참조만 허용.
 *   no-style-literal   : 코드 안의 hex/rgb/hsl 색과 px 크기 리터럴 금지.
 *   ui-only-elements   : app/·features/ 에서 raw 컨트롤 엘리먼트 직접 사용 금지.
 *   no-surface-styling : app/·features/ 에서 raw 엘리먼트(+ next/link Link)에 면(배경·테두리·곡률·그림자·링)을
 *                        직접 입혀 "컴포넌트를 따로 만드는" 것을 금지. 레이아웃·간격·글자는 허용.
 *   density-via-component : app/·features/ 에서 밀도를 바꿀 때 data-ui-density 를 직접 달거나
 *                        scale·zoom 으로 화면을 줄이지 않는다. components/ui 의 Density 를 쓴다.
 */

/** `bg-[#fff]` `text-[13px]` `w-[calc(100%-2px)]` 같은 임의값. `[var(--x)]` 는 허용. */
const ARBITRARY_CLASS = /(?:^|[\s:])(-?[a-z][a-z0-9-]*-)\[([^\]]+)\]/g;

/**
 * 대괄호 안이 디자인 값이 아니라 선택자·조건인 변형(variant)들.
 * `data-[state=open]` 처럼 구조를 가리키므로 임의값 금지 대상이 아니다.
 */
const STRUCTURAL_VARIANTS = new Set([
  "data-",
  "aria-",
  "has-",
  "not-",
  "in-",
  "supports-",
  "group-data-",
  "peer-data-",
  "group-aria-",
  "peer-aria-",
]);

/** 색 리터럴: #rgb #rrggbb #rrggbbaa, rgb()/rgba()/hsl()/hsla()/oklch()/lab() 등. */
const COLOR_LITERAL =
  /(#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b)|((?:rgba?|hsla?|hwb|lab|lch|oklab|oklch)\s*\()/i;

/** 크기 리터럴: 12px, 1.5rem, 2em 등. 0 은 단위가 붙지 않으므로 걸리지 않는다. */
const SIZE_LITERAL = /(?:^|[\s(:,])-?\d*\.?\d+(?:px|rem|em)\b/;

/** 화면 파일에서 직접 쓰면 안 되는 엘리먼트 — components/ui 의 컴포넌트로 대체한다. */
const RAW_ELEMENTS = new Set([
  "button",
  "input",
  "select",
  "textarea",
  "table",
  "dialog",
  "details",
  "summary",
  "a",
  "label",
  "hr",
]);

/** 면을 만드는 유틸리티 — 컴포넌트가 소유한다. 화면은 레이아웃·간격·글자만 정한다. */
const SURFACE_CLASS =
  /(?:^|[\s:])(bg-(?!clip|blend|fixed|local|scroll|repeat|no-repeat|cover|contain|center|top|bottom|left|right)[a-z0-9-]+(?:\/\d+)?|border(?:-[trblxyse])?(?:-[a-z0-9-]+)?|rounded(?:-[a-z0-9-]+)?|ring(?:-[a-z0-9-]+)?|shadow(?:-[a-z0-9-]+)?|outline(?:-[a-z0-9-]+)?)(?=$|\s)/;

/** className 으로 취급할 JSX 속성. */
const CLASS_ATTRS = new Set(["className", "class"]);

function isClassAttribute(node) {
  let current = node;
  while (current) {
    if (
      current.type === "JSXAttribute" &&
      current.name?.type === "JSXIdentifier" &&
      CLASS_ATTRS.has(current.name.name)
    ) {
      return true;
    }
    // cn("...", cond && "...") 같은 헬퍼 호출 안쪽도 className 취급한다.
    if (
      current.type === "CallExpression" &&
      current.callee?.type === "Identifier" &&
      (current.callee.name === "cn" || current.callee.name === "cva")
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

/** `style={{ ... }}` 안쪽인지. 크기 리터럴은 이 문맥에서만 위반이다. */
function isStyleContext(node) {
  let current = node;
  while (current) {
    if (
      current.type === "JSXAttribute" &&
      current.name?.type === "JSXIdentifier" &&
      current.name.name === "style"
    ) {
      return true;
    }
    current = current.parent;
  }
  return false;
}

function stringPieces(node) {
  if (node.type === "Literal" && typeof node.value === "string") {
    return [{ text: node.value, node }];
  }
  if (node.type === "TemplateElement") {
    return [{ text: node.value.cooked ?? node.value.raw, node }];
  }
  return [];
}

const noArbitraryClass = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Tailwind 임의값을 금지한다. 값은 globals.css 의 토큰에서만 나온다.",
    },
    schema: [],
    messages: {
      arbitrary:
        "Tailwind 임의값 `{{ raw }}` 은 쓸 수 없다. globals.css 에 토큰을 추가하고 그 유틸리티를 쓰거나, 꼭 필요하면 `[var(--토큰)]` 형태로만 참조한다.",
    },
  },
  create(context) {
    function check(node) {
      if (!isClassAttribute(node)) return;
      for (const piece of stringPieces(node)) {
        ARBITRARY_CLASS.lastIndex = 0;
        let match;
        while ((match = ARBITRARY_CLASS.exec(piece.text)) !== null) {
          const prefix = match[1];
          const inner = match[2].trim();
          if (STRUCTURAL_VARIANTS.has(prefix)) continue;
          if (inner.startsWith("var(--")) continue;
          context.report({
            node: piece.node,
            messageId: "arbitrary",
            data: { raw: match[0].trim() },
          });
        }
      }
    }
    return { Literal: check, TemplateElement: check };
  },
};

const noStyleLiteral = {
  meta: {
    type: "problem",
    docs: {
      description:
        "코드 안의 색·크기 리터럴을 금지한다. globals.css 가 유일한 출처다.",
    },
    schema: [],
    messages: {
      color:
        "색 리터럴 `{{ raw }}` 은 쓸 수 없다. globals.css 의 색 토큰을 쓴다.",
      size: "크기 리터럴 `{{ raw }}` 은 쓸 수 없다. globals.css 의 크기 토큰이나 spacing 유틸리티를 쓴다.",
    },
  },
  create(context) {
    function check(node) {
      for (const piece of stringPieces(node)) {
        // 색 리터럴은 어디에 있든 유출이다.
        const colorMatch = COLOR_LITERAL.exec(piece.text);
        if (colorMatch) {
          context.report({
            node: piece.node,
            messageId: "color",
            data: { raw: colorMatch[0] },
          });
          continue;
        }
        // 크기 리터럴은 스타일을 만드는 자리에서만 위반이다.
        // 문서·라벨 문구에 "14px" 이 나오는 것은 설명이지 스타일이 아니다.
        if (!isStyleContext(node) && !isClassAttribute(node)) continue;
        const sizeMatch = SIZE_LITERAL.exec(piece.text);
        if (sizeMatch) {
          context.report({
            node: piece.node,
            messageId: "size",
            data: { raw: sizeMatch[0].trim() },
          });
        }
      }
    }
    return { Literal: check, TemplateElement: check };
  },
};

const uiOnlyElements = {
  meta: {
    type: "problem",
    docs: {
      description:
        "화면 파일에서 raw 컨트롤 엘리먼트를 직접 쓰지 않는다. components/ui 만 조립한다.",
    },
    schema: [],
    messages: {
      raw: "`<{{ name }}>` 을 화면에서 직접 쓰지 않는다. components/ui 의 대응 컴포넌트(Button · Input · NativeSelect · Textarea · Table · ModalDialog · Collapsible · TextLink · ButtonLink · Label · Separator)를 쓰고, 없으면 화면에서 만들지 말고 components/ui 에 추가한다.",
    },
  },
  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name?.type !== "JSXIdentifier") return;
        if (!RAW_ELEMENTS.has(node.name.name)) return;
        context.report({
          node: node.name,
          messageId: "raw",
          data: { name: node.name.name },
        });
      },
    };
  },
};

/**
 * 모양을 갖지 않는 "날것" 엘리먼트인지 — raw DOM 엘리먼트(소문자)와 프레임워크 링크.
 * next/link 의 Link 는 <a> 를 그리는 이동 장치일 뿐 디자인 시스템 컴포넌트가 아니다.
 * 여기에 면을 입히면 손으로 만든 버튼·카드가 된다(ButtonLink · Item render={<Link/>} 를 쓴다).
 */
const RAW_COMPONENTS = new Set(["Link"]);

function isRawElement(opening) {
  if (opening?.type !== "JSXOpeningElement" || opening.name?.type !== "JSXIdentifier") {
    return false;
  }
  const name = opening.name.name;
  return /^[a-z]/.test(name) || RAW_COMPONENTS.has(name);
}

const noSurfaceStyling = {
  meta: {
    type: "problem",
    docs: {
      description:
        "화면 코드가 raw 엘리먼트에 면(배경·테두리·곡률·그림자·링)을 입혀 컴포넌트를 따로 만드는 것을 금지한다.",
    },
    schema: [],
    messages: {
      surface:
        "`<{{ name }}>` 에 `{{ raw }}` 로 면을 직접 만들고 있다. 이것은 디자인 시스템 밖의 새 컴포넌트다. components/ui 의 컴포넌트(Card · Badge · Item · Alert · Empty · Separator · 링크는 ButtonLink · Item render={<Link/>} …)를 쓰고, 맞는 것이 없으면 화면에서 만들지 말고 components/ui 에 컴포넌트나 variant 를 추가한다.",
    },
  },
  create(context) {
    return {
      JSXAttribute(node) {
        if (node.name?.type !== "JSXIdentifier" || !CLASS_ATTRS.has(node.name.name)) return;
        const opening = node.parent;
        if (!isRawElement(opening)) return;
        const texts = [];
        const visit = (n) => {
          if (!n || typeof n !== "object") return;
          if (n.type === "Literal" && typeof n.value === "string") texts.push(n);
          if (n.type === "TemplateElement") texts.push(n);
          for (const key of Object.keys(n)) {
            if (key === "parent") continue;
            const child = n[key];
            if (Array.isArray(child)) child.forEach(visit);
            else if (child && typeof child.type === "string") visit(child);
          }
        };
        visit(node.value);
        for (const piece of texts.flatMap(stringPieces)) {
          const match = SURFACE_CLASS.exec(piece.text);
          if (match) {
            context.report({
              node: piece.node,
              messageId: "surface",
              data: { name: opening.name.name, raw: match[1] },
            });
            return;
          }
        }
      },
    };
  },
};

/** 화면을 통째로 줄이는 변형 — 밀도를 흉내 낼 뿐 실제 크기·간격이 바뀌지 않는다. */
const SCALE_CLASS = /(?:^|[\s:])(-?scale(?:-[xyz])?-[a-z0-9./[\]()-]+|zoom(?:-[a-z0-9-]+)?)(?=$|\s)/;

const densityViaComponent = {
  meta: {
    type: "problem",
    docs: {
      description:
        "밀도(compact)는 components/ui 의 Density 로만 바꾼다. data-ui-density 직접 지정·scale·zoom 축소를 금지한다.",
    },
    schema: [],
    messages: {
      attribute:
        "`data-ui-density` 를 화면에서 직접 달지 않는다. `<Density value=\"compact\">` 로 감싼다 — 포털로 열린 대화상자·팝오버도 같은 밀도를 따른다.",
      scale:
        "`{{ raw }}` 로 화면을 축소해 밀도를 흉내 내지 않는다. 크기·간격 토큰을 바꾸는 `<Density value=\"compact\">` 를 쓴다.",
    },
  },
  create(context) {
    function check(node) {
      if (!isClassAttribute(node)) return;
      for (const piece of stringPieces(node)) {
        const match = SCALE_CLASS.exec(piece.text);
        if (match) {
          context.report({ node: piece.node, messageId: "scale", data: { raw: match[1] } });
        }
      }
    }
    return {
      JSXAttribute(node) {
        if (node.name?.type === "JSXIdentifier" && node.name.name === "data-ui-density") {
          context.report({ node, messageId: "attribute" });
        }
      },
      Literal: check,
      TemplateElement: check,
    };
  },
};

const plugin = {
  meta: { name: "discovery-guards", version: "2.0.0" },
  rules: {
    "no-arbitrary-class": noArbitraryClass,
    "no-style-literal": noStyleLiteral,
    "ui-only-elements": uiOnlyElements,
    "no-surface-styling": noSurfaceStyling,
    "density-via-component": densityViaComponent,
  },
};

export default plugin;
