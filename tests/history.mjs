#!/usr/bin/env node
/**
 * history.mjs — exercita o motor de undo/redo do editor.
 *
 * Por que separado do smoke: o histórico depende de DOM e de variáveis globais
 * do editor, então precisa de dublês. O smoke roda funções puras; aqui montamos
 * um editor de mentira e verificamos o comportamento observável.
 *
 * Uso: node tests/history.mjs
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const html = readFileSync(join(HERE, '..', 'index.html'), 'utf8');

/* Recorta o bloco do histórico: do teto de memória até o fim do embrulho de openEditor. */
const START = 'const HISTORY_LIMIT';
const END   = '})();';
const i0 = html.indexOf(START);
if (i0 === -1) { console.error('FALHA: bloco de historico nao encontrado no index.html'); process.exit(1); }
const i1 = html.indexOf(END, html.indexOf('originalOpen', i0));
const code = html.slice(i0, i1 + END.length);

/* ── Editor de mentira ─────────────────────────────────────── */

function novoEditor(prep) {
  const campos = { epTitleInput: { value: '' }, epDesc: { value: '' },
                   epUndoBtn: { style: {} }, epRedoBtn: { style: {} },
                   editorPanel: { classList: { contains: () => true } } };
  let seq = 0;
  const ctx = {
    editBlocks: [{ id: 'b1', subtitle: 'A', version: 1, content: 'um', blockProps: {} }],
    editBlockProps: {},
    editPropAutoFlags: {},
    selectedBlockIds: new Set(),
    uid: () => 'gen' + (++seq),
    showToast: () => {},
    renderEditorProps: () => {},
    renderBlocks: () => {},
    document: { getElementById: id => campos[id] || null },
    window: {},
  };
  ctx.getEditorSnapshot = () => JSON.stringify({
    title: campos.epTitleInput.value, desc: campos.epDesc.value,
    autoFlags: ctx.editPropAutoFlags, blockProps: ctx.editBlockProps, blocks: ctx.editBlocks,
  });

  // Mutadores de mentira com os nomes reais, para o embrulho encontrá-los.
  ctx.window.addBlock = () => {
    ctx.editBlocks = ctx.editBlocks.concat(
      [{ id: 'n' + ctx.editBlocks.length, subtitle: '', version: 1, content: '', blockProps: {} }]);
  };
  ctx.window.deleteSelectedBlocks = () => { ctx.editBlocks = []; };
  ctx.window.moveBlock = () => { ctx.editBlocks = ctx.editBlocks.slice().reverse(); };
  ctx.window.jumpBlockTo = () => {};            // no-op: nao deve gerar historico
  ctx.window.openEditor = () => {};
  ['moveSelectedBlocks','duplicateBlock','duplicateSelectedBlocks','toggleEntryPropAuto',
   'toggleBlockPropOpt','disableAutoFromBlock','removeBlock']
    .forEach(n => { ctx.window[n] = () => {}; });

  // Preparo opcional: instala mutadores REAIS antes de o embrulho rodar.
  if (prep) prep(ctx);

  const api = new Function('ctx', `with (ctx) {
    ${code}
    return { clearEditorHistory, restoreEditorSnapshot, undoEditor, redoEditor,
             undoLen: () => undoStack.length, redoLen: () => redoStack.length,
             limit: HISTORY_LIMIT };
  }`)(ctx);

  return { ctx, api, campos };
}

/* ── Asserções ─────────────────────────────────────────────── */

let pass = 0, fail = 0; const out = [];
const check = (n, c, d = '') => c
  ? (pass++, out.push(`  OK    ${n}`))
  : (fail++, out.push(`  FALHA ${n}${d ? `\n          ${d}` : ''}`));

// 1. Começa vazio
{
  const { api } = novoEditor();
  check('historico comeca vazio', api.undoLen() === 0 && api.redoLen() === 0);
}

// 2. Mutação estrutural registra histórico
{
  const { ctx, api } = novoEditor();
  ctx.window.addBlock();
  check('mutacao estrutural empilha undo', api.undoLen() === 1, `len=${api.undoLen()}`);
  check('blocos realmente mudaram', ctx.editBlocks.length === 2);
}

// 3. Ação sem efeito NÃO registra (caso do confirm cancelado)
{
  const { ctx, api } = novoEditor();
  ctx.window.jumpBlockTo();
  check('acao sem efeito nao suja o historico', api.undoLen() === 0, `len=${api.undoLen()}`);
}

