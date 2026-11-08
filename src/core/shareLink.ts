/**
 * The share link: a Message packed into the URL fragment (after `#`), so
 * nothing is ever sent to a server. Pure and DOM-free; it only uses the
 * web-platform CompressionStream, which browsers and Node both have.
 *
 * Fragment format, version 2:  `m2.<base64url(deflate-raw(payload))>`
 * Version 1 links (`m1.`, made before Sounds) still open: the same payload
 * without the Sounds.
 *
 * Payload bytes (varint = unsigned LEB128):
 *   varint nameLength, name (UTF-8)
 *   3 bytes ink (r, g, b)
 *   1 byte stroke width in thousandths of the Glyph square
 *   varint textLength, text (UTF-8, already folded)
 *   1 byte glyphCount, then for each Glyph:
 *     1 byte slot (its index in GLYPH_SLOTS: that order must never change)
 *     varint strokeCount, then for each stroke:
 *       varint pointCount, then the first point as two bytes (x, y on a
 *       0..GRID grid) and every later point as two zigzag varint deltas.
 *     varint soundLength, sound (UTF-8); length 0 means no Sound. (Not in v1.)
 *
 * Strokes are made compact first: snapped to the GRID, repeated points
 * dropped, then simplified (Ramer-Douglas-Peucker, SIMPLIFY_TOLERANCE).
 */
import { GLYPH_SLOTS, keptGlyph, type Glyph, type GlyphSlot, type Point, type ScriptLook, type Stroke } from "./myScript";
import { foldMessageText, slotForChar, type GlyphSet } from "./messageLayout";

/**
 * The version new links are packed in. Bump when the payload format changes;
 * a version the decoder doesn't know gives "couldn't open".
 */
export const SHARE_LINK_VERSION = 2;
/** The oldest version that still opens: version 1 links were made before Sounds. */
const OLDEST_OPENABLE_VERSION = 1;
/** The first version whose Glyphs carry their Sounds. */
const FIRST_VERSION_WITH_SOUNDS = 2;

/**
 * The longest whole link (in characters, all ASCII) that still fits a QR
 * code a phone reads reliably off a tablet screen: version 25 (117x117
 * modules) at error-correction level M holds 997 bytes. See codebase.md
 * (ticket 07) for why.
 */
export const MAX_SHARE_LINK_LENGTH = 997;

/** Points are snapped to a GRID x GRID grid on the Glyph square (64 = steps of about 1.6%). */
const GRID = 64;
/** How far (in grid steps) a point may sit off the simplified line and still be dropped. */
const SIMPLIFY_TOLERANCE = 0.7;
/** Fragments longer than this are not even tried (no real share link comes close). */
const MAX_FRAGMENT_LENGTH = 8000;

/** A Message as opened from a share link: read-only, with its own Glyphs (only those it uses). */
export interface SharedMessage extends ScriptLook {
  /** The Message text (folded: A–Z uppercase). */
  readonly text: string;
  /** The Glyphs the text uses that he had drawn. `updatedAt` is 0: links don't carry times. */
  readonly glyphs: GlyphSet;
}

export type PackResult = { readonly ok: true; readonly link: string } | { readonly ok: false; readonly reason: "tooLong" };
export type UnpackResult = { readonly ok: true; readonly message: SharedMessage } | { readonly ok: false; readonly reason: "couldntOpen" };

/** The Glyphs of `glyphs` that `text` uses (as a space, letter, digit or mark), in grid order. */
export function glyphsUsed(text: string, glyphs: GlyphSet): GlyphSet {
  const slots = new Set<GlyphSlot>();
  for (const char of foldMessageText(text)) {
    const slot = slotForChar(char);
    if (slot && glyphs[slot]) slots.add(slot);
  }
  const used: Partial<Record<GlyphSlot, Glyph>> = {};
  for (const slot of GLYPH_SLOTS) if (slots.has(slot)) used[slot] = glyphs[slot];
  return used;
}

