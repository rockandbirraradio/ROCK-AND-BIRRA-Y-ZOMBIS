import React, { useState } from 'react';
import { BEER_REVIEWS } from '../data/radioData';
import { BeerReview } from '../types';
import { soundFX } from '../services/audioService';
import { Beer, Disc, Flame, Star, Skull, BookOpen, ExternalLink, Sparkles } from 'lucide-react';

export const ZineAndBeer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'beers' | 'articles'>('beers');

  const articles = [
    {
      id: 'art-1',
      title: 'Voodoo Zombie y la Invasión Psychobilly en Chile',
      tag: 'Banda Destacada',
      date: 'Especial Rock and Birra',
      author: 'DJ Zombi',
      summary: 'Desde los cerros de Valparaíso hasta festivales en Europa y Japón, cómo el cuarteto liderado por Katona Katrina forjó un sonido inconfundible mezclando horror punk, contrabajo frenético y estética de terror de los años 50.',
      readTime: '4 min lectura',
    },
    {
      id: 'art-2',
      title: 'Guía de Sobrevivencia: Las 5 Mejores Cervezas para el Apocalipsis',
      tag: 'Cultura Cervecera',
      date: 'Octubre 2026',
      author: 'El Maestro Cervecero',
      summary: 'Si los muertos vivientes tocan a tu puerta, mejor que te pillen con una buena Imperial Stout o una DIPA lupulada de 8 grados. Análisis sensorial de lúpulos salvajes y maridajes con discos de The Cramps y Misfits.',
      readTime: '6 min lectura',
    },
    {
      id: 'art-3',
      title: 'Los Saicos y el Primer Grito Punk de la Historia',
      tag: 'Historia Subterránea',
      date: 'Archivo Sonoro',
      author: 'Pancho Rocker',
      summary: 'En 1964, en el distrito limeño de Lince, cuatro jóvenes inventaron la distorsión furiosa y el grito gutural con "Demolición", diez años antes de los Sex Pistols y los Ramones.',
      readTime: '5 min lectura',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-800">
        <div>
          <div className="flex items-center gap-2">
            <Beer className="w-5 h-5 text-amber-400" />
            <h2 className="text-2xl font-bold font-glitch text-zinc-100 tracking-wider">
              LA BIRROTECA & EL ZINE
            </h2>
          </div>
          <p className="text-xs text-zinc-400 font-mono-code mt-1">
            Catas de cerveza artesanal, maridajes con vinilos oscuros y artículos de contracultura.
          </p>
        </div>

        <div className="flex gap-2 bg-zinc-900 p-1 rounded-lg border border-zinc-800 text-xs font-mono-code">
          <button
            onClick={() => {
              soundFX.playBeerPop();
              setActiveTab('beers');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${activeTab === 'beers' ? 'bg-amber-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <Beer className="w-3.5 h-3.5" />
            <span>Birras & Maridajes</span>
          </button>
          <button
            onClick={() => {
              soundFX.playGuitarRiff(180);
              setActiveTab('articles');
            }}
            className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${activeTab === 'articles' ? 'bg-lime-500 text-black font-bold' : 'text-zinc-400 hover:text-white'}`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>El Zine de Ultratumba</span>
          </button>
        </div>
      </div>

      {/* Beers Section */}
      {activeTab === 'beers' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BEER_REVIEWS.map((beer: BeerReview) => (
            <div
              key={beer.id}
              className="bg-zinc-900/80 border border-zinc-800 hover:border-amber-500/50 rounded-xl p-5 flex flex-col justify-between transition-all group shadow-lg"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <span className="text-[10px] font-mono-code text-amber-400 uppercase tracking-wider">
                      {beer.style}
                    </span>
                    <h3 className="text-lg font-bold text-zinc-100 group-hover:text-amber-300 transition-colors">
                      {beer.name}
                    </h3>
                    <div className="text-xs text-zinc-400 font-mono-code">
                      {beer.brewery}
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-0.5 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300 font-mono-code">
                      {beer.rating}
                    </span>
                  </div>
                </div>

                {/* ABV & IBU badges */}
                <div className="flex items-center gap-2 mb-3 font-mono-code text-xs">
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded font-bold">
                    ABV: {beer.abv}
                  </span>
                  <span className="px-2 py-0.5 bg-zinc-800 border border-zinc-700 text-zinc-300 rounded">
                    IBU: {beer.ibu} (Amargor)
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-zinc-300 leading-relaxed mb-4">
                  {beer.description}
                </p>

                {/* Tasting Notes */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {beer.notes.map((note, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-zinc-950 text-zinc-400 text-[10px] rounded border border-zinc-800"
                    >
                      • {note}
                    </span>
                  ))}
                </div>
              </div>

              {/* Album Pairing Banner */}
              <div className="pt-3 border-t border-zinc-800 bg-zinc-950/60 p-3 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-red-950/60 rounded border border-red-500/30 text-red-400">
                    <Disc className="w-4 h-4 animate-spin-slow" />
                  </div>
                  <div>
                    <div className="text-[10px] text-zinc-400 font-mono-code uppercase">
                      Vinilo Recomendado:
                    </div>
                    <div className="text-xs font-bold text-zinc-200">
                      {beer.pairingArtist} - <em>{beer.pairingAlbum}</em>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => soundFX.playGuitarRiff(220)}
                  className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-amber-400 transition-colors"
                  title="Brindar con esta birra"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Articles Section */}
      {activeTab === 'articles' && (
        <div className="space-y-4">
          {articles.map((art) => (
            <article
              key={art.id}
              className="bg-zinc-900/70 border border-zinc-800 hover:border-lime-500/50 rounded-xl p-5 transition-all group shadow-lg"
            >
              <div className="flex items-center gap-2 text-xs font-mono-code text-zinc-400 mb-1.5">
                <span className="px-2 py-0.5 bg-lime-500/10 border border-lime-500/30 text-lime-400 rounded text-[10px] font-bold">
                  {art.tag}
                </span>
                <span>• {art.date}</span>
                <span>• {art.readTime}</span>
              </div>

              <h3 className="text-xl font-bold text-zinc-100 group-hover:text-lime-300 transition-colors mb-2">
                {art.title}
              </h3>

              <p className="text-sm text-zinc-300 leading-relaxed mb-4">
                {art.summary}
              </p>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs font-mono-code text-zinc-400">
                <span>Por: <strong className="text-zinc-200">{art.author}</strong></span>
                <span className="text-lime-400 flex items-center gap-1 group-hover:underline">
                  Leer nota completa <ExternalLink className="w-3.5 h-3.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
