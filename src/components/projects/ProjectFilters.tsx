"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { ProjectGrid } from "@/components/projects/ProjectGrid";

type FilterOption = "Todos" | "Sites" | "Sistemas" | "E-commerce";

const CATEGORY_BY_FILTER: Record<FilterOption, ProjectCategory | null> = {
  Todos: null,
  Sites: "site",
  Sistemas: "sistema",
  "E-commerce": "ecommerce",
};

const FILTER_OPTIONS: FilterOption[] = ["Todos", "Sites", "Sistemas", "E-commerce"];

type ProjectFiltersProps = {
  projects: Project[];
};

export function ProjectFilters({ projects }: ProjectFiltersProps) {
  const [filter, setFilter] = useState<FilterOption>("Todos");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const category = CATEGORY_BY_FILTER[filter];
    const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
    return projects.filter((project) => {
      const matchesCategory = category === null || project.category === category;
      const haystack = `${project.title} ${project.type} ${project.description}`.toLocaleLowerCase(
        "pt-BR",
      );
      const matchesQuery = haystack.includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [projects, filter, query]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div role="group" aria-label="Filtrar projetos" className="flex flex-wrap gap-2">
          {FILTER_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => setFilter(option)}
              className={
                filter === option
                  ? "rounded-full bg-(--color-accent) px-4 py-2 text-sm font-semibold text-black"
                  : "rounded-full border border-(--color-border) px-4 py-2 text-sm text-(--color-text-dim) hover:text-(--color-text)"
              }
            >
              {option}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 rounded-full border border-(--color-border) bg-(--color-surface) px-4 py-2">
          <span aria-hidden="true">⌕</span>
          <input
            type="search"
            autoComplete="off"
            placeholder="Buscar projeto..."
            aria-label="Buscar projeto"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-40 bg-transparent text-sm outline-none"
          />
        </label>
      </div>
      <ProjectGrid projects={filtered} />
    </div>
  );
}
