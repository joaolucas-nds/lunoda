# DECISIONS.md — Registro de Decisões

> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> Duas naturezas: **DEC** (decisões de arquitetura/design) e **FIX** (bugs graves resolvidos, para não repetir).
> Não reescreva entradas antigas; se uma decisão for substituída, marque «SUPERADA por DEC-N» e adicione a nova.
> Quando passar de ~700 linhas, mova as mais antigas para `DECISIONS-archive.md`.

---

## Como usar
Cada decisão recebe um ID sequencial (DEC-001, DEC-002…) e segue o formato ADR simplificado. Bugs graves usam FIX-001, FIX-002… com sintoma/causa/solução/lição.

> Nota: as decisões abaixo foram reconstruídas retroativamente a partir dos guias v10→v12 e do estado atual do código, ao montar o sistema de documentação (2026-07-05). Datas antigas são aproximadas.

---

## DEC-001 — App como arquivo `.html` único, vanilla, sem build
**Data:** 2026-04 (aprox.) · **Status:** aceita

### Contexto
Ferramenta pessoal, offline, para uso próprio, precisando ser fácil de versionar, subir no GitHub e rodar sem setup.

### Decisão
Manter tudo (HTML+CSS+JS) num único `.html`, JS vanilla, persistência em `localStorage`. Sem framework, sem backend, sem build.

### Alternativas consideradas
- **Notion** — rápido de organizar, mas não exporta tudo num único arquivo. Foi o gatilho do projeto.
- **Google Docs** — exporta arquivo único, mas navegação e formatação manual são trabalhosas.
- **Framework + backend** — só se justifica com multiusuário em tempo real ou datasets de 10.000+ entradas. Fora do escopo.

### Consequências
Portabilidade e zero-setup totais; funciona offline. Custo: sem colaboração em tempo real, e escala limitada pelo `localStorage` do navegador. Aceito para uso pessoal.

---

## DEC-002 — Desenvolvimento por GUIA passo a passo, não por edição direta
**Data:** 2026-04 (aprox.) · **Status:** superada por DEC-012

### Contexto
O autor aplica as mudanças manualmente e sobe a nova versão ao GitHub. Precisa de instruções precisas, não de um arquivo pronto que ele apenas substituiria às cegas.

### Decisão
O assistente **não** edita o arquivo diretamente: entrega um **guia `.md`** com o passo a passo (blocos antigos a localizar/substituir + blocos novos completos, com âncoras exatas do arquivo real). O autor aplica manualmente.

### Alternativas consideradas
- **Entregar o `.html` inteiro pronto** — mais rápido, mas o autor perde o controle da revisão e a rastreabilidade do que mudou; e arquivos grandes num bloco arriscam corrupção.
- **ASU (patch YAML)** — viável para código, mas o fluxo atual do projeto é o guia `.md`, que o autor já domina.

### Consequências
Autor mantém controle total e entende cada mudança. Custo: cada versão exige um guia detalhado e o assistente precisa ancorar em trechos literais do arquivo. Guias produzidos: v10 (Synap, por outra IA), v11, v12.

---

## DEC-003 — Bloco é a fonte de verdade das propriedades; entrada é calculada
**Data:** 2026-04 (v11) · **Status:** aceita

### Contexto
Nas versões antigas as propriedades viviam na entrada e os blocos "herdavam" de forma opaca (só dizia "herda", sem nomear a opção). O autor queria que cada bloco fosse marcado explicitamente com o nome de cada opção, e que a entrada refletisse o conjunto dos blocos.

### Decisão
Cada bloco guarda suas opções em `blockProps`. As propriedades da entrada (`propertyValues`) são **calculadas** como a união sem repetição das opções de todos os blocos, no momento de salvar (`calcPropertyValues`). Exportações listam o nome real de cada opção em cada bloco.

### Alternativas consideradas
- **Modelo Todos/Custom/Nenhum por opção (v10)** — implementado e depois abandonado: complexo, pouco intuitivo, empilhava a UI verticalmente. SUPERADO nesta decisão.
- **Herança opaca (v9)** — dizia que o bloco herdava algo sem nomear o quê. Rejeitado por não identificar os dados na exportação.

### Consequências
Dados bem identificados em qualquer exportação; a ferramenta "sabe" quais opções cada bloco tem. `editProps` continua no estado por compatibilidade, mas deixou de ser fonte de verdade. Migração automática de `propertyOptionModes`→`propertyAutoFlags` e `inheritProps`→`blockProps`.

---

## DEC-004 — Herança automática afeta só blocos NOVOS
**Data:** 2026-07-05 (v12) · **Status:** aceita · SUBSTITUI comportamento da v11

### Contexto
Na v11, clicar numa opção da entrada aplicava a opção a **todos os blocos existentes** imediatamente. O autor queria o oposto para simplicidade: a flag deveria valer só para blocos criados dali em diante.

### Decisão
`toggleEntryPropAuto` apenas liga/desliga a flag em `propertyAutoFlags`. Blocos existentes não são tocados. O chip `●auto` dentro de um bloco (`disableAutoFromBlock`) permite, num clique, remover a opção daquele bloco E desligar a flag — praticidade para não ter que subir até a entrada.

### Alternativas consideradas
- **Aplicar a existentes + futuros (v11)** — rejeitado: o autor achou intrusivo; queria controle bloco a bloco.

### Consequências
Comportamento previsível e menos intrusivo. Blocos que já tinham a opção a mantêm ao desligar a flag.

---

## DEC-005 — Reordenar blocos selecionados preservando ordem relativa
**Data:** 2026-07-05 (v12) · **Status:** aceita

### Contexto
Ao mover vários blocos selecionados (não contíguos) para cima/baixo, o autor queria que eles subissem/descessem como grupo mantendo a ordem entre si, e que os não-selecionados no caminho "passassem" para o outro lado.

### Decisão
`moveSelectedBlocks(delta)` percorre o array na direção do movimento trocando cada selecionado com o vizinho **não-selecionado** adjacente. Ex.: `[1,2,3,4,5]` com `{1,2,4,5}` selecionados → subir → `[1,2,4,5,3]`.

### Alternativas consideradas
- **Drag-and-drop** — mais intuitivo, mas mais complexo. Adiado para v13 (ver ROADMAP/IDEAS).

