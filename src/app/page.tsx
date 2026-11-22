import { projects } from "@/data/projects";
import { ProjectFilters } from "@/components/projects/ProjectFilters";
import { WhatsAppCTA } from "@/components/ui/WhatsAppCTA";

export default function Home() {
  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <>
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-6 flex items-center gap-3 text-xs font-semibold tracking-[0.22em] text-(--color-text-dim) uppercase">
          <span className="h-px w-6 bg-(--color-text-dim)" aria-hidden="true" />
          Portfólio interativo
        </div>
        <h1 className="mb-6 max-w-2xl text-5xl leading-none font-bold tracking-tighter sm:text-6xl">
          Não veja apenas.
          <br />
          <em className="text-(--color-text-dim) not-italic">Experimente.</em>
        </h1>
        <p className="mb-10 max-w-md text-base leading-relaxed text-(--color-text-dim)">
          Conheça nossos projetos e explore experiências digitais desenvolvidas para
          negócios reais.
        </p>
        <div className="flex flex-wrap gap-4">
          <a
            href="#projetos"
            className="rounded-full border border-(--color-border) px-5 py-3 text-sm font-semibold transition hover:border-(--color-accent)"
          >
            Explorar projetos
          </a>
          <WhatsAppCTA
            intent="general-budget"
            className="rounded-full bg-(--color-accent) px-5 py-3 text-sm font-semibold text-black transition hover:brightness-110"
          >
            Solicitar orçamento
          </WhatsAppCTA>
        </div>
      </section>

      <section id="projetos" className="mx-auto max-w-6xl border-t border-(--color-border) px-6 py-16">
        <ProjectFilters projects={sortedProjects} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-(--color-text) px-10 py-11 text-black sm:flex-row sm:items-center">
          <div>
            <h2 className="mb-3 text-3xl leading-tight font-bold tracking-tighter sm:text-4xl">
              Seu próximo projeto começa aqui.
            </h2>
            <p className="text-sm text-black/60">
              Sites e sistemas desenvolvidos para transformar sua operação digital.
            </p>
          </div>
          <WhatsAppCTA
            intent="general-budget"
            className="shrink-0 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
          >
            Solicitar orçamento
          </WhatsAppCTA>
        </div>
      </section>
    </>
  );
}
