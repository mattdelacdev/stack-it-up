#!/usr/bin/env node
/**
 * Generates the Stack It Up supplement guide PDF.
 * Pulls live data from Supabase, renders styled HTML, prints to PDF via Puppeteer.
 * Output: public/stack-it-up-guide.pdf
 */
import { createClient } from "@supabase/supabase-js";
import puppeteer from "puppeteer";
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, "..");

function loadEnv() {
  const raw = readFileSync(resolve(root, ".env.local"), "utf8");
  for (const line of raw.split("\n")) {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

const TAG_LABEL = { core: "Core", goal: "Goal-based", lifestyle: "Lifestyle" };
const TIMING_LABEL = {
  morning: "Morning",
  afternoon: "Afternoon",
  evening: "Evening",
  anytime: "Anytime",
};

const esc = (s) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

async function fetchSupplements() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars");
  const supabase = createClient(url, key);
  const { data, error } = await supabase
    .from("supplements")
    .select("id, name, dose, timing, why, tag, content");
  if (error) throw error;
  const tagOrder = { core: 0, goal: 1, lifestyle: 2 };
  return data.sort(
    (a, b) => tagOrder[a.tag] - tagOrder[b.tag] || a.name.localeCompare(b.name),
  );
}

function renderCover(count) {
  return `
  <section class="page cover">
    <div class="retro-grid" aria-hidden="true"></div>
    <div class="cover-inner">
      <p class="eyebrow">Stack It Up presents</p>
      <h1 class="cover-title">The Supplement<br/>Field Guide</h1>
      <p class="cover-sub">${count} science-backed supplements. Dosing, timing, trade-offs — decoded.</p>
      <div class="cover-badge">
        <span>Volume 01</span>
        <span>·</span>
        <span>${new Date().getFullYear()} Edition</span>
      </div>
    </div>
    <div class="cover-footer">stackitup — your stack, dialed in.</div>
  </section>`;
}

function renderTOC(supps) {
  const groups = { core: [], goal: [], lifestyle: [] };
  supps.forEach((s, i) => groups[s.tag].push({ ...s, page: i + 3 })); // cover=1, toc=2
  const section = (tag) => {
    if (!groups[tag].length) return "";
    return `
    <div class="toc-group">
      <h3 class="toc-group-title">${TAG_LABEL[tag]}</h3>
      <ul class="toc-list">
        ${groups[tag]
          .map(
            (s) => `
          <li><span class="toc-name">${esc(s.name)}</span><span class="toc-dots"></span><span class="toc-page">${s.page}</span></li>`,
          )
          .join("")}
      </ul>
    </div>`;
  };
  return `
  <section class="page toc">
    <p class="eyebrow">Table of Contents</p>
    <h2 class="section-title">What's inside</h2>
    ${section("core")}
    ${section("goal")}
    ${section("lifestyle")}
  </section>`;
}

function listBlock(title, items) {
  if (!items || !items.length) return "";
  return `
  <div class="block">
    <h4 class="block-title">${title}</h4>
    <ul class="bullet">${items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>
  </div>`;
}

function textBlock(title, text) {
  if (!text) return "";
  return `
  <div class="block">
    <h4 class="block-title">${title}</h4>
    <p>${esc(text)}</p>
  </div>`;
}

function formsBlock(forms) {
  if (!forms || !forms.length) return "";
  return `
  <div class="block">
    <h4 class="block-title">Common Forms</h4>
    <div class="forms-grid">
      ${forms
        .map(
          (f) => `
        <div class="form-row">
          <div class="form-name">${esc(f.name)}</div>
          ${f.note ? `<div class="form-note">${esc(f.note)}</div>` : ""}
        </div>`,
        )
        .join("")}
    </div>
  </div>`;
}

function faqBlock(faqs) {
  if (!faqs || !faqs.length) return "";
  return `
  <div class="block">
    <h4 class="block-title">FAQ</h4>
    ${faqs
      .map(
        (f) => `
      <div class="faq">
        <div class="faq-q">${esc(f.q)}</div>
        <div class="faq-a">${esc(f.a)}</div>
      </div>`,
      )
      .join("")}
  </div>`;
}

function sourcesBlock(sources) {
  if (!sources || !sources.length) return "";
  return `
  <div class="block">
    <h4 class="block-title">Sources</h4>
    <ul class="sources">
      ${sources
        .map(
          (s) =>
            `<li><span class="src-title">${esc(s.title)}</span><br/><span class="src-url">${esc(s.url)}</span></li>`,
        )
        .join("")}
    </ul>
  </div>`;
}

function renderSupplement(s, idx, total) {
  const c = s.content || {};
  return `
  <section class="page supp">
    <header class="supp-head">
      <div>
        <p class="eyebrow">${TAG_LABEL[s.tag]} · ${String(idx + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</p>
        <h2 class="supp-name">${esc(s.name)}</h2>
        <p class="supp-why">${esc(s.why)}</p>
      </div>
    </header>

    <div class="specs">
      <div class="spec"><span class="spec-label">Dose</span><span class="spec-value">${esc(s.dose)}</span></div>
      <div class="spec"><span class="spec-label">Timing</span><span class="spec-value">${TIMING_LABEL[s.timing]}</span></div>
      <div class="spec"><span class="spec-label">Onset</span><span class="spec-value">${esc(c.onset || "—")}</span></div>
    </div>

    ${listBlock("Benefits", c.benefits)}
    ${textBlock("How it works", c.mechanism)}
    ${textBlock("Dose notes", c.doseNotes)}
    ${textBlock("Timing notes", c.timingNotes)}
    <div class="two-col">
      ${listBlock("Good for", c.goodFor)}
      ${listBlock("Avoid if", c.avoidIf)}
    </div>
    ${listBlock("Side effects", c.sideEffects)}
    ${formsBlock(c.forms)}
    ${c.stacksWith && c.stacksWith.length ? `<div class="block"><h4 class="block-title">Stacks with</h4><p class="tags">${c.stacksWith.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</p></div>` : ""}
    ${c.avoidWith && c.avoidWith.length ? `<div class="block"><h4 class="block-title">Avoid with</h4><p class="tags">${c.avoidWith.map((t) => `<span class="tag tag-warn">${esc(t)}</span>`).join("")}</p></div>` : ""}
    ${faqBlock(c.faq)}
    ${sourcesBlock(c.sources)}
  </section>`;
}

function renderBack() {
  return `
  <section class="page back">
    <div class="retro-grid" aria-hidden="true"></div>
    <div class="back-inner">
      <p class="eyebrow">Fin.</p>
      <h2 class="back-title">Your stack,<br/>dialed in.</h2>
      <p class="back-body">
        Stack It Up builds personalized supplement routines backed by research —
        not hype. Take the quiz, get your tailored stack, and chat with our
        AI supplement expert any time.
      </p>
      <div class="back-cta">
        <div class="back-brand">STACKITUP</div>
        <div class="back-url">stackitup.app</div>
      </div>
      <p class="disclaimer">
        This guide is for educational purposes and is not medical advice.
        Supplements can interact with medications and conditions — consult a
        qualified healthcare provider before starting any new supplement.
      </p>
    </div>
  </section>`;
}

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Bungee&family=VT323&family=Space+Grotesk:wght@400;500;700&display=swap');

:root {
  --primary: #D946EF;
  --secondary: #06B6D4;
  --accent: #FBBF24;
  --bg: #1E1B4B;
  --bg-deep: #15123A;
  --text: #E9D5FF;
  --border: rgba(233, 213, 255, 0.18);
}

* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; color: var(--text); font-family: 'Space Grotesk', sans-serif; background: var(--bg-deep); }

@page { size: Letter; margin: 0; }

.page {
  width: 8.5in;
  height: 11in;
  padding: 0.7in 0.75in;
  page-break-after: always;
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, var(--bg) 0%, var(--bg-deep) 100%);
}
.page:last-child { page-break-after: auto; }

