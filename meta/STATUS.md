# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão Atual

**Lunoda v13.8** — 2026-11-10 — exportar só os blocos selecionados (MD/HTML) e chave `base_v4` ilegível guardada, sem cair para a legada (DEC-026). Arquivo canônico `index.html`. Testes: `smoke` 124/124 e `history` 52/52 (rodada da wo0014).

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
- Exportar só os blocos selecionados em MD ou HTML, com o cabeçalho da entrada (v13.8).
- `base_v4` ilegível: cópia do texto em `base_v4_ilegivel_…`, sem cair para a chave legada, aviso ao abrir com opção de baixar (v13.8).
- Atalhos `/` `N` `P` `?` fora de campo; `Alt+↓/↑` e `Alt+Enter` no editor; lista no botão `?` (v13.6).
- Arrastar `.json`/`.md` para a janela importa (v13.6).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.

## 🔧 Em Progresso

- Nada em andamento. **v13.0 a v13.8 conferidas pelo autor** (v13.8 em 2026-11-10 [relatado pelo dono]). A próxima frente não foi decidida — opções na conversa de 2026-11-10 (`logs/2026-11-10.md`).

## ❌ Quebrado / Com Problema

- Nenhum bug ativo conhecido no `index.html`.
- Os `.md` exportados **antes da v12.1** (inclusive `Lunoda - Blocos de notas.md`) ainda têm o defeito do FIX-002 — a correção não age retroativamente. Ver backlog.

## 📋 Backlog (curto prazo — itens acionáveis)

- [ ] **Reexportar os `.md` antigos** — abrir o `index.html`, exportar de novo em Markdown e substituir os arquivos gerados antes da v12.1.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; barra de seleção de blocos com MD e HTML.
- [ ] **Escolher a próxima frente** — E (arrastar blocos) ou outro item da F7 (entrada favorita/fixada, cor da entrada, histórico de versões de bloco); opções em `logs/2026-11-10.md`. Obsidian e `.zip` adiados pelo autor (IDEAS, «Adiadas»).

## 💬 Última conversa

**2026-11-10** — wo0013 conferida (`42cc085`). O autor escolheu as frentes D e C juntas: entregue a v13.8 (wo0014, DEC-026, commit `37cd070`) e **roteiro v13.8 todo ok** [relatado pelo dono]. O autor **adiou o Obsidian e a B** (`.zip`) até precisar ou dominar o Obsidian; o passo a passo da conferência ficou no log do dia.

**Próximo passo óbvio:** escolher a próxima frente (E ou outro item da F7; `logs/2026-11-10.md`).
