#!/usr/bin/env node
/**
 * smoke.mjs — verificação rápida do Lunoda sem navegador e sem dependências.
 *
 * Por que existe: o Lunoda é um `.html` único e visual, sem suíte de testes.
 * Mas o `entryToMD()` é uma função PURA dado um `db` — dá para extraí-la do
 * arquivo e exercitá-la em Node. Isso cobre justamente a parte cujo defeito é
 * mais caro e menos visível: a integridade do arquivo exportado.
 *
 * Como funciona: lê o `index.html`, recorta as funções pedidas por varredura
 * de chaves balanceadas e avalia só elas, com um `db` de teste injetado.
 * Não executa o script inteiro (que dependeria de DOM).
 *
 * Uso:  node tests/smoke.mjs
 * Saída: lista de OK/FALHA e código de saída 1 se algo falhou.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const APP  = join(ROOT, 'index.html');

/* ── Extração ───────────────────────────────────────────────── */

/**
 * Recorta `function NOME(...) { ... }` do fonte por contagem de chaves.
 * Ignora chaves dentro de string, template literal, regex e comentário —
 * o suficiente para o estilo de código deste projeto.
 */
function extractFunction(src, name) {
  const start = src.indexOf(`function ${name}(`);
  if (start === -1) throw new Error(`funcao nao encontrada no index.html: ${name}`);

  const open = src.indexOf('{', start);
  if (open === -1) throw new Error(`corpo nao encontrado: ${name}`);

  let depth = 0, i = open;
  let inS = null;                       // aspa/crase corrente
  let inLine = false, inBlock = false, esc = false;
  let inRe = false, inClass = false;    // literal de regex, e [...] dentro dele
  let prev = '';                        // ultimo caractere significativo

  for (; i < src.length; i++) {
    const c = src[i], n = src[i + 1];

    if (esc) { esc = false; continue; }
    if (inS) {
      if (c === '\\') { esc = true; continue; }
      if (c === inS) inS = null;
      continue;
    }
    if (inRe) {
      // Um '/' dentro de [...] nao fecha a regex.
      if (c === '\\') { esc = true; continue; }
      if (c === '[') inClass = true;
      else if (c === ']') inClass = false;
      else if (c === '/' && !inClass) inRe = false;
      continue;
    }
    if (inLine)  { if (c === '\n') inLine = false; continue; }
    if (inBlock) { if (c === '*' && n === '/') { inBlock = false; i++; } continue; }

    if (c === '/' && n === '/') { inLine = true;  i++; continue; }
    if (c === '/' && n === '*') { inBlock = true; i++; continue; }

    // Regex ou divisao? Depois de identificador, numero ou fechamento de
    // parenteses/colchete, '/' e' divisao; nos demais casos, inicia regex.
    // Sem isto, um /"/g e' lido como abertura de string e desalinha tudo.
    if (c === '/') {
      const divisao = /[\w$)\]]/.test(prev);
      if (!divisao) { inRe = true; inClass = false; continue; }
    }

    if (c === '"' || c === "'" || c === '`') { inS = c; continue; }

    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return src.slice(start, i + 1); }

    if (!/\s/.test(c)) prev = c;
  }
  throw new Error(`chaves desbalanceadas ao recortar: ${name}`);
}

/* ── Montagem do ambiente ───────────────────────────────────── */

const html = readFileSync(APP, 'utf8');
// mdDados: desde a v13.4 o entryToMD escreve a linha <!-- DADOS … --> (DEC-022).
const NEEDED = ['fmtDate', 'getBlockEffectivePropsSaved', 'mdDados', 'entryToMD'];
// Funcoes da F9: ainda podem nao existir em versoes anteriores a v12.3.
const OPCIONAIS = ['yamlKey', 'yamlStr', 'entryFrontmatter', 'docFrontmatter'];
const presentes = OPCIONAIS.filter(n => html.includes(`function ${n}(`));
const code = NEEDED.concat(presentes).map(n => extractFunction(html, n)).join('\n\n');

