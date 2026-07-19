# IDEAS.md — Brainstorm e Visão

> **Segundo cérebro** do projeto. Captura TUDO que for mencionado, mesmo solto ou no meio de outro assunto.
> Nunca perde: ideia implementada vai para «Concluídas»; ideia recusada vai para «Descartadas» com o motivo.
> Separar por autor (você × assistente) ajuda a lembrar de onde veio cada coisa.

---

## 💡 Ideias Ativas — Usuário

### 2026-07 — Propriedades em blocos selecionados (inverter posse)
Quando **nenhum** bloco está selecionado, clicar numa propriedade funciona como hoje (liga/desliga a adição automática a novos blocos). Quando **há blocos selecionados**, clicar numa propriedade não mexe no automático — ela **adiciona/remove a propriedade nos blocos selecionados**. Com vários selecionados em estados mistos (uns têm, outros não), a ação **inverte a posse** de cada um: quem tinha perde, quem não tinha recebe.
> Fonte: `Lunoda_ideias.txt`. Depende de checkbox por bloco (já existe na v12). **Ver conflito C1 abaixo.**

### 2026-07 — Controles de tamanho das caixas de texto longo
Botões visuais perto de cada textarea (descrição e blocos) para: minimizar, tamanho pequeno, médio, longo. E um modo em que a caixa **cresce sozinha conforme as quebras de linha** (o bloco aumenta verticalmente sem barra de rolagem interna — a rolagem passa a ser a da entrada inteira). Motivação: o espaço fixo atual é irritante para textos longos.
> Fonte: `Lunoda_ideias.txt`. Viável (autosize de textarea é simples). Baixo risco.

### 2026-07 — Ações por botão do mouse na ativação de propriedades
Redefinir o comportamento de clique nas propriedades por botão:
- **Esquerdo:** o normal — marcar/desmarcar. Na entrada com blocos selecionados, marca/desmarca/inverte nos selecionados; sem seleção, "por enquanto não faz nada" (autor pediu sugestão).
- **Meio:** na entrada, sem função definida ainda. **No bloco**, ativa "herança entre versões" (ver ideia abaixo).
- **Direito:** liga/desliga a **adição automática a novos blocos** (aceende um círculo/risco na caixa da propriedade), tanto na entrada quanto no bloco — sem marcar/desmarcar a propriedade em bloco nenhum.
> Fonte: `Lunoda_ideias.txt`. **Ver conflitos C1 e C2 abaixo.** Envolve `contextmenu` (botão direito) e `auxclick`/mousedown botão 1 (meio); exige `preventDefault` do menu de contexto.

### 2026-07 — Herança de propriedade entre versões de um mesmo nome de bloco
O botão do **meio** do mouse numa propriedade define herança **entre todas as versões de um mesmo subtítulo** (nome do bloco). Exemplo: propriedade marcada na v1 mas não na v2/v3 — meio-clique na v2 desmarca nas 3 versões, trava o estado (esquerdo não marca mais, direito/automático é ignorado) e mantém desmarcado para versões futuras desse nome. Meio-clique de novo desliga a herança (as versões mantêm o último estado). Para marcar em todas e nas futuras: marca com o esquerdo em qualquer versão e aciona o meio para "propagar + herdar".
> Fonte: `Lunoda_ideias.txt`. É a antiga funcionalidade "herdar", agora restrita a versões de mesmo nome. **Ver conflito C3 (complexidade + estado por nome-de-bloco).**

### 2026-07 — Reordenação por número de versão empurrando as demais
Se há v1..v4 e cria-se v5, mudar o número de v5 para v3 empurra as existentes: v3→v4, v4→v5. Pergunta em aberto do autor: o que fazer se **duas versões diferentes** estiverem selecionadas ao tentar isso.
> Fonte: `Lunoda_ideias.txt`. **Ver questão aberta Q1.**

---

## 🤖 Ideias Ativas — Assistente

