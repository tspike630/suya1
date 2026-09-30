"""Generate Chinese dialogue clips. Not part of the site build."""

import asyncio
import hashlib
import json
from pathlib import Path

import edge_tts

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "src" / "voice"
LINES = Path("/tmp/voice-lines.json")

CAST = {
    "鹿眠": ("zh-CN-XiaoyiNeural", -6, 4),
    "沈知夏": ("zh-CN-XiaoxiaoNeural", -10, 2),
    "郁明": ("zh-CN-YunxiNeural", -2, 0),
    "裴望": ("zh-CN-YunyangNeural", -8, -4),
    "黍母": ("zh-CN-XiaoxiaoNeural", -14, -8),
    "阿姨": ("zh-CN-XiaoyiNeural", -4, -10),
}

FACE = {
    "hurt": (-12, -4),
    "sting": (-8, -2),
    "shy": (-8, 2),
    "whisper": (-10, -2),
    "quiet": (-4, 0),
    "soft": (-2, 0),
    "smile": (2, 2),
    "warm": (0, 0),
    "serious": (-4, -2),
    "stern": (-2, -4),
    "blank": (-10, -6),
    "pause": (-6, 0),
    "knowing": (0, 0),
    "bright": (4, 2),
    "rival": (2, 0),
    "professor": (-4, -2),
    "overlap": (-8, -6),
    "distant": (-8, -4),
    "gentle": (-4, 0),
    "look": (-2, 0),
    "expect": (0, 0),
}


def key_of(row):
    return f"{row['who']}\u0000{row['face']}\u0000{row['text']}"


def file_of(row):
    digest = hashlib.sha256(key_of(row).encode("utf-8")).hexdigest()[:12]
    return f"{digest}.mp3"


async def render(row, sem):
    voice, rate, pitch = CAST[row["who"]]
    extra_rate, extra_pitch = FACE.get(row["face"], (0, 0))
    dest = OUT / file_of(row)
    if dest.exists() and dest.stat().st_size > 1000:
        return file_of(row)
    async with sem:
        communicate = edge_tts.Communicate(
            row["text"],
            voice,
            rate=f"{rate + extra_rate:+d}%",
            pitch=f"{pitch + extra_pitch:+d}Hz",
        )
        await communicate.save(str(dest))
    return file_of(row)


async def main():
    rows = json.loads(LINES.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    sem = asyncio.Semaphore(4)
    files = await asyncio.gather(*(render(row, sem) for row in rows))
    manifest = {key_of(row): name for row, name in zip(rows, files)}
    (OUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n")
    print(f"voices {len(manifest)}")


if __name__ == "__main__":
    asyncio.run(main())
