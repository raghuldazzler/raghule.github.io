export type Lang = 'en' | 'fr'

export const profile = {
  name: 'Raghul Elamathi',
  email: 'raghulbolt2002@gmail.com',
  phone: '+33 7 80 82 71 00',
  linkedin: 'https://linkedin.com/in/raghulelamathi/',
  linkedinLabel: 'linkedin.com/in/raghulelamathi',
  location: 'Nantes, France',
}

export const resumeFile: Record<Lang, string> = {
  en: 'docs/Raghul-Elamathi-Resume-EN.pdf',
  fr: 'docs/Raghul-Elamathi-Resume-FR.pdf',
}

export const portfolioFile = 'docs/Raghul-Elamathi-Portfolio.pdf'

type Bi = Record<Lang, string>

export interface ExperienceItem {
  company: string
  role: Bi
  period: string
  place: Bi
  bullets: Record<Lang, string[]>
}

export interface ProjectItem {
  id: string
  index: string
  title: Bi
  tag: Bi
  year: string
  summary: Bi
  detail: Bi
  stack: string[]
  images: { src: string; wide?: boolean }[]
}

export const experience: ExperienceItem[] = [
  {
    company: 'Loiretech',
    role: {
      en: 'Production Line Optimization Intern',
      fr: 'Stagiaire en optimisation de ligne de production',
    },
    period: '02/2026 – 08/2026',
    place: { en: 'Nantes, France', fr: 'Nantes, France' },
    bullets: {
      en: [
        'Troubleshot production inefficiencies and implemented lean manufacturing improvements.',
        'Developed Gantt schedules to optimise production planning and resource allocation.',
        'Supported shop-floor and production operations through process monitoring and continuous improvement.',
      ],
      fr: [
        'Planification de production, support production et gestion des flux.',
        'Planification Gantt, coordination multi-équipes et optimisation des ressources.',
        'Lean Manufacturing, industrialisation produit et amélioration des processus.',
      ],
    },
  },
  {
    company: 'Impaqt Robotics',
    role: {
      en: 'Product Design Engineer Intern',
      fr: 'Stagiaire ingénieur concepteur',
    },
    period: '07/2024 – 08/2024',
    place: { en: 'Chennai, India', fr: 'Chennai, Inde' },
    bullets: {
      en: [
        'Designed robotic and electromechanical systems using 2D/3D CAD tools.',
        'Performed testing, validation and troubleshooting of mechanical assemblies.',
        'Created technical documentation, engineering drawings and PLM records.',
      ],
      fr: [
        'Conception mécanique et développement de solutions industrielles.',
        'Documentation technique, CAO 3D et standardisation.',
        'Support production, qualité et industrialisation produit.',
      ],
    },
  },
  {
    company: 'Hedvuk Private Limited',
    role: {
      en: 'Product Design and Support Engineer Intern',
      fr: 'Stagiaire ingénieur concepteur',
    },
    period: '10/2022 – 02/2023',
    place: { en: 'Remote, India', fr: 'À distance, Inde' },
    bullets: {
      en: [
        'Supported electric vehicle development through testing and design validation.',
        'Conducted simulations, GD&T analysis and root cause investigations.',
        'Collaborated with manufacturing teams to support product deployment and optimisation.',
      ],
      fr: [
        'Développement produit, CAO et coordination conception/fabrication.',
        'Analyses mécaniques, amélioration produit et DFM.',
        'Collaboration fabrication, approvisionnement et gestion technique.',
      ],
    },
  },
  {
    company: 'Solinas Integrity Private Ltd.',
    role: {
      en: 'Product and Design Support Intern',
      fr: 'Stagiaire en conception mécanique',
    },
    period: '08/2022 – 09/2022',
    place: { en: 'Chennai, India', fr: 'Chennai, Inde' },
    bullets: {
      en: [
        'Developed robotic modules, mechanical assemblies and automation components.',
        'Performed system testing, troubleshooting and product validation activities.',
        'Supported system integration, customer technical issue resolution and cross-functional teams.',
      ],
      fr: [
        'Conception mécanique et optimisation de systèmes industriels.',
        'Support fabrication, assemblage et validation technique.',
        'Coordination fournisseurs, industrialisation et suivi projet.',
      ],
    },
  },
]

export const education = [
  {
    school: 'École Centrale de Nantes',
    degree: {
      en: 'MSc Industrial Engineering — Agile Factory Management (I-ENG AFM)',
      fr: 'Master en génie industriel — Gestion agile des usines (I-ENG AFM)',
    },
    period: '2024 – 2026',
    place: { en: 'Nantes, France', fr: 'Nantes, France' },
  },
  {
    school: 'Chennai Institute of Technology',
    degree: {
      en: 'B.E. Mechatronics Engineering',
      fr: 'Licence en ingénierie mécatronique',
    },
    period: '2020 – 2024',
    place: { en: 'Chennai, India', fr: 'Chennai, Inde' },
  },
]

