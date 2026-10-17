import React, { useState } from 'react';
import { RADIO_SHOWS } from '../data/radioData';
import { RadioShow } from '../types';
import { soundFX } from '../services/audioService';
import { Calendar, Clock, Beer, Radio, Bell, Check, User } from 'lucide-react';

export const ScheduleView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Todos');
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const days = ['Todos', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const toggleReminder = (id: string) => {
    soundFX.playBeerPop();
    setReminders(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredShows = selectedDay === 'Todos'
    ? RADIO_SHOWS
    : RADIO_SHOWS.filter(s => s.days.includes(selectedDay));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-lime-400" />
            <h2 className="text-2xl font-bold font-glitch text-zinc-100 tracking-wider">
              PARRILLA PROGRAMÁTICA
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono-code mt-1">
            Programación semanal 24/7 de Rock and Birra Radio desde Valparaíso, Chile (Horario CLT).
          </p>
        </div>

        {/* Days Filter */}
        <div className="flex flex-wrap gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono-code">
          {days.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDay(d)}
              className={`px-2.5 py-1 rounded transition-colors ${selectedDay === d ? 'bg-lime-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Shows Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredShows.map((show: RadioShow) => (
          <div
            key={show.id}
            className={`relative rounded-xl border p-5 flex flex-col justify-between transition-all ${show.isLiveNow ? 'bg-gradient-to-br from-zinc-900 via-zinc-900 to-lime-950/30 border-lime-500/60 shadow-lg shadow-lime-950/30' : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700'}`}
          >
            <div>
              {/* Badges */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {show.isLiveNow && (
                    <span className="px-2 py-0.5 bg-red-600 text-white font-extrabold rounded text-[10px] tracking-wider animate-pulse flex items-center gap-1">
                      <Radio className="w-3 h-3" /> EN VIVO AHORA
                    </span>
                  )}
                  <span className="px-2 py-0.5 bg-zinc-800 text-lime-400 rounded text-[10px] font-mono-code border border-zinc-700">
                    {show.genre}
                  </span>
                </div>

                <button
                  onClick={() => toggleReminder(show.id)}
                  className={`p-1.5 rounded-lg border text-xs font-mono-code transition-colors flex items-center gap-1 ${reminders[show.id] ? 'bg-lime-500/20 border-lime-500/60 text-lime-300' : 'border-zinc-700 text-zinc-400 hover:text-zinc-200'}`}
                  title="Configurar recordatorio"
                >
                  {reminders[show.id] ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-lime-400" />
                      <span className="text-[10px]">Agendado</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-3.5 h-3.5" />
                      <span className="text-[10px]">Avisar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Title & Host */}
              <h3 className="text-xl font-bold text-zinc-100 mb-1 hover:text-lime-400 transition-colors">
                {show.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono-code mb-3">
                <span className="flex items-center gap-1 text-zinc-300">
                  <User className="w-3.5 h-3.5 text-lime-400" />
                  {show.host}
                </span>
                <span className="flex items-center gap-1 text-amber-400">
                  <Clock className="w-3.5 h-3.5" />
                  {show.time}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                {show.description}
              </p>
            </div>

            {/* Beer Pairing Footer */}
            <div className="pt-3 border-t border-zinc-800/80 flex items-center gap-2 text-xs font-mono-code bg-zinc-950/40 p-2.5 rounded-lg">
              <Beer className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div className="text-zinc-400 truncate">
                <span className="text-amber-300 font-bold">Maridaje Cervecero: </span>
                <span className="text-zinc-300">{show.beerRecommendation}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
