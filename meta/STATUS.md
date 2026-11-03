# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão Atual

**Lunoda v12.3** — 2026-07-19 — frontmatter YAML no export Markdown. Aplicada e commitada (`0699b26`). Arquivo canônico `index.html` (~3.084 linhas). Testes: `smoke` 28/28 e `history` 18/18 na última rodada registrada (2026-07-19).

## ✅ Funcionando

- Tabela de entradas com ordenação, seleção em massa e ações (exportar JSON/MD, excluir).
- Editor lateral: título, descrição, propriedades, blocos.
- Sistema de propriedades por bloco com herança automática **só para novos blocos** (v12).
- Chip `●auto` clicável dentro do bloco (remove do bloco + desliga flag na entrada).
- Seleção interna de blocos + barra de ações (Subir/Descer em grupo, Duplicar, Excluir, Mover para, Copiar para).
- Duplicar bloco individual; transferência/cópia de blocos para entrada existente ou nova (4 modos).
- Filtro interno de blocos (subtítulo, versão, propriedade+opções) com modo E/OU.
- Filtros da tabela: texto, data (Criado/Alterado, De/Até) e propriedade — independentes.
- Exportação JSON / Markdown (conteúdo delimitado, v12.1; frontmatter YAML opcional, v12.3) / HTML-PDF; importação com migração de formatos antigos.
- Rede de segurança: tratamento de cota no `saveDB`, `persist()`, aviso aos 80% (v12.1); undo/redo estrutural (v12.2).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.

## 🔧 Em Progresso

- **Migração do processo para o KCM v1.133.0, modo Code** (2026-11-03). Docs de curadoria já gravados pelo chat; falta o Code aplicar `meta/workorders/261103-wo0001-kcm-v1133-modo-code.md` (DECISIONS, CHANGELOG, IDEAS, ROADMAP, HISTORY + commit da migração inteira).

## ❌ Quebrado / Com Problema

- Nenhum bug ativo conhecido no `index.html`.
- Os `.md` exportados **antes da v12.1** (inclusive `Lunoda - Blocos de notas.md`) ainda têm o defeito do FIX-002 — a correção não age retroativamente. Ver backlog.

## 📋 Backlog (curto prazo — itens acionáveis)

- [ ] **Reexportar os `.md` antigos** — abrir o `index.html`, exportar de novo em Markdown e substituir os arquivos gerados antes da v12.1.
- [ ] **Conferir o frontmatter no Obsidian** (nunca testado em navegador) — exportar UMA entrada pelo botão MD do editor, jogar num vault e ver as propriedades como campos; depois desmarcar o checkbox no modal e confirmar que volta ao Markdown simples.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; propriedades renderizadas no Obsidian.
- [ ] **Higiene do IDEAS** — ideias já implementadas (teto do `localStorage`, frontmatter, undo/redo) seguem também em «Ideias Ativas — Assistente», e três ideias ativas (reimportar `.md`, estender o smoke, exportar `.zip`) estão fora da seção delas (sob «Descartadas» e «Feedback para o Kit»). Curadoria por WO própria.
- [ ] **Decidir C1, C2 e Q1** (IDEAS, «Análise de conflitos») e então projetar a **F4** como WO. Alternativa se não quiser decidir agora: **F9 parte 2 — reimportar `.md`**.

## 💬 Última conversa

**2026-11-03** — Aplicado o template-update do KCM v1.133.0: troca ASU → Code (DEC-012). Criados `.claude/` (settings + skills `apply-wo`, `wrap`, `sondar`), `CLAUDE.md` novo, `meta/SPEC.md` e `meta/workorders/`; CEREBRO e Instruções refeitos sobre a base nova; legado do ASU e os `CLAUDE.md` antigos movidos para `..\_para-excluir\`. Nenhuma mudança no `index.html`.

**Próximo passo óbvio:** aplicar a wo0001 no Code; depois colar as Instruções novas no painel do Projeto e decidir C1/C2/Q1.
