# WO 0014 — v13.8: exportar so os blocos selecionados (F7) e chave `base_v4` ilegivel guardada (DEC-026)

> **Tipo:** mista — CODIGO (`index.html`, `tests/smoke.mjs`) + DOC (`tests/README.md`, DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, log).
> **Config sugerida:** Sonnet, `/effort` medio. Codigo e texto prontos, ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD `42cc085` (wo0013). `sha1sum index.html` = `ca8abc7ccf8fcc51ca7b41c6eff7f1542f104452`. Arvore: `M` so nos 3 arquivos gravados pelo chat, `??` no log novo e nesta WO (hashes abaixo). ANTES: smoke `113 ok, 0 falha(s)` e history `52 ok, 0 falha(s)`.
> **Base:** o autor escolheu em 2026-11-10 as frentes D (exportar so os blocos selecionados, F7) e C (`base_v4` ilegivel, IDEAS de 2026-11-06), juntas. O COMO e do chat e esta em DEC-026 (Edicao 11).
> **Depende de:** wo0013 (aplicada).
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e `tests/README.md`. CONTEXT, GLOSSARY, README e o log novo o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
f667918160cd5ecc9f62f0a2b335277edfaa07b7  meta/CONTEXT.md
d5850e1611aeaa4e4c704cee70db43e145e56271  README.md
18bfce18db7489c86370a18d553510b3ca2bb348  meta/GLOSSARY.md
c1ef321763daf9e49760ad28353fa776d0a3e34d  logs/2026-11-10.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia do repositorio em `42cc085` (`git archive HEAD`, 2026-11-10 ~12:30), cada uma com `count == 1`, aplicadas em ordem. A WO foi simulada lendo as edicoes deste proprio arquivo. **Nenhuma edicao e de remocao de linha**, e nenhuma ancora ou texto novo comeca ou termina em quebra de linha. Nenhuma edicao contem escape `\u`.

---

## 1. Por que

- **D:** tirar de uma entrada so os trechos que importam exigia copiar a entrada, apagar blocos e exportar. Agora: selecionar os blocos e clicar **MD** ou **HTML** na barra de selecao.
- **C:** se o texto da `base_v4` nao abre, o `loadDB` caia para as chaves legadas e o proximo salvamento sobrescrevia a `base_v4` — que talvez desse para recuperar. Agora o texto cru fica guardado, as legadas nao sao tentadas e o app avisa ao abrir.

## 2. Contexto factual

- **Medido (Node, funcoes reais extraidas pelo smoke):** smoke 124 ok, 0 falha(s); history 52 ok, 0 falha(s). As 113 assercoes antigas passam sem mudanca.
- **Prova de vida (medido):** nove mutantes — cair para a legada, nao guardar a copia, duplicar a copia, «guardado» sempre verdadeiro, aviso no caso legivel, export sem filtro, na ordem da selecao, com as propriedades da entrada inteira, mexendo na entrada original — todos derrubam o smoke (o ultimo derruba a execucao).
- **Medido no Chromium** (copia com o `index.html` simulado): a barra de selecao mostra MD e HTML; com 2 de 3 blocos selecionados o `.md` baixado tem `Total de blocos:** 2`, os dois blocos certos e reimporta como 1 entrada; com mudanca pendente aparece «Salve a entrada primeiro (Ctrl+S)» e nada baixa; `base_v4` quebrada abre vazio, cria `base_v4_ilegivel_…` igual ao texto e mostra o aviso. Nenhum erro de JS.
- `exportSelectedBlocks` nao muda estado: nao entra no embrulho do undo (history 52/0 sem mudanca).
- O `confirm` do aviso so roda quando `unreadableAtLoad` foi preenchido — nunca no caso normal.

## Inventario

Exports do editor achados por `grep -n 'function export' index.html` no HEAD: 6 (`exportAllJSON`, `exportAllMD`, `exportCurrentMD`, `exportCurrentJSON`, `exportCurrentHTML`, `exportAllHTML`) — nenhum muda; o novo reusa `entryToMD`, `entryFrontmatter`, `buildEntryHTML`, `dl`. Leitura do armazenamento: 1 lugar (`loadDB`), mudado. 21 edicoes por ancora + a secao do Code no log.

