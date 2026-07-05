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

## 🟡 F4 — UX de propriedades avançada + conforto de edição *(próxima)*
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

---

## 🚫 Itens descartados desta visão
- **Modelo Todos/Custom/Nenhum por opção** — fora de escopo, substituído pela herança por flag (ver IDEAS/Descartadas e DEC-003).
