# Catálogo ONZEMIL — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the static `catalogo-onzemil-prototipo.html` prototype with a real
Next.js catalog app showing ONZEMIL's verified projects (2 full case studies, 4 honest
"em desenvolvimento" teasers), with filters/search, a safe interactive viewer, per-project
shareable pages with Open Graph, and WhatsApp commercial CTAs — then open a PR for review.

**Architecture:** Next.js 15 App Router with static export (`output: 'export'`).
All project content lives in one typed data module (`src/data/projects.ts`); every
page, card, and the viewer read from it — no project-specific branching in components.
Per-project routes use `generateStaticParams` from that same data so the static export
enumerates them automatically.

**Tech Stack:** Next.js 15 (App Router, static export), React 19, TypeScript (strict),
Tailwind CSS 4, Lucide icons, Playwright (smoke tests only — not component tests),
ESLint, GitHub Actions CI.

**Spec:** `docs/superpowers/specs/2026-11-22-catalogo-onzemil-design.md`

## Global Constraints

- Accent color is exactly `#1e93f5` (sampled from the real org logo) — no other
  color is the "single accent"; everything else is graphite/black/gray/white.
- Data for all 6 projects lives only in `src/data/projects.ts` — no hardcoded
  project text in components or pages.
- Euclides Fitness gets **no iframe attempt** — external link only, per spec decision
  (the site blocks automated connections; the spec requires this, not an auto-fallback).
- Aurora Hospedagens may attempt an iframe; if it fails to load, fall back to the
  same gallery/external-link treatment Euclides uses (spec: "mesmo fallback honesto").
- The 4 Nível 2 projects (Havoc, Elysium Concept, BASE311, Base Phone) must never show
  a screenshot, iframe, or "Explorar projeto" viewer action — teaser card only, status
  badge "Em desenvolvimento", text-only detail page.
- UrbanVision and Vulmont are not in `projects.ts` at all — confirmed absent from the org.
- WhatsApp base number is `5583986497309`, used via `https://wa.me/5583986497309?text=...`
  with URL-encoded, project-aware message text (see Task 6).
