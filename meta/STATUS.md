# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão Atual

**Lunoda v13.1** — 2026-11-03 — quadrado geral de seleção respeitando o filtro e tamanho das caixas de texto (F4 concluída). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 39/39 (rodada da wo0003).

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
- Marcar propriedade nos blocos selecionados (uniformizar, `✓`/`–`) e botão direito para a adição automática (v13.0).
- Quadrado geral de seleção de blocos, que age nos visíveis e mostra os selecionados fora do filtro (v13.1).
- Tamanho das caixas de texto: Auto (padrão) · Mín · P · M · G, padrão pelo botão direito (v13.1).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.

## 🔧 Em Progresso

- **v13.1 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03. A v13.0 já foi conferida pelo autor (roteiro de 8 itens, todos ok).

## ❌ Quebrado / Com Problema

- Nenhum bug ativo conhecido no `index.html`.
- Os `.md` exportados **antes da v12.1** (inclusive `Lunoda - Blocos de notas.md`) ainda têm o defeito do FIX-002 — a correção não age retroativamente. Ver backlog.

## 📋 Backlog (curto prazo — itens acionáveis)

- [ ] **Reexportar os `.md` antigos** — abrir o `index.html`, exportar de novo em Markdown e substituir os arquivos gerados antes da v12.1.
- [ ] **Conferir o frontmatter no Obsidian** (nunca testado em navegador) — exportar UMA entrada pelo botão MD do editor, jogar num vault e ver as propriedades como campos; depois desmarcar o checkbox no modal e confirmar que volta ao Markdown simples.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; propriedades renderizadas no Obsidian.
- [ ] **Higiene do IDEAS** — ideias já implementadas (teto do `localStorage`, frontmatter, undo/redo) seguem também em «Ideias Ativas — Assistente», e três ideias ativas (reimportar `.md`, estender o smoke, exportar `.zip`) estão fora da seção delas (sob «Descartadas» e «Feedback para o Kit»). Curadoria por WO própria.
- [ ] **Conferir a v13.1 no navegador** (roteiro na conversa de 2026-11-03).
- [ ] **Projetar a F6 — empurrão de versão (DEC-015)** como WO. Alternativa: **F9 parte 2 — reimportar `.md`**.

## 💬 Última conversa

**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1, C2 e Q1 (DEC-013/014/015); entregue a **v13.0** (wo0002, `49c087e`), conferida no navegador. Desenhados e entregues o quadrado geral de seleção (DEC-016) e o tamanho das caixas (DEC-017): **v13.1** pela wo0003.

**Próximo passo óbvio:** conferir a v13.1 no navegador; depois F6 ou F9 parte 2.
