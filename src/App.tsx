import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { RadioVisualizer } from './components/RadioVisualizer';
import { ZombieGame } from './components/ZombieGame';
import { ScheduleView } from './components/ScheduleView';
import { ZineAndBeer } from './components/ZineAndBeer';
import { LiveChatAndRequests } from './components/LiveChatAndRequests';
import { SoundboardModal } from './components/SoundboardModal';
import { radioEngine } from './services/rockRadioEngine';
import { soundFX } from './services/audioService';
import { STATION_INFO, CATALOG_SONGS } from './data/radioData';
import {
  Radio,
  Flame,
  Beer,
  Skull,
  Gamepad2,
  Sparkles,
  Volume2,
  Calendar,
  Disc3,
  Heart,
  Mail,
  Zap,
} from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'radio' | 'game' | 'schedule' | 'zine' | 'requests'>('radio');
  const [isSoundboardOpen, setIsSoundboardOpen] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(radioEngine.isPlaying);

  React.useEffect(() => {
    const unsub = radioEngine.subscribe((playing) => {
      setIsPlaying(playing);
    });
    return () => {
      unsub();
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col pb-28 selection:bg-lime-500 selection:text-black">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenSoundboard={() => setIsSoundboardOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {/* TAB 1: RADIO EN VIVO */}
        {activeTab === 'radio' && (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Station Banner */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-lime-500/40 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 sm:p-8 shadow-2xl">
              {/* Background ambient glow */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-lime-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left: Broadcast Hero Info */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full text-xs font-mono-code text-red-400">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    <span className="font-bold tracking-widest uppercase">EN VIVO DESDE VALPARAÍSO</span>
                  </div>

                  <h2 className="text-4xl sm:text-6xl font-black font-glitch text-lime-400 tracking-wider drop-shadow-[0_0_20px_rgba(132,204,22,0.4)] leading-tight">
                    ROCK, BIRRA <br className="hidden sm:inline" />
                    <span className="text-zinc-100 font-horror text-5xl sm:text-7xl text-red-500">
                      Y ZOMBIS
                    </span>
                  </h2>

                  <p className="text-sm sm:text-base text-zinc-300 max-w-xl font-medium leading-relaxed">
                    {STATION_INFO.description} La dosis diaria de psychobilly, horror punk, garage y el mejor maridaje con cerveza artesanal.
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={async () => {
                        soundFX.playBeerPop();
                        await radioEngine.togglePlay();
                      }}
                      className="px-6 py-3.5 bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-lime-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono-code"
                    >
                      {isPlaying ? (
                        <>
                          <Volume2 className="w-5 h-5 fill-black" />
                          <span>PAUSAR TRANSMISIÓN</span>
                        </>
                      ) : (
                        <>
                          <Radio className="w-5 h-5 fill-black" />
                          <span>SINTONIZAR EN DIRECTO</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        soundFX.playLaserShot();
                        setActiveTab('game');
                      }}
                      className="px-5 py-3.5 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-extrabold text-sm rounded-xl flex items-center gap-2 shadow-xl shadow-red-600/20 transition-all hover:scale-105 active:scale-95 cursor-pointer font-mono-code"
                    >
                      <Gamepad2 className="w-5 h-5" />
                      <span>JUGAR MINIJUEGO ZOMBIE</span>
                    </button>

                    <button
                      onClick={() => setIsSoundboardOpen(true)}
                      className="px-4 py-3.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 border border-amber-500/30 font-bold text-sm rounded-xl flex items-center gap-1.5 transition-all cursor-pointer font-mono-code"
                    >
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>CABINA FX</span>
                    </button>
                  </div>
                </div>

                {/* Right: Real-time Audio Spectrum & Vinyl Station Artwork */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <RadioVisualizer isPlaying={isPlaying} compact={false} />

                  <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg bg-zinc-950 border border-zinc-800 flex items-center justify-center text-2xl">
                        📻
                      </div>
                      <div>
                        <div className="text-[10px] font-mono-code text-lime-400 uppercase">
                          Programa al Aire
                        </div>
                        <div className="text-sm font-bold text-zinc-100">
                          Rock, Birra y Zombis Especial
                        </div>
                        <div className="text-xs text-zinc-400">
                          Con DJ Zombi & El Birrero
                        </div>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 bg-lime-500/10 border border-lime-500/30 rounded text-xs text-lime-400 font-mono-code">
                      192 kbps
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Access Highlights Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: Zombie Survival Game Promo */}
              <div
                onClick={() => {
                  soundFX.playLaserShot();
                  setActiveTab('game');
                }}
                className="group bg-gradient-to-br from-red-950/40 via-zinc-900 to-zinc-900 border border-red-500/40 hover:border-red-400 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-red-600/20 rounded-lg text-red-400">
                    <Skull className="w-6 h-6 animate-bounce" />
                  </div>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 bg-red-600 text-white font-bold rounded">
                    ARCADE RETRO
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-red-400 transition-colors mb-1">
                  Sobrevive a la Horda Zombie
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  Toca solos de guitarra para desintegrar zombies y lanza botellas de IPA que forman charcos corrosivos.
                </p>
                <div className="text-xs font-mono-code text-red-400 font-bold flex items-center gap-1">
                  <span>Jugar ahora</span> →
                </div>
              </div>

              {/* Card 2: Birroteca & Reviews */}
              <div
                onClick={() => {
                  soundFX.playBeerPop();
                  setActiveTab('zine');
                }}
                className="group bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/40 hover:border-amber-400 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-amber-600/20 rounded-lg text-amber-400">
                    <Beer className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 bg-amber-500 text-black font-bold rounded">
                    CATAS & MARIDAJE
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors mb-1">
                  La Birroteca Rockera
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  Las mejores IPAs, Imperial Stouts y Red Ales maridadas con discos legendarios de psychobilly y punk.
                </p>
                <div className="text-xs font-mono-code text-amber-400 font-bold flex items-center gap-1">
                  <span>Ver reseñas</span> →
                </div>
              </div>

              {/* Card 3: Programming Schedule */}
              <div
                onClick={() => {
                  soundFX.playBeerPop();
                  setActiveTab('schedule');
                }}
                className="group bg-gradient-to-br from-purple-950/40 via-zinc-900 to-zinc-900 border border-purple-500/40 hover:border-purple-400 rounded-xl p-5 cursor-pointer transition-all hover:-translate-y-1 shadow-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 bg-purple-600/20 rounded-lg text-purple-400">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-mono-code px-2 py-0.5 bg-purple-600 text-white font-bold rounded">
                    HORARIOS
                  </span>
                </div>
                <h3 className="text-lg font-bold text-zinc-100 group-hover:text-purple-300 transition-colors mb-1">
                  Parrilla Semanal 24/7
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-3">
                  Conoce todos los programas: "El Choque Emergente", "La Taberna del Punk" y "La Noche del Vinilo Maldito".
                </p>
                <div className="text-xs font-mono-code text-purple-400 font-bold flex items-center gap-1">
                  <span>Explorar programas</span> →
                </div>
              </div>
            </div>

            {/* Live Chat & Requests Component */}
            <LiveChatAndRequests />

            {/* Featured Tracks Catalog Spotlight */}
            <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Disc3 className="w-5 h-5 text-lime-400 animate-spin-slow" />
                  <h3 className="text-base font-bold text-zinc-100 font-mono-code">
                    CLÁSICOS Y RAREZAS EN ROTACIÓN CONSTANTE
                  </h3>
                </div>
                <button
                  onClick={() => setActiveTab('requests')}
                  className="text-xs font-mono-code text-lime-400 hover:underline"
                >
                  Pedir un tema →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {CATALOG_SONGS.slice(0, 6).map((song) => (
                  <div
                    key={song.id}
                    className="p-3 bg-zinc-950/70 border border-zinc-800/80 rounded-lg flex items-center justify-between hover:border-zinc-700 transition-colors"
                  >
                    <div>
                      <div className="text-xs font-bold text-zinc-200">
                        {song.title}
                      </div>
                      <div className="text-[11px] text-zinc-400">
                        {song.artist} • <span className="text-amber-400">{song.genre}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        soundFX.playGuitarRiff(164.81);
                        setActiveTab('requests');
                      }}
                      className="px-2 py-1 bg-zinc-800 hover:bg-lime-500 hover:text-black rounded text-[10px] font-mono-code text-zinc-300 transition-colors"
                    >
                      Pedir
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: JUEGO ZOMBIE */}
        {activeTab === 'game' && (
          <div className="space-y-6 animate-fade-in">
            <ZombieGame />

            {/* Game Lore & Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono-code text-xs">
              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <h4 className="font-bold text-lime-400 text-sm mb-1 flex items-center gap-1.5">
                  🎸 Riff Sónico (Arma 1)
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Ondas de sonido afiladas como navajas que penetran a través de múltiples zombies causándoles retroceso y daño de distorsión.
                </p>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <h4 className="font-bold text-amber-400 text-sm mb-1 flex items-center gap-1.5">
                  🍺 Botellazo IPA (Arma 2)
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Lanza una botella de IPA artesanal con lúpulo concentrado. Al estrellarse genera un charco efervescente que ralentiza y corroe a los zombies.
                </p>
              </div>

              <div className="bg-zinc-900/80 border border-zinc-800 p-4 rounded-xl">
                <h4 className="font-bold text-red-400 text-sm mb-1 flex items-center gap-1.5">
                  ⚡ Solo Brutal (Poder Especial)
                </h4>
                <p className="text-zinc-400 leading-relaxed">
                  Llena el medidor de cerveza eliminando enemigos. Al llegar al 100%, desata un relámpago con distorsión máxima que destruye la pantalla entera.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PARRILLA PROGRAMÁTICA */}
        {activeTab === 'schedule' && (
          <div className="animate-fade-in">
            <ScheduleView />
          </div>
        )}

        {/* TAB 4: LA BIRROTECA & EL ZINE */}
        {activeTab === 'zine' && (
          <div className="animate-fade-in">
            <ZineAndBeer />
          </div>
        )}

        {/* TAB 5: PIDE TU TEMA */}
        {activeTab === 'requests' && (
          <div className="animate-fade-in">
            <LiveChatAndRequests />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 text-xs font-mono-code text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">🎸</span>
            <span className="font-bold text-zinc-300">
              {STATION_INFO.name} — Valparaíso, Chile
            </span>
            <span>• {STATION_INFO.tagline}</span>
          </div>

          <div className="flex items-center gap-4 text-zinc-400">
            <a
              href="mailto:rockandbirraradio@gmail.com"
              className="hover:text-lime-400 transition-colors flex items-center gap-1"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>rockandbirraradio@gmail.com</span>
            </a>
            <a
              href="https://instagram.com/rockandbirraradio"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-400 transition-colors flex items-center gap-1"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>@rockandbirraradio</span>
            </a>
          </div>

          <div className="text-zinc-600 text-[11px]">
            Diseñado para la comunidad del rock independiente, psychobilly y cervecería artesanal.
          </div>
        </div>
      </footer>

      {/* Persistent Bottom Audio Player Bar */}
      <AudioPlayerBar onOpenSoundboard={() => setIsSoundboardOpen(true)} />

      {/* Soundboard Modal */}
      <SoundboardModal
        isOpen={isSoundboardOpen}
        onClose={() => setIsSoundboardOpen(false)}
      />
    </div>
  );
}
export default App;
