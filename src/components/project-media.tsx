import type { ProjectArtwork } from "@/content/project-art";

export function ProjectPicture({ art, decorative = false }: { art: ProjectArtwork; decorative?: boolean }) {
  return <picture>
    <source srcSet={`${art.src}.avif`} type="image/avif" />
    <img src={`${art.src}.webp`} width={art.width} height={art.height} alt={decorative ? "" : art.label} loading="lazy" />
  </picture>;
}

export function ProjectMedia({ art, className = "" }: { art: ProjectArtwork; className?: string }) {
  return <figure className={`project-plate ${className}`}>
    <ProjectPicture art={art} />
    <figcaption>{art.caption}</figcaption>
  </figure>;
}