const db = JSON.parse(readFileSync(join(HERE, 'fixtures', 'sample-db.json'), 'utf8'));

// `db` entra como parâmetro: as funções o referenciam como global.
const build = new Function('db', `${code}\nreturn { ${['entryToMD','fmtDate'].concat(presentes).join(', ')} };`);
const api = build(db);
const { entryToMD } = api;

/* ── Asserções ──────────────────────────────────────────────── */

let pass = 0, fail = 0, skip = 0;
const results = [];

function skipped(name, motivo) {
  skip++; results.push(`  PULOU ${name} (${motivo})`);
}

function check(name, cond, detail = '') {
  if (cond) { pass++; results.push(`  OK    ${name}`); }
  else      { fail++; results.push(`  FALHA ${name}${detail ? `\n          ${detail}` : ''}`); }
}

const entry = db.entries[0];
const md = entryToMD(entry);
const lines = md.split('\n');

// 1. Estrutura básica
check('titulo da entrada vira heading H1',
  lines[0] === `# ${entry.title}`, `linha 0 = ${JSON.stringify(lines[0])}`);

check('marcador <!-- ENTRADA --> presente',
  md.includes('<!-- ENTRADA -->'));

check('um marcador <!-- BLOCO n --> por bloco',
  (md.match(/<!-- BLOCO \d+ -->/g) || []).length === entry.blocks.length,
  `esperado ${entry.blocks.length}`);

// 2. REGRESSAO — descricao multilinha (bug encontrado em export real)
// Toda linha da descricao precisa comecar com '>', senao a 2a linha em diante
// escapa da citacao e um '#' no meio do texto vira heading de documento.
const descStart = lines.findIndex(l => l.startsWith('> **Descrição/Resumo:**'));
check('descricao existe no export', descStart !== -1);
if (descStart !== -1) {
  const descLen = String(entry.description).split('\n').length;
  const descBlock = lines.slice(descStart, descStart + descLen);
  const semQuote = descBlock.filter(l => !l.startsWith('>'));
  check('TODAS as linhas da descricao sao citadas com ">"',
    semQuote.length === 0,
    `sem ">" : ${JSON.stringify(semQuote)}`);
}

// 3. REGRESSAO — conteudo de bloco delimitado
// O conteudo e texto livre: pode conter '#', '---' ou o proprio divisor.
// Sem delimitador nao ha como separar conteudo de estrutura na releitura.
const ini = (md.match(/<!-- CONTEUDO:INICIO bloco=\d+ -->/g) || []).length;
const fim = (md.match(/<!-- CONTEUDO:FIM bloco=\d+ -->/g) || []).length;
check('todo bloco tem delimitador de conteudo (INICIO)', ini === entry.blocks.length, `achou ${ini}`);
check('todo bloco tem delimitador de conteudo (FIM)',    fim === entry.blocks.length, `achou ${fim}`);
check('delimitadores de conteudo estao pareados',        ini === fim);

// 4. O caso hostil: conteudo que imita a estrutura do proprio export
const hostil = entry.blocks.find(b => b.subtitle === 'Conteudo hostil');
check('fixture hostil existe', !!hostil);
if (hostil) {
  const i0 = md.indexOf('<!-- CONTEUDO:INICIO bloco=2 -->');
  const i1 = md.indexOf('<!-- CONTEUDO:FIM bloco=2 -->');
  check('conteudo hostil fica DENTRO dos delimitadores',
    i0 !== -1 && i1 !== -1 && i0 < md.indexOf(hostil.content) && md.indexOf(hostil.content) < i1);
}

// 5. Propriedades aparecem com o NOME da opcao (nao "herda")
check('propriedade do bloco sai com o nome da opcao',
  md.includes('**Tags:** Ideia'), 'esperava "**Tags:** Ideia"');
