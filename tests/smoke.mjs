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
const NEEDED = ['fmtDate', 'getBlockEffectivePropsSaved', 'entryToMD'];
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