- No merge to `main`, no force-push, no branch deletion, no public deploy without
  explicit user authorization (spec + user's Etapa 8 instructions).
- `sourceRepository` is never shown for a project marked private/unauthorized — none
  of the 6 projects in scope have an authorized-public repo link, so no project data
  entry sets `sourceRepository`.

## Review Focus

- **Project with no `liveUrl`** (all 4 Nível 2 projects): card and detail page must
  render correctly with no "visit site"/"preview" affordance at all, not a dead link
  or disabled-looking button that implies one is coming.
- **Project with `previewMode: 'unavailable'` opened in the viewer** (e.g. if a user
  reaches a Nível 2 project's viewer route directly by URL): viewer must show the
  honest fallback state, never an empty/blank stage or infinite spinner.
- **iframe that never fires `onload`** (Aurora, if the embedding host silently hangs
  rather than rejecting): viewer must not spin forever — a timeout must flip to the
  fallback state.
- **Direct navigation to a project detail URL that doesn't exist** (e.g.
  `/projetos/does-not-exist`) — static export must serve a real 404, not a client
  crash.
- **Filter + search combined with zero results**: empty-state message must render
  (prototype already does this correctly — must not regress when ported).

---

## File Structure

```
catalogo-main/
├── src/
│   ├── app/
│   │   ├── layout.tsx                  # root layout: fonts, theme, metadata defaults
│   │   ├── page.tsx                    # home: hero + catalog grid + commercial banner
│   │   ├── globals.css                 # Tailwind entry + CSS custom properties (palette)
│   │   ├── not-found.tsx                # 404 page
│   │   └── projetos/
│   │       └── [slug]/
│   │           ├── page.tsx            # project detail page (generateStaticParams + generateMetadata)
│   │           └── opengraph-image.tsx # per-project OG image (or static fallback, see Task 5)
│   ├── components/
│   │   ├── layout/
│   │   │   ├── SiteHeader.tsx
│   │   │   └── SiteFooter.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectGrid.tsx
│   │   │   ├── ProjectFilters.tsx      # filter buttons + search input (client component)
│   │   │   └── StatusBadge.tsx
│   │   ├── viewer/
│   │   │   ├── ProjectViewer.tsx       # overlay shell, focus trap, keyboard handling
│   │   │   ├── ViewerControls.tsx      # device switch, fullscreen, reload, copy link
│   │   │   └── ViewerStage.tsx         # iframe / gallery / unavailable rendering
│   │   └── ui/
│   │       ├── WhatsAppCTA.tsx         # builds wa.me link from project + message template
│   │       └── BrandMark.tsx           # animated logo, respects prefers-reduced-motion
│   ├── data/
│   │   └── projects.ts                 # Project type + the 6 real project entries
│   └── lib/
│       └── whatsapp.ts                 # buildWhatsAppUrl(project, intent) helper
├── public/
│   └── images/
│       ├── brand/                      # banner.gif, orbit.gif (already fetched)
│       └── projects/                   # aurora-hospedagens/*, euclides-fitness/*
├── tests/
│   └── e2e/
│       ├── catalog.spec.ts             # filters, search, empty state
│       ├── viewer.spec.ts              # open/close, device switch, escape, fallback
│       └── project-pages.spec.ts       # detail page nav, WhatsApp CTA hrefs, 404
├── .github/workflows/ci.yml
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── README.md                            # updated: install/dev/build/export instructions
└── docs/
    ├── superpowers/specs/2026-11-22-catalogo-onzemil-design.md   (existing)
    ├── superpowers/plans/2026-11-22-catalogo-onzemil-implementation.md (this file)
    ├── INVENTARIO_PROJETOS.md           # the verified inventory, human-readable
    └── VALIDACAO_CATALOGO.md            # test/validation results, filled in at the end
```

---

### Task 1: Project scaffold, TypeScript, Tailwind, lint

**Objetivo e escopo:** Stand up a working Next.js 15 App Router project with static
export, strict TypeScript, Tailwind 4, and ESLint, committed as the foundation every
later task builds on. No project content yet — just an app that builds and exports.

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `tailwind.config.ts`,
  `postcss.config.mjs`, `.eslintrc.json` (or `eslint.config.mjs`), `.gitignore`
- Create: `src/app/layout.tsx`, `src/app/page.tsx` (placeholder), `src/app/globals.css`
- Test: none yet (no logic to test) — verification is build success

**Dependências:** None — first task.

**Procedimento de implementação:**
- [ ] **Step 1: Initialize git repo**

```bash
git init
git checkout -b feat/catalogo-final
```

- [ ] **Step 2: Scaffold Next.js app**

Run `npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-import-alias` (answer prompts to not overwrite `README.md`/the prototype HTML — keep both at repo root for now, remove the prototype HTML in Task 2 once its content is ported).

- [ ] **Step 3: Configure static export in `next.config.ts`**

```ts
const nextConfig: NextConfig = {
  output: 'export',
  images: { unoptimized: true }, // static export can't use the Image Optimization API
};
```

- [ ] **Step 4: Set `tsconfig.json` to strict mode**

Ensure `"strict": true` (create-next-app sets this by default — verify, don't duplicate).

- [ ] **Step 5: Set CSS custom properties for the palette in `globals.css`**

```css
:root {
  --color-bg: #0b0c0e;
  --color-surface: #16171a;
  --color-border: #2a2b2f;
  --color-text: #f2f2ef;
  --color-text-dim: #a9a9ac;
  --color-accent: #1e93f5;
}
```

- [ ] **Step 6: Verify build and export**

Run: `npm run build`
Expected: build succeeds, `out/` directory created with static HTML.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with static export"
```

**Testes necessários:** `npm run build` succeeds; `npm run lint` passes with no errors.

**Critérios de aceite:** App builds, exports static HTML, lints clean, strict TS on.

**Evidências de conclusão:** Terminal output of successful `npm run build` and
`npm run lint`.

---

### Task 2: Project data model and the 6 real entries

**Objetivo e escopo:** Define the `Project` type and populate it with the verified
inventory from the spec — the single source of truth every component reads from.

**Files:**
- Create: `src/data/projects.ts`
- Modify: delete `catalogo-onzemil-prototipo.html` (its content has been fully ported
  into the design spec and this data file; keep it out of the new app's build)
- Test: `tests/unit/projects.spec.ts` (or co-located `src/data/projects.test.ts` if the
  test runner is configured for that — pick one convention and use it for all unit tests)

**Interfaces:**
- Produces: `Project` type and `projects: Project[]` array, imported by every later
  component/page task.

```ts
export type ProjectCategory = 'site' | 'sistema' | 'ecommerce';
export type ProjectStatus = 'published' | 'development';
export type PreviewMode = 'iframe' | 'gallery' | 'unavailable';

export type Project = {
  id: string;
  slug: string;
  title: string;
  category: ProjectCategory;
  type: string;            // short subtitle, e.g. "Hospedagens · Reservas"
  description: string;     // max ~2 lines, card copy
  longDescription: string; // detail-page copy
  status: ProjectStatus;
  statusLabel: string;     // exact user-facing string, e.g. "Em desenvolvimento"
  technologies: string[];
  features: string[];
  image?: string;          // card cover path, undefined if none exists
  gallery: string[];       // detail-page gallery, empty array if none
  liveUrl?: string;
  previewMode: PreviewMode;
  featured: boolean;
  order: number;
};
```

- [ ] **Step 1: Write `src/data/projects.ts` with the `Project` type above and the 6 entries**

Data per project, copied from the spec's verified inventory (no invented facts):

1. **Aurora Hospedagens** — `slug: 'aurora-hospedagens'`, `category: 'site'`,
   `status: 'published'`, `liveUrl: 'https://www.aurorahospedagens.com/'`,
   `previewMode: 'iframe'`, `featured: true`, `order: 1`. `type`: "Hospedagens ·
   Turismo". `technologies`: leave as `[]` if not confirmed (do not invent a stack —
   none was verified in the audit); if Task 9's manual content pass confirms specifics,
   fill them in then.
2. **Euclides Fitness** — `slug: 'euclides-fitness'`, `category: 'site'`,
   `status: 'published'`, `liveUrl: 'https://euclidesfitness.com.br/'`,
   `previewMode: 'gallery'` (never `'iframe'` — spec-mandated), `featured: true`,
   `order: 2`. `type`: "Assistência técnica · Agendamentos".
3. **Havoc** — `slug: 'havoc'`, `category: 'ecommerce'`, `status: 'development'`,
   `statusLabel: 'Em desenvolvimento'`, no `liveUrl`, `previewMode: 'unavailable'`,
   `featured: false`, `order: 3`. `technologies: ['Next.js', 'NestJS', 'PostgreSQL',
   'Prisma']` (confirmed in its README). `features`: list only what's confirmed done —
   "Catálogo de produtos", "Painel administrativo", "Página de listagem e produto
   (PLP/PDP)" — note in `longDescription` that the storefront reads from fixture data,
   not a live API yet.
4. **Elysium Concept** — `slug: 'elysium-concept'`, `category: 'ecommerce'`,
   `status: 'development'`, no `liveUrl`, `previewMode: 'unavailable'`, `featured:
   false`, `order: 4`. `technologies: []`, `features: []` — repo has no implementation
   yet; `longDescription` says so plainly, does not pad with invented scope.
5. **BASE311** — `slug: 'base311'`, `category: 'sistema'`, `status: 'development'`,
   no `liveUrl`, `previewMode: 'unavailable'`, `featured: false`, `order: 5`.
   `longDescription` states it's an early-stage multi-phase platform in active
   backend development, no UI yet — do not call it "gestão financeira pronta".
6. **Base Phone** — `slug: 'base-phone'`, `category: 'ecommerce'`, `status:
   'development'`, no `liveUrl`, `previewMode: 'unavailable'`, `featured: false`,
   `order: 6`. `technologies: []`, `features: []` — minimal scaffold only.

- [ ] **Step 2: Write unit test asserting every slug is unique and every Nível 2 project has `previewMode: 'unavailable'` and no `liveUrl`**

```ts
import { projects } from '@/data/projects';

test('slugs are unique', () => {
  const slugs = projects.map(p => p.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
});

test('development-status projects have no liveUrl and unavailable preview', () => {
  for (const p of projects.filter(p => p.status === 'development')) {
    expect(p.liveUrl).toBeUndefined();
    expect(p.previewMode).toBe('unavailable');
  }
});

test('euclides-fitness never uses iframe preview', () => {
  const euclides = projects.find(p => p.slug === 'euclides-fitness');
  expect(euclides?.previewMode).not.toBe('iframe');
});
```

- [ ] **Step 3: Run test to verify it passes**

Run: `npm test -- projects`
Expected: PASS (3/3)

- [ ] **Step 4: Delete the prototype HTML file**

```bash
git rm catalogo-onzemil-prototipo.html
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add verified project data model and remove prototype HTML"
```

**Dependências:** Task 1 (project scaffold must exist to run `npm test`).

**Testes necessários:** The 3 unit tests above.

**Critérios de aceite:** `projects.ts` compiles under strict TS, contains exactly 6
entries (no UrbanVision/Vulmont), tests pass.

**Evidências de conclusão:** Test run output.

---

### Task 3: WhatsApp CTA helper

**Objetivo e escopo:** One tested function that builds the project-aware WhatsApp
URL, used by every CTA across cards, detail pages, and the viewer — so the message
text pattern exists in exactly one place.

**Files:**
- Create: `src/lib/whatsapp.ts`
- Test: `tests/unit/whatsapp.spec.ts`

**Interfaces:**
- Consumes: `Project` type from Task 2 (`src/data/projects.ts`).
- Produces: `buildWhatsAppUrl(project: Pick<Project, 'title'>, intent: 'similar-project' | 'general-budget'): string`,
  used by `WhatsAppCTA` component (Task 6) and the viewer (Task 7).

- [ ] **Step 1: Write failing tests for both intents**

```ts
import { buildWhatsAppUrl } from '@/lib/whatsapp';

test('similar-project intent includes the project title', () => {
  const url = buildWhatsAppUrl({ title: 'Aurora Hospedagens' }, 'similar-project');
  expect(url).toBe(
    'https://wa.me/5583986497309?text=' +
    encodeURIComponent('Olá, conheci o projeto Aurora Hospedagens no catálogo da ONZEMIL e gostaria de desenvolver uma solução semelhante para minha empresa.')
  );
});

test('general-budget intent has no project name', () => {
  const url = buildWhatsAppUrl(undefined, 'general-budget');
  expect(url).toBe(
    'https://wa.me/5583986497309?text=' +
    encodeURIComponent('Olá, vi o portfólio da ONZEMIL e quero um orçamento.')
  );
});
```

- [ ] **Step 2: Run to verify failure**

Run: `npm test -- whatsapp`
Expected: FAIL ("buildWhatsAppUrl is not defined")

- [ ] **Step 3: Implement `buildWhatsAppUrl` in `src/lib/whatsapp.ts`**

Base number is the literal string `5583986497309`. Message templates are the exact
strings in the test above — copy verbatim, do not paraphrase (the spec and Etapa 6
both pin the "projeto semelhante" wording).

- [ ] **Step 4: Run to verify pass**

Run: `npm test -- whatsapp`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add WhatsApp CTA URL builder"
```

**Dependências:** Task 2 (imports `Project` type, though the test only needs the
`title` field).

**Testes necessários:** The 2 tests above.

**Critérios de aceite:** Every WhatsApp link in the app is produced by this function
— no inline `wa.me` string concatenation anywhere else in the codebase (grep check
in Task 10).

**Evidências de conclusão:** Test run output.

---

### Task 4: Layout, header, footer, brand mark

**Objetivo e escopo:** Root layout with the real ONZEMIL brand (logo, header nav,
footer), dark-premium palette applied globally, animated brand mark respecting
`prefers-reduced-motion`.

**Files:**
- Create: `src/components/layout/SiteHeader.tsx`, `src/components/layout/SiteFooter.tsx`
- Create: `src/components/ui/BrandMark.tsx`
- Modify: `src/app/layout.tsx` (wire header/footer, set default metadata)
- Copy: the two brand GIFs from the scratchpad download into `public/images/brand/`
  (`banner.gif`, `orbit.gif`)
- Test: `tests/e2e/layout.spec.ts` (Playwright smoke test)

**Interfaces:**
- Consumes: nothing from earlier tasks (no project data needed here).
- Produces: `<SiteHeader />`, `<SiteFooter />` used by `src/app/layout.tsx`, which
  every later page task assumes is already wrapping `{children}`.

**Procedimento de implementação:**
- [ ] **Step 1: Copy brand assets into `public/images/brand/`**

Copy `banner.gif` and `orbit.gif` from the scratchpad (already downloaded during the
audit) into `public/images/brand/`.

- [ ] **Step 2: Build `BrandMark` component**

Renders the `orbit.gif` (or a static `<img>` of it) at small size in the header, with
a CSS class that's a no-op when `prefers-reduced-motion: reduce` is set (the GIF
itself can't be paused via CSS, so gate it: render a static frame — take one, e.g.
via `ffmpeg -i orbit.gif -vframes 1 orbit-static.png`, or omit the GIF and render the
banner's static region — under reduced motion, falling back to text-only "11000
Company" wordmark is also acceptable and simpler; pick whichever keeps the component
under ~30 lines).

- [ ] **Step 3: Build `SiteHeader`**

Sticky-top-less header matching the prototype's structure: brand mark + wordmark on
the left, "Iniciar um projeto" CTA button on the right using
`buildWhatsAppUrl(undefined, 'general-budget')` from Task 3.

- [ ] **Step 4: Build `SiteFooter`**

Copyright line with current year (`new Date().getFullYear()`), Instagram link to
`https://instagram.com/onzemil.company`, WhatsApp link.

- [ ] **Step 5: Wire into `src/app/layout.tsx`**

Set `export const metadata: Metadata` with site-wide title/description defaults
(each project page overrides these in Task 5).

- [ ] **Step 6: Write Playwright smoke test**

```ts
test('header and footer render with working links', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /iniciar um projeto/i })).toHaveAttribute('href', /wa\.me/);
  await expect(page.getByRole('link', { name: /instagram/i })).toHaveAttribute('href', 'https://instagram.com/onzemil.company');
});
```

- [ ] **Step 7: Run test, verify pass**

Run: `npx playwright test layout`
Expected: PASS

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: add site header, footer, and animated brand mark"
```

**Dependências:** Task 1 (scaffold), Task 3 (`buildWhatsAppUrl`).

**Testes necessários:** The Playwright test above.

**Critérios de aceite:** Header/footer render on every route, brand mark respects
reduced motion, no console errors.

**Evidências de conclusão:** Playwright test output; one screenshot of the header
(`npx playwright test layout --update-snapshots` not required — a manual
`browser_take_screenshot` during Task 10's visual pass is sufficient evidence).

---

### Task 5: Home page — hero, catalog grid, filters, search, commercial banner

**Objetivo e escopo:** The main `/` route: hero with the approved copy, project
grid driven by `projects.ts`, working category filters + instant search, empty state,
and the closing commercial banner.

**Files:**
- Create: `src/components/projects/ProjectCard.tsx`, `ProjectGrid.tsx`,
  `ProjectFilters.tsx`, `StatusBadge.tsx`
- Create: `src/components/ui/WhatsAppCTA.tsx`
- Modify: `src/app/page.tsx` (replace placeholder with real home page)
- Test: `tests/e2e/catalog.spec.ts`

**Interfaces:**
- Consumes: `projects` array and `Project` type (Task 2), `buildWhatsAppUrl` (Task 3),
  `SiteHeader`/`SiteFooter` already wired in layout (Task 4).
- Produces: `<ProjectCard project={Project} />`, reused by nothing else (detail pages
  build their own hero in Task 6) — but `StatusBadge` and `WhatsAppCTA` are reused by
  Task 6's detail page.

**Procedimento de implementação:**
- [ ] **Step 1: Build `StatusBadge`**

`<StatusBadge status={project.status} label={project.statusLabel} />` — visually
distinct treatment for `'published'` vs `'development'` (e.g. solid accent pill vs.
outlined neutral pill), using only the approved palette.

- [ ] **Step 2: Build `WhatsAppCTA`**

```tsx
type WhatsAppCTAProps = {
  project?: Pick<Project, 'title'>;
  intent: 'similar-project' | 'general-budget';
  children: React.ReactNode;
  className?: string;
};
```

Wraps `buildWhatsAppUrl` in an `<a target="_blank" rel="noopener noreferrer">`.

- [ ] **Step 3: Build `ProjectCard`**

Cover image (if `project.image` set) or a brand-pattern placeholder block for
Nível 2 projects (never a fake screenshot). Title, `type`, `description` (max 2
lines via CSS line-clamp), `StatusBadge`, and:
- If `project.liveUrl` exists: "Explorar projeto" button that links to
  `/projetos/${project.slug}` (the detail page — NOT a direct external link; the
  detail page is where the viewer lives, per Task 6/7).
- If no `liveUrl` (Nível 2): no "Explorar projeto" button — link to the detail page
  with different label, e.g. "Ver detalhes", or a disabled-looking non-interactive
  state is also acceptable as long as it never implies a live preview exists.

- [ ] **Step 4: Build `ProjectFilters`** (client component: `'use client'`)

Filter buttons: Todos | Sites | Sistemas | E-commerce (mapping to
`ProjectCategory` values), `aria-pressed` state, plus a search `<input>` filtering
on title + type + description (case-insensitive, `toLocaleLowerCase('pt-BR')` per
prototype's existing correct behavior). Lift filter/search state with `useState` in
this component; pass filtered list up via a render-prop or keep state in a parent
client wrapper — do not use a global state library for this.

- [ ] **Step 5: Build `ProjectGrid`**

Renders filtered `ProjectCard`s in a responsive grid; renders the empty-state message
("Nenhum projeto encontrado...") when the filtered array is empty.

- [ ] **Step 6: Build `src/app/page.tsx`**

Hero section with exact approved copy:
- H1: "Não veja apenas." / "Experimente." (line break preserved from prototype)
- Subtitle: "Conheça nossos projetos e explore experiências digitais desenvolvidas
  para negócios reais."
- Two CTAs: "Explorar projetos" (anchor-scrolls to the grid) and "Solicitar
  orçamento" (`WhatsAppCTA` with `intent="general-budget"`)

Then `<ProjectFilters>` + `<ProjectGrid>` fed from `projects` sorted by `order`.

Closing commercial banner: "Seu próximo projeto começa aqui." / "Sites e sistemas
desenvolvidos para transformar sua operação digital." + "Solicitar orçamento" CTA.

- [ ] **Step 7: Write Playwright test for filters, search, empty state**

```ts
test('filtering to a category with no development projects shows only matching cards', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'E-commerce' }).click();
  await expect(page.getByText('Havoc')).toBeVisible();
  await expect(page.getByText('Aurora Hospedagens')).not.toBeVisible();
});