// 4. Undo restaura o estado anterior
{
  const { ctx, api } = novoEditor();
  ctx.window.addBlock();
  api.undoEditor();
  check('undo restaura contagem de blocos', ctx.editBlocks.length === 1, `n=${ctx.editBlocks.length}`);
  check('undo move a entrada para o redo', api.undoLen() === 0 && api.redoLen() === 1);
}

// 5. Redo reaplica
{
  const { ctx, api } = novoEditor();
  ctx.window.addBlock();
  api.undoEditor();
  api.redoEditor();
  check('redo reaplica a mudanca', ctx.editBlocks.length === 2, `n=${ctx.editBlocks.length}`);
  check('redo devolve a entrada ao undo', api.undoLen() === 1 && api.redoLen() === 0);
}

// 6. Ramo novo invalida o redo
{
  const { ctx, api } = novoEditor();
  ctx.window.addBlock();
  api.undoEditor();
  check('ha redo pendente', api.redoLen() === 1);
  // Precisa ser uma mutação que REALMENTE muda o estado: com 1 bloco só,
  // inverter a lista não altera nada e (corretamente) não gera histórico.
  ctx.window.addBlock();
  check('mutacao nova limpa o redo', api.redoLen() === 0, `len=${api.redoLen()}`);
}

// 7. INVARIANTE DO PROJETO: nunca restaurar entrada com 0 blocos
{
  const { ctx, api } = novoEditor();
  ctx.window.deleteSelectedBlocks();
  check('estado com 0 blocos foi produzido', ctx.editBlocks.length === 0);
  api.undoEditor();                       // volta para 1 bloco
  check('undo recupera o bloco', ctx.editBlocks.length === 1);
  api.redoEditor();                       // refaz o estado vazio
  check('redo NUNCA deixa a entrada com 0 blocos',
    ctx.editBlocks.length >= 1, `n=${ctx.editBlocks.length}`);
}

// 8. Teto de memória
{
  const { ctx, api } = novoEditor();
  for (let i = 0; i < api.limit + 20; i++) ctx.window.addBlock();
  check('pilha respeita o HISTORY_LIMIT',
    api.undoLen() === api.limit, `len=${api.undoLen()} limite=${api.limit}`);
}

// 9. Abrir outra entrada zera o histórico
{
  const { ctx, api } = novoEditor();
  ctx.window.addBlock();
  check('havia historico antes de abrir', api.undoLen() === 1);
  ctx.window.openEditor();
  check('openEditor zera o historico', api.undoLen() === 0 && api.redoLen() === 0);
}

// 10. Botões refletem a disponibilidade
{
  const { ctx, campos } = novoEditor();
  ctx.window.addBlock();
  check('botao desfazer fica ativo', campos.epUndoBtn.style.opacity === '');
  check('botao refazer segue inativo', campos.epRedoBtn.style.opacity === '.35');
}

// 11. Uniformizar nos blocos selecionados (DEC-013) — com a função REAL do index.html.
//     Três blocos: b1 e b2 selecionados, b3 não — fixture de um bloco esconderia o caso misto.
{
  const a0 = html.indexOf('function applyPropToSelectedBlocks(');
  check('applyPropToSelectedBlocks existe no index.html', a0 !== -1);
  if (a0 !== -1) {
    const src = html.slice(a0, html.indexOf('\n}\n', a0) + 2);
    const montar = (props) => novoEditor(ctx => {
      ctx.editBlocks = ['b1', 'b2', 'b3'].map(id => ({ id, subtitle: 'A', version: 1, content: id, blockProps: {} }));
      ctx.editBlockProps = props;
      ['b1', 'b2'].forEach(id => ctx.selectedBlockIds.add(id));
      ctx.renderBlockPropBar = () => {};
      ctx.buildBlockPropBody = () => {};
      ctx.window.applyPropToSelectedBlocks = new Function('ctx', `with (ctx) { ${src}; return applyPropToSelectedBlocks; }`)(ctx);
    });
    const tem = (ctx, id) => ((ctx.editBlockProps[id] || {}).p || []).includes('o');

    let { ctx, api } = montar({ b1: { p: ['o'] }, b2: {}, b3: {} });
    ctx.window.applyPropToSelectedBlocks('p', 'o');
    check('misto: todos os selecionados recebem', tem(ctx, 'b1') && tem(ctx, 'b2'));
    check('misto: bloco NAO selecionado fica intocado', !tem(ctx, 'b3'));
    check('uniformizar empilha undo (nome esta na lista do embrulho)', api.undoLen() === 1, `len=${api.undoLen()}`);
    api.undoEditor();
    check('undo desfaz o uniformizar', tem(ctx, 'b1') && !tem(ctx, 'b2'));

    ({ ctx } = montar({ b1: { p: ['o'] }, b2: { p: ['o'] }, b3: { p: ['o'] } }));
    ctx.window.applyPropToSelectedBlocks('p', 'o');
    check('todos tem: remove de todos os selecionados', !tem(ctx, 'b1') && !tem(ctx, 'b2'));
    check('todos tem: nao selecionado mantem a opcao', tem(ctx, 'b3'));

    ({ ctx } = montar({}));
    ctx.window.applyPropToSelectedBlocks('p', 'o');
    check('nenhum tem: todos os selecionados recebem', tem(ctx, 'b1') && tem(ctx, 'b2') && !tem(ctx, 'b3'));

    ({ ctx, api } = montar({ b1: {}, b2: {}, b3: {} }));
    ctx.selectedBlockIds.clear();
    ctx.window.applyPropToSelectedBlocks('p', 'o');
    check('sem selecao: nada muda', !tem(ctx, 'b1') && !tem(ctx, 'b2') && !tem(ctx, 'b3'));
    check('sem selecao: historico nao suja', api.undoLen() === 0, `len=${api.undoLen()}`);
  }
}

