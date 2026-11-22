# Catálogo Digital ONZEMIL — Design

## Intenção e porquê

O repositório `11000company/catalogo` hoje contém apenas um protótipo HTML estático
(`catalogo-onzemil-prototipo.html`) com dados fictícios. A missão é transformar isso em
um catálogo real, publicável, que mostra os projetos verdadeiros da ONZEMIL Company
(marca pública: "Onzemil Company" / handle `@onzemil.company`) para visitantes decidirem
contratar a empresa. O catálogo precisa converter: cada projeto tem um CTA de WhatsApp
pré-preenchido pedindo "um projeto parecido".

## Inventário verificado (Fase 01 — auditoria real)

Fonte: GitHub CLI autenticado contra a org `11000company` (repos públicos/privados
visíveis à conta logada) + fetch direto das duas URLs públicas. Não há suposição —
apenas o que foi confirmado.

### Nível 1 — Case studies completos (site real, acessível)

| Projeto | URL | Confirmado | Observação |
|---|---|---|---|
| Aurora Hospedagens | https://www.aurorahospedagens.com/ | HTTP 200, carrega | Hospedagens/turismo, João Pessoa-PB. Sem repositório na org — site hospedado fora do GitHub da organização. |
| Euclides Fitness | https://euclidesfitness.com.br/ | Recusou conexão em 2 tentativas (mesmo IP, `ECONNREFUSED`) a partir da ferramenta de fetch | Usuário confirmou que é site real e normalmente ativo — provável bloqueio a clientes automatizados/bots, não queda real. **Decisão: tratar como publicado, mas sem tentativa de iframe** — apenas link externo, para não arriscar mostrar um embed quebrado se o bloqueio for no lado do servidor. |

### Nível 2 — "Em desenvolvimento" (repositórios reais, privados, sem demo pública)

Confirmado diretamente no README público oficial da organização
(`11000company/.github/profile/README.md`), que já classifica estes projetos como
"em desenvolvimento e conceitos" e declara explicitamente: *"não são anunciadas como
produtos concluídos, nem disponibilizam acesso a sistemas privados."*

| Projeto | Repo | Estado real confirmado |
|---|---|---|
| Havoc | `havoc.co` (privado, arquivado) | Mais avançado dos quatro: "Fase 1 concluída" — catálogo modelado, API admin, PLP/PDP funcionando, mas loja lê de **fixture**, não da API real. Sem URL pública. |
| Elysium Concept | `elysiumconcept` (privado) | README de uma linha só. Nada implementado ainda. |
| BASE311 | `311` (privado, **arquivado**) | Monorepo "BaseApp" — super-app em Fase 1 de ~12 fases planejadas, ambiente só local (Docker/Postgres/Redis), sem UI, sem deploy. Está muito aquém de "gestão financeira" pronta. |
| Base Phone | `lojaiphone` (privado) | Scaffold mínimo, sem conteúdo de README. |

### Fora do catálogo

**UrbanVision** e **Vulmont**: nenhum repositório ou menção na organização. Não serão
incluídos — incluí-los seria inventar projetos, o que o brief proíbe explicitamente.

### Identidade visual real

A organização já tem uma identidade de marca pública, diferente do protótipo:
logotipo "11000" em azul elétrico com círculos entrelaçados sobre fundo azul-marinho
escuro (dois GIFs animados em `11000company/.github/assets/`: banner e versão "orbit").
O protótipo usa um accent creme/bege genérico e um ícone "11" em caixa — **será
substituído** pela identidade azul real (ver Abordagens / Fase 02).

Ambos os GIFs já foram baixados e amostrados por pixel (não é uma suposição):
cor dominante do logotipo é azul vívido, pico em `#1e93f5`, com tons próximos
`#1e72cd`/`#1e84e3` nas bordas/sombras do traço. **Accent escolhido: `#1e93f5`**
sobre fundo grafite/preto (`--bg` ~`#0b0c0e`), com os tons intermediários reservados
para estados hover/active do mesmo accent.

## Objetivos

- Catálogo publicável, com 2 case studies completos (Aurora, Euclides) e 4 cards
  "em desenvolvimento" honestos (Havoc, Elysium, BASE311, Base Phone) — sem capturas
  ou funcionalidades inventadas para os quatro últimos.
- Visualizador interativo para os 2 projetos de Nível 1: Aurora com tentativa de
  iframe (com fallback automático se o site recusar incorporação); Euclides apenas
  com link externo (ver decisão acima).
- Páginas individuais por projeto com URL compartilhável e Open Graph correto.
- CTAs comerciais (WhatsApp) funcionando em cada card, em cada página e no fechamento.
- Performance/acessibilidade dentro do possível de verificar localmente (Lighthouse
  via CI ou execução manual).

## Não objetivos

- Não construir autenticação, painéis administrativos ou dados reais dos sistemas
  privados (Havoc, BASE311, Elysium, Base Phone) — eles aparecem apenas como teasers.
- Não tentar contornar bloqueios de iframe/CSP de nenhum site.
- Não criar CMS ou backend — dados ficam em arquivo estático versionado
  (`src/data/projects.ts`).
- Não fazer deploy ou merge sem autorização explícita do usuário.

## Anti-objetivos (o que tornaria isso um fracasso mesmo "funcionando")

- Mostrar qualquer projeto de Nível 2 como se estivesse pronto/publicado.
- Um link quebrado ou iframe com carregamento infinito.
- Perder a real identidade visual da marca (usar o accent/ícone fictício do protótipo
  em vez do azul real).

