"""Diegetic sound effects. Each one should be recognizable with eyes closed."""

import wave
from pathlib import Path

import numpy as np

SR = 44100
GAME = Path(__file__).resolve().parents[1] / "game"


def write_wav(path, samples):
    path.parent.mkdir(parents=True, exist_ok=True)
    stereo = np.asarray(samples, dtype=np.float32)
    if stereo.ndim == 1:
        stereo = np.stack([stereo, stereo], axis=1)
    peak = np.max(np.abs(stereo)) or 1
    stereo = stereo / peak * 0.8
    pcm = (np.clip(stereo, -1, 1) * 32767).astype(np.int16)
    with wave.open(str(path), "w") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SR)
        handle.writeframes(pcm.tobytes())


def env(n, attack, release):
    out = np.ones(n, dtype=np.float32)
    a = min(n, int(SR * attack))
    r = min(n - a, int(SR * release))
    if a:
        out[:a] = np.linspace(0, 1, a, dtype=np.float32)
    if r:
        out[-r:] = np.linspace(1, 0, r, dtype=np.float32)
    return out


def tone(freq, dur, decay):
    n = int(SR * dur)
    t = np.arange(n, dtype=np.float32) / SR
    wave_ = np.sin(2 * np.pi * freq * t) * np.exp(-t * decay)
    return wave_


def mix(*parts):
    length = max(len(part) for part in parts)
    out = np.zeros(length, dtype=np.float32)
    for part in parts:
        out[: len(part)] += part
    return out


def noise(dur, seed):
    rng = np.random.default_rng(seed)
    return rng.standard_normal(int(SR * dur)).astype(np.float32)


def lowpass(samples, keep):
    out = np.empty_like(samples)
    acc = 0.0
    for i, sample in enumerate(samples):
        acc += keep * (float(sample) - acc)
        out[i] = acc
    return out


def band(samples, keep):
    slow = lowpass(samples, keep)
    slower = lowpass(samples, keep * 0.35)
    return slow - slower


def creak():
    n = int(SR * 0.42)
    t = np.arange(n, dtype=np.float32) / SR
    freq = 240 * np.exp(-t * 3.2) + 90
    phase = np.cumsum(freq) / SR
    body = np.sin(2 * np.pi * phase) * np.exp(-t * 4)
    grit = band(noise(0.42, 3), 0.2) * np.exp(-t * 6) * 0.35
    return (body + grit) * env(n, 0.01, 0.12)


def snore():
    chunks = []
    for index, dur in enumerate((0.55, 0.42)):
        raw = lowpass(noise(dur, 11 + index), 0.04)
        n = len(raw)
        bump = np.sin(np.linspace(0, np.pi, n, dtype=np.float32)) ** 2
        chunks.append(raw * bump)
        chunks.append(np.zeros(int(SR * 0.28), dtype=np.float32))
    return np.concatenate(chunks) * 0.9


def rain():
    bed = band(noise(1.6, 21), 0.45) * 0.25
    rng = np.random.default_rng(22)
    drops = np.zeros_like(bed)
    for _ in range(28):
        at = int(rng.integers(0, len(drops) - 800))
        freq = float(rng.uniform(900, 2200))
        drop = tone(freq, 0.018, 80) * float(rng.uniform(0.15, 0.45))
        drops[at : at + len(drop)] += drop
    return bed + drops


def heart():
    thump = mix(tone(70, 0.12, 18), tone(48, 0.16, 12) * 0.6)
    gap = np.zeros(int(SR * 0.16), dtype=np.float32)
    second = thump * 0.72
    return np.concatenate([thump, gap, second])


def clock():
    tick = mix(tone(1800, 0.02, 90) * 0.4, tone(420, 0.03, 40) * 0.3)
    gap = np.zeros(int(SR * 0.48), dtype=np.float32)
    return np.concatenate([tick, gap, tick * 0.8])


def page():
    swipe = band(noise(0.16, 31), 0.55)
    n = len(swipe)
    swipe *= np.sin(np.linspace(0, np.pi, n, dtype=np.float32)) ** 2
    return swipe


def pen():
    scratch = band(noise(0.22, 33), 0.7)
    n = len(scratch)
    scratch *= np.abs(np.sin(np.linspace(0, 18, n, dtype=np.float32)))
    return scratch * 0.7


def door():
    hit = tone(90, 0.18, 10) * 0.8
    wood = lowpass(noise(0.2, 35), 0.08) * env(int(SR * 0.2), 0.005, 0.08)
    return mix(hit, wood * 0.5)


def wind():
    air = lowpass(noise(1.8, 41), 0.08)
    n = len(air)
    air *= 0.45 + 0.55 * np.sin(np.linspace(0, 4 * np.pi, n, dtype=np.float32)) ** 2
    return air * 0.5


def chime():
    bell = mix(tone(880, 0.7, 3.2), tone(1320, 0.5, 4.5) * 0.35, tone(1760, 0.35, 6) * 0.15)
    return bell * env(len(bell), 0.005, 0.2)


def applause():
    rng = np.random.default_rng(51)
    bed = np.zeros(int(SR * 1.1), dtype=np.float32)
    for _ in range(70):
        at = int(rng.integers(0, len(bed) - 600))
        clap = band(noise(0.012, int(rng.integers(1, 80))), 0.6)
        bed[at : at + len(clap)] += clap * float(rng.uniform(0.2, 0.7))
    return bed


