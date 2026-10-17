// Procedural Rock/Psychobilly Radio Engine and Stream Player
// Guarantees endless rock music playback with zero dead air, even offline or if external stream is unavailable.

export interface StreamOption {
  id: string;
  name: string;
  genre: string;
  url?: string;
  isProcedural?: boolean;
  bitrate: string;
}

export const RADIO_STREAMS: StreamOption[] = [
  {
    id: 'rock-and-birra-live',
    name: 'Rock and Birra - Señal Principal',
    genre: 'Psychobilly / Punk / Rock Indie',
    url: 'https://stream.laut.fm/rock-station',
    bitrate: '192 kbps HD'
  },
  {
    id: 'psychobilly-zombi-synth',
    name: 'Estudio Zombi FM (Live Band Procedural)',
    genre: 'Psychobilly & Horror Punk Riffs',
    isProcedural: true,
    bitrate: '320 kbps Studio Pure'
  },
  {
    id: 'garage-valpo',
    name: 'Garaje y Birra Valparaíso',
    genre: 'Garage Rock / Post-Punk / Surf',
    url: 'https://stream-relay-geo.ntslive.net/stream',
    bitrate: '128 kbps Stereo'
  }
];

class RockRadioEngine {
  private audioEl: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private sourceNode: MediaElementAudioSourceNode | null = null;
  private masterGain: GainNode | null = null;

  // Procedural Band State
  private isPlayingProcedural: boolean = false;
  private proceduralInterval: number | null = null;
  private step: number = 0;
  private bpm: number = 144; // Fast punk/psychobilly tempo

  // Radio state listeners
  private onStateChangeCallbacks: Set<(isPlaying: boolean, currentTrack: string) => void> = new Set();
  public isPlaying: boolean = false;
  public currentStream: StreamOption = RADIO_STREAMS[0];
  public currentTrackTitle: string = 'Voodoo Zombie - Camino de Sangre';
  public currentArtist: string = 'Voodoo Zombie';

  constructor() {
    // Lazy init audio element
    if (typeof window !== 'undefined') {
      this.audioEl = new Audio();
      this.audioEl.crossOrigin = 'anonymous';
      this.audioEl.preload = 'none';

      this.audioEl.addEventListener('playing', () => {
        this.isPlaying = true;
        this.notifyState();
      });

      this.audioEl.addEventListener('pause', () => {
        if (!this.isPlayingProcedural) {
          this.isPlaying = false;
          this.notifyState();
        }
      });

      this.audioEl.addEventListener('error', () => {
        console.warn('External stream encountered error, auto-switching to Psychobilly Studio Synthesizer fallback');
        this.fallbackToProcedural();
      });
    }
  }

  public subscribe(cb: (isPlaying: boolean, currentTrack: string) => void) {
    this.onStateChangeCallbacks.add(cb);
    return () => {
      this.onStateChangeCallbacks.delete(cb);
    };
  }

  private notifyState() {
    this.onStateChangeCallbacks.forEach(cb => cb(this.isPlaying, `${this.currentArtist} - ${this.currentTrackTitle}`));
  }

