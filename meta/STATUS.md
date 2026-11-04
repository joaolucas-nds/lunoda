# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão Atual

**Lunoda v13.4.1** — 2026-11-04 — reimportar o Markdown exportado (F9 parte 2) + faxina (prefixos `lunoda_`, README). Arquivo canônico `index.html`. Testes: `smoke` 46/46 e `history` 52/52 (rodada da wo0007).

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
- Painel do editor com largura ajustável (alça) e maximizar; largura lembrada (v13.2).
- Controle geral «Caixas: Auto · P · M · G» no cabeçalho dos blocos (v13.2).
- Texto secundário com contraste ≥ 4,5:1 e nada abaixo de 11px (v13.2).
- Empurrão de versão: número ocupado no mesmo subtítulo renumera os vizinhos; −/+ troca; coberto pelo undo (v13.3).
- Importar `.md` exportado pelo app: prévia, só mescla, pular ou copiar o que já existe; recusa exports pré-v12.1 (v13.4).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.

## 🔧 Em Progresso

- **v13.4 e v13.4.1 aplicadas (`8274e0c`, `d779c80`); falta a conferência no navegador** — roteiro na conversa de 2026-11-04; na v13.4.1, conferir o nome `lunoda_backup_AAAA-MM-DD.json` ao exportar. v13.0 a v13.3 já conferidas pelo autor.

## ❌ Quebrado / Com Problema

- Nenhum bug ativo conhecido no `index.html`.
- Os `.md` exportados **antes da v12.1** (inclusive `Lunoda - Blocos de notas.md`) ainda têm o defeito do FIX-002 — a correção não age retroativamente. Ver backlog.

## 📋 Backlog (curto prazo — itens acionáveis)

- [ ] **Reexportar os `.md` antigos** — abrir o `index.html`, exportar de novo em Markdown e substituir os arquivos gerados antes da v12.1.
- [ ] **Conferir o frontmatter no Obsidian** (nunca testado em navegador) — exportar UMA entrada pelo botão MD do editor, jogar num vault e ver as propriedades como campos; depois desmarcar o checkbox no modal e confirmar que volta ao Markdown simples.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; propriedades renderizadas no Obsidian.
- [ ] **Conferir a v13.4 e a v13.4.1 no navegador** (roteiro na conversa de 2026-11-04).
- [ ] **Colar `INSTRUCOES-DO-PROJETO.md` no painel do Projeto** (arquivo novo, versionado em `d779c80`).
- [ ] **Lembrete de backup JSON** — «último backup há N dias» + botão rápido (IDEAS, 2026-11-04).

## 💬 Última conversa

**2026-11-04** — v13.2 e v13.3 conferidas pelo autor. Entregue a F6 (empurrão de versão, DEC-021) como v13.3 (`e40b37a`). Análise da F9 parte 2 medida e decidida (opção B, DEC-022); entregue como **v13.4** pela wo0006 (`8274e0c`); faxina (prefixos `lunoda_`, README, ROADMAP, IDEAS) como **v13.4.1** pela wo0007 (`d779c80`). F5 adiada pelo autor. Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03.

**Próximo passo óbvio:** conferir a v13.4 no navegador; depois o lembrete de backup JSON.
