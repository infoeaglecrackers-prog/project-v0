import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

/* ─── TYPES ──────────────────────────────────────────────────── */
interface Vec2 { x: number; y: number; }

interface Rocket {
  pos: Vec2; vel: Vec2; color: string;
  trail: Vec2[]; targetY: number;
}

interface Particle {
  pos: Vec2; vel: Vec2; color: string;
  size: number; alpha: number;
  decay: number; gravity: number;
  trail: Vec2[]; glitter: boolean;
}

type BurstType = 'radial' | 'ring' | 'star' | 'chrysanthemum';

export interface FireworksHandle {
  launch:       (x?: number, color?: string) => void;
  launchSalvo:  (count?: number) => void;
  launchRainbow: () => void;
  burstAt:      (x: number, y: number, color?: string) => void;
}

interface Props {
  autoLaunch?:    boolean;
  launchInterval?: number;
  className?:     string;
  /** Renders as a fixed, full-viewport overlay (z-index 9999, pointer-events none) */
  fullPage?:      boolean;
}

/* ─── PALETTE ────────────────────────────────────────────────── */
const COLORS = [
  '#FF4500', '#FF6B35', '#FFD700', '#FF1493',
  '#00BFFF', '#7FFF00', '#FF69B4', '#FFA500',
  '#FF0080', '#FFFF00', '#00FF7F', '#FF6347',
  '#FF4500', '#FFD700', '#FF6B35',
];
const RAINBOW = ['#FF0000','#FF7F00','#FFD700','#00FF00','#00BFFF','#8A2BE2','#FF1493'];
const BURST_TYPES: BurstType[] = ['radial', 'ring', 'star', 'chrysanthemum'];

/* ─── HELPERS ────────────────────────────────────────────────── */
function rand(a: number, b: number) { return a + Math.random() * (b - a); }
function pick<T>(arr: T[]): T    { return arr[Math.floor(Math.random() * arr.length)]; }
function toHex(a: number) {
  return Math.max(0, Math.min(255, Math.floor(a * 255))).toString(16).padStart(2, '0');
}

/* ─── ROCKET FACTORY ─────────────────────────────────────────── */
function makeRocket(W: number, H: number, x?: number, color?: string): Rocket {
  return {
    pos:     { x: x ?? rand(W * 0.15, W * 0.85), y: H },
    vel:     { x: rand(-0.35, 0.35), y: rand(-8, -6.2) },
    color:   color ?? pick(COLORS),
    trail:   [],
    targetY: rand(H * 0.06, H * 0.42),
  };
}

