// ─── Shared components ────────────────────────────────────────────────────────
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Custom cursor with point + halo
function Cursor({ enabled }) {
  const dotRef  = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('custom-cursor');

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx, ry = my;
    let raf;

    const move = (e) => { mx = e.clientX; my = e.clientY; };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current)  dotRef.current.style.transform  = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      if (ringRef.current) ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    const checkHover = (e) => {
      const t = e.target;
      const isHover = t && (
        t.closest('a, button, .project-card, .sphere-tag, .social-btn, .modal-link, .modal-close, .contact-cta, [data-cursor="hover"]')
      );
      if (dotRef.current)  dotRef.current.classList.toggle('is-hover', !!isHover);
      if (ringRef.current) ringRef.current.classList.toggle('is-hover', !!isHover);
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', checkHover);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', checkHover);
      document.body.classList.remove('custom-cursor');
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}

// Aurora ribbon background — slow neon curved rays moving like silk.
// Built from blurred SVG strokes whose control points oscillate via rAF.
function Aurora() {
  const ribbonsRef = useRef([]);

  useEffect(() => {
    let raf;
    const start = performance.now();

    // Each ribbon has its own frequency / phase signature → independent silk
    const RIBBONS = [
      { freqs: [0.045, 0.071, 0.029], phases: [0.0, 1.2, 0.5], amp: [180, 90, 240], driftFreq: 0.018, driftAmp: 120 },
      { freqs: [0.038, 0.063, 0.024], phases: [2.1, 0.4, 1.8], amp: [200, 110, 220], driftFreq: 0.022, driftAmp: 140 },
      { freqs: [0.052, 0.085, 0.033], phases: [1.5, 2.7, 0.9], amp: [160, 80, 260], driftFreq: 0.015, driftAmp: 100 },
    ];

    const W = 1920, H = 1080;
    const COUNT = 8; // control points per ribbon

    const animate = (now) => {
      const t = (now - start) / 1000;
      ribbonsRef.current.forEach((path, idx) => {
        if (!path) return;
        const r = RIBBONS[idx];
        // Each ribbon undulates around a different vertical baseline.
        const baseY = H * (0.35 + idx * 0.15);
        // Subtle horizontal drift so the whole ribbon shifts like wind-caught silk
        const drift = Math.sin(t * r.driftFreq * 2 * Math.PI) * r.driftAmp;

        const pts = [];
        for (let i = 0; i < COUNT; i++) {
          const x = (i / (COUNT - 1)) * (W + 400) - 200 + drift;
          const y = baseY
            + Math.sin(t * r.freqs[0] * 2 * Math.PI + i * 0.55 + r.phases[0]) * r.amp[0]
            + Math.sin(t * r.freqs[1] * 2 * Math.PI + i * 1.10 + r.phases[1]) * r.amp[1]
            + Math.sin(t * r.freqs[2] * 2 * Math.PI + i * 0.25 + r.phases[2]) * r.amp[2];
          pts.push([x, y]);
        }
        // Smooth path through points with Catmull-Rom → Bezier
        let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
        for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[Math.max(0, i - 1)];
          const p1 = pts[i];
          const p2 = pts[i + 1];
          const p3 = pts[Math.min(pts.length - 1, i + 2)];
          const c1x = p1[0] + (p2[0] - p0[0]) / 6;
          const c1y = p1[1] + (p2[1] - p0[1]) / 6;
          const c2x = p2[0] - (p3[0] - p1[0]) / 6;
          const c2y = p2[1] - (p3[1] - p1[1]) / 6;
          d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
        }
        path.setAttribute('d', d);
      });
      raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <>
      <div className="aurora-bg"></div>
      <svg className="aurora-svg" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <filter id="aurora-blur-1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="70" />
          </filter>
          <filter id="aurora-blur-2" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="90" />
          </filter>
          <linearGradient id="aurora-grad-1" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="0.2" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="0.55" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="0.85" stopColor="#ec4899" stopOpacity="1" />
            <stop offset="1"   stopColor="#ec4899" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora-grad-2" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor="#7c5cff" stopOpacity="0" />
            <stop offset="0.25" stopColor="#7c5cff" stopOpacity="1" />
            <stop offset="0.65" stopColor="#22d3ee" stopOpacity="1" />
            <stop offset="1"   stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="aurora-grad-3" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0"   stopColor="#34d399" stopOpacity="0" />
            <stop offset="0.3" stopColor="#34d399" stopOpacity="0.8" />
            <stop offset="0.7" stopColor="#a78bfa" stopOpacity="1" />
            <stop offset="1"   stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="ribbons">
          <path ref={(el) => ribbonsRef.current[0] = el}
                stroke="url(#aurora-grad-1)" strokeWidth="180" fill="none"
                strokeLinecap="round" filter="url(#aurora-blur-1)" opacity="0.85" />
          <path ref={(el) => ribbonsRef.current[1] = el}
                stroke="url(#aurora-grad-2)" strokeWidth="150" fill="none"
                strokeLinecap="round" filter="url(#aurora-blur-2)" opacity="0.7" />
          <path ref={(el) => ribbonsRef.current[2] = el}
                stroke="url(#aurora-grad-3)" strokeWidth="120" fill="none"
                strokeLinecap="round" filter="url(#aurora-blur-1)" opacity="0.5" />
        </g>
      </svg>
      <div className="grain"></div>
    </>
  );
}

// Reveal on scroll
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

// Hover sound — generated via WebAudio so no external file
function useHoverSound(enabled) {
  const ctxRef = useRef(null);
  useEffect(() => {
    if (!enabled) return;
    const onHover = (e) => {
      const t = e.target;
      if (!t || !t.closest) return;
      const trigger = t.closest('.project-card, .sphere-tag, .social-btn, .modal-link, .contact-cta, .sidebar-nav a, .lang-switch button, .icon-btn');
      if (!trigger || trigger.dataset.sounded === '1') return;
      trigger.dataset.sounded = '1';
      setTimeout(() => { trigger.dataset.sounded = '0'; }, 120);

      try {
        if (!ctxRef.current) ctxRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const ctx = ctxRef.current;
        if (ctx.state === 'suspended') ctx.resume();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine';
        o.frequency.value = 880 + Math.random() * 180;
        g.gain.value = 0;
        o.connect(g); g.connect(ctx.destination);
        const now = ctx.currentTime;
        g.gain.linearRampToValueAtTime(0.04, now + 0.005);
        g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        o.start(now);
        o.stop(now + 0.2);
      } catch(err) { /* ignore */ }
    };
    document.addEventListener('mouseover', onHover);
    return () => document.removeEventListener('mouseover', onHover);
  }, [enabled]);
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ lang, T, profileSrc }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-dot"></span>
        <span>LDO · PORTFOLIO · '26</span>
      </div>

      <div>
        <div className="profile-photo">
          <img src={profileSrc} alt="Luana de Oliveira" />
        </div>
        <h2 className="profile-name">Luana de Oliveira</h2>
        <div className="profile-role">{T.role[lang]}</div>
        <div className="profile-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12z"/>
            <circle cx="12" cy="9" r="2.5"/>
          </svg>
          {T.location[lang]}
        </div>

        <p className="profile-bio">{T.bio[lang]}</p>

        <div className="socials">
          <a className="social-btn" href="https://github.com/LuaGeo/" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.94 10.94 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>
          </a>
          <a className="social-btn" href="https://www.linkedin.com/in/luanardeoliveira/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z"/></svg>
          </a>
          <a className="social-btn" href="mailto:ldeoliveiratech@gmail.com" aria-label="Email">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
          </a>
        </div>
      </div>


    </aside>
  );
}

// ─── Toolbar (lang + theme + sound) ───────────────────────────────────────────
function Toolbar({ lang, setLang, theme, setTheme, sound, setSound }) {
  return (
    <div className="toolbar">
      <div className="lang-switch" role="group" aria-label="Language">
        {['fr','en','pt'].map((code, i) => (
          <React.Fragment key={code}>
            {i > 0 && <div className="sep"></div>}
            <button className={lang === code ? 'active' : ''} onClick={() => setLang(code)}>{code}</button>
          </React.Fragment>
        ))}
      </div>
      <button className={'icon-btn ' + (sound ? 'on' : '')} onClick={() => setSound(!sound)} aria-label="Toggle sound">
        {sound ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 5 6 9H2v6h4l5 4V5z"/><line x1="22" y1="9" x2="16" y2="15"/><line x1="16" y1="9" x2="22" y2="15"/></svg>
        )}
      </button>
      <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
        {theme === 'dark' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        )}
      </button>
    </div>
  );
}

Object.assign(window, { Cursor, Aurora, Sidebar, Toolbar, useReveal, useHoverSound });