check('export nao usa a palavra "herda"',
  !/herda/i.test(md));

// 6. Bloco vazio nao some
check('bloco sem conteudo vira *(vazio)*', md.includes('*(vazio)*'));

/* ── Frontmatter YAML (F9) ──────────────────────────────────── */

if (presentes.length < OPCIONAIS.length) {
  skipped('frontmatter YAML', 'v12.3 ainda nao aplicada');
} else {
  const { yamlKey, yamlStr, entryFrontmatter, docFrontmatter } = api;

  // Chaves seguras
  check('yamlKey tira acento e espaco', yamlKey('IA Utilizada') === 'ia_utilizada', yamlKey('IA Utilizada'));
  check('yamlKey mantem "tags" (campo especial do Obsidian)', yamlKey('Tags') === 'tags');
  check('yamlKey nao devolve string vazia', yamlKey('!!!') === 'prop', yamlKey('!!!'));

  // Escape de valores
  check('yamlStr escapa aspas', yamlStr('a"b') === '"a\\"b"', yamlStr('a"b'));
  check('yamlStr escapa barra invertida', yamlStr('a\\b') === '"a\\\\b"', yamlStr('a\\b'));
  check('yamlStr colapsa quebra de linha', yamlStr('a\nb') === '"a\\nb"', yamlStr('a\nb'));

  // Entrada hostil
  const hostil = db.entries[1];
  const fm = entryFrontmatter(hostil);
  const fmLines = fm.split('\n');

  check('frontmatter abre e fecha com ---',
    fmLines[0] === '---' && fmLines.includes('---', 1), JSON.stringify(fmLines.slice(0, 2)));
  check('titulo com aspas e dois-pontos fica escapado',
    fm.includes('title: "Entrada \\"hostil\\": com aspas, dois-pontos e \\\\ barra"'),
    fmLines.find(l => l.startsWith('title:')));
  check('propriedade "ID" nao sobrescreve o id da entrada',
    fm.includes(`id: "${hostil.id}"`), fmLines.filter(l => l.startsWith('id')).join(' | '));
  check('colisao de chave recebe sufixo', fm.includes('id_prop:'),
    fmLines.filter(l => l.includes('id')).join(' | '));
  check('valores viram lista YAML', fm.includes('tags:') && fm.includes('  - "Ideia"'));
  check('contagem de blocos no frontmatter', fm.includes(`blocks: ${hostil.blocks.length}`));

  // Nao deve haver chave duplicada — YAML duplicado e' aceito por uns e rejeitado por outros
  const chaves = fmLines.filter(l => /^[a-z0-9_]+:/.test(l)).map(l => l.split(':')[0]);
  check('nenhuma chave duplicada no frontmatter',
    new Set(chaves).size === chaves.length, chaves.join(', '));

  // Documento com varias entradas
  const doc = docFrontmatter(7);
  check('frontmatter de documento tem a contagem', doc.includes('entries: 7'));
  check('frontmatter de documento identifica a origem', doc.includes('source: "Lunoda"'));
}

/* ── Reimportar Markdown: ida e volta (F9 parte 2, DEC-022) ─── */

