export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { chromium, type Cookie } from "playwright";
import { PDFDocument } from "pdf-lib";

/**
 * @description Analisa o cabeçalho de cookies de uma requisição e retorna um array de objetos Cookie para o Playwright.
 * @param {string} header O valor do cabeçalho "Cookie".
 * @param {URL} url A URL da página alvo.
 * @returns {Cookie[]} Um array de objetos Cookie.
 */
function parseCookieHeader(header: string, url: URL): Cookie[] {
  if (!header) return [];
  // Usa o cabeçalho de forma mais confiável e separa por '; '
  return header.split(/;\s*/).map((pair) => {
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
  const { url: targetUrl, storage, width = 1440, dpr = 2, delay = 1000 } = await req.json();
  if (!targetUrl) return new Response("URL não fornecida", { status: 400 });

  const url = new URL(targetUrl);
  const cookieHeader = req.headers.get("cookie") ?? "";

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: dpr,
    userAgent: req.headers.get("user-agent") || undefined,
  });

  let png: Buffer | null = null;
  
  try {
    const cookies = parseCookieHeader(cookieHeader, url);
    if (cookies.length) await context.addCookies(cookies);

    const page = await context.newPage();
    
    // Adiciona scripts para restaurar o localStorage e sessionStorage
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

    // Navega para a URL e espera que a rede se estabilize
    // O 'domcontentloaded' e 'networkidle' são eventos cruciais para capturas de tela.
    await page.goto(url.toString(), { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");

    // Espera por animações e fontes
    await page.addStyleTag({
      content: `
        /* Desabilita animações, transições, e esconde overlays */
        body, body * {
          animation: none !important;
          transition: none !important;
        }
        [data-nextjs-toast], nextjs-portal, #__nextjs_dev_overlay, #__nextjs_error_overlay,
        #__nextjs-build-watcher, [aria-label="Next.js App Router Announcer"] { display:none!important }
      `,
    });

    // Usa `page.evaluate` de forma mais segura para esperar por fontes
    await page.waitForFunction(() => document.fonts?.status === "loaded").catch(() => {});
    
    // Espera adicional para garantir que todos os elementos e dados tenham sido renderizados
    // Isso é especialmente útil para dados que chegam via requisições assíncronas.
    if (delay > 0) {
      await page.waitForTimeout(delay);
    }
    
    // Espera que o elemento principal da página tenha uma altura mínima para evitar capturas de páginas em branco.
    // Isso é mais robusto que a rolagem, pois garante que o conteúdo foi renderizado.
    const el = (await page.$("#export-root")) ?? (await page.$("main")) ?? (await page.$("body"));
    if (!el) throw new Error("Elemento principal não encontrado para exportação.");
    
    // Usa uma função de espera que verifica se o scrollHeight parou de crescer
    // Isso é fundamental para páginas com lazy loading ou renderização assíncrona.
    await page.waitForFunction((node: Element) => {
      const currentHeight = node.scrollHeight;
      // Salva a altura anterior na janela para comparação
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (window.__lastHeight === undefined) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        window.__lastHeight = currentHeight;
        return false;
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const lastHeight = window.__lastHeight;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      window.__lastHeight = currentHeight;
      return currentHeight <= lastHeight; // Retorna true quando a altura para de crescer ou diminui
    }, el, { timeout: 10000 }).catch(() => {
      // O timeout aqui é um limite de segurança
      console.warn("Timeout esperando o conteúdo estabilizar.");
    });

    // 4) CAPTURA FINAL (fullPage é uma opção do page.screenshot, não do element.screenshot)
    png = await el.screenshot({ type: "png" });

    // Se a captura falhou, por exemplo, o elemento está invisível
    if (!png || png.length === 0) {
        throw new Error("Falha ao capturar a tela. O elemento pode estar invisível.");
    }

    // --------- MONTA PDF MULTIPÁGINA A4 ---------
    const doc = await PDFDocument.create();
    const img = await doc.embedPng(png);

    const A4_W = 595.28;
    const A4_H = 841.89;
    const imgH = (img.height / img.width) * A4_W; 
    const pages = Math.max(1, Math.ceil(imgH / A4_H));

    for (let i = 0; i < pages; i++) {
      const p = doc.addPage([A4_W, A4_H]);
      p.drawImage(img, {
        x: 0,
        y: A4_H - (imgH - i * A4_H), // Cálculo corrigido para a origem bottom-left
        width: A4_W,
        height: imgH,
      });
    }

    const bytes = await doc.save();
    return new Response(Buffer.from(bytes), {
      headers: {
        "content-type": "application/pdf",
        "content-disposition": `attachment; filename="dashboard_${new Date().toISOString().slice(0, 10)}.pdf"`,
      },
    });

  } catch (error) {
    console.error("Erro durante a captura:", error);
    // Retorna um erro genérico para o cliente, mas loga o detalhe
    return new Response("Ocorreu um erro ao gerar o PDF.", { status: 500 });
  } finally {
    await context.close();
    await browser.close();
  }
}