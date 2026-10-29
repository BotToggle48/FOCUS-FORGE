import { SoundEffectId } from '../types/atlas';

/**
 * Multi-track Procedural Web Audio Engine.
 * Allows playing multiple ambient tracks simultaneously (e.g. Rain + Campfire + Vinyl Crackle).
 */
class ProAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private activeTracks: Map<SoundEffectId, { gain: GainNode; stop: () => void }> = new Map();
  private masterVolume: number = 0.6;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    if (!this.masterGain) {
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  // Create pink/brown noise buffer for natural elements (rain, ocean, wind)
  private createNoiseBuffer(ctx: AudioContext, seconds = 4): AudioBuffer {
    const bufferSize = ctx.sampleRate * seconds;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.12;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  public isTrackActive(id: SoundEffectId): boolean {
    return this.activeTracks.has(id);
  }

  public getActiveTrackCount(): number {
    return this.activeTracks.size;
  }

  public getActiveTrackIds(): SoundEffectId[] {
    return Array.from(this.activeTracks.keys());
  }

  public toggleTrack(id: SoundEffectId, volume: number = 0.5): boolean {
    if (this.activeTracks.has(id)) {
      this.stopTrack(id);
      return false;
    } else {
      this.startTrack(id, volume);
      return true;
    }
  }

  public startTrack(id: SoundEffectId, volume: number = 0.5) {
    if (this.activeTracks.has(id)) return;

    try {
      const ctx = this.getContext();
      const trackGain = ctx.createGain();
      trackGain.gain.setValueAtTime(0.001, ctx.currentTime);
      trackGain.gain.linearRampToValueAtTime(Math.max(0.05, volume), ctx.currentTime + 0.8);
      trackGain.connect(this.masterGain!);

      let stopFn: () => void = () => {};

      if (id === 'rain') {
        const buffer = this.createNoiseBuffer(ctx, 4);
        const src = ctx.createBufferSource();
        src.buffer = buffer;
        src.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        src.connect(filter);
        filter.connect(trackGain);
        src.start();

        stopFn = () => {
          try { src.stop(); } catch {}
        };
      } else if (id === 'thunder') {
        let isRunning = true;
        const triggerThunder = () => {
          if (!isRunning) return;
          try {
            const buf = this.createNoiseBuffer(ctx, 3);
            const src = ctx.createBufferSource();
            src.buffer = buf;
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(180, ctx.currentTime);
            const boomGain = ctx.createGain();
            boomGain.gain.setValueAtTime(0.01, ctx.currentTime);
            boomGain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + 0.3);
            boomGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.0);
            src.connect(filter);
            filter.connect(boomGain);
            boomGain.connect(trackGain);
            src.start();
          } catch {}

          if (isRunning) {
            setTimeout(triggerThunder, 8000 + Math.random() * 10000);
          }
        };
        const timerId = setTimeout(triggerThunder, 2000);
        stopFn = () => {
          isRunning = false;
          clearTimeout(timerId);
        };
      } else if (id === 'forest') {
        const buffer = this.createNoiseBuffer(ctx, 4);
        const wind = ctx.createBufferSource();
        wind.buffer = buffer;
        wind.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, ctx.currentTime);
        wind.connect(filter);
        filter.connect(trackGain);
        wind.start();

        let isRunning = true;
        const triggerChirp = () => {
          if (!isRunning) return;
          try {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            const f = 2500 + Math.random() * 800;
            const t = ctx.currentTime;
            osc.frequency.setValueAtTime(f, t);
            osc.frequency.exponentialRampToValueAtTime(f + 600, t + 0.08);
            osc.frequency.exponentialRampToValueAtTime(f + 200, t + 0.16);
            g.gain.setValueAtTime(0.001, t);
            g.gain.linearRampToValueAtTime(0.15, t + 0.02);
            g.gain.exponentialRampToValueAtTime(0.001, t + 0.22);
            osc.connect(g);
            g.connect(trackGain);
            osc.start(t);
            osc.stop(t + 0.25);
          } catch {}
          if (isRunning) {
            setTimeout(triggerChirp, 3000 + Math.random() * 5000);
          }
        };
        const chirpTimer = setTimeout(triggerChirp, 1500);
        stopFn = () => {
          isRunning = false;
          clearTimeout(chirpTimer);
          try { wind.stop(); } catch {}
        };
      } else if (id === 'waves') {
        const buffer = this.createNoiseBuffer(ctx, 6);
        const surf = ctx.createBufferSource();
        surf.buffer = buffer;
        surf.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(400, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        surf.connect(filter);
        filter.connect(trackGain);
        surf.start();
        lfo.start();

        stopFn = () => {
          try { surf.stop(); } catch {}
          try { lfo.stop(); } catch {}
        };
      } else if (id === 'fire') {
        const buf = this.createNoiseBuffer(ctx, 3);
        const hiss = ctx.createBufferSource();
        hiss.buffer = buf;
        hiss.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1200, ctx.currentTime);
        filter.Q.setValueAtTime(1.5, ctx.currentTime);
        hiss.connect(filter);
        filter.connect(trackGain);
        hiss.start();

        let isRunning = true;
        const triggerPop = () => {
          if (!isRunning) return;
          try {
            const popBuf = ctx.createBuffer(1, 400, ctx.sampleRate);
            const data = popBuf.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 80);
            const pop = ctx.createBufferSource();
            pop.buffer = popBuf;
            const popGain = ctx.createGain();
            popGain.gain.setValueAtTime(0.3, ctx.currentTime);
            pop.connect(popGain);
            popGain.connect(trackGain);
            pop.start();
          } catch {}
          if (isRunning) {
            setTimeout(triggerPop, 400 + Math.random() * 1200);
          }
        };
        const popTimer = setTimeout(triggerPop, 500);
        stopFn = () => {
          isRunning = false;
          clearTimeout(popTimer);
          try { hiss.stop(); } catch {}
        };
      } else if (id === 'cafe') {
        const buf = this.createNoiseBuffer(ctx, 4);
        const murmur = ctx.createBufferSource();
        murmur.buffer = buf;
        murmur.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(600, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);
        murmur.connect(filter);
        filter.connect(trackGain);
        murmur.start();
        stopFn = () => {
          try { murmur.stop(); } catch {}
        };
      } else if (id === 'noise') {
        const buf = this.createNoiseBuffer(ctx, 4);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        noise.loop = true;
        noise.connect(trackGain);
        noise.start();
        stopFn = () => {
          try { noise.stop(); } catch {}
        };
      } else if (id === 'vinyl') {
        const buf = this.createNoiseBuffer(ctx, 2);
        const crackle = ctx.createBufferSource();
        crackle.buffer = buf;
        crackle.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.setValueAtTime(3500, ctx.currentTime);
        crackle.connect(filter);
        filter.connect(trackGain);
        crackle.start();
        stopFn = () => {
          try { crackle.stop(); } catch {}
        };
      } else if (id === 'night') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(4500, ctx.currentTime);
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(4, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(0.08, ctx.currentTime);
        const cricketGain = ctx.createGain();
        cricketGain.gain.setValueAtTime(0.04, ctx.currentTime);
        lfo.connect(cricketGain.gain);
        osc.connect(cricketGain);
        cricketGain.connect(trackGain);
        osc.start();
        lfo.start();
        stopFn = () => {
          try { osc.stop(); } catch {}
          try { lfo.stop(); } catch {}
        };
      } else if (id === 'bell') {
        let isRunning = true;
        const triggerBell = () => {
          if (!isRunning) return;
          try {
            const freqs = [432, 864, 1296];
            freqs.forEach((freq, idx) => {
              const o = ctx.createOscillator();
              const g = ctx.createGain();
              o.type = 'sine';
              o.frequency.setValueAtTime(freq, ctx.currentTime);
              g.gain.setValueAtTime([0.4, 0.15, 0.05][idx], ctx.currentTime);
              g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);
              o.connect(g);
              g.connect(trackGain);
              o.start();
              o.stop(ctx.currentTime + 5);
            });
          } catch {}
          if (isRunning) {
            setTimeout(triggerBell, 12000 + Math.random() * 8000);
          }
        };
        const bellTimer = setTimeout(triggerBell, 1000);
        stopFn = () => {
          isRunning = false;
          clearTimeout(bellTimer);
        };
      } else if (id === 'keyboard') {
        let isRunning = true;
        const triggerKeys = () => {
          if (!isRunning) return;
          try {
            const kBuf = ctx.createBuffer(1, 300, ctx.sampleRate);
            const data = kBuf.getChannelData(0);
            for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 40);
            const k = ctx.createBufferSource();
            k.buffer = kBuf;
            const kg = ctx.createGain();
            kg.gain.setValueAtTime(0.2, ctx.currentTime);
            k.connect(kg);
            kg.connect(trackGain);
            k.start();
          } catch {}
          if (isRunning) {
            const nextKey = Math.random() > 0.3 ? 120 + Math.random() * 150 : 800 + Math.random() * 1200;
            setTimeout(triggerKeys, nextKey);
          }
        };
        const kTimer = setTimeout(triggerKeys, 500);
        stopFn = () => {
          isRunning = false;
          clearTimeout(kTimer);
        };
      } else if (id === 'fan') {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, ctx.currentTime);
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.1, ctx.currentTime);
        const buf = this.createNoiseBuffer(ctx, 3);
        const noise = ctx.createBufferSource();
        noise.buffer = buf;
        noise.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(trackGain);
        noise.connect(filter);
        filter.connect(trackGain);
        osc.start();
        noise.start();
        stopFn = () => {
          try { osc.stop(); } catch {}
          try { noise.stop(); } catch {}
        };
      } else if (id === 'stream') {
        const buf = this.createNoiseBuffer(ctx, 4);
        const stream = ctx.createBufferSource();
        stream.buffer = buf;
        stream.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, ctx.currentTime);
        filter.Q.setValueAtTime(2.0, ctx.currentTime);
        stream.connect(filter);
        filter.connect(trackGain);
        stream.start();
        stopFn = () => {
          try { stream.stop(); } catch {}
        };
      } else if (id === 'wind') {
        const buf = this.createNoiseBuffer(ctx, 5);
        const wind = ctx.createBufferSource();
        wind.buffer = buf;
        wind.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(250, ctx.currentTime);
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.15, ctx.currentTime);
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(150, ctx.currentTime);
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        wind.connect(filter);
        filter.connect(trackGain);
        wind.start();
        lfo.start();
        stopFn = () => {
          try { wind.stop(); } catch {}
          try { lfo.stop(); } catch {}
        };
      }

      this.activeTracks.set(id, { gain: trackGain, stop: stopFn });
    } catch (err) {
      console.warn('Track audio initialization error:', err);
    }
  }

  public stopTrack(id: SoundEffectId) {
    const track = this.activeTracks.get(id);
    if (track) {
      track.stop();
      if (this.ctx) {
        try {
          track.gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
        } catch {}
      }
      this.activeTracks.delete(id);
    }
  }

  public stopAll() {
    this.activeTracks.forEach((track) => {
      track.stop();
    });
    this.activeTracks.clear();
  }

  public setMasterVolume(volume: number) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.ctx.currentTime, 0.1);
    }
  }
}

export const proAudio = new ProAudioEngine();
