import React, { useEffect, useRef, useState } from 'react';
import { radioEngine } from '../services/rockRadioEngine';
import { Activity, BarChart3, Disc } from 'lucide-react';

interface RadioVisualizerProps {
  isPlaying: boolean;
  compact?: boolean;
}

export const RadioVisualizer: React.FC<RadioVisualizerProps> = ({ isPlaying, compact = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visMode, setVisMode] = useState<'bars' | 'wave' | 'vu'>('bars');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let mockPhase = 0;

    const render = () => {
      animId = requestAnimationFrame(render);
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      const analyser = radioEngine.getAnalyser();
      let dataArray: Uint8Array;

      if (analyser && isPlaying) {
        dataArray = new Uint8Array(analyser.frequencyBinCount);
        if (visMode === 'wave') {
          (analyser.getByteTimeDomainData as unknown as (arr: Uint8Array) => void)(dataArray);
        } else {
          (analyser.getByteFrequencyData as unknown as (arr: Uint8Array) => void)(dataArray);
        }
      } else {
        // Procedural rhythm data if paused or loading
        const count = 64;
        dataArray = new Uint8Array(count);
        mockPhase += isPlaying ? 0.08 : 0.02;
        for (let i = 0; i < count; i++) {
          const base = isPlaying ? 80 + Math.sin(mockPhase * 2 + i * 0.4) * 50 : 25;
          dataArray[i] = Math.max(10, Math.min(255, base + (isPlaying ? Math.random() * 30 : 0)));
        }
      }

      if (visMode === 'bars') {
        const barCount = compact ? 24 : 48;
        const barWidth = width / barCount;

        for (let i = 0; i < barCount; i++) {
          const dataIndex = Math.floor((i / barCount) * dataArray.length);
          const rawVal = dataArray[dataIndex] || 0;
          const barHeight = Math.max(4, (rawVal / 255) * (height - 8));

          // Toxic Lime to Beer Amber gradient
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, '#84cc16'); // Neon lime
          gradient.addColorStop(0.6, '#eab308'); // Amber beer
          gradient.addColorStop(1, '#ef4444'); // Horror red peak

          ctx.fillStyle = gradient;
          const x = i * barWidth;
          const y = height - barHeight;
          const radius = Math.min(3, barWidth / 2);

          // Draw rounded top bar
          ctx.beginPath();
          ctx.roundRect(x + 1, y, Math.max(2, barWidth - 2), barHeight, [radius, radius, 0, 0]);
          ctx.fill();

          // Peak cap
          ctx.fillStyle = '#facc15';
          ctx.fillRect(x + 1, Math.max(0, y - 2), Math.max(2, barWidth - 2), 2);
        }
      } else if (visMode === 'wave') {
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#84cc16';
        ctx.beginPath();

        const sliceWidth = width / dataArray.length;
        let x = 0;

        for (let i = 0; i < dataArray.length; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.stroke();

        // Glow stroke
        ctx.lineWidth = 6;
        ctx.strokeStyle = 'rgba(132, 204, 22, 0.2)';
        ctx.stroke();
      } else if (visMode === 'vu') {
        // Retro Analog VU Meter simulation
        let avg = 0;
        for (let i = 0; i < dataArray.length; i++) avg += dataArray[i];
        avg = avg / dataArray.length / 255;

        // Dial arch
        const cx = width / 2;
        const cy = height + 10;
        const r = Math.min(width * 0.45, height * 0.95);

        ctx.strokeStyle = '#27272a';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();

        // Green to Red zones
        ctx.strokeStyle = '#84cc16';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 1.18, Math.PI * 1.6);
        ctx.stroke();

        ctx.strokeStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI * 1.6, Math.PI * 1.82);
        ctx.stroke();

        // Needle angle
        const targetAngle = Math.PI * (1.18 + avg * 0.64);
        const nx = cx + Math.cos(targetAngle) * (r - 10);
        const ny = cy + Math.sin(targetAngle) * (r - 10);

        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(nx, ny);
        ctx.stroke();

        // Pivot cap
        ctx.fillStyle = '#09090b';
        ctx.beginPath();
        ctx.arc(cx, cy, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#71717a';
        ctx.lineWidth = 2;
        ctx.stroke();

        // dB text
        ctx.fillStyle = '#a1a1aa';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('VU - dB PEAK', cx, height - 15);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, visMode, compact]);

  return (
    <div className={`relative bg-zinc-950/90 border border-zinc-800 rounded-lg p-2 flex flex-col justify-between overflow-hidden ${compact ? 'h-16' : 'h-28 md:h-36'}`}>
      <div className="flex items-center justify-between z-10 text-[10px] uppercase font-mono-code text-zinc-400 mb-1">
        <span className="flex items-center gap-1.5 text-lime-400">
          <span className={`inline-block w-2 h-2 rounded-full ${isPlaying ? 'bg-lime-500 animate-ping' : 'bg-zinc-600'}`}></span>
          {isPlaying ? 'AUDIO SPECTRUM LIVE' : 'SPECTRUM IDLE'}
        </span>
        {!compact && (
          <div className="flex items-center gap-1 bg-zinc-900/80 p-0.5 rounded border border-zinc-800">
            <button
              onClick={() => setVisMode('bars')}
              title="Barras de frecuencia"
              className={`px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5 transition-colors ${visMode === 'bars' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40' : 'hover:text-zinc-200'}`}
            >
              <BarChart3 className="w-3 h-3" /> BARS
            </button>
            <button
              onClick={() => setVisMode('wave')}
              title="Osciloscopio"
              className={`px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5 transition-colors ${visMode === 'wave' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40' : 'hover:text-zinc-200'}`}
            >
              <Activity className="w-3 h-3" /> WAVE
            </button>
            <button
              onClick={() => setVisMode('vu')}
              title="VU Meter analógico"
              className={`px-1.5 py-0.5 rounded text-[9px] flex items-center gap-0.5 transition-colors ${visMode === 'vu' ? 'bg-lime-500/20 text-lime-400 border border-lime-500/40' : 'hover:text-zinc-200'}`}
            >
              <Disc className="w-3 h-3" /> VU
            </button>
          </div>
        )}
      </div>

      <canvas
        ref={canvasRef}
        width={compact ? 240 : 480}
        height={compact ? 44 : 90}
        className="w-full h-full block"
      />
      <div className="absolute inset-0 crt-overlay"></div>
    </div>
  );
};
