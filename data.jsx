// ─── Project & translation data ───────────────────────────────────────────────

const TECH = [
  // Langages
  { id: "python",     name: "Python",      src: "assets/tech/python.png",      cat: "lang" },
  { id: "javascript", name: "JavaScript",  src: "assets/tech/javascript.png",  cat: "lang" },
  { id: "typescript", name: "TypeScript",  src: "assets/tech/typescript.png",  cat: "lang" },

  // Web & API
  { id: "fastapi",       name: "FastAPI",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",   cat: "web" },
  { id: "django",        name: "Django",        src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",         cat: "web" },
  { id: "flask",         name: "Flask",         src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",        cat: "web" },
  { id: "react",         name: "React",         src: "assets/tech/react.png",                                                              cat: "web" },
  { id: "next",          name: "Next.js",       src: "assets/tech/next.png",                                                               cat: "web" },
  { id: "react-native",  name: "React Native",  src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",        cat: "web" },
  { id: "tailwind",      name: "Tailwind CSS",  src: "assets/tech/tailwind.png",                                                           cat: "web" },

  // Data
  { id: "sql",       name: "SQL",       src: "assets/tech/sql.png",       cat: "data" },
  { id: "mysql",     name: "MySQL",     src: "assets/tech/mysql.png",     cat: "data" },
  { id: "mongodb",   name: "MongoDB",   src: "assets/tech/mongodb.png",   cat: "data" },
  { id: "pandas",    name: "Pandas",    src: "assets/tech/pandas.png",    cat: "data" },
  { id: "numpy",     name: "NumPy",     src: "assets/tech/numpy.png",     cat: "data" },
  { id: "matplotlib",name: "Matplotlib",src: "assets/tech/matplotlib.png",cat: "data" },
  { id: "seaborn",   name: "Seaborn",   src: "assets/tech/seaborn.png",   cat: "data" },
  { id: "plotly",    name: "Plotly",    src: "assets/tech/plotly.png",    cat: "data" },
  { id: "tableau",   name: "Tableau",   src: "assets/tech/tableau.png",   cat: "data" },
  { id: "powerbi",   name: "Power BI",  src: "assets/tech/powerbi.png",   cat: "data" },
  { id: "bigquery",  name: "BigQuery",  src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlebigquery.svg", cat: "data" },
  { id: "streamlit", name: "Streamlit", src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/streamlit.svg",     cat: "data" },

  // ML / IA
  { id: "sklearn",  name: "Scikit-learn", src: "assets/tech/scikitlearn.png",                                                                      cat: "ml" },
  { id: "pytorch",  name: "PyTorch",      src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",                  cat: "ml" },

  // Cloud & Infra
  { id: "docker",   name: "Docker",       src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",  cat: "cloud" },
  { id: "git",      name: "Git",          src: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",        cat: "cloud" },
  { id: "gcp",      name: "Google Cloud", src: "assets/tech/gcp.png",                                                            cat: "cloud" },
  { id: "aws",      name: "AWS",          src: "assets/tech/aws.png",                                                            cat: "cloud" },
  { id: "n8n",      name: "n8n",          src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/n8n.svg",            cat: "cloud" },
  { id: "railway",  name: "Railway",      src: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/railway.svg",        cat: "cloud" },
];

const PROJECTS = [
  {
    id: "n8n-rdv",
    image: "assets/projects/n8n-rdv.png",
    modalImage: "assets/projects/raw/n8n-rdv.png",
    tags: ["Automation", "Cloud", "DevOps"],
    title: {
      fr: "Bot RDV Préfecture",
      en: "Prefecture Appointment Bot",
      pt: "Bot RDV Prefeitura",
    },
    subtitle: {
      fr: "Automatisation n8n / Hébergement AWS",
      en: "n8n automation / AWS hosting",
      pt: "Automação n8n / Hospedagem AWS",
    },
    problem: {
      fr: "Les créneaux de rendez-vous en préfecture disparaissent en quelques secondes. L'enjeu : surveiller en continu les disponibilités et réserver automatiquement dès qu'un créneau s'ouvre — sans infrastructure coûteuse.",
      en: "Prefecture appointment slots vanish within seconds of appearing. The goal: continuously monitor availability and automatically book as soon as a slot opens — without expensive infrastructure.",
      pt: "As vagas de agendamento na prefeitura somem em segundos. O desafio: monitorar continuamente as disponibilidades e reservar automaticamente assim que uma vaga aparecer — sem infraestrutura cara.",
    },
    description: {
      fr: [
        "Workflow n8n surveille en continu le portail préfecture et envoie une alerte Telegram avec le lien direct dès qu'un créneau se libère — la réservation reste manuelle.",
        "Hébergement sur AWS EC2 t2.micro (Free Tier) avec Docker Compose — coût quasi nul, workflow actif 24/7.",
        "Intégration Google Sheets via OAuth2 pour le suivi des disponibilités ; ngrok assure le tunnel HTTPS requis par l'API Google.",
      ],
      en: [
        "n8n workflow continuously watches the prefecture portal and fires a Telegram alert with a direct link the moment a slot opens — booking is then done manually.",
        "Hosted on AWS EC2 t2.micro (Free Tier) with Docker Compose — near-zero cost, workflow running 24/7.",
        "Google Sheets integration via OAuth2 to track availability; ngrok provides the HTTPS tunnel required by the Google API.",
      ],
      pt: [
        "Workflow n8n monitora continuamente o portal da prefeitura e dispara um alerta no Telegram com o link direto assim que uma vaga surge — o agendamento é feito manualmente.",
        "Hospedado em AWS EC2 t2.micro (Free Tier) com Docker Compose — custo quase zero, workflow ativo 24/7.",
        "Integração com Google Sheets via OAuth2 para rastrear as disponibilidades; ngrok fornece o túnel HTTPS exigido pela API Google.",
      ],
    },
    stack: ["n8n", "aws", "docker", "gcp"],
    stackExtra: [
      "EC2 t2.micro",
      "Docker Compose",
      "ngrok",
      "Google Sheets API",
      "Telegram Bot API",
    ],
    links: [],
  },
  {
    id: "comparateur",
    image: "assets/projects/comparateur.png",
    modalImage: "assets/projects/raw/comparateur.png",
    tags: ["Data", "OCR", "Fullstack"],
    title: {
      fr: "Comparateur de PDF",
      en: "PDF Comparator",
      pt: "Comparador de PDF",
    },
    subtitle: {
      fr: "Data / OCR / Backend / Frontend",
      en: "Data / OCR / Backend / Frontend",
      pt: "Data / OCR / Backend / Frontend",
    },
    problem: {
      fr: "Comparer rapidement deux versions d'un document PDF — y compris des PDF scannés — et visualiser précisément ce qui a été ajouté, supprimé ou modifié.",
      en: "Quickly compare two versions of a PDF — including scanned ones — and clearly visualise everything that was added, removed or modified.",
      pt: "Comparar rapidamente duas versões de um PDF — inclusive escaneados — e visualizar com precisão o que foi adicionado, removido ou modificado.",
    },
    description: {
      fr: [
        "Outil de comparaison de documents PDF avec extraction de texte natif et OCR pour les PDF scannés.",
        "Algorithme de diff personnalisé avec mise en évidence visuelle des modifications.",
        "Interface double : démo Streamlit pour la rapidité, et version Next.js pour l'expérience finale.",
      ],
      en: [
        "PDF document comparator with native text extraction and OCR for scanned files.",
        "Custom diff algorithm with visual highlighting of all changes.",
        "Dual interface: a Streamlit demo for speed, and a Next.js build for the polished experience.",
      ],
      pt: [
        "Ferramenta de comparação de PDFs com extração de texto nativo e OCR para arquivos escaneados.",
        "Algoritmo de diff personalizado com destaque visual das modificações.",
        "Interface dupla: demo Streamlit para rapidez, e versão Next.js para a experiência final.",
      ],
    },
    stack: ["python", "fastapi", "gcp", "next", "react"],
    stackExtra: ["PyMuPDF", "Google Cloud Vision", "Streamlit"],
    links: [
      {
        kind: "demo",
        url: "https://comparateur-de-pdf.streamlit.app",
        label: {
          fr: "Démo Streamlit",
          en: "Streamlit demo",
          pt: "Demo Streamlit",
        },
      },
      {
        kind: "github",
        url: "https://github.com/LuaGeo/final_comparator_app",
        label: {
          fr: "GitHub (Streamlit)",
          en: "GitHub (Streamlit)",
          pt: "GitHub (Streamlit)",
        },
      },
      {
        kind: "github",
        url: "https://github.com/LuaGeo/docs-comparator-next",
        label: {
          fr: "GitHub (Next.js)",
          en: "GitHub (Next.js)",
          pt: "GitHub (Next.js)",
        },
      },
    ],
  },
  {
    id: "guessmymeal",
    image: "assets/projects/guessmymeal.png",
    modalImage: "assets/projects/raw/guessmymeal.png",
    tags: ["Mobile", "Computer Vision", "ML"],
    title: { fr: "GuessMyMeal", en: "GuessMyMeal", pt: "GuessMyMeal" },
    subtitle: {
      fr: "Mobile / Computer Vision / Deep Learning",
      en: "Mobile / Computer Vision / Deep Learning",
      pt: "Mobile / Computer Vision / Deep Learning",
    },
    problem: {
      fr: "Identifier un plat à partir d'une simple photo, en pesant la précision d'un modèle spécialisé contre la flexibilité d'un grand modèle généraliste.",
      en: "Identify a meal from a single photo, balancing the precision of a specialised model against the flexibility of a large general one.",
      pt: "Identificar um prato a partir de uma única foto, equilibrando a precisão de um modelo especializado e a flexibilidade de um modelo generalista.",
    },
    description: {
      fr: [
        "Application mobile de reconnaissance de plats en temps réel.",
        "Modèle YOLOv8 fine-tuné sur Food-101 (25 classes) pour la détection rapide locale.",
        "Solution hybride : OpenAI Vision API en complément pour les plats hors-distribution.",
      ],
      en: [
        "Mobile app for real-time meal recognition.",
        "YOLOv8 model fine-tuned on Food-101 (25 classes) for fast local detection.",
        "Hybrid solution: OpenAI Vision API as a fallback for out-of-distribution dishes.",
      ],
      pt: [
        "Aplicativo mobile de reconhecimento de pratos em tempo real.",
        "Modelo YOLOv8 com fine-tuning no Food-101 (25 classes) para detecção rápida local.",
        "Solução híbrida: OpenAI Vision API como complemento para pratos fora da distribuição.",
      ],
    },
    stack: ["react", "fastapi", "mongodb", "pytorch", "python"],
    stackExtra: ["React Native", "Expo", "YOLOv8", "OpenAI Vision"],
    links: [
      {
        kind: "github",
        url: "https://github.com/LuaGeo/guessmymealMobile",
        label: { fr: "Dépôt GitHub", en: "GitHub repo", pt: "Repo GitHub" },
      },
    ],
  },
  {
    id: "wlab",
    image: "assets/projects/wlab.png",
    modalImage: "assets/projects/raw/wlab.png",
    tags: ["ML", "Healthcare"],
    title: {
      fr: "Wlab — Prédiction du cancer du sein",
      en: "Wlab — Breast Cancer Prediction",
      pt: "Wlab — Predição de câncer de mama",
    },
    subtitle: {
      fr: "Machine Learning / Classification médicale",
      en: "Machine Learning / Medical classification",
      pt: "Machine Learning / Classificação médica",
    },
    problem: {
      fr: "Aider à la décision médicale en classifiant une tumeur (bénigne / maligne) à partir de mesures cytologiques, avec un workflow utilisable individuellement ou par batch.",
      en: "Assist medical decision-making by classifying tumours (benign / malignant) from cytological measurements, with both single-input and batch workflows.",
      pt: "Apoiar a decisão médica classificando tumores (benignos / malignos) a partir de medições citológicas, com fluxo individual ou em lote.",
    },
    description: {
      fr: [
        "Prédiction de la nature d'une tumeur mammaire à partir de 30 caractéristiques cytologiques.",
        "Modèle Random Forest entraîné sur des biopsies par aspiration.",
        "Double interface : saisie manuelle ou import CSV avec prédiction batch et export des résultats.",
      ],
      en: [
        "Predicts the nature of a breast tumour from 30 cytological features.",
        "Random Forest model trained on fine-needle aspiration biopsies.",
        "Dual interface: manual entry or CSV import with batch prediction and CSV export.",
      ],
      pt: [
        "Predição da natureza de um tumor mamário a partir de 30 características citológicas.",
        "Modelo Random Forest treinado em biópsias por aspiração.",
        "Interface dupla: entrada manual ou import CSV com predição em lote e exportação.",
      ],
    },
    stack: ["python", "sklearn", "pandas", "numpy"],
    stackExtra: ["Streamlit", "joblib"],
    links: [
      {
        kind: "demo",
        url: "https://wlab-breast-cancer.streamlit.app",
        label: {
          fr: "Démo Streamlit",
          en: "Streamlit demo",
          pt: "Demo Streamlit",
        },
      },
      {
        kind: "github",
        url: "https://github.com/LuaGeo/wlab-breast-cancer",
        label: { fr: "Dépôt GitHub", en: "GitHub repo", pt: "Repo GitHub" },
      },
    ],
  },
  {
    id: "job",
    image: "assets/projects/job_prediction.png",
    modalImage: "assets/projects/raw/job_prediction.png",
    tags: ["Data", "ML"],
    title: { fr: "Job Prediction", en: "Job Prediction", pt: "Job Prediction" },
    subtitle: {
      fr: "Data / Machine Learning",
      en: "Data / Machine Learning",
      pt: "Data / Machine Learning",
    },
    problem: {
      fr: "Construire un outil pour estimer un salaire en fonction de variables métiers et expérimenter plusieurs modèles ML pour trouver le meilleur compromis.",
      en: "Build a tool to estimate salaries from job-related variables and benchmark several ML models to find the best fit.",
      pt: "Construir uma ferramenta para estimar salários a partir de variáveis de mercado e testar diversos modelos de ML.",
    },
    description: {
      fr: [
        "Dashboard interactif d'analyse exploratoire des données.",
        "Modèle de prédiction de salaires (régression supervisée).",
        "Comparaison de plusieurs algorithmes (scikit-learn, XGBoost...).",
      ],
      en: [
        "Interactive dashboard for exploratory data analysis.",
        "Salary prediction model (supervised regression).",
        "Benchmark of several algorithms (scikit-learn, XGBoost…).",
      ],
      pt: [
        "Dashboard interativo de análise exploratória dos dados.",
        "Modelo de predição de salários (regressão supervisionada).",
        "Comparação de diversos algoritmos (scikit-learn, XGBoost…).",
      ],
    },
    stack: ["python", "pandas", "numpy", "sklearn", "plotly"],
    stackExtra: ["XGBoost", "Streamlit"],
    links: [
      {
        kind: "demo",
        url: "https://hackathon-salary-prediction.streamlit.app",
        label: {
          fr: "Page Streamlit",
          en: "Streamlit page",
          pt: "Página Streamlit",
        },
      },
      {
        kind: "github",
        url: "https://github.com/LuaGeo/salary_prediction_ML_project/tree/main",
        label: { fr: "Dépôt GitHub", en: "GitHub repo", pt: "Repo GitHub" },
      },
    ],
  },
  {
    id: "cine",
    image: "assets/projects/cine.png",
    video: "https://www.youtube.com/embed/M5onhrBMHno?si=tlEAR5BAAEz2ITMr",
    tags: ["Data", "ML", "Fullstack"],
    title: { fr: "Ciné La Creuse", en: "Ciné La Creuse", pt: "Ciné La Creuse" },
    subtitle: {
      fr: "Data / ML / Backend / Frontend",
      en: "Data / ML / Backend / Frontend",
      pt: "Data / ML / Backend / Frontend",
    },
    problem: {
      fr: "Imaginer un cinéma local et proposer une expérience de recommandation de films personnalisée, depuis l'analyse des données jusqu'à l'interface web.",
      en: "Imagine a local cinema and ship a full personalised movie-recommendation experience, from data analysis to the web UI.",
      pt: "Imaginar um cinema local e oferecer uma experiência de recomendação personalizada, da análise dos dados até a interface web.",
    },
    description: {
      fr: [
        "Dashboard d'analyse des données du cinéma français.",
        "Système de recommandation de films basé sur le contenu.",
        "Backend Python/Flask et frontend React avec visualisations Plotly.",
      ],
      en: [
        "Dashboard analysing French cinema data.",
        "Content-based movie recommendation engine.",
        "Python/Flask backend with a React + Plotly frontend.",
      ],
      pt: [
        "Dashboard de análise dos dados do cinema francês.",
        "Sistema de recomendação de filmes baseado em conteúdo.",
        "Backend Python/Flask e frontend React com visualizações Plotly.",
      ],
    },
    stack: ["python", "sklearn", "pandas", "react", "javascript"],
    stackExtra: ["Flask", "Plotly", "Streamlit"],
    links: [
      {
        kind: "demo",
        url: "https://ml-cine-creuse-frontend.vercel.app/",
        label: { fr: "Démo Vercel", en: "Vercel demo", pt: "Demo Vercel" },
      },
      {
        kind: "github",
        url: "https://github.com/LuaGeo/ml_cine-creuse-backend",
        label: {
          fr: "GitHub Backend",
          en: "GitHub Backend",
          pt: "GitHub Backend",
        },
      },
      {
        kind: "github",
        url: "https://github.com/LuaGeo/ml_cine-creuse-frontend",
        label: {
          fr: "GitHub Frontend",
          en: "GitHub Frontend",
          pt: "GitHub Frontend",
        },
      },
      {
        kind: "docs",
        url: "https://www.canva.com/design/DAGKW0a6nM8/AWeq8DHFtrKhasG19fB8rA/view",
        label: { fr: "Présentation", en: "Slides", pt: "Apresentação" },
      },
    ],
  },
  {
    id: "kley",
    image: "assets/projects/kley.png",
    modalImage: "assets/projects/raw/kley.png",
    tags: ["Data", "Dataviz"],
    title: {
      fr: "Kley Résidences",
      en: "Kley Residences",
      pt: "Kley Residências",
    },
    subtitle: {
      fr: "Data / Visualisation Tableau",
      en: "Data / Tableau visualisation",
      pt: "Data / Visualização Tableau",
    },
    problem: {
      fr: "Donner un coup d'œil global sur le portefeuille de résidences via un dashboard Tableau lisible et exploitable.",
      en: "Give a clear, actionable overview of the residence portfolio through a readable Tableau dashboard.",
      pt: "Oferecer uma visão global do portfólio de residências por meio de um dashboard Tableau claro.",
    },
    description: {
      fr: [
        "Dashboard Tableau d'analyse du portefeuille de résidences.",
        "Collecte et nettoyage de données via scraping web.",
        "Visualisations interactives publiées sur Tableau Public.",
      ],
      en: [
        "Tableau dashboard analysing the residence portfolio.",
        "Data collection and cleaning via web scraping.",
        "Interactive visualisations published on Tableau Public.",
      ],
      pt: [
        "Dashboard Tableau de análise do portfólio de residências.",
        "Coleta e limpeza de dados via web scraping.",
        "Visualizações interativas publicadas no Tableau Public.",
      ],
    },
    stack: ["python", "pandas", "numpy", "tableau"],
    stackExtra: ["Requests", "BeautifulSoup", "Faker"],
    links: [
      {
        kind: "demo",
        url: "https://public.tableau.com/views/Kley_Residences/Tableaudebord1",
        label: {
          fr: "Tableau Public",
          en: "Tableau Public",
          pt: "Tableau Public",
        },
      },
    ],
  },
  {
    id: "toys",
    image: "assets/projects/toys.png",
    modalImage: "assets/projects/raw/toys.png",
    tags: ["Data", "Dataviz"],
    title: { fr: "Toys & Models", en: "Toys & Models", pt: "Toys & Models" },
    subtitle: {
      fr: "Data / Visualisation Power BI",
      en: "Data / Power BI visualisation",
      pt: "Data / Visualização Power BI",
    },
    problem: {
      fr: "Construire un dashboard Power BI à partir d'une base SQL et en tirer une lecture claire des performances commerciales.",
      en: "Build a Power BI dashboard from a SQL database and extract a clear read on commercial performance.",
      pt: "Construir um dashboard Power BI a partir de uma base SQL e extrair uma leitura clara da performance comercial.",
    },
    description: {
      fr: [
        "Dashboard Power BI d'analyse des ventes.",
        "Modélisation et requêtes SQL/MySQL.",
        "Visualisations exécutives prêtes à présenter.",
      ],
      en: [
        "Power BI dashboard for sales analysis.",
        "Data modelling and SQL/MySQL queries.",
        "Executive-ready visualisations.",
      ],
      pt: [
        "Dashboard Power BI de análise de vendas.",
        "Modelagem e consultas SQL/MySQL.",
        "Visualizações executivas prontas para apresentação.",
      ],
    },
    stack: ["sql", "mysql", "powerbi"],
    stackExtra: [],
    links: [
      {
        kind: "docs",
        url: "https://www.canva.com/design/DAGKb9BGl3U/-B_gaB8_1Z6IFYqYbdG8WQ/view",
        label: { fr: "Présentation", en: "Slides", pt: "Apresentação" },
      },
    ],
  },
];

// ─── i18n strings ─────────────────────────────────────────────────────────────

const T = {
  nav: {
    about: { fr: "À propos", en: "About", pt: "Sobre" },
    tech: { fr: "Stack", en: "Stack", pt: "Stack" },
    projects: { fr: "Projets", en: "Projects", pt: "Projetos" },
    contact: { fr: "Contact", en: "Contact", pt: "Contato" },
  },
  role: {
    fr: "Ingénieure Data & IA",
    en: "Data & AI Engineer",
    pt: "Engenheira de Dados & IA",
  },
  location: {
    fr: "Paris, France",
    en: "Paris, France",
    pt: "Paris, França",
  },
  available: {
    fr: "Disponible pour de nouvelles missions",
    en: "Available for new opportunities",
    pt: "Disponível para novos projetos",
  },
  bio: {
    fr: "Ingénieure de formation (Géosciences), fullstack par passion, Data & IA par conviction. J'aime construire des produits qui mêlent rigueur scientifique et expérience soignée.",
    en: "Engineer by training (Geosciences), fullstack by passion, Data & AI by conviction. I love building products that pair scientific rigour with thoughtful UX.",
    pt: "Engenheira de formação (Geociências), fullstack por paixão, Data & IA por convicção. Adoro construir produtos que unem rigor científico e UX cuidada.",
  },
  aboutTitle: {
    fr: "À propos",
    en: "About me",
    pt: "Sobre mim",
  },
  aboutBody: {
    fr: [
      "Ma rigueur scientifique et mon affinité pour les mathématiques sont depuis toujours le moteur de mon parcours. Dès 2020, j'ai construit en autodidacte une solide base en programmation, concrétisée par mes premiers projets GitHub.",
      "En 2023, j'ai consolidé mon profil technique par une formation en Développement Fullstack Web & Mobile (JavaScript, Node.js, React, Next.js), avant de spécialiser mon expertise en Analyse de données, puis en Ingénierie des données & IA.",
      "Mon alternance en tant que Chef de projet IA - achevée en décembre 2025 - m'a permis de piloter des projets concrets et complexes. Je mobilise aujourd'hui ma double culture d'ingénieure et de développeuse pour relever de nouveaux défis Data / IA.",
    ],
    en: [
      "Scientific rigour and a love for mathematics have always driven my path. From 2020 onward I self-taught my way into programming, shipping my first GitHub projects along the way.",
      "In 2023 I consolidated my technical profile with a Fullstack Web & Mobile training (JavaScript, Node.js, React, Next.js), then specialised in Data Analysis, and finally in Data Engineering & AI.",
      "My apprenticeship as an AI Project Lead - completed in December 2025 - gave me hands-on experience leading concrete, complex projects. Today I bring my dual engineer/developer culture to new Data & AI challenges.",
    ],
    pt: [
      "O rigor científico e a afinidade pela matemática sempre foram o motor do meu percurso. Em 2020 comecei a programar de forma autodidata, com meus primeiros projetos no GitHub.",
      "Em 2023 consolidei meu perfil técnico com uma formação em Desenvolvimento Fullstack Web & Mobile (JavaScript, Node.js, React, Next.js), e em seguida me especializei em Análise de Dados, depois em Engenharia de Dados & IA.",
      "Meu estágio como Chefe de projeto de IA - concluído em dezembro de 2025 - me permitiu liderar projetos concretos e complexos. Hoje, mobilizo minha dupla cultura de engenheira e desenvolvedora em novos desafios de Data & IA.",
    ],
  },
  techTitle: {
    fr: "Stack technique",
    en: "Technical stack",
    pt: "Stack técnica",
  },
  projectsTitle: {
    fr: "Projets sélectionnés",
    en: "Selected projects",
    pt: "Projetos selecionados",
  },
  projectsSubtitle: {
    fr: "Clique sur un projet pour explorer.",
    en: "Click any project to dive in.",
    pt: "Clique em um projeto para explorar.",
  },
  contactTitle: {
    fr: "Travaillons ensemble",
    en: "Let's work together",
    pt: "Vamos trabalhar juntas",
  },
  contactSubtitle: {
    fr: "Une mission Data / IA, un produit à construire, un café ? Écris-moi.",
    en: "A Data / AI mission, a product to build, a coffee? Drop me a line.",
    pt: "Uma missão Data / IA, um produto pra construir, um café? Me escreve.",
  },
  modal: {
    context: { fr: "Contexte", en: "Context", pt: "Contexto" },
    overview: { fr: "Aperçu", en: "Overview", pt: "Visão geral" },
    stack: { fr: "Stack", en: "Stack", pt: "Stack" },
    links: { fr: "Liens", en: "Links", pt: "Links" },
    close: { fr: "Fermer", en: "Close", pt: "Fechar" },
  },
  cta: {
    fr: "Voir le projet",
    en: "View project",
    pt: "Ver projeto",
  },
};

window.PORTFOLIO_DATA = { TECH, PROJECTS, T };
