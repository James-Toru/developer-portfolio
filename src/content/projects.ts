export type ProjectKind = "professional" | "personal" | "experiment" | "fork" | "supporting";

export interface Project {
  readonly slug: string;
  readonly title: string;
  readonly category: string;
  readonly kind: ProjectKind;
  readonly summary: string;
  readonly technologies: readonly string[];
  readonly context?: string;
  readonly contribution?: string;
  readonly organization?: string;
  readonly repository?: string;
  readonly demo?: string;
  readonly image?: string;
  readonly featured: boolean;
}

export const projectCategories = [
  "AI & automation", "Web applications", "Websites", "Experiments",
] as const;

export const projects: readonly Project[] = [
  {
    slug: "lawpro360",
    title: "LawPro360",
    category: "Web applications",
    kind: "professional",
    summary: "Legal management system for organizing matters, client communication, documents, court dates and billing.",
    context: "A legal practice management platform that brings matter ownership, deadlines and firm operations into one place.",
    technologies: [],
    organization: "Info Gain Consulting",
    demo: "https://legal.igc.co.ke/",
    featured: true,
  },
  {
    slug: "ecms",
    title: "DOLMIS",
    category: "Web applications",
    kind: "professional",
    summary: "Ministry of Labor case management system supporting case records and workflow automation.",
    contribution: "Designed and developed a case-management system with workflow automation.",
    technologies: [],
    organization: "Info Gain Consulting / Ministry of Labor",
    demo: "https://dolmis.go.ke/",
    featured: true,
  },
  {
    slug: "consignment-management",
    title: "CargoForward360",
    category: "Web applications",
    kind: "professional",
    summary: "Consignment management system with multi-tenant access, real-time notifications and automated invoicing.",
    technologies: ["Next.js", "NestJS", "MongoDB", "Docker"],
    organization: "Info Gain Consulting",
    demo: "https://consignment.igc.co.ke/",
    featured: true,
  },
  {
    slug: "nashami-limited",
    title: "Nashami Limited",
    category: "Websites",
    kind: "professional",
    summary: "Company website, logo design and graphics for Nashami Limited.",
    contribution: "Created the company website, logo and supporting graphics.",
    technologies: ["Web design", "Logo design", "Graphic design"],
    organization: "Nashami Limited",
    demo: "https://nashamiltd.org/",
    featured: true,
  },
  {
    slug: "agentic-workflows",
    title: "Agentic systems and workflows",
    category: "AI & automation",
    kind: "professional",
    summary: "Designed AI platforms and supervised multi-agent workflows with human approval, sandboxed execution, deterministic testing, audit trails and workflow orchestration.",
    technologies: ["OpenAI", "TypeScript", "Next.js", "Temporal", "Supabase", "PostgreSQL", "GitHub Actions"],
    organization: "TYTOS GmbH",
    featured: false,
  },
  {
    slug: "generative-ai-pipelines",
    title: "Generative AI and LoRA pipelines",
    category: "AI & automation",
    kind: "professional",
    summary: "Developed governed image-production and LoRA-training pipelines with dataset curation, human review, provenance and reproducible evaluation.",
    technologies: [],
    organization: "TYTOS GmbH",
    featured: false,
  },
  {
    slug: "igc-portal",
    title: "IGC Portal",
    category: "Web applications",
    kind: "professional",
    summary: "Led development integrating bid, contract and service-request solutions.",
    technologies: [],
    organization: "Info Gain Consulting",
    demo: "https://igc-portal.vercel.app/",
    featured: false,
  },
  {
    slug: "remote-labor-force",
    title: "Remote Labor Force",
    category: "Web applications",
    kind: "professional",
    summary: "Created a WordPress application with custom themes and plugin integration.",
    technologies: ["WordPress"],
    organization: "Info Gain Consulting",
    featured: false,
  },
  {
    slug: "kalamu",
    title: "Kalamu",
    category: "Web applications",
    kind: "professional",
    summary: "Contributed to front-end development of the e-learning platform and integrated RESTful APIs.",
    technologies: ["React"],
    organization: "Angaza Elimu",
    demo: "https://kalamu.net/",
    featured: false,
  },
  {
    slug: "agent-pipeline-foundry",
    title: "Agent Foundry",
    category: "AI & automation",
    kind: "personal",
    summary: "A pipeline factory that turns natural-language workflow descriptions into multi-agent specifications and executes them with tool integrations and human approval gates.",
    technologies: ["TypeScript", "Next.js", "React", "Anthropic Claude", "Supabase", "PostgreSQL"],
    repository: "https://github.com/James-Toru/agent-pipeline-foundry",
    demo: "https://agent-pipeline-foundry.vercel.app",
    featured: false,
  },
  {
    slug: "njoroge-kiriro-advocates",
    title: "Njoroge Kiriro Advocates",
    category: "Websites",
    kind: "personal",
    summary: "A Next.js website for Njoroge Kiriro Advocates, an intellectual-property law practice in Nairobi.",
    technologies: ["TypeScript", "Next.js"],
    repository: "https://github.com/James-Toru/njoroge-kiriro-advocates",
    demo: "https://njoroge-kiriro-advocates.vercel.app",
    featured: false,
  },
  {
    slug: "raxos-website",
    title: "RAXOS",
    category: "Websites",
    kind: "personal",
    summary: "A layered Next.js website with angular interface frames, optimized artwork and responsive motion.",
    contribution: "Built the RAXOS website.",
    technologies: ["TypeScript", "Next.js", "React", "Framer Motion", "Three.js"],
    repository: "https://github.com/James-Toru/raxos-website",
    demo: "https://raxos-website.vercel.app",
    featured: false,
  },
  {
    slug: "testassessment",
    title: "AnyPost / testassessment",
    category: "Experiments",
    kind: "experiment",
    summary: "A React application for listing, viewing, creating, updating and deleting posts through JSONPlaceholder.",
    context: "JSONPlaceholder simulates data changes and does not persist them. Created posts use React Context for the current session.",
    technologies: ["JavaScript", "React", "Next.js", "Tailwind CSS", "JSONPlaceholder"],
    repository: "https://github.com/James-Toru/testassessment",
    demo: "https://testassessment.vercel.app",
    featured: false,
  },
];