---

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `42cc085`; `sha1sum index.html` = `ca8abc7ccf8fcc51ca7b41c6eff7f1542f104452`; `sha1sum -c` nas 4 linhas acima -> `OK`. smoke `113 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · C: guardar texto cru antes do loadDB

**Forma:** Substituir.

**Ancora:**

````
function loadDB() {
  const keys = [STORAGE_KEY, 'base_notas_v3', 'base_notas_v2', 'nexus_db_v4'];
  for (const k of keys) {
    try {
      const raw = localStorage.getItem(k);
      if (!raw) continue;
````

**Substituir por:**

````
/* Chave base_v4 presente mas ilegível (DEC-026): o texto cru vai para uma chave
   à parte, `base_v4_ilegivel_<data ISO>`, antes que o próximo salvamento o
   apague. Abrir de novo com o mesmo texto não duplica a cópia. Sem espaço para
   a cópia (cota), anota que não guardou — o aviso oferece baixar o texto. */
const UNREADABLE_PREFIX = 'base_v4_ilegivel_';
let unreadableAtLoad = null;   // { guardado, chave, raw } — lido por warnUnreadableAtLoad
function keepUnreadable(raw) {
  let chave = null;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(UNREADABLE_PREFIX) && localStorage.getItem(k) === raw) { chave = k; break; }
    }
    if (!chave) {
      const nova = UNREADABLE_PREFIX + new Date().toISOString();
      localStorage.setItem(nova, raw);
      chave = nova;
    }
  } catch (_) { chave = null; }   // cota cheia ou armazenamento bloqueado
  unreadableAtLoad = { guardado: !!chave, chave, raw };
}

function loadDB() {
  const keys = [STORAGE_KEY, 'base_notas_v3', 'base_notas_v2', 'nexus_db_v4'];
  for (const k of keys) {
    let raw = null;
    try {
      raw = localStorage.getItem(k);
      if (!raw) continue;
````

## Edicao 2 — `index.html` · C: loadDB nao cai para a legada

**Forma:** Substituir.

**Ancora:**

````
    } catch(e) { /* continue */ }
````

**Substituir por:**

````
    } catch(e) {
      // base_v4 presente mas ilegível: guarda o texto cru e NÃO cai para as chaves
      // legadas — abrir o acervo antigo e salvar por cima apagaria o que ainda dá
      // para recuperar à mão (DEC-026). As legadas só valem quando não há base_v4.
      if (k === STORAGE_KEY && raw) { keepUnreadable(raw); break; }
    }
````

## Edicao 3 — `index.html` · C: aviso ao abrir

**Forma:** Substituir.

**Ancora:**

````
db = loadDB();
renderTableHead();
````

**Substituir por:**

````
db = loadDB();
warnUnreadableAtLoad();
renderTableHead();
````

## Edicao 4 — `index.html` · D: botoes MD e HTML na barra de selecao

**Forma:** Substituir.

**Ancora:**

````
        <div class="blk-mass-sp"></div>
````

**Substituir por:**

````
        <div class="blk-mass-sep"></div>
        <button class="blk-mass-btn" onclick="exportSelectedBlocks('md')" title="Exportar só os blocos selecionados em Markdown, com o cabeçalho da entrada">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> MD
        </button>
        <button class="blk-mass-btn" onclick="exportSelectedBlocks('html')" title="Exportar só os blocos selecionados em HTML (abrível no navegador, imprimível como PDF)">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> HTML
        </button>
        <div class="blk-mass-sp"></div>
````

## Edicao 5 — `index.html` · D e C: funcoes de exportar blocos e aviso da chave ilegivel

**Forma:** Substituir.

**Ancora:**

````
/* ── helpers de escape para HTML ── */
````

**Substituir por:**

````
/* Entrada só com os blocos escolhidos, na ordem da entrada (F7, DEC-026).
   As propriedades da entrada são recalculadas a partir DESSES blocos — o bloco
   é a fonte de verdade (DEC-003), e o cabeçalho não pode citar opção de um
   bloco que ficou de fora. Pura: não mexe na entrada original. */
function entryWithBlocks(e, ids) {
  const blocks = (e.blocks || []).filter(b => ids.has(b.id));
  const pv = {};
  Object.keys(e.propertyValues || {}).forEach(pid => { pv[pid] = []; });
  blocks.forEach(b => Object.entries(b.blockProps || {}).forEach(([pid, opts]) => {
    const alvo = pv[pid] || (pv[pid] = []);
    (opts || []).forEach(o => { if (!alvo.includes(o)) alvo.push(o); });
  }));
  return { ...e, blocks, propertyValues: pv };
}

/* Exporta só os blocos selecionados da entrada aberta, em Markdown ou HTML
   (F7, DEC-026). Usa a entrada SALVA, como os outros exports do editor: com
   mudança pendente, pede para salvar antes. Age em todos os selecionados,
   inclusive os escondidos pelo filtro, como as outras ações em massa (DEC-016).
   O .md sai no formato de sempre, com «Total de blocos» = os exportados: a
   reimportação o lê como uma entrada (DEC-022). */
function exportSelectedBlocks(fmt) {
  const e = db.entries.find(x => x.id === currentId);
  if (!e || isEditorDirty()) { showToast('Salve a entrada primeiro (Ctrl+S)'); return; }
  const sub = entryWithBlocks(e, selectedBlockIds);
  const n = sub.blocks.length;
  if (!n) { showToast('Selecione ao menos um bloco'); return; }
  const nome = (e.title || 'nota') + '_' + n + (n === 1 ? '-bloco' : '-blocos');
  if (fmt === 'html') {
    dl(buildEntryHTML(sub, true), nome + '.html', 'text/html');
  } else {
    // Arquivo com uma entrada só: o frontmatter da entrada vale, como no export da entrada
    const head = mdFrontmatterOn() ? entryFrontmatter(sub) : '';
    dl(head + entryToMD(sub), nome + '.md', 'text/markdown');
  }
  const hid = hiddenSelectedCount();
  showToast(`${n} bloco${n === 1 ? '' : 's'} exportado${n === 1 ? '' : 's'} (${fmt === 'html' ? 'HTML' : 'MD'})`
    + (hid > 0 ? ` · inclui ${hid} fora do filtro` : ''));
}

/* Aviso da chave base_v4 ilegível, logo depois de abrir (DEC-026).
   OK baixa o texto cru como arquivo — necessário quando não coube a cópia. */
function warnUnreadableAtLoad() {
  const u = unreadableAtLoad;
  if (!u) return;
  const onde = u.guardado
    ? 'Uma cópia do texto ficou guardada neste navegador, na chave «' + u.chave + '».'
    : 'NÃO coube uma cópia no armazenamento do navegador: baixe o texto agora, senão o próximo salvamento o apaga.';
  if (confirm('OS DADOS SALVOS NÃO PUDERAM SER LIDOS\n\n'
    + 'O texto da chave base_v4 está corrompido ou incompleto, e o app abriu sem as suas entradas. '
    + onde + '\n\nOK = baixar o texto como arquivo agora (para recuperar à mão).\n'
    + 'Antes de criar ou salvar qualquer coisa, importe o seu último backup JSON, se tiver.')) {
    dl(u.raw, 'lunoda_base_v4_ilegivel_' + dateSlug() + '.txt', 'text/plain');
  }
}

/* ── helpers de escape para HTML ── */
````

## Edicao 6 — `tests/smoke.mjs` · C: ambiente do nucleo com setItem e cota cheia

**Forma:** Substituir.

**Ancora:**

````
  const CORE = ['calcPropertyValues', 'calcPropertyValuesFor', 'calcPropertyValuesForBlocks',
                'migrateOptionModes', 'loadDB', 'normalizeImportedDB', 'mergeImportedProperties'];
````

**Substituir por:**

````
  const CORE = ['calcPropertyValues', 'calcPropertyValuesFor', 'calcPropertyValuesForBlocks',
                'migrateOptionModes', 'keepUnreadable', 'loadDB', 'normalizeImportedDB', 'mergeImportedProperties'];
````

## Edicao 7 — `tests/smoke.mjs` · C: localStorage falso completo

**Forma:** Substituir.

**Ancora:**

````
  const core = (store = {}, dbProps = [], blocks = [], blockProps = {}) => {
    let n = 0; const toasts = [];
    const ls = { getItem: k => (k in store ? store[k] : null) };
    const api = new Function('db', 'editBlocks', 'editBlockProps', 'localStorage', 'uid', 'randColor',
      'showToast', 'STORAGE_KEY', `${coreSrc}\nreturn { ${CORE.join(', ')} };`)(
````

**Substituir por:**

````
  // `cheio` = setItem estoura a cota (DEC-026). unreadableAtLoad e o prefixo são do script, não funções.
  const core = (store = {}, dbProps = [], blocks = [], blockProps = {}, cheio = false) => {
    let n = 0; const toasts = [];
    const ls = { getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { if (cheio) throw Object.assign(new Error('cota'), { name: 'QuotaExceededError' }); store[k] = String(v); },
      key: i => Object.keys(store)[i] ?? null, get length() { return Object.keys(store).length; } };
    const api = new Function('db', 'editBlocks', 'editBlockProps', 'localStorage', 'uid', 'randColor',
      'showToast', 'STORAGE_KEY', `const UNREADABLE_PREFIX = 'base_v4_ilegivel_';\nlet unreadableAtLoad = null;\n${coreSrc}\nreturn { ${CORE.join(', ')}, get unreadable() { return unreadableAtLoad; } };`)(
````

## Edicao 8 — `tests/smoke.mjs` · C: assercoes da chave ilegivel

**Forma:** Substituir.

**Ancora:**

````
  // normalizeImportedDB: o caminho de restaurar um backup JSON
````

**Substituir por:**

````
  // Chave base_v4 ilegível (DEC-026): guarda o texto cru e não cai para a legada
  const quebrado = '{"properties":[{"id":';
  const copiasDe = s => Object.keys(s).filter(k => k.startsWith('base_v4_ilegivel_'));
  const sti = { base_v4: quebrado, base_notas_v3: J(legado) };
  const ci = core(sti); const li = ci.loadDB();
  check('ilegivel: base_v4 quebrada nao cai para a chave legada (abre o banco padrao)',
    li.entries.length === 0 && J(li.properties.map(p => p.id)) === J(['p-tags', 'p-ia']) && !ci.toasts.includes('Dados anteriores migrados ✓'),
    J(li.entries.map(e => e.id)));
  check('ilegivel: o texto cru fica numa chave a parte, igual, e a base_v4 nao e tocada',
    copiasDe(sti).length === 1 && sti[copiasDe(sti)[0]] === quebrado && sti.base_v4 === quebrado, J(copiasDe(sti)));
  check('ilegivel: o aviso sabe que guardou e onde',
    !!ci.unreadable && ci.unreadable.guardado && ci.unreadable.chave === copiasDe(sti)[0] && ci.unreadable.raw === quebrado);
  const velha = 'base_v4_ilegivel_2020-01-01T00:00:00.000Z';
  const std = { base_v4: quebrado, [velha]: quebrado }; const cd = core(std); cd.loadDB();
  check('ilegivel: abrir de novo com o mesmo texto nao duplica a copia (reusa a que ja existe)',
    copiasDe(std).length === 1 && cd.unreadable.chave === velha, J(copiasDe(std)));
  const stc = { base_v4: quebrado }; const cc = core(stc, [], [], {}, true); const lc = cc.loadDB();
  check('ilegivel: sem espaco para a copia, abre mesmo assim e o aviso diz que nao guardou',
    lc.entries.length === 0 && !!cc.unreadable && !cc.unreadable.guardado && cc.unreadable.raw === quebrado && copiasDe(stc).length === 0);
  const cl = core({ base_v4: J({ properties: [], entries: [] }) }); cl.loadDB();
  check('ilegivel: base_v4 legivel nao gera copia nem aviso', cl.unreadable === null);

  // normalizeImportedDB: o caminho de restaurar um backup JSON
````

## Edicao 9 — `tests/smoke.mjs` · D: assercoes de exportar so os blocos selecionados

**Forma:** Substituir.

**Ancora:**

````
    check('pular: nada muda no que ja existe', JSON.stringify(cheio2.entries) === JSON.stringify(fresco().entries));
````

**Substituir por:**

````
    check('pular: nada muda no que ja existe', JSON.stringify(cheio2.entries) === JSON.stringify(fresco().entries));

    // Exportar só os blocos selecionados (F7, DEC-026): o .md parcial volta como uma entrada válida
    const EW = new Function(`${extractFunction(html, 'entryWithBlocks')}\nreturn entryWithBlocks;`)();
    const JS = x => JSON.stringify(x);
    const o0 = fresco().entries[0], o0txt = JS(o0);
    const sub = EW(o0, new Set([o0.blocks[2].id, o0.blocks[0].id]));
    check('blocos: so os escolhidos, na ordem da entrada (nao na da selecao)',
      JS(sub.blocks.map(b => b.id)) === JS([o0.blocks[0].id, o0.blocks[2].id]), JS(sub.blocks.map(b => b.id)));
    check('blocos: a entrada original nao muda', JS(o0) === o0txt);
    const pv = EW({ propertyValues: { pA: ['o1', 'o2'], pB: ['o3'] },
      blocks: [{ id: 'x', blockProps: { pA: ['o2'] } }, { id: 'y', blockProps: { pA: ['o1'], pB: ['o3'] } }] }, new Set(['x'])).propertyValues;
    check('blocos: propriedades da entrada = so as dos blocos exportados', JS(pv) === JS({ pA: ['o2'], pB: [] }), JS(pv));
    const rs = A.parseLunodaMD(A.entryFrontmatter(sub) + A.entryToMD(sub));
    const lida = rs.entries[0] || { blocks: [] };
    check('blocos: o .md parcial volta como uma entrada valida, com os blocos e o conteudo certos',
      !rs.erro && rs.entries.length === 1 && lida.id === o0.id && JS(lida.blocks.map(b => b.id)) === JS(sub.blocks.map(b => b.id))
      && lida.blocks.every((b, j) => b.content === (sub.blocks[j].content || '')), `erro ${rs.erro}, lidas ${rs.entries.length}`);
    check('blocos: nenhum escolhido = entrada sem blocos (o export avisa e nao baixa)', EW(o0, new Set()).blocks.length === 0);
````

## Edicao 10 — `tests/README.md` · smoke cobre a chave ilegivel e o export de blocos

**Forma:** Substituir.

**Ancora:**

````
e a marca que cruza a borda puxando a borda. 113 asserções no total.
````

**Substituir por:**

````
e a marca que cruza a borda puxando a borda. Desde a v13.8 (DEC-026), a **chave `base_v4` ilegível** (não cai para a legada, cópia igual, sem duplicar, cota cheia, caso legível) e o **export só dos blocos selecionados** (ordem da entrada, original intacta, propriedades recalculadas, ida e volta do `.md` parcial). 124 asserções no total.
````

## Edicao 11 — `meta/DECISIONS.md` · DEC-026 no fim

**Forma:** Substituir.

**Ancora:**

````
Palavras curtas deixam de acender em tudo, e o trecho mostra a palavra que importa. Buscar o meio de uma palavra passa a pedir `*` — quem buscava «versa» para achar «conversa» agora digita `*versa`. Os `.md`, o JSON e o `localStorage` não mudam.
````

**Substituir por:**

````
Palavras curtas deixam de acender em tudo, e o trecho mostra a palavra que importa. Buscar o meio de uma palavra passa a pedir `*` — quem buscava «versa» para achar «conversa» agora digita `*versa`. Os `.md`, o JSON e o `localStorage` não mudam.

---

## DEC-026 — Exportar só os blocos selecionados (F7); chave `base_v4` ilegível guardada, sem cair para a legada
**Data:** 2026-11-10 · **Status:** aceita · origem: conversa de 2026-11-10 (frentes D e C, escolhidas pelo autor); ideia da C no IDEAS (2026-11-06)

### Contexto
- **D:** para tirar de uma entrada só os trechos que importam, era preciso copiar a entrada inteira, apagar blocos e exportar. A F7 trazia a ideia desde a v12.
- **C:** se o texto da `base_v4` não abrisse (JSON quebrado), o `loadDB` seguia para as chaves antigas; com alguma presente, abria o acervo **antigo** e o próximo salvamento sobrescrevia a `base_v4` — que talvez desse para recuperar à mão. Sem chave antiga, abria o banco padrão e também sobrescrevia. Medido ao escrever os testes do núcleo (v13.5.1).

### Decisão
- **D — exportar blocos:** botões **MD** e **HTML** na barra de seleção de blocos (`exportSelectedBlocks`). O arquivo é a entrada só com os blocos escolhidos (`entryWithBlocks`, pura): cabeçalho da entrada (título, descrição, datas, ID), blocos na **ordem da entrada**, propriedades da entrada **recalculadas a partir desses blocos** (DEC-003). Usa a entrada **salva**, como os outros exports do editor — com mudança pendente, pede para salvar. Age em **todos** os selecionados, inclusive os escondidos pelo filtro (DEC-016), e o aviso diz quantos estavam fora do filtro. O `.md` sai no formato de sempre, com «Total de blocos» = os exportados, e com o frontmatter da entrada quando ligado: a reimportação o lê como **uma entrada**, de mesmo ID (pular ou cópia, DEC-022). Nome: `<título>_<n>-blocos.md`/`.html`.
- **C — chave ilegível:** com `base_v4` presente e ilegível (ou com formato que quebra a migração), o `loadDB` guarda o texto cru em `base_v4_ilegivel_<data ISO>` (`keepUnreadable`) — se já houver uma cópia igual, reusa —, **não** tenta as chaves legadas e abre o banco padrão. Ao abrir, `warnUnreadableAtLoad` mostra um `confirm` que explica, diz onde está a cópia e oferece **baixar o texto** como arquivo. Sem espaço para a cópia (cota), o aviso diz que não guardou e que é preciso baixar antes de salvar. As chaves legadas continuam valendo quando não há `base_v4`.

### Alternativas consideradas
- **D — exportar o estado do editor sem salvar:** mais cômodo, mas o arquivo poderia trazer o que o acervo não tem; os exports do editor já exigem a entrada salva.
- **D — manter a numeração original dos blocos** («Bloco 3 de 7»): mudaria o formato do `.md`, que é contrato do leitor (DEC-022); o subtítulo e a versão já identificam o bloco.
- **D — título com sufixo** («(3 de 7 blocos)»): mudaria o dado; o sufixo vai no nome do arquivo.
- **C — bloquear todo salvamento até resolver:** protege mais, mas trava o app num estado que o autor não sabe desfazer; a cópia + o download cobrem o caso.
- **C — uma chave fixa `base_v4_ilegivel`:** uma segunda falha apagaria a primeira cópia; a data no nome evita.

### Consequências
Exportar um pedaço de conversa passa a ser selecionar e clicar; o arquivo parcial é um `.md` do Lunoda como os outros. Um acervo corrompido deixa de ser sobrescrito em silêncio: o texto fica guardado (ou baixado) para recuperar. A cópia ocupa espaço no `localStorage` até ser apagada à mão — o aviso de 80% da cota continua valendo.
````

## Edicao 12 — `meta/CHANGELOG.md` · [13.8.0] acima da 13.7.0

**Forma:** Substituir.

**Ancora:**

````
## [13.7.0] — 2026-11-07
````

**Substituir por:**

````
## [13.8.0] — 2026-11-10

### Adicionado
- **Exportar só os blocos selecionados** (DEC-026): botões **MD** e **HTML** na barra de seleção de blocos. O arquivo leva o cabeçalho da entrada, os blocos na ordem da entrada e as propriedades só desses blocos; o `.md` reimporta como uma entrada.
- `tests/smoke.mjs` cobre a chave ilegível e o export de blocos (11 asserções novas, 124 no total).

### Corrigido
- **Dados salvos ilegíveis não são mais sobrescritos em silêncio** (DEC-026): se a `base_v4` não abre, o app guarda uma cópia do texto, não abre mais o acervo antigo das chaves legadas e avisa ao abrir, oferecendo baixar o texto.

## [13.7.0] — 2026-11-07
````

## Edicao 13 — `meta/IDEAS.md` · ideia da chave ilegivel: status

**Forma:** Substituir.

**Ancora:**

````
> **Status:** aberta — achado medido ao escrever os testes do núcleo; não corrigido (raro e pede decisão).
````

**Substituir por:**

````
> **Status:** implementada na v13.8 (DEC-026) — a cópia vai para `base_v4_ilegivel_<data ISO>` (sem duplicar), o aviso oferece baixar o texto, e as legadas só valem sem `base_v4` — ver Concluídas.
````

## Edicao 14 — `meta/IDEAS.md` · Concluidas: export de blocos e chave ilegivel

**Forma:** Substituir.

**Ancora:**

````
- **Busca por começo de palavra, `*` para «em qualquer parte», trecho na palavra mais longa** — v13.7 / DEC-025.
````

**Substituir por:**

````
- **Exportar só os blocos selecionados (MD/HTML)** — v13.8 / DEC-026. Item da F7.
- **Chave `base_v4` ilegível guardada, sem cair para a legada** — v13.8 / DEC-026.
- **Busca por começo de palavra, `*` para «em qualquer parte», trecho na palavra mais longa** — v13.7 / DEC-025.
````

## Edicao 15 — `meta/ROADMAP.md` · F7: export de blocos feito

**Forma:** Substituir.

**Ancora:**

````
- Exportar apenas os blocos selecionados (MD/HTML) com header da entrada pai.
````

**Substituir por:**

````
- [x] Exportar apenas os blocos selecionados (MD/HTML) com header da entrada pai — v13.8, DEC-026.
````

## Edicao 16 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.7** — 2026-11-07 — busca por começo de palavra, `*` na frente para «em qualquer parte» e trecho ancorado na palavra mais longa (DEC-025). Arquivo canônico `index.html`. Testes: `smoke` 113/113 e `history` 52/52 (rodada da wo0012).
````

**Substituir por:**

````
**Lunoda v13.8** — 2026-11-10 — exportar só os blocos selecionados (MD/HTML) e chave `base_v4` ilegível guardada, sem cair para a legada (DEC-026). Arquivo canônico `index.html`. Testes: `smoke` 124/124 e `history` 52/52 (rodada da wo0014).
````

## Edicao 17 — `meta/STATUS.md` · funcionando: export de blocos e chave ilegivel

**Forma:** Substituir.

**Ancora:**

````
- Busca por começo de palavra (`co` acha «conversa», não «acordo»); `*` na frente casa em qualquer parte; trecho ancorado na palavra mais longa, sem marca partida (v13.7).
````

**Substituir por:**

````
- Busca por começo de palavra (`co` acha «conversa», não «acordo»); `*` na frente casa em qualquer parte; trecho ancorado na palavra mais longa, sem marca partida (v13.7).
- Exportar só os blocos selecionados em MD ou HTML, com o cabeçalho da entrada (v13.8).
- `base_v4` ilegível: cópia do texto em `base_v4_ilegivel_…`, sem cair para a chave legada, aviso ao abrir com opção de baixar (v13.8).
````

## Edicao 18 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- Nada em andamento. **v13.0 a v13.7 conferidas pelo autor** (v13.7 em 2026-11-09 [relatado pelo dono]). A próxima frente não foi decidida — opções em `logs/2026-11-07.md` (B, C, D, E).
````

**Substituir por:**

````
- **v13.8 aguardando a conferência do autor no navegador** (roteiro na conversa de 2026-11-10). v13.0 a v13.7 conferidas pelo autor (v13.7 em 2026-11-09 [relatado pelo dono]).
````

## Edicao 19 — `meta/STATUS.md` · backlog: conferir a v13.8

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Escolher a próxima frente** — B (`.zip`, depende da conferência do frontmatter acima), C (`base_v4` ilegível), D (exportar só os blocos selecionados), E (arrastar blocos); detalhe em `logs/2026-11-07.md`.
````

**Substituir por:**

````
- [ ] **Conferir a v13.8 no navegador** — roteiro na conversa de 2026-11-10: exportar 2 blocos em MD e HTML, pedido de salvar com mudança pendente, reimportar o `.md` parcial, e a chave ilegível numa janela anônima.
- [ ] **Depois: escolher a próxima frente** — B (`.zip`, depende da conferência do frontmatter acima) ou E (arrastar blocos); detalhe em `logs/2026-11-07.md`.
````

## Edicao 20 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-09** — wo0012 conferida (`3e88a60` + wrap `6a37cad`; smoke 113/0, history 52/0 no disco) e **roteiro v13.7 todo ok** [relatado pelo dono]. Antes, em 2026-11-07: frente A escolhida e a regra da busca decidida (DEC-025).
````

**Substituir por:**

````
**2026-11-10** — wo0013 conferida (`42cc085`). O autor escolheu as frentes D e C juntas: entregue a v13.8 (wo0014, DEC-026). Passo a passo da conferência do frontmatter no Obsidian (desbloqueia a B) entregue no chat.
````

## Edicao 21 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** escolher a próxima frente entre B, C, D e E (`logs/2026-11-07.md`).
````

**Substituir por:**

````
**Próximo passo óbvio:** o autor confere a v13.8 pelo roteiro; quando puder, confere o frontmatter no Obsidian (passo a passo de 2026-11-10) para destravar a B.
````

## Edicao 22 — `logs/2026-11-10.md` · secao do Code

Acrescente no FIM do arquivo, com UMA linha em branco antes, `## Code (execucao, wo0014)` com o seu relatorio resumido (depois do `sha1sum -c` da Edicao 0).

