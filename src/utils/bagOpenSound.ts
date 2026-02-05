let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

/**
 * Vidám hang: alacsony összeg (1M alatt) – rövid, felfelé menő dúr hangok.
 */
export function playCheerfulSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    gain.gain.value = 0.2;

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(262, now);
    osc.frequency.setValueAtTime(330, now + 0.08);
    osc.frequency.setValueAtTime(392, now + 0.16);
    osc.frequency.setValueAtTime(523, now + 0.24);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.4);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // ignore
  }
}

/**
 * Tragikus hang: magas összeg (1M felett) – lefelé menő, lassú moll hangok.
 */
export function playTragicSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    gain.gain.value = 0.18;

    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(392, now);
    osc.frequency.setValueAtTime(311, now + 0.15);
    osc.frequency.setValueAtTime(262, now + 0.3);
    osc.frequency.setValueAtTime(208, now + 0.45);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.linearRampToValueAtTime(0, now + 0.7);

    osc.start(now);
    osc.stop(now + 0.75);
  } catch {
    // ignore
  }
}

const ONE_MILLION = 1_000_000;

/**
 * Táska érték alapján: 1M alatt vidám, 1M felett tragikus hang.
 */
export function playBagOpenSound(value: number): void {
  if (value >= ONE_MILLION) {
    playTragicSound();
  } else {
    playCheerfulSound();
  }
}
