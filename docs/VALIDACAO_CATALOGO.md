# Validação do Catálogo — Resultados e Pendências

## Testes automatizados

**Testes unitários (Vitest)** — `npm test`

| Arquivo | Testes | Resultado |
|---|---|---|
| `tests/unit/projects.spec.ts` | 3 | ✅ Passou |
| `tests/unit/whatsapp.spec.ts` | 2 | ✅ Passou |
| `tests/unit/site-config.spec.ts` | 4 | ✅ Passou |
| **Total** | **9** | **✅ 9/9** |

**Testes end-to-end (Playwright, contra a exportação estática real em `out/`)** —
`npx playwright test`

| Arquivo | Testes | Resultado |
|---|---|---|
| `tests/e2e/layout.spec.ts` | 1 | ✅ Passou |
| `tests/e2e/catalog.spec.ts` | 2 | ✅ Passou |
| `tests/e2e/project-pages.spec.ts` | 6 | ✅ Passou |
| `tests/e2e/viewer.spec.ts` | 5 | ✅ Passou |
| `tests/e2e/seo.spec.ts` | 2 | ✅ Passou |
| `tests/e2e/responsive.spec.ts` | 6 (360×800, 390×844, 430×932, 768×1024, 1440×900, 1920×1080) | ✅ Passou |
| **Total** | **22** | **✅ 22/22** |

Sequência completa de qualidade, todas passando sem erros:

```bash
npm run lint
npx next typegen
npx tsc --noEmit
npm test
npm run build
npx playwright install chromium
npx playwright test
```

`npm audit` reporta 0 vulnerabilidades. Dependências de patch atualizadas
(react, react-dom, tailwindcss, @tailwindcss/turbopack) — ver histórico de
commits da branch. `eslint` (9.x) e `typescript` (5.x) foram deixados na
major atual; ambos têm majors mais recentes disponíveis (10.x e 7.x,
respectivamente) que não foram aplicados por serem saltos de versão major
com risco de mudanças de configuração/regras não verificadas nesta rodada.

Verificação adicional: nenhuma string `wa.me` hardcoded fora de
`src/lib/whatsapp.ts` (confirmado via grep) — todo CTA de WhatsApp passa pelo
helper único `buildWhatsAppUrl`.

## Configuração de domínio

O domínio de publicação é controlado pela variável de ambiente
`NEXT_PUBLIC_SITE_URL` (ver `.env.example`). Sem ela configurada:

- `sitemap.ts` e `layout.tsx`'s `metadataBase` usam `http://localhost:3000`
  como base.
- `robots.ts` retorna `Disallow: /` para todos os agentes.
- `layout.tsx` define `robots: { index: false, follow: false }` (noindex).

Isso evita que uma URL provisória seja indexada antes do domínio real estar
definido. Comportamento coberto por `tests/e2e/seo.spec.ts` e
`tests/unit/site-config.spec.ts`.

## Lighthouse — não executado neste ambiente

Três abordagens foram tentadas para medir Performance / Acessibilidade / Boas
Práticas / SEO, e todas falharam por falta de um Chrome real instalável neste
ambiente local (sem privilégios de administrador):

1. Playwright MCP tool — exige Google Chrome real, não apenas o Chromium que
   vem com `@playwright/test`.
2. Instalação via `winget`/`choco` — bloqueada por prompts UAC/permissão de
   administrador.
3. `lighthouse` CLI com `CHROME_PATH` apontando para o Chromium do
   `@playwright/test` — o binário foi encontrado, mas falhou ao abrir a porta
   de depuração (provavelmente um build headless incompatível com o
   `chrome-launcher` do Lighthouse).

**Pendência real, não estimativa inventada.** O workflow de CI
(`.github/workflows/ci.yml`) roda em `ubuntu-latest` e já instala um Chromium
completo via `npx playwright install --with-deps chromium` — rodar Lighthouse
nesse ambiente de CI é viável como um próximo passo, mas não foi feito nesta
implementação.

**Nota sobre o CI**: o workflow foi adicionado nesta branch, mas o GitHub
só descobre e dispara workflows que já existem na branch padrão (`main`) do
repositório — um workflow adicionado apenas numa branch de feature não
dispara automaticamente até ser mesclado. Nenhuma execução de CI foi
registrada para este repositório até o momento (confirmado via API do
GitHub). Isso não é um defeito do workflow em si, mas uma limitação de como
o GitHub Actions descobre workflows novos.

