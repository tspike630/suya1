"""Turn the existing painted assets into files OnscripterYuri can load."""

import json
import wave
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "src"
GAME = ROOT / "game"
MANIFEST = GAME / "manifest.json"


def write_wav(path, samples, sr=22050):
    path.parent.mkdir(parents=True, exist_ok=True)
    pcm = np.clip(samples, -1, 1)
    pcm = (pcm * 32767).astype(np.int16)
    with wave.open(str(path), "w") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(sr)
        handle.writeframes(pcm.tobytes())


def lowpass(noise, keep):
    out = np.empty_like(noise)
    acc = 0.0
    for i, sample in enumerate(noise):
        acc += keep * (sample - acc)
        out[i] = acc
    return out


def loop_fade(samples, fade):
    ramp = np.linspace(0, 1, fade)
    head = samples[:fade].copy()
    tail = samples[-fade:].copy()
    samples[:fade] = tail * (1 - ramp) + head * ramp
    samples[-fade:] = samples[:fade]
    return samples


def build_se(name):
    sr = 22050
    specs = {
        "creak": (0.16, 0.08, 0.22),
        "snore": (0.7, 0.12, 0.08),
        "ac": (0.5, 0.04, 0.35),
        "rain": (0.9, 0.05, 0.55),
        "heart": (0.28, 0.2, 0.04),
        "alarm": (0.45, 0.08, 0.7),
        "card": (0.08, 0.1, 0.5),
        "chime": (0.35, 0.06, 0.8),
        "page": (0.12, 0.07, 0.62),
        "pen": (0.14, 0.05, 0.72),
        "drop": (0.18, 0.1, 0.3),
        "phone": (0.42, 0.06, 0.48),
        "clock": (0.06, 0.08, 0.66),
        "door": (0.2, 0.1, 0.18),
        "elevator": (0.4, 0.04, 0.22),
        "applause": (0.45, 0.06, 0.5),
        "wind": (0.7, 0.05, 0.28),
        "water": (0.3, 0.05, 0.4),
        "paper": (0.1, 0.06, 0.68),
        "click": (0.04, 0.08, 0.6),
        "step": (0.08, 0.1, 0.2),
        "bell": (0.28, 0.07, 0.75),
        "crowd": (0.4, 0.04, 0.45),
        "cup": (0.07, 0.09, 0.58),
        "key": (0.08, 0.08, 0.52),
        "notice": (0.09, 0.05, 0.7),
        "chair": (0.1, 0.09, 0.24),
        "breath": (0.36, 0.04, 0.16),
        "knock": (0.07, 0.14, 0.26),
        "static": (0.16, 0.03, 0.85),
    }
    dur, amp, keep = specs[name]
    count = int(sr * dur)
    noise = np.random.randn(count) * amp
    shaped = lowpass(noise, keep)
    envelope = np.linspace(1, 0.15, count)
    if name in {"heart", "knock", "clock", "step"}:
        envelope = np.zeros(count)
        span = max(1, int(sr * 0.03))
        envelope[:span] = np.linspace(1, 0, span)
        if name == "heart" and count > span * 6:
            start = int(sr * 0.14)
            envelope[start : start + span] = np.linspace(0.8, 0, span)
    write_wav(GAME / "se" / f"{name}.wav", shaped * envelope, sr)


def build_bed(name):
    sr = 22050
    tone = {
        "class": (0.012, 0.18),
        "dorm": (0.02, 0.08),
        "exam": (0.01, 0.22),
        "home": (0.014, 0.12),
        "corridor": (0.012, 0.16),
        "wind": (0.02, 0.1),
        "rain": (0.028, 0.45),
        "outdoor": (0.016, 0.2),
        "hotel": (0.012, 0.14),
        "library": (0.008, 0.1),
        "lab": (0.011, 0.24),
        "canteen": (0.018, 0.3),
        "award": (0.015, 0.2),
        "void": (0.006, 0.05),
        "uneasy": (0.014, 0.12),
    }
    amp, keep = tone[name]
    count = int(sr * 2.4)
    noise = np.random.randn(count) * amp
    shaped = lowpass(noise, keep)
    if name == "dorm":
        bump = np.zeros(count)
        center = int(sr * 0.7)
        width = int(sr * 0.18)
        bump[center : center + width] = np.hanning(width) * 0.05
        shaped = shaped + bump
    fade = int(sr * 0.08)
    shaped = loop_fade(shaped, fade)
    write_wav(GAME / "bed" / f"{name}.wav", shaped, sr)