/** Packs a Message into a link to `appAddress` (any fragment on it is replaced). */
export async function packShareLink(message: SharedMessage, appAddress: string): Promise<PackResult> {
  const payload = await deflateRaw(encodePayload(message));
  const link = `${appAddress.split("#")[0]}#m${SHARE_LINK_VERSION}.${toBase64Url(payload)}`;
  return link.length > MAX_SHARE_LINK_LENGTH ? { ok: false, reason: "tooLong" } : { ok: true, link };
}

/** The fragment of a link (whole URL, or the fragment with or without `#`). */
function fragmentOf(link: string): string {
  const hash = link.indexOf("#");
  return hash >= 0 ? link.slice(hash + 1) : link;
}

/** Whether a link looks like a share link (`m<version>.` then anything), whether or not it opens. */
export function isShareLink(link: string): boolean {
  return /^m\d+\./.test(fragmentOf(link));
}

/** Opens a share link (a whole URL, or just its fragment with or without `#`). Never throws. */
export async function unpackShareLink(link: string): Promise<UnpackResult> {
  try {
    const fragment = fragmentOf(link);
    if (fragment.length > MAX_FRAGMENT_LENGTH) return couldntOpen();
    const match = /^m(\d+)\.([A-Za-z0-9_-]+)$/.exec(fragment);
    const version = Number(match?.[1]);
    if (!match || version < OLDEST_OPENABLE_VERSION || version > SHARE_LINK_VERSION) return couldntOpen();
    const message = decodePayload(await inflateRaw(fromBase64Url(match[2])), version);
    return message ? { ok: true, message } : couldntOpen();
  } catch {
    return couldntOpen();
  }
}

function couldntOpen(): UnpackResult {
  return { ok: false, reason: "couldntOpen" };
}

// ---- compact strokes ----

/** A stroke as grid points (integers 0..GRID), snapped, de-duplicated and simplified. */
function compactStroke(stroke: Stroke): Array<[number, number]> {
  const snapped: Array<[number, number]> = [];
  for (const p of stroke) {
    const q: [number, number] = [snap(p.x), snap(p.y)];
    const last = snapped[snapped.length - 1];
    if (!last || last[0] !== q[0] || last[1] !== q[1]) snapped.push(q);
  }
  return simplify(snapped, SIMPLIFY_TOLERANCE);
}

function snap(v: number): number {
  const n = Number.isFinite(v) ? v : 0;
  return Math.round(Math.min(1, Math.max(0, n)) * GRID);
}

/** Ramer-Douglas-Peucker: keeps the ends and any point further than `tolerance` from the line. */
function simplify(points: Array<[number, number]>, tolerance: number): Array<[number, number]> {
  if (points.length < 3) return points;
  const keep = new Array<boolean>(points.length).fill(false);
  keep[0] = keep[points.length - 1] = true;
  const stack: Array<[number, number]> = [[0, points.length - 1]];
  while (stack.length > 0) {
    const [from, to] = stack.pop()!;
    let worst = -1;
    let worstDistance = tolerance;
    for (let i = from + 1; i < to; i++) {
      const d = distanceToSegment(points[i], points[from], points[to]);
      if (d > worstDistance) {
        worst = i;
        worstDistance = d;
      }
    }
    if (worst >= 0) {
      keep[worst] = true;
      stack.push([from, worst], [worst, to]);
    }
  }
  return points.filter((_, i) => keep[i]);
}

function distanceToSegment([px, py]: [number, number], [ax, ay]: [number, number], [bx, by]: [number, number]): number {
  const dx = bx - ax;
  const dy = by - ay;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lengthSquared));
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

// ---- payload bytes ----

