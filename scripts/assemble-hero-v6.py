from collections import deque
from pathlib import Path
import hashlib
import json

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
MATERIALS = ROOT / "materials"
OUT = ROOT / "public" / "art"
OUT.mkdir(parents=True, exist_ok=True)


def remove_connected_cream(image: Image.Image) -> Image.Image:
    image = image.convert("RGBA")
    pixels = np.array(image)
    rgb = pixels[:, :, :3].astype(int)
    spread = rgb.max(2) - rgb.min(2)
    cream = (rgb.min(2) > 170) & (spread < 70)
    height, width = cream.shape
    seen = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            if cream[y, x] and not seen[y, x]:
                seen[y, x] = True
                queue.append((x, y))
    for y in range(height):
        for x in (0, width - 1):
            if cream[y, x] and not seen[y, x]:
                seen[y, x] = True
                queue.append((x, y))

    while queue:
        x, y = queue.popleft()
        for nx, ny in ((x - 1, y), (x + 1, y), (x, y - 1), (x, y + 1)):
            if 0 <= nx < width and 0 <= ny < height and cream[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True
                queue.append((nx, ny))

    pixels[seen, 3] = 0
    # Generated asset sheets can enclose patches of the same cream backdrop
    # between chair legs or inside a furniture ring. Remove that chroma family
    # everywhere while retaining neutral white papers and screens.
    cream_chroma = (
        (rgb[:, :, 0] > 225)
        & (rgb[:, :, 1] > 215)
        & (rgb[:, :, 2] > 195)
        & ((rgb[:, :, 0] - rgb[:, :, 2]) > 15)
        & ((rgb[:, :, 1] - rgb[:, :, 2]) > 8)
    )
    pixels[cream_chroma, 3] = 0
    image = Image.fromarray(pixels)
    image.putalpha(image.getchannel("A").filter(ImageFilter.MinFilter(3)))
    bounds = image.getbbox()
    if not bounds:
        raise RuntimeError("Generated frame has no foreground after background removal")
    return image.crop(bounds)


def frame(source_id: str, mirror: bool = False) -> tuple[Image.Image, dict]:
    source_path = MATERIALS / f"{source_id}.png"
    meta_path = MATERIALS / f"{source_id}.json"
    source = Image.open(source_path)
    source_bytes = source.tobytes()
    visible = remove_connected_cream(source)
    scale = 216 / visible.height
    visible = visible.resize((round(visible.width * scale), 216), Image.Resampling.LANCZOS)
    operations = ["remove-connected-background", "scale-uniform", "align-head-and-foot"]
    if mirror:
        visible = visible.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        operations.append("mirror-full-frame")

    alpha = np.array(visible)[:, :, 3]
    ys, xs = np.where(alpha[:54] > 128)
    head_x = (int(xs.min()) + int(xs.max())) / 2 if len(xs) else visible.width / 2
    cell = Image.new("RGBA", (256, 256))
    cell.alpha_composite(visible, (round(128 - head_x), 32))
    meta = json.loads(meta_path.read_text())
    bounds = cell.getbbox()
    return cell, {
        "sourcePath": f"materials/{source_id}.png",
        "sourceFrameSha256": hashlib.sha256(source_bytes).hexdigest(),
        "sourceSha256": meta["sha256"],
        "requestId": meta["requestId"],
        "taskId": meta["task"]["task_id"],
        "operations": operations,
        "bbox": list(bounds),
        "footY": bounds[3],
        "visibleHeight": bounds[3] - bounds[1],
    }


rows = [
    [
        ("ny-hero-down-left-support-v6", False),
        ("ny-hero-down-stand-v6", False),
        ("ny-hero-down-right-support-v6", False),
    ],
    [
        ("ny-hero-right-near-support-v7", True),
        ("ny-hero-right-stand-v7", True),
        ("ny-hero-right-far-support-v7", True),
    ],
    [
        ("ny-hero-right-near-support-v7", False),
        ("ny-hero-right-stand-v7", False),
        ("ny-hero-right-far-support-v7", False),
    ],
    [
        ("ny-hero-up-left-support-v6", False),
        ("ny-hero-up-stand-v6", False),
        ("ny-hero-up-right-support-v6", False),
    ],
]

atlas = Image.new("RGBA", (768, 1024))
manifest_frames = []
for row_index, row in enumerate(rows):
    for column_index, (source_id, mirror) in enumerate(row):
        cell, provenance = frame(source_id, mirror)
        atlas.alpha_composite(cell, (column_index * 256, row_index * 256))
        manifest_frames.append({"row": row_index, "column": column_index, **provenance})

atlas.save(OUT / "hero.png")
(OUT / "hero-assembly.json").write_text(
    json.dumps(
        {
            "version": 3,
            "status": "candidate",
            "directions": ["down", "left", "right", "up"],
            "sourceService": "AlterU Media Service",
            "partialLimbReflectionAllowed": False,
            "sheet": {"path": "public/art/hero.png", "cell": [256, 256]},
            "frames": manifest_frames,
        },
        ensure_ascii=False,
        indent=2,
    )
)

# Keep fund furniture as independently placeable scene objects. The generated
# sheet is only a transport format; no floor or wall pixels enter these assets.
pack_id = "ny-fund-furniture-pack-v1"
pack = Image.open(MATERIALS / f"{pack_id}.png")
pack_meta = json.loads((MATERIALS / f"{pack_id}.json").read_text())
pack_width, pack_height = pack.size
fund_assets = []
for index in range(4):
    column = index % 2
    row = index // 2
    source_rect = [
        column * pack_width // 2 + 14,
        row * pack_height // 2 + 14,
        (column + 1) * pack_width // 2 - 14,
        (row + 1) * pack_height // 2 - 14,
    ]
    raw = pack.crop(source_rect)
    asset = remove_connected_cream(raw)
    output_name = f"fund-furniture-{index}.png"
    asset.save(OUT / output_name)
    fund_assets.append(
        {
            "asset": f"public/art/{output_name}",
            "sourcePath": f"materials/{pack_id}.png",
            "sourceRect": source_rect,
            "sourceSha256": pack_meta["sha256"],
            "requestId": pack_meta["requestId"],
            "taskId": pack_meta["task"]["task_id"],
            "operations": ["crop-source-cell", "remove-connected-background"],
        }
    )
(OUT / "fund-furniture-assembly.json").write_text(
    json.dumps(
        {
            "version": 1,
            "status": "candidate",
            "sourceService": "AlterU Media Service",
            "assets": fund_assets,
        },
        ensure_ascii=False,
        indent=2,
    )
)


def npc_source(source_id: str, source_cell: int | None = None) -> tuple[Image.Image, dict]:
    source_path = MATERIALS / f"{source_id}.png"
    source = Image.open(source_path)
    source_rect = [0, 0, source.width, source.height]
    if source_cell is not None:
        column = source_cell % 2
        row = source_cell // 2
        source_rect = [
            column * source.width // 2 + 8,
            row * source.height // 2 + 8,
            (column + 1) * source.width // 2 - 8,
            (row + 1) * source.height // 2 - 8,
        ]
        source = source.crop(source_rect)
    meta = json.loads((MATERIALS / f"{source_id}.json").read_text())
    return remove_connected_cream(source), {
        "sourcePath": f"materials/{source_id}.png",
        "sourceRect": source_rect,
        "sourceSha256": meta["sha256"],
        "requestId": meta["requestId"],
        "taskId": meta["task"]["task_id"],
    }


def npc_cell(source_id: str, source_cell: int | None = None, mirror: bool = False) -> tuple[Image.Image, dict]:
    visible, provenance = npc_source(source_id, source_cell)
    visible = visible.resize((round(visible.width * 108 / visible.height), 108), Image.Resampling.LANCZOS)
    operations = ["crop-source-cell" if source_cell is not None else "use-full-source", "remove-connected-background", "scale-uniform", "align-head-and-foot"]
    if mirror:
        visible = visible.transpose(Image.Transpose.FLIP_LEFT_RIGHT)
        operations.append("mirror-full-frame")
    alpha = np.array(visible)[:, :, 3]
    ys, xs = np.where(alpha[:30] > 128)
    head_x = (int(xs.min()) + int(xs.max())) / 2 if len(xs) else visible.width / 2
    cell = Image.new("RGBA", (128, 128))
    cell.alpha_composite(visible, (round(64 - head_x), 12))
    return cell, {**provenance, "operations": operations, "bbox": list(cell.getbbox())}


npc_ids = ["partner", "analyst", "founder", "finance", "client"]
npc_sheet = Image.new("RGBA", (384, len(npc_ids) * 4 * 128))
npc_frames = []
for person_index, person_id in enumerate(npc_ids):
    base_id = f"ny-npc-{person_id}-v2"
    back_id = base_id if person_id == "partner" else f"ny-npc-{person_id}-back-v2"
    direction_sources = {
        0: [(base_id, 0, False)] * 3,
        1: [(base_id, 1, True)] * 3,
        2: [(base_id, 1, False)] * 3,
        3: [(back_id, 3 if person_id == "partner" else None, False)] * 3,
    }
    if person_id == "analyst":
        direction_sources[1] = [
            ("ny-npc-analyst-side-near-v2", None, True),
            (base_id, 1, True),
            ("ny-npc-analyst-side-far-v2", None, True),
        ]
        direction_sources[2] = [
            ("ny-npc-analyst-side-near-v2", None, False),
            (base_id, 1, False),
            ("ny-npc-analyst-side-far-v2", None, False),
        ]
    for facing in range(4):
        row_index = person_index * 4 + facing
        for column_index, (source_id, source_cell, mirror) in enumerate(direction_sources[facing]):
            cell, provenance = npc_cell(source_id, source_cell, mirror)
            npc_sheet.alpha_composite(cell, (column_index * 128, row_index * 128))
            npc_frames.append(
                {
                    "person": person_id,
                    "facing": facing,
                    "row": row_index,
                    "column": column_index,
                    **provenance,
                }
            )
npc_sheet.save(OUT / "npcs.png")
(OUT / "npc-assembly.json").write_text(
    json.dumps(
        {
            "version": 2,
            "status": "candidate",
            "sourceService": "AlterU Media Service",
            "directions": ["down", "left", "right", "up"],
            "frames": npc_frames,
        },
        ensure_ascii=False,
        indent=2,
    )
)

portrait_sources = [
    ("ny-portraits-a-v2", 0, 2, 2),
    ("ny-portraits-a-v2", 1, 2, 2),
    ("ny-portraits-a-v2", 2, 2, 2),
    ("ny-portraits-a-v2", 3, 2, 2),
    ("ny-portraits-b-v2", 0, 2, 1),
]
portrait_manifest = []
for index, (source_id, source_cell, columns, rows_count) in enumerate(portrait_sources):
    source = Image.open(MATERIALS / f"{source_id}.png")
    column = source_cell % columns
    row = source_cell // columns
    source_rect = [
        column * source.width // columns,
        row * source.height // rows_count,
        (column + 1) * source.width // columns,
        (row + 1) * source.height // rows_count,
    ]
    portrait = source.crop(source_rect)
    portrait.save(OUT / f"portrait-{index}.png")
    portrait.resize((96, 96), Image.Resampling.LANCZOS).save(OUT / f"portrait-{index}-thumb.png")
    meta = json.loads((MATERIALS / f"{source_id}.json").read_text())
    portrait_manifest.append(
        {
            "portrait": index,
            "sourcePath": f"materials/{source_id}.png",
            "sourceRect": source_rect,
            "sourceSha256": meta["sha256"],
            "requestId": meta["requestId"],
            "taskId": meta["task"]["task_id"],
            "operations": ["crop-source-cell", "resize-thumbnail"],
        }
    )
(OUT / "portrait-assembly.json").write_text(
    json.dumps(
        {
            "version": 2,
            "status": "candidate",
            "sourceService": "AlterU Media Service",
            "portraits": portrait_manifest,
        },
        ensure_ascii=False,
        indent=2,
    )
)

scene_media_manifest = {"version": 1, "status": "candidate", "sourceService": "AlterU Media Service", "floors": [], "assets": []}
for scene_name, source_id in [
    ("office", "ny-relayops-floor-v2"),
    ("records", "ny-data-floor-v2"),
    ("client", "ny-client-floor-v1"),
]:
    source = Image.open(MATERIALS / f"{source_id}.png")
    output_name = f"floor-{scene_name}-v2.png"
    source.save(OUT / output_name)
    meta = json.loads((MATERIALS / f"{source_id}.json").read_text())
    scene_media_manifest["floors"].append({"scene": scene_name, "asset": f"public/art/{output_name}", "sourcePath": f"materials/{source_id}.png", "sourceSha256": meta["sha256"], "requestId": meta["requestId"], "taskId": meta["task"]["task_id"]})

for scene_name, pack_id in [
    ("office", "ny-relayops-furniture-pack-v1"),
    ("records", "ny-data-furniture-pack-v1"),
    ("client", "ny-client-furniture-pack-v1"),
]:
    pack = Image.open(MATERIALS / f"{pack_id}.png")
    pack_meta = json.loads((MATERIALS / f"{pack_id}.json").read_text())
    for index in range(4):
        column = index % 2
        row = index // 2
        source_rect = [column * pack.width // 2 + 14, row * pack.height // 2 + 14, (column + 1) * pack.width // 2 - 14, (row + 1) * pack.height // 2 - 14]
        asset = remove_connected_cream(pack.crop(source_rect))
        output_name = f"{scene_name}-furniture-{index}.png"
        asset.save(OUT / output_name)
        scene_media_manifest["assets"].append({"scene": scene_name, "index": index, "asset": f"public/art/{output_name}", "sourcePath": f"materials/{pack_id}.png", "sourceRect": source_rect, "sourceSha256": pack_meta["sha256"], "requestId": pack_meta["requestId"], "taskId": pack_meta["task"]["task_id"], "operations": ["crop-source-cell", "remove-connected-background"]})
(OUT / "scene-media-assembly.json").write_text(json.dumps(scene_media_manifest, ensure_ascii=False, indent=2))