.retro-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse at center, black 30%, transparent 75%);
  pointer-events: none;
}

.eyebrow {
  font-family: 'Bungee', sans-serif;
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0 0 10px;
}

/* Cover */
.cover { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.cover-inner { position: relative; z-index: 1; max-width: 6in; }
.cover-title {
  font-family: 'Bungee', sans-serif;
  font-size: 84px;
  line-height: 1;
  margin: 0 0 24px;
  background: linear-gradient(90deg, var(--primary), var(--accent), var(--secondary));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  letter-spacing: 0.02em;
}
.cover-sub { font-size: 20px; line-height: 1.4; color: var(--text); margin: 0 0 40px; opacity: 0.9; }
.cover-badge {
  display: inline-flex; gap: 14px; align-items: center;
  border: 3px solid var(--accent); padding: 10px 22px;
  font-family: 'Bungee', sans-serif; font-size: 12px; letter-spacing: 0.2em;
  color: var(--accent); box-shadow: 6px 6px 0 var(--primary);
}
.cover-footer {
  position: absolute; bottom: 0.6in; left: 0; right: 0; text-align: center;
  font-family: 'VT323', monospace; font-size: 16px; color: var(--secondary); letter-spacing: 0.1em;
}

/* TOC */
.toc { padding-top: 0.8in; }
.section-title {
  font-family: 'Bungee', sans-serif; font-size: 44px; margin: 0 0 36px;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.toc-group { margin-bottom: 28px; }
.toc-group-title {
  font-family: 'Bungee', sans-serif; font-size: 14px; letter-spacing: 0.25em;
  color: var(--secondary); margin: 0 0 10px; padding-bottom: 6px;
  border-bottom: 2px solid var(--border);
}
.toc-list { list-style: none; margin: 0; padding: 0; }
.toc-list li { display: flex; align-items: baseline; gap: 8px; padding: 6px 0; font-size: 15px; }
.toc-name { color: var(--text); font-weight: 500; }
.toc-dots { flex: 1; border-bottom: 2px dotted var(--border); margin: 0 4px 4px; }
.toc-page { font-family: 'VT323', monospace; color: var(--accent); font-size: 18px; }

/* Supplement page */
.supp-head { border-bottom: 3px solid var(--border); padding-bottom: 18px; margin-bottom: 18px; }
.supp-name {
  font-family: 'Bungee', sans-serif; font-size: 38px; margin: 0 0 10px; line-height: 1;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.supp-why { font-size: 14px; color: var(--text); opacity: 0.85; margin: 0; font-style: italic; }

.specs { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px; }
.spec {
  border: 3px solid var(--border); padding: 10px 12px;
  background: rgba(217, 70, 239, 0.08);
  box-shadow: 3px 3px 0 var(--border);
  display: flex; flex-direction: column; gap: 4px;
}
.spec-label { font-family: 'Bungee', sans-serif; font-size: 8px; letter-spacing: 0.25em; color: var(--secondary); text-transform: uppercase; }
.spec-value { font-size: 13px; color: var(--text); font-weight: 500; }

.block { margin-bottom: 14px; }
.block-title {
  font-family: 'Bungee', sans-serif; font-size: 11px; letter-spacing: 0.22em;
  color: var(--accent); text-transform: uppercase; margin: 0 0 8px;
}
.block p { margin: 0; font-size: 12.5px; line-height: 1.55; color: var(--text); }
.bullet { list-style: none; margin: 0; padding: 0; }
.bullet li {
  font-size: 12.5px; line-height: 1.5; padding: 3px 0 3px 16px; position: relative;
}
.bullet li::before {
  content: "▸"; position: absolute; left: 0; color: var(--primary);
}

.two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.forms-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; }
.form-row { border-left: 3px solid var(--secondary); padding: 4px 10px; font-size: 11.5px; }
.form-name { font-weight: 700; color: var(--text); }
.form-note { color: var(--text); opacity: 0.7; font-size: 11px; }

.tags { margin: 0; display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  display: inline-block; padding: 3px 10px; font-family: 'VT323', monospace;
  font-size: 14px; letter-spacing: 0.05em; border: 2px solid var(--secondary);
  color: var(--secondary); background: rgba(6, 182, 212, 0.1);
}
.tag-warn { border-color: var(--primary); color: var(--primary); background: rgba(217, 70, 239, 0.1); }

.faq { margin-bottom: 10px; padding-left: 12px; border-left: 2px solid var(--primary); }
.faq-q { font-weight: 700; font-size: 12.5px; color: var(--accent); margin-bottom: 3px; }
.faq-a { font-size: 12px; color: var(--text); opacity: 0.9; line-height: 1.5; }

.sources { list-style: none; margin: 0; padding: 0; }
.sources li { font-size: 11px; margin-bottom: 6px; }
.src-title { color: var(--text); }
.src-url { font-family: 'VT323', monospace; color: var(--secondary); font-size: 12px; word-break: break-all; }

/* Back */
.back { display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; }
.back-inner { position: relative; z-index: 1; max-width: 5.5in; }
.back-title {
  font-family: 'Bungee', sans-serif; font-size: 64px; line-height: 1; margin: 0 0 24px;
  background: linear-gradient(90deg, var(--primary), var(--secondary));
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.back-body { font-size: 15px; line-height: 1.55; margin: 0 0 36px; opacity: 0.9; }
.back-cta { margin-bottom: 40px; }
.back-brand {
  font-family: 'Bungee', sans-serif; font-size: 28px; color: var(--accent);
  letter-spacing: 0.15em; margin-bottom: 4px;
}
.back-url { font-family: 'VT323', monospace; font-size: 20px; color: var(--secondary); letter-spacing: 0.1em; }
.disclaimer {
  font-size: 10px; line-height: 1.5; opacity: 0.55; max-width: 4.5in;
  margin: 0 auto; border-top: 1px solid var(--border); padding-top: 14px;
}
`;

function renderHTML(supps) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8"/>
<title>Stack It Up — Supplement Field Guide</title>
<style>${CSS}</style>
</head>
<body>
${renderCover(supps.length)}
${renderTOC(supps)}
${supps.map((s, i) => renderSupplement(s, i, supps.length)).join("\n")}
${renderBack()}
</body>
</html>`;
}

async function main() {
  loadEnv();
  console.log("→ Fetching supplements from Supabase…");
  const supps = await fetchSupplements();
  console.log(`  got ${supps.length} supplements`);

  const html = renderHTML(supps);
  const outDir = resolve(root, "public");
  mkdirSync(outDir, { recursive: true });

  // Write HTML alongside for debugging.
  writeFileSync(resolve(outDir, "stack-it-up-guide.html"), html);

  console.log("→ Launching Puppeteer…");
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 60000 });
  await page.evaluate(() => document.fonts.ready);

  const outPath = resolve(outDir, "stack-it-up-guide.pdf");
  await page.pdf({
    path: outPath,
    format: "Letter",
    printBackground: true,
    preferCSSPageSize: true,
  });
  await browser.close();
  console.log(`✓ Wrote ${outPath}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
