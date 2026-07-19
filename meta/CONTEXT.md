# CONTEXT.md — Lunoda

> Arquivo **estável**. O assistente lê no início de cada sessão para se ambientar.
> Muda pouco: só em alteração estrutural (stack, arquitetura, escopo, nova armadilha descoberta).
> Mantenha enxuto — descreve o que o projeto É, não o que está acontecendo agora (isso é o STATUS).

---

## Visão

**Lunoda** é uma ferramenta pessoal, offline, para capturar e organizar interações (principalmente conversas com IAs) de forma rápida e visual, com **exportação de tudo num único arquivo** bem identificado (JSON, Markdown e HTML/PDF).

O problema que resolve: o Google Docs gera um arquivo único mas é trabalhoso de percorrer e exige formatação manual; o Notion é rápido de organizar (banco de dados + páginas + propriedades) mas **não exporta tudo num só arquivo**. Lunoda junta os dois lados — a organização visual estilo Notion (tabela + propriedades) com a exportação consolidada e reimportável.

Público: uso próprio do autor. Sem multiusuário, sem servidor, sem nuvem.

## Stack

- **Arquivo único `.html`** — HTML + CSS + JavaScript vanilla, sem build, sem dependências, sem framework.
- Persistência local via **`localStorage`** (chave `base_v4`).
- Fonte web: IBM Plex Sans / IBM Plex Mono (Google Fonts).
- Hospedado no **GitHub** (upload por arrastar arquivo). Favicon `favicon.png` na raiz do repositório.
- Roda direto no navegador, offline. Não precisa de servidor.

> **Por que arquivo único:** portabilidade total, zero setup, funciona offline, fácil versionar e subir no GitHub. Um framework + backend só se justificaria com colaboração em tempo real ou datasets de 10.000+ entradas — não é o caso.

## O que o Lunoda deliberadamente NÃO é

Delimitar isto evita retrabalho e propostas fora de escopo:
- **Não é multiusuário nem colaborativo.** Sem servidor, sem contas, sem edição simultânea.
- **Não é nuvem.** Os dados vivem no navegador do usuário; sincronização entre máquinas é feita **manualmente** via export/import de JSON.
- **Não é um editor de texto rico.** Conteúdo é texto puro; sem WYSIWYG, sem negrito/itálico por botão.
- **Não é um substituto de Notion/Obsidian.** É uma ferramenta pessoal focada em capturar interações com IAs e exportar tudo num arquivo só.
- **Não busca escala.** Milhares de entradas não são meta; o teto prático é o do `localStorage` (~5 MB — ver armadilhas).

## Estrutura do projeto

```
/
├── index.html               # a aplicação (versão canônica)
├── favicon.png              # ícone
├── README.md                # README do produto (público)
├── CLAUDE.md                # orientação para o Claude Code
├── .gitignore
├── .flatdropignore          # enxuga o que sobe ao Projeto do Claude
├── INSTRUCOES-DO-PROJETO.md # instruções lidas em toda mensagem
├── meta/                    # sistema de documentação de contexto
│   ├── CEREBRO.md           # comportamento do assistente
│   ├── CONTEXT.md           # este arquivo
│   ├── STATUS.md            # o agora (rolante)
│   ├── DECISIONS.md         # DEC / FIX
│   ├── CHANGELOG.md         # versões entregues
│   ├── IDEAS.md             # segundo cérebro
│   ├── ROADMAP.md           # fases
│   ├── GLOSSARY.md          # termos
│   ├── HISTORY.md           # conhecimento consolidado
│   └── LOG-TEMPLATE.md      # molde do log
├── meta/ASU/                # Atualizador Automático de Scripts
├── tests/                   # smoke em Node puro (ver DEC-009)
│   ├── smoke.mjs
│   └── fixtures/sample-db.json
├── logs/                    # logs de sessão (AAAA-MM-DD.md)
└── guides/                  # guias de versão (lunoda_vN_guide.md)
```

> Os docs de contexto ficam em **`meta/`** (padrão do kit). O `README.md` da raiz é o do produto — se um dia houver um README dentro de `meta/`, é outro arquivo, explicando o sistema de documentação.

## Modelo de dados

O `db` tem duas coleções: `properties` e `entries`.

```
db = {
  properties: [
    { id, name, options: [ { id, name, colorId } ] }
  ],
  entries: [
    {
      id, title, description,
      propertyValues:    { propId: [optId, ...] },   // CALCULADO: union das opções de todos os blocos
      propertyAutoFlags: { propId: [optId, ...] },   // opções com "adição automática a novos blocos" ligada
      blocks: [
        { id, subtitle, version, content,
          blockProps: { propId: [optId, ...] } }      // propriedades marcadas NAQUELE bloco
      ],
      createdAt, updatedAt
    }
  ]
}
```

**Conceito-chave — o bloco é a fonte de verdade das propriedades:**
- Cada bloco carrega suas próprias opções em `blockProps`.
- As propriedades da ENTRADA (`propertyValues`) são **calculadas** como a união (sem repetição) das opções de todos os seus blocos, no momento de salvar (`calcPropertyValues`).
- `propertyAutoFlags` não marca nada nos blocos existentes: apenas indica quais opções serão **adicionadas automaticamente a blocos NOVOS** quando criados.