function encodePayload(message: SharedMessage): Uint8Array {
  const out: number[] = [];
  const utf8 = new TextEncoder();
  const putVarint = (n: number) => {
    let v = n;
    while (v >= 0x80) {
      out.push((v & 0x7f) | 0x80);
      v >>>= 7;
    }
    out.push(v);
  };
  const putString = (s: string) => {
    const bytes = utf8.encode(s);
    putVarint(bytes.length);
    out.push(...bytes);
  };
  const zigzag = (n: number) => (n < 0 ? -2 * n - 1 : 2 * n);

  putString(message.name);
  out.push(...inkBytes(message.ink));
  out.push(Math.max(0, Math.min(255, Math.round(message.strokeWidth * 1000))));
  putString(message.text);

  const slots = GLYPH_SLOTS.filter((slot) => message.glyphs[slot]);
  out.push(slots.length);
  for (const slot of slots) {
    out.push(GLYPH_SLOTS.indexOf(slot));
    const strokes = message.glyphs[slot]!.strokes.map(compactStroke).filter((s) => s.length > 0);
    putVarint(strokes.length);
    for (const stroke of strokes) {
      putVarint(stroke.length);
      out.push(stroke[0][0], stroke[0][1]);
      for (let i = 1; i < stroke.length; i++) {
        putVarint(zigzag(stroke[i][0] - stroke[i - 1][0]));
        putVarint(zigzag(stroke[i][1] - stroke[i - 1][1]));
      }
    }
    putString(message.glyphs[slot]!.sound ?? "");
  }
  return Uint8Array.from(out);
}

/** Reads a payload; undefined if anything is off (cut short, out of range, bytes left over). */
function decodePayload(bytes: Uint8Array, version: number): SharedMessage | undefined {
  let at = 0;
  const byte = () => {
    if (at >= bytes.length) throw new RangeError("cut short");
    return bytes[at++];
  };
  const varint = () => {
    let n = 0;
    for (let shift = 0; shift < 28; shift += 7) {
      const b = byte();
      n |= (b & 0x7f) << shift;
      if (b < 0x80) return n;
    }
    throw new RangeError("varint too long");
  };
  const string = () => {
    const length = varint();
    if (at + length > bytes.length) throw new RangeError("cut short");
    const s = new TextDecoder("utf-8", { fatal: true }).decode(bytes.subarray(at, at + length));
    at += length;
    return s;
  };
  const unzigzag = (n: number) => (n & 1 ? -(n + 1) / 2 : n / 2);
  const gridValue = (n: number) => {
    if (n < 0 || n > GRID) throw new RangeError("off the grid");
    return n;
  };

  const name = string();
  const ink = "#" + [byte(), byte(), byte()].map((b) => b.toString(16).padStart(2, "0")).join("");
  const strokeWidth = byte() / 1000;
  const text = string();
  const glyphs: Partial<Record<GlyphSlot, Glyph>> = {};
  const glyphCount = byte();
  for (let g = 0; g < glyphCount; g++) {
    const slot = GLYPH_SLOTS[byte()];
    if (!slot || glyphs[slot]) return undefined;
    const strokes: Stroke[] = [];
    const strokeCount = varint();
    for (let s = 0; s < strokeCount; s++) {
      const pointCount = varint();
      if (pointCount === 0 || pointCount > bytes.length) return undefined;
      let x = gridValue(byte());
      let y = gridValue(byte());
      const points: Point[] = [{ x: x / GRID, y: y / GRID }];
      for (let p = 1; p < pointCount; p++) {
        x = gridValue(x + unzigzag(varint()));
        y = gridValue(y + unzigzag(varint()));
        points.push({ x: x / GRID, y: y / GRID });
      }
      strokes.push(points);
    }
    const sound = version >= FIRST_VERSION_WITH_SOUNDS ? string() : undefined;
    glyphs[slot] = keptGlyph(slot, strokes, sound, 0);
  }
  if (at !== bytes.length || strokeWidth <= 0) return undefined;
  return { name, ink, strokeWidth, text, glyphs };
}

function inkBytes(ink: string): number[] {
  const hex = /^#([0-9a-f]{6})$/i.exec(ink)?.[1] ?? "000000";
  return [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
}

// ---- compression and base64url ----

async function deflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  return pipe(bytes, new CompressionStream("deflate-raw"));
}

async function inflateRaw(bytes: Uint8Array): Promise<Uint8Array> {
  return pipe(bytes, new DecompressionStream("deflate-raw"));
}

async function pipe(bytes: Uint8Array, through: CompressionStream | DecompressionStream): Promise<Uint8Array> {
  const stream = new Blob([bytes as BlobPart]).stream().pipeThrough(through);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

function toBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): Uint8Array {
  const binary = atob(text.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}
