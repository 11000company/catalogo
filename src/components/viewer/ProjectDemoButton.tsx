"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { ProjectViewer } from "@/components/viewer/ProjectViewer";

type ProjectDemoButtonProps = {
  project: Project;
};

export function ProjectDemoButton({ project }: ProjectDemoButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-full border border-(--color-border) px-5 py-3 text-sm font-semibold transition hover:border-(--color-accent)"
      >
        Ver demonstração
      </button>
      <ProjectViewer project={project} open={open} onClose={() => setOpen(false)} />
    </>
  );
}
