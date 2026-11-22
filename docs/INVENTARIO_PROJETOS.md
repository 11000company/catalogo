# Inventário de Projetos — ONZEMIL Company

Levantamento real, feito via GitHub CLI autenticado contra a organização
`11000company` e fetch direto das URLs públicas. Nada aqui foi inventado —
ver o design completo em
[`docs/superpowers/specs/2026-11-22-catalogo-onzemil-design.md`](superpowers/specs/2026-11-22-catalogo-onzemil-design.md)
para o processo de auditoria.

## Publicados (estudos de caso completos)

| Projeto | URL | Status confirmado |
|---|---|---|
| **Aurora Hospedagens** | https://www.aurorahospedagens.com/ | Site real, ativo (HTTP 200). Capturado com Playwright: busca de disponibilidade, login, seções de mercado interno ("Aurora Mercado"), passeios e serviços. Sem repositório na organização — hospedado fora do GitHub da ONZEMIL. |
| **Euclides Fitness** | https://euclidesfitness.com.br/ | Site real e normalmente ativo, mas bloqueia conexões automatizadas (recusou conexão em 2 tentativas de fetch). Tratado como publicado — apenas link externo, sem tentativa de iframe ou captura automatizada. |

## Em desenvolvimento (repositórios privados confirmados)

Status confirmado tanto pelo README público oficial da organização
(`11000company/.github`) quanto pela inspeção direta de cada repositório.

| Projeto | Repositório | Estado real |
|---|---|---|
| **Havoc** | `havoc.co` (privado, arquivado) | Mais avançado: "Fase 1 concluída" — catálogo de produtos, API de administração, páginas de listagem e produto (PLP/PDP) funcionando. A loja lê de dados fixture, ainda não de uma API em produção. Sem URL pública. |
| **Elysium Concept** | `elysiumconcept` (privado) | README de uma linha. Nada implementado ainda. |
| **BASE311** | `311` (privado, arquivado) | Monorepo "BaseApp" — super-app em Fase 1 de um plano de ~12 fases, ambiente só local (Docker/Postgres/Redis), sem interface de usuário, sem deploy. |
| **Base Phone** | `lojaiphone` (privado) | Scaffold mínimo, sem conteúdo de README. |

## Excluídos deste catálogo

**UrbanVision** e **Vulmont** — nenhum repositório ou menção encontrados na
organização `11000company`. Incluí-los seria apresentar projetos não
verificados como reais, o que o escopo deste trabalho proíbe explicitamente.

## Identidade de marca

Logotipo oficial "11000" (azul elétrico sobre fundo escuro) obtido do
repositório `11000company/.github/assets/`. Accent de cor usado no catálogo
(`#1e93f5`) foi amostrado por pixel diretamente do logotipo real — não é uma
escolha arbitrária.
