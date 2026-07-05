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

## 🛠 Feedback para o Kit
> Observações sobre o próprio sistema de documentação / kit de contexto.

### 2026-07-05 — Projeto chegou já em andamento (v12), documentação montada retroativamente
O sistema de docs foi criado com o projeto já na v12. CONTEXT/DECISIONS/CHANGELOG foram **reconstruídos a partir dos guias e do código no disco**, não acompanhados desde o início. Funcionou bem porque os guias `.md` das versões estavam preservados — reforça o valor de guardar os artefatos de cada versão. Datas antigas ficaram aproximadas (só a v12 tem data exata, 2026-07-05).

### 2026-07-05 — Desvio registrado: fluxo de "guia .md" em vez de ASU
Este projeto entrega mudanças como **guia `.md` passo a passo** (DEC-002), não como patch ASU nem arquivo `.html` inteiro. O CEREBRO menciona ASU para editar código; aqui a prática estabelecida é o guia. Mantido o fluxo do autor. Se no futuro o autor quiser, dá para migrar para ASU — mas hoje o guia é o que ele domina.