{
  const F9B = ['mdDateToISO', 'parseLunodaMD', 'planMdImport', 'applyMdImport'];
  if (!F9B.every(n => html.includes(`function ${n}(`))) {
    skipped('reimportar Markdown', 'v13.4 ainda nao aplicada');
  } else {
    const src = F9B.map(n => extractFunction(html, n)).join('\n\n');
    let seq = 0;
    const mk = new Function('db', 'uid', 'randColor',
      `${code}\n${src}\nreturn { entryToMD, entryFrontmatter, docFrontmatter, parseLunodaMD, planMdImport, applyMdImport };`);
    const fresco = () => JSON.parse(readFileSync(join(HERE, 'fixtures', 'sample-db.json'), 'utf8'));
    const ida = fresco();
    const A = mk(ida, () => 'novo' + (++seq), () => 'c1');
    const doc = A.docFrontmatter(ida.entries.length) + ida.entries.map(e => A.entryToMD(e)).join('');
    const r = A.parseLunodaMD(doc);

    check('md: le todas as entradas do documento', r.entries.length === ida.entries.length && !r.erro,
      `lidas ${r.entries.length}, erro ${r.erro}`);
    const campos = (o, p) => ({
      titulo: p.title === o.title, descricao: p.description === (o.description || ''), id: p.id === o.id,
      blocos: p.blocks.length === o.blocks.length,
      subtitulo: o.blocks.every((b, j) => p.blocks[j].subtitle === (b.subtitle || '')),
      versao: o.blocks.every((b, j) => p.blocks[j].version === (b.version || 1)),
      conteudo: o.blocks.every((b, j) => p.blocks[j].content === (b.content || '')),
      idBloco: o.blocks.every((b, j) => p.blocks[j].id === b.id),
      datas: p.criado === o.createdAt && p.modificado === o.updatedAt,
    });
    ida.entries.forEach((o, k) => {
      const c = campos(o, r.entries[k]);
      const ruins = Object.keys(c).filter(x => !c[x]);
      check(`md ida e volta exata: «${o.title.slice(0, 18)}…»`, ruins.length === 0, 'falhou: ' + ruins.join(', '));
    });
    check('md: propriedade chamada «ID» nao troca o ID da entrada', r.entries[1].id === ida.entries[1].id, r.entries[1].id);
    check('md: conteudo que imita o export volta inteiro',
      r.entries[0].blocks.some(b => b.content.includes('## [Bloco 99] Falso') && b.content.includes('<!-- ENTRADA -->')));
    check('md: bloco vazio volta vazio', r.entries[0].blocks.some(b => b.content === ''));
    check('md: CRLF (Windows/Obsidian) le igual', A.parseLunodaMD(doc.replace(/\n/g, '\r\n')).entries.length === ida.entries.length);

    // Sem a linha DADOS (export v12.1–v13.3): data cai para o texto do corpo, sem segundos
    const semDados = doc.replace(/^<!-- DADOS .* -->\n/gm, '');
    const r2 = A.parseLunodaMD(semDados);
    check('md sem DADOS (export antigo v12.1+): ainda le', r2.entries.length === ida.entries.length && r2.entries[0].id === ida.entries[0].id);
    check('md sem DADOS: data vem do corpo, com minuto', r2.entries[0].criado !== '' &&
      Math.abs(new Date(r2.entries[0].criado) - new Date(ida.entries[0].createdAt)) < 60000, r2.entries[0].criado);

    // Recusas
    check('md pre-v12.1 (sem delimitadores) e recusado',
      /antes da v12\.1/.test(A.parseLunodaMD('# T\n\n<!-- ENTRADA -->\n**ID:** `x`  \n**Total de blocos:** 1  \n').erro || ''));
    check('arquivo que nao e do Lunoda e recusado', /não parece/.test(A.parseLunodaMD('# Uma nota qualquer\n\ntexto').erro || ''));
    const cortado = doc.replace('**Total de blocos:** 3', '**Total de blocos:** 4');
    const r3 = A.parseLunodaMD(cortado);
    check('md: total de blocos divergente recusa so aquela entrada', r3.entries.length === ida.entries.length - 1 && r3.invalidas === 1,
      `lidas ${r3.entries.length}, invalidas ${r3.invalidas}`);

    // Plano e gravação sobre um db vazio: propriedades recriadas por nome
    const vazio = { properties: [], entries: [] };
    const B = mk(vazio, () => 'n' + (++seq), () => 'c9');
    const plan = B.planMdImport(r);
    check('plano: entradas novas = todas (db vazio)', plan.novas.length === ida.entries.length && plan.existentes.length === 0);
    check('plano: propriedades recriadas por nome', ida.properties.filter(p => ida.entries.some(e => e.blocks.some(b => (b.blockProps || {})[p.id]?.length))).every(p => plan.props.some(q => q.name === p.name)),
      plan.props.map(q => q.name).join(', '));
    B.applyMdImport(plan, 'pular');
    const nomeOpt = (base, pid, oid) => { const p = base.properties.find(x => x.id === pid); return p ? p.name + '=' + (p.options.find(o => o.id === oid) || {}).name : '?'; };
    const assin = base => base.entries.map(e => e.blocks.map(b => Object.entries(b.blockProps || {})
      .flatMap(([pid, oids]) => oids.map(oid => nomeOpt(base, pid, oid))).sort().join('|')).join('/')).join(' ; ');
    check('gravacao: propriedades de cada bloco voltam pelos nomes', assin(vazio) === assin(ida), assin(vazio) + ' <> ' + assin(ida));

    // Entrada que ja existe: pular x copia
    const cheio = fresco();
    const C = mk(cheio, () => 'k' + (++seq), () => 'c1');
    const pl2 = C.planMdImport(r);
    check('plano: entradas com o mesmo ID vao para «ja existem»', pl2.existentes.length === ida.entries.length && pl2.novas.length === 0);
    const antes = cheio.entries.length;
    const res2 = C.applyMdImport(pl2, 'copia');
    check('copia: entra com ID novo e «(cópia)» no titulo',
      cheio.entries.length === antes * 2 && res2.copias === antes && cheio.entries.slice(antes).every(e => e.title.endsWith(' (cópia)') && !ida.entries.some(o => o.id === e.id)));
    const cheio2 = fresco(); const D = mk(cheio2, () => 'p' + (++seq), () => 'c1');
    D.applyMdImport(D.planMdImport(r), 'pular');
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
  }
}

