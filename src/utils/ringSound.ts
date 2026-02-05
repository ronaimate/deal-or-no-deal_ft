let audioContext: AudioContext | null = null;
let ringInterval: ReturnType<typeof setInterval> | null = null;
let ringOscillator: OscillatorNode | null = null;
let ringGain: GainNode | null = null;

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
 * Klasszikus telefon csengés: két frekvencia váltakozik.
 * ~2.5 másodig játszik, majd leáll.
 */
export function playRingSound(durationMs: number = 2500): () => void {
  const ctx = getAudioContext();
  if (!ctx) return () => {};

  const resume = (): AudioContext | null => {
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  try {
    resume();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    gain.gain.value = 0.15;

    ringOscillator = osc;
    ringGain = gain;

    let phase = 0;
    const toggle = () => {
      phase = 1 - phase;
      osc.frequency.setTargetAtTime(phase ? 600 : 400, ctx.currentTime, 0.02);
    };

    osc.start(ctx.currentTime);
    toggle();
    ringInterval = setInterval(toggle, 500);

    const t = setTimeout(stopRingSound, durationMs);

    return () => {
      clearTimeout(t);
      stopRingSound();
    };
  } catch {
    return () => {};
  }
}

export function stopRingSound(): void {
  if (ringInterval !== null) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  if (ringOscillator) {
    try {
      ringOscillator.stop();
    } catch {
      // ignore
    }
    ringOscillator = null;
  }
  ringGain = null;
}
