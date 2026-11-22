"use client";

import { useState } from "react";
import type { Project } from "@/data/projects";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

type DeviceSize = "desktop" | "tablet" | "mobile";

type ViewerControlsProps = {
  project: Project;
  device: DeviceSize;
  onDeviceChange: (device: DeviceSize) => void;
  onReload: () => void;
  onFullscreen: () => void;
  onClose: () => void;
  closeButtonRef: React.RefObject<HTMLButtonElement | null>;
};

const DEVICE_LABELS: { value: DeviceSize; label: string }[] = [
  { value: "desktop", label: "Desktop" },
  { value: "tablet", label: "Tablet" },
  { value: "mobile", label: "Celular" },
];

export function ViewerControls({
  project,
  device,
  onDeviceChange,
  onReload,
  onFullscreen,
  onClose,
  closeButtonRef,
}: ViewerControlsProps) {
  const [copyLabel, setCopyLabel] = useState("Copiar link");

  async function handleCopyLink() {
    const url = `${window.location.origin}${window.location.pathname}#${project.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyLabel("Link copiado ✓");
      setTimeout(() => setCopyLabel("Copiar link"), 1800);
    } catch {
      prompt("Copie o link:", url);
    }
  }

  return (
    <>
      <div
        role="group"
        aria-label="Ferramentas do visualizador"
        className="flex flex-wrap items-center gap-2"
      >
        {DEVICE_LABELS.map((d) => (
          <button
            key={d.value}
            type="button"
            data-device={d.value}
            aria-pressed={device === d.value}
            onClick={() => onDeviceChange(d.value)}
            className="rounded-md border border-(--color-border) px-3 py-2 text-xs"
          >
            {d.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onReload}
          title="Recarregar demonstração"
          className="rounded-md border border-(--color-border) px-3 py-2 text-xs"
        >
          ↻
        </button>
        <button
          type="button"
          onClick={onFullscreen}
          title="Expandir visualizador"
          className="rounded-md border border-(--color-border) px-3 py-2 text-xs"
        >
          ⛶
        </button>
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Fechar visualizador"
          className="rounded-md bg-(--color-accent) px-3 py-2 text-xs font-semibold text-black"
        >
          ✕ Fechar
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleCopyLink}
          className="rounded-full border border-(--color-border) px-4 py-2 text-xs"
        >
          {copyLabel}
        </button>
        <div className="flex gap-2">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-(--color-border) px-4 py-2 text-xs"
            >
              Abrir site original ↗
            </a>
          )}
          <WhatsAppCTA
            project={project}
            intent="similar-project"
            className="rounded-full bg-(--color-accent) px-4 py-2 text-xs font-semibold text-black"
          >
            Quero um projeto parecido ↗
          </WhatsAppCTA>
        </div>
      </div>
    </>
  );
}
