"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent,
} from "react";
import { useTranslations } from "next-intl";
import {
  BY_ID,
  CHILDREN,
  COMPANY,
  PATH,
  RECT,
  SECTIONS,
  rootOf,
  type Kind,
} from "@/data/content";
import { useApp } from "./Providers";
import Decor from "./Decor";
import { CardFace, Slide } from "./Slides";

type Cam = { x: number; y: number; k: number }; // (x,y) = ponto do mundo no centro da tela
type Vp = { w: number; h: number };

const NAV_H = 120; // altura reservada para a barra de navegação
const MAX_K = 60; // as telas aninhadas ficam pequenas no mundo, então o zoom máximo é alto
const IDLE_MS = 90_000; // volta ao início após 90 s sem toque

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

function fit(id: string, vp: Vp): Cam {
  const r = RECT[id];
  const k = Math.min(vp.w / r.w, (vp.h - NAV_H) / r.h) * 0.94;
  return { k, x: r.cx, y: r.cy + NAV_H / 2 / k };
}

function zoomAt(c: Cam, sx: number, sy: number, vp: Vp, k2: number): Cam {
  const k = clamp(k2, fit("map", vp).k * 0.7, MAX_K);
  const wx = c.x + (sx - vp.w / 2) / c.k;
  const wy = c.y + (sy - vp.h / 2) / c.k;
  return { k, x: wx - (sx - vp.w / 2) / k, y: wy - (sy - vp.h / 2) / k };
}

