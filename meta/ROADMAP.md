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

## 🟢 F4 — UX de propriedades avançada + conforto de edição *(concluída — v13.0 e v13.1)*
**Objetivo:** tornar a marcação de propriedades mais rápida (seleção em massa, botões do mouse) e a edição de texto mais confortável (tamanho das caixas).
**Critério de conclusão:** marcação em massa e botão direito funcionando (parte 1) + caixas de texto com tamanho controlável (parte 2).
- [x] Propriedades em blocos selecionados — **uniformizar** (DEC-013), v13.0. Conferida no navegador pelo autor.
- [x] Botão direito = adição automática; esquerdo sem seleção só avisa (DEC-014), v13.0. O botão do meio fica com a F5.
- [x] Controles de tamanho / autosize das caixas de texto — parte 2 (DEC-017), v13.1.
- [x] Quadrado geral de seleção respeitando o filtro (DEC-016), v13.1 — pedido no caminho da F4.

## 🔵 F5 — Herança entre versões de um mesmo nome de bloco *(futuro, sem data)*
**Objetivo:** propagar/travar propriedades entre todas as versões de um mesmo subtítulo (a "herança" antiga, agora restrita a versões).
- Maior risco de complexidade (conflito C3 no IDEAS). Tratar isolada, com protótipo antes de integrar.
> **Adiada por decisão do autor (2026-11-04)** — gatilho em IDEAS, «Adiadas».

## 🟢 F6 — Reordenação por número de versão *(concluída — v13.3)*
**Objetivo:** mudar o número de versão de um bloco empurrando os demais.
- [x] Empurrão no campo de versão e nos −/+ (DEC-015, DEC-021), v13.3 — ignora a seleção, age só no grupo de mesmo subtítulo e só muda números, não posições.

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
- [x] Lembrete de backup JSON no topo, pelo que mudou desde o último backup — v13.5, ver DEC-023 (acrescentado depois de a fase fechar).
- [x] Testes do núcleo (carga, migração, importação e mescla do backup) e as duas correções que eles acharam — v13.5.1, ver FIX-004 e FIX-005.
> Fase fechada. O acervo agora está protegido contra os dois modos de perda que existiam: estouro silencioso de armazenamento e exclusão em massa sem volta.

## 🟡 F9 — Interoperabilidade do export *(partes 1 e 2 entregues — v12.3 e v13.4; resta o `.zip`)*
**Objetivo:** o arquivo exportado deixar de ser só legível e passar a ser **importável por outras ferramentas**.
- [x] Markdown com **YAML frontmatter** — v12.3, ver DEC-011.
- [x] Seletor "MD simples / MD com frontmatter" na exportação — v12.3.
- [ ] Exportar uma entrada por arquivo (`.zip`) — o que um vault realmente quer; esbarra no zero-dependência (ver IDEAS).
- [x] **Reimportar `.md`** — v13.4 (DEC-022): leitor pelos marcadores, linha `DADOS`, prévia, só mesclar.
> Cumpre o objetivo fundador do projeto ("exportar bem identificado") num nível que hoje só existe para olho humano. A delimitação do conteúdo (v12.1) era o pré-requisito estrutural.

## 🔵 F10 — Navegação em acervo grande *(futuro)*
**Objetivo:** manter a ferramenta usável quando houver centenas de entradas.
- [ ] Busca full-text no conteúdo dos blocos, com destaque do trecho.
- [ ] Atalhos de teclado (novo bloco, navegar entre blocos, foco na busca, fechar editor).

## 🔵 F11 — Migração para IndexedDB *(futuro, condicionada)*
**Objetivo:** remover o teto de ~5 MB do `localStorage`.
**Gatilho:** só iniciar quando o indicador da F8 mostrar uso real perto do teto — não antes.
- Muda `save`/`load` para assíncrono; é a mudança estrutural mais séria já cogitada. Exige plano de migração e backup obrigatório antes.

## 🟢 F12 — Legibilidade e ergonomia do editor *(concluída — v13.2)*
**Objetivo:** a interface nítida e confortável em telas de uso real.
**Critério de conclusão:** texto secundário ≥ 4,5:1, nada abaixo de 11px, painel com largura ajustável, controle geral das caixas.
- [x] Contraste WCAG AA e piso de 11px (DEC-018).
- [x] Painel ajustável + maximizar (DEC-019).
- [x] Controle geral «Caixas» (DEC-020).
> Ordem combinada com o autor: esta fase, depois F6, depois F9 parte 2.

---

## 🚫 Itens descartados desta visão
- **Modelo Todos/Custom/Nenhum por opção** — fora de escopo, substituído pela herança por flag (ver IDEAS/Descartadas e DEC-003).