/* ─── BURST FACTORY ──────────────────────────────────────────── */
function createBurst(cx: number, cy: number, color: string, type: BurstType, out: Particle[]) {
  const count = type === 'chrysanthemum' ? 90 : 68;

  /* Flash */
  out.push({ pos:{x:cx,y:cy}, vel:{x:0,y:0}, color:'#ffffff', size:20, alpha:0.92, decay:0.13, gravity:0, trail:[], glitter:false });

  /* Main ring */
  for (let i = 0; i < count; i++) {
    const t = i / count;
    let angle: number, speed: number;

    if (type === 'radial') {
      angle = t * Math.PI * 2 + rand(-0.12, 0.12);
      speed = rand(1.6, 4.5);
    } else if (type === 'ring') {
      angle = t * Math.PI * 2;
      speed = rand(2.4, 3.1);
    } else if (type === 'star') {
      const arm  = Math.floor(t * 8);
      const tArm = t * 8 - arm;
      angle = (arm / 8) * Math.PI * 2 + rand(-0.05, 0.05);
      speed = 1.3 + tArm * 3.2 + rand(-0.15, 0.15);
    } else {
      angle = t * Math.PI * 2;
      speed = 2.4 + Math.sin(t * Math.PI * 2 * 7) * 1.3 + rand(-0.2, 0.2);
    }

    out.push({
      pos:    { x: cx, y: cy },
      vel:    { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      color:  i % 5 === 0 ? '#ffffff' : color,
      size:   rand(1.5, 3.2),
      alpha:  rand(0.88, 1),
      decay:  rand(0.007, 0.012),
      gravity:rand(0.028, 0.06),
      trail:  [],
      glitter:Math.random() > 0.58,
    });
  }

  /* Gold sparkle ring */
  for (let i = 0; i < 28; i++) {
    const angle = (i / 28) * Math.PI * 2;
    const speed = rand(0.5, 1.9);
    out.push({
      pos:    { x: cx, y: cy },
      vel:    { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed },
      color:  '#FFD700',
      size:   rand(1, 2),
      alpha:  rand(0.75, 1),
      decay:  rand(0.012, 0.02),
      gravity:rand(0.05, 0.09),
      trail:  [],
      glitter:true,
    });
  }
}

/* ─── COMPONENT ──────────────────────────────────────────────── */
const FireworksCanvas = forwardRef<FireworksHandle, Props>(
  ({ autoLaunch = true, launchInterval = 2200, className = '', fullPage = false }, ref) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const state     = useRef<{ rockets: Rocket[]; particles: Particle[] }>({ rockets: [], particles: [] });
    const rafRef    = useRef<number>(0);
    const timerRef  = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

    /* ── Public API ── */
    const launch = useCallback((x?: number, color?: string) => {
      const c = canvasRef.current;
      if (c) state.current.rockets.push(makeRocket(c.width, c.height, x, color));
    }, []);

    const launchSalvo = useCallback((count = 5) => {
      for (let i = 0; i < count; i++) setTimeout(() => launch(), i * rand(120, 280));
    }, [launch]);

    const launchRainbow = useCallback(() => {
      RAINBOW.forEach((color, i) => setTimeout(() => launch(undefined, color), i * 180));
    }, [launch]);

    const burstAt = useCallback((x: number, y: number, color?: string) => {
      createBurst(x, y, color ?? pick(COLORS), pick(BURST_TYPES), state.current.particles);
    }, []);

    useImperativeHandle(ref, () => ({ launch, launchSalvo, launchRainbow, burstAt }), [
      launch, launchSalvo, launchRainbow, burstAt,
    ]);

    /* ── Effect: canvas setup + animation loop ── */
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      /* Resize */
      const resize = () => {
        if (fullPage) {
          canvas.width  = window.innerWidth;
          canvas.height = window.innerHeight;
        } else {
          canvas.width  = canvas.offsetWidth;
          canvas.height = canvas.offsetHeight;
        }
      };
      resize();

      let cleanupResize: () => void;
      if (fullPage) {
        window.addEventListener('resize', resize);
        cleanupResize = () => window.removeEventListener('resize', resize);
      } else {
        const ro = new ResizeObserver(resize);
        ro.observe(canvas);
        cleanupResize = () => ro.disconnect();
      }

      /* Global click-to-burst (any click on the page) */
      const onDocClick = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        createBurst(
          e.clientX - rect.left,
          e.clientY - rect.top,
          pick(COLORS), pick(BURST_TYPES),
          state.current.particles,
        );
      };
      if (fullPage) {
        /* useCapture = true → fires even if click.stopPropagation() was called */
        document.addEventListener('click', onDocClick, true);
      }

      /* Custom window events from any component */
      const onFwSalvo   = (e: Event) => launchSalvo((e as CustomEvent).detail?.count ?? 5);
      const onFwRainbow = () => launchRainbow();
      const onFwBurst   = (e: Event) => {
        const { x, y, color } = (e as CustomEvent).detail ?? {};
        if (x != null && y != null) burstAt(x, y, color);
      };
      window.addEventListener('fw:salvo',   onFwSalvo);
      window.addEventListener('fw:rainbow', onFwRainbow);
      window.addEventListener('fw:burst',   onFwBurst);

      /* Auto-launch timer */
      const startAutoLaunchTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
          const salvo = Math.random() > 0.62;
          const n = salvo ? Math.floor(rand(2, 4)) : 1;
          for (let i = 0; i < n; i++) setTimeout(() => launch(), i * rand(160, 380));
        }, launchInterval);
      };
      if (autoLaunch) {
        setTimeout(() => launch(), 600);
        startAutoLaunchTimer();
      }

      /* ── Animation loop ── */
      const frame = () => {
        const { rockets, particles } = state.current;
        const W = canvas.width, H = canvas.height;

        ctx.clearRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'screen';

        /* ROCKETS */
        const nextRockets: Rocket[] = [];
        for (const r of rockets) {
          r.trail.push({ x: r.pos.x, y: r.pos.y });
          if (r.trail.length > 22) r.trail.shift();

          for (let i = 1; i < r.trail.length; i++) {
            const a = i / r.trail.length;
            ctx.beginPath();
            ctx.moveTo(r.trail[i - 1].x, r.trail[i - 1].y);
            ctx.lineTo(r.trail[i].x, r.trail[i].y);
            ctx.strokeStyle = `rgba(255,200,120,${a * 0.88})`;
            ctx.lineWidth   = a * 3;
            ctx.stroke();
          }

          const grd = ctx.createRadialGradient(r.pos.x, r.pos.y, 0, r.pos.x, r.pos.y, 6);
          grd.addColorStop(0, 'rgba(255,255,255,0.95)');
          grd.addColorStop(1, 'rgba(255,160,60,0)');
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(r.pos.x, r.pos.y, 6, 0, Math.PI * 2);
          ctx.fill();

          r.vel.y += 0.09;
          r.vel.x *= 0.99;
          r.pos.x += r.vel.x;
          r.pos.y += r.vel.y;

          if (r.pos.y <= r.targetY || r.vel.y >= 0) {
            createBurst(r.pos.x, r.pos.y, r.color, pick(BURST_TYPES), particles);
          } else {
            nextRockets.push(r);
          }
        }
        state.current.rockets = nextRockets;

        /* PARTICLES */
        const nextParticles: Particle[] = [];
        for (const p of particles) {
          if (p.alpha <= 0.015) continue;

          p.trail.push({ x: p.pos.x, y: p.pos.y });
          if (p.trail.length > 7) p.trail.shift();

          if (p.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(p.trail[0].x, p.trail[0].y);
            for (let i = 1; i < p.trail.length; i++) ctx.lineTo(p.trail[i].x, p.trail[i].y);
            ctx.strokeStyle = `${p.color}${toHex(p.alpha * 0.4)}`;
            ctx.lineWidth   = p.size * 0.65;
            ctx.lineJoin    = 'round';
            ctx.stroke();
          }

          if (p.glitter && Math.random() > 0.42) {
            const gr = p.size * 3.5;
            const g2 = ctx.createRadialGradient(p.pos.x, p.pos.y, 0, p.pos.x, p.pos.y, gr);
            g2.addColorStop(0, `rgba(255,255,255,${p.alpha * 0.75})`);
            g2.addColorStop(1, `${p.color}00`);
            ctx.fillStyle = g2;
            ctx.beginPath();
            ctx.arc(p.pos.x, p.pos.y, gr, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(p.pos.x, p.pos.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${toHex(p.alpha)}`;
          ctx.fill();

          p.vel.y += p.gravity;
          p.vel.x *= 0.97;
          p.vel.y *= 0.97;
          p.pos.x += p.vel.x;
          p.pos.y += p.vel.y;
          p.alpha  -= p.decay;
          p.size   *= 0.996;

          nextParticles.push(p);
        }
        state.current.particles = nextParticles;

        rafRef.current = requestAnimationFrame(frame);
      };

      rafRef.current = requestAnimationFrame(frame);

      /* Pause everything while the tab is hidden, and drop any backlog on return —
         otherwise rockets queued during the away time all burst together at once. */
      const onVisibility = () => {
        if (document.hidden) {
          clearInterval(timerRef.current);
          cancelAnimationFrame(rafRef.current);
        } else {
          state.current.rockets = [];
          state.current.particles = [];
          if (autoLaunch) {
            setTimeout(() => launch(), 600);
            startAutoLaunchTimer();
          }
          rafRef.current = requestAnimationFrame(frame);
        }
      };
      document.addEventListener('visibilitychange', onVisibility);

      return () => {
        cancelAnimationFrame(rafRef.current);
        clearInterval(timerRef.current);
        cleanupResize();
        document.removeEventListener('visibilitychange', onVisibility);
        if (fullPage) document.removeEventListener('click', onDocClick, true);
        window.removeEventListener('fw:salvo',   onFwSalvo);
        window.removeEventListener('fw:rainbow', onFwRainbow);
        window.removeEventListener('fw:burst',   onFwBurst);
      };
    }, [autoLaunch, launchInterval, fullPage, launch, launchSalvo, launchRainbow, burstAt]);

    /* ── Render ── */
    if (fullPage) {
      return (
        <canvas
          ref={canvasRef}
          className={`block ${className}`}
          style={{
            position:      'fixed',
            inset:         0,
            width:         '100vw',
            height:        '100vh',
            zIndex:        9999,
            pointerEvents: 'none',
          }}
        />
      );
    }

    return (
      <canvas
        ref={canvasRef}
        className={`w-full h-full block ${className}`}
      />
    );
  }
);

FireworksCanvas.displayName = 'FireworksCanvas';
export default FireworksCanvas;