export const projects: ProjectItem[] = [
  {
    id: 'hexabot',
    index: '01',
    title: { en: 'Hexabot', fr: 'Hexabot' },
    tag: { en: 'Six-legged robot', fr: 'Robot hexapode' },
    year: '2023',
    summary: {
      en: 'A six-legged hexapod robot capable of stable locomotion on uneven terrain, engineered to carry defence and delivery payloads.',
      fr: "Un robot hexapode à six pattes capable d'une locomotion stable sur terrain accidenté, conçu pour transporter des charges utiles de défense et de livraison.",
    },
    detail: {
      en: 'The design focused on leg kinematics, load distribution and CAD modelling for reliability and modular assembly. The robot operates in dual modes: fully autonomous, where sensor inputs enable obstacle detection, gait planning and stable navigation across complex terrain; and human-controlled, supporting real-time teleoperation for precise manoeuvring during critical tasks. Control algorithms, actuators and communication modules were integrated and validated through extensive testing of stability, responsiveness and operational reliability.',
      fr: "La conception s'est concentrée sur la cinématique des pattes, la répartition des charges et la modélisation CAO pour la fiabilité et l'assemblage modulaire. Le robot fonctionne en deux modes : entièrement autonome, où les capteurs permettent la détection d'obstacles, la planification de la démarche et une navigation stable sur terrain complexe ; et piloté par un opérateur, avec téléopération en temps réel pour des manœuvres précises. Algorithmes de contrôle, actionneurs et modules de communication ont été intégrés puis validés par des essais approfondis de stabilité, réactivité et fiabilité opérationnelle.",
    },
    stack: ['SOLIDWORKS', 'FEA', 'Gait planning', 'IoT', 'Mechatronics'],
    images: [
      { src: 'projects/hexabot-fea.jpg', wide: true },
      { src: 'projects/hexabot-build-1.jpg' },
      { src: 'projects/hexabot-build-2.jpg' },
    ],
  },
  {
    id: 'amr',
    index: '02',
    title: { en: 'AMR — Autonomous Mobile Robot', fr: 'AMR — Robot mobile autonome' },
    tag: { en: 'Smart mobility platform', fr: 'Plateforme de mobilité intelligente' },
    year: '2024',
    summary: {
      en: 'An autonomous mobile robot for smart mobility applications, built around robust mechanical design, CAD modelling and seamless sensor integration.',
      fr: "Un robot mobile autonome pour la mobilité intelligente, construit autour d'une conception mécanique robuste, de la modélisation CAO et d'une intégration capteurs fluide.",
    },
    detail: {
      en: 'The system enables autonomous navigation through real-time localisation, path planning and obstacle avoidance, ensuring safe and efficient movement in dynamic environments. A manual override mode allows controlled operation when required. The project emphasised system architecture, reliability and performance optimisation through iterative testing, making the AMR suitable for industrial and service-oriented applications.',
      fr: "Le système permet une navigation autonome par localisation temps réel, planification de trajectoire et évitement d'obstacles, garantissant des déplacements sûrs et efficaces en environnement dynamique. Un mode de reprise manuelle autorise un pilotage contrôlé si nécessaire. Le projet a mis l'accent sur l'architecture système, la fiabilité et l'optimisation des performances par tests itératifs, rendant l'AMR adapté aux applications industrielles et de service.",
    },
    stack: ['CAD', 'Sensor integration', 'Path planning', 'System architecture'],
    images: [
      { src: 'projects/amr-render.jpg', wide: true },
      { src: 'projects/amr-breakdown.jpg', wide: true },
    ],
  },
  {
    id: 'baja',
    index: '03',
    title: { en: 'SAE E-Baja', fr: 'SAE E-Baja' },
    tag: { en: 'Off-road vehicle', fr: 'Véhicule tout-terrain' },
    year: '2022',
    summary: {
      en: 'Design and development of off-road vehicles for SAE BAJA and Mega ATV competitions, including an innovative 6-axis rear suspension concept.',
      fr: "Conception et développement de véhicules tout-terrain pour les compétitions SAE BAJA et Mega ATV, avec un concept innovant de suspension arrière à 6 axes.",
    },
    detail: {
      en: 'The suspension concept aimed to improve stability, traction and terrain adaptability. Work involved CAD design, basic CAE validation, fabrication support and on-track testing — providing strong exposure to real-world vehicle dynamics, durability and team-based engineering under competitive conditions.',
      fr: "Le concept de suspension visait à améliorer la stabilité, la traction et l'adaptabilité au terrain. Les travaux ont couvert la conception CAO, la validation CAE de base, le support fabrication et les essais en piste — offrant une exposition concrète à la dynamique véhicule, à la durabilité et à l'ingénierie en équipe en conditions de compétition.",
    },
    stack: ['CAD', 'CAE validation', 'Vehicle dynamics', 'Fabrication'],
    images: [
      { src: 'projects/baja-1.jpg', wide: true },
      { src: 'projects/baja-2.jpg' },
      { src: 'projects/baja-3.jpg' },
    ],
  },
]

