// Audio service for Rock and Birra y Zombis
// Handles audio streaming, Web Audio API synthesis for SFX and visualizer frequency data

class SoundFXService {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  public analyser: AnalyserNode | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.8;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Realistic beer bottle pop & fizz sound
  public playBeerPop() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      // High pressure pop impulse
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.08);

      oscGain.gain.setValueAtTime(0.7 * this.volume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(oscGain);
      oscGain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.09);

      // Beer carbonation fizz (white noise burst)
      const bufferSize = this.ctx.sampleRate * 0.35;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, now);
      filter.Q.setValueAtTime(3.0, now);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.5 * this.volume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.masterGain);
      noise.start(now + 0.02);
    } catch (e) {
      console.warn('Audio SFX error', e);
    }
  }

  // Electric rock guitar power chord distortion (E5 / A5 chord with fuzz)
  public playGuitarRiff(frequency: number = 164.81) { // E3 default
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const duration = 0.65;

      // Chord frequencies: Root, 5th, Octave
      const freqs = [frequency, frequency * 1.498, frequency * 2];

      freqs.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sawtooth' : 'square';
        osc.frequency.setValueAtTime(freq, now);

        // Subtle vibrato
        osc.frequency.linearRampToValueAtTime(freq * 0.98, now + duration);

        // Distortion curve
        const waveShaper = this.ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1;
          curve[i] = (Math.PI + 3) * x / (Math.PI + 3 * Math.abs(x));
        }
        waveShaper.curve = curve;

        // Bandpass to sound like a cranked Marshall guitar amp
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2400, now);
        filter.frequency.exponentialRampToValueAtTime(800, now + duration);

        gain.gain.setValueAtTime(0.35 * this.volume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(waveShaper);
        waveShaper.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
      });
    } catch (e) {
      console.warn('Guitar audio error', e);
    }
  }

  // Creepy guttural zombie moan
  public playZombieGroan() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const duration = 0.7;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      osc.frequency.setValueAtTime(85, now);
      osc.frequency.linearRampToValueAtTime(65, now + 0.3);
      osc.frequency.linearRampToValueAtTime(50, now + duration);

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(350, now);
      filter.Q.setValueAtTime(4.0, now);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.4 * this.volume, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Zombie audio error', e);
    }
  }

  // Arcade laser / guitar shockwave shot
  public playLaserShot() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.18);

      gain.gain.setValueAtTime(0.3 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.19);
    } catch (e) {
      console.warn('Laser sound error', e);
    }
  }

  // Bottle shatter / explosion
  public playBottleSmash() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.06));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(2500, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.5 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch (e) {
      console.warn('Smash sound error', e);
    }
  }

  // Station Station ID Jingle Chime
  public playStationID() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const notes = [220, 277.18, 329.63, 440, 554.37]; // A major arpeggio
      notes.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.3 * this.volume, now + idx * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.45);
      });
    } catch (e) {
      console.warn('Station ID sound error', e);
    }
  }

  // DJ Siren / Nuclear alarm drop
  public playSirens() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';

      // Pitch sweep up and down
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.linearRampToValueAtTime(800, now + 0.25);
      osc.frequency.linearRampToValueAtTime(400, now + 0.5);
      osc.frequency.linearRampToValueAtTime(850, now + 0.75);
      osc.frequency.linearRampToValueAtTime(300, now + 1.0);

      gain.gain.setValueAtTime(0.35 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 1.0);
    } catch (e) {
      console.warn('Siren sound error', e);
    }
  }

  // Crowd applause / cheers
  public playApplause() {
    try {
      this.initContext();
      if (!this.ctx || !this.masterGain) return;

      const now = this.ctx.currentTime;
      const bufferSize = this.ctx.sampleRate * 1.5;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        // Clapping impulses
        const clap = Math.random() > 0.985 ? (Math.random() * 2 - 1) * 3 : (Math.random() * 0.4 - 0.2);
        data[i] = clap * Math.sin((i / bufferSize) * Math.PI);
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(1.2, now);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.4 * this.volume, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 1.45);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      noise.start(now);
    } catch (e) {
      console.warn('Applause sound error', e);
    }
  }
}

export const soundFX = new SoundFXService();
