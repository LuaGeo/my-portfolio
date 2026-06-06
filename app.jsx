// ─── Root App ────────────────────────────────────────────────────────────────
const PD = window.PORTFOLIO_DATA;
const PD_TECH = PD.TECH;
const PD_PROJECTS = PD.PROJECTS;
const PD_T = PD.T;

function usePersistedState(key, fallback) {
  const [v, setV] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {}
  }, [key, v]);
  return [v, setV];
}

function App() {
  const [lang, setLang] = usePersistedState("ldo.lang", "fr");
  const [open, setOpen] = useState(null);

  useReveal();

  const techIndex = useMemo(
    () => Object.fromEntries(PD_TECH.map((t) => [t.id, t])),
    [],
  );
  const T = PD_T;

  return (
    <>
      <Aurora />
      <Toolbar lang={lang} setLang={setLang} />

      <div className="shell">
        <Sidebar lang={lang} T={T} profileSrc="img/luana_deo2.PNG" />

        <main className="main">
          {/* HERO */}
          <section className="section hero" id="about" data-screen-label="Hero">
            <div className="hero-eyebrow reveal">
              <span className="brand-dot" style={{ marginRight: 4 }}></span>
              {T.available[lang]}
            </div>
            <h1 className="reveal">
              Data & IA, <em>par conviction.</em>
              <br />
              Fullstack, <em>par passion.</em>
            </h1>
            <p className="lead reveal">{T.bio2[lang]}</p>

            <div className="hero-meta">
              <div>
                {lang === "fr"
                  ? "projets livrés"
                  : lang === "en"
                    ? "shipped projects"
                    : "projetos entregues"}
                &nbsp;&nbsp;<b>8+</b>
              </div>
              <div>
                {lang === "fr"
                  ? "années code"
                  : lang === "en"
                    ? "years coding"
                    : "anos de código"}
                &nbsp;&nbsp;<b>5+</b>
              </div>
              <div>
                {lang === "fr"
                  ? "· basée à"
                  : lang === "en"
                    ? "· based in"
                    : "· localização"}
                &nbsp;&nbsp;<b>Paris</b>
              </div>
              <div>
                <b>FR · EN · PT</b>
              </div>
            </div>
            <div className="hero-scroll">SCROLL</div>
          </section>

          {/* ABOUT */}
          <section className="section" data-screen-label="About">
            <div className="section-head reveal">
              <span className="section-num">01</span>
              <h2 className="section-title">{T.aboutTitle[lang]}</h2>
            </div>
            <div className="about-body reveal">
              {T.aboutBody[lang].map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </section>

          {/* STACK */}
          <section className="section" id="stack" data-screen-label="Stack">
            <div className="section-head reveal">
              <span className="section-num">02</span>
              <h2 className="section-title">{T.techTitle[lang]}</h2>
            </div>
            <div className="reveal">
              <TechGrid tech={PD_TECH} />
            </div>
          </section>

          {/* WORK */}
          <section className="section" id="work" data-screen-label="Work">
            <div className="section-head reveal">
              <span className="section-num">03</span>
              <h2 className="section-title">{T.projectsTitle[lang]}</h2>
            </div>
            <p className="section-subtitle reveal">
              {T.projectsSubtitle[lang]}
            </p>
            <div className="project-grid">
              {PD_PROJECTS.map((p) => (
                <div key={p.id} className="reveal">
                  <ProjectCard project={p} lang={lang} onOpen={setOpen} />
                </div>
              ))}
            </div>
          </section>

          {/* CONTACT */}
          <section className="section" id="contact" data-screen-label="Contact">
            <div className="section-head reveal">
              <span className="section-num">04</span>
              <h2 className="section-title">{T.contactTitle[lang]}</h2>
            </div>
            <p className="section-subtitle reveal">{T.contactSubtitle[lang]}</p>

            <div className="contact-card reveal">
              <div>
                <h3>ldeoliveiratech@gmail.com</h3>
                <p>
                  {lang === "fr"
                    ? "Je réponds en général sous 24h. Pour les missions, projets ou simples échanges, n'hésite pas."
                    : lang === "en"
                      ? "I usually reply within 24h. For missions, projects or just a chat, feel free to reach out."
                      : "Costumo responder em 24h. Para missões, projetos ou só pra trocar uma ideia, manda mensagem."}
                </p>
              </div>
              <a
                className="contact-cta"
                href="mailto:ldeoliveiratech@gmail.com"
              >
                {lang === "fr"
                  ? "Envoyer un message"
                  : lang === "en"
                    ? "Send a message"
                    : "Enviar mensagem"}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M13 5l7 7-7 7" />
                </svg>
              </a>

              <div className="contact-links">
                <a href="mailto:ldeoliveiratech@gmail.com">
                  <span className="label">EMAIL</span>
                  <span>ldeoliveiratech@gmail.com</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/luanardeoliveira/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="label">LINKEDIN</span>
                  <span>linkedin.com/in/luanardeoliveira</span>
                </a>
                <a
                  href="https://github.com/LuaGeo/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="label">GITHUB</span>
                  <span>github.com/LuaGeo</span>
                </a>
              </div>
            </div>

            <div className="foot">
              <span>© 2026 LUANA DE OLIVEIRA</span>
              <span>BUILT WITH RIGOR & A LITTLE BIT OF JOY</span>
            </div>
          </section>
        </main>
      </div>

      {open && (
        <ProjectModal
          project={open}
          projects={PD_PROJECTS}
          lang={lang}
          T={T}
          techIndex={techIndex}
          onClose={() => setOpen(null)}
          onNavigate={setOpen}
        />
      )}
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