### Consequências
Reordenação em massa resolvida sem drag. O caso de duas versões diferentes selecionadas ao reordenar por número de versão ainda é uma questão em aberto (ver IDEAS, ideia de reordenação por versão).

---

## FIX-001 — Filtro por data desaparecia ao adicionar o filtro por propriedade
**Data:** 2026-07-05 (v11)

- **Sintoma:** o botão "Datas" (filtro por calendário) sumiu da toolbar quando o filtro por propriedade foi adicionado; a `.date-row` existia no HTML mas nada a abria.
- **Causa raiz:** ao inserir o botão "Filtrar" (propriedade), o botão "Datas" foi removido acidentalmente do HTML da toolbar. A função `toggleDateRow()` continuava no JS, órfã.
- **Solução:** restaurado o botão "Datas" na toolbar, ao lado do "Filtrar". Os dois filtros operam de forma independente.
- **Lição:** ao adicionar um controle vizinho a outro na toolbar, conferir que o existente não foi sobrescrito. Filtros independentes não devem competir por espaço no mesmo bloco de HTML.

---

## DEC-006 — Documentação de contexto em `meta/`, README do produto na raiz
**Data:** 2026-07-19 · **Status:** aceita

### Contexto
Os docs de contexto nasceram na raiz do repositório (montagem de 2026-07-05). O `_UPDATE-MANIFEST.md` do Kit de Contexto Universal define `meta/` como destino real de todos eles.

### Decisão
Mover CEREBRO, CONTEXT, STATUS, DECISIONS, CHANGELOG, IDEAS, ROADMAP, GLOSSARY, HISTORY e LOG-TEMPLATE para `meta/`. `INSTRUCOES-DO-PROJETO.md`, `README.md`, `.gitignore` e `.flatdropignore` ficam na raiz. Os guias de versão passam a viver em `guides/`.

### Alternativas consideradas
- **Manter tudo na raiz** — não quebraria nada, mas divergiria do kit e da convenção que o próprio manifesto declara; a raiz também fica poluída conforme os guias se acumulam.

### Consequências
Raiz limpa e alinhada ao kit. O `README.md` da raiz continua sendo o do produto — um eventual README dentro de `meta/` seria outro arquivo, sobre o sistema de documentação. Exige atualizar a estrutura descrita no README e no CONTEXT.

---

## DEC-007 — CEREBRO adota a base genérica do kit + seção específica do projeto
**Data:** 2026-07-19 · **Status:** aceita

### Contexto
Chegou um template-update do KCM (Kit v1.74.0). O CEREBRO vivo do projeto era uma base genérica **anterior e sem versão**, e não continha nenhuma diretriz personalizada para o Lunoda — as customizações reais viviam espalhadas no CONTEXT e no DECISIONS.

### Decisão
Adotar o CEREBRO do template como base (mais atual e refinado) e concentrar o que é específico do Lunoda numa seção própria, «Específico deste projeto (Lunoda)», ao final do arquivo. Ganhos herdados do template: seções «Ao receber um template-update do KCM» e «Refino das Instruções do Projeto», além das regras de **pedido composto** (princípio 10) e **concordância em busca-e-troca** (princípio 11).

### Alternativas consideradas
- **Manter o CEREBRO antigo e enxertar só as novidades** — mais trabalhoso e propenso a divergir do kit na próxima atualização, sem ganho: o antigo não tinha conteúdo próprio a preservar.
- **Substituição cega pelo template** — descartada: perderia a possibilidade de registrar o específico do projeto (o manifesto marca CEREBRO como `fusao` justamente por isso).

### Consequências
Atualizações futuras do kit passam a ser um diff limpo: base genérica de um lado, seção do projeto do outro. O específico do Lunoda deixa de ficar implícito.

---

## DEC-008 — Delimitadores HTML no export, em vez de escapar o conteúdo
**Data:** 2026-07-19 · **Status:** aceita

### Contexto
O conteúdo de um bloco é texto livre — normalmente colado de uma conversa com IA. Ele pode conter `#`, `---`, `**negrito**` e até o próprio divisor `━━━` do export. Na releitura, não havia como distinguir o que era conteúdo do que era estrutura gerada pela ferramenta. O defeito apareceu nos dados reais do usuário: um bloco com instruções coladas produziu um `# ...` que virou título de entrada no `.md` exportado.

### Decisão
Envolver o conteúdo de cada bloco em `<!-- CONTEUDO:INICIO bloco=N -->` / `<!-- CONTEUDO:FIM bloco=N -->` e acrescentar `<!-- BLOCO N -->`, seguindo a convenção do `<!-- ENTRADA -->` que já existia.

