# WO 0009 — v13.5.1: testes do nucleo + duas correcoes da importacao (FIX-004, FIX-005)

> **Tipo:** mista — CODIGO (`index.html`, `tests/smoke.mjs`) + DOC (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, `tests/README.md`, log).
> **Config sugerida:** Sonnet, `/effort` medio. Codigo e texto prontos, ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD `672fa2f` (wrap da wo0008). `sha1sum index.html` = `99ab0b25239e2fea999702c8c7cfa24bbb3b8bbc`. Arvore limpa exceto `meta/CONTEXT.md` (modificado) e `logs/2026-11-06.md` (novo), gravados pelo chat (hashes abaixo), e esta WO. ANTES: smoke 54/0 e history 52/0.
> **Base:** frente A (testes do nucleo) escolhida pelo autor em 2026-11-06. Os testes acharam dois defeitos; a correcao minima de cada um vai junto (FIX-004, FIX-005).
> **Depende de:** wo0008.
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e a secao do Code no log. CONTEXT e o log novo o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
d5e0cc2fade4cc3b688a7e247936b6db251f0062  meta/CONTEXT.md
2bd6b4550bd0e2d3cc93637c3bd1194ddce80bc0  logs/2026-11-06.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia do repositorio em `672fa2f` (2026-11-06 ~17:40), cada uma com `count == 1`. A WO foi simulada lendo as edicoes deste proprio arquivo; o resultado foi testado no Chromium. **Nenhuma edicao desta WO e de remocao de linha** (licao do desvio da wo0008, Edicao 20).

---

## 1. Por que

O smoke cobria o export, a reimportacao do `.md` e o lembrete, mas nao o que, se quebrar, inutiliza backups: a carga do `localStorage`, a migracao de formatos antigos e a restauracao do backup JSON. Escrevendo esses testes apareceram dois defeitos reais:

- **FIX-004:** entrada sem blocos, ou com `blocks: []`, carregava e abria com **0 blocos** (a invariante do CONTEXT), no `loadDB` e na importacao. Lista vazia e verdadeira em JS, e o `loadDB` transformava «sem blocos» em lista vazia.
- **FIX-005:** mesclar um backup JSON descartava as **opcoes novas** de uma propriedade que ja existe. `p-tags` e `p-ia` tem o mesmo id em todo navegador, entao uma opcao criada em outro navegador sumia e as entradas importadas apontavam para um id inexistente.

## 2. Contexto factual

- **Medido no Chromium, versao atual (`99ab0b25…`):** abrir uma entrada salva sem `blocks` -> `editBlocks.length === 0`; mesclar um backup com a opcao «Trabalho» em `p-tags` -> opcoes de Tags continuam so as antigas. **Versao nova:** 1 bloco; «Trabalho» entra e o aviso diz `· 1 opção(ões) nova(s)`; recarregar mantem tudo; nenhum erro de JS.
- **Medido:** a restauracao de backup NAO passa pelo `loadDB`; a normalizacao estava dentro do `reader.onload` do `handleImport`, onde o smoke nao alcanca. Vai para `normalizeImportedDB` **com o mesmo corpo** (so muda o tratamento de 0 blocos e a checagem de formato: `entries` precisa ser lista).
- **Medido:** o backup do formato atual (a fixture) volta **identico** ao passar por `normalizeImportedDB`, e passar duas vezes da o mesmo que uma.
- **Prova de vida:** nove mutantes (desfazer cada correcao, aceitar qualquer modo na migracao, nao tirar repetidos no calculo, ler a chave legada antes, perder `createdAt` no import, sobrescrever opcao existente na mescla) — todos derrubam pelo menos 1 asserção.
- **Nao corrigido, so registrado** (IDEAS): `base_v4` ilegivel cai para a chave legada e o proximo salvamento sobrescreve o texto cru.
- `handleImport` nao esta na lista do embrulho do undo; extrair a normalizacao nao mexe no historico.

## Inventario

20 edicoes em 8 arquivos (+ 2 gravados pelo chat). Codigo: 5 no `index.html` (`loadDB` x2, funcoes novas, `handleImport` x2) e 1 no `tests/smoke.mjs` (26 asserções).

