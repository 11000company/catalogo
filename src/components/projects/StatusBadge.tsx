import type { ProjectStatus } from "@/data/projects";

type StatusBadgeProps = {
  status: ProjectStatus;
  label: string;
};

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const isPublished = status === "published";
  return (
    <span
      className={
        isPublished
          ? "inline-flex rounded-full bg-(--color-accent) px-3 py-1 text-xs font-semibold text-black"
          : "inline-flex rounded-full border border-(--color-border) px-3 py-1 text-xs text-(--color-text-dim)"
      }
    >
      {label}
    </span>
  );
}
