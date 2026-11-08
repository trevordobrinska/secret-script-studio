// THROWAWAY (ticket 02): Dad's tablet test page. Self-contained; delete after ticket 15.
import { renderSVG } from "uqr";
import { FONT_SAMPLES } from "./fontSamples";
import { describeAge } from "./visitLog";
import "./tabletTest.css";

const root = document.getElementById("tablet-test")!;

function el<K extends keyof HTMLElementTagNameMap>(tag: K, cls?: string, text?: string): HTMLElementTagNameMap[K] {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
}

function section(title: string): HTMLElement {
  const s = el("section");
  s.append(el("h2", undefined, title));
  root.append(s);
  return s;
}

function result(parent: HTMLElement, ok: boolean | null, text: string): HTMLElement {
  const p = el("p", ok === null ? "result" : ok ? "result pass" : "result fail", `${ok === null ? "…" : ok ? "PASS" : "FAIL"}: ${text}`);
  parent.append(p);
  return p;
}

const header = el("header");
header.append(
  el("h1", undefined, "Secret Script Studio: tablet test"),
  el("p", "throwaway", "THROWAWAY parent tool (ticket 02). Remove after ticket 15 (Run the tablet test)."),
);
root.append(header);

// --- Device info
{
  const s = section("Browser and device");
  const dl = el("dl");
  const rows: [string, string][] = [
    ["User agent", navigator.userAgent],
    ["Screen", `${screen.width} x ${screen.height}`],
    ["Window", `${innerWidth} x ${innerHeight}`],
    ["Device pixel ratio", String(devicePixelRatio)],
    ["Touch points", String(navigator.maxTouchPoints)],
    ["Display mode", matchMedia("(display-mode: fullscreen)").matches ? "fullscreen" : matchMedia("(display-mode: standalone)").matches ? "standalone" : "browser"],
  ];
  for (const [k, v] of rows) dl.append(el("dt", undefined, k), el("dd", undefined, v));
  s.append(dl);
}

// --- Storage check (IndexedDB, test-only name)
{
  const s = section("Saved data survives (IndexedDB)");
  s.append(el("p", "hint", "Open this page, then close the app, reboot, and come back days later. Earlier visits should still be listed."));
  const status = result(s, null, "checking IndexedDB");
  const list = el("ol");
  s.append(list);
  const DB = "secret-script-studio-tablet-test";
  const req = indexedDB.open(DB, 1);
  req.onupgradeneeded = () => req.result.createObjectStore("visits", { autoIncrement: true });
  req.onerror = () => { status.className = "result fail"; status.textContent = `FAIL: could not open IndexedDB (${req.error?.message})`; };
  req.onsuccess = () => {
    const db = req.result;
    const tx = db.transaction("visits", "readwrite");
    const store = tx.objectStore("visits");
    const all = store.getAll();
    all.onsuccess = () => {
      const now = Date.now();
      const visits = all.result as number[];
      for (const t of visits) list.append(el("li", undefined, `${new Date(t).toLocaleString()} (${describeAge(t, now)})`));
      store.add(now);
      const oldest = visits.length ? describeAge(visits[0], now) : "none yet";
      status.className = visits.length ? "result pass" : "result";
      status.textContent = visits.length
        ? `PASS: ${visits.length} earlier visit(s) survived; oldest ${oldest}.`
        : "…: first visit recorded. Come back later to see if it survives.";
    };
    tx.onerror = () => { status.className = "result fail"; status.textContent = `FAIL: ${tx.error?.message}`; };
  };
  const reset = el("button", undefined, "Clear test visits");
  reset.onclick = () => { indexedDB.deleteDatabase(DB); location.reload(); };
  s.append(reset);
}

// --- Backup check
{
  const s = section("Backup download and restore picker");
  const dl = el("button", undefined, "Download test backup file");
  const out = el("p", "result", "Not tried yet.");
  dl.onclick = () => {
    const blob = new Blob([JSON.stringify({ tabletTest: true, savedAt: new Date().toISOString() })], { type: "application/json" });
    const a = el("a");
    a.href = URL.createObjectURL(blob);
    a.download = "secret-script-studio-tablet-test.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    out.textContent = "Download started. Check the Downloads folder, then pick it below.";
  };
  const pick = el("input");
  pick.type = "file";
  pick.accept = ".json,application/json";
  pick.onchange = async () => {
    const f = pick.files?.[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      out.className = "result pass";
      out.textContent = `PASS: read "${f.name}" (${f.size} bytes), savedAt ${data.savedAt ?? "?"}.`;
    } catch (e) {
      out.className = "result fail";
      out.textContent = `FAIL: could not read "${f.name}": ${e}`;
    }
  };
  s.append(dl, el("p", undefined, "Restore picker:"), pick, out);
}

// --- Print check
{
  const s = section("Printing");
  s.append(el("p", "hint", "Opens the browser's print dialog with a sample page. If nothing happens, printing goes through the PC."));
  const b = el("button", undefined, "Print sample page");
  b.onclick = () => { document.body.classList.add("printing"); print(); };
  addEventListener("afterprint", () => document.body.classList.remove("printing"));
  s.append(b);
  const sample = el("div", "print-sample");
  sample.append(el("h1", undefined, "Print test"), el("p", undefined, "If you can read this on paper (or in the PDF), printing works. Α Б 가 ᚠ ٣"));
  document.body.append(sample);
}

// --- Font check
{
  const s = section("Fonts (World Scripts and numerals)");
  s.append(el("p", "hint", "Any row showing empty boxes (tofu) or blanks needs a bundled font (ticket 16)."));
  const table = el("table", "fonts");
  for (const f of FONT_SAMPLES) {
    const tr = el("tr");
    tr.append(el("th", undefined, `${f.name}${f.kind === "numerals" ? " numerals" : ""}`), el("td", "font-sample", f.sample));
    table.append(tr);
  }
  s.append(table);
}

// --- QR check
{
  const s = section("QR code");
  s.append(el("p", "hint", "Scan with your phone camera. It should open this page."));
  const url = location.href.split("#")[0];
  const box = el("div", "qr");
  box.innerHTML = renderSVG(url, { border: 2 });
  s.append(box, el("p", "small", url));
}

// --- Drawing check
{
  const s = section("Finger drawing");
  s.append(el("p", "hint", "Draw with a finger. Lines should follow smoothly without lag or gaps."));
  const c = el("canvas", "draw");
  const size = 320;
  c.width = size * devicePixelRatio;
  c.height = size * devicePixelRatio;
  c.style.width = c.style.height = `${size}px`;
  const ctx = c.getContext("2d")!;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  ctx.lineWidth = 6;
  ctx.lineCap = ctx.lineJoin = "round";
  let last: { x: number; y: number } | null = null;
  const pos = (e: PointerEvent) => { const r = c.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  c.onpointerdown = (e) => { c.setPointerCapture(e.pointerId); last = pos(e); };
  c.onpointermove = (e) => {
    if (!last) return;
    const events = e.getCoalescedEvents?.() ?? [e];
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    for (const ev of events) { last = pos(ev); ctx.lineTo(last.x, last.y); }
    ctx.stroke();
  };
  c.onpointerup = c.onpointercancel = () => { last = null; };
  const clear = el("button", undefined, "Clear");
  clear.onclick = () => ctx.clearRect(0, 0, size, size);
  s.append(c, clear);
}
