/**
 * Web Audio API synthesizer for authentic pottery resonance sound effects.
 * Generates natural harmonic ceramic bell chimes and kick-wheel swooshes without external assets.
 */

class CeramicSoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Plays a sustained crystalline or earthy ceramic chime note
   */
  public playCeramicChime(frequency = 520, decay = 1.8, isEarthy = false) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const oscHarmonic = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      // Filter settings for warm ceramic body
      filter.type = isEarthy ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(frequency * 1.5, now);
      filter.Q.setValueAtTime(isEarthy ? 3 : 8, now);

      // Primary tone
      osc.type = isEarthy ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(frequency, now);

      // Secondary overtone (natural ceramic resonance mode)
      oscHarmonic.type = 'sine';
      oscHarmonic.frequency.setValueAtTime(frequency * 2.76, now);

      // Gain envelope
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.18, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + decay);

      osc.connect(filter);
      oscHarmonic.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      oscHarmonic.start(now);
      osc.stop(now + decay);
      oscHarmonic.stop(now + decay);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Soft sliding card transition sound
   */
  public playSlideSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.08);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.04, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Cinematic shutter aperture opening resonance sound effect
   */
  public playShutterOpenSound() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      
      // Sweep oscillator for air/shutter movement
      const sweepOsc = this.ctx.createOscillator();
      const sweepGain = this.ctx.createGain();
      const sweepFilter = this.ctx.createBiquadFilter();

      sweepFilter.type = 'lowpass';
      sweepFilter.frequency.setValueAtTime(300, now);
      sweepFilter.frequency.exponentialRampToValueAtTime(2400, now + 0.4);

      sweepOsc.type = 'sine';
      sweepOsc.frequency.setValueAtTime(120, now);
      sweepOsc.frequency.exponentialRampToValueAtTime(560, now + 0.35);

      sweepGain.gain.setValueAtTime(0.001, now);
      sweepGain.gain.exponentialRampToValueAtTime(0.12, now + 0.08);
      sweepGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);

      sweepOsc.connect(sweepFilter);
      sweepFilter.connect(sweepGain);
      sweepGain.connect(this.ctx.destination);

      sweepOsc.start(now);
      sweepOsc.stop(now + 0.5);

      // Resonant harmonic chime upon complete unveil
      setTimeout(() => {
        this.playCeramicChime(587.33, 2.2, false); // D5 chime
      }, 180);
    } catch {
      // Audio autoplay policy fallback
    }
  }
}

export const ceramicAudio = new CeramicSoundEngine();
