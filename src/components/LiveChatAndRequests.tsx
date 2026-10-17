import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../services/audioService';
import { INITIAL_SHOUTOUTS, CATALOG_SONGS } from '../data/radioData';
import { ListenerMessage, Song } from '../types';
import {
  Beer,
  MessageSquare,
  Music,
  Send,
  Sparkles,
  MapPin,
  CheckCircle2,
  HeartHandshake,
  Search,
} from 'lucide-react';

export const LiveChatAndRequests: React.FC = () => {
  const [messages, setMessages] = useState<ListenerMessage[]>(INITIAL_SHOUTOUTS);
  const [name, setName] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [totalBeers, setTotalBeers] = useState<number>(342); // Station beer jar
  const [showBeerSuccess, setShowBeerSuccess] = useState<boolean>(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customSong, setCustomSong] = useState<string>('');
  const [selectedSong, setSelectedSong] = useState<Song | null>(null);
  const [requestSent, setRequestSent] = useState<boolean>(false);

  // Send a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    soundFX.playBeerPop();

    const newMessage: ListenerMessage = {
      id: `msg-${Date.now()}`,
      name: name.trim() || 'Rocker Anónimo',
      location: location.trim() || 'Valparaíso Subterráneo',
      message: text.trim(),
      timestamp: 'Justo ahora',
      beersDonated: 1,
    };

    setMessages([newMessage, ...messages]);
    setText('');
    setTotalBeers(prev => prev + 1);

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#84cc16', '#eab308'],
    });
  };

  // Virtual "Invitar una Birra al DJ"
  const handleDonateBeer = (amount: number = 1) => {
    soundFX.playBeerPop();
    soundFX.playApplause();
    setTotalBeers(prev => prev + amount);
    setShowBeerSuccess(true);
    setTimeout(() => setShowBeerSuccess(false), 2500);

    confetti({
      particleCount: 50,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#eab308', '#facc15', '#84cc16'],
    });
  };

  // Submit song request
  const handleSongRequest = (songTitle: string) => {
    soundFX.playGuitarRiff(196);
    setRequestSent(true);

    const newMessage: ListenerMessage = {
      id: `req-${Date.now()}`,
      name: name.trim() || 'Oyente Fiel',
      location: location.trim() || 'En Sintonía',
      message: `¡Pidiendo tema para la transmisión: "${songTitle}"! 🎸🧟‍♂️`,
      timestamp: 'Justo ahora',
      songRequest: songTitle,
      beersDonated: 2,
    };

    setMessages([newMessage, ...messages]);
    setTotalBeers(prev => prev + 2);

    setTimeout(() => {
      setIsRequestModalOpen(false);
      setRequestSent(false);
      setSelectedSong(null);
      setCustomSong('');
    }, 1800);
  };

  const filteredCatalog = CATALOG_SONGS.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Virtual Beer Jar & Song Request Action */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Beer Jar Card */}
        <div className="relative bg-gradient-to-br from-amber-950/40 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-xl p-5 flex items-center justify-between overflow-hidden shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-mono-code text-xs uppercase tracking-wider">
              <Beer className="w-4 h-4 animate-bounce" />
              <span>Jarra de Birras para la Cabina</span>
            </div>
            <div className="text-3xl font-extrabold text-zinc-100 font-glitch flex items-baseline gap-2">
              <span>{totalBeers}</span>
              <span className="text-xs font-mono-code font-normal text-amber-400">birras invitadas</span>
            </div>
            <p className="text-xs text-zinc-400">
              Apoya la autogestión de la radio. ¡Cada birra mantiene viva la señal!
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleDonateBeer(1)}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-black font-extrabold text-xs font-mono-code rounded-lg flex items-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Beer className="w-4 h-4" />
              <span>+1 BIRRA ($1.500)</span>
            </button>
            <button
              onClick={() => handleDonateBeer(3)}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-[11px] font-mono-code rounded-lg flex items-center justify-center gap-1 border border-amber-500/20 transition-colors cursor-pointer"
            >
              <span>🍺 PACK DE 3 ($4.000)</span>
            </button>
          </div>

          {showBeerSuccess && (
            <div className="absolute inset-0 bg-amber-500/90 flex items-center justify-center text-black font-extrabold text-base font-mono-code animate-fade-in z-10">
              🍻 ¡SALUD! ¡GRACIAS POR LA BIRRA, CABRO! 🤘
            </div>
          )}
        </div>

        {/* Request Song Card */}
        <div className="bg-gradient-to-br from-lime-950/40 via-zinc-900 to-zinc-900 border border-lime-500/30 rounded-xl p-5 flex items-center justify-between shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-lime-400 font-mono-code text-xs uppercase tracking-wider">
              <Music className="w-4 h-4" />
              <span>Parrilla a Pedido</span>
            </div>
            <div className="text-2xl font-extrabold text-zinc-100 font-horror tracking-wider">
              ¿QUÉ QUIERES ESCUCHAR?
            </div>
            <p className="text-xs text-zinc-400">
              Pide temas de Psychobilly, Horror Punk, Garage Rock o tu banda emergente.
            </p>
          </div>

          <button
            onClick={() => setIsRequestModalOpen(true)}
            className="px-4 py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-extrabold text-xs font-mono-code rounded-lg flex items-center gap-2 shadow-md shadow-lime-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-black" />
            <span>PEDIR TEMA</span>
          </button>
        </div>
      </div>

      {/* Live Chat / Shoutouts Wall */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Messages Feed */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-lime-400" />
              <h3 className="font-bold text-lg text-zinc-100">
                Muro de Saludos en Vivo (#RockAndBirra)
              </h3>
            </div>
            <span className="text-xs font-mono-code text-zinc-500">
              {messages.length} mensajes en antena
            </span>
          </div>

          {/* List of Messages */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className="bg-zinc-900/70 border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-4 transition-all"
              >
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lime-400 font-mono-code">
                      {msg.name}
                    </span>
                    <span className="flex items-center gap-0.5 text-zinc-400 text-[11px]">
                      <MapPin className="w-3 h-3 text-red-400" />
                      {msg.location}
                    </span>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono-code">
                    {msg.timestamp}
                  </span>
                </div>

                <p className="text-sm text-zinc-200 leading-relaxed">
                  {msg.message}
                </p>

                {msg.songRequest && (
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-2.5 py-1 bg-lime-500/10 border border-lime-500/30 rounded text-xs text-lime-300 font-mono-code">
                    <Music className="w-3.5 h-3.5" />
                    <span>Tema Solicitado: <strong>{msg.songRequest}</strong></span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Send Message Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 h-fit shadow-xl">
          <h4 className="font-bold text-zinc-100 text-sm mb-1 flex items-center gap-2">
            <Send className="w-4 h-4 text-lime-400" />
            Enviar Saludo a la Transmisión
          </h4>
          <p className="text-xs text-zinc-400 mb-4">
            Tu mensaje saldrá en pantalla y será leído por el DJ en la cabina.
          </p>

          <form onSubmit={handleSendMessage} className="space-y-3">
            <div>
              <label className="block text-xs font-mono-code text-zinc-400 mb-1">
                Tu Apodo / Nombre Rockero:
              </label>
              <input
                type="text"
                placeholder="Ej. Katona Punk, El Birrero..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code text-zinc-400 mb-1">
                ¿Desde dónde escuchas?:
              </label>
              <input
                type="text"
                placeholder="Ej. Valparaíso, Santiago, Viña del Mar..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
              />
            </div>

            <div>
              <label className="block text-xs font-mono-code text-zinc-400 mb-1">
                Mensaje para la radio:
              </label>
              <textarea
                rows={3}
                placeholder="¡Salud cabros! Aguante el horror punk y las birras bien heladas..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-lime-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-bold font-mono-code text-xs rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-lime-500/20 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" /> ENVIAR SALUDO A CABINA
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono-code flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4 text-amber-400" />
            <span>Radio 100% autogestionada sin censura</span>
          </div>
        </div>
      </div>

      {/* Song Request Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-zinc-900 border border-lime-500/60 rounded-xl max-w-xl w-full p-5 shadow-2xl relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5 text-lime-400" />
                <h3 className="font-glitch text-lg text-lime-400">
                  PEDIR CANCIÓN A CABINA
                </h3>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="text-zinc-400 hover:text-white text-sm px-2 py-1 bg-zinc-800 rounded"
              >
                ✕
              </button>
            </div>

            {requestSent ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-16 h-16 text-lime-400 mb-3 animate-bounce" />
                <h4 className="text-xl font-bold text-white mb-1">¡PEDIDO RECIBIDO!</h4>
                <p className="text-zinc-400 text-xs font-mono-code">
                  El DJ ha puesto tu tema en la cola de reproducción para este bloque.
                </p>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto p-1 mt-2 flex-1">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Buscar en el catálogo (Voodoo Zombie, Misfits, The Cramps...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
                  />
                </div>

                {/* Catalog songs */}
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {filteredCatalog.map((s) => (
                    <div
                      key={s.id}
                      onClick={() => handleSongRequest(`${s.artist} - ${s.title}`)}
                      className="p-3 bg-zinc-950/60 hover:bg-zinc-800 border border-zinc-800 hover:border-lime-500/40 rounded-lg cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <div>
                        <div className="text-sm font-bold text-zinc-100 group-hover:text-lime-300">
                          {s.title}
                        </div>
                        <div className="text-xs text-zinc-400">
                          {s.artist} • <span className="text-amber-400">{s.genre}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono-code px-2.5 py-1 bg-zinc-800 group-hover:bg-lime-500 group-hover:text-black rounded text-zinc-300 transition-colors">
                        Pedir
                      </span>
                    </div>
                  ))}
                </div>

                {/* Custom Track Request */}
                <div className="pt-3 border-t border-zinc-800">
                  <label className="block text-xs font-mono-code text-zinc-400 mb-1.5">
                    ¿No encuentras tu tema? Escribe banda y canción:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Ej. Machuca - Corazón Desilusionado"
                      value={customSong}
                      onChange={(e) => setCustomSong(e.target.value)}
                      className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-zinc-200 focus:outline-none focus:border-lime-500"
                    />
                    <button
                      onClick={() => customSong.trim() && handleSongRequest(customSong.trim())}
                      className="px-4 py-2 bg-lime-500 hover:bg-lime-400 text-black font-bold text-xs rounded-lg transition-colors cursor-pointer"
                    >
                      Solicitar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
