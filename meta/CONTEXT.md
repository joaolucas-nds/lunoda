# CONTEXT.md — Lunoda

> Arquivo **estável**. O assistente lê ao abrir cada conversa para se ambientar.
> Muda pouco: só em alteração estrutural (stack, arquitetura, escopo, nova armadilha descoberta).
> Mantenha enxuto — descreve o que o projeto É, não o que está acontecendo agora (isso é o STATUS).

---

## Visão

**Lunoda** é uma ferramenta pessoal, offline, para capturar e organizar interações (principalmente conversas com IAs) de forma rápida e visual, com **exportação de tudo num único arquivo** bem identificado (JSON, Markdown e HTML/PDF).

O problema que resolve: o Google Docs gera um arquivo único mas é trabalhoso de percorrer e exige formatação manual; o Notion é rápido de organizar (banco de dados + páginas + propriedades) mas **não exporta tudo num só arquivo**. Lunoda junta os dois lados — a organização visual estilo Notion (tabela + propriedades) com a exportação consolidada e reimportável.

Público: uso próprio do autor. Sem multiusuário, sem servidor, sem nuvem.

## Stack

- **Arquivo único `.html`** — HTML + CSS + JavaScript vanilla, sem build, sem dependências, sem framework.
- Persistência local via **`localStorage`** (chave `base_v4`). Preferências de interface ficam em chaves próprias, fora do `db` (DEC-011): `lunoda_md_frontmatter`, `lunoda_ta_size` (padrão de tamanho das caixas, DEC-017) e `lunoda_editor_w` (largura do painel e maximizado, DEC-019).
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
├── CLAUDE.md                # guia raiz do Claude Code (lido em todo turno)
├── .claude/                 # settings.json (permissões) + skills/ (apply-wo, wrap, sondar)
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
│   ├── SPEC.md              # modelo de spec de feature (sob demanda)
│   ├── LOG-TEMPLATE.md      # molde do log
│   └── workorders/          # WOs do chat para o Code (AAMMDD-woNNNN-desc.md) + _TEMPLATE.md
├── tests/                   # smoke em Node puro (ver DEC-009)
│   ├── README.md            # como rodar e o que cobre
│   ├── smoke.mjs            # export + frontmatter YAML
│   ├── history.mjs          # undo/redo
│   └── fixtures/sample-db.json
└── logs/                    # log do dia (AAAA-MM-DD.md)
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
- **Herança automática (`toggleEntryPropAuto`):** **botão direito** numa opção (no painel da entrada ou no chip do bloco) liga/desliga a flag `propertyAutoFlags` (DEC-014). Ligada = novos blocos nascem com essa opção. **Não altera blocos existentes.** Clicar no chip `●auto` dentro de um bloco (`disableAutoFromBlock`) remove a opção daquele bloco E desliga a flag na entrada.
- **Marcar nos selecionados (`onEntryOptClick` → `applyPropToSelectedBlocks`):** com blocos selecionados, o clique esquerdo numa opção do painel da entrada **uniformiza** nos selecionados (DEC-013); sem seleção, só mostra um aviso. O painel acompanha a seleção (`updateBlockMassBar` chama `renderEditorProps`).
- **Quadrado geral (`toggleSelectAllVisibleBlocks`):** no cabeçalho da lista, age só sobre os blocos **visíveis** (`getFilteredBlocks()`); selecionados escondidos pelo filtro continuam selecionados e aparecem no contador («· K fora do filtro», `hiddenSelectedCount`). **Ações em massa agem em TODOS os selecionados, inclusive os escondidos** — o confirm do Excluir avisa (DEC-016).
- **Tamanho das caixas (`taApply` / `taFit`):** modo por caixa na sessão (`taSessionModes`, zera em `openEditor`) sobre um padrão por tipo no `localStorage`. Auto mede `scrollHeight`, então caixa escondida (filtrada, colapsada) não é medida: `renderBlocks` e `toggleCollapse` reaplicam (DEC-017). O controle geral do cabeçalho é a mesma barra com a chave `'all'` (`taToolbarHTML('all')`, DEC-020).
- **Largura do painel (`applyEditorWidth`):** o painel fecha por `transform`, não por `right` negativo — qualquer largura fica escondida. A alça (`#epResize`) e o maximizar gravam `{w, max}`; ao mudar a largura, `taRefreshAll` re-mede as caixas em Auto (DEC-019).
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
- **`.map(entryToMD)` passa o índice como 2º argumento** — um parâmetro opcional novo em `entryToMD` receberia `0, 1, 2…` em silêncio. Não acrescente parâmetro sem trocar os call sites (por isso o frontmatter é montado nos pontos de exportação, não dentro dela).
- **Texto livre interpolado em formato estruturado precisa de delimitador explícito** (FIX-002) — vale para descrição, conteúdo de bloco e qualquer campo novo no export.
- **Cor nova de texto: medir antes** — contraste ≥ 4,5:1 contra o `--surface2` (o fundo mais claro) e nada abaixo de 11px (DEC-018). Opacidade baixa num texto conta: `.48` sobre um chip já claro o derrubava para ilegível.
- **Prefixos de exportação** — arquivos exportados usam prefixo `base_` no nome (`base_backup_`, `base_notas_`, `base_selecionados_`) — resquício do nome antigo. Ver IDEAS (renomear para `lunoda_`).