// 12. Quadrado geral de seleção respeitando o filtro (DEC-016) — funções REAIS do index.html.
//     Cinco blocos; o filtro por versão 1 mostra b1, b2 e b4. b3 fica escondido — é o caso que importa.
{
  const nomes = ['getFilteredBlocks', 'blockSelectAllState', 'toggleSelectAllVisibleBlocks', 'hiddenSelectedCount'];
  const fontes = nomes.map(n => { const i = html.indexOf(`function ${n}(`); return i === -1 ? null : html.slice(i, html.indexOf('\n}\n', i) + 2); });
  check('funcoes do quadrado geral existem no index.html', fontes.every(Boolean), nomes.filter((n, i) => !fontes[i]).join(', '));
  if (fontes.every(Boolean)) {
    const montar = () => {
      const ctx = {
        editBlocks: [1, 1, 2, 1, 3].map((v, i) => ({ id: 'b' + (i + 1), subtitle: 'A', version: v, content: '', blockProps: {} })),
        editBlockProps: {}, selectedBlockIds: new Set(),
        blkFilterText: '', blkFilterVer: null, blkFilterPropId: null, blkFilterOptIds: new Set(), blkFilterMode: 'and',
        renderBlocks: () => {},
      };
      const api = new Function('ctx', `with (ctx) { ${fontes.join('\n')}; return { ${nomes.join(', ')} }; }`)(ctx);
      return { ctx, api };
    };
    const sel = ctx => [...ctx.selectedBlockIds].sort().join(',');

    let { ctx, api } = montar();
    ctx.blkFilterVer = 1;
    check('quadrado: nenhum visivel marcado = none', api.blockSelectAllState() === 'none');
    ctx.selectedBlockIds.add('b1'); ctx.selectedBlockIds.add('b3');
    check('quadrado: 1 de 3 visiveis = mixed', api.blockSelectAllState() === 'mixed');
    check('ocultos: 1 selecionado fora do filtro', api.hiddenSelectedCount() === 1, `n=${api.hiddenSelectedCount()}`);
    api.toggleSelectAllVisibleBlocks();
    check('clique no misto marca todos os visiveis e mantem o oculto', sel(ctx) === 'b1,b2,b3,b4', sel(ctx));
    check('quadrado: todos os visiveis = all', api.blockSelectAllState() === 'all');
    api.toggleSelectAllVisibleBlocks();
    check('clique no all desmarca so os visiveis', sel(ctx) === 'b3', sel(ctx));
    ctx.blkFilterVer = null;
    check('sem filtro: o oculto volta a contar (1 de 5 = mixed)', api.blockSelectAllState() === 'mixed' && api.hiddenSelectedCount() === 0);
    api.toggleSelectAllVisibleBlocks();
    check('sem filtro, clique no misto: todos os 5', sel(ctx) === 'b1,b2,b3,b4,b5', sel(ctx));
    ctx.blkFilterVer = 9;
    check('filtro sem resultado: quadrado = none e o clique nao desmarca nada',
      api.blockSelectAllState() === 'none' && (api.toggleSelectAllVisibleBlocks(), sel(ctx) === 'b1,b2,b3,b4,b5'));
    ctx.selectedBlockIds.add('fantasma');
    check('ocultos ignoram id que nao existe mais na entrada', api.hiddenSelectedCount() === 5, `n=${api.hiddenSelectedCount()}`);
  }
}

