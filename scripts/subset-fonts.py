#!/usr/bin/env python3
# LOCAL-ONLY font subsetting tool (NOT part of the Vercel build — that image is
# Node-only). Requires fontTools + brotli (pip). Run on a dev machine after font
# or content changes, then COMMIT the resulting public/fonts/*.woff2.
#
#   python scripts/subset-fonts.py
#
# What it does:
#   1. Gathers a glyph corpus from real site text (i18n dicts, model content,
#      all src + dist HTML) so no glyph that can actually render is dropped.
#   2. Limits the variable `wght` axis to 400-700 (the only weights used:
#      400 normal, 500 font-medium incl. the model H1 LCP element, 700 bold).
#   3. Subsets glyphs to the corpus + generous safety unicode ranges
#      (full Latin + full Cyrillic + punctuation + currency).
#   4. Writes woff2 in place (originals are recoverable via git).
#
# The build-time gate scripts/verify-fonts.mjs asserts the result stays correct.

import io
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.subset import Subsetter, Options

ROOT = Path(__file__).resolve().parent.parent

# --- 1. corpus ---------------------------------------------------------------
CORPUS_GLOBS = [
    "src/i18n/ru.json",
    "src/i18n/en.json",
    "index.html",
]
CORPUS_DIR_GLOBS = [
    ("src", "**/*.ts"),
    ("src", "**/*.tsx"),
    ("src", "**/*.json"),
    ("dist", "**/*.html"),
]

def gather_corpus() -> set[str]:
    chars: set[str] = set()
    files: list[Path] = []
    for rel in CORPUS_GLOBS:
        p = ROOT / rel
        if p.is_file():
            files.append(p)
    for base, pat in CORPUS_DIR_GLOBS:
        d = ROOT / base
        if d.is_dir():
            files.extend(d.glob(pat))
    for f in files:
        try:
            chars.update(f.read_text(encoding="utf-8"))
        except (UnicodeDecodeError, OSError):
            pass
    return chars

# Safety ranges: keep these even if absent from the corpus, so brand/model names
# and rare punctuation never break. Only codepoints actually present in the font
# are retained by the subsetter.
SAFETY_RANGES = [
    (0x0020, 0x007E),  # Basic Latin
    (0x00A0, 0x00FF),  # Latin-1 Supplement
    (0x0100, 0x017F),  # Latin Extended-A (accented names)
    (0x0400, 0x04FF),  # Cyrillic
    (0x2010, 0x2027),  # dashes, quotes, ellipsis, bullets
    (0x20A0, 0x20BF),  # currency symbols (₽ = U+20BD)
    (0x2116, 0x2116),  # № numero
    (0x2190, 0x2192),  # arrows (← →) used in before/after examples
]

def safety_unicodes() -> set[int]:
    out: set[int] = set()
    for lo, hi in SAFETY_RANGES:
        out.update(range(lo, hi + 1))
    return out

# --- 2+3. instance axis + subset glyphs --------------------------------------
FONTS = [
    "public/fonts/Unbounded-VF.woff2",
    "public/fonts/PT-Root-UI_VF.woff2",
]

def subset_font(path: Path, unicodes: set[int], corpus_text: str) -> None:
    before = path.stat().st_size
    font = TTFont(str(path))

    opts = Options()
    opts.flavor = "woff2"
    opts.layout_features = ["*"]   # keep kerning/ligatures
    opts.name_IDs = ["*"]
    opts.notdef_outline = True
    opts.recalc_bounds = True
    opts.drop_tables = []          # let the subsetter decide; keep defaults

    ss = Subsetter(options=opts)
    # union of the explicit safety codepoints and every codepoint in the corpus
    wanted = set(unicodes)
    wanted.update(ord(c) for c in corpus_text)
    # Invisible format chars trip a fontTools HVAR subsetting bug (KeyError on
    # uni00AD) and are never rendered — drop them.
    for cp in (0x00AD, 0x200B, 0x200C, 0x200D, 0xFEFF):
        wanted.discard(cp)
    ss.populate(unicodes=wanted)
    # Subset glyphs FIRST while HVAR is still consistent across all glyphs, THEN
    # narrow the weight axis. The reverse order leaves HVAR variations missing
    # retained glyphs (KeyError 'space') after partial instancing.
    ss.subset(font)

    # Limit the weight axis range (keeps the font variable, drops the 200-400 and
    # 700-900 master data we never use). 400 normal, 500 font-medium (model H1
    # LCP element), 700 bold all stay inside the range.
    if "fvar" in font:
        instantiateVariableFont(font, {"wght": (400, 400, 700)}, inplace=True)

    buf = io.BytesIO()
    font.save(buf)
    data = buf.getvalue()
    path.write_bytes(data)
    after = len(data)
    print(f"  {path.name}: {before/1024:.1f} KB -> {after/1024:.1f} KB "
          f"({100*(before-after)/before:.0f}% smaller), glyphs now {font['maxp'].numGlyphs}")

def main() -> int:
    corpus = gather_corpus()
    corpus_text = "".join(sorted(corpus))
    print(f"corpus: {len(corpus)} distinct characters")
    unicodes = safety_unicodes()
    for rel in FONTS:
        p = ROOT / rel
        if not p.is_file():
            print(f"  ! missing {rel}", file=sys.stderr)
            return 1
        subset_font(p, unicodes, corpus_text)
    return 0

if __name__ == "__main__":
    raise SystemExit(main())
