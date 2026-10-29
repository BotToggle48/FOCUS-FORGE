// Web Audio API procedural sound engine: zero external file dependencies, perfectly reliable!

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNodes: { stop: () => void }[] = [];
  private currentAmbient: string = 'none';

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Play session complete chime
  public playChime(type: 'bowl' | 'marimba' | 'beep' | 'gong' = 'bowl', volume: number = 0.8) {
    try {
      const ctx = this.getContext();
      const master = ctx.createGain();
      master.gain.setValueAtTime(Math.max(0.01, Math.min(1, volume)), ctx.currentTime);
      master.connect(ctx.destination);

      const now = ctx.currentTime;

      if (type === 'bowl') {
        // Tibetan singing bowl harmonics
        const freqs = [432, 864, 1296, 2160];
        const gains = [0.6, 0.25, 0.12, 0.05];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          
          g.gain.setValueAtTime(gains[idx], now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
          
          osc.connect(g);
          g.connect(master);
          osc.start(now);
          osc.stop(now + 4);
        });
      } else if (type === 'marimba') {
        // Melodic 3-note ascending marimba
        const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
        notes.forEach((f, i) => {
          const noteTime = now + i * 0.14;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, noteTime);
          
          g.gain.setValueAtTime(0.5, noteTime);
          g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.6);
          
          osc.connect(g);
          g.connect(master);
          osc.start(noteTime);
          osc.stop(noteTime + 0.7);
        });
      } else if (type === 'beep') {
        // Digital clean double-ping
        [880, 1174.66].forEach((f, i) => {
          const noteTime = now + i * 0.12;
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, noteTime);
          
          g.gain.setValueAtTime(0.4, noteTime);
          g.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.35);
          
          osc.connect(g);
          g.connect(master);
          osc.start(noteTime);
          osc.stop(noteTime + 0.4);
        });
      } else if (type === 'gong') {
        // Deep resonant gong
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const g1 = ctx.createGain();
        const g2 = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(140, now);
        osc1.frequency.exponentialRampToValueAtTime(130, now + 3);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(280, now);

        g1.gain.setValueAtTime(0.6, now);
        g1.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);

        g2.gain.setValueAtTime(0.3, now);
        g2.gain.exponentialRampToValueAtTime(0.0001, now + 3.0);

        osc1.connect(g1);
        osc2.connect(g2);
        g1.connect(master);
        g2.connect(master);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 4.6);
        osc2.stop(now + 4.6);
      }
    } catch (err) {
      console.warn('Audio playback not permitted or supported yet:', err);
    }
  }

  // Create noise buffer (pink/brown noise for rain, ocean, wind)
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
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.1;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  // Start continuous ambient generator
  public startAmbient(type: 'none' | 'rain' | 'lofi' | 'nature' | 'waves' | 'cafe', volume: number = 0.5) {
    this.stopAmbient();
    if (type === 'none') {
      this.currentAmbient = 'none';
      return;
    }

    try {
      const ctx = this.getContext();
      this.currentAmbient = type;

      const master = ctx.createGain();
      master.gain.setValueAtTime(0.001, ctx.currentTime);
      master.gain.linearRampToValueAtTime(Math.max(0.01, volume), ctx.currentTime + 1.2);
      master.connect(ctx.destination);
      this.ambientGain = master;

      if (type === 'rain') {
        // Multi-layered filtered noise for rain
        const buffer = this.createNoiseBuffer(ctx, 4);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, ctx.currentTime);

        const filter2 = ctx.createBiquadFilter();
        filter2.type = 'bandpass';
        filter2.frequency.setValueAtTime(1400, ctx.currentTime);
        filter2.Q.setValueAtTime(1.2, ctx.currentTime);

        const rainGain = ctx.createGain();
        rainGain.gain.setValueAtTime(0.7, ctx.currentTime);

        noise.connect(filter);
        filter.connect(rainGain);
        rainGain.connect(master);
        noise.start();

        this.ambientNodes.push({
          stop: () => {
            try { noise.stop(); } catch {}
          }
        });
      } else if (type === 'lofi') {
        // Warm vinyl crackle + smooth jazz drone (Fmaj9 chord)
        const chordFreqs = [174.61, 220.00, 261.63, 329.63, 392.00]; // F3, A3, C4, E4, G4
        const chordGain = ctx.createGain();
        chordGain.gain.setValueAtTime(0.12, ctx.currentTime);
        chordGain.connect(master);

        const oscs: OscillatorNode[] = [];
        chordFreqs.forEach((freq) => {
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          // Subtle detune for warmth
          osc.detune.setValueAtTime((Math.random() - 0.5) * 8, ctx.currentTime);
          
          osc.connect(chordGain);
          osc.start();
          oscs.push(osc);
        });

        // Soft vinyl dust noise
        const buffer = this.createNoiseBuffer(ctx, 3);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;
        const noiseFilter = ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(3000, ctx.currentTime);
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.04, ctx.currentTime);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(master);
        noise.start();

        this.ambientNodes.push({
          stop: () => {
            oscs.forEach(o => { try { o.stop(); } catch {} });
            try { noise.stop(); } catch {}
          }
        });
      } else if (type === 'nature') {
        // Forest wind + gentle procedural chirps
        const buffer = this.createNoiseBuffer(ctx, 4);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const windGain = ctx.createGain();
        windGain.gain.setValueAtTime(0.4, ctx.currentTime);

        noise.connect(filter);
        filter.connect(windGain);
        windGain.connect(master);
        noise.start();

        // Birdsong timer
        let isRunning = true;
        const triggerChirp = () => {
          if (!isRunning) return;
          try {
            const chirpOsc = ctx.createOscillator();
            const chirpGain = ctx.createGain();
            chirpOsc.type = 'sine';
            const baseFreq = 2400 + Math.random() * 800;
            const nowTime = ctx.currentTime;
            
            chirpOsc.frequency.setValueAtTime(baseFreq, nowTime);
            chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq + 700, nowTime + 0.08);
            chirpOsc.frequency.exponentialRampToValueAtTime(baseFreq + 200, nowTime + 0.16);

            chirpGain.gain.setValueAtTime(0.001, nowTime);
            chirpGain.gain.linearRampToValueAtTime(0.06, nowTime + 0.03);
            chirpGain.gain.exponentialRampToValueAtTime(0.001, nowTime + 0.2);

            chirpOsc.connect(chirpGain);
            chirpGain.connect(master);
            chirpOsc.start(nowTime);
            chirpOsc.stop(nowTime + 0.25);
          } catch {}

          if (isRunning) {
            const nextIn = 3500 + Math.random() * 4500;
            setTimeout(triggerChirp, nextIn);
          }
        };

        const timeoutId = setTimeout(triggerChirp, 2000);

        this.ambientNodes.push({
          stop: () => {
            isRunning = false;
            clearTimeout(timeoutId);
            try { noise.stop(); } catch {}
          }
        });
      } else if (type === 'waves') {
        // Ocean waves with swell filter modulation
        const buffer = this.createNoiseBuffer(ctx, 6);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        // LFO for wave swells
        const lfo = ctx.createOscillator();
        lfo.frequency.setValueAtTime(0.12, ctx.currentTime); // ~8 sec wave period
        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(450, ctx.currentTime);

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.65, ctx.currentTime);

        noise.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(master);

        noise.start();
        lfo.start();

        this.ambientNodes.push({
          stop: () => {
            try { noise.stop(); } catch {}
            try { lfo.stop(); } catch {}
          }
        });
      } else if (type === 'cafe') {
        // Warm cafe acoustic murmur simulation
        const buffer = this.createNoiseBuffer(ctx, 4);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(650, ctx.currentTime);
        filter.Q.setValueAtTime(0.8, ctx.currentTime);

        // Soft coffee machine steam / gentle drone
        const humOsc = ctx.createOscillator();
        humOsc.type = 'triangle';
        humOsc.frequency.setValueAtTime(110, ctx.currentTime);
        const humGain = ctx.createGain();
        humGain.gain.setValueAtTime(0.04, ctx.currentTime);
        humOsc.connect(humGain);
        humGain.connect(master);

        const cafeGain = ctx.createGain();
        cafeGain.gain.setValueAtTime(0.45, ctx.currentTime);

        noise.connect(filter);
        filter.connect(cafeGain);
        cafeGain.connect(master);

        noise.start();
        humOsc.start();

        this.ambientNodes.push({
          stop: () => {
            try { noise.stop(); } catch {}
            try { humOsc.stop(); } catch {}
          }
        });
      }
    } catch (err) {
      console.warn('Ambient audio could not be initialized:', err);
    }
  }

  // Adjust ambient volume dynamically
  public setAmbientVolume(volume: number) {
    if (this.ambientGain && this.ctx) {
      this.ambientGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime, 0.1);
    }
  }

  // Stop current ambient sound
  public stopAmbient() {
    this.ambientNodes.forEach(node => node.stop());
    this.ambientNodes = [];
    if (this.ambientGain && this.ctx) {
      try {
        this.ambientGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {}
    }
    this.ambientGain = null;
    this.currentAmbient = 'none';
  }

  public getCurrentAmbient() {
    return this.currentAmbient;
  }
}

export const soundEngine = new SoundEngine();