## 📁 Arquivos Críticos (não mexer sem contexto)

| Arquivo | Por quê |
|---|---|
| `index.html` | É o produto inteiro. Não editar às cegas; ver as armadilhas acima. |
| `tests/smoke.mjs` | Verifica o export. Rode antes de fechar qualquer mudança em `entryToMD`. |
| `tests/history.mjs` | Verifica o undo/redo. Rode ao mexer nos mutadores estruturais ou na lista de embrulho. |
| `STORAGE_KEY = 'base_v4'` (dentro do HTML) | Renomear sem migração **apaga os dados do usuário**. |
| `calcPropertyValues()` / `blockProps` | Núcleo do modelo de propriedades (DEC-003). Mudança aqui afeta exportação e filtros. |
| `loadDB()` / `handleImport()` / `migrateOptionModes()` | Migração de formatos antigos. Quebrar aqui inutiliza backups antigos. |

## Produto / histórico de nomes

O app já se chamou **Synap** (guia v10) e **base**/**Nexus** em versões ainda mais antigas — daí `STORAGE_KEY='base_v4'`, prefixos `base_` e a chave legada `nexus_db_v4`. Nome atual definitivo: **Lunoda** (desde a v10/v11). Os arquivos de trabalho antigos aparecem como `base_vN.html` / `Lunoda_v12.html` no histórico de uploads; a versão canônica hoje é o `index.html` do repositório.

## Fluxo de desenvolvimento (duas raias — importante)

Desde 2026-11-03 o projeto trabalha com **duas raias** (ver DEC-012, que supera a DEC-002):
1. **Chat (planejamento)** — conversa com a pasta do projeto vinculada. Analisa, projeta e **autora**: grava inteiros os docs de curadoria (CEREBRO, CONTEXT, Instruções, GLOSSARY, análises) e escreve **WOs** em `meta/workorders/` para o resto. Git pelo chat é só leitura.
2. **Claude Code (execução)** — roda no repositório. Aplica a WO com `/apply-wo <arquivo>` (âncora exata, ou PARA e reporta), roda `node tests/smoke.mjs` e `node tests/history.mjs`, faz os appends em STATUS/DECISIONS/CHANGELOG, commita e empurra. Fecha a tarefa com `/wrap`.
3. O **autor** decide, cola a linha `/apply-wo` no Code e testa no navegador o que os testes não cobrem.

Histórico do fluxo: guia `.md` aplicado à mão (v10–v12, DEC-002) → instrução ASU em YAML (v12.1–v12.3) → WO + Claude Code (a partir de 2026-11-03). Os guias antigos (`synap_v10_guide.md`, `lunoda_v11_guide.md`, `lunoda_v12_guide.md`) não estão no repositório; o raciocínio deles sobrevive em DECISIONS e HISTORY.
