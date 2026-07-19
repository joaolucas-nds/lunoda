# ROADMAP.md — Plano Intencional de Evolução

> **Opcional.** Use quando o projeto tem um plano em fases — não para tarefas soltas (isso é o Backlog do STATUS) nem para brainstorm (isso é o IDEAS).
> Cada fase tem um objetivo e um critério de conclusão. Marque o estado: 🟢 concluída · 🟡 em curso/próxima · 🔵 futura · 🚫 descartada.
> Médio e longo prazo vivem AQUI, não no STATUS.

---

## 🟢 F1 — Base do app (captura + exportação única) *(concluída)*
**Objetivo:** capturar interações em blocos organizados e exportar tudo num único arquivo reimportável.
**Critério de conclusão:** editor funcional, tabela, exportação JSON/MD/HTML, importação.
- Entregue até a v10 (Synap).

## 🟢 F2 — Propriedades por bloco bem identificadas *(concluída)*
**Objetivo:** cada bloco marcado explicitamente com o nome de cada opção; entrada calculada dos blocos; exportação identificando tudo.
**Critério de conclusão:** modelo bloco-como-fonte-de-verdade + herança por flag + MD rico.
- Entregue na v11 (ver DEC-003). Inclui restauração do filtro por data e novo filtro por propriedade (FIX-001).

## 🟢 F3 — Gestão de blocos (seleção, massa, transferência, filtro interno) *(concluída)*
**Objetivo:** manipular blocos em massa dentro e entre entradas.
**Critério de conclusão:** seleção, reordenar em grupo, duplicar, excluir, mover/copiar para entrada existente/nova, filtro interno E/OU.
- Entregue na v12 (ver DEC-004, DEC-005).

## 🟡 F4 — UX de propriedades avançada + conforto de edição *(próxima — depende de decisão)*
**Objetivo:** tornar a marcação de propriedades mais rápida (seleção em massa, botões do mouse) e a edição de texto mais confortável (tamanho das caixas).
**Critério de conclusão:** a definir junto com o escopo da v13.
- [ ] Propriedades em blocos selecionados (inverter posse) — depende de resolver conflito C1 (IDEAS).
- [ ] Controles de tamanho / autosize das caixas de texto.
- [ ] Ações por botão do mouse (esq/meio/dir) — depende de resolver C2 (IDEAS).
> Antes de projetar o guia da v13, fechar os conflitos C1–C2 e a questão Q1 listados no IDEAS.

## 🔵 F5 — Herança entre versões de um mesmo nome de bloco *(futuro, sem data)*
**Objetivo:** propagar/travar propriedades entre todas as versões de um mesmo subtítulo (a "herança" antiga, agora restrita a versões).
- Maior risco de complexidade (conflito C3 no IDEAS). Tratar isolada, com protótipo antes de integrar.

## 🔵 F6 — Reordenação por número de versão *(futuro, sem data)*
**Objetivo:** mudar o número de versão de um bloco empurrando os demais.
- Depende de resolver a questão Q1 (duas versões selecionadas).

## 🔵 F7 — Melhorias adiadas da v12 *(futuro, sem data)*
- Drag-and-drop de blocos (alternativa ao mover por botões).
- Exportar apenas os blocos selecionados (MD/HTML) com header da entrada pai.
- Histórico de versões de bloco (snapshots + diff).
- Entrada favorita/fixada; cor de entrada na tabela.

## 🟢 F8 — Rede de segurança *(concluída — v12.1 e v12.2)*
**Objetivo:** proteger o acervo antes de aumentar o poder de destruição da ferramenta.
**Critério de conclusão:** o usuário não consegue perder trabalho por acidente nem por limite de armazenamento silencioso.
- [x] Aviso ao passar de ~80% do teto (~5 MB) — `warnIfStorageTight()`, v12.1.
- [x] `try/catch` de `QuotaExceededError` no salvamento, com mensagem acionável — v12.1.
- [x] `navigator.storage.persist()` — `requestPersistence()`, v12.1.
- [x] Undo/redo no editor (Ctrl+Z / Ctrl+Y) sobre snapshots do estado — v12.2, ver DEC-010.
> Fase fechada. O acervo agora está protegido contra os dois modos de perda que existiam: estouro silencioso de armazenamento e exclusão em massa sem volta.

## 🔵 F9 — Interoperabilidade do export *(futuro — pré-requisito já entregue)*
**Objetivo:** o arquivo exportado deixar de ser só legível e passar a ser **importável por outras ferramentas**.
- [ ] Markdown com **YAML frontmatter** (`title`, `id`, `created`, `updated`, `blocks`, propriedades como listas) — padrão lido por Obsidian, Hugo, Jekyll.
- [ ] Seletor "MD simples / MD com frontmatter" na exportação, para não impor o formato.
- [ ] (Avaliar) exportar uma entrada por arquivo, além do arquivo único — para quem quiser jogar num vault.
- [ ] Reimportar `.md` (hoje só o JSON reimporta) — viável agora que o conteúdo é delimitado (DEC-008).
> Cumpre o objetivo fundador do projeto ("exportar bem identificado") num nível que hoje só existe para olho humano. A delimitação do conteúdo (v12.1) era o pré-requisito estrutural.

## 🔵 F10 — Navegação em acervo grande *(futuro)*
**Objetivo:** manter a ferramenta usável quando houver centenas de entradas.
- [ ] Busca full-text no conteúdo dos blocos, com destaque do trecho.
- [ ] Atalhos de teclado (novo bloco, navegar entre blocos, foco na busca, fechar editor).

## 🔵 F11 — Migração para IndexedDB *(futuro, condicionada)*
**Objetivo:** remover o teto de ~5 MB do `localStorage`.
**Gatilho:** só iniciar quando o indicador da F8 mostrar uso real perto do teto — não antes.
- Muda `save`/`load` para assíncrono; é a mudança estrutural mais séria já cogitada. Exige plano de migração e backup obrigatório antes.

---

## 🚫 Itens descartados desta visão
- **Modelo Todos/Custom/Nenhum por opção** — fora de escopo, substituído pela herança por flag (ver IDEAS/Descartadas e DEC-003).