test('search with no matches shows empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByPlaceholder(/buscar projeto/i).fill('xyznomatch');
  await expect(page.getByText(/nenhum projeto encontrado/i)).toBeVisible();
});
```

- [ ] **Step 8: Run tests, verify pass**

Run: `npx playwright test catalog`
Expected: PASS

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: build home page with catalog grid, filters, and search"
```

**Dependências:** Task 2, Task 3, Task 4.

**Testes necessários:** The 2 Playwright tests above, plus the Review Focus case
("empty-state message must render" is directly covered by Step 7's second test).

**Critérios de aceite:** Filters and search work independently and combined; grid
never shows a "preview" affordance for Nível 2 projects; hero copy matches exactly.

**Evidências de conclusão:** Playwright output; one full-page screenshot of the home
page at desktop width.

---

### Task 6: Project detail pages with Open Graph metadata

**Objetivo e escopo:** `/projetos/[slug]` static routes, one per project, each with
correct per-project `<title>`/OG tags for WhatsApp link-unfurling, a real 404 for
unknown slugs, and the "quero um projeto parecido" CTA.

**Files:**
- Create: `src/app/projetos/[slug]/page.tsx`
- Create: `src/app/not-found.tsx`
- Test: `tests/e2e/project-pages.spec.ts`

**Interfaces:**
- Consumes: `projects` (Task 2), `StatusBadge`/`WhatsAppCTA` (Task 5),
  `buildWhatsAppUrl` (Task 3).
- Produces: nothing consumed by later tasks except Task 7, which mounts
  `ProjectViewer` from inside this page for Nível 1 projects only.

**Procedimento de implementação:**
- [ ] **Step 1: Implement `generateStaticParams`**

```ts
export function generateStaticParams() {
  return projects.map(p => ({ slug: p.slug }));
}
```

- [ ] **Step 2: Implement `generateMetadata` for per-project OG tags**

```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find(p => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ONZEMIL Company`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      images: project.image ? [project.image] : undefined,
    },
  };
}
```

- [ ] **Step 3: Implement the page body**

Call `notFound()` (from `next/navigation`) if no project matches the slug. Render:
hero image (or brand-pattern block for Nível 2), title, category, `StatusBadge`,
`longDescription`, `features` list (if non-empty), `technologies` list (if
non-empty), gallery (if non-empty — Task 9 may populate this for Aurora), and for
Nível 1 projects only: a "Ver demonstração" button that opens `ProjectViewer`
(Task 7) plus an "Abrir site original" external link. `WhatsAppCTA` with
`intent="similar-project"` and `project={project}`. A "ver outros projetos" link
back to `/`.

- [ ] **Step 4: Build `src/app/not-found.tsx`**

Simple branded 404 with a link back to `/`.

- [ ] **Step 5: Write Playwright tests**

```ts
test('each project detail page loads with correct title', async ({ page }) => {
  await page.goto('/projetos/aurora-hospedagens');
  await expect(page).toHaveTitle(/Aurora Hospedagens/);
});