## Revisão final de branch

Uma revisão independente (modelo mais capaz, contexto novo) encontrou e levou
à correção dos seguintes problemas antes da publicação do PR:

- **Crítico, corrigido**: o visualizador de Aurora Hospedagens nunca tinha um
  `onLoad` no iframe, então o timeout de 8s sempre disparava e substituía uma
  demonstração funcionando por uma mensagem de erro — mesmo quando o site
  carregava com sucesso. Corrigido adicionando `onLoad` e comparando com o
  `reloadKey` atual. O teste que deveria cobrir isso também não verificava
  nada de útil (a regex batia com o próprio link "Abrir site original",
  sempre presente) — corrigido, e um novo teste de caminho de sucesso foi
  adicionado para provar que um iframe funcional sobrevive à janela de
  timeout.
- **Corrigido**: o botão "Ver demonstração" de Euclides Fitness levava a uma
  mensagem que dizia "não foi possível carregar", implicando uma falha que
  nunca aconteceu (a galeria está vazia, não houve tentativa de carregamento).
  Corrigido com uma mensagem distinta para "prévia não disponível" vs. "falha
  real ao carregar".
- **Corrigido**: título das páginas de projeto duplicava o sufixo "— ONZEMIL
  Company" (o template do layout já adiciona isso). Corrigido usando apenas
  `project.title` em `generateMetadata`.
- **Corrigido**: páginas de projeto sem imagem própria (Euclides e os 4
  projetos em desenvolvimento) não tinham `og:image` nenhum, prejudicando o
  preview ao compartilhar no WhatsApp — o próprio motivo de usar Next.js.
  Corrigido com fallback para a logomarca da marca.

Todos os 6 achados **Minor** da revisão também foram corrigidos numa rodada
subsequente de auditoria geral:

- Seletor de foco do visualizador agora inclui `<iframe>` — navegação por
  teclado alcança a demonstração embutida em vez de pular para o botão
  "Fechar".
- Arquivos SVG de placeholder do scaffold (`file.svg`, `globe.svg`,
  `next.svg`, `vercel.svg`, `window.svg`) removidos — nenhum era referenciado.
- Variável CSS `--color-surface` (e as demais) que se referenciava a si mesma
  dentro de `@theme inline` corrigida — removidos os aliases redundantes já
  que os nomes coincidiam com `:root`.
- `SiteHeader` agora reutiliza o componente compartilhado `WhatsAppCTA` em
  vez de construir seu próprio link duplicado.
- `scripts/capture-aurora-screenshot.mjs` agora escreve `.webp` diretamente
  via `screenshot({ type: "webp" })` do Playwright, em vez de `.png` com uma
  etapa de conversão separada e não documentada.

## Pendências e limitações conhecidas

- **Lighthouse**: ver acima — não medido neste ambiente; viável em CI.
- **CI nunca executado**: ver nota acima — workflow existe mas não foi
  descoberto pelo GitHub Actions por estar apenas na branch de feature.
- **Screenshot de Euclides Fitness**: o site recusou conexão em 2 tentativas
  de fetch automatizado durante a auditoria (ver spec, Fase 01) — não houve
  tentativa de captura via Playwright especificamente para este projeto (ao
  contrário de Aurora, que foi capturada com sucesso). Sem captura manual
  fornecida pelo usuário, a página do projeto usa o estado honesto de prévia
  indisponível em vez de uma imagem inventada.
- **4 projetos em desenvolvimento** (Havoc, Elysium Concept, BASE311, Base
  Phone): sem imagem de produto real — os cards usam um bloco visual de marca
  genérico, nunca uma captura. Profundidade de texto é desigual entre eles
  (reflete o que é realmente conhecido de cada repositório), por decisão
  explícita do usuário.
- **Aurora Hospedagens**: tecnologias (`technologies: []`) não foram
  confirmadas — apenas funcionalidades visíveis na interface foram
  documentadas, não a stack técnica por trás do site.
- **`eslint` e `typescript`**: majors mais recentes disponíveis (10.x e 7.x)
  não aplicados — ver seção de testes acima.
