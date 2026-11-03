export interface SkillGroup {
  readonly id: "ai" | "interfaces" | "data" | "delivery" | "design";
  readonly title: string;
  readonly description: string;
  readonly tools: readonly string[];
  readonly evidence?: { readonly label: string; readonly href: string };
}

export const skillGroups: readonly SkillGroup[] = [
  {
    id: "ai",
    title: "Agentic AI",
    description: "Supervised workflows, model integration and human oversight.",
    tools: ["Multi-agent workflows", "LLM integration", "OpenAI", "Generative AI", "LoRA fine-tuning", "AI governance", "Temporal"],
    evidence: { label: "Explore agentic workflows", href: "/work/agentic-workflows/" },
  },
  {
    id: "interfaces",
    title: "Interfaces",
    description: "Responsive applications and web experiences.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "WordPress"],
  },
  {
    id: "data",
    title: "Backend & data",
    description: "Application services and the data behind them.",
    tools: ["Node.js", "Express", "NestJS", "PostgreSQL", "MongoDB", "Supabase"],
  },
  {
    id: "delivery",
    title: "Delivery & integration",
    description: "Connected APIs and repeatable delivery workflows.",
    tools: ["Docker", "Git", "GitHub Actions", "GitLab CI/CD", "REST APIs"],
  },
  {
    id: "design",
    title: "Design",
    description: "Visual tools for interfaces and brand expression.",
    tools: ["Figma", "Adobe Illustrator", "Adobe Photoshop", "Logo & graphic design"],
  },
];
