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
**Data:** 2026-04 (aprox.) · **Status:** aceita

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