/* ── Lembrete de backup JSON (DEC-023) ────────────────────────── */

if (!html.includes('function backupStatus(')) {
  skipped('lembrete de backup', 'v13.5 ainda nao aplicada');
} else {
  const backupStatus = new Function(`${extractFunction(html, 'backupStatus')}\nreturn backupStatus;`)();
  const DIA = 86400000, agora = Date.parse('2026-11-04T12:00:00Z');
  const ents = up => [{ createdAt: '2026-10-01T00:00:00Z', updatedAt: up }];
  check('backup: sem entradas = vazio', backupStatus('', [], agora).estado === 'vazio');
  check('backup: sem registro = nunca', backupStatus('', ents('2026-10-01T00:00:00Z'), agora).estado === 'nunca');
  check('backup: data ilegivel = nunca', backupStatus('lixo', ents('2026-10-01T00:00:00Z'), agora).estado === 'nunca');
  const st1 = backupStatus(new Date(agora - 30 * DIA).toISOString(), ents('2026-10-01T00:00:00Z'), agora);
  check('backup: nada mudou desde o backup = em dia (mesmo 30 dias depois)', st1.estado === 'em-dia' && st1.dias === 30, JSON.stringify(st1));
  const st2 = backupStatus(new Date(agora - 2 * DIA).toISOString(), ents(new Date(agora - DIA).toISOString()), agora);
  check('backup: mudou ha pouco = recente', st2.estado === 'recente' && st2.dias === 2, JSON.stringify(st2));
  const st3 = backupStatus(new Date(agora - 7 * DIA).toISOString(), ents(new Date(agora - DIA).toISOString()), agora);
  check('backup: mudou e passou de 7 dias = atrasado (limite inclusivo)', st3.estado === 'atrasado' && st3.dias === 7, JSON.stringify(st3));
  const st4 = backupStatus(new Date(agora - 7 * DIA).toISOString(), ents(new Date(agora - DIA).toISOString()), agora, 10);
  check('backup: limite configuravel', st4.estado === 'recente');
  check('backup: entrada sem updatedAt usa createdAt',
    backupStatus(new Date(agora - 9 * DIA).toISOString(), [{ createdAt: new Date(agora - DIA).toISOString() }], agora).estado === 'atrasado');
}