---

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `672fa2f`; `sha1sum index.html` = `99ab0b25239e2fea999702c8c7cfa24bbb3b8bbc`; `sha1sum -c` nas 2 linhas acima -> `OK`. smoke `54 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · loadDB legado: nunca 0 blocos

**Forma:** Substituir.

**Ancora:**

````
          const blocks = e.blocks || [{ id: uid(), subtitle: '', version: 1, content: e.content || '' }];
````

**Substituir por:**

````
          // Lista vazia também conta como «sem blocos»: nunca entrada com 0 blocos (FIX-004)
          const blocks = (e.blocks && e.blocks.length) ? e.blocks
            : [{ id: uid(), subtitle: '', version: 1, content: e.content || '' }];
````

## Edicao 2 — `index.html` · loadDB atual: nunca 0 blocos

**Forma:** Substituir.

**Ancora:**

````
          blocks: (e.blocks || []).map(b => ({
            id: b.id || uid(), subtitle: b.subtitle || '',
````

**Substituir por:**

````
          // Sem blocos (ou lista vazia): um bloco vazio, preenchido pelo map abaixo (FIX-004)
          blocks: ((e.blocks && e.blocks.length) ? e.blocks : [{}]).map(b => ({
            id: b.id || uid(), subtitle: b.subtitle || '',
````

## Edicao 3 — `index.html` · normalizeImportedDB e mergeImportedProperties

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
function openImport() { document.getElementById('importFile').click(); }
````

**Substituir por:**

````
function openImport() { document.getElementById('importFile').click(); }

/* Normaliza um backup JSON para o formato atual antes de importar: opções em
   texto viram objetos, propertyOptionModes vira propertyAutoFlags, inheritProps
   vira blockProps, campos ausentes ganham padrão. Entrada sem blocos (ou com a
   lista vazia) ganha um bloco vazio — nunca entrada com 0 blocos (FIX-004).
   Pura, salvo uid()/randColor() para dado que não tem id ou cor.
   Lança 'Formato inválido' se não houver lista de entradas. Testada no smoke. */
function normalizeImportedDB(data) {
  if (!data || !Array.isArray(data.entries)) throw new Error('Formato inválido');
  data.properties = (data.properties||[]).map(p => ({
    ...p, options: (p.options||[]).map(o =>
      typeof o==='string' ? {id:uid(),name:o,colorId:randColor()} : o)
  }));
  data.entries = data.entries.map(e2 => ({
    id: e2.id||uid(), title: e2.title||'', description: e2.description||'',
    propertyValues:   e2.propertyValues||{},
    propertyAutoFlags:e2.propertyAutoFlags||migrateOptionModes(e2.propertyOptionModes),
    blocks: ((e2.blocks && e2.blocks.length) ? e2.blocks : [{ content: e2.content||'' }])
            .map(b=>({
              id: b.id||uid(), subtitle: b.subtitle||'',
              version: b.version||1, content: b.content||'',
              blockProps: b.blockProps||b.inheritProps||{}
            })),
    createdAt: e2.createdAt, updatedAt: e2.updatedAt
  }));
  return data;
}

/* Mescla as propriedades de um backup nas existentes, por id (FIX-005).
   Propriedade nova entra inteira; propriedade que já existe ganha só as opções
   que faltam (por id) — nome e cor do que já existe não mudam. Sem isto, as
   entradas importadas apontavam para opções que não existiam no destino.
   Muta `target`; devolve quantas opções entraram em propriedades existentes. */
function mergeImportedProperties(target, incoming) {
  let added = 0;
  (incoming || []).forEach(p => {
    const cur = target.find(x => x.id === p.id);
    if (!cur) { target.push(p); return; }
    if (!Array.isArray(cur.options)) cur.options = [];
    const have = new Set(cur.options.map(o => o.id));
    (p.options || []).forEach(o => {
      if (!have.has(o.id)) { cur.options.push(o); have.add(o.id); added++; }
    });
  });
  return added;
}
````

## Edicao 4 — `index.html` · handleImport chama normalizeImportedDB

**Forma:** Substituir.

**Ancora:**

````
      let data = JSON.parse(e.target.result);
      if (!data.entries) throw new Error('Formato inválido');

      // Normalize
      data.properties = (data.properties||[]).map(p => ({
        ...p, options: (p.options||[]).map(o =>
          typeof o==='string' ? {id:uid(),name:o,colorId:randColor()} : o)
      }));
      data.entries = data.entries.map(e2 => ({
        id: e2.id||uid(), title: e2.title||'', description: e2.description||'',
        propertyValues:   e2.propertyValues||{},
        propertyAutoFlags:e2.propertyAutoFlags||migrateOptionModes(e2.propertyOptionModes),
        blocks: (e2.blocks||[{id:uid(),subtitle:'',version:1,content:e2.content||'',blockProps:{}}])
                .map(b=>({
                  id: b.id||uid(), subtitle: b.subtitle||'',
                  version: b.version||1, content: b.content||'',
                  blockProps: b.blockProps||b.inheritProps||{}
                })),
        createdAt: e2.createdAt, updatedAt: e2.updatedAt
      }));
````

**Substituir por:**

````
      // Normalização em função própria, testada no smoke (FIX-004)
      const data = normalizeImportedDB(JSON.parse(e.target.result));
````

## Edicao 5 — `index.html` · mescla traz opcoes novas

**Forma:** Substituir.

**Ancora:**

````
        const existPids = new Set(db.properties.map(p=>p.id));
        (data.properties||[]).filter(p=>!existPids.has(p.id)).forEach(p=>db.properties.push(p));
        showToast(`${newE.length} entradas importadas (mesclado)`);
````

**Substituir por:**

````
        // Propriedade que já existe também recebe as opções que faltam (FIX-005)
        const novasOpcoes = mergeImportedProperties(db.properties, data.properties);
        showToast(`${newE.length} entradas importadas (mesclado)`
          + (novasOpcoes ? ` · ${novasOpcoes} opção(ões) nova(s)` : ''));
````

## Edicao 6 — `tests/smoke.mjs` · secao do nucleo

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ── Relatório ──────────────────────────────────────────────── */
````

**Substituir por:**

````
/* ── Núcleo: propriedades, migração, carga e importação (FIX-004, FIX-005) ── */
// Cobre o que, se quebrar, inutiliza backups ou corrompe propriedades sem aviso.
// As funções leem globais (db, editBlocks, localStorage, uid…): entram como parâmetros.
{
  const CORE = ['calcPropertyValues', 'calcPropertyValuesFor', 'calcPropertyValuesForBlocks',
                'migrateOptionModes', 'loadDB', 'normalizeImportedDB', 'mergeImportedProperties'];
  const coreSrc = CORE.map(n => extractFunction(html, n)).join('\n\n');
  const J = x => JSON.stringify(x);
  // Ambiente novo a cada chamada: localStorage falso, uid previsível, toasts anotados.
  const core = (store = {}, dbProps = [], blocks = [], blockProps = {}) => {
    let n = 0; const toasts = [];
    const ls = { getItem: k => (k in store ? store[k] : null) };
    const api = new Function('db', 'editBlocks', 'editBlockProps', 'localStorage', 'uid', 'randColor',
      'showToast', 'STORAGE_KEY', `${coreSrc}\nreturn { ${CORE.join(', ')} };`)(
      { properties: dbProps, entries: [] }, blocks, blockProps, ls,
      () => 'u' + (++n), () => 'slate', t => toasts.push(t), 'base_v4');
    api.toasts = toasts; return api;
  };

  // calcPropertyValues e variantes: união das opções dos blocos, por propriedade de db.properties
  const props = [{ id: 'pA', options: [] }, { id: 'pB', options: [] }];
  const blocos = [
    { id: 'b1', blockProps: { pA: ['o2', 'o1'] } },
    { id: 'b2', blockProps: { pA: ['o1', 'o3'], pX: ['zz'] } },
    { id: 'b3' },
  ];
  const esperado = J({ pA: ['o2', 'o1', 'o3'], pB: [] });
  const c1 = core({}, props);
  check('nucleo: calcPropertyValuesForBlocks = uniao sem repetir, na ordem; propriedade sem opcao = []',
    J(c1.calcPropertyValuesForBlocks(blocos)) === esperado, J(c1.calcPropertyValuesForBlocks(blocos)));
  check('nucleo: propriedade fora de db.properties e ignorada; bloco sem blockProps nao quebra',
    !('pX' in c1.calcPropertyValuesForBlocks(blocos)));
  check('nucleo: calcPropertyValuesFor da o mesmo que ForBlocks',
    J(c1.calcPropertyValuesFor({ blocks: blocos })) === esperado);
  check('nucleo: calcPropertyValuesFor de entrada sem blocos = tudo vazio',
    J(c1.calcPropertyValuesFor({})) === J({ pA: [], pB: [] }));
  const ebp = Object.fromEntries(blocos.map(b => [b.id, b.blockProps || {}]));
  check('nucleo: calcPropertyValues (editor) da o mesmo que ForBlocks',
    J(core({}, props, blocos, ebp).calcPropertyValues()) === esperado);

  // migrateOptionModes (v10 -> v11): so o modo 'all' vira adicao automatica
  const m = core().migrateOptionModes;
  check('nucleo: migrateOptionModes sem dado = {}', J(m(undefined)) === '{}' && J(m(null)) === '{}');
  check('nucleo: migrateOptionModes leva so o modo all, na ordem; propriedade sem all fica de fora',
    J(m({ pA: { o1: 'all', o2: 'one', o3: 'all' }, pB: { o4: 'one' } })) === J({ pA: ['o1', 'o3'] }),
    J(m({ pA: { o1: 'all', o2: 'one', o3: 'all' }, pB: { o4: 'one' } })));

  // loadDB: o que o app le ao abrir
  const vazio = core().loadDB();
  check('nucleo: loadDB sem nada salvo = propriedades padrao e nenhuma entrada',
    J(vazio.properties.map(p => p.id)) === J(['p-tags', 'p-ia']) && vazio.entries.length === 0);
  const atual = { properties: [{ id: 'pA', name: 'A', options: ['texto', { id: 'oK', name: 'K', colorId: 'red' }] }],
    entries: [{ id: 'e1', title: 'T', extra: 42, createdAt: '2026-01-01T00:00:00Z', updatedAt: '2026-01-02T00:00:00Z',
      propertyOptionModes: { pA: { oK: 'all' } },
      blocks: [{ id: 'b1', content: 'c', inheritProps: { pA: ['oK'] } }] }] };
  const legado = { categories: [{ id: 'c1', name: 'Cat' }], entries: [{ id: 'old', title: 'velho' }] };
  const c2 = core({ base_v4: J(atual), base_notas_v3: J(legado) });
  const l1 = c2.loadDB();
  check('nucleo: loadDB le a chave base_v4 antes das legadas', l1.entries[0].id === 'e1' && l1.entries.length === 1);
  check('nucleo: loadDB converte opcao em texto para {id, name, colorId}',
    J(l1.properties[0].options[0]) === J({ id: 'u1', name: 'texto', colorId: 'slate' }), J(l1.properties[0].options[0]));
  const b1 = l1.entries[0].blocks[0];
  check('nucleo: loadDB migra inheritProps -> blockProps e completa o bloco (versao 1, subtitulo vazio)',
    J(b1) === J({ id: 'b1', subtitle: '', version: 1, content: 'c', blockProps: { pA: ['oK'] } }), J(b1));
  check('nucleo: loadDB migra propertyOptionModes -> propertyAutoFlags',
    J(l1.entries[0].propertyAutoFlags) === J({ pA: ['oK'] }));
  check('nucleo: loadDB preserva datas e campos que nao conhece',
    l1.entries[0].createdAt === '2026-01-01T00:00:00Z' && l1.entries[0].updatedAt === '2026-01-02T00:00:00Z'
    && l1.entries[0].extra === 42);
  check('nucleo: loadDB nao mostra o aviso de migracao ao ler a chave atual', !c2.toasts.some(t => t));
  const sem = core({ base_v4: J({ properties: [], entries: [{ id: 'a' }, { id: 'b', blocks: [] }] }) }).loadDB();
  check('nucleo: loadDB nunca deixa entrada com 0 blocos (sem blocos e lista vazia) (FIX-004)',
    sem.entries.every(e => e.blocks.length === 1 && e.blocks[0].content === '' && J(e.blocks[0].blockProps) === '{}'),
    J(sem.entries.map(e => e.blocks)));
  const c3 = core({ base_notas_v3: J({ ...legado, entries: [{ id: 'old', title: 'velho' }, { id: 'old2', blocks: [] }] }) });
  const l3 = c3.loadDB();
  check('nucleo: loadDB legado (v3) vira properties, avisa a migracao e nao deixa 0 blocos',
    J(l3.properties.map(p => p.name)) === J(['Cat']) && !('categories' in l3)
    && l3.entries.every(e => e.blocks.length === 1) && c3.toasts.includes('Dados anteriores migrados ✓'),
    J(l3.entries.map(e => e.blocks.length)));

  // normalizeImportedDB: o caminho de restaurar um backup JSON
  const nz = core().normalizeImportedDB;
  const copia = () => JSON.parse(readFileSync(join(HERE, 'fixtures', 'sample-db.json'), 'utf8'));
  check('nucleo: backup do formato atual volta identico ao importar', J(nz(copia())) === J(copia()));
  check('nucleo: importar duas vezes = importar uma (idempotente)', J(nz(nz(copia()))) === J(nz(copia())));
  let msg = '';
  try { nz({ properties: [] }); } catch (err) { msg = err.message; }
  check('nucleo: arquivo sem lista de entradas = Formato invalido', msg === 'Formato inválido', msg);
  const imp = core().normalizeImportedDB({ entries: [
    { title: 'sem id', content: 'antigo' }, { id: 'v', blocks: [] },
    { id: 'w', propertyOptionModes: { pA: { o1: 'all' } }, blocks: [{ id: 'bw', inheritProps: { pA: ['o1'] } }] }] });
  check('nucleo: importar entrada sem id ganha id; sem blocos usa o content antigo como bloco (FIX-004)',
    imp.entries[0].id === 'u1' && imp.entries[0].blocks.length === 1 && imp.entries[0].blocks[0].content === 'antigo',
    J(imp.entries[0]));
  check('nucleo: importar entrada com lista de blocos vazia ganha um bloco vazio (FIX-004)',
    imp.entries[1].blocks.length === 1 && imp.entries[1].blocks[0].content === '', J(imp.entries[1].blocks));
  check('nucleo: importar migra inheritProps e propertyOptionModes',
    J(imp.entries[2].blocks[0].blockProps) === J({ pA: ['o1'] }) && J(imp.entries[2].propertyAutoFlags) === J({ pA: ['o1'] }));

  // mergeImportedProperties: mesclar um backup de outro navegador (FIX-005)
  const mg = core().mergeImportedProperties;
  const destino = [{ id: 'p-tags', name: 'Tags', options: [{ id: 'o1', name: 'Ideia', colorId: 'yellow' }] }];
  const chegando = [
    { id: 'p-tags', name: 'Outro nome', options: [{ id: 'o1', name: 'Mudou', colorId: 'red' }, { id: 'oN', name: 'Trabalho', colorId: 'blue' }] },
    { id: 'pNova', name: 'Nova', options: [{ id: 'oZ', name: 'Z', colorId: 'slate' }] }];
  const nAdd = mg(destino, chegando);
  check('nucleo: mesclar traz a opcao que falta numa propriedade que ja existe (FIX-005)',
    nAdd === 1 && J(destino[0].options.map(o => o.id)) === J(['o1', 'oN']), J(destino[0].options));
  check('nucleo: mesclar nao muda nome nem cor do que ja existe',
    destino[0].name === 'Tags' && destino[0].options[0].name === 'Ideia' && destino[0].options[0].colorId === 'yellow');
  check('nucleo: mesclar traz a propriedade nova inteira', destino.length === 2 && destino[1].id === 'pNova');
  check('nucleo: mesclar o mesmo backup de novo nao acrescenta nada', mg(destino, chegando) === 0 && destino.length === 2);
}

/* ── Relatório ──────────────────────────────────────────────── */
````

## Edicao 7 — `tests/README.md` · README: smoke cobre o nucleo

**Forma:** Substituir.

**Ancora:**

````
54 asserções no total.
````

**Substituir por:**

````
Desde a v13.5.1, o **núcleo** (FIX-004, FIX-005): `calcPropertyValues` e as duas variantes, `migrateOptionModes`, `loadDB` (com `localStorage` falso), `normalizeImportedDB` (restaurar backup JSON: o formato atual volta idêntico, e é idempotente) e `mergeImportedProperties`. 80 asserções no total.
````

## Edicao 8 — `meta/DECISIONS.md` · FIX-004 e FIX-005 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
O risco principal do projeto fica visível o tempo todo, sem interromper. O limite de 7 dias é um padrão (`backupStatus(…, limite)`), mudável num ponto só. O registro é por navegador: outro navegador mostra «nunca» até o primeiro backup nele.
````

**Substituir por:**

````
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
````

## Edicao 9 — `meta/CHANGELOG.md` · [13.5.1] acima da 13.5.0

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.5.0] — 2026-11-04
````

**Substituir por:**

````
## [13.5.1] — 2026-11-06

### Corrigido
- Entrada sem blocos (ou com a lista vazia) num backup JSON ou no dado salvo abria com 0 blocos; agora ganha um bloco vazio (FIX-004).
- Mesclar um backup JSON de outro navegador perdia as opções novas de propriedades que já existiam (Tags, IA Utilizada…); agora elas entram, e o aviso diz quantas (FIX-005).

### Adicionado
- `tests/smoke.mjs` cobre o núcleo: cálculo das propriedades da entrada, migração de modos, carga do `localStorage`, normalização e mescla do backup JSON (26 asserções novas, 80 no total).

### Modificado
- A normalização do import JSON saiu de dentro do `handleImport` para `normalizeImportedDB`, sem mudar o comportamento, para poder ser testada.

## [13.5.0] — 2026-11-04
````

## Edicao 10 — `meta/IDEAS.md` · ideia estender o smoke: status

**Forma:** Substituir.

**Ancora:**

````
> **Status (2026-11-04):** em parte — o smoke cobre export e reimportação; o `history.mjs` cobre uniformizar, quadrado geral e empurrão. Seguem sem teste `calcPropertyValues`, `migrateOptionModes` e `loadDB`.
````

**Substituir por:**

````
> **Status (2026-11-06):** feita na v13.5.1 — o smoke cobre `calcPropertyValues` (as três variantes), `migrateOptionModes`, `loadDB`, `normalizeImportedDB` e `mergeImportedProperties`, e achou dois defeitos (FIX-004, FIX-005); `moveSelectedBlocks` já é exercitada pelo `history.mjs`. Ver Concluídas. Daqui em diante, teste novo entra com a mudança que o pede.
````

## Edicao 11 — `meta/IDEAS.md` · Concluidas: testes do nucleo

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Lembrete de backup JSON no topo** — v13.5 / DEC-023.
````

**Substituir por:**

````
## ✅ Concluídas

- **Testes do núcleo no smoke** — v13.5.1 / FIX-004, FIX-005.
- **Lembrete de backup JSON no topo** — v13.5 / DEC-023.
````

## Edicao 12 — `meta/IDEAS.md` · ideia nova: base_v4 ilegivel

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
````

**Substituir por:**

````
### 2026-11-06 — Chave `base_v4` ilegível não deveria cair para a chave legada
> **Status:** aberta — achado medido ao escrever os testes do núcleo; não corrigido (raro e pede decisão).
Se o texto salvo em `base_v4` não for JSON válido, o `loadDB` segue para as chaves antigas (`base_notas_v3`…): se alguma existir, o app abre com o acervo **antigo**, avisa «Dados anteriores migrados ✓» e o próximo salvamento **sobrescreve** a `base_v4` ilegível — que talvez fosse recuperável à mão. Sem chave antiga, abre o banco padrão e também sobrescreve. Proposta: com `base_v4` presente e ilegível, guardar o texto cru numa chave à parte (`base_v4_ilegivel`), avisar e não migrar. É raro (o `setItem` grava inteiro), por isso fica como ideia.

### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
````

## Edicao 13 — `meta/ROADMAP.md` · F8: testes do nucleo

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- [x] Lembrete de backup JSON no topo, pelo que mudou desde o último backup — v13.5, ver DEC-023 (acrescentado depois de a fase fechar).
````

**Substituir por:**

````
- [x] Lembrete de backup JSON no topo, pelo que mudou desde o último backup — v13.5, ver DEC-023 (acrescentado depois de a fase fechar).
- [x] Testes do núcleo (carga, migração, importação e mescla do backup) e as duas correções que eles acharam — v13.5.1, ver FIX-004 e FIX-005.
````

## Edicao 14 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.5** — 2026-11-04 — lembrete de backup JSON no topo. Arquivo canônico `index.html`. Testes: `smoke` 54/54 e `history` 52/52 (rodada da wo0008).
````

**Substituir por:**

````
**Lunoda v13.5.1** — 2026-11-06 — testes do núcleo + duas correções da importação (FIX-004, FIX-005). Arquivo canônico `index.html`. Testes: `smoke` 80/80 e `history` 52/52 (rodada da wo0009).
````

## Edicao 15 — `meta/STATUS.md` · funcionando: importacao

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Lembrete de backup JSON no topo: em dia / há N dias / amarelo quando nunca ou atrasado; um clique baixa o backup (v13.5).
````

**Substituir por:**

````
- Lembrete de backup JSON no topo: em dia / há N dias / amarelo quando nunca ou atrasado; um clique baixa o backup (v13.5).
- Importar backup JSON: entrada sem blocos ganha um bloco vazio; mesclar traz as opções novas de propriedades existentes (v13.5.1).
````

## Edicao 16 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.5 aplicada pela wo0008 (`a718916`); falta a conferência no navegador** — roteiro na conversa de 2026-11-04. v13.0 a v13.4.1 já conferidas pelo autor.
````

**Substituir por:**

````
- **v13.5.1 aplicada pela wo0009; falta a conferência no navegador** — roteiro na conversa de 2026-11-06. v13.0 a v13.5 já conferidas pelo autor.
````

## Edicao 17 — `meta/STATUS.md` · backlog: conferencia

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.5 no navegador** (roteiro na conversa de 2026-11-04).
````

**Substituir por:**

````
- [ ] **Conferir a v13.5.1 no navegador** (roteiro na conversa de 2026-11-06).
````

## Edicao 18 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-04** — v13.2 e v13.3 conferidas pelo autor. Entregue a F6 (empurrão de versão, DEC-021) como v13.3 (`e40b37a`). Análise da F9 parte 2 medida e decidida (opção B, DEC-022); entregue como **v13.4** pela wo0006 (`8274e0c`); faxina (prefixos `lunoda_`, README, ROADMAP, IDEAS) como **v13.4.1** pela wo0007 (`d779c80`). F5 adiada pelo autor. Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03. v13.4 e v13.4.1 conferidas pelo autor; Instruções coladas no painel; entregue o **lembrete de backup JSON** (DEC-023) como **v13.5** pela wo0008 (`a718916`).
````

**Substituir por:**

````
**2026-11-06** — v13.5 conferida pelo autor. Frente escolhida: testes do núcleo. Entregues 26 asserções no smoke e duas correções que elas acharam (FIX-004: entrada sem blocos; FIX-005: mescla perdia opções), como **v13.5.1** pela wo0009. Achado registrado sem corrigir: `base_v4` ilegível cai para a chave legada (IDEAS).
````

## Edicao 19 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.5 no navegador; depois escolher a próxima frente (F9 `.zip`, F10 busca no conteúdo, ou testes de `calcPropertyValues`/`migrateOptionModes`/`loadDB`).
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.5.1 no navegador; depois a próxima frente — C (busca no conteúdo dos blocos, com análise curta) com B (atalhos de teclado) junto.
````

## Edicao 20 — `logs/2026-11-06.md` · secao do Code

Acrescente no FIM do arquivo (o chat ja o criou) `## Conversa 1 — Code (execucao, wo0009)` com o seu relatorio resumido.