## Restrições

- Sem acesso a capturas de tela autorizadas dos sistemas privados — teasers de
  Nível 2 usam apenas texto + categoria, sem imagem de produto (um bloco visual
  genérico da marca, não uma "foto" do sistema).
- Euclides Fitness bloqueia fetch automatizado — sem iframe, sem tentativa de
  screenshot automatizado via Playwright nesta rodada (ver Pendências).
- Sem repositório `11000company` para Aurora/Euclides — não há código-fonte para
  linkar como `sourceRepository`.

## Abordagens

### Stack (Fase 08 do brief)

1. **Next.js (App Router) com export estático** — roteamento por arquivo
   (`/projetos/[slug]`), geração de tags Open Graph por rota nativamente (resolve o
   requisito de link compartilhável com preview rico no WhatsApp sem ferramenta extra).
2. Vite SPA + script de prerender artesanal — mesmo resultado, mas eu mantenho um
   gerador de HTML estático por rota à mão.
3. Vite SPA puro sem prerender — mais simples, mas links compartilhados no WhatsApp
   não mostram título/imagem corretos.

**Escolhido pelo usuário: opção 1 (Next.js, export estático).** Justificativa: o
requisito de Open Graph por projeto é central para o CTA comercial de compartilhamento,
e Next.js resolve isso nativamente.

### Direção de marca (Fase 02 do brief)

1. Manter accent creme do protótipo.
2. Adotar a identidade azul real da marca (logotipo "11000", fundo grafite/preto,
   accent azul elétrico como único acento de cor).

**Escolhido pelo usuário: opção 2.** O protótipo usa uma marca genérica; a
organização já tem identidade pública real que deve ser respeitada.

## O que já foi decidido (pelo usuário, na conversa)

- Fonte de dados: auditoria real via GitHub, sem inventar projetos — confirmado.
- Escopo do catálogo: 2 case studies + 4 teasers honestos — confirmado.
- Euclides Fitness: tratado como publicado, apenas link externo, sem tentativa de
  iframe — confirmado (não é "indisponível", é "sem preview embutido").
- Accent de marca: azul real extraído do logotipo oficial — confirmado.
- Framework: Next.js com export estático — confirmado.
- Sequenciamento: implementação completa em uma tacada (não por fases com checkpoints
  intermediários) — confirmado.
- Repositório: inicializar git localmente nesta pasta, branch `feat/catalogo-final`,
  depois configurar remote para `11000company/catalogo` e abrir PR ao final —
  confirmado. **Sem merge/deploy sem autorização.**

## Deixado para o construtor (mim, na implementação)

- Estrutura exata de componentes dentro de `src/` (ou `app/` no caso do Next.js App
  Router) — seguindo a árvore sugerida no brief, adaptada ao App Router.
- Paleta exata de tons de cinza/grafite — accent já resolvido acima (`#1e93f5`).
- Escolha entre Framer Motion ou CSS puro para as microinterações — uso CSS
  transitions onde suficiente, Framer Motion só se a animação de entrada da marca
  precisar de orquestração (respeitando `prefers-reduced-motion`).
- Geração das imagens de capa dos 2 case studies: tentativa de screenshot real via
  Playwright (Aurora, que é acessível). Se a tentativa falhar no momento do build
  (rede do ambiente de build/CI pode não alcançar o domínio, mesmo que o site esteja
  no ar) — mesmo fallback honesto de Euclides se aplica: estado "capa indisponível"
  em vez de travar o build ou inventar uma imagem. Para Euclides, uso captura manual
  se o usuário fornecer; caso contrário, mesmo fallback.
- Profundidade de texto desigual entre os 4 teasers de Nível 2 é intencional e
  aprovada pelo usuário — cada card mostra só o que é real sobre aquele projeto
  (Havoc pode ter mais detalhe que Elysium, por exemplo).
- Testes: smoke tests Playwright para navegação, filtros, busca, abertura/fechamento
  do visualizador, e links de WhatsApp — não cobertura exaustiva de UI.
- CI: workflow simples de lint + build (+ testes se estáveis) no GitHub Actions.

## Acesso e estado do repositório (resolvido)

- `gh` CLI autenticado nesta sessão com escopos `repo` + `read:org` — suficiente para
  ler, criar branch, push e abrir PR em `11000company/catalogo`.
- O repo remoto `11000company/catalogo` hoje contém apenas `README.md` e
  `catalogo-onzemil-prototipo.html` (mesmo conteúdo da pasta local) — não há histórico
  ou conteúdo publicado para colidir. Trabalho local será commitado em branch nova
  (`feat/catalogo-final`), sem tocar `main`.
- Assets de marca (os 2 GIFs) já baixados do repo `11000company/.github` para uso
  local durante o desenvolvimento; serão copiados para `public/images/brand/` no
  projeto novo.

## Pendências explícitas (reportar ao final, não esconder)

- Screenshot real de Euclides Fitness depende de acesso que a ferramenta de fetch
  automatizado não tem agora — se o usuário puder fornecer uma captura manual,
  ela substitui o estado "indisponível".
- Os 4 projetos de Nível 2 não têm imagem de produto real — os cards usam um
  tratamento visual de marca (não uma captura), claramente rotulados "em
  desenvolvimento".
- Lighthouse ≥90 será medido localmente (via `next build` + Lighthouse CLI) mas não
  há ambiente de produção real ainda para medir condições de rede reais — o número
  reportado é de build local/estático servido localmente.