test('development-status project page has no live-preview button', async ({ page }) => {
  await page.goto('/projetos/havoc');
  await expect(page.getByRole('button', { name: /ver demonstração/i })).toHaveCount(0);
});

test('unknown slug renders 404', async ({ page }) => {
  const response = await page.goto('/projetos/does-not-exist');
  expect(response?.status()).toBe(404);
});

test('similar-project CTA includes project title', async ({ page }) => {
  await page.goto('/projetos/aurora-hospedagens');
  const link = page.getByRole('link', { name: /quero um projeto parecido/i });
  await expect(link).toHaveAttribute('href', /Aurora%20Hospedagens/);
});
```

- [ ] **Step 6: Run tests, verify pass**

Run: `npx playwright test project-pages`
Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add project detail pages with Open Graph metadata and 404 handling"
```

**Dependências:** Task 2, Task 3, Task 5.

**Testes necessários:** The 4 tests above — directly covers the Review Focus item
"direct navigation to a project detail URL that doesn't exist."

**Critérios de aceite:** All 6 slugs resolve; unknown slug 404s; OG tags present and
project-specific; Nível 2 pages never show a viewer-opening control.

**Evidências de conclusão:** Playwright output.

---

### Task 7: Interactive viewer (desktop/tablet/mobile, iframe + gallery + unavailable, keyboard/focus, share link)