def phone():
    beep = tone(740, 0.18, 2) * env(int(SR * 0.18), 0.01, 0.04)
    gap = np.zeros(int(SR * 0.12), dtype=np.float32)
    return np.concatenate([beep, gap, beep * 0.85]) * 0.45


def alarm():
    high = tone(988, 0.16, 4) * env(int(SR * 0.16), 0.005, 0.03)
    low = tone(784, 0.16, 4) * env(int(SR * 0.16), 0.005, 0.03)
    gap = np.zeros(int(SR * 0.08), dtype=np.float32)
    return np.concatenate([high, gap, low]) * 0.4


def card():
    snap = band(noise(0.05, 61), 0.65) * env(int(SR * 0.05), 0.001, 0.02)
    return snap


def click():
    return band(noise(0.03, 63), 0.8) * env(int(SR * 0.03), 0.001, 0.015)


def ac():
    air = lowpass(noise(0.9, 71), 0.06)
    return air * 0.35


def water():
    pour = lowpass(noise(0.45, 73), 0.25)
    n = len(pour)
    pour *= np.linspace(0.3, 1, n, dtype=np.float32)
    return pour * 0.45


def paper():
    return page() * 0.8


def elevator():
    hum = tone(110, 0.7, 1.2) * 0.15
    motor = lowpass(noise(0.7, 81), 0.05) * 0.3
    return mix(hum, motor)


def crowd():
    murmur = lowpass(noise(0.8, 83), 0.12)
    return murmur * 0.4


def cup():
    return mix(tone(640, 0.12, 14) * 0.3, tone(1280, 0.08, 20) * 0.12)


def key():
    jingle = mix(tone(2100, 0.04, 30), tone(1600, 0.05, 24) * 0.5)
    return jingle * 0.35


def notice():
    return tone(1568, 0.22, 8) * 0.25


def chair():
    return creak() * 0.7


def breath():
    air = lowpass(noise(0.5, 91), 0.05)
    n = len(air)
    air *= np.sin(np.linspace(0, np.pi, n, dtype=np.float32))
    return air * 0.35


def knock():
    hit = tone(180, 0.06, 20)
    gap = np.zeros(int(SR * 0.12), dtype=np.float32)
    return np.concatenate([hit, gap, hit * 0.8])


def static():
    return band(noise(0.2, 97), 0.8) * 0.25


def drop():
    return mix(tone(520, 0.18, 12) * 0.4, tone(260, 0.22, 8) * 0.25)


def step():
    return lowpass(noise(0.08, 99), 0.1) * env(int(SR * 0.08), 0.002, 0.04)


def bell():
    return chime() * 0.8


SOUNDS = {
    "creak": creak,
    "snore": snore,
    "ac": ac,
    "rain": rain,
    "heart": heart,
    "alarm": alarm,
    "card": card,
    "chime": chime,
    "page": page,
    "pen": pen,
    "drop": drop,
    "phone": phone,
    "clock": clock,
    "door": door,
    "elevator": elevator,
    "applause": applause,
    "wind": wind,
    "water": water,
    "paper": paper,
    "click": click,
    "step": step,
    "bell": bell,
    "crowd": crowd,
    "cup": cup,
    "key": key,
    "notice": notice,
    "chair": chair,
    "breath": breath,
    "knock": knock,
    "static": static,
}

BEDS = {
    "class": lambda: lowpass(noise(2.4, 101), 0.05) * 0.15,
    "dorm": snore,
    "exam": lambda: lowpass(noise(2.2, 119), 0.04) * 0.08,
    "home": lambda: lowpass(noise(2.2, 103), 0.04) * 0.12,
    "corridor": lambda: lowpass(noise(2.2, 105), 0.07) * 0.14,
    "wind": wind,
    "rain": rain,
    "outdoor": lambda: mix(wind() * 0.6, lowpass(noise(1.8, 107), 0.1) * 0.1),
    "hotel": lambda: lowpass(noise(2.2, 109), 0.06) * 0.12,
    "library": lambda: lowpass(noise(2.2, 111), 0.03) * 0.08,
    "lab": lambda: lowpass(noise(2.2, 113), 0.08) * 0.12,
    "canteen": lambda: lowpass(noise(2.0, 115), 0.14) * 0.16,
    "award": applause,
    "void": lambda: tone(196, 2.2, 0.4) * 0.04,
    "uneasy": lambda: mix(lowpass(noise(2.2, 117), 0.05) * 0.1, tone(92, 2.2, 0.6) * 0.03),
}


def _fit(samples, dur):
    n = int(SR * dur)
    out = np.zeros(n, dtype=np.float32)
    m = min(n, len(samples))
    out[:m] = samples[:m]
    return out


def main():
    for name, build in SOUNDS.items():
        write_wav(GAME / "se" / f"{name}.wav", build())
    for name, build in BEDS.items():
        write_wav(GAME / "bed" / f"{name}.wav", build())
    print("foley", len(SOUNDS), "beds", len(BEDS))


if __name__ == "__main__":
    main()
