"""Draws the PWA icons into public/: icon-192.png, icon-512.png, icon-maskable-512.png.

Standard library only. Run from the repo root:  python scripts/make-icons.py
The picture is a made-up Glyph (a ring crossed by a stroke, with a dot) in ink
on a paper-colored tile, matching the app's colors. Output is deterministic.
"""

import math
import struct
import zlib
from pathlib import Path

PAPER = (246, 239, 224)
INK = (47, 58, 86)
ACCENT = (226, 140, 92)

OUT = Path(__file__).resolve().parent.parent / "public"


def seg_dist(px, py, ax, ay, bx, by):
    """Distance from point p to the line segment a-b."""
    dx, dy = bx - ax, by - ay
    t = max(0.0, min(1.0, ((px - ax) * dx + (py - ay) * dy) / (dx * dx + dy * dy)))
    return math.hypot(px - (ax + t * dx), py - (ay + t * dy))


def rounded_rect_sdf(px, py, half, radius):
    """Signed distance to a rounded square centered at (0.5, 0.5)."""
    qx = abs(px - 0.5) - (half - radius)
    qy = abs(py - 0.5) - (half - radius)
    outside = math.hypot(max(qx, 0.0), max(qy, 0.0))
    inside = min(max(qx, qy), 0.0)
    return outside + inside - radius


def coverage(sdf, pixel):
    """Antialiased coverage (0..1) from a signed distance, one pixel wide."""
    return max(0.0, min(1.0, 0.5 - sdf / pixel))


def blend(under, over, alpha):
    return tuple(u + (o - u) * alpha for u, o in zip(under, over))


def draw(size, maskable):
    pixel = 1.0 / size
    # A maskable icon is cropped to a circle of 80% diameter, so it fills the
    # whole square and keeps the Glyph small enough to sit inside that circle.
    glyph_scale = 0.72 if maskable else 1.0
    rows = []
    for y in range(size):
        row = bytearray([0])  # PNG filter: none
        for x in range(size):
            px, py = (x + 0.5) / size, (y + 0.5) / size
            tile = 1.0 if maskable else coverage(rounded_rect_sdf(px, py, 0.46, 0.11), pixel)
            color = PAPER
            # Glyph coordinates, scaled about the center.
            gx = 0.5 + (px - 0.5) / glyph_scale
            gy = 0.5 + (py - 0.5) / glyph_scale
            gp = pixel / glyph_scale
            ring = abs(math.hypot(gx - 0.5, gy - 0.52) - 0.22) - 0.035
            stroke = seg_dist(gx, gy, 0.36, 0.2, 0.64, 0.84) - 0.035
            dot = math.hypot(gx - 0.74, gy - 0.26) - 0.055
            color = blend(color, INK, coverage(min(ring, stroke), gp))
            color = blend(color, ACCENT, coverage(dot, gp))
            row += bytes(round(c) for c in color) + bytes([round(255 * tile)])
        rows.append(bytes(row))
    return png(size, size, b"".join(rows))


def png(width, height, raw):
    def chunk(kind, data):
        body = kind + data
        return struct.pack(">I", len(data)) + body + struct.pack(">I", zlib.crc32(body) & 0xFFFFFFFF)

    header = struct.pack(">IIBBBBB", width, height, 8, 6, 0, 0, 0)  # 8-bit RGBA
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", header) + chunk(b"IDAT", zlib.compress(raw, 9)) + chunk(b"IEND", b"")


if __name__ == "__main__":
    for name, size, maskable in [
        ("icon-192.png", 192, False),
        ("icon-512.png", 512, False),
        ("icon-maskable-512.png", 512, True),
    ]:
        (OUT / name).write_bytes(draw(size, maskable))
        print("wrote", OUT / name)
