// ─── Shared components ────────────────────────────────────────────────────────
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Custom cursor with point + halo
function Cursor({ enabled }) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add("custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx,
      ry = my;
    let raf;

    const move = (e) => {
      mx = e.clientX;
      my = e.clientY;
    };
    const tick = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (dotRef.current)
        dotRef.current.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
      if (ringRef.current)
        ringRef.current.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(tick);
    };

    const checkHover = (e) => {
      const t = e.target;
      const isHover =
        t &&
        t.closest(
          'a, button, .project-card, .sphere-tag, .social-btn, .modal-link, .modal-close, .contact-cta, [data-cursor="hover"]',
        );
      if (dotRef.current)
        dotRef.current.classList.toggle("is-hover", !!isHover);
      if (ringRef.current)
        ringRef.current.classList.toggle("is-hover", !!isHover);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseover", checkHover);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", checkHover);
      document.body.classList.remove("custom-cursor");
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

function Aurora() {
  return <div className="grain" aria-hidden="true"></div>;
}

// Reveal on scroll
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
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
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 21s-7-6.2-7-12a7 7 0 1 1 14 0c0 5.8-7 12-7 12z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          {T.location[lang]}
        </div>

        <p className="profile-bio">{T.bio[lang]}</p>

        <div className="socials">
          <a
            className="social-btn"
            href="https://github.com/LuaGeo/"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.27-1.68-1.27-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.68 1.25 3.34.96.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.18a10.94 10.94 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
            </svg>
          </a>
          <a
            className="social-btn"
            href="https://www.linkedin.com/in/luanardeoliveira/"
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.95v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45z" />
            </svg>
          </a>
          <a
            className="social-btn"
            href="mailto:ldeoliveiratech@gmail.com"
            aria-label="Email"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
          </a>
        </div>
      </div>
    </aside>
  );
}

// ─── Toolbar (lang + theme + sound) ───────────────────────────────────────────
function Toolbar({ lang, setLang }) {
  return (
    <div className="toolbar">
      <div className="lang-switch" role="group" aria-label="Language">
        {["fr", "en", "pt"].map((code, i) => (
          <React.Fragment key={code}>
            {i > 0 && <div className="sep"></div>}
            <button
              className={lang === code ? "active" : ""}
              onClick={() => setLang(code)}
            >
              {code}
            </button>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, { Cursor, Aurora, Sidebar, Toolbar, useReveal });