// 13. Empurrão de versão (DEC-015, DEC-021) — função REAL do index.html.
//     Cinco blocos «A» v1..v5 (um deles «a », para provar que caixa e espaço não separam o grupo)
//     e um «B» v3, que nunca pode ser tocado.
{
  const a0 = html.indexOf('function setBlockVersion(');
  check('setBlockVersion existe no index.html', a0 !== -1);
  if (a0 !== -1) {
    const src = html.slice(a0, html.indexOf('\n}\n', a0) + 2);
    const blocos = specs => specs.map(([s, v], i) => ({ id: 'b' + (i + 1), subtitle: s, version: v, content: '', blockProps: {} }));
    const base = () => blocos([['A', 1], ['A', 2], ['A', 3], ['a ', 4], ['A', 5], ['B', 3]]);
    const montar = (bs, comHistorico) => {
      if (comHistorico) {
        const ed = novoEditor(ctx => {
          ctx.editBlocks = bs;
          ctx.document.querySelector = () => null;
          ctx.window.setBlockVersion = new Function('ctx', `with (ctx) { ${src}; return setBlockVersion; }`)(ctx);
        });
        return { ctx: ed.ctx, api: ed.api, set: ed.ctx.window.setBlockVersion };
      }
      const ctx = { editBlocks: bs, document: { querySelector: () => null }, showToast: () => {} };
      return { ctx, set: new Function('ctx', `with (ctx) { ${src}; return setBlockVersion; }`)(ctx) };
    };
    const vs  = ctx => ctx.editBlocks.map(b => b.version).join(',');
    const ids = ctx => ctx.editBlocks.map(b => b.id).join(',');

    let { ctx, set } = montar(base());
    set('b5', 3);
    check('v5->v3 (ocupado): v3->v4 e v4->v5', vs(ctx) === '1,2,4,5,3,3', vs(ctx));
    check('grupo ignora caixa e espacos ("a " anda junto com "A")', ctx.editBlocks[3].version === 5);
    check('outro subtitulo intocado', ctx.editBlocks[5].version === 3);
    check('so numeros mudam: a ordem da lista fica', ids(ctx) === 'b1,b2,b3,b4,b5,b6', ids(ctx));

    ({ ctx, set } = montar(base()));
    set('b2', 4);
    check('v2->v4 (subindo): v3->v2 e v4->v3', vs(ctx) === '1,4,2,3,5,3', vs(ctx));

    ({ ctx, set } = montar(base()));
    set('b5', 9);
    check('numero livre so grava', vs(ctx) === '1,2,3,4,9,3', vs(ctx));

    ({ ctx, set } = montar(base()));
    set('b3', 4);
    check('+1 num numero ocupado troca com o vizinho', vs(ctx) === '1,2,4,3,5,3', vs(ctx));

    ({ ctx, set } = montar(blocos([['A', 1], ['A', 2], ['A', 2], ['A', 3]])));
    set('b4', 1);
    check('duplicatas andam juntas', vs(ctx) === '2,3,3,1', vs(ctx));

    ({ ctx, set } = montar(base()));
    set('b1', 0);
    check('minimo 1', ctx.editBlocks[0].version === 1);

    ({ ctx, set } = montar(blocos([['', 1], ['', 2]])));
    set('b2', 1);
    check('sem subtitulo nao empurra', vs(ctx) === '1,1', vs(ctx));

    let api;
    ({ ctx, api, set } = montar(base(), true));
    set('b5', 3);
    check('empurrao empilha undo (nome esta na lista do embrulho)', api.undoLen() === 1, `len=${api.undoLen()}`);
    api.undoEditor();
    check('undo desfaz o empurrao inteiro', vs(ctx) === '1,2,3,4,5,3', vs(ctx));
  }
}

console.log('\nLunoda — teste do historico (undo/redo)\n');
console.log(out.join('\n'));
console.log(`\n  ${pass} ok, ${fail} falha(s)\n`);
process.exit(fail > 0 ? 1 : 0);