export const softwareSkills = [
  { name: 'SOLIDWORKS', level: 95 },
  { name: 'CATIA V5', level: 85 },
  { name: 'Creo Parametric', level: 75 },
  { name: 'NX CAD', level: 70 },
  { name: 'AutoCAD', level: 85 },
  { name: 'Ansys', level: 70 },
  { name: 'Sim Pro 3.1', level: 65 },
  { name: 'Power BI', level: 65 },
]

export const domainSkills: Bi[] = [
  { en: 'GD&T & Tolerance Analysis', fr: 'Cotation fonctionnelle & GD&T' },
  { en: 'Product Industrialisation', fr: 'Industrialisation produit' },
  { en: 'Lean Manufacturing', fr: 'Lean Manufacturing' },
  { en: 'DFM — Design for Manufacturing', fr: 'DFM — Conception pour la fabrication' },
  { en: 'Robotics & Automation', fr: 'Robotique & automatisation' },
  { en: 'System Integration', fr: 'Intégration système' },
  { en: 'Root Cause Analysis (RCA) & 8D', fr: 'Analyse des causes racines (RCA) & 8D' },
  { en: 'Production Support & Planning', fr: 'Support production & planification' },
]

export const certifications = [
  { name: 'SOLIDWORKS Expert (CSWE)', issuer: 'Dassault Systèmes' },
  { name: '3DEXPERIENCE Associate', issuer: 'Design, Simulation, PLM, Industry Innovator, Project Planner, Structural Designer, CATIA V5' },
  { name: 'Autodesk Inventor Professional', issuer: 'Autodesk' },
  { name: 'Six Sigma White & Yellow Belt', issuer: 'Six Sigma' },
  { name: 'DriveWorksXpress Associate', issuer: 'DriveWorks' },
  { name: 'AWS Educate — Generative AI', issuer: 'Amazon Web Services' },
]

export const awards = [
  {
    title: 'SOLIDWORKS Champion',
    date: '01/12/2021',
    desc: {
      en: 'Recognised for proficiency and active contribution in CAD design and the SOLIDWORKS community.',
      fr: "Reconnu pour son expertise et sa contribution active dans le domaine de la conception CAO et au sein de la communauté SOLIDWORKS.",
    },
  },
  {
    title: '3DEXPERIENCE Edu Student Champion',
    date: '01/03/2023',
    desc: {
      en: 'For demonstrating leadership, technical expertise and active contribution to the 3DEXPERIENCE academic community.',
      fr: "Pour son leadership, son expertise technique et sa contribution active à la communauté académique 3DEXPERIENCE.",
    },
  },
  {
    title: 'Encouragement Award — AAKRUTI 2023',
    date: '10/03/2023',
    desc: {
      en: 'Recognised for outstanding engineering innovation and project execution.',
      fr: "Reconnu pour son innovation technique exceptionnelle et la qualité de la réalisation de ses projets.",
    },
  },
]

export const languages = [
  { name: { en: 'Tamil', fr: 'Tamoul' }, level: { en: 'Native', fr: 'Langue maternelle' }, value: 100 },
  { name: { en: 'English', fr: 'Anglais' }, level: { en: 'Bilingual', fr: 'Courant' }, value: 92 },
  { name: { en: 'French', fr: 'Français' }, level: { en: 'Intermediate', fr: 'Intermédiaire' }, value: 60 },
  { name: { en: 'German', fr: 'Allemand' }, level: { en: 'Basic', fr: 'Débutant' }, value: 25 },
]

