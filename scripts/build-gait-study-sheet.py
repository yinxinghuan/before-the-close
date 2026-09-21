from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "_qa" / "gait-study-contact-sheet.png"
W, H = 260, 286
sheet = Image.new("RGB", (W * 5, H * 2), "#1b1b1e")
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default(size=18)

for index in range(1, 11):
    source = Image.open(ROOT / "materials" / f"gait-study-up-left-{index:02d}.png").convert("RGB")
    source.thumbnail((244, 244), Image.Resampling.LANCZOS)
    col = (index - 1) % 5
    row = (index - 1) // 5
    x = col * W + (W - source.width) // 2
    y = row * H + 30 + (244 - source.height) // 2
    sheet.paste(source, (x, y))
    draw.text((col * W + 10, row * H + 7), f"{index:02d}", font=font, fill="#ffffff")

OUT.parent.mkdir(parents=True, exist_ok=True)
sheet.save(OUT)
print(OUT)
