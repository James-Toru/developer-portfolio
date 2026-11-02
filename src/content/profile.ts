export interface Experience {
  readonly organization: string;
  readonly role: string;
  readonly period: string;
  readonly summary: string;
}

export interface Profile {
  readonly displayName: string;
  readonly role: string;
  readonly email: string;
  readonly summary: string;
  readonly socialLinks: readonly { readonly label: string; readonly href: string }[];
  readonly experience: readonly Experience[];
}

export const profile: Profile = {
  displayName: "James Gatoru",
  role: "Software Developer / AI Agentic Engineer",
  email: "gatorumbugua@gmail.com",
  summary: "I build web applications and AI workflows, bringing together responsive interfaces, backend systems and human oversight.",
  socialLinks: [
    { label: "GitHub", href: "https://github.com/James-Toru" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/james-mbugua-78a63917b/" },
  ],
  experience: [
    {
      organization: "TYTOS GmbH",
      role: "AI Agentic Engineer",
      period: "April 2026–present",
      summary: "AI platforms, supervised multi-agent workflows and governed generative-image pipelines.",
    },
    {
      organization: "Info Gain Consulting",
      role: "Technical Consultant",
      period: "February 2024–April 2026",
      summary: "Consignment management, integrated portal solutions, case-management workflows and WordPress applications.",
    },
    {
      organization: "Angaza Elimu",
      role: "Front-end Developer",
      period: "January 2024–March 2024",
      summary: "Front-end contributions to e-learning platforms, including Kalamu and IoT School.",
    },
    {
      organization: "Elixar Technologies",
      role: "Software Developer",
      period: "January 2023–August 2023",
      summary: "Responsive React interfaces, RESTful API integration and church-management application development.",
    },
    {
      organization: "Freelance",
      role: "Software Developer",
      period: "June 2020–January 2023",
      summary: "Web application development, including Lugawa, Texplore and Aslice.",
    },
  ],
};