### 2026-07-05 — Renomear prefixos de exportação de `base_` para `lunoda_`
Os arquivos exportados ainda saem como `base_backup_`, `base_notas_`, `base_selecionados_` — resquício do nome antigo. Trocar para `lunoda_` deixa a saída coerente com o produto. Mudança trivial e isolada; não afeta importação (que lê o conteúdo, não o nome).

### 2026-07-05 — Migrar `STORAGE_KEY` com cuidado (ou deixar como está)
`STORAGE_KEY='base_v4'` destoa do nome. Renomear exige rotina de migração (ler chave antiga, gravar na nova) para não "perder" os dados do usuário. Custo-benefício baixo: talvez não valha mexer. Registrado para decisão consciente, não como pendência.

### 2026-07-05 — Sugestões de resolução dos conflitos das ideias da v13 (abaixo)
Ver seção «Análise de conflitos e questões abertas — v13».

---

### 2026-07-19 — Teto do `localStorage` (~5 MB): medir agora, migrar depois *(fundamentada em pesquisa)*
O `localStorage` é limitado a **~5 MB por origem** e estoura com `QuotaExceededError`; é síncrono e bloqueia a thread principal. O `IndexedDB` oferece de centenas de MB a vários GB (variando por navegador; Safari é o mais restrito e pode expurgar dados sob pressão de disco). Como o Lunoda guarda conteúdo de conversas inteiras, o teto é atingível.
**Proposta em três passos, do barato ao caro:**
1. **Medir e avisar** — `navigator.storage.estimate()` mostra uso/quota; exibir um indicador discreto e alertar acima de ~80%. Barato, resolve o pior cenário (perda silenciosa).
2. **Proteger o salvamento** — envolver o `save` em `try/catch` de `QuotaExceededError` com mensagem clara ("exporte um backup agora"), em vez de falhar em silêncio.
3. **Migrar para IndexedDB** — só quando o passo 1 mostrar que o uso real se aproxima do teto. Muda o `save/load` para assíncrono; é a mudança estrutural mais séria já cogitada no projeto.
> Também vale pedir `navigator.storage.persist()` para reduzir o risco de expurgo automático.

### 2026-07-19 — Exportar Markdown com YAML frontmatter *(fundamentada em pesquisa)*
Hoje o MD identifica os metadados em negrito (`**ID:**`, `**Tags:**`). Isso é ótimo para leitura humana, mas **nenhuma ferramenta lê como dado**. O padrão de fato para metadados em Markdown é o **YAML frontmatter** (bloco entre `---` no topo do arquivo), usado por Obsidian, Hugo, Jekyll e afins — e é o que torna as notas consultáveis (ex.: Dataview no Obsidian).
**Proposta:** manter o corpo como está e **acrescentar** um frontmatter no topo — `title`, `id`, `created`, `updated`, `blocks` e as propriedades como listas YAML. Custo baixo, ganho grande: o export deixa de ser só legível e passa a ser **importável por outras ferramentas**, o que reforça exatamente o objetivo original do projeto ("exportar bem identificado").
> Cuidado: manter os nomes de campo consistentes e escapar aspas — YAML inválido quebra o parse do outro lado. Um seletor "MD simples / MD com frontmatter" na hora de exportar evita forçar o formato em quem não quer.

### 2026-07-19 — Undo/redo no editor
Não há como desfazer uma exclusão de bloco ou uma ação em massa (a v12 trouxe excluir/mover/transferir em lote — o estrago possível cresceu). Uma pilha de snapshots do estado do editor (o `getEditorSnapshot()` já existe) com Ctrl+Z/Ctrl+Y cobriria o caso. Prioridade sobe junto com o poder das ações em massa.

### 2026-07-19 — Busca full-text dentro do conteúdo dos blocos
A busca da tabela hoje alcança título e metadados; conteúdo de bloco é onde está o volume real de texto. Uma busca que varra `content` e mostre o trecho com destaque tornaria o acervo navegável. Combina com o filtro interno de blocos já existente.