/* ── Núcleo: propriedades, migração, carga e importação (FIX-004, FIX-005) ── */
// Cobre o que, se quebrar, inutiliza backups ou corrompe propriedades sem aviso.
// As funções leem globais (db, editBlocks, localStorage, uid…): entram como parâmetros.
{
  const CORE = ['calcPropertyValues', 'calcPropertyValuesFor', 'calcPropertyValuesForBlocks',
                'migrateOptionModes', 'keepUnreadable', 'loadDB', 'normalizeImportedDB', 'mergeImportedProperties'];
  const coreSrc = CORE.map(n => extractFunction(html, n)).join('\n\n');
  const J = x => JSON.stringify(x);
  // Ambiente novo a cada chamada: localStorage falso, uid previsível, toasts anotados.
  // `cheio` = setItem estoura a cota (DEC-026). unreadableAtLoad e o prefixo são do script, não funções.
  const core = (store = {}, dbProps = [], blocks = [], blockProps = {}, cheio = false) => {
    let n = 0; const toasts = [];
    const ls = { getItem: k => (k in store ? store[k] : null),
      setItem: (k, v) => { if (cheio) throw Object.assign(new Error('cota'), { name: 'QuotaExceededError' }); store[k] = String(v); },
      key: i => Object.keys(store)[i] ?? null, get length() { return Object.keys(store).length; } };
    const api = new Function('db', 'editBlocks', 'editBlockProps', 'localStorage', 'uid', 'randColor',
      'showToast', 'STORAGE_KEY', `const UNREADABLE_PREFIX = 'base_v4_ilegivel_';\nlet unreadableAtLoad = null;\n${coreSrc}\nreturn { ${CORE.join(', ')}, get unreadable() { return unreadableAtLoad; } };`)(
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

/* ── Busca sem acento, por palavras, e trecho destacado (DEC-024) ── */
{
  const BUSCA = ['esc', 'foldText', 'searchTokens', 'isWordChar', 'isWordStart', 'findWord', 'wordLen',
                 'foldOf', 'blockFold', 'entryMatches', 'blockMatches', 'searchSnippet', 'searchHit', 'siblingBlockIndex'];
  // foldMemo é uma constante do script (não função): declarada aqui para as funções extraídas
  const b = new Function(`const foldMemo = new WeakMap();\n${BUSCA.map(n => extractFunction(html, n)).join('\n\n')}\nreturn { ${BUSCA.join(', ')} };`)();
  const T = b.searchTokens, J = x => JSON.stringify(x);

  check('busca: foldText tira acento e maiuscula', b.foldText('Ação ÉÇ Über') === 'acao ec uber', b.foldText('Ação ÉÇ Über'));
  check('busca: palavras separadas por qualquer espaco; vazio = nenhuma',
    J(T('  Função\tModelo  ')) === J(['funcao', 'modelo']) && J(T('   ')) === '[]');
  const ent = { title: 'Modelo novo', description: '', blocks: [{ subtitle: 'Claude', content: 'uma função útil' }, { content: 'outra coisa' }] };
  check('busca: sem acento acha texto com acento (e vice-versa)',
    b.entryMatches(ent, T('funcao')) && b.entryMatches({ title: 'funcao' }, T('função')));
  check('busca: todas as palavras, em qualquer ordem e em qualquer campo', b.entryMatches(ent, T('util MODELO claude')));
  check('busca: falta uma palavra = nao casa', !b.entryMatches(ent, T('funcao gemini')));
  check('busca: sem palavras casa tudo', b.entryMatches({}, []) && b.blockMatches({}, []));
  const blk = { subtitle: '', content: 'antes' };
  const antes = b.blockMatches(blk, T('antes'));
  blk.content = 'depois';
  check('busca: a memoria do texto dobrado acompanha a edicao do bloco (nunca fica velha)',
    antes && b.blockMatches(blk, T('depois')) && !b.blockMatches(blk, T('antes')));
  check('busca: bloco casa so com as palavras NELE (subtitulo ou conteudo)',
    b.blockMatches(ent.blocks[0], T('claude funcao')) && !b.blockMatches(ent.blocks[1], T('funcao')));

  const s1 = b.searchSnippet('Uma função útil e outra Função', T('funcao'));
  check('trecho: destaca todas as ocorrencias, com o acento original', s1 === 'Uma <mark>função</mark> útil e outra <mark>Função</mark>', s1);
  const s2 = b.searchSnippet('<script>alert(1)</script> função', T('funcao'));
  check('trecho: escapa o HTML do conteudo', !s2.includes('<script') && s2.includes('&lt;script&gt;') && s2.includes('<mark>função</mark>'), s2);
  const longo = 'x'.repeat(200) + ' alvo ' + 'y'.repeat(200);
  const s3 = b.searchSnippet(longo, T('alvo'), 10);
  check('trecho: recorta em volta, com reticencias dos dois lados',
    s3.startsWith('…') && s3.endsWith('…') && s3.includes('<mark>alvo</mark>') && s3.length < 60, s3);
  check('trecho: raio infinito devolve o texto inteiro (titulo destacado)',
    b.searchSnippet('Função no título', T('funcao titulo'), Infinity) === '<mark>Função</mark> no <mark>título</mark>');
  check('trecho: sem ocorrencia = vazio', b.searchSnippet('nada aqui', T('zzz')) === '' && b.searchSnippet('', T('a')) === '');
  check('trecho: acento decomposto fica dentro da marca', b.searchSnippet('cafe\u0301 bom', T('cafe')) === '<mark>cafe\u0301</mark> bom');
  check('trecho: quebras de linha viram espaco', b.searchSnippet('linha1\n\nlinha\tdois', T('dois')) === 'linha1 linha <mark>dois</mark>');
  check('trecho: palavras sobrepostas viram uma marca so', b.searchSnippet('funcionalidade', T('func funcional')) === '<mark>funcional</mark>idade');

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
  check('trecho da entrada: conta os blocos e recorta o primeiro (com subtitulo)',
    h && h.count === 2 && h.html === 'Claude: a <mark>função</mark>', J(h));
  check('trecho da entrada: casou so pelo titulo = sem trecho', b.searchHit({ title: 'função', blocks: [{ content: 'x' }] }, T('funcao')) === null);
  check('trecho da entrada: palavras espalhadas em blocos diferentes = sem trecho',
    b.searchHit({ blocks: [{ content: 'funcao' }, { content: 'modelo' }] }, T('funcao modelo')) === null);

  const si = b.siblingBlockIndex;
  check('Alt+setas: fora de bloco vai ao primeiro (desce) ou ao ultimo (sobe)', si(-1, 1, 3) === 0 && si(-1, -1, 3) === 2);
  check('Alt+setas: anda um; nas pontas e sem blocos fica onde esta',
    si(1, 1, 3) === 2 && si(1, -1, 3) === 0 && si(2, 1, 3) === -1 && si(0, -1, 3) === -1 && si(-1, 1, 0) === -1);
}

/* ── Relatório ──────────────────────────────────────────────── */

console.log('\nLunoda — smoke test (entryToMD)\n');
console.log(results.join('\n'));
console.log(`\n  ${pass} ok, ${fail} falha(s)${skip ? `, ${skip} pulado(s)` : ''}\n`);

if (fail > 0) {
  console.log('  Dica: rode com DUMP=1 para ver o Markdown gerado.\n');
  if (process.env.DUMP) console.log('-'.repeat(60) + '\n' + md + '\n' + '-'.repeat(60));
  process.exit(1);
}
process.exit(0);
