# Validação do Catálogo — Resultados e Pendências

## Testes automatizados

**Testes unitários (Vitest)** — `npm test`

| Arquivo | Testes | Resultado |
|---|---|---|
| `tests/unit/projects.spec.ts` | 3 | ✅ Passou |
| `tests/unit/whatsapp.spec.ts` | 2 | ✅ Passou |

**Testes end-to-end (Playwright, contra a exportação estática real em `out/`)** —
`npx playwright test`

| Arquivo | Testes | Resultado |
|---|---|---|
| `tests/e2e/layout.spec.ts` | 1 | ✅ Passou |
| `tests/e2e/catalog.spec.ts` | 2 | ✅ Passou |
| `tests/e2e/project-pages.spec.ts` | 6 | ✅ Passou |
| `tests/e2e/viewer.spec.ts` | 4 | ✅ Passou |
| `tests/e2e/seo.spec.ts` | 1 | ✅ Passou |
| `tests/e2e/responsive.spec.ts` | 6 (360×800, 390×844, 430×932, 768×1024, 1440×900, 1920×1080) | ✅ Passou |
| **Total** | **20** | **✅ 20/20** |

Lint (`npm run lint`) e verificação de tipos estrita (`npx tsc --noEmit`) passam
sem erros. O build de produção (`npm run build`) gera a exportação estática em
`out/` com sucesso, incluindo as 6 páginas de projeto, sitemap.xml, robots.txt
e o ícone de marca.

Verificação adicional: nenhuma string `wa.me` hardcoded fora de
`src/lib/whatsapp.ts` (confirmado via grep) — todo CTA de WhatsApp passa pelo
helper único `buildWhatsAppUrl`.

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

## Revisão final de branch

Uma revisão independente (modelo mais capaz, contexto novo) encontrou e levou
à correção dos seguintes problemas antes da publicação do PR:

- **Crítico, corrigido**: o visualizador de Aurora Hospedagens nunca tinha um
  `onLoad` no iframe, então o timeout de 8s sempre disparava e substituía uma
  demonstração funcionando por uma mensagem de erro — mesmo quando o site
  carregava com sucesso. Corrigido adicionando `onLoad` e comparando com o
  `reloadKey` atual. O teste que deveria cobrir isso (`iframe that never loads
  falls back...`) também não verificava nada de útil (a regex batia com o
  próprio link "Abrir site original", sempre presente) — corrigido, e um novo
  teste de caminho de sucesso foi adicionado para provar que um iframe
  funcional sobrevive à janela de timeout.
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

Achados **Minor** da revisão (não corrigidos nesta rodada — ver lista de
decisões no relatório final):
copiar-link não reabre o visualizador a partir do hash da URL; o seletor de
foco do visualizador não inclui `<iframe>`; arquivos SVG de placeholder do
scaffold não removidos; variável CSS `--color-surface` referenciando a si
mesma dentro de `@theme inline` (funciona só por cascata); `SiteHeader` não
reutiliza o componente `WhatsAppCTA`.

## Pendências e limitações conhecidas

- **Lighthouse**: ver acima — não medido neste ambiente.
- **Screenshot de Euclides Fitness**: o site recusou conexão em 2 tentativas
  de fetch automatizado durante a auditoria (ver spec, Fase 01) — não houve
  tentativa de captura via Playwright especificamente para este projeto (ao
  contrário de Aurora, que foi capturada com sucesso na Task 9). Sem captura
  manual fornecida pelo usuário, a página do projeto usa o estado honesto de
  prévia indisponível em vez de uma imagem inventada.
- **Domínio do sitemap/robots**: `https://catalogo.onzemil.company` é um
  placeholder (o domínio real de hospedagem ainda não foi definido). Precisa
  ser atualizado em `src/app/sitemap.ts`, `src/app/robots.ts` e
  `metadataBase` em `src/app/layout.tsx` antes da publicação final.
- **4 projetos em desenvolvimento** (Havoc, Elysium Concept, BASE311, Base
  Phone): sem imagem de produto real — os cards usam um bloco visual de marca
  genérico, nunca uma captura. Profundidade de texto é desigual entre eles
  (reflete o que é realmente conhecido de cada repositório), por decisão
  explícita do usuário.
- **Aurora Hospedagens**: tecnologias (`technologies: []`) não foram
  confirmadas — apenas funcionalidades visíveis na interface foram
  documentadas, não a stack técnica por trás do site.
