# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

---

## [Não lançado]

### Modificado
- **Processo: ASU → Claude Code com WO** (DEC-012). Sistema de documentação alinhado ao Kit de Contexto Universal **v1.133.0** (antes v1.74.0): CEREBRO e Instruções refeitos sobre a base nova; «Específico deste projeto» virou «Técnicas específicas deste projeto»; o CONTEXT recebeu os «Arquivos Críticos» (antes no STATUS) e o fluxo em duas raias.

### Adicionado
- `.claude/settings.json` e as skills `/apply-wo`, `/wrap` e `/sondar`; `CLAUDE.md` novo na raiz.
- `meta/SPEC.md` (modelo de spec de feature) e `meta/workorders/` com o modelo de WO.
- Sistema de documentação de contexto migrado para `meta/` e alinhado ao Kit de Contexto Universal v1.74.0 *(2026-07-19)*.
- `.flatdropignore` (enxuga o que sobe ao Projeto do Claude) *(2026-07-19; refeito na v1.133.0)*.
- Seção «Específico deste projeto (Lunoda)» no CEREBRO *(2026-07-19; hoje «Técnicas específicas»)*.

### Removido
- `meta/ASU/` e os dois `CLAUDE.md` antigos (raiz e `meta/`) — movidos para fora do repositório, não apagados.
- `meta/README.md` — era a versão nova do README dos testes no lugar errado; agora é `tests/README.md`.

> Nada aqui altera o `index.html` — são mudanças de documentação e processo.

## [13.5.0] — 2026-11-04

### Adicionado
- **Lembrete de backup JSON** (DEC-023): indicador no topo — «Backup em dia», «Backup há N dias», amarelo quando nunca houve backup ou quando há mudanças há 7 dias ou mais — e um clique baixa o backup JSON completo. Aviso uma vez por abertura quando atrasado.
- `tests/smoke.mjs` cobre o estado do lembrete (8 asserções novas, 54 no total).

### Modificado
- Na prévia do import de Markdown, quando não há nada a importar (arquivo recusado), o botão diz «Fechar» em vez de «Cancelar».

## [13.4.1] — 2026-11-04

### Modificado
- Arquivos exportados com prefixo **`lunoda_`** (`lunoda_backup_`, `lunoda_notas_`, `lunoda_selecionados_`) no lugar do antigo `base_`. A importação lê o conteúdo, não o nome: arquivos antigos seguem importando. A chave `base_v4` do `localStorage` não muda.
- `README.md` do produto atualizado para a v13 (estava na v12, com estrutura e fluxo antigos).

## [13.4.0] — 2026-11-04

### Adicionado
- **Reimportar o Markdown exportado** (F9 parte 2, DEC-022): o botão Importar aceita `.md`. Uma **prévia** mostra entradas, blocos, propriedades e opções novas e avisos antes de gravar; só mescla; entrada que já existe pode ser pulada ou importada como cópia. Exports anteriores à v12.1 são recusados com explicação.
- Linha `<!-- DADOS … -->` no Markdown exportado (invisível no render), com IDs e datas exatas para a reimportação.
- `tests/smoke.mjs` cobre a ida e volta do Markdown (18 asserções novas, 46 no total).

## [13.3.0] — 2026-11-04

### Adicionado
- **Empurrão de versão** (F6, DEC-015, DEC-021): trocar o número de versão de um bloco para um número já ocupado no mesmo subtítulo renumera os vizinhos (v5→v3 faz v3→v4 e v4→v5); os botões −/+ trocam com o vizinho. Só números mudam, a posição na lista fica. Um aviso diz quantas versões foram renumeradas. Coberto pelo undo — antes, mudar o número de versão não entrava no histórico.
- `tests/history.mjs` cobre o empurrão (13 asserções novas, 52 no total).

## [13.2.0] — 2026-11-03

### Adicionado
- **Painel do editor ajustável** (DEC-019): alça na borda esquerda para arrastar a largura (duplo clique volta ao original) e botão **maximizar/restaurar** no cabeçalho. A largura é lembrada.
- **Controle geral «Caixas: Auto · P · M · G»** no cabeçalho da lista de blocos (DEC-020): aplica a todos os blocos; botão direito torna padrão.

