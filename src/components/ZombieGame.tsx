import React, { useEffect, useRef, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { soundFX } from '../services/audioService';
import { Skull, Beer, Flame, Zap, Trophy, Play, RotateCcw, Volume2, Shield } from 'lucide-react';

interface Zombie {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  hp: number;
  maxHp: number;
  type: 'crawler' | 'punk' | 'giant';
  color: string;
  frame: number;
}

interface Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'soundwave' | 'beer_bottle';
  damage: number;
}

interface BeerPuddle {
  x: number;
  y: number;
  radius: number;
  duration: number; // in frames
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  life: number;
  maxLife: number;
  size: number;
}

export const ZombieGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // UI state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover' | 'victory'>('idle');
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('rock_birra_highscore') || '0', 10);
  });
  const [wave, setWave] = useState<number>(1);
  const [health, setHealth] = useState<number>(100);
  const [beerMeter, setBeerMeter] = useState<number>(0); // 0 to 100%
  const [selectedWeapon, setSelectedWeapon] = useState<'riff' | 'bottle'>('riff');
  const [combo, setCombo] = useState<number>(0);
  const [floatingText, setFloatingText] = useState<{ text: string; color: string } | null>(null);

  // References for game loop state
  const gameRef = useRef({
    playerX: 80,
    playerY: 260,
    playerWidth: 42,
    playerHeight: 52,
    movingLeft: false,
    movingRight: false,
    zombies: [] as Zombie[],
    projectiles: [] as Projectile[],
    beerPuddles: [] as BeerPuddle[],
    particles: [] as Particle[],
    wave: 1,
    score: 0,
    health: 100,
    beerMeter: 0,
    combo: 0,
    comboTimer: 0,
    lastSpawn: 0,
    zombiesRemainingToSpawn: 15,
    isOver: false,
  });

  // Trigger screen flash
  const [screenFlash, setScreenFlash] = useState<boolean>(false);

  // Start or restart game
  const startGame = useCallback(() => {
    soundFX.playGuitarRiff(220);
    soundFX.playBeerPop();

    gameRef.current = {
      playerX: 80,
      playerY: 260,
      playerWidth: 42,
      playerHeight: 52,
      movingLeft: false,
      movingRight: false,
      zombies: [],
      projectiles: [],
      beerPuddles: [],
      particles: [],
      wave: 1,
      score: 0,
      health: 100,
      beerMeter: 20,
      combo: 0,
      comboTimer: 0,
      lastSpawn: Date.now(),
      zombiesRemainingToSpawn: 12,
      isOver: false,
    };

    setScore(0);
    setWave(1);
    setHealth(100);
    setBeerMeter(20);
    setCombo(0);
    setGameState('playing');
  }, []);

  // Fire Guitar Shockwave
  const fireGuitarRiff = useCallback(() => {
    if (gameRef.current.isOver) return;
    const g = gameRef.current;
    soundFX.playLaserShot();

    // Spawn shockwave projectile
    g.projectiles.push({
      x: g.playerX + g.playerWidth,
      y: g.playerY + 20,
      vx: 9.5,
      vy: (Math.random() - 0.5) * 1.2,
      radius: 14,
      type: 'soundwave',
      damage: 28,
    });

    // Muzzle particles
    for (let i = 0; i < 6; i++) {
      g.particles.push({
        x: g.playerX + g.playerWidth,
        y: g.playerY + 20,
        vx: Math.random() * 4 + 2,
        vy: (Math.random() - 0.5) * 4,
        color: '#84cc16',
        life: 15,
        maxLife: 15,
        size: Math.random() * 3 + 2,
      });
    }
  }, []);

  // Throw Craft Beer Bottle
  const throwBeerBottle = useCallback(() => {
    if (gameRef.current.isOver) return;
    const g = gameRef.current;
    if (g.beerMeter < 10) {
      // Need at least 10% beer meter to throw bottle
      setFloatingText({ text: '¡FALTA CERVEZA!', color: '#eab308' });
      setTimeout(() => setFloatingText(null), 800);
      return;
    }

    g.beerMeter = Math.max(0, g.beerMeter - 10);
    setBeerMeter(g.beerMeter);
    soundFX.playBeerPop();

    g.projectiles.push({
      x: g.playerX + g.playerWidth,
      y: g.playerY + 15,
      vx: 7,
      vy: -4, // arc motion
      radius: 10,
      type: 'beer_bottle',
      damage: 45,
    });
  }, []);

  // Special Solo Attack (100% meter)
  const triggerSoloPower = useCallback(() => {
    const g = gameRef.current;
    if (g.isOver || g.beerMeter < 100) return;

    soundFX.playGuitarRiff(164.81);
    soundFX.playSirens();
    soundFX.playApplause();

    setScreenFlash(true);
    setTimeout(() => setScreenFlash(false), 300);

    confetti({
      particleCount: 80,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#84cc16', '#eab308', '#ef4444'],
    });

    // Wipe out or massive damage to all zombies on screen
    g.zombies.forEach((z) => {
      z.hp = 0;
      for (let i = 0; i < 15; i++) {
        g.particles.push({
          x: z.x,
          y: z.y,
          vx: (Math.random() - 0.5) * 10,
          vy: (Math.random() - 0.5) * 10,
          color: '#ef4444',
          life: 25,
          maxLife: 25,
          size: Math.random() * 5 + 2,
        });
      }
    });

    g.score += 500;
    setScore(g.score);
    g.beerMeter = 0;
    setBeerMeter(0);
    setFloatingText({ text: '⚡ ¡SOLO DESTRUCTIVO PSYCHOBILLY! ⚡', color: '#84cc16' });
    setTimeout(() => setFloatingText(null), 1500);
  }, []);

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameRef.current.movingLeft = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameRef.current.movingRight = true;
      }
      if (e.key === '1' || e.key === 'q' || e.key === 'Q') {
        setSelectedWeapon('riff');
      }
      if (e.key === '2' || e.key === 'e' || e.key === 'E') {
        setSelectedWeapon('bottle');
      }
      if (e.key === ' ') {
        e.preventDefault();
        if (selectedWeapon === 'riff') {
          fireGuitarRiff();
        } else {
          throwBeerBottle();
        }
      }
      if (e.key === 'Enter' || e.key === 'x' || e.key === 'X') {
        triggerSoloPower();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        gameRef.current.movingLeft = false;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        gameRef.current.movingRight = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, selectedWeapon, fireGuitarRiff, throwBeerBottle, triggerSoloPower]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const gameLoop = () => {
      animId = requestAnimationFrame(gameLoop);
      const g = gameRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. CLEAR & BACKGROUND
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, width, height);

      // Night sky with stars
      ctx.fillStyle = '#18181b';
      ctx.fillRect(0, 0, width, height - 80);

      // Distant Valparaíso hills silhouette with colored street lamps
      ctx.fillStyle = '#121217';
      ctx.beginPath();
      ctx.moveTo(0, 160);
      ctx.quadraticCurveTo(width * 0.25, 120, width * 0.5, 150);
      ctx.quadraticCurveTo(width * 0.75, 110, width, 140);
      ctx.lineTo(width, height - 80);
      ctx.lineTo(0, height - 80);
      ctx.fill();

      // Street & Barricade Floor
      const groundY = height - 80;
      const floorGrad = ctx.createLinearGradient(0, groundY, 0, height);
      floorGrad.addColorStop(0, '#27272a');
      floorGrad.addColorStop(1, '#09090b');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, groundY, width, 80);

      // Barricade line (Radio Station Frontline)
      ctx.strokeStyle = '#84cc16';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(150, groundY - 30);
      ctx.lineTo(150, height);
      ctx.stroke();

      // Barricade warning stripes
      for (let y = groundY - 25; y < height; y += 18) {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(146, y, 8, 8);
      }

      // Neon Sign "ROCK AND BIRRA BAR"
      ctx.font = 'bold 16px "Rubik Glitch", monospace';
      ctx.fillStyle = '#84cc16';
      ctx.fillText('RADIO ROCK & BIRRA EN VIVO', 20, 35);
      ctx.font = '10px monospace';
      ctx.fillStyle = '#a1a1aa';
      ctx.fillText('DEFENDE LA ESTACIÓN DE TRANSMISIÓN', 20, 52);

      if (gameState === 'playing') {
        // 2. UPDATE PLAYER POSITION
        const moveSpeed = 3.5;
        if (g.movingLeft) g.playerX = Math.max(20, g.playerX - moveSpeed);
        if (g.movingRight) g.playerX = Math.min(130, g.playerX + moveSpeed); // stay behind barricade
        g.playerY = groundY - g.playerHeight;

        // 3. SPAWN ZOMBIES
        const now = Date.now();
        const spawnDelay = Math.max(900, 2400 - g.wave * 250);
        if (g.zombiesRemainingToSpawn > 0 && now - g.lastSpawn > spawnDelay) {
          g.lastSpawn = now;
          g.zombiesRemainingToSpawn--;

          const rand = Math.random();
          let type: 'crawler' | 'punk' | 'giant' = 'crawler';
          let zWidth = 32;
          let zHeight = 48;
          let hp = 40 + g.wave * 10;
          let speed = 1.0 + g.wave * 0.15;
          let color = '#22c55e';

          if (rand > 0.75) {
            type = 'punk';
            speed = 2.2 + g.wave * 0.2;
            hp = 30 + g.wave * 8;
            color = '#a855f7'; // Purple punk
          } else if (rand < 0.15 && g.wave >= 2) {
            type = 'giant';
            zWidth = 46;
            zHeight = 65;
            hp = 120 + g.wave * 25;
            speed = 0.65;
            color = '#ef4444'; // Red giant
          }

          g.zombies.push({
            x: width + 20,
            y: groundY - zHeight,
            width: zWidth,
            height: zHeight,
            speed,
            hp,
            maxHp: hp,
            type,
            color,
            frame: 0,
          });
        }

        // Check wave clear
        if (g.zombiesRemainingToSpawn === 0 && g.zombies.length === 0) {
          g.wave++;
          g.zombiesRemainingToSpawn = 12 + g.wave * 4;
          g.beerMeter = Math.min(100, g.beerMeter + 35);
          g.health = Math.min(100, g.health + 20);
          soundFX.playStationID();
          soundFX.playBeerPop();
          setWave(g.wave);
          setBeerMeter(g.beerMeter);
          setHealth(g.health);
          setFloatingText({ text: `🎉 ¡OLEADA ${g.wave} SUPERADA!`, color: '#eab308' });
          setTimeout(() => setFloatingText(null), 1200);
        }

        // 4. UPDATE BEER PUDDLES
        for (let i = g.beerPuddles.length - 1; i >= 0; i--) {
          const p = g.beerPuddles[i];
          p.duration--;
          // Draw beer puddle
          ctx.fillStyle = 'rgba(234, 179, 8, 0.4)';
          ctx.beginPath();
          ctx.ellipse(p.x, groundY + 4, p.radius, p.radius * 0.35, 0, 0, Math.PI * 2);
          ctx.fill();

          // Puddle foam bubbles
          ctx.fillStyle = '#fef08a';
          for (let b = 0; b < 3; b++) {
            const bx = p.x + (Math.sin(p.duration * 0.1 + b) * p.radius * 0.6);
            ctx.beginPath();
            ctx.arc(bx, groundY, 2, 0, Math.PI * 2);
            ctx.fill();
          }

          if (p.duration <= 0) {
            g.beerPuddles.splice(i, 1);
          }
        }

        // 5. UPDATE PROJECTILES
        for (let i = g.projectiles.length - 1; i >= 0; i--) {
          const pr = g.projectiles[i];
          pr.x += pr.vx;
          pr.y += pr.vy;

          if (pr.type === 'beer_bottle') {
            pr.vy += 0.25; // Gravity
            // Draw spinning bottle
            ctx.fillStyle = '#854d0e';
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, pr.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#eab308';
            ctx.fillRect(pr.x - 2, pr.y - 8, 4, 6);

            // Hit ground
            if (pr.y >= groundY) {
              soundFX.playBottleSmash();
              g.beerPuddles.push({
                x: pr.x,
                y: groundY,
                radius: 40,
                duration: 180, // 3 seconds
              });
              // Splash particles
              for (let sp = 0; sp < 12; sp++) {
                g.particles.push({
                  x: pr.x,
                  y: groundY,
                  vx: (Math.random() - 0.5) * 6,
                  vy: -Math.random() * 5,
                  color: '#eab308',
                  life: 20,
                  maxLife: 20,
                  size: Math.random() * 3 + 2,
                });
              }
              g.projectiles.splice(i, 1);
              continue;
            }
          } else {
            // Soundwave projectile
            ctx.strokeStyle = '#84cc16';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.arc(pr.x, pr.y, pr.radius, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.stroke();

            // Inner electric wave
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(pr.x - 4, pr.y, pr.radius * 0.6, -Math.PI * 0.3, Math.PI * 0.3);
            ctx.stroke();
          }

          // Offscreen
          if (pr.x > width + 50 || pr.x < -50) {
            g.projectiles.splice(i, 1);
            continue;
          }

          // Projectile to Zombie Collision
          for (let zIdx = g.zombies.length - 1; zIdx >= 0; zIdx--) {
            const z = g.zombies[zIdx];
            if (
              pr.x + pr.radius >= z.x &&
              pr.x - pr.radius <= z.x + z.width &&
              pr.y >= z.y &&
              pr.y <= z.y + z.height
            ) {
              // Hit!
              z.hp -= pr.damage;
              z.x += 12; // Knockback

              // Splatter particles
              for (let p = 0; p < 8; p++) {
                g.particles.push({
                  x: pr.x,
                  y: pr.y,
                  vx: (Math.random() - 0.5) * 5 + 2,
                  vy: (Math.random() - 0.5) * 5,
                  color: '#22c55e',
                  life: 18,
                  maxLife: 18,
                  size: Math.random() * 3 + 1,
                });
              }

              if (pr.type === 'beer_bottle') {
                soundFX.playBottleSmash();
                g.beerPuddles.push({
                  x: z.x,
                  y: groundY,
                  radius: 35,
                  duration: 150,
                });
              }

              g.projectiles.splice(i, 1);
              break;
            }
          }
        }

        // 6. UPDATE & DRAW ZOMBIES
        for (let i = g.zombies.length - 1; i >= 0; i--) {
          const z = g.zombies[i];
          z.frame += 0.1;

          // Check if standing in beer puddle
          let inPuddle = false;
          g.beerPuddles.forEach((p) => {
            if (Math.abs(z.x - p.x) < p.radius) {
              inPuddle = true;
              z.hp -= 0.35; // Beer damage over time!
            }
          });

          // Move zombie left
          const effectiveSpeed = inPuddle ? z.speed * 0.35 : z.speed;
          z.x -= effectiveSpeed;

          // Check Barricade Attack
          if (z.x <= 150) {
            g.health = Math.max(0, g.health - 0.3);
            setHealth(Math.round(g.health));
            if (Math.random() > 0.95) soundFX.playZombieGroan();

            if (g.health <= 0) {
              // Game Over
              g.isOver = true;
              setGameState('gameover');
              soundFX.playSirens();
              if (g.score > highScore) {
                setHighScore(g.score);
                localStorage.setItem('rock_birra_highscore', g.score.toString());
              }
              break;
            }
          }

          // Check Zombie Death
          if (z.hp <= 0) {
            soundFX.playZombieGroan();
            g.score += z.type === 'giant' ? 150 : (z.type === 'punk' ? 80 : 50);
            g.beerMeter = Math.min(100, g.beerMeter + (z.type === 'giant' ? 25 : 12));
            g.combo++;
            g.comboTimer = 120; // 2 seconds

            setScore(g.score);
            setBeerMeter(g.beerMeter);
            setCombo(g.combo);

            if (g.score > highScore) {
              setHighScore(g.score);
              localStorage.setItem('rock_birra_highscore', g.score.toString());
            }

            g.zombies.splice(i, 1);
            continue;
          }

          // Render Zombie Body
          ctx.fillStyle = z.color;
          // Bobbing animation
          const bob = Math.sin(z.frame) * 4;
          // Torso & legs
          ctx.fillRect(z.x + 6, z.y + 16 + bob, z.width - 12, z.height - 16);

          // Head
          ctx.fillStyle = z.type === 'punk' ? '#86efac' : '#4ade80';
          ctx.fillRect(z.x + 8, z.y + bob, z.width - 16, 16);

          // Mohawk if punk
          if (z.type === 'punk') {
            ctx.fillStyle = '#ec4899';
            ctx.fillRect(z.x + 12, z.y - 6 + bob, 6, 8);
          }

          // Red glowing eyes
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(z.x + 10, z.y + 5 + bob, 3, 3);
          ctx.fillRect(z.x + 16, z.y + 5 + bob, 3, 3);

          // Outstretched zombie arms
          ctx.fillStyle = '#22c55e';
          ctx.fillRect(z.x - 6, z.y + 18 + bob, 10, 5);

          // Health bar above zombie
          const hpPct = Math.max(0, z.hp / z.maxHp);
          ctx.fillStyle = '#3f3f46';
          ctx.fillRect(z.x, z.y - 8, z.width, 4);
          ctx.fillStyle = hpPct > 0.5 ? '#22c55e' : (hpPct > 0.25 ? '#eab308' : '#ef4444');
          ctx.fillRect(z.x, z.y - 8, z.width * hpPct, 4);
        }

        // 7. DRAW PLAYER ("El Birrero Rockero")
        const px = g.playerX;
        const py = g.playerY;

        // Player Shadow
        ctx.fillStyle = 'rgba(0,0,0,0.4)';
        ctx.beginPath();
        ctx.ellipse(px + 20, groundY + 2, 18, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Player Legs & Jeans
        ctx.fillStyle = '#1e3a8a'; // Dark denim
        ctx.fillRect(px + 8, py + 30, 10, 22);
        ctx.fillRect(px + 22, py + 30, 10, 22);

        // Black leather biker jacket
        ctx.fillStyle = '#18181b';
        ctx.fillRect(px + 6, py + 12, 28, 20);

        // White skull print on jacket
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(px + 17, py + 18, 6, 7);

        // Head & rockabilly pompadour hair
        ctx.fillStyle = '#fed7aa'; // Skin
        ctx.fillRect(px + 12, py, 16, 14);
        ctx.fillStyle = '#09090b'; // Black hair pompadour
        ctx.fillRect(px + 10, py - 6, 20, 8);
        ctx.fillRect(px + 8, py - 4, 6, 10);

        // Electric Guitar (Red Fender/Gretsch style)
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 24, py + 14, 16, 12);
        ctx.fillStyle = '#fafaf9'; // Pickguard
        ctx.fillRect(px + 28, py + 16, 6, 8);
        // Guitar neck & headstock
        ctx.fillStyle = '#d97706';
        ctx.fillRect(px + 38, py + 12, 16, 4);
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(px + 52, py + 10, 6, 7);

        // 8. UPDATE PARTICLES
        for (let i = g.particles.length - 1; i >= 0; i--) {
          const pt = g.particles[i];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life--;
          ctx.fillStyle = pt.color;
          ctx.fillRect(pt.x, pt.y, pt.size, pt.size);

          if (pt.life <= 0) {
            g.particles.splice(i, 1);
          }
        }
      } else {
        // Idle / Start Screen preview
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, width, height);
      }
    };

    renderLoopInit: {
      animId = requestAnimationFrame(gameLoop);
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [gameState, highScore]);

  return (
    <div className="relative w-full bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl shadow-black">
      {/* Game Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Skull className="w-5 h-5 text-lime-400 animate-pulse" />
          <h3 className="font-glitch text-lg text-lime-400 tracking-wide">
            ROCK, BIRRA Y ZOMBIS: THE GAME
          </h3>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs font-mono-code">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>RECORD: <strong className="text-amber-400">{highScore}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-lime-400 font-bold">SCORE:</span>
            <span className="text-zinc-100">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 text-zinc-300">
            <span className="text-purple-400 font-bold">OLEADA:</span>
            <span className="text-purple-300">{wave}</span>
          </div>
        </div>
      </div>

      {/* Screen Flash Overlay */}
      {screenFlash && (
        <div className="absolute inset-0 bg-lime-400/40 pointer-events-none z-30 transition-opacity" />
      )}

      {/* Floating alert */}
      {floatingText && (
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-1.5 rounded-full font-bold font-mono-code text-sm animate-bounce shadow-lg pointer-events-none"
          style={{ backgroundColor: floatingText.color, color: '#000' }}
        >
          {floatingText.text}
        </div>
      )}

      {/* Main Game Canvas */}
      <div className="relative aspect-[16/9] w-full max-h-[460px] bg-black">
        <canvas
          ref={canvasRef}
          width={720}
          height={380}
          className="w-full h-full block cursor-crosshair"
          onClick={() => {
            if (gameState === 'playing') {
              if (selectedWeapon === 'riff') fireGuitarRiff();
              else throwBeerBottle();
            }
          }}
        />

        {/* CRT scanlines effect */}
        <div className="absolute inset-0 crt-overlay pointer-events-none"></div>

        {/* Start / Gameover Overlays */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center p-6 text-center z-20">
            <div className="text-lime-400 font-horror text-4xl sm:text-5xl tracking-widest drop-shadow-[0_0_15px_rgba(132,204,22,0.8)] mb-2">
              ROCK, BIRRA Y ZOMBIS
            </div>
            <div className="text-amber-400 font-mono-code text-xs sm:text-sm max-w-md mb-6">
              ¡Los zombies han invadido Valparaíso y amenazan con silenciar la radio! Defiende la cabina con riffs electrizantes y botellas de cerveza artesanal.
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-sm w-full mb-6 text-xs text-zinc-300 text-left bg-zinc-900/80 p-3 rounded-lg border border-zinc-800 font-mono-code">
              <div>
                <span className="text-lime-400 font-bold">[A] [D] / Flechas:</span> Moverse
              </div>
              <div>
                <span className="text-lime-400 font-bold">[ESPACIO] / Click:</span> Disparar
              </div>
              <div>
                <span className="text-amber-400 font-bold">[1] [Q]:</span> Riff de Guitarra
              </div>
              <div>
                <span className="text-amber-400 font-bold">[2] [E]:</span> Botellazo de Birra
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-6 py-3 bg-gradient-to-r from-lime-500 to-lime-600 hover:from-lime-400 hover:to-lime-500 text-black font-extrabold rounded-lg text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-lime-500/30 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-5 h-5 fill-black" /> ¡COMENZAR LA MATANZA!
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-red-950/90 flex flex-col items-center justify-center p-6 text-center z-20">
            <Skull className="w-16 h-16 text-red-500 animate-bounce mb-2" />
            <h2 className="text-3xl font-horror tracking-wider text-red-500 mb-1">
              ¡LA RADIO HA CAÍDO!
            </h2>
            <p className="text-zinc-300 text-xs sm:text-sm font-mono-code mb-4">
              Los zombies devoraron las birras y cortaron la transmisión.
            </p>

            <div className="bg-black/60 p-4 rounded-xl border border-red-800/60 max-w-xs w-full mb-6 font-mono-code text-sm">
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Puntaje Final:</span>
                <span className="text-lime-400 font-bold">{score}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800">
                <span className="text-zinc-400">Oleada Alcanzada:</span>
                <span className="text-purple-400 font-bold">{wave}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Récord Histórico:</span>
                <span className="text-amber-400 font-bold">{highScore}</span>
              </div>
            </div>

            <button
              onClick={startGame}
              className="px-6 py-2.5 bg-lime-500 hover:bg-lime-400 text-black font-bold rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-lime-500/20 transition-transform hover:scale-105 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" /> VOLVER A TOCAR & PELEAR
            </button>
          </div>
        )}
      </div>

      {/* Control HUD Bottom Bar */}
      <div className="p-3 bg-zinc-900 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        {/* Health & Beer Power Meters */}
        <div className="flex items-center gap-4 flex-1 min-w-[280px]">
          {/* Health */}
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-mono-code mb-1">
              <span className="flex items-center gap-1 text-red-400 font-bold">
                <Shield className="w-3.5 h-3.5" /> BARRICADA RADIO:
              </span>
              <span className="text-zinc-200">{Math.round(health)}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700">
              <div
                className={`h-full transition-all duration-200 ${health > 40 ? 'bg-lime-500' : 'bg-red-500 animate-pulse'}`}
                style={{ width: `${health}%` }}
              />
            </div>
          </div>

          {/* Beer Power / Thirst Meter */}
          <div className="flex-1">
            <div className="flex justify-between text-[11px] font-mono-code mb-1">
              <span className="flex items-center gap-1 text-amber-400 font-bold">
                <Beer className="w-3.5 h-3.5" /> MEDIDOR DE BIRRA:
              </span>
              <span className="text-zinc-200">{beerMeter}%</span>
            </div>
            <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden border border-zinc-700">
              <div
                className="h-full bg-amber-400 transition-all duration-200"
                style={{ width: `${beerMeter}%` }}
              />
            </div>
          </div>
        </div>

        {/* Weapons & Power Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedWeapon('riff')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-code flex items-center gap-1.5 transition-all ${selectedWeapon === 'riff' ? 'bg-lime-500/20 border-lime-400 text-lime-400 shadow-md shadow-lime-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
          >
            <Flame className="w-4 h-4 text-lime-400" />
            <span>[1] Riff Sónico</span>
          </button>

          <button
            onClick={() => setSelectedWeapon('bottle')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono-code flex items-center gap-1.5 transition-all ${selectedWeapon === 'bottle' ? 'bg-amber-500/20 border-amber-400 text-amber-400 shadow-md shadow-amber-500/20' : 'bg-zinc-800 border-zinc-700 text-zinc-300'}`}
          >
            <Beer className="w-4 h-4 text-amber-400" />
            <span>[2] Botellazo IPA</span>
          </button>

          <button
            disabled={beerMeter < 100}
            onClick={triggerSoloPower}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold font-mono-code flex items-center gap-1.5 transition-all ${beerMeter >= 100 ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white animate-pulse shadow-lg shadow-red-500/40 cursor-pointer hover:scale-105' : 'bg-zinc-800/50 text-zinc-600 border border-zinc-800 cursor-not-allowed'}`}
          >
            <Zap className="w-4 h-4" />
            <span>⚡ SOLO BRUTAL</span>
          </button>
        </div>
      </div>
    </div>
  );
};
