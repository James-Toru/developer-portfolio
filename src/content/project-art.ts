/** Public captures and editorial covers stay explicitly distinguished. */
export type ProjectArtwork = {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly label: string;
  readonly kind: "screenshot" | "illustration";
  readonly caption: string;
};

export const projectArt: Readonly<Record<string, ProjectArtwork>> = {
  "lawpro360": { src: "/projects/lawpro360", width: 1080, height: 608, label: "LawPro360 public website preview", kind: "screenshot", caption: "Public website preview" },
  "ecms": { src: "/art/portal", width: 1080, height: 360, label: "Illustration of connected case documents", kind: "illustration", caption: "Illustrative cover" },
  "consignment-management": { src: "/projects/cargoforward360", width: 1080, height: 608, label: "CargoForward360 public landing page preview", kind: "screenshot", caption: "Public landing page preview" },
  "nashami-limited": { src: "/projects/nashami-limited", width: 1080, height: 608, label: "Nashami Limited company website preview", kind: "screenshot", caption: "Public website preview" },
  "agentic-workflows": { src: "/art/workflow", width: 1080, height: 360, label: "Illustration of a supervised workflow", kind: "illustration", caption: "Illustrative visual" },
  "igc-portal": { src: "/art/portal", width: 1080, height: 360, label: "Illustration of connected document workflows", kind: "illustration", caption: "Illustrative visual" },
  "agent-pipeline-foundry": { src: "/projects/agent-pipeline-foundry", width: 1080, height: 608, label: "Agent Foundry public sign-in page preview", kind: "screenshot", caption: "Public sign-in page preview" },
  "njoroge-kiriro-advocates": { src: "/projects/njoroge-kiriro-advocates", width: 1080, height: 608, label: "Njoroge Kiriro Advocates website preview", kind: "screenshot", caption: "Public website preview" },
  "raxos-website": { src: "/projects/raxos-website", width: 1080, height: 608, label: "RAXOS website preview", kind: "screenshot", caption: "Public website preview" },
  "testassessment": { src: "/projects/testassessment", width: 1080, height: 608, label: "AnyPost website preview", kind: "screenshot", caption: "Public website preview" },
};