export const ui = {
  nav: {
    about: { en: 'About', fr: 'À propos' },
    expertise: { en: 'Expertise', fr: 'Expertise' },
    experience: { en: 'Experience', fr: 'Expérience' },
    projects: { en: 'Projects', fr: 'Projets' },
    contact: { en: 'Contact', fr: 'Contact' },
  },
  hero: {
    greeting: { en: 'Hello', fr: 'Bonjour' },
    tagline: {
      en: "— It's Raghul, an industrial engineer",
      fr: '— Ici Raghul, ingénieur en génie industriel',
    },
    role: { en: 'Industrial Engineer', fr: 'Génie industriel' },
    scroll: { en: 'Scroll down', fr: 'Faire défiler' },
    book: { en: 'Book a call', fr: 'Réserver un appel' },
    statA: { en: 'Engineering internships', fr: 'Stages en ingénierie' },
    statB: { en: 'Professional certifications', fr: 'Certifications professionnelles' },
    statC: { en: 'Flagship projects', fr: 'Projets phares' },
  },
  about: {
    label: { en: 'About me', fr: 'À propos' },
    title: {
      en: 'Designing, industrialising and optimising what gets built.',
      fr: 'Concevoir, industrialiser et optimiser ce qui se fabrique.',
    },
    body: {
      en: 'Industrial engineer with international academic and industrial experience in robotics, automation and electromechanical systems. Strong interpersonal skills, a team-first mindset and a problem-solving approach. Experienced in mechanical design, industrialisation and the optimisation of industrial operations, with a solid command of CAD, Lean Manufacturing and multi-team coordination.',
      fr: "Ingénieur en génie industriel doté d'un excellent relationnel, d'un fort esprit d'équipe et d'une approche orientée résolution de problèmes. Expérience en conception mécanique, industrialisation et optimisation des opérations industrielles, avec une maîtrise de la CAO, du Lean Manufacturing et de la coordination multi-équipes, appuyée par une expérience internationale en robotique et systèmes électromécaniques.",
    },
    educationLabel: { en: 'Education', fr: 'Formation' },
    downloadCv: { en: 'Download CV', fr: 'Télécharger le CV' },
    downloadPortfolio: { en: 'Download portfolio', fr: 'Télécharger le portfolio' },
    portraitName: { en: 'Raghul Elamathi', fr: 'Raghul Elamathi' },
    portraitRole: { en: 'Industrial Engineer · Nantes', fr: 'Génie industriel · Nantes' },
    available: { en: 'Available 2026', fr: 'Disponible 2026' },
  },
  expertise: {
    label: { en: 'Technical expertise', fr: 'Expertise technique' },
    title: { en: 'Toolbox', fr: 'Boîte à outils' },
    software: { en: 'Software', fr: 'Logiciels' },
    domains: { en: 'Methods & domains', fr: 'Méthodes & domaines' },
  },
  experienceSection: {
    label: { en: 'Career', fr: 'Parcours' },
    title: { en: 'Work experience', fr: 'Expérience professionnelle' },
  },
  projectsSection: {
    label: { en: 'Selected work', fr: 'Travaux sélectionnés' },
    title: { en: 'Projects', fr: 'Projets' },
    viewDetail: { en: 'Read more', fr: 'En savoir plus' },
    hideDetail: { en: 'Show less', fr: 'Réduire' },
  },
  showcase: {
    engineLabel: { en: 'Systems in motion', fr: 'Systèmes en mouvement' },
    engineTitle: { en: 'Mechanisms, modelled live', fr: 'Des mécanismes, modélisés en direct' },
    engineBody: {
      en: 'Every model on this page is real 3D geometry running in your browser — an inline-3 crank–slider engine, a deep-groove ball bearing and a 4-axis robotic arm, rendered with Three.js.',
      fr: "Chaque modèle de cette page est une géométrie 3D réelle exécutée dans votre navigateur — un moteur 3 cylindres à système bielle-manivelle, un roulement à billes et un bras robotisé 4 axes, rendus avec Three.js.",
    },
    engineTag: { en: 'ENGINE / INLINE-3 · 4-STROKE', fr: 'MOTEUR / 3 CYLINDRES · 4 TEMPS' },
    bearingTag: { en: 'BEARING / DEEP-GROOVE', fr: 'ROULEMENT / À BILLES' },
    armTag: { en: 'ROBOT / 4-DOF ARM', fr: 'ROBOT / BRAS 4 AXES' },
  },
  credentials: {
    label: { en: 'Credentials', fr: 'Références' },
    certs: { en: 'Certifications', fr: 'Certifications' },
    awards: { en: 'Awards', fr: 'Récompenses' },
    languages: { en: 'Languages', fr: 'Langues' },
  },
  contact: {
    label: { en: 'Contact', fr: 'Contact' },
    title: { en: "Let's build something reliable.", fr: 'Construisons quelque chose de fiable.' },
    body: {
      en: 'Open to industrial engineering, mechanical design and industrialisation roles in France and internationally.',
      fr: "Ouvert aux postes en génie industriel, conception mécanique et industrialisation, en France et à l'international.",
    },
    emailMe: { en: 'Email me', fr: 'M’écrire' },
  },
  footer: {
    rights: { en: 'All rights reserved.', fr: 'Tous droits réservés.' },
    built: { en: 'Designed & built with React and Three.js', fr: 'Conçu et développé avec React et Three.js' },
  },
  toggles: {
    theme: { en: 'Toggle theme', fr: 'Changer de thème' },
    lang: { en: 'Switch language', fr: 'Changer de langue' },
  },
}
