import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/data/projects";
import { StatusBadge } from "@/components/projects/StatusBadge";

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const isLive = Boolean(project.liveUrl);

  return (
    <article className="overflow-hidden rounded-2xl border border-(--color-border) bg-(--color-surface)">
      <div className="relative flex aspect-[1.73] items-center justify-center overflow-hidden bg-black/40">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.title}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-xs tracking-[0.2em] text-(--color-text-dim) uppercase">
            ONZEMIL — Projeto
          </span>
        )}
      </div>
      <div className="p-6">
        <div className="text-xs tracking-[0.16em] text-(--color-text-dim) uppercase">
          {project.type}
        </div>
        <h2 className="mt-2 mb-3 text-xl font-semibold tracking-tight">
          {project.title}
        </h2>
        <p className="mb-5 line-clamp-2 text-sm text-(--color-text-dim)">
          {project.description}
        </p>
        <div className="flex items-center justify-between gap-3">
          <StatusBadge status={project.status} label={project.statusLabel} />
          <Link
            href={`/projetos/${project.slug}`}
            className="text-sm font-semibold hover:underline"
          >
            {isLive ? "Explorar projeto ↗" : "Ver detalhes"}
          </Link>
        </div>
      </div>
    </article>
  );
}
