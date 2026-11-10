# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão Atual

**Lunoda v13.7** — 2026-11-07 — busca por começo de palavra, `*` na frente para «em qualquer parte» e trecho ancorado na palavra mais longa (DEC-025). Arquivo canônico `index.html`. Testes: `smoke` 113/113 e `history` 52/52 (rodada da wo0012).

## ✅ Funcionando

- Tabela de entradas com ordenação, seleção em massa e ações (exportar JSON/MD, excluir).
- Editor lateral: título, descrição, propriedades, blocos.
- Sistema de propriedades por bloco com herança automática **só para novos blocos** (v12).
- Chip `●auto` clicável dentro do bloco (remove do bloco + desliga flag na entrada).
- Seleção interna de blocos + barra de ações (Subir/Descer em grupo, Duplicar, Excluir, Mover para, Copiar para).
- Duplicar bloco individual; transferência/cópia de blocos para entrada existente ou nova (4 modos).
- Filtro interno de blocos (texto no subtítulo e no conteúdo, versão, propriedade+opções) com modo E/OU.
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
- Lembrete de backup JSON no topo: em dia / há N dias / amarelo quando nunca ou atrasado; um clique baixa o backup (v13.5).
- Importar backup JSON: entrada sem blocos ganha um bloco vazio; mesclar traz as opções novas de propriedades existentes (v13.5.1).
- Busca sem acento e por palavras, com trecho destacado; abrir pela busca leva o termo ao filtro de blocos (v13.6).
- Busca por começo de palavra (`co` acha «conversa», não «acordo»); `*` na frente casa em qualquer parte; trecho ancorado na palavra mais longa, sem marca partida (v13.7).
- Atalhos `/` `N` `P` `?` fora de campo; `Alt+↓/↑` e `Alt+Enter` no editor; lista no botão `?` (v13.6).
- Arrastar `.json`/`.md` para a janela importa (v13.6).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.

## 🔧 Em Progresso

- Nada em andamento. **v13.0 a v13.7 conferidas pelo autor** (v13.7 em 2026-11-09 [relatado pelo dono]). A próxima frente não foi decidida — opções em `logs/2026-11-07.md` (B, C, D, E).

## ❌ Quebrado / Com Problema

- Nenhum bug ativo conhecido no `index.html`.
- Os `.md` exportados **antes da v12.1** (inclusive `Lunoda - Blocos de notas.md`) ainda têm o defeito do FIX-002 — a correção não age retroativamente. Ver backlog.

## 📋 Backlog (curto prazo — itens acionáveis)

- [ ] **Reexportar os `.md` antigos** — abrir o `index.html`, exportar de novo em Markdown e substituir os arquivos gerados antes da v12.1.
- [ ] **Conferir o frontmatter no Obsidian** (nunca testado em navegador) — exportar UMA entrada pelo botão MD do editor, jogar num vault e ver as propriedades como campos; depois desmarcar o checkbox no modal e confirmar que volta ao Markdown simples.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; propriedades renderizadas no Obsidian.
- [ ] **Escolher a próxima frente** — B (`.zip`, depende da conferência do frontmatter acima), C (`base_v4` ilegível), D (exportar só os blocos selecionados), E (arrastar blocos); detalhe em `logs/2026-11-07.md`.

## 💬 Última conversa

**2026-11-09** — wo0012 conferida (`3e88a60` + wrap `6a37cad`; smoke 113/0, history 52/0 no disco) e **roteiro v13.7 todo ok** [relatado pelo dono]. Antes, em 2026-11-07: frente A escolhida e a regra da busca decidida (DEC-025).

**Próximo passo óbvio:** escolher a próxima frente entre B, C, D e E (`logs/2026-11-07.md`).
