import type { Project } from "@/data/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";

type ProjectGridProps = {
  projects: Project[];
};

export function ProjectGrid({ projects }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="col-span-full py-24 text-center text-(--color-text-dim)">
        <strong className="mb-3 block text-xl text-(--color-text)">
          Nenhum projeto encontrado
        </strong>
        Tente buscar por outro nome ou categoria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
