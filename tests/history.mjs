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

function novoEditor() {
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

console.log('\nLunoda — teste do historico (undo/redo)\n');
console.log(out.join('\n'));
console.log(`\n  ${pass} ok, ${fail} falha(s)\n`);
process.exit(fail > 0 ? 1 : 0);
