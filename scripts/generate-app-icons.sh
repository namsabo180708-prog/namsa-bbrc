#!/usr/bin/env bash
#
# Favicon / Web App Icon 생성 파이프라인
# 소스: public/logo-image/webp/PCK_Logo(컬러).webp  (예장통합 PCK 로고, 세로형 595x842, 흰 배경)
#
# 바깥 흰 배경을 투명으로 플러드필 → 로고 실제 영역으로 타이트하게 크롭 →
# 정사각 캔버스에 세로가 꽉 차도록 배치(여백 없음) → 크기별 리사이즈.
# maskable 아이콘만 런처 마스크에 잘리지 않도록 safe-zone(약 78%)을 둔다.
#
# 필요 도구(macOS): python3 + Pillow (pip install pillow)
# 실행: bash scripts/generate-app-icons.sh
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - <<'PY'
from PIL import Image, ImageDraw

SRC = "public/logo-image/webp/PCK_Logo(컬러).webp"
OUT = "public/icons"

im = Image.open(SRC).convert("RGBA")
w, h = im.size

# 1) 테두리에서 시작해 바깥 흰 영역만 투명 처리 (로고 내부 흰 디테일은 보존)
seeds = []
for x in range(0, w, 12):
    seeds += [(x, 0), (x, h - 1)]
for y in range(0, h, 12):
    seeds += [(0, y), (w - 1, y)]
for s in seeds:
    if im.getpixel(s)[:3] > (238, 238, 238):
        ImageDraw.floodfill(im, s, (0, 0, 0, 0), thresh=18)

# 2) 로고 실제 영역으로 크롭
logo = im.crop(im.getbbox())
lw, lh = logo.size

def square(content, scale=1.0):
    """정사각 투명 캔버스 중앙에 배치. scale<1 이면 여백(safe-zone) 확보."""
    cw, ch = content.size
    if scale != 1.0:
        content = content.resize((max(1, round(cw * scale)), max(1, round(ch * scale))), Image.LANCZOS)
        cw, ch = content.size
    side = round(max(cw, ch) / scale) if scale != 1.0 else max(cw, ch)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(content, ((side - cw) // 2, (side - ch) // 2), content)
    return canvas

full = square(logo)                 # 여백 없이 꽉 차게
mask = square(logo, scale=0.78)     # maskable safe-zone

def emit(src_img, size, name):
    src_img.resize((size, size), Image.LANCZOS).save(f"{OUT}/{name}", optimize=True)
    print(f"  {OUT}/{name} ({size}x{size})")

print("생성:")
emit(full, 16,  "favicon-16.png")
emit(full, 32,  "favicon-32.png")
emit(full, 48,  "favicon-48.png")
emit(full, 180, "apple-touch-icon.png")
emit(full, 192, "icon-192.png")
emit(full, 512, "icon-512.png")
emit(mask, 512, "icon-512-maskable.png")
print("완료.")
PY
