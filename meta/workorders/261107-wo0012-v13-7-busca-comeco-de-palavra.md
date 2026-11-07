# WO 0012 — v13.7: busca por comeco de palavra, `*` para «em qualquer parte», trecho na palavra mais longa (DEC-025)

> **Tipo:** mista — CODIGO (`index.html`, `tests/smoke.mjs`) + DOC (`tests/README.md`, DECISIONS, CHANGELOG, IDEAS, STATUS, log).
> **Config sugerida:** Sonnet, `/effort` medio. Codigo e texto prontos, ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD `550bfc8` (wrap da wo0011). `sha1sum index.html` = `7c3328e71a926421cc31040aed7ae1f875080ada`. Arvore: `M` so nos 3 arquivos gravados pelo chat (hashes abaixo) e `??` nesta WO. ANTES: smoke `101 ok, 0 falha(s)` e history `52 ok, 0 falha(s)`.
> **Base:** decisao do autor em 2026-11-07 (opcao A da proxima frente, ponto em aberto respondido): comeco de palavra em TODAS as palavras, `*` na frente para «em qualquer parte», trecho ancorado na palavra mais longa sem partir a marca; a C fica de fora.
> **Depende de:** wo0011 (aplicada).
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, STATUS, `tests/README.md` e log. CONTEXT, GLOSSARY e README o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
ed134f77c87e9800b132a27d8a9edb4a982059d6  meta/CONTEXT.md
7fbbc94e2ff5411a18e4e5f2775556b216811769  README.md
326a645b648ef88ad0712544c5439244194a24ef  meta/GLOSSARY.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia do repositorio em `550bfc8` (`git archive HEAD`, 2026-11-07 ~10:00), cada uma com `count == 1`, aplicadas em ordem. A WO foi simulada lendo as edicoes deste proprio arquivo. **Nenhuma edicao e de remocao de linha**, e nenhuma ancora ou texto novo comeca ou termina em quebra de linha.

---

## 1. Por que

Na v13.6 (DEC-024) cada palavra da busca casava como pedaço de qualquer palavra («co» acendia em «acordo») e o trecho se ancorava na PRIMEIRA palavra encontrada, com raio fixo, partindo a marca da palavra longa na borda — o print do autor com «transferencia de co» mostrava `[co]nversa [co]m ASU: Estou retomando após [tra]…`. Esta WO troca o casamento para comeco de palavra (com `*` na frente para o «contem»), ancora o trecho na palavra mais longa e faz a janela crescer ate o fim de qualquer marca que cruze a borda.

## 2. Contexto factual

- **Medido (Node, funcoes reais extraidas pelo smoke):** com o codigo novo, smoke 113 ok, 0 falhas; history 52 ok, 0 falhas. As 101 assercoes antigas passam sem mudanca — nenhuma dependia do casamento no meio da palavra.
- **Prova de vida (medido):** onze mutantes — comeco de palavra sempre verdadeiro, `*` ignorado, sem troca letra/numero, sem a regra do simbolo, ancora na primeira ocorrencia, sem crescer a borda direita, sem crescer a esquerda, empate com a ultima, `*` no fim mantido, trecho por `indexOf`, entrada por `includes` — cada um derruba de 1 a 3 assercoes.
- **Achado no caminho:** o `extractFunction` do smoke le `return /…/` como divisao e quebra a extracao; por isso `isWordChar` e `isWordStart` guardam a regex numa constante (comentado no codigo; armadilha no CONTEXT).
- **Achado no log:** a secao do Code da wo0011 em `logs/2026-11-07.md` tem 4 caracteres combinantes literais (os escapes do intervalo de acentos, convertidos no transporte), embora diga «corrigido para o texto». A Edicao 24 troca por texto, por comando que nao contem escape nenhum.
- **Interface:** so muda o `title` do campo de busca e uma nota a mais na lista de atalhos. A conferencia no navegador e do autor (roteiro na conversa).

## Inventario

Os pontos que usam o casamento das palavras foram achados por `grep -n 'includes(w)\|indexOf(w' index.html` no HEAD: 3 lugares (`entryMatches`, `blockMatches`, `searchSnippet`) — todos trocados. O filtro de blocos (`getFilteredBlocks`) e o `carrySearchIntoEditor` chamam `blockMatches` e herdam a regra sem edicao. 23 edicoes por ancora + 1 por comando + a secao do Code no log.