def fit_sprite(sprite, height):
    scale = height / sprite.height
    size = (max(1, int(sprite.width * scale)), height)
    return sprite.resize(size, Image.Resampling.LANCZOS)


def compose_cg(plan, size, dest):
    scene = Image.open(SRC / "backgrounds" / f"{plan['scene']}.webp").convert("RGB")
    scene = scene.resize(size, Image.Resampling.LANCZOS)
    if plan.get("sprite"):
        sprite = Image.open(SRC / "sprites" / plan["sprite"]).convert("RGBA")
        sprite = fit_sprite(sprite, int(size[1] * 0.96))
        x = size[0] - sprite.width - int(size[0] * 0.04)
        y = size[1] - sprite.height
        scene.paste(sprite, (x, y), sprite)
    dest.parent.mkdir(parents=True, exist_ok=True)
    scene.save(dest, quality=86, optimize=True)


def build_aunt():
    image = Image.new("RGBA", (900, 1600), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.polygon([(250, 430), (650, 430), (700, 980), (200, 980)], fill=(239, 230, 214, 255))
    draw.ellipse((300, 250, 600, 560), fill=(237, 213, 196, 255))
    draw.polygon([(330, 230), (570, 230), (620, 420), (280, 420)], fill=(74, 64, 56, 255))
    draw.ellipse((340, 210, 560, 280), fill=(109, 92, 76, 255))
    draw.line((360, 390, 430, 390), fill=(58, 42, 36, 255), width=6)
    draw.line((470, 390, 540, 390), fill=(58, 42, 36, 255), width=6)
    draw.arc((390, 450, 510, 520), 20, 160, fill=(122, 69, 68, 255), width=5)
    draw.rectangle((250, 980, 650, 1560), fill=(239, 230, 214, 255))
    path = GAME / "sprites" / "aunt" / "stand.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, optimize=True)


def build_window():
    image = Image.new("RGBA", (1240, 250), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rounded_rectangle((0, 0, 1239, 249), radius=18, fill=(8, 10, 14, 120))
    path = GAME / "ui" / "window.png"
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path)


def convert_sprites():
    count = 0
    for src in (SRC / "sprites").rglob("*.webp"):
        rel = src.relative_to(SRC / "sprites").with_suffix(".png")
        dest = GAME / "sprites" / rel
        dest.parent.mkdir(parents=True, exist_ok=True)
        Image.open(src).save(dest, optimize=True)
        count += 1
    return count


def convert_backgrounds():
    count = 0
    out = GAME / "bg"
    out.mkdir(parents=True, exist_ok=True)
    for src in sorted((SRC / "backgrounds").glob("*.webp")):
        Image.open(src).convert("RGB").save(out / f"{src.stem}.jpg", quality=86, optimize=True)
        count += 1
    return count


def main():
    manifest = json.loads(MANIFEST.read_text(encoding="utf-8"))
    sprites = convert_sprites()
    backgrounds = convert_backgrounds()
    build_aunt()
    build_window()
    for name in manifest["se"]:
        build_se(name)
    for name in manifest["beds"]:
        build_bed(name)
    for plan in manifest["cgs"]:
        compose_cg(plan, (1280, 720), GAME / "cg" / f"{plan['id']}.jpg")
        compose_cg(plan, (1920, 1080), GAME / "cg1920" / f"{plan['id']}.jpg")
    music = GAME / "bgm"
    music.mkdir(parents=True, exist_ok=True)
    for track in manifest["music"]:
        target = music / f"{track}.mp3"
        if not target.exists():
            target.write_bytes((SRC / "music" / f"{track}.mp3").read_bytes())
    voice = GAME / "voice"
    voice.mkdir(parents=True, exist_ok=True)
    for file_name in manifest["voices"]:
        target = voice / file_name
        if not target.exists():
            target.write_bytes((SRC / "voice" / file_name).read_bytes())
    font = GAME / "default.ttf"
    font.write_bytes((ROOT / "vendor" / "wqy-microhei.ttc").read_bytes())
    cursors = GAME
    blank = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    for name in ("uoncur.bmp", "uoffcur.bmp", "doncur.bmp", "doffcur.bmp", "cursor0.bmp", "cursor1.bmp"):
        blank.save(cursors / name)
    print(
        f"assets sprites={sprites} backgrounds={backgrounds} cgs={len(manifest['cgs'])} se={len(manifest['se'])} beds={len(manifest['beds'])}"
    )


if __name__ == "__main__":
    main()