---

## Fora de escopo

- `STORAGE_KEY = 'base_v4'`: NAO mexer.
- A queda de `base_v4` ilegivel para a chave legada: so registrada no IDEAS, NAO corrigir.
- Unificar as normalizacoes do `loadDB` e do `normalizeImportedDB`: sao parecidas mas nao iguais (o `loadDB` preserva campos desconhecidos com `...e`); juntar mudaria o que o app grava. NAO fazer.
- A mescla de opcoes e por **id**; NAO juntar por nome.

## Armadilhas desta WO

- Edicao 4: o `let data` vira `const data`. O `db = data;` do ramo «Substituir» continua funcionando (atribui ao `db`, nao ao `data`).
- Edicao 2: o `[{}]` e de proposito — o `.map` logo abaixo completa id, subtitulo, versao, conteudo e `blockProps`.
- O smoke extrai as funcoes por nome com `extractFunction`: nomes e assinaturas como no texto.
- Teste no Playwright, se for repetir: `addInitScript` roda tambem no `reload` e regrava os dados — use `evaluate` + `reload`.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado.

- [ ] `git status --short` -> exatamente `M` em: `index.html meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/smoke.mjs`, e `??` em `logs/2026-11-06.md` e nesta WO. Nada alem.
- [ ] smoke `80 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · sintaxe `SINTAXE_OK` (comando abaixo) · `wc -l index.html` -> `3759` · `sha1sum index.html` -> `5c9db21fb78cd54ae85e8669bd4ecc4445cc858e`.
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"`
- [ ] Ocorrencias no `index.html` (`grep -oF "..." index.html | wc -l`): `function normalizeImportedDB(` 1 · `function mergeImportedProperties(` 1 · `normalizeImportedDB(JSON.parse` 1 · `mergeImportedProperties(db.properties` 1 · `(e.blocks && e.blocks.length)` **2** (os dois ramos do `loadDB`) · `(e2.blocks && e2.blocks.length)` 1 · `base_v4` **1** (a chave NAO muda). E `grep -c "^      // Normalize$" index.html` -> 0 (o bloco antigo saiu do `handleImport`).
- [ ] Smoke: `grep -c "check('nucleo" tests/smoke.mjs` -> 26.
- [ ] Docs: `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.5.1] — 2026-11-06`, `## [13.5.0] — 2026-11-04` · `grep -c "^## FIX-004\|^## FIX-005" meta/DECISIONS.md` -> 2 · `grep -c "^\*\*Lunoda v13.5.1\*\*" meta/STATUS.md` -> 1 · `grep -c "80 asserções" tests/README.md` -> 1 · `grep -c "" meta/STATUS.md meta/IDEAS.md meta/DECISIONS.md logs/2026-11-06.md` -> 58 · 236 · 508 · 32 (o log, ANTES da secao do Code).
- [ ] **Teste no navegador — NAO e seu.** O autor passa o roteiro v13.5.1.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0009.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/smoke.mjs tests/README.md meta/CONTEXT.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md logs/2026-11-06.md meta/workorders/261106-wo0009-v13-5-1-testes-nucleo.md
```

```
git commit -m "fix(import): entrada sem blocos e opcoes novas na mescla; testes do nucleo" -m "v13.5.1, FIX-004 e FIX-005. loadDB e import JSON dao um bloco vazio a entrada sem blocos. Mesclar backup traz as opcoes que faltam em propriedades existentes. Normalizacao do import extraida para normalizeImportedDB. Smoke com 26 assercoes do nucleo (80)."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-06 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