---

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `550bfc8`; `sha1sum index.html` = `7c3328e71a926421cc31040aed7ae1f875080ada`; `sha1sum -c` nas 3 linhas acima -> `OK`. smoke `101 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · cabecalho da secao BUSCA

**Forma:** Substituir.

**Ancora:**

````
   BUSCA (v13.6, DEC-024)
   Acento e maiúscula não contam; cada palavra digitada precisa aparecer,
   em qualquer ordem. Funções puras (salvo esc), testadas no smoke.
````

**Substituir por:**

````
   BUSCA (v13.6, DEC-024; v13.7, DEC-025)
   Acento e maiúscula não contam; cada palavra digitada precisa aparecer,
   em qualquer ordem, no COMEÇO de uma palavra do texto («co» acha «conversa»,
   não «acordo»); com `*` na frente, em qualquer parte («*cor» acha «acordo»).
   Funções puras (salvo esc), testadas no smoke.
````

## Edicao 2 — `index.html` · searchTokens e casamento por comeco de palavra

**Forma:** Substituir.

**Ancora:**

````
/* Palavras da busca, já sem acento. Busca vazia = lista vazia. */
function searchTokens(q) {
  return foldText(q).split(/\s+/).filter(Boolean);
}
````

**Substituir por:**

````
/* Palavras da busca, já sem acento. Busca vazia = lista vazia.
   `*` na frente (um só, mesmo que se digitem vários) = «em qualquer parte»;
   `*` no fim é aceito e descartado, porque o começo de palavra já é o padrão
   («co*» = «co»); `*` sozinho não é palavra (DEC-025). */
function searchTokens(q) {
  return foldText(q).split(/\s+/)
    .map(w => w.replace(/\*+$/, '').replace(/^\*+/, '*'))
    .filter(w => w && w !== '*');
}

/* Letra ou número (o texto já chega dobrado, sem acento). A regex mora numa
   constante: o extrator do smoke lê «return /…/» como divisão. */
function isWordChar(c) { const re = /[\p{L}\p{N}]/u; return re.test(c); }

/* A posição p do texto dobrado começa uma palavra? Sim no início do texto;
   depois de algo que não é letra nem número (espaço, «.», «_», «-»…); na troca
   entre letra e número («v13» → «13», «13a» → «a»); e quando o próprio
   caractere não é letra nem número — palavra da busca que começa por símbolo
   («.html», «#2») casa onde estiver. camelCase NÃO conta: o texto dobrado não
   tem mais maiúscula; «*snippet» acha «searchSnippet». */
function isWordStart(t, p) {
  if (p === 0) return true;
  const a = t[p - 1], c = t[p];
  if (!isWordChar(a) || !isWordChar(c)) return true;
  const num = /\p{N}/u;
  return num.test(a) !== num.test(c);
}

/* Primeira posição, a partir de `from`, onde a palavra da busca casa no texto
   dobrado (-1 se não houver): no começo de uma palavra, ou em qualquer lugar
   quando ela vem com `*` na frente. */
function findWord(t, w, from = 0) {
  const solta = w[0] === '*';
  const alvo = solta ? w.slice(1) : w;
  let p = t.indexOf(alvo, from);
  while (p !== -1 && !solta && !isWordStart(t, p)) p = t.indexOf(alvo, p + 1);
  return p;
}

/* Quantos caracteres do texto a palavra da busca cobre (o `*` não conta). */
function wordLen(w) { return w[0] === '*' ? w.length - 1 : w.length; }
````

## Edicao 3 — `index.html` · entryMatches usa findWord

**Forma:** Substituir.

**Ancora:**

````
  return tokens.every(w => td.includes(w) || (e.blocks || []).some(b => blockFold(b).includes(w)));
````

**Substituir por:**

````
  return tokens.every(w => findWord(td, w) !== -1 || (e.blocks || []).some(b => findWord(blockFold(b), w) !== -1));
````

## Edicao 4 — `index.html` · blockMatches usa findWord

**Forma:** Substituir.

**Ancora:**

````
  return tokens.every(w => t.includes(w));
````

**Substituir por:**

````
  return tokens.every(w => findWord(t, w) !== -1);
````

## Edicao 5 — `index.html` · comentario do searchSnippet

**Forma:** Substituir.

**Ancora:**

````
/* Recorta um trecho do texto em volta da primeira palavra encontrada e
   destaca todas as palavras com <mark>. Devolve HTML já escapado ('' se
   nada casar). O texto sem acento pode ter outro comprimento que o
   original, então cada caractere dobrado guarda a posição de origem. */
````

**Substituir por:**

````
/* Recorta um trecho do texto em volta da palavra da busca MAIS LONGA que
   aparece nele (a mais informativa; empate = a que aparece primeiro no texto)
   e destaca todas as palavras com <mark>. A janela cresce até o fim de uma
   marca que cruze a borda: a marca nunca sai partida (DEC-025). Devolve HTML
   já escapado ('' se nada casar). O texto sem acento pode ter outro
   comprimento que o original, então cada caractere dobrado guarda a posição
   de origem. */
````

## Edicao 6 — `index.html` · searchSnippet: ancora e bordas

**Forma:** Substituir.

**Ancora:**

````
  tokens.forEach(w => {
    let p = dob.indexOf(w);
    while (p !== -1) {
      let fimF = at(p + w.length - 1) + 1;
      while (fimF < src.length && /[\u0300-\u036f]/.test(src[fimF])) fimF++;   // acento solto fica dentro da marca
      faixas.push([at(p), fimF]);
      p = dob.indexOf(w, p + 1);
    }
  });
  if (!faixas.length) return '';
  faixas.sort((a, b) => a[0] - b[0]);
  const ini = Math.max(0, faixas[0][0] - raio);
  const fim = Math.min(src.length, faixas[0][1] + raio);
````

**Substituir por:**

````
  tokens.forEach(w => {
    const n = wordLen(w);
    let p = findWord(dob, w);
    while (p !== -1) {
      let fimF = at(p + n - 1) + 1;
      while (fimF < src.length && /[\u0300-\u036f]/.test(src[fimF])) fimF++;   // acento solto fica dentro da marca
      faixas.push([at(p), fimF, n]);
      p = findWord(dob, w, p + 1);
    }
  });
  if (!faixas.length) return '';
  faixas.sort((a, b) => a[0] - b[0]);
  // Âncora: a ocorrência da palavra mais longa; com a ordem por posição, o empate fica com a primeira
  const ancora = faixas.reduce((m, f) => (f[2] > m[2] ? f : m));
  let ini = Math.max(0, ancora[0] - raio);
  let fim = Math.min(src.length, ancora[1] + raio);
  // Marca que cruza a borda puxa a borda até ela («[tra]…» nunca mais). Em ordem
  // de posição, uma borda que cresceu pode alcançar a marca seguinte.
  faixas.forEach(([a, b]) => { if (a < fim && b > fim) fim = b; });
  for (let i = faixas.length - 1; i >= 0; i--) {
    const [a, b] = faixas[i];
    if (a < ini && b > ini) ini = a;
  }
````

## Edicao 7 — `index.html` · dica no campo de busca

**Forma:** Substituir.

**Ancora:**

````
title="Procura no título, na descrição e nos blocos; acento não conta (/ para vir aqui, Esc para limpar)"
````

**Substituir por:**

````
title="Procura no título, na descrição e nos blocos; acento não conta. Cada palavra casa no começo de uma palavra do texto; * na frente procura em qualquer parte (/ para vir aqui, Esc para limpar)"
````

## Edicao 8 — `index.html` · dica na lista de atalhos

**Forma:** Substituir.

**Ancora:**

````
    <p class="kbd-note">As teclas soltas (<kbd>/</kbd> <kbd>N</kbd> <kbd>P</kbd> <kbd>?</kbd>) não valem enquanto você digita num campo. Para importar, também dá para arrastar um <code>.json</code> ou <code>.md</code> para a janela.</p>
````

**Substituir por:**

````
    <p class="kbd-note">As teclas soltas (<kbd>/</kbd> <kbd>N</kbd> <kbd>P</kbd> <kbd>?</kbd>) não valem enquanto você digita num campo. Para importar, também dá para arrastar um <code>.json</code> ou <code>.md</code> para a janela.</p>
    <p class="kbd-note">Na busca, cada palavra casa no começo de uma palavra do texto: <code>co</code> acha «conversa», não «acordo». Com <kbd>*</kbd> na frente, casa em qualquer parte: <code>*cor</code> acha «acordo».</p>
````

## Edicao 9 — `tests/smoke.mjs` · funcoes novas na lista extraida

**Forma:** Substituir.

**Ancora:**

````
  const BUSCA = ['esc', 'foldText', 'searchTokens', 'foldOf', 'blockFold', 'entryMatches', 'blockMatches',
                 'searchSnippet', 'searchHit', 'siblingBlockIndex'];
````

**Substituir por:**

````
  const BUSCA = ['esc', 'foldText', 'searchTokens', 'isWordChar', 'isWordStart', 'findWord', 'wordLen',
                 'foldOf', 'blockFold', 'entryMatches', 'blockMatches', 'searchSnippet', 'searchHit', 'siblingBlockIndex'];
````

## Edicao 10 — `tests/smoke.mjs` · assercoes do comeco de palavra e do trecho

**Forma:** Substituir.

**Ancora:**

````
  const h = b.searchHit({ blocks: [{ subtitle: 'Claude', content: 'a função' }, { content: 'outra função' }, { content: 'nada' }] }, T('funcao'));
````

**Substituir por:**

````
  // Começo de palavra e `*` na frente (DEC-025)
  check('busca: * na frente fica um so; * no fim e * sozinho somem',
    J(T('co* *versa **cor * ***')) === J(['co', '*versa', '*cor']), J(T('co* *versa **cor * ***')));
  check('busca: palavra casa no comeco de palavra, nao no meio',
    b.blockMatches({ content: 'uma conversa' }, T('co')) && !b.blockMatches({ content: 'acordo' }, T('co'))
    && !b.entryMatches({ title: 'acordo', blocks: [{ content: 'tratado' }] }, T('co')));
  check('busca: * na frente casa em qualquer parte',
    b.blockMatches({ content: 'acordo' }, T('*cor')) && b.entryMatches({ title: 'searchSnippet', blocks: [] }, T('*snippet'))
    && !b.entryMatches({ title: 'searchSnippet', blocks: [] }, T('snippet')));
  check('busca: comeco de palavra depois de pontuacao e na troca letra/numero',
    b.blockMatches({ content: 'index.html' }, T('html')) && b.blockMatches({ content: 'Lunoda v13.6' }, T('13 6'))
    && b.blockMatches({ content: 'pasta_nova' }, T('nova')) && b.blockMatches({ content: '13abc' }, T('abc')));
  check('busca: palavra que comeca por simbolo casa onde estiver', b.blockMatches({ content: 'index.html' }, T('.html')));
  check('busca: o comeco de palavra vale tambem com acento', b.blockMatches({ content: 'Ótima ação' }, T('aca otim')));
  check('trecho: so destaca no comeco de palavra',
    b.searchSnippet('acordo com', T('co')) === 'acordo <mark>co</mark>m', b.searchSnippet('acordo com', T('co')));
  check('trecho: com * destaca no meio da palavra',
    b.searchSnippet('conversa', T('*versa')) === 'con<mark>versa</mark>', b.searchSnippet('conversa', T('*versa')));
  const caso = 'conversa com ASU: Estou retomando após ' + 'x'.repeat(60) + ' a transferência de contexto';
  const s4 = b.searchSnippet(caso, T('transferencia de co'));
  check('trecho: ancora na palavra mais longa, nao na primeira encontrada',
    s4.startsWith('…') && s4.includes('<mark>transferência</mark>') && !s4.includes('<mark>co</mark>nversa'), s4);
  const s5 = b.searchSnippet('alvo 1234567 bem feito', T('alvo be'), 10);
  check('trecho: marca que cruza a borda direita puxa a borda (nunca sai partida)',
    s5 === '<mark>alvo</mark> 1234567 <mark>be</mark>…', s5);
  const s6 = b.searchSnippet('bem 1234567 alvo', T('alvo be'), 11);
  check('trecho: marca que cruza a borda esquerda puxa a borda',
    s6 === '<mark>be</mark>m 1234567 <mark>alvo</mark>', s6);
  const s7 = b.searchSnippet('longo alvo ' + 'z'.repeat(30) + ' alvo fim', T('alvo'), 5);
  check('trecho: empate de tamanho fica com a primeira ocorrencia', s7.includes('ongo <mark>alvo</mark>') && !s7.includes('fim'), s7);

  const h = b.searchHit({ blocks: [{ subtitle: 'Claude', content: 'a função' }, { content: 'outra função' }, { content: 'nada' }] }, T('funcao'));
````

## Edicao 11 — `tests/README.md` · smoke cobre o comeco de palavra

**Forma:** Substituir.

**Ancora:**

````
e o índice do `Alt+↓/↑`. 101 asserções no total.
````

**Substituir por:**

````
e o índice do `Alt+↓/↑`. Desde a v13.7, o **começo de palavra** (DEC-025): «co» acha «conversa» e não «acordo», `*` na frente casa em qualquer parte, `*` no fim e sozinho somem, começo depois de pontuação e na troca letra↔número, o destaque só onde casou, a âncora do trecho na palavra mais longa (empate: a primeira) e a marca que cruza a borda puxando a borda. 113 asserções no total.
````

## Edicao 12 — `meta/DECISIONS.md` · DEC-025 no fim

**Forma:** Substituir.

**Ancora:**

````
Achar um trecho deixa de depender de lembrar a grafia exata, e o caminho busca → entrada → bloco não perde o termo. O filtro interno passa a mostrar também blocos que *citam* o texto digitado. `Ctrl+N` deixa de constar do código; quem usava (não funcionava) usa `N`. O `drop` cancelado protege a edição não salva.
````

**Substituir por:**

````
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
````

## Edicao 13 — `meta/CHANGELOG.md` · [13.7.0] acima da 13.6.0

**Forma:** Substituir.

**Ancora:**

````
## [13.6.0] — 2026-11-06
````

**Substituir por:**

````
## [13.7.0] — 2026-11-07

### Modificado
- **Busca por começo de palavra** (DEC-025): cada palavra casa só onde uma palavra do texto começa — `co` acha «conversa», não «acordo»; `13` acha «v13.6». Vale na tabela e no filtro de blocos.
- **Trecho da busca** ancorado na palavra mais longa encontrada, e a janela cresce para nunca partir uma marca na borda.

### Adicionado
- **`*` na frente casa em qualquer parte**: `*cor` acha «acordo». Dica no campo de busca e na lista de atalhos (`?`).
- `tests/smoke.mjs` cobre o começo de palavra e o trecho (12 asserções novas, 113 no total).

## [13.6.0] — 2026-11-06
````

## Edicao 14 — `meta/IDEAS.md` · ideia do trecho: status

**Forma:** Substituir.

**Ancora:**

````
> Fonte: conversa de 2026-11-07, nota `261107-0845.txt` e print do autor (arquivados em `notas-arquivadas`). **Status:** aberta — opção A da próxima frente (`logs/2026-11-07.md`).
````

**Substituir por:**

````
> Fonte: conversa de 2026-11-07, nota `261107-0845.txt` e print do autor (arquivados em `notas-arquivadas`). **Status:** implementada na v13.7 (DEC-025) — escolhida a (a), começo de palavra em todas as palavras, com `*` na frente para «em qualquer parte»; a (b) foi descartada — ver Concluídas.
````

## Edicao 15 — `meta/IDEAS.md` · ideias novas da busca

**Forma:** Substituir.

**Ancora:**

````
### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
````

**Substituir por:**

````
### 2026-11-07 — Busca: camelCase como começo de palavra
> **Status:** aberta — fora da v13.7 de propósito (DEC-025).
Hoje «snippet» não acha «searchSnippet»: o texto dobrado já não tem maiúscula, então a troca minúscula→maiúscula não conta como começo de palavra. `*snippet` resolve. Fazer exigiria olhar o texto original ao lado do dobrado. Gatilho: o autor sentir falta ao procurar nomes de código colados nas conversas.

### 2026-11-07 — Busca: frase exata entre aspas
> **Status:** aberta.
`"de contexto"` casaria só com as duas palavras juntas, nessa ordem. Hoje cada palavra casa sozinha, em qualquer ordem. Barato com `findWord` (procurar a frase dobrada como uma palavra só); a dúvida é se o autor usaria.

### 2026-11-07 — Extrator do smoke lê `return /…/` como divisão
> **Status:** aberta — contornada na v13.7 (regex numa constante; armadilha no CONTEXT).
O `extractFunction` decide entre regex e divisão pelo caractere anterior; depois de identificador conta como divisão, e `return` é identificador. Consertar: tratar como regex quando a palavra anterior for `return`, `typeof`, `case`… Pequeno; só vale se doer de novo.

### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
````

## Edicao 16 — `meta/IDEAS.md` · Concluidas: comeco de palavra

**Forma:** Substituir.

**Ancora:**

````
- **Busca sem acento, com trecho e levando o termo ao editor** — v13.6 / DEC-024.
````

**Substituir por:**

````
- **Busca por começo de palavra, `*` para «em qualquer parte», trecho na palavra mais longa** — v13.7 / DEC-025.
- **Busca sem acento, com trecho e levando o termo ao editor** — v13.6 / DEC-024.
````

## Edicao 17 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.6** — 2026-11-06 — busca sem acento com trecho, atalhos de teclado e arrastar para importar (DEC-024). Arquivo canônico `index.html`. Testes: `smoke` 101/101 e `history` 52/52 (rodada da wo0010).
````

**Substituir por:**

````
**Lunoda v13.7** — 2026-11-07 — busca por começo de palavra, `*` na frente para «em qualquer parte» e trecho ancorado na palavra mais longa (DEC-025). Arquivo canônico `index.html`. Testes: `smoke` 113/113 e `history` 52/52 (rodada da wo0012).
````

## Edicao 18 — `meta/STATUS.md` · funcionando: comeco de palavra

**Forma:** Substituir.

**Ancora:**

````
- Busca sem acento e por palavras, com trecho destacado; abrir pela busca leva o termo ao filtro de blocos (v13.6).
````

**Substituir por:**

````
- Busca sem acento e por palavras, com trecho destacado; abrir pela busca leva o termo ao filtro de blocos (v13.6).
- Busca por começo de palavra (`co` acha «conversa», não «acordo»); `*` na frente casa em qualquer parte; trecho ancorado na palavra mais longa, sem marca partida (v13.7).
````

## Edicao 19 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- Nada em andamento. **v13.0 a v13.6 conferidas pelo autor** (v13.6 em 2026-11-07 [relatado pelo dono]). A próxima frente não foi decidida — opções e recomendação em `logs/2026-11-07.md`.
````

**Substituir por:**

````
- **v13.7 aguardando a conferência do autor no navegador** (roteiro na conversa de 2026-11-07). v13.0 a v13.6 conferidas pelo autor (v13.6 em 2026-11-07 [relatado pelo dono]).
````

## Edicao 20 — `meta/STATUS.md` · backlog: conferir a v13.7

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Escolher a próxima frente** — opções em `logs/2026-11-07.md` (recomendada: A, refino do trecho da busca). Ponto em aberto da A: palavra da busca casa só no começo de palavra, ou em qualquer parte sem destacar as de 1–2 letras, ou as duas?
````

**Substituir por:**

````
- [ ] **Conferir a v13.7 no navegador** — roteiro na conversa de 2026-11-07: «co» acha «conversa» e não «acordo»; `*cor` acha «acordo»; o trecho de «transferencia de co» mostra «transferência» inteira; a nota da busca na lista do `?`.
````

## Edicao 21 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-07** — v13.6 conferida pelo autor [relatado pelo dono]. Achado do dono num print: com «transferencia de co», o trecho se ancora na primeira palavra («co») e corta a longa («tra…»); reproduzido e registrado no IDEAS, não corrigido. Encerrada a conversa de 3 a 7/11 (v13.0 → v13.6, wo0001 a wo0011) com transferência: brief `../261107-HANDOFF-BRIEF.md`, fora do repositório.
````

**Substituir por:**

````
**2026-11-07 (conversa nova)** — wo0011 conferida e arquivada com o brief. Escolhida a frente A; o autor decidiu a regra da busca (DEC-025): começo de palavra em todas as palavras, `*` na frente para «em qualquer parte», trecho na palavra mais longa sem partir a marca; a C ficou de fora. Entregue a v13.7 (wo0012).
````

## Edicao 22 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** na conversa nova, escolher a próxima frente (A recomendada) e responder o ponto em aberto da busca.
````

**Substituir por:**

````
**Próximo passo óbvio:** o autor confere a v13.7 pelo roteiro; depois, escolher a próxima frente entre B, C, D e E (`logs/2026-11-07.md`).
````

## Edicao 23 — `logs/2026-11-07.md` · secao do chat (conversa 2)

**Forma:** Substituir.

**Ancora:**

````
- Commit da wo0011: `27f6412`, empurrado (`main...origin/main` em dia). Relatório: `../261107-0909-code-lunoda-apply-wo0011.txt`.
````

**Substituir por:**

````
- Commit da wo0011: `27f6412`, empurrado (`main...origin/main` em dia). Relatório: `../261107-0909-code-lunoda-apply-wo0011.txt`.

## Conversa 2 — chat (refino da busca, wo0012)

### Feito
- Ritual; wo0011 conferida: `27f6412` + wrap `550bfc8` em `origin/main`, árvore limpa [medido por instrumento: `git log`, `git status`]. Os dois relatórios e o brief arquivados MOVENDO para `notas-arquivadas`.
- Pesquisado como a comunidade resolve o casamento de palavras: busca «enquanto digita» (Algolia, Meilisearch) casa no começo da palavra por padrão — na Algolia e no Meilisearch, só a última palavra como prefixo; FTS5 e Lucene casam a palavra inteira e pedem o prefixo com `*`; o `%` é do `LIKE` do SQL.
- Escrita a wo0012 (v13.7), implementada e testada numa cópia do HEAD `550bfc8`: smoke 113/0, history 52/0 [medido por instrumento]. Onze mutantes (começo sempre verdadeiro, `*` ignorado, sem troca letra↔número, sem regra do símbolo, âncora na primeira, sem borda direita, sem borda esquerda, empate com a última, `*` no fim mantido, trecho por `indexOf`, entrada por `includes`): todos derrubam pelo menos uma asserção [medido por instrumento]. A WO foi simulada lendo as edições do próprio arquivo, sobre uma cópia limpa.
- Gravados pelo chat: `meta/CONTEXT.md` (busca e armadilha do extrator), `README.md` (v13.7, busca) e `meta/GLOSSARY.md` («Começo de palavra»).

### Decisões
- **DEC-025** (autor, 2026-11-07): começo de palavra em todas as palavras; `*` na frente = em qualquer parte; `*` no fim descartado; trecho ancorado na palavra mais longa, a borda cresce para não partir a marca; a opção (b) descartada; a C fica de fora.

### Aprendizados / armadilhas
- O `extractFunction` do smoke lê `return /…/` como divisão (a função nova não extraía); contornado guardando a regex numa constante. Registrado no CONTEXT e no IDEAS.
- A seção do Code da wo0011 neste log trazia de novo os escapes do intervalo de acentos como caracteres combinantes literais (4 caracteres), embora dissesse «corrigido» — era a correção da Edição 6 do IDEAS, não do log. A wo0012 troca pelo texto.

## Onde parei
wo0012 entregue para o Code; falta aplicar e o autor conferir no navegador.

## Próximos passos
- Aplicar a wo0012 no Code.
- Autor: roteiro da v13.7.
- Depois: escolher a próxima frente entre B, C, D e E.
````

## Edicao 24 — `logs/2026-11-07.md` · combinantes literais da secao do Code viram texto

**Forma:** comando (sem ancora: o trecho tem caracteres combinantes, que nao se recortam com seguranca). Rode na raiz do repositorio, DEPOIS da Edicao 23:

```
node -e "const fs=require('fs');const f='logs/2026-11-07.md';const B=String.fromCharCode(92);const A=String.fromCharCode(0x300),Z=String.fromCharCode(0x36f);const t=fs.readFileSync(f,'utf8');const p=A+'-'+Z;const n=t.split(p).length-1;fs.writeFileSync(f,t.split(p).join(B+'u0300-'+B+'u036f'));console.log(n)"
```

Esperado: imprime `2` (dois pares trocados). Depois, `node -e "const t=require('fs').readFileSync(process.argv[1],'utf8');let n=0;for(const c of t){const k=c.codePointAt(0);if(k>=0x300&&k<=0x36f)n++}console.log(n)" logs/2026-11-07.md` -> `0`. Outro numero: **PARE e reporte**.

## Edicao 25 — `logs/2026-11-07.md` · secao do Code

Acrescente no FIM do arquivo `## Conversa 2 — Code (execucao, wo0012)` com o seu relatorio resumido, com UMA linha em branco antes.