export default function PreziCanvas() {
  const u = useTranslations("ui");
  const { locale, theme, toggleLocale, toggleTheme } = useApp();

  const [vp, setVp] = useState<Vp>({ w: 1920, h: 1080 });
  const [cam, setCam] = useState<Cam>({ x: 0, y: 0, k: 1 });
  const [dur, setDur] = useState(0); // duração da transição em ms (0 = sem animação)
  const [current, setCurrent] = useState("home");

  const stage = useRef<HTMLDivElement>(null);
  const camRef = useRef(cam);
  const curRef = useRef(current);
  const lastNode = useRef("home"); // última tela real visitada (o "mapa" não conta)
  const lockRef = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const lastTouch = useRef(0); // preenchido no useEffect (Date.now() no render quebra o prerender do Next 16)
  const lastStep = useRef(0);
  const lastKey = useRef(0);
  const ptrs = useRef(new Map<number, { x: number; y: number }>());
  const g = useRef({ moved: 0, multi: false, dist: 0, mid: { x: 0, y: 0 } });

  camRef.current = cam;
  curRef.current = current;

  useEffect(() => {
    const onResize = () =>
      setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Reajusta o enquadramento atual quando a janela muda de tamanho.
  useEffect(() => {
    setDur(0);
    setCam(fit(curRef.current, vp));
  }, [vp]);

  // Voo estilo Prezi: se o destino é longe, afasta a câmera e depois aproxima.
  const flyTo = useCallback(
    (id: string) => {
      lastTouch.current = Date.now();
      if (id !== "map") lastNode.current = id;
      timers.current.forEach(clearTimeout);
      timers.current = [];
      const from = camRef.current;
      const to = fit(id, vp);
      const far =
        Math.hypot(to.x - from.x, to.y - from.y) * Math.min(from.k, to.k) >
        vp.w * 0.8;
      lockRef.current = true;
      setCurrent(id);
      if (!far) {
        setDur(1100);
        setCam(to);
        timers.current.push(setTimeout(() => (lockRef.current = false), 1150));
        return;
      }
      setDur(750);
      setCam({
        x: (from.x + to.x) / 2,
        y: (from.y + to.y) / 2,
        k: Math.min(from.k, to.k) * 0.4,
      });
      timers.current.push(
        setTimeout(() => {
          setDur(950);
          setCam(to);
        }, 700),
        setTimeout(() => (lockRef.current = false), 1700),
      );
    },
    [vp],
  );
  const flyRef = useRef(flyTo);
  flyRef.current = flyTo;

  // Anterior / próximo seguem PATH (todas as telas, em ordem). Partindo de qualquer tela, inclusive
  // uma escolhida com clique, o passo é sempre relativo à posição dela na sequência.
  const step = useCallback((dir: 1 | -1, wrap = true) => {
    const cur = curRef.current === "map" ? lastNode.current : curRef.current;
    const i = Math.max(0, PATH.indexOf(cur));
    const next = i + dir;
    if (!wrap && (next < 0 || next >= PATH.length)) return;
    flyRef.current(PATH[(next + PATH.length) % PATH.length]);
  }, []);

  // Modo quiosque: volta ao início quando ninguém toca na tela.
  useEffect(() => {
    const touch = () => (lastTouch.current = Date.now());
    touch();
    // Fase de captura: os botões da barra usam stopPropagation e, sem isso, o toque neles não contaria.
    window.addEventListener("pointerdown", touch, true);
    window.addEventListener("wheel", touch, true);
    window.addEventListener("keydown", touch, true);
    const t = setInterval(() => {
      const home = fit("home", vp);
      const c = camRef.current;
      const away =
        curRef.current !== "home" ||
        Math.abs(c.k - home.k) > 0.001 ||
        Math.abs(c.x - home.x) > 1;
      if (away && !lockRef.current && Date.now() - lastTouch.current > IDLE_MS)
        flyRef.current("home");
    }, 5000);
    return () => {
      window.removeEventListener("pointerdown", touch, true);
      window.removeEventListener("wheel", touch, true);
      window.removeEventListener("keydown", touch, true);
      clearInterval(t);
    };
  }, [vp]);

  /* ---------- teclado: setas / PageUp / PageDown andam na sequência, Home e End vão às pontas ---------- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const fwd =
        e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown";
      const back =
        e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp";
      if (!fwd && !back && e.key !== "Home" && e.key !== "End") return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastKey.current < 350) return;
      lastKey.current = now;
      if (e.key === "Home") flyRef.current(PATH[0]);
      else if (e.key === "End") flyRef.current(PATH[PATH.length - 1]);
      else step(fwd ? 1 : -1, false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  /* ---------- roda do mouse: muda de tela. Ctrl + roda (ou pinça no trackpad) dá zoom livre ---------- */
  const wheelRef = useRef<(e: WheelEvent) => void>(() => {});
  wheelRef.current = (e) => {
    if (lockRef.current) return;
    if (e.ctrlKey) {
      setDur(0);
      setCam((c) =>
        zoomAt(c, e.clientX, e.clientY, vp, c.k * Math.exp(-e.deltaY * 0.01)),
      );
      return;
    }
    const now = Date.now();
    if (Math.abs(e.deltaY) < 8 || now - lastStep.current < 1300) return;
    lastStep.current = now;
    step(e.deltaY > 0 ? 1 : -1, false); // na roda do mouse não volta ao início ao chegar no fim
  };
  useEffect(() => {
    const el = stage.current!;
    const h = (e: WheelEvent) => {
      e.preventDefault();
      wheelRef.current(e);
    };
    el.addEventListener("wheel", h, { passive: false });
    return () => el.removeEventListener("wheel", h);
  }, []);

  /* ---------- toque e arrasto ---------- */
  const onDown = (e: PointerEvent) => {
    if (lockRef.current) return;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    setDur(0);
    if (ptrs.current.size === 1)
      g.current = { ...g.current, moved: 0, multi: false };
    if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      g.current.multi = true;
      g.current.dist = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      g.current.mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
    }
  };

  const onMove = (e: PointerEvent) => {
    const prev = ptrs.current.get(e.pointerId);
    if (!prev || lockRef.current) return;
    ptrs.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (ptrs.current.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      g.current.moved += Math.abs(dx) + Math.abs(dy);
      setCam((c) => ({ ...c, x: c.x - dx / c.k, y: c.y - dy / c.k }));
    } else if (ptrs.current.size === 2) {
      const [a, b] = [...ptrs.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
      const { dist, mid: m0 } = g.current;
      setCam((c) => {
        const panned = {
          ...c,
          x: c.x - (mid.x - m0.x) / c.k,
          y: c.y - (mid.y - m0.y) / c.k,
        };
        return zoomAt(panned, mid.x, mid.y, vp, panned.k * (d / dist));
      });
      g.current.dist = d;
      g.current.mid = mid;
    }
  };

  const onUp = (e: PointerEvent, cancelled = false) => {
    if (!ptrs.current.has(e.pointerId)) return;
    ptrs.current.delete(e.pointerId);
    if (ptrs.current.size > 0 || cancelled) return;
    // Toque curto sem arrastar: procura um elemento com data-fly.
    if (!g.current.multi && g.current.moved < 12) {
      const el = document
        .elementFromPoint(e.clientX, e.clientY)
        ?.closest<HTMLElement>("[data-fly]");
      if (el?.dataset.fly) flyTo(el.dataset.fly);
    }
  };

  /* ---------- render ---------- */
  const grid = clamp(160 * cam.k, 40, 400);
  const active = current === "map" ? "" : rootOf(current);
  const stop = (e: PointerEvent) => e.stopPropagation();

  return (
    <div
      ref={stage}
      className="stage"
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={(e) => onUp(e, true)}
      style={{
        backgroundSize: `${grid}px ${grid}px`,
        backgroundPosition: `${vp.w / 2 - cam.x * cam.k}px ${vp.h / 2 - cam.y * cam.k}px`,
      }}
    >
      <div
        className="world"
        style={{
          transform: `translate(${vp.w / 2}px, ${vp.h / 2}px) scale(${cam.k}) translate(${-cam.x}px, ${-cam.y}px)`,
          transition: dur
            ? `transform ${dur}ms cubic-bezier(.65,0,.25,1)`
            : "none",
        }}
      >
        <Decor />
        {["home", "about", "what", "social", "overview"].map((id) => (
          <NodeView key={id} id={id} cam={cam} vp={vp} />
        ))}
      </div>

      <div className="tools" onPointerDown={stop}>
        <button onClick={toggleLocale} aria-label={u("language")}>
          {locale === "pt-BR" ? "EN" : "PT"}
        </button>
        <button
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            toggleTheme({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
          aria-label={u("theme")}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>

      <nav className="nav" onPointerDown={stop}>
        <button
          className="arrow"
          onClick={() => step(-1)}
          aria-label={u("prev")}
        >
          ‹
        </button>
        <i className="sep" />
        {SECTIONS.map((s) => (
          <button
            key={s}
            className={active === s ? "on" : ""}
            onClick={() => flyTo(s)}
          >
            {u(s)}
          </button>
        ))}
        <i className="sep" />
        <button
          className={current === "map" ? "on" : ""}
          onClick={() => flyTo("map")}
        >
          {u("map")}
        </button>
        <i className="sep" />
        <button
          className="arrow"
          onClick={() => step(1)}
          aria-label={u("next")}
        >
          ›
        </button>
      </nav>
    </div>
  );
}

/* Cada tela é um slide 1920x1080. Telas filhas ficam dentro do slide do pai, reduzidas,
   e aparecem (fade) quando a câmera se aproxima delas. */
function NodeView({ id, cam, vp }: { id: string; cam: Cam; vp: Vp }) {
  const n = BY_ID[id];
  const r = RECT[id];
  const kids = CHILDREN[id] ?? [];
  const root = !n.parent;
  const box = n.box;
  const p = root ? 1 : clamp((cam.k * r.w) / vp.w - 0.3, 0, 0.25) / 0.25;
  const outer = root
    ? { left: r.left, top: r.top, width: 1920, height: 1080 }
    : { left: box!.x, top: box!.y, width: box!.w, height: (box!.w * 9) / 16 };
  const color = n.company ? COMPANY[n.company].color : undefined;

  return (
    <div
      className={root ? "node root" : "node"}
      style={{
        ...outer,
        opacity: p,
        visibility: p > 0 ? "visible" : "hidden",
        pointerEvents: p > 0.9 ? "auto" : "none",
        ["--c" as string]: color,
      }}
    >
      <div
        className="inner"
        style={{ transform: `scale(${root ? 1 : box!.w / 1920})` }}
      >
        <Slide id={id} />
        {kids.map((k) => (
          <div
            key={"card-" + k.id}
            className={`card ${k.kind}`}
            data-fly={k.id}
            style={{
              left: k.box!.x,
              top: k.box!.y,
              width: k.box!.w,
              height: (k.box!.w * 9) / 16,
              ["--c" as string]: COMPANY[k.company!].color,
            }}
          >
            <CardFace node={k} />
          </div>
        ))}
        {kids.map((k) => (
          <NodeView key={k.id} id={k.id} cam={cam} vp={vp} />
        ))}
      </div>
    </div>
  );
}

export type { Kind };
