// ─── Tech Sphere ──────────────────────────────────────────────────────────────
// 3D sphere of tech logos using Fibonacci-distributed points. Rotates
// automatically and responds to drag.

function TechSphere({ tech }) {
  const wrapRef = useRef(null);
  const sphereRef = useRef(null);
  const state = useRef({
    rx: -10, ry: 0,
    vx: 0,  vy: 0.18,
    dragging: false, lastX: 0, lastY: 0,
  });

  // Fibonacci sphere distribution
  const positions = useMemo(() => {
    const n = tech.length;
    const R = 200; // radius in px
    const golden = Math.PI * (3 - Math.sqrt(5));
    return tech.map((t, i) => {
      const y = 1 - (i / (n - 1)) * 2;            // -1..1
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;
      return { x: x * R, y: y * R, z: z * R, tech: t };
    });
  }, [tech]);

  useEffect(() => {
    let raf;
    const tick = () => {
      const s = state.current;
      if (!s.dragging) {
        s.ry += s.vy;
        // gentle decay for inertia
        s.vy = s.vy * 0.985 + 0.18 * 0.015;
        s.vx *= 0.92;
        s.rx += s.vx;
      }
      // clamp rx
      s.rx = Math.max(-60, Math.min(60, s.rx));
      if (sphereRef.current) {
        sphereRef.current.style.transform = `rotateX(${s.rx}deg) rotateY(${s.ry}deg)`;
      }
      // counter-rotate each tag to face viewer
      const tags = sphereRef.current?.querySelectorAll('.sphere-tag');
      if (tags) {
        tags.forEach((tag) => {
          const i = +tag.dataset.i;
          const p = positions[i];
          if (!p) return;
          // depth-based opacity & scale
          // approximate visible z after rotation
          const rx = (s.rx * Math.PI) / 180;
          const ry = (s.ry * Math.PI) / 180;
          // rotate the original point
          // Ry first then Rx (matches CSS rotateX(rotateY(p)))
          const cosRy = Math.cos(ry), sinRy = Math.sin(ry);
          const cosRx = Math.cos(rx), sinRx = Math.sin(rx);
          // after rotateY
          const x1 =  p.x * cosRy + p.z * sinRy;
          const z1 = -p.x * sinRy + p.z * cosRy;
          // after rotateX
          const y2 =  p.y * cosRx - z1 * sinRx;
          const z2 =  p.y * sinRx + z1 * cosRx;
          const depth = (z2 + 220) / 440; // 0..1
          const op = 0.35 + depth * 0.65;
          const sc = 0.7 + depth * 0.5;
          tag.style.opacity = op;
          tag.style.zIndex = Math.round(depth * 1000);
          tag.style.filter = `blur(${(1 - depth) * 1.2}px)`;
          tag.querySelector('img').style.transform = `scale(${sc})`;
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [positions]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const onDown = (e) => {
      const s = state.current;
      s.dragging = true;
      s.lastX = (e.touches?.[0]?.clientX ?? e.clientX);
      s.lastY = (e.touches?.[0]?.clientY ?? e.clientY);
      wrap.classList.add('dragging');
    };
    const onMove = (e) => {
      const s = state.current;
      if (!s.dragging) return;
      const x = (e.touches?.[0]?.clientX ?? e.clientX);
      const y = (e.touches?.[0]?.clientY ?? e.clientY);
      const dx = x - s.lastX;
      const dy = y - s.lastY;
      s.lastX = x; s.lastY = y;
      s.ry += dx * 0.45;
      s.rx -= dy * 0.45;
      s.vy = dx * 0.06;
      s.vx = -dy * 0.06;
    };
    const onUp = () => {
      state.current.dragging = false;
      wrap.classList.remove('dragging');
    };
    wrap.addEventListener('mousedown', onDown);
    wrap.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchend', onUp);
    return () => {
      wrap.removeEventListener('mousedown', onDown);
      wrap.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchend', onUp);
    };
  }, []);

  return (
    <div className="sphere-wrap" ref={wrapRef}>
      <div className="sphere" ref={sphereRef}>
        {positions.map((p, i) => (
          <div
            key={p.tech.id}
            className="sphere-tag"
            data-i={i}
            style={{ transform: `translate3d(${p.x}px, ${p.y}px, ${p.z}px)` }}
            title={p.tech.name}
          >
            <img src={p.tech.src} alt={p.tech.name} />
            <span className="label">{p.tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Project Card ─────────────────────────────────────────────────────────────
function ProjectCard({ project, lang, onOpen }) {
  const ref = useRef(null);

  const onMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    // tilt + subtle lift
    const rx = ((y / r.height) - 0.5) * -8;
    const ry = ((x / r.width)  - 0.5) *  8;
    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
  }, []);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = '';
  }, []);

  const hasMedia = project.image || project.video;
  const mediaStyle = project.image ? { backgroundImage: `url(${project.image})` } : {};

  return (
    <article
      ref={ref}
      className="project-card"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={() => onOpen(project)}
    >
      <div className="card-media" style={mediaStyle}>
        {!project.image && project.video && (
          <div style={{
            width: '100%', height: '100%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'linear-gradient(135deg, #1a1a22, #2a2a35)',
          }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="rgba(255,255,255,0.4)"><path d="M8 5v14l11-7z"/></svg>
          </div>
        )}
      </div>
      <div className="card-overlay"></div>
      <button className="card-cta" aria-label="Open">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
      </button>
      <div className="card-body">
        <div className="card-tags">
          {project.tags.map(tag => <span key={tag} className="card-tag">{tag}</span>)}
        </div>
        <h3 className="card-title">{project.title[lang]}</h3>
        <p className="card-sub">{project.subtitle[lang]}</p>
      </div>
    </article>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProjectModal({ project, lang, T, techIndex, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!project) return null;
  const t = T.modal;

  const linkIcon = (kind) => {
    if (kind === 'github') return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.94 10.94 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>;
    if (kind === 'demo')   return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>;
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-media">
          {project.video ? (
            <iframe src={project.video} title={project.title[lang]} allowFullScreen></iframe>
          ) : (
            <img src={project.modalImage || project.image} alt={project.title[lang]} />
          )}
          <div className="gradient"></div>
        </div>
        <button className="modal-close" onClick={onClose} aria-label={t.close[lang]}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
        </button>
        <div className="modal-body">
          <div className="modal-tags">
            {project.tags.map(tag => <span key={tag} className="card-tag" style={{background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)'}}>{tag}</span>)}
          </div>
          <h2>{project.title[lang]}</h2>
          <div className="modal-sub">{project.subtitle[lang]}</div>

          <div className="modal-block">
            <h4>{t.context[lang]}</h4>
            <p>{project.problem[lang]}</p>
          </div>

          <div className="modal-block">
            <h4>{t.overview[lang]}</h4>
            <ul>
              {project.description[lang].map((line, i) => <li key={i}>{line}</li>)}
            </ul>
          </div>

          <div className="modal-block">
            <h4>{t.stack[lang]}</h4>
            <div className="modal-stack">
              {project.stack.map(id => {
                const tech = techIndex[id];
                if (!tech) return null;
                return (
                  <span key={id} className="chip">
                    <img src={tech.src} alt={tech.name} />
                    {tech.name}
                  </span>
                );
              })}
              {project.stackExtra.map(name => (
                <span key={name} className="chip text-only">{name}</span>
              ))}
            </div>
          </div>

          <div className="modal-links">
            {project.links.map((link, i) => (
              <a
                key={i}
                className={'modal-link ' + (i === 0 ? 'primary' : '')}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                {linkIcon(link.kind)}
                {link.label[lang]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { TechSphere, ProjectCard, ProjectModal });