---

## Fora de escopo

- `STORAGE_KEY = 'base_v4'`: NAO mexer.
- camelCase como comeco de palavra, frase exata entre aspas, conserto do `extractFunction`: so registrados no IDEAS (Edicao 15), NAO fazer.
- A ideia C (`base_v4` ilegivel): NAO entra (decisao do autor).
- Nenhum outro uso do `searchTokens` muda: o filtro de blocos herda a regra pelas mesmas funcoes.

## Armadilhas desta WO

- **Escapes `\u0300-\u036f`:** a Edicao 6 (corpo do `searchSnippet`) os contem e tem de gravar a barra e o `u` como TEXTO. A conferencia abaixo (`grep -c 'u0300-'` e o contador de combinantes) pega a conversao.
- **Regex depois de `return`:** nao «simplifique» `const re = /…/; return re.test(c)` para `return /…/.test(c)` — o smoke deixa de extrair a funcao (`ReferenceError`/`SyntaxError` estranho).
- O smoke extrai as funcoes por nome; as quatro novas (`isWordChar`, `isWordStart`, `findWord`, `wordLen`) entram na lista da Edicao 9 — sem ela, `findWord is not defined`.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux, Node); o Git Bash do Code nao foi testado.

- [ ] `git status --short` -> exatamente `M` em: `README.md index.html logs/2026-11-07.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/STATUS.md tests/README.md tests/smoke.mjs`, e `??` nesta WO. Nada alem.
- [ ] smoke `113 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · sintaxe `SINTAXE_OK` (comando abaixo) · `wc -l index.html` -> `4104` · `sha1sum index.html` -> `ca8abc7ccf8fcc51ca7b41c6eff7f1542f104452`.
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"`
- [ ] **Escapes intactos:** `grep -c 'u0300-' index.html` -> **3** (eram 3) · combinantes literais (`node -e "const t=require('fs').readFileSync(process.argv[1],'utf8');let n=0;for(const c of t){const k=c.codePointAt(0);if(k>=0x300&&k<=0x36f)n++}console.log(n)" <arquivo>`): `index.html` 0 · `tests/smoke.mjs` 0 · `meta/IDEAS.md` 0 · `logs/2026-11-07.md` 0 (era 4, antes da Edicao 24).
- [ ] Ocorrencias no `index.html` (`grep -oF "..." index.html | wc -l`): `function isWordChar(` 1 · `function isWordStart(` 1 · `function findWord(` 1 · `function wordLen(` 1 · `findWord(` 6 · `.includes(w)` **0** · `DEC-025` 3 · `base_v4` **1**.
- [ ] Smoke: `grep -c "check('busca\|check('trecho\|check('Alt+setas" tests/smoke.mjs` -> 33 (eram 21).
- [ ] Docs: `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.7.0] — 2026-11-07`, `## [13.6.0] — 2026-11-06` · `grep -c "^## DEC-025" meta/DECISIONS.md` -> 1 · `grep -c "^\*\*Lunoda v13.7\*\*" meta/STATUS.md` -> 1 · `grep -c "113 asserções" tests/README.md` -> 1 · `grep -c "^### 2026-11-07 — Busca" meta/IDEAS.md` -> 2 · `grep -c "" meta/STATUS.md meta/IDEAS.md meta/DECISIONS.md meta/CHANGELOG.md logs/2026-11-07.md` -> 62 · 271 · 558 · 201 · 67 (o log, ANTES da secao do Code).
- [ ] **Teste no navegador — NAO e seu.** O autor passa o roteiro v13.7.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0012.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/smoke.mjs tests/README.md README.md meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/STATUS.md logs/2026-11-07.md meta/workorders/261107-wo0012-v13-7-busca-comeco-de-palavra.md
```

```
git commit -m "feat: busca por comeco de palavra e trecho na palavra mais longa" -m "v13.7, DEC-025. Cada palavra casa no comeco de uma palavra do texto (co acha conversa, nao acordo); * na frente casa em qualquer parte. O trecho se ancora na palavra mais longa e a janela cresce para nao partir a marca. Smoke com 12 assercoes novas (113)."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-07 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
