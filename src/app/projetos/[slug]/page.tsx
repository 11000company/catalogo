import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { StatusBadge } from "@/components/projects/StatusBadge";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";
import { ProjectDemoButton } from "@/components/viewer/ProjectDemoButton";

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: [project.image ?? "/images/brand/orbit-static.png"],
      url: `/projetos/${project.slug}`,
      type: "website",
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const isLive = Boolean(project.liveUrl);

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <Link href="/" className="mb-8 inline-block text-sm text-(--color-text-dim) hover:text-(--color-text)">
        ← Ver outros projetos
      </Link>

      <div className="relative mb-8 flex aspect-[1.73] items-center justify-center overflow-hidden rounded-2xl border border-(--color-border) bg-black/40">
        {project.image ? (
          <Image src={project.image} alt={project.title} fill className="object-cover" />
        ) : (
          <span className="text-xs tracking-[0.2em] text-(--color-text-dim) uppercase">
            ONZEMIL — Projeto
          </span>
        )}
      </div>

      <div className="mb-4 text-xs tracking-[0.16em] text-(--color-text-dim) uppercase">
        {project.type}
      </div>
      <h1 className="mb-4 text-4xl font-bold tracking-tighter">{project.title}</h1>
      <div className="mb-6">
        <StatusBadge status={project.status} label={project.statusLabel} />
      </div>
      <p className="mb-8 max-w-2xl text-base leading-relaxed text-(--color-text-dim)">
        {project.longDescription}
      </p>

      {project.features.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-[0.1em] uppercase">
            Funcionalidades confirmadas
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-(--color-text-dim)">
            {project.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      )}

      {project.technologies.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-sm font-semibold tracking-[0.1em] uppercase">
            Tecnologias
          </h2>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-(--color-border) px-3 py-1 text-xs text-(--color-text-dim)"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-4">
        {isLive && <ProjectDemoButton project={project} />}
        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-(--color-border) px-5 py-3 text-sm font-semibold transition hover:border-(--color-accent)"
          >
            Abrir site original ↗
          </a>
        )}
        <WhatsAppCTA
          project={project}
          intent="similar-project"
          className="rounded-full bg-(--color-accent) px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
        >
          Quero um projeto parecido ↗
        </WhatsAppCTA>
      </div>
    </article>
  );
}
