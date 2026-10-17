import React from 'react';
import { soundFX } from '../services/audioService';
import { Volume2, X, Skull, Beer, Flame, Radio, BellRing, Sparkles } from 'lucide-react';

interface SoundboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SoundboardModal: React.FC<SoundboardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const pads = [
    {
      id: 'beer',
      label: 'Destapar Birra',
      subtitle: '¡Tssst! & Espuma',
      icon: <Beer className="w-5 h-5 text-amber-400" />,
      color: 'from-amber-500/20 to-amber-950/40 border-amber-500/50 hover:border-amber-400',
      action: () => soundFX.playBeerPop(),
    },
    {
      id: 'guitar',
      label: 'Riff Psychobilly',
      subtitle: 'Distorsión Pura 165Hz',
      icon: <Flame className="w-5 h-5 text-red-500" />,
      color: 'from-red-600/20 to-red-950/40 border-red-500/50 hover:border-red-400',
      action: () => soundFX.playGuitarRiff(164.81),
    },
    {
      id: 'zombie',
      label: 'Grito Zombie',
      subtitle: 'Moan de Ultratumba',
      icon: <Skull className="w-5 h-5 text-lime-400" />,
      color: 'from-lime-600/20 to-zinc-900 border-lime-500/50 hover:border-lime-400',
      action: () => soundFX.playZombieGroan(),
    },
    {
      id: 'smash',
      label: 'Botellazo de Bar',
      subtitle: 'Vidrio quebrado en vivo',
      icon: <Volume2 className="w-5 h-5 text-cyan-400" />,
      color: 'from-cyan-600/20 to-cyan-950/40 border-cyan-500/50 hover:border-cyan-400',
      action: () => soundFX.playBottleSmash(),
    },
    {
      id: 'siren',
      label: 'Sirena Nuclear',
      subtitle: 'Alerta Apocalipsis DJ',
      icon: <BellRing className="w-5 h-5 text-orange-400" />,
      color: 'from-orange-600/20 to-orange-950/40 border-orange-500/50 hover:border-orange-400',
      action: () => soundFX.playSirens(),
    },
    {
      id: 'station',
      label: 'Jingle Rock & Birra',
      subtitle: 'Identificador de señal',
      icon: <Radio className="w-5 h-5 text-purple-400" />,
      color: 'from-purple-600/20 to-purple-950/40 border-purple-500/50 hover:border-purple-400',
      action: () => soundFX.playStationID(),
    },
    {
      id: 'cheer',
      label: 'Salud & Aplausos',
      subtitle: 'El bar en llamas',
      icon: <Sparkles className="w-5 h-5 text-yellow-300" />,
      color: 'from-yellow-600/20 to-yellow-950/40 border-yellow-500/50 hover:border-yellow-400',
      action: () => soundFX.playApplause(),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-zinc-900 border-2 border-lime-500/80 rounded-xl shadow-2xl shadow-lime-950/40 p-5 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-lime-400 animate-pulse" />
            <h2 className="text-xl font-bold tracking-wider font-glitch text-lime-400">
              SOUNDBOARD EN VIVO
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-zinc-400 mt-2 font-mono-code">
          Efectos sonoros de cabina de transmisión en tiempo real generados por síntesis Web Audio.
        </p>

        {/* Grid of Sound Pads */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {pads.map((pad) => (
            <button
              key={pad.id}
              onClick={() => pad.action()}
              className={`group relative p-3 rounded-lg border bg-gradient-to-b ${pad.color} text-left transition-all duration-150 active:scale-95 hover:shadow-lg flex flex-col justify-between h-24 overflow-hidden`}
            >
              <div className="flex items-center justify-between w-full">
                {pad.icon}
                <span className="text-[10px] font-mono-code text-zinc-500 group-hover:text-zinc-300">
                  PAD
                </span>
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-100 group-hover:text-lime-300 transition-colors">
                  {pad.label}
                </div>
                <div className="text-[10px] text-zinc-400 truncate">
                  {pad.subtitle}
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center text-xs text-zinc-500 font-mono-code">
          <span>#YconCervezaEsMejor</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs transition-colors"
          >
            Cerrar Cabina
          </button>
        </div>
      </div>
    </div>
  );
};