**Objetivo e escopo:** The overlay viewer opened from Nível 1 project detail pages —
device-size switching, iframe with a timeout-based fallback, gallery mode for
Euclides, full-screen, reload, copy-link, external-link, Escape-to-close, focus trap.

**Files:**
- Create: `src/components/viewer/ProjectViewer.tsx`, `ViewerControls.tsx`,
  `ViewerStage.tsx`
- Modify: `src/app/projetos/[slug]/page.tsx` (mount `ProjectViewer`, Task 6's page)
- Test: `tests/e2e/viewer.spec.ts`

**Interfaces:**
- Consumes: `Project` (Task 2), rendered inside Task 6's detail page.
- Produces: `<ProjectViewer project={Project} open={boolean} onClose={() => void} />`
  — self-contained, no other task consumes its internals.

**Procedimento de implementação:**
- [ ] **Step 1: Build `ViewerStage`**

```tsx
type ViewerStageProps = { project: Project; device: 'desktop' | 'tablet' | 'mobile'; reloadKey: number };
```

- `previewMode === 'iframe'`: render `<iframe src={project.liveUrl} />` with
  `referrerPolicy="strict-origin-when-cross-origin"`. Start a `setTimeout` (e.g. 8s)
  on mount/reload; if `onLoad` hasn't fired by then, OR the iframe's `onError`
  fires, switch local state to a fallback view (do not rely on `onload` alone — per
  spec, `onload` firing is not proof of success, but its absence after the timeout
  combined with no interaction is the best available signal without reading
  cross-origin frame content, which is blocked by the browser regardless).
- `previewMode === 'gallery'`: render `project.gallery` images in a simple lightbox-
  free stacked/scrollable layout (Euclides — may be an empty array until Task 9 adds
  real images; render the `'unavailable'` state when `gallery.length === 0`).
- `previewMode === 'unavailable'`: render the honest fallback block — this is the
  **only** state Nível 2 projects ever reach (they never mount `ProjectViewer` from
  Task 6 at all, but the component must handle it defensively since the Review Focus
  calls out direct-URL access as a case to cover).

- [ ] **Step 2: Build `ViewerControls`**

Buttons: Desktop/Tablet/Mobile (`aria-pressed`), Reload (bumps `reloadKey` to
remount the iframe), Fullscreen (`element.requestFullscreen()`/`exitFullscreen()`
wrapped in try/catch, matching prototype's existing pattern), Close.
Bottom row: Copy link (`navigator.clipboard.writeText`, falls back to `prompt()` on
failure, matching prototype), "Abrir site original" external link (only if
`liveUrl` set), WhatsApp CTA (`intent="similar-project"`).

- [ ] **Step 3: Build `ProjectViewer`**

Overlay shell: `role="dialog" aria-modal="true"`. On open: save
`document.activeElement` to restore on close, focus the close button, set
`document.body.style.overflow = 'hidden'`. Keyboard handling: `Escape` closes
(unless a nested native `<dialog>` help modal is open — if one exists, mirror the
prototype's guard); `Tab`/`Shift+Tab` cycles focus within the overlay only (reimplement
the prototype's existing focus-trap logic, which already works — port, don't
redesign). On close: restore focus, restore body overflow, exit fullscreen if active.
Update `location.hash` to `#${project.slug}` on open per the prototype's existing
shareable-hash pattern, clear on close.

- [ ] **Step 4: Write Playwright tests**

```ts
test('viewer opens, switches device size, and closes on Escape', async ({ page }) => {
  await page.goto('/projetos/aurora-hospedagens');
  await page.getByRole('button', { name: /ver demonstração/i }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await page.getByRole('button', { name: /mobile|celular/i }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('euclides-fitness viewer never renders an iframe', async ({ page }) => {
  await page.goto('/projetos/euclides-fitness');
  await page.getByRole('button', { name: /ver demonstração|galeria/i }).click();
  await expect(page.locator('iframe')).toHaveCount(0);
});

test('iframe that never loads falls back within the timeout window', async ({ page }) => {
  // Route the iframe's network request to hang indefinitely
  await page.route('**/*', async (route, request) => {
    if (request.url().includes('aurorahospedagens.com')) {
      await new Promise(() => {}); // never resolve
    } else {
      await route.continue();
    }
  });
  await page.goto('/projetos/aurora-hospedagens');
  await page.getByRole('button', { name: /ver demonstração/i }).click();
  await expect(page.getByText(/não foi possível carregar|abrir site original/i)).toBeVisible({ timeout: 12000 });
});
```

- [ ] **Step 5: Run tests, verify pass**

Run: `npx playwright test viewer`
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add interactive project viewer with device switching and safe iframe fallback"
```

**Dependências:** Task 2, Task 3, Task 6.

**Testes necessários:** The 3 tests above — directly covers two Review Focus items
("iframe that never fires onload" and implicitly the unavailable-state default).

**Critérios de aceite:** Never an infinite spinner; Euclides never attempts iframe;
Escape/focus-trap/fullscreen/copy-link all work; device switching changes viewport
width in the DOM.

**Evidências de conclusão:** Playwright output.

---

### Task 8: SEO plumbing — sitemap, robots.txt, root metadata

**Objetivo e escopo:** Round out the SEO requirements from the spec/brief that
aren't per-project: sitemap, robots.txt, root Open Graph defaults, favicon.

**Files:**
- Create: `src/app/sitemap.ts`, `src/app/robots.ts`
- Modify: `src/app/layout.tsx` (root `metadata` export, already started in Task 4 —
  extend with `metadataBase`, default OG image, favicon link)
- Test: `tests/e2e/seo.spec.ts`

**Interfaces:**
- Consumes: `projects` (Task 2) for sitemap entries.

**Procedimento de implementação:**
- [ ] **Step 1: Implement `sitemap.ts`**

```ts
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://catalogo.onzemil.company'; // placeholder — see Task 10 pendência
  return [
    { url: base, lastModified: new Date() },
    ...projects.map(p => ({ url: `${base}/projetos/${p.slug}`, lastModified: new Date() })),
  ];
}
```

- [ ] **Step 2: Implement `robots.ts`**

```ts
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: '*', allow: '/' }, sitemap: 'https://catalogo.onzemil.company/sitemap.xml' };
}
```

- [ ] **Step 3: Extend root metadata in `layout.tsx`**

Add `metadataBase: new URL('https://catalogo.onzemil.company')`, default
`openGraph.images`, `icons.icon` pointing at a favicon derived from the brand mark.

- [ ] **Step 4: Write test confirming sitemap/robots are reachable post-export**

```ts
test('sitemap and robots are generated', async ({ page }) => {
  const sitemapRes = await page.goto('/sitemap.xml');
  expect(sitemapRes?.status()).toBe(200);
  const robotsRes = await page.goto('/robots.txt');
  expect(robotsRes?.status()).toBe(200);
});
```

- [ ] **Step 5: Run test, verify pass**

Run against the static-exported `out/` served locally (e.g. `npx serve out` in one
terminal, then point Playwright's `baseURL` at it) — `next dev` does not serve static
export's generated sitemap/robots identically in all Next versions, so verify against
the actual export.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: add sitemap, robots.txt, and root SEO metadata"
```

