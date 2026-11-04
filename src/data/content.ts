// Dados que não dependem de idioma: cores, imagens, links e posição de cada tela.
// Os textos ficam em messages/pt-BR.json, messages/en.json e messages/extra.*.json.

export const COMPANY_IDS = ["m3code", "tsmtools", "toolservices"] as const;
export type CompanyId = (typeof COMPANY_IDS)[number];

export const COMPANY: Record<
  CompanyId,
  {
    color: string;
    site: string;
    siteLabel: string;
    hero: string;
    logoWhite: string;
    logoBlack: string;
    modules: { id: string; img: string }[];
    socials: { label: string; url: string }[];
  }
> = {
  m3code: {
    color: "#2fa8d0",
    site: "https://www.m3code.com.br",
    siteLabel: "m3code.com.br",
    hero: "/img/m3-computer.png",
    logoWhite: "/logos/m3code.png",
    logoBlack: "/logos/m3code-black.png",
    modules: [
      { id: "sob_demanda", img: "/img/m3-people2.png" },
      { id: "industria", img: "/img/m3-ind40.jpg" },
      { id: "nfe", img: "/img/m3-people.png" },
      { id: "legados", img: "/img/m3-legacy.jpg" },
    ],
    socials: [
      { label: "Instagram", url: "https://www.instagram.com/m3.code/" },
      { label: "LinkedIn", url: "https://www.linkedin.com/company/m3code" },
      { label: "Facebook", url: "https://www.facebook.com/m3code" },
    ],
  },
  tsmtools: {
    color: "#e0a23a",
    site: "https://www.tsmtools.com.br",
    siteLabel: "tsmtools.com.br",
    hero: "/img/tsm-about.jpg",
    logoWhite: "/logos/tsmtools.png",
    logoBlack: "/logos/tsmtools-black.png",
    modules: [
      { id: "desenvolvimento", img: "/img/tsm-ind2.jpg" },
      { id: "fabricacao", img: "/img/tsm-ind3.jpg" },
      { id: "recondicionamento", img: "/img/tsm-ind4.jpg" },
      { id: "engenharia", img: "/img/tsm-ind5.jpg" },
    ],
    socials: [], // TODO: { label: 'Instagram', url: '...' }
  },
  toolservices: {
    color: "#5fb97a",
    site: "https://toolservices.com.br",
    siteLabel: "toolservices.com.br",
    hero: "/img/ts-hero.jpg",
    logoWhite: "/logos/toolservices.png",
    logoBlack: "/logos/toolservices-black.png",
    modules: [
      { id: "logistica", img: "/img/ts-sol1.jpg" },
      { id: "presetting", img: "/img/ts-sol2.jpg" },
      { id: "recondicionamento", img: "/img/ts-sol3.jpg" },
      { id: "suporte", img: "/img/ts-sol4.jpg" },
    ],
    socials: [
  { label: "Instagram", url: "https://www.instagram.com/toolservices/" },
  { label: "LinkedIn", url: "https://www.linkedin.com/company/tool-services-ferramentas/" },
  { label: "Facebook", url: "https://www.facebook.com/profile.php?id=61578150215695" },
],
  },
};

export const CONTACT = { phone: "(12) 3931-6700" };
export const WELCOME_PHOTO = "/img/welcome.jpg";

// Fotos em alta resolução (opcional): salve em public/img/hd/<empresa>-<módulo>.jpg
// (ex.: tsmtools-engenharia.jpg) ou public/img/hd/<empresa>-hero.jpg. Se existir, é usada no lugar da foto do site.
export const hd = (company: string, key: string) =>
  `/img/hd/${company}-${key}.jpg`;

