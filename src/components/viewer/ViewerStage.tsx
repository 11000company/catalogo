"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import type { Project } from "@/data/projects";

type DeviceSize = "desktop" | "tablet" | "mobile";

type ViewerStageProps = {
  project: Project;
  device: DeviceSize;
  reloadKey: number;
};

const IFRAME_TIMEOUT_MS = 8000;

const DEVICE_WIDTH: Record<DeviceSize, string> = {
  desktop: "100%",
  tablet: "min(820px, 100%)",
  mobile: "min(390px, 100%)",
};

function UnavailableBlock({ project }: { project: Project }) {
  return (
    <div className="flex h-full min-h-[380px] flex-col items-center justify-center p-8 text-center">
      <div className="mb-4 text-[11px] tracking-[0.18em] text-(--color-text-dim) uppercase">
        ONZEMIL / Visualizador
      </div>
      <strong className="mb-4 text-3xl font-semibold tracking-tighter">
        {project.title}
      </strong>
      <p className="mb-6 max-w-md text-sm leading-relaxed text-(--color-text-dim)">
        Não foi possível carregar a prévia deste projeto no catálogo. Você pode
        visitar o site público pelo botão abaixo.
      </p>
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-(--color-accent) px-5 py-3 text-sm font-semibold text-black"
        >
          Abrir site original ↗
        </a>
      )}
    </div>
  );
}

export function ViewerStage({ project, device, reloadKey }: ViewerStageProps) {
  const [iframeFailed, setIframeFailed] = useState(false);

  useEffect(() => {
    setIframeFailed(false);
    if (project.previewMode !== "iframe") return;

    const timer = setTimeout(() => {
      setIframeFailed(true);
    }, IFRAME_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, [project.previewMode, reloadKey]);

  if (project.previewMode === "iframe" && project.liveUrl && !iframeFailed) {
    return (
      <div
        className="mx-auto h-full bg-white"
        style={{ width: DEVICE_WIDTH[device] }}
      >
        <iframe
          key={reloadKey}
          src={project.liveUrl}
          title={`Demonstração do projeto ${project.title}`}
          referrerPolicy="strict-origin-when-cross-origin"
          allow="fullscreen"
          className="h-full w-full border-0"
          onError={() => setIframeFailed(true)}
        />
      </div>
    );
  }

  if (project.previewMode === "gallery" && project.gallery.length > 0) {
    return (
      <div className="mx-auto h-full max-w-3xl overflow-y-auto p-4">
        {project.gallery.map((src) => (
          <div key={src} className="relative mb-4 aspect-video w-full overflow-hidden rounded-lg">
            <Image src={src} alt={project.title} fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return <UnavailableBlock project={project} />;
}