**Dependências:** Task 2, Task 4.

**Testes necessários:** The test above.

**Critérios de aceite:** `sitemap.xml` lists all 6 project URLs + home; `robots.txt`
allows crawling.

**Evidências de conclusão:** Test output; note in the final report that the base
domain is a placeholder pending the user's real hosting domain (see Pendências).

---

### Task 9: Real cover images — Aurora screenshot attempt, Euclides honest fallback

**Objetivo e escopo:** Replace the "no image" placeholder state for Aurora with a
real screenshot if one can be captured; document why Euclides and the 4 Nível 2
projects remain without a product screenshot, per spec.

**Files:**
- Create (conditional): `public/images/projects/aurora-hospedagens/cover.webp`,
  `public/images/projects/aurora-hospedagens/mobile.webp` (if capture succeeds)
- Modify: `src/data/projects.ts` (`image`/`gallery` fields for Aurora, only if real
  files exist)
- Test: none (asset task — covered by Task 5/6's existing tests rendering without
  crashing whether or not `image` is set)

**Procedimento de implementação:**
- [ ] **Step 1: Attempt a real desktop + mobile screenshot of Aurora Hospedagens**

Requires a working headless/real browser (the audit found the available Playwright
MCP server requires real Google Chrome, not installed, and installing it needs admin
rights not available in this environment — see spec's Pendências). If a Chrome/
Chromium binary becomes available (user installs it, or CI has one), capture at
1440×900 and 390×844, save as WebP.

- [ ] **Step 2: If capture succeeds** — add the files to `public/images/projects/aurora-hospedagens/`, set `image` and `gallery` in `projects.ts` for Aurora accordingly.

- [ ] **Step 3: If capture does not succeed in this environment** — leave `image`/`gallery` unset for Aurora (same honest-fallback treatment as Euclides), and record this explicitly as a pendência in the final report, not silently.

- [ ] **Step 4: Commit (even if no images were added — commit the decision)**

```bash
git add -A
git commit -m "docs: record Aurora/Euclides cover-image capture attempt and outcome"
```

**Dependências:** Task 2.

**Testes necessários:** None new — rely on Task 5/6 tests already passing with
`image: undefined`.

**Critérios de aceite:** Either real screenshots are in place, or the gap is
explicitly documented — never a placeholder image presented as if it were real.

**Evidências de conclusão:** Either the image files + updated data, or a written
note in `docs/VALIDACAO_CATALOGO.md` (Task 11) explaining the blocker.

---

### Task 10: CI workflow, responsive testing pass, accessibility/performance check

**Objetivo e escopo:** GitHub Actions workflow running lint + typecheck + build +
tests on push; a manual responsive pass across the required breakpoints; a
Lighthouse run against the local static export.

**Files:**
- Create: `.github/workflows/ci.yml`
- Test: extend `tests/e2e/*.spec.ts` with viewport-parametrized runs (Playwright's
  built-in device emulation), or add `tests/e2e/responsive.spec.ts`

**Procedimento de implementação:**
- [ ] **Step 1: Write `ci.yml`**

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm run build
      - run: npx playwright install --with-deps chromium
      - run: npx playwright test
```

- [ ] **Step 2: Write `tests/e2e/responsive.spec.ts` parametrized over the required viewports**

```ts
const viewports = [
  { width: 360, height: 800 }, { width: 390, height: 844 }, { width: 430, height: 932 },
  { width: 768, height: 1024 }, { width: 1440, height: 900 }, { width: 1920, height: 1080 },
];
for (const vp of viewports) {
  test(`home page renders without horizontal overflow at ${vp.width}x${vp.height}`, async ({ page }) => {
    await page.setViewportSize(vp);
    await page.goto('/');
    const hasOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    expect(hasOverflow).toBe(false);
  });
}
```

- [ ] **Step 3: Run the full suite locally, verify pass**

Run: `npx playwright test`
Expected: PASS across all specs and viewports.

- [ ] **Step 4: Run Lighthouse against the local static export**

```bash
npx serve out -p 4173 &
npx lighthouse http://localhost:4173 --output=json --output-path=./lighthouse-report.json --preset=desktop
npx lighthouse http://localhost:4173 --output=json --output-path=./lighthouse-report-mobile.json
```

Record the four category scores (Performance, Accessibility, Best Practices, SEO)
for both runs. If any score is below 90, fix what's addressable within scope
(unused JS, missing `alt` text, color-contrast) and re-run; if a gap remains
(e.g., due to the `unoptimized: true` image setting required by static export),
document it as a pendência rather than silently reporting an unmet target as met.

- [ ] **Step 5: Grep for inline `wa.me` strings outside `src/lib/whatsapp.ts`**

Run: `grep -rn "wa.me" src/ --include="*.tsx" --include="*.ts" | grep -v "src/lib/whatsapp.ts"`
Expected: no matches (confirms Task 3's constraint held).

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "ci: add GitHub Actions workflow and responsive/Lighthouse verification"
```

**Dependências:** Tasks 1–9 (this is the full-suite verification pass).

**Testes necessários:** Full Playwright suite + the responsive viewport tests +
Lighthouse scores recorded.

**Critérios de aceite:** CI workflow file valid (lints as valid YAML); all tests pass
locally; Lighthouse scores recorded (≥90 where achievable, gaps documented
otherwise); no stray `wa.me` strings.

**Evidências de conclusão:** Full test run output, Lighthouse JSON reports (or their
summarized scores), grep output.

---

### Task 11: Documentation, inventory docs, and final README

**Objetivo e escopo:** Update `README.md` with real install/dev/build/export
instructions; write `docs/INVENTARIO_PROJETOS.md` (human-readable version of the
spec's inventory) and `docs/VALIDACAO_CATALOGO.md` (test/Lighthouse results +
pendências), matching the brief's Etapa 1/Fase 09 documentation requirements.

**Files:**
- Modify: `README.md`
- Create: `docs/INVENTARIO_PROJETOS.md`, `docs/VALIDACAO_CATALOGO.md`

**Procedimento de implementação:**
- [ ] **Step 1: Write `README.md`**

Sections: project description, `npm install`, `npm run dev`, `npm run build`
(produces static export in `out/`), `npm test` / `npx playwright test`, deployment
note (static files in `out/` — no server runtime required), link to the design spec
and this plan.

- [ ] **Step 2: Write `docs/INVENTARIO_PROJETOS.md`**

Table of all 6 projects, status, verified facts, and explicitly: UrbanVision and
Vulmont excluded (not found in the org) — human-readable version of the spec's
Fase 01 audit, for anyone reviewing the PR without reading the full design doc.

- [ ] **Step 3: Write `docs/VALIDACAO_CATALOGO.md`**

Test results summary (pass/fail counts per spec file), Lighthouse scores from
Task 10, the list of pendências (Aurora/Euclides screenshots, sitemap base domain
placeholder, Playwright/Chrome install blocker in this environment), and anything
left for future work.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "docs: add inventory and validation documentation, update README"
```

**Dependências:** Task 10 (needs final test/Lighthouse results to document).

**Testes necessários:** None (documentation task).

**Critérios de aceite:** A reviewer unfamiliar with this conversation can read
`README.md` + the two docs and understand what's real, what's pending, and how to
run/verify the project themselves.

**Evidências de conclusão:** The three files, reviewed for accuracy against actual
task outcomes (not aspirational).

---

### Task 12: Push branch and open PR

**Objetivo e escopo:** Publish the finished branch and open a PR against `main` for
review — no merge.

**Procedimento de implementação:**
- [ ] **Step 1: Review the full diff for secrets/private data**

Run: `git diff main --stat` and manually scan for `.env` files, tokens, or any
private-repo content accidentally copied in (e.g. from reading `havoc.co`/`311`
READMEs during research — confirm none of that private source was copied into this
public repo beyond the already-public facts cited in the inventory docs).

- [ ] **Step 2: Add the GitHub remote and push**

```bash
git remote add origin https://github.com/11000company/catalogo.git
git push -u origin feat/catalogo-final
```

- [ ] **Step 3: Open the PR**

```bash
gh pr create --repo 11000company/catalogo --base main --head feat/catalogo-final \
  --title "Catálogo digital ONZEMIL — implementação completa" \
  --body "$(cat <<'EOF'
## Resumo
Substitui o protótipo estático por um catálogo real em Next.js, com 2 estudos de caso completos (Aurora Hospedagens, Euclides Fitness) e 4 projetos em desenvolvimento apresentados honestamente (Havoc, Elysium Concept, BASE311, Base Phone). UrbanVision e Vulmont não foram incluídos por não terem repositório ou menção confirmada na organização.

Ver `docs/superpowers/specs/2026-11-22-catalogo-onzemil-design.md` e `docs/INVENTARIO_PROJETOS.md` para a auditoria completa, e `docs/VALIDACAO_CATALOGO.md` para resultados de teste e pendências.

## Test plan
- [ ] `npm run lint` e `npx tsc --noEmit` passam
- [ ] `npm run build` exporta estático com sucesso
- [ ] `npx playwright test` passa localmente
- [ ] CI do GitHub Actions passa
EOF
)"
```

- [ ] **Step 4: Report the PR URL back to the user**

**Dependências:** All previous tasks complete and committed.

**Critérios de aceite:** Branch pushed, PR open against `main`, no merge performed.

**Evidências de conclusão:** PR URL.

---

## Self-Review Notes

- **Spec coverage:** every spec section (inventory, objetivos, não objetivos,
  anti-objetivos, abordagens, pendências) maps to a task — Tasks 2 (inventory data),
  5–7 (objetivos/anti-objetivos), 9 (pendências: screenshots), 10 (pendências:
  Lighthouse/CI), 11 (pendências documented), 12 (repo/PR decisions).
- **Type consistency:** `Project`, `ProjectCategory`, `ProjectStatus`, `PreviewMode`
  defined once in Task 2, referenced identically by name in Tasks 3, 5, 6, 7 — no
  renames introduced.
- **Review Focus:** all 5 items each have an owning task and test (no-liveUrl card →
  Task 5; unavailable-mode direct access → Task 7; iframe timeout → Task 7; 404 →
  Task 6; empty filter+search → Task 5).
- **Known environment blocker carried forward, not hidden:** Playwright MCP in this
  environment requires real Google Chrome, which needs admin rights not available
  here. Task 9 and Task 10 both name this explicitly as a possible pendência rather
  than assuming it resolves itself — if it's still blocked when execution reaches
  those tasks, document it in Task 11's validation doc instead of silently skipping
  the screenshot/Lighthouse-mobile-emulation work.