---

## Fora de escopo

- `STORAGE_KEY = 'base_v4'`: NAO mexer. As chaves legadas continuam na lista do `loadDB`.
- Exportar o estado NAO salvo do editor: NAO (decisao em DEC-026).
- Apagar a copia `base_v4_ilegivel_…` pelo app, ou bloquear salvamentos: NAO.
- B (`.zip`) e E (arrastar blocos): NAO.

## Armadilhas desta WO

- **Edicoes 1 e 2 andam juntas:** a 1 tira o `const` do `raw` (vira `let raw = null;` FORA do `try`), a 2 usa o `raw` no `catch`. Sem a 1, o `catch` da `ReferenceError`.
- **Edicao 5** traz `\n` dentro de strings JS do `confirm` (barra + `n` como TEXTO no arquivo, como nos `alert` que ja existem). Se a sua ferramenta transformar em quebra de linha real, a sintaxe quebra — a conferencia `SINTAXE_OK` e o sha1 pegam.
- **Acentos nos comentarios:** na wo0012 a ferramenta de edicao trocou acentos de comentarios por `\uXXXX` literal; o sha1 final abaixo pega. Se divergir, compare as linhas de comentario das Edicoes 1, 2 e 5 antes de qualquer outra coisa.
- O smoke declara `UNREADABLE_PREFIX` e `unreadableAtLoad` no proprio ambiente do nucleo (Edicao 7), como faz com a `foldMemo` da busca: sao constantes do script, nao funcoes.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux, Node); o Git Bash do Code nao foi testado.

