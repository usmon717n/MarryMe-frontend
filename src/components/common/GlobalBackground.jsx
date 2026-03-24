import { useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';

export default function GlobalBackground() {
  const { isDark } = useTheme();
  const canvasRef  = useRef(null);
  const rafRef     = useRef(null);
  const tRef       = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    tRef.current = 0;

    // ── LIGHT: pushti mesh ──────────────────────────────────
    const lightBlobs = [
      { x:.22, y:.18, rx:.62, ry:.42, rot:0,   rotS:.00025, moveS:.00035, ph:0.0, col:[255,182,193] },
      { x:.72, y:.15, rx:.55, ry:.36, rot:1.2,  rotS:.00018, moveS:.00045, ph:1.3, col:[244,154,174] },
      { x:.50, y:.65, rx:.68, ry:.40, rot:2.4,  rotS:.00030, moveS:.00028, ph:2.5, col:[255,204,213] },
      { x:.12, y:.58, rx:.50, ry:.34, rot:0.8,  rotS:.00022, moveS:.00040, ph:0.9, col:[220,140,162] },
      { x:.88, y:.50, rx:.52, ry:.36, rot:3.1,  rotS:.00020, moveS:.00032, ph:3.2, col:[255,218,225] },
      { x:.38, y:.35, rx:.40, ry:.28, rot:1.7,  rotS:.00035, moveS:.00042, ph:1.8, col:[240,128,155] },
      { x:.68, y:.78, rx:.46, ry:.32, rot:4.2,  rotS:.00025, moveS:.00025, ph:4.0, col:[255,192,203] },
    ];

    // ── DARK: Velvet Plum — to'q binafsha-qizil ────────────
    // Binafsha, qizil, to'q pushti bloblar — qorong'u fonda
    const darkBlobs = [
      { x:.25, y:.20, rx:.65, ry:.44, rot:0.0,  rotS:.00020, moveS:.00028, ph:0.0, col:[120, 0,100] },
      { x:.75, y:.18, rx:.58, ry:.38, rot:1.4,  rotS:.00015, moveS:.00035, ph:1.4, col:[ 90, 0,130] },
      { x:.50, y:.68, rx:.70, ry:.42, rot:2.6,  rotS:.00025, moveS:.00022, ph:2.7, col:[150, 0, 80] },
      { x:.10, y:.60, rx:.52, ry:.36, rot:0.6,  rotS:.00018, moveS:.00032, ph:0.8, col:[ 80, 0,110] },
      { x:.90, y:.48, rx:.56, ry:.38, rot:3.3,  rotS:.00022, moveS:.00028, ph:3.2, col:[160, 0, 60] },
      { x:.35, y:.14, rx:.44, ry:.30, rot:1.8,  rotS:.00030, moveS:.00038, ph:1.2, col:[100, 0,140] },
      { x:.80, y:.75, rx:.52, ry:.35, rot:4.4,  rotS:.00020, moveS:.00025, ph:4.0, col:[130, 0, 90] },
      { x:.18, y:.82, rx:.46, ry:.32, rot:5.1,  rotS:.00025, moveS:.00030, ph:2.0, col:[ 70, 0,120] },
    ];

    const blobs = isDark ? darkBlobs : lightBlobs;
    const baseBg = isDark ? [14, 0, 20] : [252, 228, 236]; // #0e0014 vs #fce4ec

    function resize() {
      const dpr = window.devicePixelRatio || 1;
      canvas.width  = window.innerWidth  * dpr;
      canvas.height = window.innerHeight * dpr;
      if (ctx.resetTransform) ctx.resetTransform();
      ctx.scale(dpr, dpr);
    }

    function draw() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const [br, bg, bb] = baseBg;

      ctx.fillStyle = 'rgb(' + br + ',' + bg + ',' + bb + ')';
      ctx.fillRect(0, 0, w, h);

      blobs.forEach(b => {
        const ox = Math.sin(tRef.current * b.moveS + b.ph) * 0.11;
        const oy = Math.cos(tRef.current * b.moveS * 1.3 + b.ph) * 0.09;
        const cx = (b.x + ox) * w;
        const cy = (b.y + oy) * h;
        const rx = b.rx * Math.min(w, h) * 0.60;
        const ry = b.ry * Math.min(w, h) * 0.60;
        const rot = b.rot + tRef.current * b.rotS;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(rot);
        ctx.scale(1, ry / rx);

        const g = ctx.createRadialGradient(0, 0, 0, 0, rx * 0.2, rx);
        const [r, gv, bl] = b.col;

        if (isDark) {
          // Dark: binafsha-qizil ranglar, ko'proq ko'rinsin
          g.addColorStop(0,    'rgba(' + r + ',' + gv + ',' + bl + ',0.72)');
          g.addColorStop(0.40, 'rgba(' + r + ',' + gv + ',' + bl + ',0.30)');
          g.addColorStop(0.75, 'rgba(' + r + ',' + gv + ',' + bl + ',0.08)');
          g.addColorStop(1,    'rgba(' + r + ',' + gv + ',' + bl + ',0)');
        } else {
          // Light: pushti
          g.addColorStop(0,    'rgba(' + r + ',' + gv + ',' + bl + ',0.82)');
          g.addColorStop(0.45, 'rgba(' + r + ',' + gv + ',' + bl + ',0.35)');
          g.addColorStop(0.80, 'rgba(' + r + ',' + gv + ',' + bl + ',0.08)');
          g.addColorStop(1,    'rgba(' + r + ',' + gv + ',' + bl + ',0)');
        }

        ctx.beginPath();
        ctx.arc(0, 0, rx, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        ctx.restore();
      });

      // Vignette
      if (isDark) {
        const vig = ctx.createRadialGradient(w/2, h/2, h * 0.15, w/2, h/2, h * 0.85);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.55)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, w, h);
      }

      tRef.current++;
      rafRef.current = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    draw();

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [isDark]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -1,
        pointerEvents: 'none',
        display: 'block',
      }}
    />
  );
}
