"""Render original slow piano loops. Not a copy of any recording.

These are beds under dialogue: a held chord, a quiet melody, and a
crossfade so the file can loop without a beep or a hole of silence.
"""

import subprocess
import zlib
from pathlib import Path

import numpy as np

SR = 44100
OUT = Path(__file__).resolve().parents[1] / "src" / "music"
SHAPES = {
    "M": [0, 4, 7],
    "m": [0, 3, 7],
    "M7": [0, 4, 7, 11],
    "m7": [0, 3, 7, 10],
}


def piece(bpm, chords, melody):
    events = []
    bars = 4
    for beat, root, kind, length, vel in chords:
        bars = max(bars, int(np.ceil((beat + length) / 4)))
        events.append((beat, [root + n for n in SHAPES[kind]], vel, length, True))
    for beat, note, length, vel in melody:
        bars = max(bars, int(np.ceil((beat + length) / 4)))
        events.append((beat, [note], vel, length, False))
    return bpm, bars, events


PIECES = {
    "june": piece(64, [
        (0, 48, "M", 4, 0.22), (4, 45, "m", 4, 0.2), (8, 41, "M", 4, 0.2), (12, 43, "M", 4, 0.2),
        (16, 48, "M", 4, 0.22), (20, 45, "m", 4, 0.2), (24, 41, "M", 4, 0.2), (28, 43, "M", 4, 0.22),
    ], [
        (0, 76, 2, 0.34), (2, 79, 2, 0.32), (4, 81, 3, 0.3), (8, 77, 2, 0.3),
        (10, 74, 2, 0.28), (12, 79, 4, 0.32), (16, 81, 2, 0.3), (18, 84, 2, 0.28),
        (20, 81, 2, 0.28), (22, 79, 2, 0.26), (24, 77, 2, 0.28), (26, 76, 2, 0.26), (28, 72, 4, 0.3),
    ]),
    "bed": piece(50, [
        (0, 45, "m", 8, 0.18), (8, 40, "m", 8, 0.16), (16, 45, "m", 8, 0.18), (24, 38, "M", 8, 0.16),
    ], [
        (0, 69, 4, 0.28), (6, 72, 4, 0.24), (12, 68, 4, 0.22), (20, 65, 6, 0.24), (28, 64, 4, 0.2),
    ]),
    "exam": piece(54, [
        (0, 38, "m", 8, 0.14), (8, 41, "m", 8, 0.13), (16, 36, "m", 8, 0.13), (24, 43, "m", 8, 0.14),
    ], [
        (2, 65, 5, 0.22), (12, 69, 4, 0.2), (22, 67, 6, 0.18),
    ]),
    "rain": piece(58, [
        (0, 41, "M", 4, 0.18), (4, 48, "M", 4, 0.16), (8, 38, "m", 4, 0.16), (12, 46, "M", 4, 0.16),
        (16, 41, "M", 4, 0.18), (20, 48, "M", 4, 0.16), (24, 43, "m", 4, 0.16), (28, 41, "M", 4, 0.18),
    ], [
        (0, 69, 3, 0.26), (4, 72, 3, 0.24), (8, 70, 4, 0.22), (14, 69, 4, 0.22),
        (20, 74, 4, 0.22), (26, 72, 6, 0.2),
    ]),
    "white": piece(44, [
        (0, 60, "M", 16, 0.08), (16, 64, "M", 16, 0.08),
    ], [
        (6, 84, 6, 0.16), (18, 88, 5, 0.14), (26, 86, 6, 0.12),
    ]),
    "cradle": piece(56, [
        (0, 48, "M7", 8, 0.18), (8, 45, "m7", 8, 0.16), (16, 41, "M7", 8, 0.16), (24, 43, "M", 8, 0.16),
    ], [
        (0, 72, 4, 0.26), (6, 76, 4, 0.24), (12, 79, 4, 0.22), (20, 76, 4, 0.22), (28, 72, 4, 0.2),
    ]),
    "qinhua": piece(66, [
        (0, 43, "M", 4, 0.2), (4, 38, "M", 4, 0.18), (8, 40, "m", 4, 0.18), (12, 48, "M", 4, 0.18),
        (16, 43, "M", 4, 0.2), (20, 38, "M", 4, 0.18), (24, 41, "M", 4, 0.18), (28, 43, "M", 4, 0.2),
    ], [
        (0, 79, 2, 0.3), (3, 83, 3, 0.26), (8, 81, 3, 0.24), (14, 79, 4, 0.24),
        (20, 76, 4, 0.22), (26, 79, 6, 0.24),
    ]),
    "lamp": piece(52, [
        (0, 40, "m", 8, 0.16), (8, 36, "M", 8, 0.15), (16, 43, "M", 8, 0.15), (24, 38, "M", 8, 0.16),
    ], [
        (2, 67, 4, 0.24), (8, 71, 4, 0.22), (16, 69, 5, 0.2), (24, 64, 6, 0.2),
    ]),
    "pork": piece(62, [
        (0, 48, "M", 4, 0.2), (4, 43, "M", 4, 0.18), (8, 45, "m", 4, 0.18), (12, 41, "M", 4, 0.18),
        (16, 48, "M", 4, 0.2), (20, 43, "M", 4, 0.18), (24, 45, "m", 4, 0.18), (28, 48, "M", 4, 0.2),
    ], [
        (0, 72, 2, 0.28), (3, 76, 2, 0.26), (6, 79, 3, 0.24), (12, 74, 4, 0.22),
        (18, 72, 4, 0.22), (24, 76, 4, 0.22), (28, 72, 4, 0.24),
    ]),
    "crack": piece(48, [
        (0, 38, "m", 8, 0.15), (8, 41, "m", 8, 0.14), (16, 34, "M", 8, 0.13), (24, 36, "m", 8, 0.14),
    ], [
        (1, 65, 4, 0.22), (8, 66, 3, 0.16), (14, 63, 5, 0.18), (22, 61, 6, 0.16),
    ]),
    "lab": piece(58, [
        (0, 45, "m", 4, 0.16), (4, 41, "M", 4, 0.15), (8, 48, "M", 4, 0.15), (12, 43, "M", 4, 0.15),
        (16, 45, "m", 4, 0.16), (20, 40, "m", 4, 0.15), (24, 36, "M", 4, 0.15), (28, 43, "M", 4, 0.16),
    ], [
        (0, 69, 3, 0.24), (6, 72, 3, 0.22), (12, 74, 4, 0.2), (20, 72, 4, 0.2), (26, 69, 6, 0.2),
    ]),
    "applause": piece(60, [
        (0, 48, "M", 4, 0.18), (4, 41, "M", 4, 0.16), (8, 43, "M", 4, 0.16), (12, 48, "M", 4, 0.16),
        (16, 45, "m", 4, 0.16), (20, 41, "M", 4, 0.16), (24, 43, "M", 4, 0.16), (28, 48, "M", 4, 0.18),
    ], [
        (0, 76, 3, 0.26), (4, 79, 3, 0.24), (8, 72, 4, 0.22), (14, 76, 4, 0.22),
        (20, 81, 4, 0.2), (26, 76, 6, 0.22),
    ]),
    "home": piece(60, [
        (0, 41, "M", 4, 0.2), (4, 48, "M", 4, 0.18), (8, 38, "m", 4, 0.18), (12, 46, "M", 4, 0.18),
        (16, 41, "M", 4, 0.2), (20, 36, "M", 4, 0.18), (24, 43, "M", 4, 0.18), (28, 41, "M", 4, 0.2),
    ], [
        (0, 65, 3, 0.28), (4, 69, 3, 0.26), (8, 72, 4, 0.24), (14, 69, 4, 0.22),
        (20, 67, 4, 0.22), (26, 65, 6, 0.24),
    ]),
    "heart": piece(46, [
        (0, 45, "m", 8, 0.16), (8, 41, "m", 8, 0.14), (16, 40, "m", 8, 0.14), (24, 36, "M", 8, 0.14),
    ], [
        (0, 48, 1.2, 0.2), (2.2, 48, 1.2, 0.14), (4.4, 48, 1.2, 0.2), (6.6, 48, 1.2, 0.14),
        (10, 69, 6, 0.24), (20, 67, 6, 0.2), (28, 64, 4, 0.18),
    ]),
    "awake": piece(68, [
        (0, 48, "M", 4, 0.22), (4, 43, "M", 4, 0.2), (8, 45, "m", 4, 0.2), (12, 41, "M", 4, 0.2),
        (16, 48, "M", 4, 0.22), (20, 43, "M", 4, 0.2), (24, 45, "m", 4, 0.2), (28, 48, "M", 4, 0.22),
    ], [
        (0, 72, 2, 0.32), (2, 76, 2, 0.3), (4, 79, 2, 0.28), (6, 76, 2, 0.26),
        (8, 74, 2, 0.26), (10, 72, 2, 0.24), (12, 71, 2, 0.24), (14, 72, 2, 0.26),
        (16, 76, 2, 0.28), (18, 79, 2, 0.26), (20, 84, 4, 0.24), (24, 81, 2, 0.24), (26, 79, 2, 0.22), (28, 76, 4, 0.26),
    ]),
    "together": piece(64, [
        (0, 48, "M", 4, 0.22), (4, 45, "m", 4, 0.2), (8, 41, "M", 4, 0.2), (12, 43, "M", 4, 0.2),
        (16, 48, "M", 4, 0.22), (20, 45, "m7", 4, 0.18), (24, 41, "M", 4, 0.2), (28, 48, "M", 4, 0.22),
    ], [
        (0, 76, 2, 0.3), (2, 79, 2, 0.28), (4, 81, 3, 0.26), (8, 83, 4, 0.24),
        (14, 79, 4, 0.22), (20, 84, 4, 0.24), (26, 81, 2, 0.22), (28, 84, 4, 0.26),
    ]),
}


