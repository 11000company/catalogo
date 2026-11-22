"use client";

import { useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { ViewerControls } from "@/components/viewer/ViewerControls";
import { ViewerStage } from "@/components/viewer/ViewerStage";

type DeviceSize = "desktop" | "tablet" | "mobile";

type ProjectViewerProps = {
  project: Project;
  open: boolean;
  onClose: () => void;
};

export function ProjectViewer({ project, open, onClose }: ProjectViewerProps) {
  const [device, setDevice] = useState<DeviceSize>("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    document.body.style.overflow = "hidden";
    const previousHash = window.location.hash;
    window.history.replaceState(null, "", `#${project.slug}`);

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key === "Tab" && overlayRef.current) {
        const focusable = Array.from(
          overlayRef.current.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled]), iframe",
          ),
        ).filter((el) => el.offsetParent !== null);
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
      document.body.style.overflow = "";
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {});
      }
      window.history.replaceState(null, "", previousHash || window.location.pathname);
      previousFocusRef.current?.focus();
    };
  }, [open, project.slug, onClose]);

  if (!open) return null;

  async function handleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await overlayRef.current?.requestFullscreen();
      }
    } catch {
      // Browser declined fullscreen; no further action needed.
    }
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Visualização de ${project.title}`}
      className="fixed inset-0 z-50 flex flex-col bg-black/95 p-5 backdrop-blur-md"
      onClick={(event) => {
        if (event.target === overlayRef.current) onClose();
      }}
    >
      <div className="mb-4">
        <div className="mb-3">
          <span className="text-sm font-semibold">{project.title}</span>
          <small className="block text-xs text-(--color-text-dim)">{project.type}</small>
        </div>
        <ViewerControls
          project={project}
          device={device}
          onDeviceChange={setDevice}
          onReload={() => setReloadKey((k) => k + 1)}
          onFullscreen={handleFullscreen}
          onClose={onClose}
          closeButtonRef={closeButtonRef}
        />
      </div>
      <div className="min-h-0 flex-1 overflow-auto rounded-2xl border border-(--color-border) bg-(--color-surface)">
        <ViewerStage project={project} device={device} reloadKey={reloadKey} />
      </div>
    </div>
  );
}