### 2026-07-19 — Atalhos de teclado
`Ctrl+S` já salva. Faltam: novo bloco, próximo/anterior bloco, foco na busca, fechar editor. Barato e melhora muito o uso diário.

---

## ⚠️ Análise de conflitos e questões abertas — v13
> O CEREBRO manda analisar antes de aceitar. Estas ideias novas se sobrepõem em alguns pontos; resolver antes de projetar o guia.

**C1 — "Clique esquerdo na propriedade com blocos selecionados" aparece em DUAS ideias com regras diferentes.**
Na ideia "inverter posse", o esquerdo com seleção inverte a posse por bloco. Na ideia "ações por botão do mouse", o esquerdo com seleção "marca/desmarca/inverte" — texto ambíguo (marca? desmarca? inverte?). *Sugestão:* adotar **inverter** como padrão do esquerdo-com-seleção (é o que a primeira ideia descreve em detalhe e cobre o caso misto). Unificar as duas descrições numa só regra.

**C2 — Botão direito duplica o comportamento que o esquerdo já tem hoje.**
Hoje o esquerdo na entrada (sem seleção) já liga/desliga o automático. A nova proposta move isso para o **direito** e deixa o esquerdo-sem-seleção "sem função". *Sugestão:* ou (a) manter esquerdo-sem-seleção = automático (como hoje) e não sobrecarregar o direito, ou (b) migrar de fato para o direito e dar ao esquerdo-sem-seleção uma função útil (ex.: abrir um mini-menu, ou nada). Precisa decisão — é troca de affordance que muda a memória muscular do autor.

**C3 — "Herança entre versões" reintroduz estado global por nome-de-bloco.**
É a funcionalidade "herdar" que já foi abandonada uma vez por ser confusa (DEC-003). Agora restrita a versões de mesmo subtítulo, mas ainda exige um novo lugar de estado (herança por "nome de bloco", não por bloco individual) e regras de trava (esquerdo não marca, direito é ignorado). *Sugestão:* tratar como fase própria da v13, isolada, com protótipo antes de integrar — é a de maior risco de complexidade das cinco.

**Q1 — Reordenar por número de versão com duas versões diferentes selecionadas.**
Pergunta do autor. *Sugestão do assistente:* nesse caso, **desabilitar** a edição direta do número (a operação "empurrar" só faz sentido para um bloco por vez); ou aplicar o empurrão na ordem em que aparecem, um após o outro — mas isso pode gerar resultado surpreendente. Mais seguro: permitir a reordenação-por-número só com **um** bloco selecionado/editado e avisar quando houver mais.

---

## ✅ Concluídas

- **Frontmatter YAML na exportação Markdown** — v12.3 / DEC-011. Fecha a parte 1 da F9.

- **Undo/redo estrutural no editor** — v12.2 / DEC-010. Fecha a F8.

- **Integridade do export MD (descrição citada + conteúdo delimitado)** — v12.1 / FIX-002, DEC-008. Era a raiz da queixa recorrente de "identificação" desde a v10.
- **Rede de segurança de armazenamento (cota, persistência, aviso de 80%)** — v12.1 / F8 parte 1.
- **Verificação automática mínima (smoke)** — v12.1 / DEC-009.
> Ideia que virou realidade. Mantida aqui para histórico (com referência à versão/decisão).

- **Exportar tudo num único arquivo bem identificado (JSON/MD/HTML)** — implementada; MD rico desde v11. Motivação original do projeto.
- **Propriedades por bloco com nomes explícitos das opções** — implementada em v11 / ver DEC-003.
- **Herança automática só para novos blocos** — implementada em v12 / ver DEC-004.
- **Chip `●auto` clicável no bloco** — implementada em v12 / ver DEC-004.
- **Seleção e ações em massa de blocos (mover, duplicar, excluir, transferir)** — implementada em v12 / ver DEC-005.
- **Filtro interno de blocos (subtítulo/versão/propriedade, E-OU)** — implementada em v12.
- **Filtro da tabela por propriedade + restauração do filtro por data** — implementada em v11 / ver FIX-001.
- **Duplicar bloco** — implementada em v12.
- **Checkbox por bloco** — implementada em v12 (a ideia "inverter posse" reaproveita esse checkbox).

