export type ProjectCategory = "site" | "sistema" | "ecommerce";
export type ProjectStatus = "published" | "development";
export type PreviewMode = "iframe" | "gallery" | "unavailable";

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  type: string;
  description: string;
  longDescription: string;
  status: ProjectStatus;
  statusLabel: string;
  technologies: string[];
  features: string[];
  image?: string;
  gallery: string[];
  liveUrl?: string;
  previewMode: PreviewMode;
  featured: boolean;
  order: number;
};

export const projects: Project[] = [
  {
    id: "aurora-hospedagens",
    slug: "aurora-hospedagens",
    title: "Aurora Hospedagens",
    category: "site",
    type: "Hospedagens · Turismo",
    description:
      "Plataforma digital para apresentação de hospedagens premium em João Pessoa-PB.",
    longDescription:
      "Site institucional para a Aurora Hospedagens, com apresentação de unidades e serviços relacionados à experiência do hóspede em João Pessoa-PB.",
    status: "published",
    statusLabel: "Publicado",
    technologies: [],
    features: [],
    gallery: [],
    liveUrl: "https://www.aurorahospedagens.com/",
    previewMode: "iframe",
    featured: true,
    order: 1,
  },
  {
    id: "euclides-fitness",
    slug: "euclides-fitness",
    title: "Euclides Fitness",
    category: "site",
    type: "Assistência técnica · Agendamentos",
    description:
      "Presença digital e fluxos de atendimento para manutenção de equipamentos fitness.",
    longDescription:
      "Site institucional com apresentação de serviços de assistência técnica para equipamentos fitness e fluxo público para solicitar atendimento.",
    status: "published",
    statusLabel: "Publicado",
    technologies: [],
    features: [],
    gallery: [],
    liveUrl: "https://euclidesfitness.com.br/",
    previewMode: "gallery",
    featured: true,
    order: 2,
  },
  {
    id: "havoc",
    slug: "havoc",
    title: "Havoc",
    category: "ecommerce",
    type: "E-commerce · Moda e vestuário",
    description:
      "E-commerce em desenvolvimento, com catálogo e painel administrativo funcionando.",
    longDescription:
      "Projeto de e-commerce em desenvolvimento. A Fase 1 já entrega catálogo de produtos modelado, API de administração e páginas de listagem e produto (PLP/PDP) funcionando — a loja hoje lê de dados fixture, ainda não de uma API em produção.",
    status: "development",
    statusLabel: "Em desenvolvimento",
    technologies: ["Next.js", "NestJS", "PostgreSQL", "Prisma"],
    features: [
      "Catálogo de produtos",
      "Painel administrativo",
      "Página de listagem e produto (PLP/PDP)",
    ],
    gallery: [],
    previewMode: "unavailable",
    featured: false,
    order: 3,
  },
  {
    id: "elysium-concept",
    slug: "elysium-concept",
    title: "Elysium Concept",
    category: "ecommerce",
    type: "E-commerce · Perfumes e joias",
    description: "Projeto de e-commerce para perfumes e joias, em estágio inicial.",
    longDescription:
      "Projeto de e-commerce para perfumes e joias, em desenvolvimento. Ainda não há implementação pública ou demonstração disponível.",
    status: "development",
    statusLabel: "Em desenvolvimento",
    technologies: [],
    features: [],
    gallery: [],
    previewMode: "unavailable",
    featured: false,
    order: 4,
  },
  {
    id: "base311",
    slug: "base311",
    title: "BASE311",
    category: "sistema",
    type: "Sistema · Gestão e organização",
    description: "Plataforma digital em estágio inicial de desenvolvimento.",
    longDescription:
      "Plataforma digital em fase inicial de um desenvolvimento planejado em múltiplas etapas, com trabalho de backend em andamento. Ainda não há interface de usuário nem ambiente público de demonstração.",
    status: "development",
    statusLabel: "Em desenvolvimento",
    technologies: [],
    features: [],
    gallery: [],
    previewMode: "unavailable",
    featured: false,
    order: 5,
  },
  {
    id: "base-phone",
    slug: "base-phone",
    title: "Base Phone",
    category: "ecommerce",
    type: "E-commerce · iPhones",
    description: "Projeto de comercialização de iPhones, em estágio inicial.",
    longDescription:
      "Projeto de e-commerce para comercialização de iPhones, em desenvolvimento inicial. Ainda não há implementação pública ou demonstração disponível.",
    status: "development",
    statusLabel: "Em desenvolvimento",
    technologies: [],
    features: [],
    gallery: [],
    previewMode: "unavailable",
    featured: false,
    order: 6,
  },
];