### Modificado
- **Legibilidade** (DEC-018): cores de texto secundário clareadas até o piso WCAG AA (`--text-muted` 1,7→4,6:1; `--text-dim` 3,9→6,5:1, no fundo mais claro), nada abaixo de 11px, botões pequenos maiores, opções não marcadas menos apagadas.
- O painel fecha por `transform` em vez de `right` negativo (necessário para a largura variável).

## [13.1.0] — 2026-11-03

### Adicionado
- **Quadrado geral de seleção de blocos** (DEC-016) no cabeçalho da lista: age sobre os blocos **visíveis** (respeita o filtro), com `–` no estado misto. O contador mostra quantos selecionados estão **fora do filtro**.
- **Tamanho das caixas de texto** (F4 parte 2, DEC-017): botões Auto · Mín · P · M · G na descrição e Auto · P · M · G nos blocos, ao passar o mouse. **Auto** (padrão) cresce com o texto, sem rolagem interna. Clique esquerdo ajusta só aquela caixa enquanto a entrada está aberta; botão direito torna o modo o padrão.
- `tests/history.mjs` cobre o quadrado geral com filtro (11 asserções novas, 39 no total).

### Modificado
- O confirm do Excluir em massa diz quantos dos blocos estão escondidos pelo filtro.

### Corrigido
- O confirm do Excluir em massa dizia «Não pode ser desfeito»; desde a v12.2 o `Ctrl+Z` desfaz. Texto corrigido.

## [13.0.0] — 2026-11-03

### Modificado
- **Clique nas opções de propriedade** (F4 parte 1, DEC-014). O **botão direito** liga/desliga a adição automática a novos blocos — no painel da entrada e nos chips do bloco. O **esquerdo sem blocos selecionados não age mais**: mostra um aviso curto com o caminho novo. *Muda a memória muscular: até a v12.3 o esquerdo ligava o automático.*

### Adicionado
- **Marcar propriedade nos blocos selecionados** (DEC-013): com blocos selecionados, o clique esquerdo numa opção do painel da entrada **uniformiza** — se todos os selecionados têm, remove de todos; senão, dá a todos. O painel mostra `✓` (todos têm) e `–` (misto). Coberto pelo undo.
- `tests/history.mjs` cobre a regra de uniformizar e o embrulho no undo (10 asserções novas, 28 no total).

### Corrigido
- O texto de ajuda do painel de propriedades dizia que ativar uma opção a adicionava «a todos os blocos existentes e futuros»; desde a v12 (DEC-004) só os NOVOS recebem. Texto refeito.
- Painéis de propriedade de bloco abertos não mostravam o `●auto` ao ligar o automático na entrada; agora são reconstruídos.

## [12.3.0] — 2026-07-19 *(aplicada — commit `0699b26`)*

### Adicionado
- **Frontmatter YAML opcional na exportação Markdown** (F9 parte 1). Exportar uma entrada sozinha gera um `.md` com metadados legíveis por Obsidian, Hugo e afins; exportar várias gera um frontmatter de documento (origem, data, contagem) e cada entrada mantém seu bloco `<!-- ENTRADA -->`.
- Chaves YAML derivadas do nome da propriedade, sem acento e sem espaço ("IA Utilizada" → `ia_utilizada`; "Tags" → `tags`, campo especial do Obsidian).
- Colisão com chave reservada recebe sufixo (uma propriedade chamada "ID" não sobrescreve o `id` da entrada).
- Checkbox "Incluir frontmatter YAML" no modal de exportação, com preferência persistida em chave própria do `localStorage` — o formato do `db` não muda.
- `tests/smoke.mjs` cobre o frontmatter (15 asserções novas, 28 no total) e passou a entender literais de regex ao recortar funções.

## [12.2.0] — 2026-07-19 *(aplicada e verificada)*

