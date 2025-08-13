// app/api/export/pdf/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { chromium, type Cookie } from "playwright";
import { PDFDocument } from "pdf-lib";

function parseCookieHeader(header: string, url: URL): Cookie[] {
  if (!header) return [];
  return header.split(";").map((pair) => {
    const i = pair.indexOf("=");
    const name = pair.slice(0, i).trim();
    const value = pair.slice(i + 1).trim();
    return {
      name,
      value,
      domain: url.hostname,
      path: "/",
      httpOnly: false,
      secure: url.protocol === "https:",
      sameSite: "Lax",
      expires: -1,
    };
  });
}

export async function POST(req: Request) {
  const { url: targetUrl, storage, width = 1440, dpr = 2 } = await req.json();
  const url = new URL(targetUrl ?? req.headers.get("referer")!);
  const cookieHeader = req.headers.get("cookie") ?? "";

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: dpr,
    userAgent: req.headers.get("user-agent") || undefined,
  });

  try {
    // cookies + storages da sessão do usuário
    const cookies = parseCookieHeader(cookieHeader, url);
    if (cookies.length) await context.addCookies(cookies);

    const page = await context.newPage();
    await page.addInitScript(
      ({ origin, local, session }) => {
        if (location.origin === origin) {
          try {
            Object.entries(local || {}).forEach(([k, v]) => localStorage.setItem(k, String(v)));
            Object.entries(session || {}).forEach(([k, v]) => sessionStorage.setItem(k, String(v)));
          } catch { }
        }
      },
      { origin: url.origin, local: storage?.local || {}, session: storage?.session || {} },
    );

    await page.goto(url.toString(), { waitUntil: "networkidle" });

    // mata overlay do Next + animações (só na captura)
    await page.addStyleTag({
      content: `
    [data-nextjs-toast], nextjs-portal, #__nextjs_dev_overlay, #__nextjs_error_overlay,
    #__nextjs-build-watcher, [aria-label="Next.js App Router Announcer"] { display:none!important }
    #export-root, #export-root * { animation:none!important; transition:none!important; }
  `,
    });

    // fontes prontas
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await page.waitForFunction(() => (document as any).fonts?.status === "loaded").catch(() => { });
    await page.waitForTimeout(50);

    const el =
  (await page.$("#export-root")) ??
  (await page.$("main")) ??
  (await page.$("body"));
if (!el) throw new Error("export-root não encontrado");
    if (!el) throw new Error("export-root não encontrado");

    // 1) SCROLL DE AQUECIMENTO: aciona observers/lazy/inView
    await page.evaluate(async (node: Element) => {
      const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
      const scrollables = new Set<HTMLElement>();
    
      // janela
      const docEl = document.scrollingElement as HTMLElement | null;
      if (docEl && docEl.scrollHeight > docEl.clientHeight) scrollables.add(docEl);
    
      // contêineres com overflow dentro do node
      node.querySelectorAll<HTMLElement>("*").forEach((n) => {
        const cs = getComputedStyle(n);
        const hasOverflow =
          n.scrollHeight > n.clientHeight &&
          (cs.overflowY === "auto" || cs.overflowY === "scroll");
        if (hasOverflow) scrollables.add(n);
      });
    
      for (const sc of Array.from(scrollables)) {
        const max = Math.max(0, sc.scrollHeight - sc.clientHeight);
        let y = 0;
        while (y < max) {
          sc.scrollTop = y;
          await sleep(60);
          y += Math.max(200, Math.floor(sc.clientHeight * 0.9));
        }
        await sleep(80);
        sc.scrollTop = 0;
      }
    }, el);
    

    // 2) ESPERA ALTURA ESTABILIZAR (acabou de carregar tudo)
    await page.waitForFunction((node: Element) => {
      if (!node) return false;
      const h = node.scrollHeight;
      // guarda no window pra comparar entre ticks
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (window.__h == null) { window.__h = h; return false; }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const stable = Math.abs(h - window.__h) < 2;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.__h = h;
      return stable && h > window.innerHeight * 1.2;
    }, el, { timeout: 3000 }).catch(() => {});
    

    // 4) CAPTURA FINAL (o Playwright stitcha o elemento inteiro)
    const png = await el.screenshot({ type: "png" });

    // --------- MONTA PDF MULTIPÁGINA A4 ---------
    const doc = await PDFDocument.create();
    const img = await doc.embedPng(png);

    // A4 em points (72dpi)
    const A4_W = 595.28;
    const A4_H = 841.89;

    // desenha a imagem na largura total da página
    const imgH = (img.height / img.width) * A4_W;   // altura resultante em points
    const pages = Math.max(1, Math.ceil(imgH / A4_H));

    for (let i = 0; i < pages; i++) {
      const p = doc.addPage([A4_W, A4_H]);
      // regra simples: mesma imagem em todas as páginas, deslocando -i*A4_H
      // (origem do PDF é bottom-left)
      p.drawImage(img, {
        x: 0,
        y: -i * A4_H,
        width: A4_W,
        height: imgH,
      });
    }

    const bytes = await doc.save();
    return new Response(Buffer.from(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="dashboard_${new Date()
          .toISOString()
          .slice(0, 10)}.pdf"`,
      },
    });
  } finally {
    await context.close();
    await browser.close();
  }
}
