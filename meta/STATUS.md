# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log do dia.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão Atual

**Lunoda v13.6** — 2026-11-06 — busca sem acento com trecho, atalhos de teclado e arrastar para importar (DEC-024). Arquivo canônico `index.html`. Testes: `smoke` 101/101 e `history` 52/52 (rodada da wo0010).

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
- Atalhos `/` `N` `P` `?` fora de campo; `Alt+↓/↑` e `Alt+Enter` no editor; lista no botão `?` (v13.6).
- Arrastar `.json`/`.md` para a janela importa (v13.6).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.

## 🔧 Em Progresso

- **v13.6 aplicada pela wo0010; falta a conferência no navegador** — roteiro na conversa de 2026-11-06. v13.0 a v13.5.1 já conferidas pelo autor.

## ❌ Quebrado / Com Problema

- Nenhum bug ativo conhecido no `index.html`.
- Os `.md` exportados **antes da v12.1** (inclusive `Lunoda - Blocos de notas.md`) ainda têm o defeito do FIX-002 — a correção não age retroativamente. Ver backlog.

## 📋 Backlog (curto prazo — itens acionáveis)

- [ ] **Reexportar os `.md` antigos** — abrir o `index.html`, exportar de novo em Markdown e substituir os arquivos gerados antes da v12.1.
- [ ] **Conferir o frontmatter no Obsidian** (nunca testado em navegador) — exportar UMA entrada pelo botão MD do editor, jogar num vault e ver as propriedades como campos; depois desmarcar o checkbox no modal e confirmar que volta ao Markdown simples.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; propriedades renderizadas no Obsidian.
- [ ] **Conferir a v13.6 no navegador** (roteiro na conversa de 2026-11-06) — em especial `Alt+↓/↑` e `Alt+Enter` no Chrome do Windows, que o Chromium do container não reproduz.

## 💬 Última conversa

**2026-11-06** — v13.5 conferida pelo autor. Frente escolhida: testes do núcleo. Entregues 26 asserções no smoke e duas correções que elas acharam (FIX-004: entrada sem blocos; FIX-005: mescla perdia opções), como **v13.5.1** pela wo0009. Achado registrado sem corrigir: `base_v4` ilegível cai para a chave legada (IDEAS). Depois: v13.5.1 conferida; análise da F10 medida (a busca já alcançava o conteúdo; `Ctrl+N` morto; `P` capturando `Ctrl+P`) e decidida com o autor (1a, 2a, 3a, 4a); entregue como **v13.6** pela wo0010 (DEC-024).

**Próximo passo óbvio:** conferir a v13.6 no navegador; depois escolher a próxima frente (F9 `.zip`, a ideia da `base_v4` ilegível, ou as pendências do autor no backlog).
