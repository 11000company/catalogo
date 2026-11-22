import type { Project } from "@/data/projects";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type WhatsAppCTAProps = {
  project?: Pick<Project, "title">;
  intent: "similar-project" | "general-budget";
  children: React.ReactNode;
  className?: string;
};

export function WhatsAppCTA({ project, intent, children, className }: WhatsAppCTAProps) {
  return (
    <a
      href={buildWhatsAppUrl(project, intent)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
