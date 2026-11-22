import type { Project } from "@/data/projects";

const WHATSAPP_NUMBER = "5583986497309";

type WhatsAppIntent = "similar-project" | "general-budget";

export function buildWhatsAppUrl(
  project: Pick<Project, "title"> | undefined,
  intent: WhatsAppIntent,
): string {
  const message =
    intent === "similar-project" && project
      ? `Olá, conheci o projeto ${project.title} no catálogo da ONZEMIL e gostaria de desenvolver uma solução semelhante para minha empresa.`
      : "Olá, vi o portfólio da ONZEMIL e quero um orçamento.";

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