### Adicionado
- **Undo/redo de operações estruturais no editor** (F8 parte 2, fase concluída). Cobre adicionar, remover, mover, duplicar e transferir blocos, e marcar propriedades — não a digitação, que continua com o desfazer nativo do navegador dentro de cada campo.
- Atalhos `Ctrl+Z`, `Ctrl+Y` e `Ctrl+Shift+Z`. Dentro de campo de texto o `Ctrl+Z` segue sendo o do navegador.
- Botões Desfazer/Refazer no cabeçalho do editor, esmaecidos quando não há o que fazer.
- Guarda da invariante do projeto: undo/redo **nunca** deixa a entrada com 0 blocos.
- `tests/history.mjs` — 18 asserções sobre o motor de histórico.

## [12.1.0] — 2026-07-19 *(aplicada e verificada)*

### Corrigido
- **FIX-002 — integridade do Markdown exportado.** Descrição multilinha agora tem `>` em **todas** as linhas: antes, da 2ª linha em diante o texto escapava da citação e uma linha iniciada por `#` ou `-` virava estrutura do documento.
- **FIX-002 — conteúdo de bloco sem delimitação.** O conteúdo agora vai entre `<!-- CONTEUDO:INICIO bloco=N -->` e `<!-- CONTEUDO:FIM bloco=N -->`, tornando possível separar conteúdo de estrutura mesmo quando o texto imita o formato do próprio export.

### Adicionado
- Marcador `<!-- BLOCO N -->` por bloco, par do `<!-- ENTRADA -->` já existente.
- `saveDB` trata `QuotaExceededError`: avisa em vez de perder a alteração em silêncio.
- `requestPersistence()` pede ao navegador para não expurgar os dados.
- `warnIfStorageTight()` avisa uma vez por sessão ao passar de ~80% do teto prático (~5 MB).
- `tests/smoke.mjs` — primeira verificação automática do projeto (Node puro, sem dependências).
- `CLAUDE.md` — orientação para o Claude Code, incluindo o sistema `meta/` e o KCM.

## [12.0.0] — 2026-07-05

### Adicionado
- Seleção interna de blocos no editor (checkbox por bloco) com barra de ações em massa.
- Reordenar blocos selecionados em grupo (Subir/Descer) preservando ordem relativa.
- Duplicar bloco individual e duplicar blocos selecionados.
- Excluir blocos selecionados em massa (mantendo a invariante de ≥1 bloco por entrada).
- Mover/copiar blocos para entrada existente ou nova (4 modos), com salvamento automático e abertura da entrada destino.
- Filtro interno de blocos por subtítulo, versão e propriedade+opções, com modo E/OU entre critérios.
- Botão de duplicar em cada bloco.

### Corrigido
- Herança automática de propriedades agora afeta só blocos novos, não os existentes (ver DEC-004).
- Chip `●auto` dentro do bloco tornou-se clicável: remove a opção do bloco e desliga a flag na entrada.

## [11.0.0] — 2026-04-30

### Adicionado
- Novo sistema de propriedades por bloco: cada bloco é a fonte de verdade; a entrada é calculada como união das opções dos blocos (ver DEC-003).
- Herança automática por flag (`propertyAutoFlags`) substituindo o modelo Todos/Custom/Nenhum.
- Filtro da tabela por propriedade + opções.
- Exportação Markdown com identificação rica (ID, datas, total de blocos, tags e propriedades por bloco, divisores).
- Favicon (`favicon.png`) e nome do app "Lunoda".

### Corrigido
- FIX-001: restaurado o botão "Datas" na toolbar (havia sido removido ao adicionar o filtro por propriedade). Filtros de data e propriedade agora independentes.

### Removido
- Modelo de modos por opção (Todos/Custom/Nenhum) da v10, substituído pela herança por flag.

## [10.0.0] — 2026-04-29 *(como "Synap", guia por outra IA)*

### Adicionado
- Sistema de propriedades por bloco com modos Todos/Custom/Nenhum (posteriormente substituído).
- Exportação Markdown com melhor identificação de subtítulos e blocos.
- Base do editor com blocos, versões e sugestões.

---

> **Nota histórica:** versões anteriores à v10 (Synap/base/Nexus v8–v9) não têm changelog formal — o projeto adotou este registro a partir da montagem do sistema de documentação (2026-07-05), reconstruindo v10–v12 a partir dos guias existentes. Detalhes densos das fases antigas, se necessário, vão para o HISTORY.md.