- [ ] `git status --short` -> exatamente `M` em: `README.md index.html meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/smoke.mjs`, e `??` em `logs/2026-11-10.md` e nesta WO. Nada alem.
- [ ] smoke `124 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · sintaxe `SINTAXE_OK` (comando abaixo) · `wc -l index.html` -> `4196` · `sha1sum index.html` -> `f56d0f2e06d9abbe204f611c9d7194df8af10b7a`.
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"`
- [ ] Escapes e combinantes: `grep -c 'u0300-' index.html` -> **3** (inalterado) · combinantes literais (`node -e "const t=require('fs').readFileSync(process.argv[1],'utf8');let n=0;for(const c of t){const k=c.codePointAt(0);if(k>=0x300&&k<=0x36f)n++}console.log(n)" <arquivo>`): `index.html` 0 · `tests/smoke.mjs` 0 · `meta/DECISIONS.md` 0 · `meta/STATUS.md` 0.
- [ ] Ocorrencias no `index.html` (`grep -oF "..." index.html | wc -l`): `function keepUnreadable(` 1 · `function entryWithBlocks(` 1 · `function exportSelectedBlocks(` 1 · `function warnUnreadableAtLoad(` 1 · `exportSelectedBlocks('` 2 · `warnUnreadableAtLoad();` 1 · `keepUnreadable(raw); break;` 1 · `DEC-026` 5 · `base_v4` **9**.
- [ ] Smoke: `grep -c "check('ilegivel\|check('blocos:" tests/smoke.mjs` -> 11 (eram 0).
- [ ] Docs: `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.8.0] — 2026-11-10`, `## [13.7.0] — 2026-11-07` · `grep -c "^## DEC-026" meta/DECISIONS.md` -> 1 · `grep -c "^\*\*Lunoda v13.8\*\*" meta/STATUS.md` -> 1 · `grep -c "^- \[ \] \*\*Escolher a próxima frente" meta/STATUS.md` -> **0** · `grep -c "124 asserções" tests/README.md` -> 1 · `grep -c "^- \[x\] Exportar apenas os blocos selecionados" meta/ROADMAP.md` -> 1 · `grep -c "" meta/STATUS.md meta/IDEAS.md meta/DECISIONS.md meta/CHANGELOG.md meta/ROADMAP.md` -> 65 · 276 · 581 · 210 · 89.
- [ ] **Teste no navegador — NAO e seu.** O autor passa o roteiro v13.8.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0014.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/smoke.mjs tests/README.md README.md meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md logs/2026-11-10.md meta/workorders/261110-wo0014-v13-8-exportar-blocos-chave-ilegivel.md
```

```
git commit -m "feat: exportar so os blocos selecionados e guardar base_v4 ilegivel" -m "v13.8, DEC-026. Botoes MD e HTML na barra de selecao de blocos exportam a entrada so com aqueles blocos (cabecalho da entrada, propriedades recalculadas, reimporta como uma entrada). Se a base_v4 nao abre, o texto cru vai para base_v4_ilegivel_<data>, as chaves legadas nao sao tentadas e o app avisa ao abrir. Smoke com 11 assercoes novas (124)."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-10 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