  private ensureAudioContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 128;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      if (this.audioEl) {
        try {
          this.sourceNode = this.ctx.createMediaElementSource(this.audioEl);
          this.sourceNode.connect(this.masterGain);
        } catch (e) {
          console.warn('Could not connect media element to Web Audio context', e);
        }
      }
    }

    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getAnalyser(): AnalyserNode | null {
    return this.analyser;
  }

  public async setStream(stream: StreamOption) {
    this.currentStream = stream;
    if (this.isPlaying) {
      await this.play();
    }
  }

  public setVolume(volume: number) {
    if (this.audioEl) {
      this.audioEl.volume = Math.max(0, Math.min(1, volume));
    }
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public async togglePlay(): Promise<boolean> {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      await this.play();
      return true;
    }
  }

  public async play(): Promise<void> {
    this.ensureAudioContext();

    if (this.currentStream.isProcedural) {
      this.stopExternalStream();
      this.startProceduralRockBand();
      this.isPlaying = true;
      this.currentTrackTitle = 'Psychobilly Riot (Live Band Session)';
      this.currentArtist = 'Rock and Birra Jam';
      this.notifyState();
      return;
    }

    // Try external stream
    if (this.currentStream.url && this.audioEl) {
      this.stopProceduralRockBand();
      this.audioEl.src = this.currentStream.url;
      try {
        await this.audioEl.play();
        this.isPlaying = true;
        this.updateTrackMetadata();
        this.notifyState();
      } catch (err) {
        console.warn('Direct stream play failed, switching to live procedural studio engine', err);
        this.fallbackToProcedural();
      }
    } else {
      this.fallbackToProcedural();
    }
  }

  public stop(): void {
    this.stopExternalStream();
    this.stopProceduralRockBand();
    this.isPlaying = false;
    this.notifyState();
  }

  private stopExternalStream() {
    if (this.audioEl) {
      this.audioEl.pause();
      this.audioEl.src = '';
    }
  }

  private fallbackToProcedural() {
    this.currentStream = RADIO_STREAMS[1]; // Procedural engine
    this.stopExternalStream();
    this.startProceduralRockBand();
    this.isPlaying = true;
    this.currentTrackTitle = 'Zombie Stomp & Birra Riff (Radio Live)';
    this.currentArtist = 'Rock & Birra Session';
    this.notifyState();
  }

  private updateTrackMetadata() {
    const tracks = [
      { artist: 'Voodoo Zombie', title: 'Camino de Sangre' },
      { artist: 'The Cramps', title: 'I Was A Teenage Werewolf' },
      { artist: 'Misfits', title: 'Dig Up Her Bones' },
      { artist: 'Fiskales Ad-Hok', title: 'Eugenia' },
      { artist: 'Los Saicos', title: 'Demolición' },
      { artist: 'Nekromantix', title: 'Gargoyles Over Copenhagen' },
      { artist: 'The Meteors', title: 'Maniac Rockers from Hell' },
      { artist: 'Macha y el Bloque Depresivo', title: 'Peineta (Versión Punk)' },
      { artist: 'Mad Sin', title: 'Psychobilly Fever' },
      { artist: 'Kadavar', title: 'Die Baby Die' },
    ];
    const picked = tracks[Math.floor(Math.random() * tracks.length)];
    this.currentArtist = picked.artist;
    this.currentTrackTitle = picked.title;
  }

  // --- PROCEDURAL PUNK / PSYCHOBILLY BAND ENGINE ---
  // Real-time dynamic sound generation: drums, slap bass, distorted guitar riffs!
  private startProceduralRockBand() {
    if (this.isPlayingProcedural) return;
    this.isPlayingProcedural = true;
    this.ensureAudioContext();

    const stepIntervalMs = (60 / this.bpm / 4) * 1000; // 16th note subdivision
    this.step = 0;

    // Psychobilly riff notes (Root: E2 / A2)
    const riffE = [164.81, 196.00, 220.00, 246.94, 220.00, 196.00, 164.81, 146.83];
    const bassE = [82.41, 82.41, 110.0, 123.47, 82.41, 82.41, 98.0, 110.0];

    this.proceduralInterval = window.setInterval(() => {
      if (!this.ctx || !this.masterGain) return;
      const t = this.ctx.currentTime;
      const s = this.step % 16;

      // 1. PUNK DRUMS:
      // Kick drum on 0, 4, 8, 10
      if (s === 0 || s === 6 || s === 8 || s === 14) {
        this.synthKick(t);
      }
      // Snare drum crack on beats 4 and 12 (standard 2 & 4)
      if (s === 4 || s === 12) {
        this.synthSnare(t);
      }
      // Hi-hat / Ride cymbal on every even step
      if (s % 2 === 0) {
        this.synthHiHat(t, s % 4 === 0);
      }

      // 2. PSYCHOBILLY SLAP BASS:
      if (s % 4 === 0 || s % 4 === 2) {
        const noteIdx = Math.floor(this.step / 4) % bassE.length;
        this.synthBass(t, bassE[noteIdx]);
      }

      // 3. ELECTRIC DISTORTION GUITAR POWER RIFF:
      if (s === 0 || s === 3 || s === 6 || s === 8 || s === 11 || s === 14) {
        const noteIdx = Math.floor(this.step / 2) % riffE.length;
        this.synthGuitarChord(t, riffE[noteIdx]);
      }

      this.step++;
    }, stepIntervalMs);
  }

  private stopProceduralRockBand() {
    this.isPlayingProcedural = false;
    if (this.proceduralInterval !== null) {
      clearInterval(this.proceduralInterval);
      this.proceduralInterval = null;
    }
  }

  private synthKick(t: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(38, t + 0.12);

    gain.gain.setValueAtTime(0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.15);
  }

  private synthSnare(t: number) {
    if (!this.ctx || !this.masterGain) return;
    // Tone body
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.exponentialRampToValueAtTime(80, t + 0.1);
    oscGain.gain.setValueAtTime(0.4, t);
    oscGain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);

    // Snare snap noise
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.04));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(900, t);
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.5, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

    osc.connect(oscGain);
    oscGain.connect(this.masterGain);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.masterGain);

    osc.start(t);
    osc.stop(t + 0.11);
    noise.start(t);
  }

  private synthHiHat(t: number, accent: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const bufferSize = this.ctx.sampleRate * (accent ? 0.08 : 0.04);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(8000, t);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(accent ? 0.25 : 0.12, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + (accent ? 0.07 : 0.035));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(t);
  }

  private synthBass(t: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, t);

    // Slap envelope
    gain.gain.setValueAtTime(0.6, t);
    gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.23);
  }

  private synthGuitarChord(t: number, freq: number) {
    if (!this.ctx || !this.masterGain) return;
    const freqs = [freq, freq * 1.498]; // Power chord root + fifth
    const duration = 0.22;

    freqs.forEach(f => {
      if (!this.ctx || !this.masterGain) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, t);

      // Distort
      const waveShaper = this.ctx.createWaveShaper();
      const curve = new Float32Array(128);
      for (let i = 0; i < 128; i++) {
        const x = (i * 2) / 128 - 1;
        curve[i] = (3 * x) / (1 + 2 * Math.abs(x));
      }
      waveShaper.curve = curve;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, t);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + duration);

      osc.connect(waveShaper);
      waveShaper.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + duration);
    });
  }
}

export const radioEngine = new RockRadioEngine();