/* ---------- clientes e parceiros (nomes de marca, iguais em qualquer idioma) ---------- */
// m3code: lista tirada da seção de clientes do m3code.com.br.
// tsmtools / toolservices: os sites só mostram logos (sem texto), então estes nomes são os que você citou.
// TODO: complete as listas abaixo com os demais logos de parceiros.
export const PARTNERS: Record<CompanyId, string[]> = {
  m3code: [
    "Segmento Farma Editores",
    "Divermídia",
    "JS Gráfica e Editora",
    "GS Security Paper",
    "Goldpress",
    "Ultraterm",
    "Evisys",
    "T-nax",
    "Tool Services",
    "TSM Tools",
  ],
  tsmtools: [
    "Cummins",
    "Sandvik Coromant",
    "T-nax",
    "Embraer",
    "Kennametal",
    "Globo",
    "Seco Tools",
    "Walter",
    "Dormer Pramet",
    "Liebherr",
    "Scania",
    "Netzsch",
    "General Motors",
    "Andri Tools",
  ],
  toolservices: ["Cummins", "Sandvik Coromant", "T-nax"],
};
// Faixa da tela "O que fazemos": 13 nomes da lista da TSM Tools (mesmo resultado da sua versão de teste).
// Para mostrar todos os parceiros de todas as empresas, troque por:
//   Array.from(new Set(COMPANY_IDS.flatMap((c) => PARTNERS[c])))
export const ALL_PARTNERS = PARTNERS.tsmtools.slice(0, 13);

/* ---------- árvore de telas ---------- */
export type Kind =
  | "home"
  | "about"
  | "company"
  | "module"
  | "what"
  | "service"
  | "social"
  | "overview";
export type NodeInfo = {
  id: string;
  kind: Kind;
  parent?: string;
  box?: { x: number; y: number; w: number }; // posição dentro do slide do pai (1920x1080); altura = w * 9/16
  at?: { cx: number; cy: number }; // posição no canvas (só para telas raiz)
  company?: CompanyId;
  module?: string;
};

// Modo totem (tela em pé 1080x1920) ou normal (1920x1080). Escolha salva no navegador pelo botão da barra superior.
// Também dá para forçar pela URL: /?modo=totem ou /?modo=normal. Sem escolha salva, vale a orientação da janela.
function readTotem(): boolean {
  if (typeof window === "undefined") return false; // renderização no servidor: o canvas só aparece depois de montar
  try {
    const q = new URLSearchParams(location.search).get("modo");
    if (q === "totem" || q === "normal") localStorage.setItem("mode", q);
    const saved = localStorage.getItem("mode");
    if (saved === "totem" || saved === "normal") return saved === "totem";
  } catch {}
  return window.innerHeight > window.innerWidth;
}
export const TOTEM = readTotem();
export const SLIDE = TOTEM ? { w: 1080, h: 1920 } : { w: 1920, h: 1080 };

const ABOUT_BOXES = TOTEM
  ? [
      { x: 70, y: 1230, w: 300 },
      { x: 390, y: 1230, w: 300 },
      { x: 710, y: 1230, w: 300 },
    ]
  : [
      { x: 120, y: 690, w: 520 },
      { x: 700, y: 690, w: 520 },
      { x: 1280, y: 690, w: 520 },
    ];
// Ordem em "O que fazemos": peças, gerenciamento, software.
const WHAT_ORDER: CompanyId[] = ["tsmtools", "toolservices", "m3code"];
const WHAT_BOXES = TOTEM
  ? [
      { x: 70, y: 1010, w: 300 },
      { x: 390, y: 1010, w: 300 },
      { x: 710, y: 1010, w: 300 },
    ]
  : [
      { x: 60, y: 390, w: 560 },
      { x: 680, y: 390, w: 560 },
      { x: 1300, y: 390, w: 560 },
    ];
const MODULE_BOXES = TOTEM
  ? [
      { x: 70, y: 1250, w: 222 },
      { x: 309, y: 1250, w: 222 },
      { x: 548, y: 1250, w: 222 },
      { x: 787, y: 1250, w: 222 },
    ]
  : [
      { x: 900, y: 330, w: 420 },
      { x: 1360, y: 330, w: 420 },
      { x: 900, y: 606, w: 420 },
      { x: 1360, y: 606, w: 420 },
    ];

