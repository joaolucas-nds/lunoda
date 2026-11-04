# Lunoda

Ferramenta pessoal, **offline** e em **arquivo único `.html`**, para capturar e organizar interações (principalmente conversas com IAs) em blocos, com **exportação de tudo num arquivo só** — JSON, Markdown ou HTML/PDF — e reimportação.

Junta a organização visual estilo Notion (tabela + propriedades) com a exportação consolidada que o Notion não faz.

## Como usar

1. Abra o `index.html` no navegador (ou publique no GitHub Pages). Não precisa de servidor nem de instalação.
2. Crie entradas com **Nova entrada**. Cada entrada tem título, descrição e **blocos de conteúdo** versionados.
3. Marque **propriedades** (ex.: Tags, IA Utilizada) em cada bloco — ou selecione vários blocos e marque de uma vez.
4. **Exporte** tudo (ou uma seleção) em JSON, Markdown ou HTML/PDF. **Reimporte** o JSON ou o Markdown exportado.

Os dados ficam no `localStorage` do navegador (chave `base_v4`). Nada sai da sua máquina — por isso mesmo, **exporte o JSON de vez em quando**: limpar os dados do navegador apaga o acervo.

## Principais recursos (v13)

- **Tabela de entradas** com busca, ordenação e filtros por data e por propriedade.
- **Editor lateral** com largura ajustável (arraste a borda esquerda) e botão de tela inteira.
- **Blocos versionados**: sugestão automática de versão; trocar o número para um já ocupado no mesmo subtítulo renumera os vizinhos.
- **Propriedades por bloco**: o bloco é a fonte de verdade; a entrada é a união das opções dos seus blocos.
  - Clique esquerdo numa opção, com blocos selecionados, marca ou desmarca **em todos eles** (`✓` todos · `–` misto).
  - **Botão direito** liga a **adição automática** da opção a blocos novos.
- **Gestão de blocos**: quadrado de «selecionar todos» que respeita o filtro, reordenar em grupo, duplicar, excluir, mover/copiar entre entradas, filtro interno (subtítulo, versão, propriedade; E/OU).
- **Caixas de texto** que crescem com o conteúdo (Auto) ou com tamanho fixo (P · M · G), por caixa ou para todos os blocos.
- **Desfazer/Refazer** (`Ctrl+Z` / `Ctrl+Y`) das operações estruturais do editor.
- **Exportação**: JSON (backup completo), Markdown (bem identificado, com frontmatter YAML opcional para Obsidian), HTML/PDF.
- **Importação**: JSON (mesclar ou substituir) e **Markdown exportado pelo app** — com prévia, só mescla, e escolha entre pular ou copiar o que já existe.

## Stack

HTML + CSS + JavaScript vanilla, sem build e sem dependências. Fontes IBM Plex (Google Fonts). A escolha do arquivo único é deliberada: portabilidade total, zero setup, funciona offline.

## Estrutura do repositório

```
index.html               # a aplicação
favicon.png              # ícone
tests/                   # verificação em Node puro, sem dependências
  smoke.mjs              #   export Markdown, frontmatter e reimportação (ida e volta)
  history.mjs            #   desfazer/refazer, seleção, versões
  fixtures/              #   dados de teste hostis de propósito
meta/                    # documentação de contexto para desenvolvimento com IA
CLAUDE.md, .claude/      # orientação e comandos do Claude Code
logs/                    # log de cada dia de trabalho
```

## Verificação

```
node tests/smoke.mjs
node tests/history.mjs
```

Os dois saem com código `1` se algo falhar. Cobrem as funções puras; a interface se confere no navegador.

## Desenvolvimento

O projeto é desenvolvido em duas raias: o chat planeja e escreve **ordens de trabalho** (`meta/workorders/`), e o Claude Code as aplica, roda os testes e commita. As decisões ficam em `meta/DECISIONS.md` e o histórico de versões em `meta/CHANGELOG.md`.

---

> Nomes antigos do app: Synap / base / Nexus — daí a chave `base_v4`, que não muda para não perder os dados salvos. Nome atual: **Lunoda**.
