// ─── Tech Grid ────────────────────────────────────────────────────────────────
const CAT_ORDER = ['lang', 'frontend', 'backend', 'data', 'ml', 'cloud', 'tool'];
const CAT_LABEL = { lang: 'Langages', frontend: 'Frontend', backend: 'Backend', data: 'Data', ml: 'ML / IA', cloud: 'Cloud & Infra', tool: 'Outils' };

function TechGrid({ tech }) {
  const byCategory = useMemo(() => {
    const map = {};
    tech.forEach(t => {
      const c = t.cat || 'tool';
      if (!map[c]) map[c] = [];
      map[c].push(t);
    });
    return map;
  }, [tech]);

  const cats = CAT_ORDER.filter(c => byCategory[c]);

  return (
    <div className="tech-grid">
      {cats.map(cat => (
        <div key={cat} className="tech-category">
          <div className="tech-cat-label">{CAT_LABEL[cat]}</div>
          <div className="tech-chips">
            {byCategory[cat].map(t => (
              <div key={t.id} className="tech-chip">
                <img src={t.src} alt={t.name} />
                <span>{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
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
        <h3 className="card-title">{project.title[lang]}</h3>
        <p className="card-sub">{project.subtitle[lang]}</p>
      </div>
    </article>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function ProjectModal({ project, projects, lang, T, techIndex, onClose, onNavigate }) {
  const idx     = projects.findIndex(p => p.id === project.id);
  const prev    = idx > 0               ? projects[idx - 1] : null;
  const next    = idx < projects.length - 1 ? projects[idx + 1] : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape')      onClose();
      if (e.key === 'ArrowLeft'  && prev) onNavigate(prev);
      if (e.key === 'ArrowRight' && next) onNavigate(next);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose, onNavigate, prev, next]);

  if (!project) return null;
  const t = T.modal;

  const linkIcon = (kind) => {
    if (kind === 'github') return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.94 10.94 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/></svg>;
    if (kind === 'demo')   return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>;
    return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 3h7v7M10 14 21 3M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/></svg>;
  };

  const NavBtn = ({ project: target, dir }) => (
    <button
      className={'modal-nav-btn modal-nav-' + dir}
      onClick={(e) => { e.stopPropagation(); onNavigate(target); }}
      aria-label={dir === 'prev' ? 'Projet précédent' : 'Projet suivant'}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {dir === 'prev'
          ? <path d="M15 18l-6-6 6-6"/>
          : <path d="M9 18l6-6-6-6"/>}
      </svg>
    </button>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      {prev && <NavBtn project={prev} dir="prev" />}
      {next && <NavBtn project={next} dir="next" />}
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

Object.assign(window, { TechGrid, ProjectCard, ProjectModal });
