import React from 'react';
import { soundFX } from '../services/audioService';
import {
  Radio,
  Beer,
  Skull,
  Gamepad2,
  Calendar,
  BookOpen,
  Send,
  Sparkles,
  Users,
  Mail,
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'radio' | 'game' | 'schedule' | 'zine' | 'requests';
  onTabChange: (tab: 'radio' | 'game' | 'schedule' | 'zine' | 'requests') => void;
  onOpenSoundboard: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenSoundboard,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
      {/* Top Banner: Slogan, Listeners, Contact */}
      <div className="bg-zinc-900/60 border-b border-zinc-800/80 px-4 py-1.5 text-[11px] font-mono-code text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-zinc-300 font-bold tracking-wider">
              VALPARAÍSO, CHILE 🇨🇱 • EMISIÓN GLOBAL
            </span>
            <span className="text-amber-400 hidden sm:inline">
              #YconCervezaEsMejor
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-lime-400">
              <Users className="w-3.5 h-3.5" />
              <span>1.482 oyentes en vivo</span>
            </div>

            <a
              href="https://instagram.com/rockandbirraradio"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition-colors flex items-center gap-1 hidden md:flex"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@rockandbirraradio</span>
            </a>

            <a
              href="mailto:rockandbirraradio@gmail.com"
              className="hover:text-lime-400 transition-colors flex items-center gap-1 hidden sm:flex"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Contacto</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand */}
        <div
          onClick={() => {
            soundFX.playBeerPop();
            onTabChange('radio');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-lime-500/50 flex items-center justify-center text-xl shadow-lg group-hover:scale-105 transition-transform">
              🎸
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[10px] border border-black">
              🍺
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black font-glitch text-lime-400 tracking-wider group-hover:text-lime-300 transition-colors leading-none">
                ROCK & BIRRA
              </h1>
              <span className="px-1.5 py-0.5 bg-red-600 text-black font-bold font-horror text-[11px] rounded tracking-widest uppercase">
                Y ZOMBIS
              </span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono-code tracking-wider uppercase">
              Psychobilly • Horror Punk • Cerveza Artesanal
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center flex-wrap justify-center gap-1 bg-zinc-900/90 p-1 rounded-xl border border-zinc-800 text-xs font-mono-code">
          <button
            onClick={() => {
              soundFX.playBeerPop();
              onTabChange('radio');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === 'radio' ? 'bg-lime-500 text-black font-bold shadow-md shadow-lime-500/20' : 'text-zinc-400 hover:text-white'}`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Radio</span>
          </button>

          <button
            onClick={() => {
              soundFX.playLaserShot();
              onTabChange('game');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === 'game' ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold shadow-md shadow-red-600/30' : 'text-zinc-400 hover:text-white'}`}
          >
            <Gamepad2 className="w-3.5 h-3.5 text-lime-400" />
            <span>Juego Zombie</span>
            <span className="px-1 py-0.2 bg-red-600 text-[9px] rounded text-white animate-pulse">
              HOT
            </span>
          </button>

          <button
            onClick={() => {
              soundFX.playBeerPop();
              onTabChange('schedule');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === 'schedule' ? 'bg-lime-500 text-black font-bold shadow-md shadow-lime-500/20' : 'text-zinc-400 hover:text-white'}`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Parrilla</span>
          </button>

          <button
            onClick={() => {
              soundFX.playBeerPop();
              onTabChange('zine');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === 'zine' ? 'bg-lime-500 text-black font-bold shadow-md shadow-lime-500/20' : 'text-zinc-400 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Birroteca</span>
          </button>

          <button
            onClick={() => {
              soundFX.playBeerPop();
              onTabChange('requests');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${activeTab === 'requests' ? 'bg-lime-500 text-black font-bold shadow-md shadow-lime-500/20' : 'text-zinc-400 hover:text-white'}`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Pide Tu Tema</span>
          </button>
        </nav>

        {/* Soundboard Action Button */}
        <button
          onClick={onOpenSoundboard}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-amber-500/40 text-amber-300 text-xs font-mono-code transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-md shadow-amber-500/10"
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>CABINA FX</span>
        </button>
      </div>
    </header>
  );
};
