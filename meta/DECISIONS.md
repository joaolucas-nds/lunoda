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
