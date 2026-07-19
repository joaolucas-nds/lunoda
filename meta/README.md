# Lunoda

Ferramenta pessoal, **offline** e em **arquivo único `.html`**, para capturar e organizar interações (principalmente conversas com IAs) de forma rápida e visual — e **exportar tudo num único arquivo** bem identificado (JSON, Markdown e HTML/PDF).

Junta o melhor de dois mundos: a organização visual estilo Notion (tabela + propriedades) com a exportação consolidada e reimportável que o Notion não oferece.

## Como usar

1. Abra `Lunoda_v12.html` no navegador (ou publique no GitHub Pages).
2. Crie entradas com **Nova entrada**. Cada entrada tem título, descrição e **blocos de conteúdo**.
3. Marque **propriedades** (ex.: Tags, IA Utilizada) — por bloco ou com adição automática a novos blocos.
4. **Exporte** tudo (ou uma seleção) em JSON, Markdown ou HTML/PDF. Reimporte o JSON quando quiser.

Os dados ficam no `localStorage` do navegador (chave `base_v4`). É offline: nada sai da sua máquina.

## Principais recursos (v12)

- Tabela de entradas com busca, ordenação, filtros por **data** e por **propriedade**.
- Editor com blocos versionados e sugestão automática de versão.
- **Propriedades por bloco**: o bloco é a fonte de verdade; a entrada é a união das opções dos seus blocos.
- **Herança automática** de propriedades para blocos novos (sem afetar os existentes).
- **Gestão de blocos**: seleção em massa, reordenar em grupo, duplicar, excluir, **mover/copiar entre entradas** (existente ou nova).
- **Filtro interno de blocos** (subtítulo, versão, propriedade) com modo **E/OU**.
- Exportação JSON / Markdown (identificação rica) / HTML-PDF; importação com migração de formatos antigos.

## Stack

HTML + CSS + JavaScript vanilla, sem build e sem dependências. Fontes IBM Plex (Google Fonts). Favicon `favicon.png` na raiz.

## Estrutura do repositório

```
Lunoda_v12.html          # a aplicação (versão canônica atual)
favicon.png              # ícone do app
README.md                # este arquivo
INSTRUCOES-DO-PROJETO.md # instruções lidas em toda mensagem pelo assistente
.gitignore
.flatdropignore          # enxuga o que sobe ao Projeto do Claude

meta/                    # sistema de documentação de contexto
├── CEREBRO.md           # comportamento do assistente de IA
├── CONTEXT.md           # o que o projeto é (estável)
├── STATUS.md            # o estado atual (rolante)
├── DECISIONS.md         # decisões (DEC) e correções (FIX)
├── CHANGELOG.md         # histórico de versões
├── IDEAS.md             # ideias e backlog de longo prazo
├── ROADMAP.md           # plano em fases
├── GLOSSARY.md          # termos do projeto
├── HISTORY.md           # conhecimento consolidado das fases antigas
└── LOG-TEMPLATE.md      # molde do log de sessão

guides/                  # guias passo a passo de cada versão
└── lunoda_vN_guide.md

logs/                    # logs de sessão
└── AAAA-MM-DD.md
```

## Desenvolvimento

Cada versão evolui por um **guia `.md` passo a passo** (`lunoda_vN_guide.md`), aplicado manualmente ao HTML — não por edição direta. Ver `meta/DECISIONS.md` (DEC-002) e `meta/HISTORY.md` para o fluxo completo.

---

> Nomes antigos do app: Synap / base / Nexus (daí a chave `base_v4` e prefixos legados). Nome atual: **Lunoda**.