## Como as peças críticas funcionam

- **Editor (painel lateral):** título, descrição, propriedades da entrada, lista de blocos. Cada bloco tem subtítulo, versão, conteúdo, checkbox de seleção, barra de propriedades (`Props ▼`) e ações (duplicar / colapsar / remover).
- **Herança automática (`toggleEntryPropAuto`):** clicar numa opção no painel da entrada liga/desliga a flag `propertyAutoFlags`. Ligada = novos blocos nascem com essa opção. **Não altera blocos existentes.** Clicar no chip `●auto` dentro de um bloco (`disableAutoFromBlock`) remove a opção daquele bloco E desliga a flag na entrada.
- **Sugestão de versão:** ao digitar subtítulo do bloco, sugere `Nome vN+1` a partir dos subtítulos já usados na entrada e de uma lista de IAs comuns (`AI_HINTS`).
- **Seleção de blocos + ações em massa (interno ao editor):** checkbox por bloco → barra com Subir/Descer (move o grupo mantendo ordem relativa), Duplicar, Excluir, Mover para, Copiar para.
- **Transferência de blocos:** modal com 4 ações — mover/copiar para entrada existente ou nova. Todas salvam a entrada atual, executam e abrem a entrada destino.
- **Filtro interno de blocos:** por subtítulo, versão e propriedade+opções, com modo **E**/**OU** entre critérios. Só oculta (não remove de `editBlocks`).
- **Filtros da tabela:** por texto, por data (Criado/Alterado, com intervalo De/Até) e por propriedade+opções. Independentes entre si.
- **Exportação:** JSON (reimportável), Markdown (documento único; a partir da v12.1 a descrição é citada linha a linha e o conteúdo de cada bloco vai entre `<!-- CONTEUDO:INICIO/FIM -->`, de modo que texto livre não se confunda com a estrutura — ver DEC-008/FIX-002; blocos e metadados bem identificados com `**ID:**`, `**Criado em:**`, `**Tags:**`, divisores `━━━`) e HTML (abrível/imprimível como PDF). Exporta tudo, seleção em massa, ou entrada única.
- **Importação (`handleImport`):** normaliza formatos antigos, migra `inheritProps`→`blockProps` e `propertyOptionModes`→`propertyAutoFlags` (via `migrateOptionModes`). Mesclar ou substituir.

## Armadilhas conhecidas

- **`STORAGE_KEY = 'base_v4'`** — a chave do localStorage é `base_v4`, não muda com a versão do app. Alterá-la faz o app "perder" os dados salvos do usuário. `loadDB` também tenta chaves legadas (`base_notas_v3`, etc.) para migração.
- **`editProps` legado** — a variável ainda existe no estado do editor mas **não é mais a fonte de verdade** da entrada; quem manda é `calcPropertyValues()` (union dos blocos). Não voltar a usá-la para decidir o que a entrada "tem".
- **Nunca deixar entrada com 0 blocos** — ao mover/excluir todos os blocos, o sistema recria um bloco vazio. Manter essa invariante.
- **CMD do Windows** — o autor usa Windows/CMD; comandos numa linha só, sem `\`, `-m` repetido no commit, mensagens de commit **sem acento** (o CMD corrompe).
- **`saveDB` pode falhar por cota** — desde a v12.1 ele **retorna `false`** e avisa em vez de estourar. Quem chamar em fluxo crítico deve considerar o retorno.
- **Prefixos de exportação** — arquivos exportados usam prefixo `base_` no nome (`base_backup_`, `base_notas_`, `base_selecionados_`) — resquício do nome antigo. Ver IDEAS (renomear para `lunoda_`).

## Produto / histórico de nomes

O app já se chamou **Synap** (guia v10) e **base**/**Nexus** em versões ainda mais antigas — daí `STORAGE_KEY='base_v4'`, prefixos `base_` e a chave legada `nexus_db_v4`. Nome atual definitivo: **Lunoda** (desde a v10/v11). Os arquivos de trabalho seguem nomeados `base_vN.html` no histórico de uploads, mas a versão canônica no Projeto é `Lunoda_v12.html`.

## Fluxo de desenvolvimento (peculiar — importante)

O desenvolvimento **não** é feito por edição direta do arquivo pelo assistente. O padrão é:
1. O autor descreve o que quer para a próxima versão.
2. O assistente analisa as versões, projeta, e **entrega um guia `.md` passo a passo** (blocos antigos a substituir + blocos novos completos, com âncoras exatas).
3. O autor **aplica manualmente** as mudanças e sobe a nova versão.

Isso está registrado como decisão (ver DECISIONS DEC-001). Os guias já produzidos: `synap_v10_guide.md` (v9→v10, por outra IA), `lunoda_v11_guide.md` (v10→v11), `lunoda_v12_guide.md` (v11→v12).