export const NODES: NodeInfo[] = [
  { id: "home", kind: "home", at: { cx: 0, cy: 0 } },
  {
    id: "about",
    kind: "about",
    at: TOTEM ? { cx: 1900, cy: 100 } : { cx: 2700, cy: 250 },
  },
  {
    id: "what",
    kind: "what",
    at: TOTEM ? { cx: 1700, cy: 2350 } : { cx: 2300, cy: 2150 },
  },
  {
    id: "social",
    kind: "social",
    at: TOTEM ? { cx: -300, cy: 2500 } : { cx: -300, cy: 2250 },
  },
  {
    id: "overview",
    kind: "overview",
    at: TOTEM ? { cx: -2300, cy: 1200 } : { cx: -2700, cy: 1150 },
  },
  ...COMPANY_IDS.map(
    (c, i): NodeInfo => ({
      id: c,
      kind: "company",
      parent: "about",
      box: ABOUT_BOXES[i],
      company: c,
    }),
  ),
  ...COMPANY_IDS.flatMap((c) =>
    COMPANY[c].modules.map(
      (m, i): NodeInfo => ({
        id: `${c}.${m.id}`,
        kind: "module",
        parent: c,
        box: MODULE_BOXES[i],
        company: c,
        module: m.id,
      }),
    ),
  ),
  // Telas "O que fazemos + clientes e parceiros", dentro de "what".
  ...WHAT_ORDER.map(
    (c, i): NodeInfo => ({
      id: `what.${c}`,
      kind: "service",
      parent: "what",
      box: WHAT_BOXES[i],
      company: c,
    }),
  ),
];

export const BY_ID: Record<string, NodeInfo> = Object.fromEntries(
  NODES.map((n) => [n.id, n]),
);
export const CHILDREN: Record<string, NodeInfo[]> = {};
NODES.forEach((n) => n.parent && (CHILDREN[n.parent] ||= []).push(n));

export type WRect = {
  cx: number;
  cy: number;
  w: number;
  h: number;
  s: number;
  left: number;
  top: number;
};
export const RECT: Record<string, WRect> = {};

function calc(id: string): WRect {
  if (RECT[id]) return RECT[id];
  const n = BY_ID[id];
  let r: WRect;
  if (!n.parent) {
    const { cx, cy } = n.at!;
    r = {
      cx,
      cy,
      w: SLIDE.w,
      h: SLIDE.h,
      s: 1,
      left: cx - SLIDE.w / 2,
      top: cy - SLIDE.h / 2,
    };
  } else {
    const p = calc(n.parent);
    const s = p.s * (n.box!.w / SLIDE.w);
    const left = p.left + n.box!.x * p.s;
    const top = p.top + n.box!.y * p.s;
    const w = SLIDE.w * s;
    const h = SLIDE.h * s;
    r = { cx: left + w / 2, cy: top + h / 2, w, h, s, left, top };
  }
  return (RECT[id] = r);
}
NODES.forEach((n) => calc(n.id));

// "Mapa": enquadra todas as telas raiz.
{
  const roots = NODES.filter((n) => !n.parent).map((n) => RECT[n.id]);
  const l = Math.min(...roots.map((r) => r.left)) - 200;
  const t = Math.min(...roots.map((r) => r.top)) - 200;
  const rt = Math.max(...roots.map((r) => r.left + r.w)) + 200;
  const b = Math.max(...roots.map((r) => r.top + r.h)) + 200;
  RECT.map = {
    cx: (l + rt) / 2,
    cy: (t + b) / 2,
    w: rt - l,
    h: b - t,
    s: 1,
    left: l,
    top: t,
  };
}

export const rootOf = (id: string): string => {
  let n = BY_ID[id];
  while (n?.parent) n = BY_ID[n.parent];
  return n?.id ?? id;
};

// Sequência única: setas do teclado, roda do mouse e botões ‹ › percorrem TODAS as telas nesta ordem.
export const PATH = [
  "home",
  "about",
  ...COMPANY_IDS.flatMap((c) => [
    c,
    ...COMPANY[c].modules.map((m) => `${c}.${m.id}`),
  ]),
  "what",
  ...WHAT_ORDER.map((c) => `what.${c}`),
  "social",
  "overview",
];
export const SECTIONS = [
  "home",
  "about",
  "what",
  "social",
  "overview",
] as const;