### Alternativas consideradas
- **Cercar o conteúdo em bloco de código (```)** — resolveria a ambiguidade, mas mataria a formatação Markdown intencional do conteúdo e mudaria a aparência do documento.
- **Escapar os caracteres perigosos** (`#` → `\#`) — polui o texto do usuário e é irreversível na importação.
- **Não fazer nada e confiar no olho** — é o estado que gerou o defeito.

### Consequências
Comentários HTML são invisíveis no Markdown renderizado e triviais de casar por máquina — o export fica legível para humano **e** parseável. Abre caminho para a F9 (frontmatter YAML) e para uma futura reimportação de `.md`, hoje impossível.

---

## DEC-009 — Verificação automática mínima (smoke em Node), sem framework
**Data:** 2026-07-19 · **Status:** aceita

### Contexto
O projeto nunca teve teste. Toda validação era visual, e um defeito de export só aparecia ao abrir o arquivo gerado — foi assim que o FIX-002 passou despercebido por três versões. Mas o `.html` único e sem build (DEC-001) não comporta uma suíte tradicional.

### Decisão
`tests/smoke.mjs`: script em **Node puro, sem dependências**, que recorta funções do `index.html` por varredura de chaves balanceadas e as executa isoladas, com um `db` de fixture. Cobre o `entryToMD()`, que é função pura. Rodar com `node tests/smoke.mjs`.

### Alternativas consideradas
- **Jest/Vitest** — exigiria `package.json`, `node_modules` e build: contraria a DEC-001 e o zero-setup.
- **Página HTML de teste no navegador** — combinaria com o estilo do projeto, mas exige abrir e olhar; não dá para rodar antes de um commit nem num agente.
- **Extrair o JS para arquivo separado e importar** — quebraria o arquivo único.

### Consequências
Ganho desproporcional ao custo: o smoke pegou os 5 sintomas do FIX-002 antes e depois do patch (5 falhas → 13 OK). Limite conhecido: cobre só funções puras — interface, `localStorage` e interações seguem sem cobertura e precisam de verificação manual declarada.

---

## FIX-002 — Export Markdown não separava conteúdo de estrutura
**Data:** 2026-07-19 · **Corrigido em:** v12.1

- **Sintoma:** num `.md` exportado com dados reais, a descrição multilinha aparecia sem `>` a partir da 2ª linha, e conteúdo de bloco contendo `#` gerava headings que se confundiam com títulos de entrada — o arquivo perdia a estrutura na releitura.
- **Causa raiz:** em `entryToMD()`, tanto `e.description` quanto `b.content` eram interpolados **crus** na template string. O `>` era escrito uma única vez, antes da descrição inteira, e o conteúdo do bloco não tinha delimitador algum.
- **Solução:** citar linha a linha a descrição; envolver o conteúdo em delimitadores HTML (DEC-008); acrescentar `<!-- BLOCO N -->`.
- **Lição:** **texto livre interpolado em formato estruturado precisa de delimitador explícito.** O defeito sobreviveu a três versões porque o export "parecia certo" nos casos simples — só apareceu com dados reais, onde o usuário havia colado conteúdo que imitava a própria estrutura. Vale testar com entrada hostil, não só com a bem-comportada (é o que a fixture do smoke faz agora).

---

## DEC-010 — Undo por snapshot do editor, com os mutadores embrulhados
**Data:** 2026-07-19 · **Status:** aceita

### Contexto
A v12 entregou excluir, mover e transferir blocos **em lote**, sem nenhum desfazer. O poder de estrago cresceu e a rede de segurança não acompanhou (F8). Faltava decidir *o que* guardar e *onde* registrar.

### Decisão
**O quê:** snapshots inteiros do editor, via o `getEditorSnapshot()` que já existia — o estado é o JSON de uma entrada, pequeno o bastante. Teto de 50 entradas.
**Onde:** em vez de acrescentar `pushHistory()` dentro de cada um dos 11 mutadores, eles são **embrulhados** por uma lista de nomes ao final do bloco de histórico. O embrulho compara o snapshot antes/depois e só registra quando o estado muda de fato.
**Escopo:** só operações estruturais. Digitação continua com o desfazer nativo do navegador dentro do campo — o `Ctrl+Z` só é interceptado fora de `INPUT`/`TEXTAREA`.

### Alternativas consideradas
- **Comando inverso por operação** (registrar "adicionei o bloco X" e saber removê-lo) — mais econômico em memória, mas exige escrever e manter uma inversa para cada ação; é onde esse tipo de recurso costuma quebrar. Não compensa num estado tão pequeno.
- **Editar os 11 mutadores** — mais explícito para quem lê uma função isolada, mas espalha a mesma linha por 11 lugares e a próxima função nova nasce sem histórico por esquecimento. O embrulho concentra a regra num ponto só; o custo é a indireção, mitigada por comentário.
- **Desfazer também da digitação** — duplicaria o comportamento nativo do navegador e brigaria com ele dentro do campo.

### Consequências
Fecha a F8. Adicionar cobertura a uma função nova é acrescentar um nome na lista. O embrulho depende de as funções serem declarações de topo (viram propriedades de `window`) — se alguma virar `const`, o embrulho a ignora silenciosamente, por isso há checagem de tipo e o `tests/history.mjs`. `restoreEditorSnapshot` recria um bloco vazio se o snapshot tiver zero, preservando a invariante do projeto.

---

## DEC-011 — Frontmatter por arquivo, não por entrada; preferência fora do `db`
**Data:** 2026-07-19 · **Status:** aceita

### Contexto
O `.md` já era bem identificado para leitura humana, mas nenhuma ferramenta lê `**Tags:** Ideia` como dado. O padrão para isso é o frontmatter YAML. O obstáculo: **frontmatter é único por arquivo** — só o primeiro bloco `---` de um arquivo é lido como metadado.

### Decisão
- **Uma entrada por arquivo** (`exportCurrentMD`) → frontmatter **da entrada**. É o caso que serve a um vault do Obsidian.
- **Várias entradas num arquivo** (`exportAllMD`, `massExportMD`) → frontmatter **do documento** (origem, data, contagem); cada entrada mantém seu bloco `<!-- ENTRADA -->`.
- Valores sempre entre aspas duplas, com escape de `\`, `"` e quebra de linha — é a única forma que aceita qualquer conteúdo sem ambiguidade (dois-pontos, `#`, texto que pareça número).
- Chaves derivadas do nome da propriedade, sem acento nem espaço; colisão com chave reservada ganha sufixo.
- A preferência liga/desliga vive em **chave própria do `localStorage`** (`lunoda_md_frontmatter`), não no `db`.

### Alternativas consideradas
- **Frontmatter de cada entrada mesmo no arquivo múltiplo** — do segundo em diante viraria texto solto e `---` renderizaria como linha horizontal. Pior que não ter.
- **Guardar a preferência no `db`** — mudaria o formato dos dados e entraria na importação/exportação de backup, com risco de migração, para uma escolha de interface. Chave separada é aditiva e reversível.
- **Emitir YAML sem aspas quando "parece seguro"** — heurística que falha exatamente nos casos difíceis; YAML inválido quebra o parse do outro lado em silêncio.
- **Um arquivo por entrada num `.zip`** — o que um vault realmente quer, mas exige biblioteca de compressão e contraria o zero-dependência (DEC-001). Registrado no IDEAS.

### Consequências
O `.md` de uma entrada passa a ser consultável por outra ferramenta. Nada muda no `entryToMD()` — o frontmatter é montado nos pontos de exportação, então a função coberta pelo smoke ficou intocada. Fica pendente a F9 parte 2 (reimportar `.md`), agora viável.

---

## FIX-003 — Extrator do smoke não entendia literais de regex
**Data:** 2026-07-19 · **Corrigido em:** `tests/smoke.mjs`

- **Sintoma:** ao incluir `yamlStr` na lista de funções recortadas, o teste abortava com "chaves desbalanceadas".
- **Causa raiz:** o recortador varre chaves ignorando string e comentário, mas não conhecia **literal de regex**. Em `.replace(/"/g, ...)`, a aspa dentro da regex era lida como início de string, e a varredura desalinhava do ponto ali em diante.
- **Solução:** reconhecer regex por heurística — depois de identificador, número ou `)`/`]`, uma `/` é divisão; nos demais casos inicia regex (com `[...]` tratado, já que `/` dentro de classe não fecha). Em paralelo, `yamlStr` foi reescrita com `split/join`, que naquele nível de escape é mais legível que a versão com regex.
- **Lição:** ferramenta de teste é código como qualquer outro e falha como qualquer outro. O erro se manifestou como falso alarme sobre o código de produção — a segunda vez na mesma semana em que o teste apontou para o lugar errado (ver o caso da fixture de um bloco só, no log de 2026-07-19 sessão 3). Diante de falha de teste: reproduzir e entender **antes** de mexer no código.

---

## DEC-012 — Desenvolvimento em duas raias: chat autora, Claude Code aplica (WO)
**Data:** 2026-11-03 · **Status:** aceita · SUPERA a DEC-002

### Contexto
O fluxo mudou duas vezes sem decisão registrada que acompanhasse: guia `.md` aplicado à mão (DEC-002, v10–v12) → instrução ASU em YAML (v12.1–v12.3, desvio registrado só no IDEAS). O template-update do KCM v1.133.0 chegou gerado com `Code sim · ASU nao`, e o autor confirmou a troca de vez em 2026-11-03. O chat agora roda com a pasta do projeto vinculada.

### Decisão
Duas raias. O **chat** analisa, projeta e autora: grava inteiros os docs de curadoria (CEREBRO, CONTEXT, Instruções, GLOSSARY, análises) e escreve WOs em `meta/workorders/` para o resto; git pelo chat é só leitura. O **Claude Code** aplica a WO com `/apply-wo` (âncora exata, ou PARA e reporta), roda `node tests/smoke.mjs` e `node tests/history.mjs`, faz os appends nos `meta/`, commita e empurra. O ASU sai: `meta/ASU/` foi movido para fora do repositório.

### Alternativas consideradas
- **Manter o ASU** — funcionou nas v12.1–v12.3 (3 instruções aplicadas), mas deixa com o autor rodar o aplicador e conferir à mão; o Code aplica, testa e commita num passo só.
- **Voltar ao guia `.md`** — já abandonado na prática; aplicar à mão fica mais caro a cada versão (~3.084 linhas hoje).
- **Chat editando o `index.html` direto** — possível com a pasta vinculada, mas deixaria código sem teste rodado e sem commit; a raia de execução existe para isso.

### Consequências
- A WO é o artefato de mudança; o relatório de trabalho do Code fica na pasta-pai (`../AAMMDD-HHMM-code-lunoda-<ato>-<alvo>.txt`), fora do Git.
- Nesta migração o chat também regravou o `STATUS.md` inteiro (curadoria: fatos defasados e a seção «Arquivos críticos» movida para o CONTEXT). Daqui em diante o STATUS volta a ser append do Code; reescrita só por WO ou como curadoria declarada.
- A seção «Específico deste projeto» da DEC-007 virou «Técnicas específicas deste projeto» no CEREBRO — a moldura que o kit promete não sobrescrever.
- Os guias de versão (`lunoda_vN_guide.md`) não existem no repositório; a regra de preservá-los saiu do CEREBRO.

---

## DEC-013 — Marcar propriedade nos blocos selecionados: UNIFORMIZAR, não inverter (C1)
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
Com blocos selecionados, o clique numa opção do painel da entrada deve agir nos selecionados. Duas ideias do autor descreviam regras diferentes para o caso misto (uns têm, outros não): inverter a posse de cada um, ou um «marca/desmarca/inverte» ambíguo (conflito C1 no IDEAS).

### Decisão
**Uniformizar:** se TODOS os selecionados têm a opção, o clique remove de todos; senão (nenhum ou misto), dá a todos. Bloco não selecionado não é tocado. O painel mostra `✓` (todos têm) e `–` (misto). Implementado em `applyPropToSelectedBlocks()`, coberto pelo undo (nome na lista do embrulho, DEC-010).

### Alternativas consideradas
- **Inverter posse por bloco** — era a regra descrita em detalhe e a sugestão do assistente em julho. Descartada: no estado misto, inverter produz OUTRO estado misto, e nenhum número de cliques chega a «todos com» ou «todos sem». Nos estados uniformes as duas regras coincidem; a diferença é só no misto, e ali inverter não serve ao uso real.

### Consequências
Dois cliques levam a qualquer estado uniforme. O estado misto passa a ser visível no painel. Regra coberta por `tests/history.mjs` (seção 11) com a função real recortada do `index.html`.

---

## DEC-014 — Botão direito liga o automático; esquerdo sem seleção só avisa (C2)
**Data:** 2026-11-03 · **Status:** aceita · SUBSTITUI o clique esquerdo da v12 no painel da entrada

### Contexto
Até a v12.3, o clique esquerdo numa opção do painel da entrada ligava/desligava a adição automática a novos blocos. Com a DEC-013, o esquerdo com seleção ganhou outra função, e o autor queria o automático no botão direito — o app não usava o botão direito em lugar nenhum (conflito C2).

### Decisão
**Botão direito** (`contextmenu` com `preventDefault`) liga/desliga a adição automática — no painel da entrada E nos chips do bloco (o automático é da entrada). **Esquerdo sem seleção não age:** mostra o aviso «Selecione blocos para marcar · botão direito liga o automático». O clique esquerdo no chip `●auto` dentro do bloco continua como na v12 (`disableAutoFromBlock`).

### Alternativas consideradas
- **(a) Manter o esquerdo-sem-seleção como automático** — zero aprendizado, mas o esquerdo faria duas coisas diferentes conforme houvesse seleção.
- **(c) Esquerdo-sem-seleção = marcar em TODOS os blocos** — a mais elegante («sem seleção = todos»), mas no hábito antigo o clique que ligava o automático viraria marcação em massa. Adiada no IDEAS, com gatilho.

### Consequências
Troca de memória muscular, mitigada pelo aviso. Esquerdo sempre marca; direito sempre controla o automático. Painéis de bloco abertos passam a ser reconstruídos ao ligar o automático (antes ficavam sem o `●auto` novo).

---

## DEC-015 — Empurrão de versão ignora a seleção e só renumera (Q1)
**Data:** 2026-11-03 · **Status:** aceita · implementação na F6

### Contexto
A ideia «reordenar por número de versão» (F6) tinha uma pergunta aberta do autor: o que fazer com duas versões selecionadas. No código, a versão é um número por bloco, editado no campo `ver-num` (`syncVer`) ou pelos botões −/+ (`adjVer`) — sempre um bloco por vez; duplicata de número não é impedida.

### Decisão
O empurrão **ignora a seleção**: age só no bloco cujo número foi editado. Regras: só no grupo de **mesmo subtítulo**; só quando o número novo **já está ocupado** no grupo (número livre é só gravado); é um **mover** (v5→v3 faz v3→v4 e v4→v5, a vaga deixada é ocupada; duplicatas existentes se movem juntas, sem renumerar o resto); −/+ seguem a mesma regra (trocam com o vizinho); **só os números mudam — a posição dos blocos na lista fica**; coberto pelo undo.

### Alternativas consideradas
- **Bloquear o campo com 2+ selecionados** — atrapalharia sem motivo: selecionar para uma ação em massa impediria corrigir um número.
- **Aplicar a todos os selecionados em sequência** — resultado dependente da ordem, imprevisível.
- **Reposicionar os blocos junto com o número** — mais código e confusão com Subir/Descer; o autor escolheu só números.

### Consequências
A F6 fica desbloqueada e especificada. A função nova entra na lista do embrulho do undo.

---

## DEC-016 — Quadrado geral de seleção age sobre os blocos VISÍVEIS; a seleção sobrevive ao filtro
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
O editor não tinha «selecionar todos os blocos», só o «✕ Sel». E o filtro interno não mexe na seleção: ações em massa já agiam também em selecionados escondidos pelo filtro, sem nenhum aviso — dava para excluir o que não se via. Pesquisa de padrões (design systems e reclamações de usuários de ferramentas de tabela): a seleção é um conjunto que o filtro não zera; o «selecionar todos» age no que está visível; selecionados fora da vista têm de aparecer explicitamente; o estado misto mostra «–» e é só do sistema.

### Decisão
Quadrado no cabeçalho da lista de blocos, calculado sobre `getFilteredBlocks()`: vazio (nenhum visível marcado), `–` (parte), `✓` (todos). Clique: todos os visíveis marcados → desmarca **só os visíveis**; senão → marca **todos os visíveis**. É a regra da DEC-013 aplicada à seleção. Selecionados escondidos pelo filtro ficam como estão, e o contador mostra «N selecionados · K fora do filtro». O confirm do Excluir em massa diz quantos dos excluídos estão escondidos — e passou a dizer «Ctrl+Z desfaz» (o texto antigo, «Não pode ser desfeito», era falso desde a v12.2).

### Alternativas consideradas
- **O clique substitui a seleção pelos visíveis** — «o que vejo é o que está marcado», mas desmarca em silêncio o que foi marcado antes do filtro.
- **Mudar o filtro limpa a seleção** — o mais seguro para ações em massa, mas joga fora o trabalho de marcar.
- **Clique no misto limpa tudo (como o Gmail)** — contradiria a DEC-013 e o comportamento nativo do checkbox indeterminado.

### Consequências
Uma regra só para propriedade e seleção. O risco de agir no que o filtro esconde fica visível no contador e no confirm. A opção (c) da C2 (Adiadas) perde força: «todos os blocos» agora custa um clique no quadrado. Coberto por `tests/history.mjs` (seção 12).

---

## DEC-017 — Tamanho das caixas de texto: padrão por tipo no localStorage, ajuste por caixa só na sessão
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
F4 parte 2: o espaço fixo das caixas (descrição 56px, bloco 90px) incomodava em textos longos. O autor pediu botões perto de cada caixa (minimizar, P, M, G) e um modo que cresce sozinho, com a rolagem passando a ser a da entrada inteira.

### Decisão
- **Modos:** descrição tem Auto · Mín · P · M · G; blocos têm Auto · P · M · G — sem «Mín» nos blocos porque o colapsar já cumpre esse papel. P/M/G fixam 4/10/20 linhas; Mín, 1 linha.
- **Auto** cresce com o conteúdo, sem teto, sem rolagem interna e sem alça manual (a alça brigaria com o crescimento). Fora do Auto a alça volta para o ajuste fino.
- **Clique esquerdo** num botão muda só aquela caixa, só enquanto a entrada está aberta. **Botão direito** torna o modo o padrão do tipo (descrição ou blocos) — o mesmo gesto da DEC-014 —, gravado em `localStorage['lunoda_ta_size']`, fora do `db` (DEC-011). Padrão inicial: Auto nos dois.
- Os botões aparecem **só ao passar o mouse** — no foco cobririam o texto enquanto se digita.

### Alternativas consideradas
- **Um padrão único para as duas caixas** — o que se havia combinado; mudado porque, sem «Mín» nos blocos, um padrão «Mín» não teria efeito neles.
- **Tamanho por bloco gravado no dado** — sobreviveria a exportar/importar, mas põe estado de interface no formato dos dados (rejeitado na DEC-011 pelo mesmo motivo).
- **Auto sempre ligado, P/M/G como altura mínima** — um texto longo cresceria mesmo em «P», e o botão deixaria de fazer o que diz.

### Consequências
Nenhuma mudança no formato dos dados nem no undo (tamanho não é estado da entrada). Altura arrastada à mão se perde quando a lista de blocos é redesenhada (ex.: ao filtrar) — aceito: o ajuste por caixa já é provisório por desenho.

---

## DEC-018 — Legibilidade: piso de contraste WCAG AA (4,5:1) e de 11px
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
O autor achava botões e opções pouco nítidos. Medido: `--text-muted` (#44444f, 41 usos — dicas, rótulos, contadores) tinha **1,7 a 1,8:1** contra os fundos do app, e `--text-dim` (#7a7a8c) **3,9 a 4,2:1**; o mínimo WCAG AA para texto comum é 4,5:1. Havia 22 textos em 9–10px e as opções não marcadas tinham opacidade .48.

### Decisão
`--text-dim` → #a2a2b6 (6,5–7,6:1) e `--text-muted` → #87879d (4,6–5,5:1), medidos contra `--bg`, `--surface`, `--surface2` e `--surface3`. Todo `font-size` de 9 ou 10px passa a 11px. `.btn-xs` e os botões de tamanho ganham preenchimento maior. Opção de propriedade não marcada: opacidade .7. Aprovado pelo autor com prints de antes/depois.

### Alternativas consideradas
- **Só clarear o `--text-muted`** — deixava títulos de seção (`--text-dim`) abaixo de 4,5:1 no `--surface2`.
- **Branco para tudo** — perderia a hierarquia texto > dim > muted que organiza a tela.

### Consequências
Regra para cor nova de texto: **medir o contraste contra o `--surface2` (o fundo mais claro) e não ficar abaixo de 4,5:1**; nada abaixo de 11px. A hierarquia visual continua, mais clara.

---

## DEC-019 — Painel do editor com largura ajustável e maximizar
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
Largura fixa de 780px (ou 92% da janela) apertava comandos e textos.

### Decisão
Alça na borda esquerda do painel (arrastar ajusta; mínimo 480px, máximo a janela; duplo clique volta ao original) e botão **maximizar/restaurar** no cabeçalho. Preferência em `localStorage['lunoda_editor_w']` (`{w, max}`), fora do `db` (DEC-011). O painel passou a fechar por `transform` em vez de `right` negativo — com largura variável, um `right: -820px` fixo deixaria o painel largo aparecendo pela borda.

### Alternativas consideradas
- **Só maximizar** — resolve o aperto, mas tira a tabela de vista sempre que se quer só um pouco mais de espaço.
- **Larguras pré-definidas (P/M/G)** — menos controle que arrastar, e mais um conjunto de botões.

### Consequências
Ao mudar a largura, as caixas em Auto são re-medidas (`taRefreshAll`). Largura maior que a janela é limitada ao abrir e ao redimensionar a janela.

---

## DEC-020 — Controle geral de tamanho das caixas dos blocos no cabeçalho
**Data:** 2026-11-03 · **Status:** aceita · complementa a DEC-017

### Contexto
Aplicar um tamanho a todos os blocos já era possível pelo botão direito (que torna o modo o padrão), mas escondido. O autor pediu um controle geral.

### Decisão
«Caixas: Auto · P · M · G» no cabeçalho da lista de blocos, sempre visível. **Clique esquerdo** aplica a todos os blocos só nesta sessão; **botão direito** torna o padrão — os mesmos gestos das caixas individuais. O botão ativo é o modo comum a todos os blocos; se estiverem diferentes, nenhum fica ativo.

### Alternativas consideradas
- **Deixar só o botão direito** — funcional, mas não descobrível.

### Consequências
Mesma regra em dois lugares (caixa e geral), mesmo código (`taToolbarHTML('all')`). Sem mudança no formato dos dados.

---

## DEC-021 — Detalhes da implementação do empurrão de versão (F6)
**Data:** 2026-11-04 · **Status:** aceita · complementa a DEC-015

### Contexto
A DEC-015 fixou as regras do empurrão. Ao implementar, apareceram três pontos que ela não cobria.

### Decisão
- **Bloco sem subtítulo não forma grupo** e não empurra ninguém — blocos sem nome não são versões de uma mesma coisa; tratá-los como grupo renumeraria blocos sem relação entre si.
- **O grupo ignora maiúsculas e espaços nas pontas** («A» e «a » são o mesmo subtítulo) — a mesma comparação que o aviso «mesmo subtítulo existe» já usava (`updateVerHint`).
- **A sugestão de versão (`applySug`) não empurra:** ela já escolhe o próximo número livre.
- Quando o empurrão renumera alguém, um aviso diz «v5 → v3 · N versão(ões) renumerada(s)»; os campos mudam no lugar, sem redesenhar a lista.

### Alternativas consideradas
- **Tratar «sem subtítulo» como um grupo** — coerente no papel, mas renumeraria em cascata blocos que só têm em comum a falta de nome.

### Consequências
Implementado em `setBlockVersion()`, chamado por `syncVer` (campo) e `adjVer` (−/+), na lista do embrulho do undo. Coberto pela seção 13 do `tests/history.mjs`.

---

## DEC-022 — Reimportar o `.md`: leitor pelos marcadores, linha DADOS no export, prévia, só mesclar
**Data:** 2026-11-04 · **Status:** aceita · análise: `meta/analises/261104-ANALISE-reimportar-md.md`

### Contexto
Só o JSON reimportava. A análise mediu, com um leitor-protótipo sobre o export real da fixture hostil, que o formato da DEC-008 já devolve título, descrição, ID, blocos, subtítulo, versão e conteúdo exatos; perdiam-se a data (o corpo tem minuto e fuso local), as cores e a adição automática. Achou também que uma propriedade com nome de campo do formato (ex.: «ID») colide no corpo, e mediu que o export real do autor de 05/07 (pré-v12.1) não tem delimitadores.

### Decisão
Opção B da análise, aprovada pelo autor:
- **Leitor pelos marcadores** (`parseLunodaMD`, pura): campo de formato vale pela posição (o primeiro é o campo); conteúdo é o que está entre os delimitadores; entrada com total de blocos divergente ou bloco sem fim é recusada inteira.
- **Linha `<!-- DADOS {json} -->`** depois de `<!-- ENTRADA -->` (id e datas ISO) e de cada `<!-- BLOCO n -->` (id) — comentário, invisível no render; nenhum marcador existente mudou. Sem ela (exports v12.1–v13.3), a data cai para o frontmatter de entrada única ou para o texto do corpo.
- **Prévia antes de gravar** (entradas, blocos, propriedades e opções novas, avisos) e **só mesclar**. Entrada que já existe (mesmo ID): **a prévia pergunta** — pular (padrão) ou importar como cópia nova, com «(cópia)» no título.
- Propriedades e opções **por nome**; as que faltam são criadas com cor nova.
- **Pré-v12.1 é recusado** com mensagem: reexportar pelo app resolve.

### Alternativas consideradas
- **A (sem a linha DADOS)** — perderia segundos e fuso da data e os ids de bloco.
- **C (JSON completo no comentário)** — dobra o arquivo e polui o modo edição do Obsidian; o JSON já é o backup completo.
- **E (leitor heurístico pré-v12.1)** — o arquivo real tem `#` e `---` dentro do conteúdo; reexportar resolve sem risco.

### Consequências
O `.md` vira caminho de recuperação e de volta do Obsidian. Continuam fora do `.md`: cores e adição automática (vêm do JSON). O formato do export agora é contrato do leitor: mudar marcador ou campo exige mudar `parseLunodaMD` e o teste de ida e volta do smoke.

---

## DEC-023 — Lembrete de backup JSON no topo, pelo que mudou desde o último backup
**Data:** 2026-11-04 · **Status:** aceita · origem: opção D da análise da F9 parte 2

### Contexto
Os dados vivem só no `localStorage` de um navegador; limpar os dados do navegador apaga o acervo. O JSON é o backup completo, mas nada lembrava de fazê-lo. O autor aprovou o lembrete para o backlog.

### Decisão
- Indicador no topo, ao lado de «Importar»: **«Backup em dia»** (discreto) quando nenhuma entrada mudou depois do último backup — **não importa há quantos dias** —; **«Backup há N dias» / «hoje»** quando houve mudança; em **amarelo** quando nunca houve backup ou quando houve mudança e já passaram **7 dias**. Some sem entradas.
- **Um clique** baixa o mesmo JSON completo do «Exportar tudo → JSON».
- Só o **JSON completo** registra backup (JSON de uma entrada, de seleção, Markdown e HTML não contam). Data em `localStorage['lunoda_last_backup']`, fora do `db` (DEC-011).
- Se estiver amarelo, um **aviso** aparece uma vez por abertura do app.
- O estado é calculado por uma função pura (`backupStatus`), coberta pelo smoke.

### Alternativas consideradas
- **Só por dias desde o backup** — avisaria quem não mexeu em nada; o que importa é o que mudou desde então.
- **Backup automático** (baixar sozinho) — o navegador pediria permissão de download a cada vez, ou encheria a pasta de Downloads.
- **Modal bloqueante** — insistente demais para uma ferramenta pessoal.

### Consequências
O risco principal do projeto fica visível o tempo todo, sem interromper. O limite de 7 dias é um padrão (`backupStatus(…, limite)`), mudável num ponto só. O registro é por navegador: outro navegador mostra «nunca» até o primeiro backup nele.

---

## FIX-004 — Backup ou dado salvo com entrada sem blocos abria com 0 blocos
**Data:** 2026-11-06 · **Corrigido em:** `index.html` (`loadDB`, nos dois ramos; `normalizeImportedDB`, nova) · achado ao escrever os testes do núcleo

- **Sintoma:** uma entrada sem `blocks`, ou com `blocks: []`, carregava e abria no editor com **0 blocos** — a invariante «nunca entrada com 0 blocos» do CONTEXT, quebrada. Medido no Chromium: `editBlocks.length === 0`.
- **Causa raiz:** `loadDB` usava `(e.blocks || [])` e a importação usava `(e2.blocks || [padrão])`: lista vazia é verdadeira em JS, então passava direto; e no `loadDB` a falta de blocos virava lista vazia. A invariante era mantida só por quem move ou exclui blocos, não por quem lê dado de fora.
- **Solução:** nos três pontos, «sem blocos» = ausente **ou** vazio, e ganha um bloco vazio (na importação, com o `content` antigo, como já fazia). A normalização da importação saiu de dentro do `handleImport` para `normalizeImportedDB`, sem mudar o que faz, para poder ser testada.
- **Lição:** invariante vale na **entrada** de dados, não só nas operações. Quem só testa o caminho feliz (o backup que o próprio app gera) nunca vê a borda: o backup do app nunca tem entrada sem blocos; um JSON editado à mão ou de outra ferramenta, sim.

---

## FIX-005 — Mesclar backup JSON perdia as opções novas de propriedades existentes
**Data:** 2026-11-06 · **Corrigido em:** `index.html` (`mergeImportedProperties`, nova; `handleImport`) · achado ao escrever os testes do núcleo

- **Sintoma:** ao mesclar um backup de outro navegador, uma opção criada lá (ex.: «Trabalho» em Tags) não aparecia aqui, e as entradas importadas ficavam apontando para um id de opção que não existia. Medido no Chromium: opções de Tags depois da mescla = só as que já existiam.
- **Causa raiz:** a mescla juntava propriedades **inteiras** por id — se o id já existia, a propriedade de fora era descartada com todas as opções. As propriedades padrão (`p-tags`, `p-ia`) têm o **mesmo id em todo navegador**, então o caso é o comum, não o raro.
- **Solução:** propriedade nova entra inteira; propriedade que já existe recebe só as opções que faltam, por id. Nome e cor do que já existe não mudam. O aviso da mescla diz quantas opções novas entraram.
- **Consequência aceita:** duas opções criadas separadamente com o mesmo nome em navegadores diferentes têm ids diferentes e passam a aparecer as duas. Juntar por nome exigiria remapear os ids nas entradas — é o que o import de `.md` faz (DEC-022), porque lá não há id de opção; no JSON há.
- **Lição:** id fixo de dado padrão é compartilhado entre instalações; mescla «por id» tem de descer até o nível das opções.

---

## DEC-024 — Busca sem acento com trecho e continuidade até o bloco; atalhos sem conflito; arrastar para importar (F10)
**Data:** 2026-11-06 · **Status:** aceita · origem: `meta/analises/261106-ANALISE-busca-atalhos-arrastar.md` (pontos 1a, 2a, 3a, 4a)

### Contexto
A busca da tabela já procurava no conteúdo dos blocos, mas `funcao` não achava «função», não dizia onde casou e o termo se perdia ao abrir a entrada; o filtro interno procurava só no subtítulo. Dos atalhos, `Ctrl+N` nunca chegava à página (reservado pelo navegador desde o Chrome 4) e o `P` capturava o `Ctrl+P`. Soltar um arquivo na janela fazia o navegador abrir o arquivo no lugar do app.

### Decisão
- **Busca:** acento e maiúscula não contam (`foldText`: NFD sem marcas combinantes); cada palavra precisa aparecer, em qualquer ordem, em qualquer campo da entrada (`entryMatches`). Na tabela, o título mostra as palavras destacadas e, quando um bloco casa sozinho, uma linha com o **trecho** destacado e «em N blocos» (`searchHit`/`searchSnippet`, HTML escapado antes do `<mark>`).
- **Continuidade:** abrir uma entrada pela tabela com a busca ativa já abre o filtro de blocos com o termo (`carrySearchIntoEditor`) — só se algum bloco casar. O filtro de texto passa a se chamar **«Texto»** e procura no subtítulo **e** no conteúdo, sem acento. Dentro da caixa, o `Ctrl+F` do navegador acha a palavra (não há destaque dentro do `textarea`).
- **Bloco novo com filtro ativo limpa o filtro** e avisa — senão o bloco vazio nascia escondido (já acontecia pelo botão; com o filtro herdado da busca, ficaria comum).
- **Atalhos:** tecla solta só fora de campo de texto e sem janela aberta — `/` busca, `N` nova entrada (no lugar do `Ctrl+N`), `P` barra lateral (agora sem modificador), `?` lista de atalhos; `Esc` na busca limpa. No editor, inclusive digitando: `Alt+↓/↑` bloco vizinho visível, `Alt+Enter` novo bloco. Nunca `Ctrl+Alt` (AltGr no ABNT2) nem combinação reservada do navegador. Lista em `#shortcutsModal`, aberta pelo `?` ou pelo botão `?` no topo; `title` dos botões cita o atalho.
- **Arrastar:** arquivo (só `Files`) solto em qualquer lugar da janela segue o mesmo caminho do botão Importar (`importFile`); `.json`/`.md` só, um por vez; o `drop` de arquivo é sempre cancelado.
- **Desempenho:** o texto dobrado fica numa memória por objeto (`foldMemo`) que **confere a fonte a cada uso** — nunca fica velha, nada a invalidar. Medido no teto (775 entradas, 4,8 MB, Chromium): a busca soma até ~80 ms ao redesenho da tabela, que já custa ~170–200 ms com 775 linhas sem busca nenhuma (custo anterior, não mudado).

### Alternativas consideradas
- Mostrar todos os blocos e só marcar os que casam (1b) — a marca se perde na rolagem; o filtro tem o Limpar a um clique.
- Campo «Conteúdo» separado no filtro (2b) — dois campos para o mesmo gesto; o campo único é superconjunto do antigo.
- `Alt+N` para nova entrada (3b) — funciona, mas o `N` solto segue o padrão do `P`.
- Destaque dentro do `textarea` (camada espelhada) — frágil e o `Ctrl+F` do navegador já faz.
- Cache invalidado por evento — estado espalhado por todos os mutadores; a memória que confere a fonte resolve sem isso.
- Espera entre teclas (debounce) — desnecessária no acervo real; o custo de base da tabela é anterior a esta versão (ver IDEAS).

### Consequências
Achar um trecho deixa de depender de lembrar a grafia exata, e o caminho busca → entrada → bloco não perde o termo. O filtro interno passa a mostrar também blocos que *citam* o texto digitado. `Ctrl+N` deixa de constar do código; quem usava (não funcionava) usa `N`. O `drop` cancelado protege a edição não salva.

---

## DEC-025 — Busca por começo de palavra, `*` para «em qualquer parte», trecho na palavra mais longa
**Data:** 2026-11-07 · **Status:** aceita · origem: conversa de 2026-11-07 (opção A da próxima frente; achado do autor num print da busca «transferencia de co»)

### Contexto
Na v13.6 (DEC-024) cada palavra da busca casava como **pedaço de qualquer palavra**: «co» acendia em «acordo», «de» em «onde». E o trecho se ancorava na **primeira** palavra encontrada, com raio fixo de 40 caracteres, o que partia a marca da palavra longa na borda: `[co]nversa [co]m ASU: Estou retomando após [tra]…`.

### Decisão
- **Começo de palavra, em todas as palavras da busca:** cada palavra casa só onde uma palavra do texto começa (`findWord` + `isWordStart`): início do texto, depois de algo que não é letra nem número (espaço, «.», «_», «-»…) e na troca letra↔número («13» acha «v13.6»). Palavra da busca que começa por símbolo («.html») casa onde estiver. Vale para a tabela e para o filtro de blocos (mesmas funções).
- **`*` na frente = em qualquer parte:** `*cor` acha «acordo». Vários `*` na frente valem um; `*` no fim é aceito e descartado («co*» = «co»); `*` sozinho não é palavra.
- **Trecho:** a janela se ancora na ocorrência da palavra **mais longa** que aparece no texto (empate: a primeira no texto) e cresce até o fim de qualquer marca que cruze uma borda — a marca nunca sai partida.
- **Onde se aprende:** dica no `title` do campo de busca e uma nota na lista de atalhos (`?`).

### Alternativas consideradas
- **Casar em qualquer parte, sem destacar palavras de 1–2 letras** (opção b): o casamento continuaria largo e a marca escondida confundiria — a palavra conta para o filtro sem aparecer.
- **Só a última palavra como prefixo, as outras inteiras** (padrão da Algolia e do Meilisearch): numa busca que ordena por relevância faz sentido; aqui a tabela não ordena por relevância e o acervo é pequeno, então prefixo em todas é mais prático («transf conv» funciona).
- **`%` como curinga** (SQL `LIKE`): sintaxe de banco, não de quem usa o app, e aparece em texto real («50%»).
- **camelCase como começo de palavra** («snippet» acharia «searchSnippet»): o texto dobrado já não tem maiúscula; exigiria mapear de volta ao original. `*snippet` resolve; fica no IDEAS.

### Consequências
Palavras curtas deixam de acender em tudo, e o trecho mostra a palavra que importa. Buscar o meio de uma palavra passa a pedir `*` — quem buscava «versa» para achar «conversa» agora digita `*versa`. Os `.md`, o JSON e o `localStorage` não mudam.