---

## 🚫 Descartadas
> Ideia avaliada e recusada. O motivo evita reabrir a discussão depois.

- **Modelo Todos/Custom/Nenhum por opção (v10)** — descartado porque era complexo, pouco intuitivo e empilhava a UI verticalmente. Substituído pela herança por flag (DEC-003).
- **Herança opaca de propriedades (v9)** — descartada porque não identificava, na exportação, QUAL opção o bloco herdava. Substituída pelo modelo bloco-como-fonte-de-verdade (DEC-003).
- **Filtro/seleção/duplicação/transferência DENTRO das entradas na v11** — adiado à época por ser "avançado demais"; **depois implementado na v12**, então saiu de descartadas para concluídas.

---

### 2026-07-19 — Reimportar `.md` (não só JSON)
Com os delimitadores da DEC-008, o `.md` exportado passou a ser **parseável**: dá para reconstruir entradas, blocos e propriedades a partir dele. Hoje só o JSON reimporta. Seria a rede de segurança definitiva — o usuário poderia recuperar o acervo a partir do arquivo que ele de fato guarda e lê. Depende da F9 (frontmatter) para recuperar os metadados com fidelidade.

### 2026-07-19 — Estender o smoke conforme o risco crescer
O `tests/smoke.mjs` cobre só `entryToMD`. Candidatas naturais, por ordem de risco: `calcPropertyValues` (núcleo do modelo), `migrateOptionModes` e `loadDB` (migração de formatos antigos — quebrar ali inutiliza backups), `moveSelectedBlocks` (algoritmo com caso de borda). Todas são puras ou quase.

## 🛠 Feedback para o Kit
> Observações sobre o próprio sistema de documentação / kit de contexto.

### 2026-07-05 — Projeto chegou já em andamento (v12), documentação montada retroativamente
O sistema de docs foi criado com o projeto já na v12. CONTEXT/DECISIONS/CHANGELOG foram **reconstruídos a partir dos guias e do código no disco**, não acompanhados desde o início. Funcionou bem porque os guias `.md` das versões estavam preservados — reforça o valor de guardar os artefatos de cada versão. Datas antigas ficaram aproximadas (só a v12 tem data exata, 2026-07-05).

### 2026-07-05 — Desvio registrado: fluxo de "guia .md" em vez de ASU
Este projeto entrega mudanças como **guia `.md` passo a passo** (DEC-002), não como patch ASU nem arquivo `.html` inteiro. O CEREBRO menciona ASU para editar código; aqui a prática estabelecida é o guia. Mantido o fluxo do autor. Se no futuro o autor quiser, dá para migrar para ASU — mas hoje o guia é o que ele domina.

### 2026-07-19 — Template-update do KCM v1.74.0 recebido e comparado
Comparação feita item a item (relatório na sessão de 2026-07-19). O CEREBRO vivo era uma base genérica **anterior e sem versão**, sem nenhuma diretriz personalizada — por isso adotou-se a base do template e criou-se a seção «Específico deste projeto» (DEC-007). Docs migrados para `meta/` conforme o manifesto (DEC-006).
**Duas coisas que este projeto tem e o kit não previa** — candidatas a voltar para o kit:
- **Seção de conflitos no IDEAS** (`⚠️ Análise de conflitos e questões abertas`). O template do IDEAS só prevê ideias soltas; quando várias ideias chegam juntas e **se contradizem**, não há onde registrar a contradição — ela se perde e ressurge na sessão seguinte.
- **Seção de escopo negativo no CONTEXT** ("o que o projeto deliberadamente NÃO é"). O template tem «Contexto de Produto», mas não pede a delimitação negativa, que é o que mais corta proposta fora de escopo.