def piano(freq, dur, vel, chord):
    count = max(8, int(SR * dur))
    t = np.arange(count, dtype=np.float32) / SR
    wave = np.zeros(count, dtype=np.float32)
    # Soft upright: chords keep a low bloom, melody stays a little clearer.
    partials = 4 if chord else 5
    stiffness = 0.00008
    for partial in range(1, partials + 1):
        stretched = freq * partial * np.sqrt(1 + stiffness * partial * partial)
        rate = (0.16 + 0.28 * partial) * (0.42 if chord else 0.72)
        decay = np.exp(-t * rate)
        weight = vel * (0.8 / partial) * (0.85 if chord else 1)
        wave += weight * decay * np.sin(2 * np.pi * stretched * t)
    attack = min(count, int(SR * 0.012))
    wave[:attack] *= np.linspace(0, 1, attack, dtype=np.float32)
    return wave


def pad(freq, dur, vel):
    """A held tone so a long chord does not decay into silence."""
    count = max(8, int(SR * dur))
    t = np.arange(count, dtype=np.float32) / SR
    edge = min(count // 5, int(SR * 0.6))
    env = np.ones(count, dtype=np.float32)
    if edge > 1:
        env[:edge] *= np.linspace(0, 1, edge, dtype=np.float32)
        env[-edge:] *= np.linspace(1, 0, edge, dtype=np.float32)
    wave = vel * np.sin(2 * np.pi * freq * t)
    wave += vel * 0.28 * np.sin(2 * np.pi * freq * 2 * t)
    return wave * env


def soften(channel):
    # One-pole lowpass around 1.6 kHz, so the bed stays under the voice.
    coeff = 0.2
    out = np.empty_like(channel)
    acc = 0.0
    for index, sample in enumerate(channel):
        acc += coeff * (sample - acc)
        out[index] = acc
    return out


def crossfade_loop(stereo, seconds=2.4):
    fade = int(SR * seconds)
    if len(stereo) <= fade * 2:
        return stereo
    ramp = np.linspace(0, 1, fade, dtype=np.float32)[:, None]
    head = stereo[:fade].copy()
    tail = stereo[-fade:].copy()
    body = stereo[:-fade]
    body[:fade] = head * ramp + tail * (1 - ramp)
    return body


def place(mix, body, index):
    end = min(len(mix), index + len(body))
    if end <= index:
        return
    mix[index:end] += body[: end - index]


def expand(bars, events):
    """Play the phrase twice so the loop is a bed, not a short figure."""
    span = bars * 4
    longer = list(events)
    for start, notes, vel, beats, chord in events:
        longer.append((start + span, notes, vel * 0.94, beats, chord))
    return bars * 2, longer


def render(name, bpm, bars, events):
    bars, events = expand(bars, events)
    beat = 60 / bpm
    length = int(SR * (bars * 4 * beat + 3.2))
    left = np.zeros(length, dtype=np.float32)
    right = np.zeros(length, dtype=np.float32)
    rng = np.random.default_rng(zlib.adler32(name.encode()) % (2**32))
    for start, notes, vel, beats, chord in events:
        # Chords hang across the bar so the scene is never a beep in silence.
        dur = max(1.8, beats * beat * (2.6 if chord else 1.25))
        when = start * beat + float(rng.normal(0, 0.006 if chord else 0.01))
        if chord:
            order = [notes[0], notes[-1], notes[min(1, len(notes) - 1)]]
            for step, midi in enumerate(order):
                freq = 440 * 2 ** ((midi - 69) / 12)
                body = piano(freq, dur, min(0.22, vel * 0.85), True)
                index = max(0, int(SR * (when + step * beat * 0.35)))
                place(left if step != 1 else right, body, index)
                place(right if step != 1 else left, body * 0.78, index + int(SR * 0.001))
            held = max(beat * beats, 1.2)
            for midi in notes:
                freq = 440 * 2 ** ((midi - 69) / 12)
                body = pad(freq, held, min(0.07, vel * 0.35))
                index = max(0, int(SR * when))
                place(left, body, index)
                place(right, body * 0.9, index)
            root = 440 * 2 ** ((notes[0] - 12 - 69) / 12)
            pedal = pad(root, held * 1.05, min(0.05, vel * 0.28))
            pedal_at = max(0, int(SR * when))
            place(left, pedal, pedal_at)
            place(right, pedal * 0.85, pedal_at)
        else:
            shaped = vel * (0.55 if beats >= 3 else 0.62)
            freq = 440 * 2 ** ((notes[0] - 69) / 12)
            body = piano(freq, dur, shaped, False)
            index = max(0, int(SR * when))
            place(left, body * 0.9, index)
            detuned = piano(freq * 1.0012, dur, shaped * 0.82, False)
            place(right, detuned, index + int(SR * 0.006))
    mix_l = soften(left)
    mix_r = soften(right)
    for ear in (mix_l, mix_r):
        delayed = np.zeros_like(ear)
        for delay, gain in ((int(SR * 0.037), 0.22), (int(SR * 0.081), 0.1)):
            delayed[delay:] += ear[:-delay] * gain
        ear += delayed
    stereo = np.stack([mix_l, mix_r], axis=1)
    peak = np.max(np.abs(stereo)) or 1
    # 0.46 sat under dialogue and read as silence on laptop speakers.
    stereo = stereo / peak * 0.90
    stereo = crossfade_loop(stereo)
    raw = OUT / f"{name}.f32"
    stereo.astype(np.float32).tofile(raw)
    dest = OUT / f"{name}.mp3"
    subprocess.run(
        [
            "ffmpeg", "-y", "-f", "f32le", "-ar", str(SR), "-ac", "2", "-i", str(raw),
            "-codec:a", "libmp3lame", "-q:a", "4", str(dest),
        ],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    raw.unlink()
    print(name, dest.stat().st_size)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for name, (bpm, bars, events) in PIECES.items():
        render(name, bpm, bars, events)
    print("tracks", len(PIECES))


if __name__ == "__main__":
    main()
