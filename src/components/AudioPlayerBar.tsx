import React, { useState, useEffect } from 'react';
import { radioEngine, RADIO_STREAMS, StreamOption } from '../services/rockRadioEngine';
import { soundFX } from '../services/audioService';
import { RadioVisualizer } from './RadioVisualizer';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc3,
  Sliders,
  Radio,
  RadioTower,
  Sparkles,
} from 'lucide-react';

interface AudioPlayerBarProps {
  onOpenSoundboard: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ onOpenSoundboard }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTrack, setCurrentTrack] = useState<string>('Voodoo Zombie - Camino de Sangre');
  const [currentStream, setCurrentStream] = useState<StreamOption>(radioEngine.currentStream);
  const [volume, setVolume] = useState<number>(0.85);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showStreamSelect, setShowStreamSelect] = useState<boolean>(false);

  useEffect(() => {
    const unsubscribe = radioEngine.subscribe((playing, track) => {
      setIsPlaying(playing);
      setCurrentTrack(track);
      setCurrentStream(radioEngine.currentStream);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleTogglePlay = async () => {
    soundFX.playBeerPop();
    await radioEngine.togglePlay();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (isMuted && val > 0) setIsMuted(false);
    radioEngine.setVolume(val);
    soundFX.setVolume(val);
  };

  const handleToggleMute = () => {
    const muted = !isMuted;
    setIsMuted(muted);
    radioEngine.setVolume(muted ? 0 : volume);
    soundFX.toggleMute();
  };

  const handleSelectStream = async (stream: StreamOption) => {
    soundFX.playBeerPop();
    setShowStreamSelect(false);
    await radioEngine.setStream(stream);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Track Info & Vinyl Animation */}
        <div className="flex items-center gap-3 w-full md:w-1/3 min-w-0">
          <div className="relative flex-shrink-0">
            <div
              className={`w-11 h-11 rounded-full bg-zinc-900 border-2 border-zinc-700 flex items-center justify-center shadow-lg ${isPlaying ? 'animate-spin-slow border-lime-500 shadow-lime-500/20' : ''}`}
            >
              <Disc3 className={`w-7 h-7 ${isPlaying ? 'text-lime-400' : 'text-zinc-500'}`} />
            </div>
            {isPlaying && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-lime-500"></span>
              </span>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[11px] font-mono-code">
              <span className="px-1.5 py-0.2 bg-red-600/20 border border-red-500/40 text-red-400 rounded text-[9px] font-bold animate-pulse">
                ON AIR
              </span>
              <span className="text-zinc-400 truncate">
                {currentStream.name}
              </span>
            </div>
            <div className="text-sm font-bold text-zinc-100 truncate hover:text-lime-400 transition-colors">
              {currentTrack}
            </div>
          </div>
        </div>

        {/* Center: Playback Controls & Mini Visualizer */}
        <div className="flex items-center justify-center gap-4 w-full md:w-1/3">
          <button
            onClick={handleTogglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 active:scale-90 ${isPlaying ? 'bg-lime-500 text-black hover:bg-lime-400 shadow-lime-500/30' : 'bg-red-600 text-white hover:bg-red-500 shadow-red-600/30'}`}
            title={isPlaying ? 'Pausar transmisión' : 'Sintonizar en vivo'}
          >
            {isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-white ml-0.5" />
            )}
          </button>

          {/* Mini frequency bar visualizer in center */}
          <div className="hidden sm:block w-36 h-10">
            <RadioVisualizer isPlaying={isPlaying} compact={true} />
          </div>

          {/* Soundboard shortcut */}
          <button
            onClick={onOpenSoundboard}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-lime-500/60 text-zinc-300 hover:text-lime-400 transition-all flex items-center gap-1 text-xs font-mono-code"
            title="Abrir soundboard de efectos"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="hidden xl:inline">EFECTOS</span>
          </button>
        </div>

        {/* Right: Stream Selector & Volume */}
        <div className="flex items-center justify-end gap-3 w-full md:w-1/3">
          {/* Stream Selector Button */}
          <div className="relative">
            <button
              onClick={() => setShowStreamSelect(!showStreamSelect)}
              className="px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-700 hover:border-zinc-500 text-zinc-300 text-xs font-mono-code flex items-center gap-1.5 transition-colors"
            >
              <RadioTower className="w-3.5 h-3.5 text-lime-400" />
              <span className="hidden lg:inline">SEÑAL:</span>
              <span className="text-zinc-200 max-w-[90px] truncate">{currentStream.id === 'psychobilly-zombi-synth' ? 'ESTUDIO' : 'PRINCIPAL'}</span>
            </button>

            {/* Dropdown popup */}
            {showStreamSelect && (
              <div className="absolute bottom-full right-0 mb-2 w-64 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 font-mono-code text-xs z-50 animate-fade-in">
                <div className="text-[10px] text-zinc-400 uppercase font-bold p-1 border-b border-zinc-800 mb-1 flex items-center gap-1">
                  <Radio className="w-3 h-3 text-lime-400" />
                  Elegir Señal de Audio
                </div>
                {RADIO_STREAMS.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStream(st)}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex flex-col ${currentStream.id === st.id ? 'bg-lime-500/15 border border-lime-500/40 text-lime-300' : 'hover:bg-zinc-800 text-zinc-300'}`}
                  >
                    <div className="font-bold">{st.name}</div>
                    <div className="text-[10px] text-zinc-400">{st.genre}</div>
                    <div className="text-[9px] text-amber-400 mt-0.5">{st.bitrate}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleMute}
              className="p-1.5 text-zinc-400 hover:text-zinc-100 transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-red-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-lime-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-16 sm:w-20 accent-lime-500 cursor-pointer h-1.5 bg-zinc-800 rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