### 2026-07-19 — Erro meu, registrado: li a versão do kit errada
No primeiro relatório de comparação afirmei que o rodapé do CEREBRO do template dizia "v1.73.0"; a verificação direta mostrou **v1.74.0**, igual ao manifesto. Também supus que os docs ficavam na raiz sem reler o manifesto, que diz `meta/`. Lição: **conferir no arquivo, não no que a leitura anterior pareceu dizer** — vale especialmente para números de versão e caminhos.

### 2026-07-19 — Primeira instrução ASU do projeto: formato funcionou, uma observação
Gerada a `260719-asu0001.yaml` com `replace_context_block` (função inteira) e `replace_line_pattern` (linha única). Ambas as âncoras casaram exatamente uma vez, aplicadas numa cópia antes da entrega.
- **O que ajudou muito:** a regra §4.7 do `INSTRUCTION_GUIDE` (não ancorar em glifo não-ASCII). O `entryToMD` é cheio de `━`, `·`, `—` e acentos; ancorar em `function entryToMD(e) {` e `\n}\n\nfunction exportAllJSON() {` — ASCII puro — evitou o problema por completo.
- **Observação para o kit:** o guia recomenda edição cirúrgica, mas quando várias mudanças coordenadas caem na mesma função, substituir a função inteira via `replace_context_block` é mais seguro do que 3 patches pequenos com âncoras frágeis no meio de texto acentuado. Talvez valha o guia dizer isso explicitamente — hoje dá a entender que "menor é sempre melhor".
- **Sugestão de fluxo:** aplicar a instrução numa cópia e rodar a verificação antes de entregar. Pegou 5 defeitos reais aqui e custou pouco.

### 2026-07-19 — O teste pegou a fixture, não o código (e isso é bom sinal)
Ao testar o undo/redo, a asserção "mutação nova limpa o redo" falhou. A causa não era o código: o `moveBlock` de mentira invertia a lista e, com **um bloco só**, inverter não muda nada — o embrulho corretamente não registrou histórico. O defeito estava no teste.
Vale como lembrete de duas coisas: (1) quando um teste falha, investigar antes de "consertar" o código — quase se mexeu no que estava certo; (2) fixture com um único elemento esconde bug de ordenação e finge bug onde não há. As fixtures novas devem ter pelo menos 2–3 blocos quando a asserção envolve ordem.

### 2026-07-19 — Embrulho de funções: registrar como padrão do projeto?
A DEC-010 embrulhou 11 mutadores em vez de editá-los um a um. Funcionou bem e o diff ficou minúsculo. Se o padrão se repetir (ex.: para telemetria de uso, ou para marcar "sujo" no editor), vale promovê-lo a convenção no CONTEXT — com a ressalva de que depende de declaração de função no topo do script.

### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
O frontmatter da v12.3 só é lido como metadado num arquivo que contenha **uma** entrada. Para jogar o acervo inteiro num vault do Obsidian, o usuário precisaria exportar entrada por entrada. Um `.zip` com um `.md` por entrada resolveria — mas exige biblioteca de compressão, o que contraria o zero-dependência da DEC-001.
Alternativas a avaliar: (a) escrever um zip mínimo à mão (formato *stored*, sem compressão, é simples o bastante); (b) disparar vários downloads em sequência; (c) aceitar a limitação e documentar. A opção (a) é a única que mantém o zero-dependência **e** entrega o resultado.

### 2026-07-19 — Segunda vez que um teste apontou para o lugar errado
Na sessão 3 a fixture tinha um bloco só e fingiu um bug; nesta, o extrator do smoke não entendia regex e acusou "chaves desbalanceadas" como se o código de produção estivesse quebrado (FIX-003). Nos dois casos o código estava certo e a ferramenta de teste, errada.
Vale registrar como hábito: **falhou o teste → reproduzir e entender antes de tocar no código**. Já está no CLAUDE.md; se acontecer uma terceira vez, vale promover a princípio no CEREBRO.
