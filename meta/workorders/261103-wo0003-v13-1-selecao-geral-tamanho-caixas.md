# WO 0003 — v13.1: quadrado geral de selecao respeitando o filtro + tamanho das caixas de texto (F4 parte 2) + registro

> **Tipo:** mista — CODIGO (`index.html`, `tests/history.mjs`, `tests/README.md`) + REGISTRO (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, log do dia).
> **Config sugerida:** Sonnet, `/effort` medio. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD em `49c087e`; `sha1sum index.html` = `24ca7e77df63b565167f649bcf7967cad456eba7`; arvore limpa exceto `meta/CONTEXT.md` e `meta/GLOSSARY.md` (gravados pelo chat, hashes abaixo) e esta WO. ANTES de aplicar: `node tests/smoke.mjs` 28/0 e `node tests/history.mjs` 28/0.
> **Base:** conversa de 2026-11-03 — quadrado aprovado como proposto (inclusive o confirm do Excluir com os ocultos); F4 parte 2: P1 (3) padrao Auto, P2 (a) cinco modos, P3 (b) sem «Min» nos blocos, P4 (a) botao direito torna padrao; detalhes do chat aprovados. Registradas como DEC-016 e DEC-017.
> **Depende de:** wo0002 (aplicada, `49c087e`).
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e o log. CONTEXT e GLOSSARY o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
17fc9ed8bbe7701042fd04ccf3fe3b4ad28b11fd  meta/CONTEXT.md
497a30c624f0a6eb6fc4523f5549d751aa95c092  meta/GLOSSARY.md
```

**Ancoras lidas em:** cada ancora foi RECORTADA por script dos arquivos do repositorio copiados do disco em 2026-11-03 18:2x (HEAD `49c087e`, `index.html` com o sha1 acima) e conferida com `count == 1`. O trecho literal e o proprio bloco «Ancora» de cada edicao. A WO inteira foi simulada numa copia aplicando as edicoes lidas DESTE arquivo.

---

## 1. Por que

Fecha a F4. O autor pediu um «selecionar todos» que respeite o filtro, desenhado pelas praticas mais comuns, e as caixas de texto com tamanho controlavel. A leitura do codigo mostrou dois defeitos que a WO tambem fecha: acoes em massa ja agiam em blocos escondidos pelo filtro sem aviso, e o confirm do Excluir em massa dizia «Nao pode ser desfeito» (falso desde a v12.2). E a verificacao pedida pelo autor achou ideias entregues na v13.0 ainda em «Ativas» no IDEAS.

## 2. Contexto factual

- **Medido no `index.html` (`49c087e`):** o filtro interno so esconde (`getFilteredBlocks`); `deleteSelectedBlocks`, mover, duplicar e transferir agem em todo `selectedBlockIds`; nao ha «selecionar todos»; `.fi-desc` min-height 56px, `.fi-ta` 90px com alca; o bloco ja tem colapsar (`toggleCollapse`); `box-sizing: border-box` global.
- **Medido em Chromium headless pelo chat** (copia com as edicoes de codigo DESTA WO, fixture `tests/fixtures/sample-db.json`): quadrado vazio/–/✓ certo com e sem filtro; com b1 e b3 marcados e filtro versao 1, contador «2 blocos selecionados · 1 fora do filtro», clique marca os visiveis e mantem b3, segundo clique deixa so b3; confirm do Excluir com «1 deles esta(ao) escondido(s) pelo filtro» e «Ctrl+Z desfaz», e o undo restaura; barras «Auto|Min|P|M|G» na descricao e «Auto|P|M|G» nos blocos; Auto cresce de 90 para 215 px ao digitar 8 linhas, sem rolagem; P fixa com rolagem; botao direito em M grava `{"desc":"auto","block":"m"}` e passa os 3 blocos para M; reabrir zera o ajuste por caixa e mantem o padrao; nenhum erro de JS.
- **Nao medido:** o Chrome real do autor e os dados reais dele — roteiro do autor.

## Inventario

33 edicoes com ancora + 1 de log (fim do arquivo) + 1 do Code, em 10 arquivos. Codigo: 11 edicoes no `index.html` — os pontos sairam de ler todo lugar que (a) mostra ou muda a selecao de blocos (`grep -n "selectedBlockIds" index.html`: cabecalho, `updateBlockMassBar`, `deleteSelectedBlocks`) e (b) cria ou mede as caixas (`grep -n "<textarea" index.html`: 2 caixas; `renderBlocks`, `toggleCollapse`, `openEditor`). Mover/duplicar/transferir NAO mudam: continuam agindo em todos os selecionados, e o contador agora mostra os ocultos.

---

## Edicao 0 — conferir hashes e baseline

`sha1sum index.html` = `24ca7e77df63b565167f649bcf7967cad456eba7`, e `sha1sum -c` nas 2 linhas acima -> `OK` nas duas. `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`; `node tests/history.mjs` -> `28 ok, 0 falha(s)`. Qualquer divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · quadrado geral no cabecalho dos blocos

**Forma:** Substituir.

**Ancora:**

````
        <div class="field-lbl" style="margin-bottom:0">Blocos de Conteúdo</div>
````

**Substituir por:**

````
        <div style="display:flex;align-items:center;gap:7px">
          <!-- Quadrado geral: age sobre os blocos VISÍVEIS (respeita o filtro) — DEC-016 -->
          <input type="checkbox" class="block-cb" id="blkSelAll" onclick="toggleSelectAllVisibleBlocks()" title="Selecionar todos os blocos visíveis">
          <div class="field-lbl" style="margin-bottom:0">Blocos de Conteúdo</div>
        </div>
````

## Edicao 2 — `index.html` · descricao dentro de ta-wrap

**Forma:** Substituir.

**Ancora:**

````
      <textarea class="fi fi-desc" id="epDesc" placeholder="Resumo rápido para identificação (não é obrigatório)..."></textarea>
````

**Substituir por:**

````
      <div class="ta-wrap" id="epDescWrap">
        <textarea class="fi fi-desc" id="epDesc" placeholder="Resumo rápido para identificação (não é obrigatório)..."></textarea>
      </div>
````

## Edicao 3 — `index.html` · corpo do bloco com botoes de tamanho

**Forma:** Substituir.

**Ancora:**

````
    <div class="block-body">
      <textarea class="fi fi-ta" data-bid="${b.id}"
````

**Substituir por:**

````
    <div class="block-body ta-wrap">
      ${taToolbarHTML(b.id)}
      <textarea class="fi fi-ta" data-bid="${b.id}"
````

## Edicao 4 — `index.html` · renderBlocks aplica os tamanhos

**Forma:** Substituir.

**Ancora:**

````
    n > 1 ? (v < n ? `${v} de ${n} blocos` : `${n} blocos`) : '';

  updateBlockMassBar();
}
````

**Substituir por:**

````
    n > 1 ? (v < n ? `${v} de ${n} blocos` : `${n} blocos`) : '';

  updateBlockMassBar();
  // Tamanho das caixas (DEC-017): o HTML acabou de ser recriado, reaplica o modo de cada uma
  editBlocks.forEach(b => taApply(b.id));
}
````

## Edicao 5 — `index.html` · toggleCollapse reaplica o tamanho

**Forma:** Substituir.

**Ancora:**

````
function toggleCollapse(bid) {
  document.querySelector(`.block-item[data-bid="${bid}"]`)?.classList.toggle('collapsed');
}
````

**Substituir por:**

````
function toggleCollapse(bid) {
  document.querySelector(`.block-item[data-bid="${bid}"]`)?.classList.toggle('collapsed');
  taApply(bid);   // ao expandir, o Auto precisa medir o conteúdo de novo
}
````

## Edicao 6 — `index.html` · openEditor zera o ajuste por caixa

**Forma:** Substituir.

**Ancora:**

````
  // Reset seleção e filtro de blocos ao abrir editor
  selectedBlockIds.clear();
````

**Substituir por:**

````
  // Reset seleção e filtro de blocos ao abrir editor
  // (e o ajuste de tamanho por caixa, que vale só enquanto a entrada está aberta — DEC-017)
  taSessionModes = {};
  selectedBlockIds.clear();
````

## Edicao 7 — `index.html` · openEditor desenha a barra da descricao

**Forma:** Substituir.

**Ancora:**

````
  document.getElementById('editorPanel').classList.add('open');
  document.getElementById('editorOverlay').classList.add('visible');

  dirtySnapshot = getEditorSnapshot();
````

**Substituir por:**

````
  document.getElementById('editorPanel').classList.add('open');
  document.getElementById('editorOverlay').classList.add('visible');
  taRenderDescBar();
  requestAnimationFrame(taRefreshAll);   // mede depois que o painel está visível

  dirtySnapshot = getEditorSnapshot();
````

## Edicao 8 — `index.html` · contador mostra os ocultos + estado do quadrado

**Forma:** Substituir.

**Ancora:**

````
  if (cnt) cnt.textContent = `${n} bloco${n!==1?'s':''} selecionado${n!==1?'s':''}`;
````

**Substituir por:**

````
  const hid = hiddenSelectedCount();
  if (cnt) cnt.textContent = `${n} bloco${n!==1?'s':''} selecionado${n!==1?'s':''}`
    + (hid > 0 ? ` · ${hid} fora do filtro` : '');
  // Quadrado geral: ✓ todos os visíveis · – parte deles · vazio nenhum (DEC-016)
  const sa = document.getElementById('blkSelAll');
  if (sa) {
    const st = blockSelectAllState();
    sa.checked = st === 'all';
    sa.indeterminate = st === 'mixed';
    sa.title = st === 'all' ? 'Desmarcar os blocos visíveis' : 'Selecionar todos os blocos visíveis';
  }
````

## Edicao 9 — `index.html` · confirm de excluir com os ocultos

**Forma:** Substituir.

**Ancora:**

````
  if (!confirm(`Excluir ${n} bloco(s) selecionado(s)? Não pode ser desfeito.`)) return;
````

**Substituir por:**

````
  const hid = hiddenSelectedCount();
  // Avisa o que o filtro esconde: excluir o que não se vê é o risco que o contador sozinho não fecha (DEC-016)
  if (!confirm(`Excluir ${n} bloco(s) selecionado(s)?`
    + (hid > 0 ? `\n\n${hid} deles está(ão) escondido(s) pelo filtro e também será(ão) excluído(s).` : '')
    + `\n\nCtrl+Z desfaz.`)) return;
````

## Edicao 10 — `index.html` · funcoes novas: selecao geral + tamanho das caixas

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ──────────────────────────────
   FILTRO INTERNO DE BLOCOS
────────────────────────────── */
````

**Substituir por:**

````
/* Estado do quadrado geral sobre os blocos VISÍVEIS (respeita o filtro): 'none' | 'all' | 'mixed'.
   Selecionados escondidos pelo filtro não entram na conta (DEC-016). */
function blockSelectAllState() {
  const vis = getFilteredBlocks();
  if (vis.length === 0) return 'none';
  const n = vis.filter(b => selectedBlockIds.has(b.id)).length;
  return n === 0 ? 'none' : (n === vis.length ? 'all' : 'mixed');
}

/* Clique no quadrado geral — a mesma regra da DEC-013, aplicada à seleção (DEC-016):
   todos os visíveis marcados → desmarca só os visíveis; senão (nenhum ou misto) → marca todos os visíveis.
   Os escondidos pelo filtro ficam como estão; o contador os mostra e o ✕ Sel limpa tudo. */
function toggleSelectAllVisibleBlocks() {
  const vis = getFilteredBlocks();
  const all = blockSelectAllState() === 'all';
  vis.forEach(b => all ? selectedBlockIds.delete(b.id) : selectedBlockIds.add(b.id));
  renderBlocks();   // redesenha checkboxes e destaque; chama updateBlockMassBar
}

/* Quantos selecionados o filtro está escondendo (só blocos que existem na entrada). */
function hiddenSelectedCount() {
  const vis = new Set(getFilteredBlocks().map(b => b.id));
  return editBlocks.filter(b => selectedBlockIds.has(b.id) && !vis.has(b.id)).length;
}

/* ──────────────────────────────
   TAMANHO DAS CAIXAS DE TEXTO (F4 parte 2 — DEC-017)
   Padrão por tipo de caixa no localStorage (fora do db, como o frontmatter — DEC-011);
   ajuste por caixa só enquanto a entrada está aberta. 'min' só existe na descrição:
   nos blocos, o colapsar já cumpre esse papel.
────────────────────────────── */
const TA_SIZE_KEY = 'lunoda_ta_size';
const TA_MODES = { desc: ['auto', 'min', 'p', 'm', 'g'], block: ['auto', 'p', 'm', 'g'] };
const TA_LINES = { min: 1, p: 4, m: 10, g: 20 };   // altura em linhas de texto
const TA_LABEL = { auto: 'Auto', min: 'Mín', p: 'P', m: 'M', g: 'G' };
const TA_TIP   = { auto: 'cresce com o texto', min: 'uma linha', p: 'pequena', m: 'média', g: 'grande' };
let taSessionModes = {};   // { 'desc' | blockId: modo } — zera ao abrir outra entrada

function taDefaults() {
  try {
    const v = JSON.parse(localStorage.getItem(TA_SIZE_KEY) || '{}') || {};
    return { desc: v.desc || 'auto', block: v.block || 'auto' };
  } catch (_) { return { desc: 'auto', block: 'auto' }; }
}
function taKind(key) { return key === 'desc' ? 'desc' : 'block'; }
function taModeOf(key) {
  const m = taSessionModes[key] || taDefaults()[taKind(key)];
  return TA_MODES[taKind(key)].includes(m) ? m : 'auto';
}
function taElOf(key) {
  return key === 'desc' ? document.getElementById('epDesc')
                        : document.querySelector(`textarea.fi-ta[data-bid="${key}"]`);
}

/* Auto: altura = conteúdo (sem rolagem interna; a rolagem passa a ser a do editor).
   Caixa fora da tela (filtrada, colapsada) mede 0 — aí não mexe; reaplica quando aparecer. */
function taFit(el) {
  if (!el || el.offsetParent === null) return;
  const cs = getComputedStyle(el);
  const borders = (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
  el.style.height = 'auto';
  el.style.height = (el.scrollHeight + borders) + 'px';   // box-sizing: border-box
}

/* Aplica o modo à caixa e marca o botão ativo. Fora do Auto, a alça manual volta para o ajuste fino. */
function taApply(key) {
  const el = taElOf(key); if (!el) return;
  const mode = taModeOf(key);
  el.dataset.taMode = mode;
  if (mode === 'auto') {
    el.style.resize = 'none'; el.style.overflowY = 'hidden'; el.style.minHeight = '';
    taFit(el);
  } else {
    const cs  = getComputedStyle(el);
    const lh  = parseFloat(cs.lineHeight) || 20;
    const box = (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0)
              + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.borderBottomWidth) || 0);
    el.style.resize = 'vertical'; el.style.overflowY = 'auto'; el.style.minHeight = '0';
    el.style.height = Math.round(TA_LINES[mode] * lh + box) + 'px';
  }
  const bar = document.querySelector(`.ta-size[data-ta="${key}"]`);
  if (bar) bar.querySelectorAll('button').forEach(btn => btn.classList.toggle('on', btn.dataset.mode === mode));
}

/* Barra de botões de uma caixa; o ponto marca o padrão do tipo. */
function taToolbarHTML(key) {
  const kind = taKind(key), def = taDefaults()[kind];
  return `<div class="ta-size" data-ta="${key}">` + TA_MODES[kind].map(m =>
    `<button type="button" data-mode="${m}" title="${TA_LABEL[m]} — ${TA_TIP[m]}${m === def ? ' (padrão)' : ''} · botão direito: usar como padrão">`
    + `${TA_LABEL[m]}${m === def ? '<span class="ta-def-dot"></span>' : ''}</button>`).join('') + `</div>`;
}
function taRenderDescBar() {
  const w = document.getElementById('epDescWrap'); if (!w) return;
  w.querySelector('.ta-size')?.remove();
  w.insertAdjacentHTML('afterbegin', taToolbarHTML('desc'));
}
/* Redesenha todas as barras (o ponto do padrão muda) e reaplica todos os tamanhos. */
function taRefreshAll() {
  document.querySelectorAll('.ta-size').forEach(bar => { bar.outerHTML = taToolbarHTML(bar.dataset.ta); });
  taApply('desc');
  editBlocks.forEach(b => taApply(b.id));
}

// Esquerdo: só esta caixa, só nesta sessão. Direito: vira o padrão do tipo (DEC-017, mesmo gesto da DEC-014).
document.addEventListener('click', ev => {
  const btn = ev.target.closest && ev.target.closest('.ta-size button'); if (!btn) return;
  const key = btn.closest('.ta-size').dataset.ta;
  taSessionModes[key] = btn.dataset.mode;
  taApply(key);
});
document.addEventListener('contextmenu', ev => {
  const btn = ev.target.closest && ev.target.closest('.ta-size button'); if (!btn) return;
  ev.preventDefault();
  const key = btn.closest('.ta-size').dataset.ta, kind = taKind(key), mode = btn.dataset.mode;
  const d = taDefaults(); d[kind] = mode;
  try { localStorage.setItem(TA_SIZE_KEY, JSON.stringify(d)); } catch (_) {}
  delete taSessionModes[key];   // a caixa clicada passa a seguir o padrão novo
  taRefreshAll();
  showToast(`Padrão das caixas ${kind === 'desc' ? 'de descrição' : 'dos blocos'}: ${TA_LABEL[mode]}`);
});
// Auto acompanha a digitação
document.addEventListener('input', ev => {
  const el = ev.target;
  if (el && el.dataset && el.dataset.taMode === 'auto') taFit(el);
});

/* ──────────────────────────────
   FILTRO INTERNO DE BLOCOS
────────────────────────────── */
````

## Edicao 11 — `index.html` · CSS dos botoes de tamanho

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
.fi-ta    { font-size: 13px; line-height: 1.7; resize: vertical; min-height: 90px; }
````

**Substituir por:**

````
.fi-ta    { font-size: 13px; line-height: 1.7; resize: vertical; min-height: 90px; }
/* Tamanho das caixas (DEC-017): botões no canto, só ao passar o mouse —
   no foco eles cobririam o texto enquanto se digita */
.ta-wrap { position: relative; }
.ta-size { position: absolute; top: 5px; right: 8px; display: flex; gap: 2px; z-index: 2;
  opacity: 0; pointer-events: none; transition: opacity .12s; }
.block-body.ta-wrap .ta-size { top: 13px; right: 16px; }
.ta-wrap:hover .ta-size { opacity: 1; pointer-events: auto; }
.ta-size button { font-family: var(--mono); font-size: 9px; line-height: 1; padding: 3px 5px;
  border-radius: 4px; border: 1px solid var(--border-soft); background: var(--surface3);
  color: var(--text-dim); cursor: pointer; }
.ta-size button:hover { color: var(--text); }
.ta-size button.on { color: var(--text); border-color: var(--accent); }
.ta-def-dot { display: inline-block; width: 3px; height: 3px; border-radius: 50%;
  background: currentColor; margin-left: 3px; vertical-align: middle; }
````

## Edicao 12 — `tests/history.mjs` · secao 12: quadrado geral com filtro

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
console.log('\nLunoda — teste do historico (undo/redo)\n');
````

**Substituir por:**

````
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

console.log('\nLunoda — teste do historico (undo/redo)\n');
````

## Edicao 13 — `tests/README.md` · README: contagem

**Forma:** Substituir.

**Ancora:**

````
Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 28 asserções, incluindo:
````

**Substituir por:**

````
Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 39 asserções, incluindo:
````

## Edicao 14 — `tests/README.md` · README: item do quadrado

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **uniformizar nos blocos selecionados** (DEC-013), com a função REAL recortada do `index.html`: misto → todos recebem, todos têm → todos perdem, bloco não selecionado intocado, e o nome na lista do embrulho (undo).
````

**Substituir por:**

````
- **uniformizar nos blocos selecionados** (DEC-013), com a função REAL recortada do `index.html`: misto → todos recebem, todos têm → todos perdem, bloco não selecionado intocado, e o nome na lista do embrulho (undo).
- **quadrado geral de seleção com filtro** (DEC-016), com as funções REAIS: misto → marca todos os visíveis e mantém o oculto; todos → desmarca só os visíveis; o contador de ocultos ignora id que não existe mais.
````

## Edicao 15 — `meta/DECISIONS.md` · DEC-016 e DEC-017 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
A F6 fica desbloqueada e especificada. A função nova entra na lista do embrulho do undo.
````

**Substituir por:**

````
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
````

## Edicao 16 — `meta/CHANGELOG.md` · [13.1.0] acima da 13.0

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.0.0] — 2026-11-03
````

**Substituir por:**

````
## [13.1.0] — 2026-11-03

### Adicionado
- **Quadrado geral de seleção de blocos** (DEC-016) no cabeçalho da lista: age sobre os blocos **visíveis** (respeita o filtro), com `–` no estado misto. O contador mostra quantos selecionados estão **fora do filtro**.
- **Tamanho das caixas de texto** (F4 parte 2, DEC-017): botões Auto · Mín · P · M · G na descrição e Auto · P · M · G nos blocos, ao passar o mouse. **Auto** (padrão) cresce com o texto, sem rolagem interna. Clique esquerdo ajusta só aquela caixa enquanto a entrada está aberta; botão direito torna o modo o padrão.
- `tests/history.mjs` cobre o quadrado geral com filtro (11 asserções novas, 39 no total).

### Modificado
- O confirm do Excluir em massa diz quantos dos blocos estão escondidos pelo filtro.

### Corrigido
- O confirm do Excluir em massa dizia «Não pode ser desfeito»; desde a v12.2 o `Ctrl+Z` desfaz. Texto corrigido.

## [13.0.0] — 2026-11-03
````

## Edicao 17 — `meta/IDEAS.md` · ideia inverter posse: status

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: `Lunoda_ideias.txt`. Depende de checkbox por bloco (já existe na v12). **Ver conflito C1 abaixo.**
````

**Substituir por:**

````
> Fonte: `Lunoda_ideias.txt`. Depende de checkbox por bloco (já existe na v12). **Ver conflito C1 abaixo.**
> **Status (2026-11-03):** implementada na v13.0 com a regra **uniformizar** em vez de inverter (DEC-013) — ver Concluídas.
````

## Edicao 18 — `meta/IDEAS.md` · ideia caixas de texto: status

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: `Lunoda_ideias.txt`. Viável (autosize de textarea é simples). Baixo risco.
````

**Substituir por:**

````
> Fonte: `Lunoda_ideias.txt`. Viável (autosize de textarea é simples). Baixo risco.
> **Status (2026-11-03):** implementada na v13.1 (DEC-017); «minimizar» ficou só na descrição — nos blocos, o colapsar cumpre o papel. Ver Concluídas.
````

## Edicao 19 — `meta/IDEAS.md` · ideia botoes do mouse: status

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: `Lunoda_ideias.txt`. **Ver conflitos C1 e C2 abaixo.** Envolve `contextmenu` (botão direito) e `auxclick`/mousedown botão 1 (meio); exige `preventDefault` do menu de contexto.
````

**Substituir por:**

````
> Fonte: `Lunoda_ideias.txt`. **Ver conflitos C1 e C2 abaixo.** Envolve `contextmenu` (botão direito) e `auxclick`/mousedown botão 1 (meio); exige `preventDefault` do menu de contexto.
> **Status (2026-11-03):** esquerdo e direito implementados na v13.0 (DEC-013, DEC-014); o **botão do meio** segue aberto, junto com a herança entre versões (F5, C3).
````

## Edicao 20 — `meta/IDEAS.md` · ideia empurrao de versao: status + ideia nova do quadrado

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: `Lunoda_ideias.txt`. **Ver questão aberta Q1.**
````

**Substituir por:**

````
> Fonte: `Lunoda_ideias.txt`. **Ver questão aberta Q1.**
> **Status (2026-11-03):** Q1 resolvida (DEC-015); implementação na F6.

### 2026-11 — Selecionar/desmarcar todos os blocos, respeitando o filtro
Um quadrado geral para marcar ou desmarcar todos os blocos, que funcione conforme o filtro (age no que está aparecendo), com símbolo próprio quando só parte está marcada, desenhado segundo as práticas mais comuns e intuitivas. Pergunta do autor: com 4 de 10 marcados e um filtro que mostra 6 (2 deles marcados), o que o clique faz, e o que acontece com os 2 marcados que o filtro escondeu?
> Fonte: conversa de 2026-11-03. **Status:** implementada na v13.1 (DEC-016) — ver Concluídas.
````

## Edicao 21 — `meta/IDEAS.md` · Adiadas: gatilho da (c) atualizado

**Forma:** Substituir.

**Ancora:**

````
- **Esquerdo sem seleção = marcar em todos os blocos da entrada** (opção (c) da C2) — adiada porque, no hábito antigo, o clique que ligava o automático viraria marcação em massa — **volta quando** o autor notar que seleciona todos os blocos à mão com frequência (hoje o editor não tem «selecionar todos os blocos»).
````

**Substituir por:**

````
- **Esquerdo sem seleção = marcar em todos os blocos da entrada** (opção (c) da C2) — adiada porque, no hábito antigo, o clique que ligava o automático viraria marcação em massa — **volta quando** o autor notar que, mesmo com o quadrado geral da v13.1 (DEC-016), ainda marca todos os blocos com frequência só para aplicar uma propriedade.
````

## Edicao 22 — `meta/IDEAS.md` · Concluidas: tres entradas novas no topo

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Frontmatter YAML na exportação Markdown**
````

**Substituir por:**

````
## ✅ Concluídas

- **Quadrado geral de seleção respeitando o filtro** — v13.1 / DEC-016.
- **Tamanho das caixas de texto (Auto · Mín · P · M · G)** — v13.1 / DEC-017. Fecha a F4.
- **Marcar propriedade nos blocos selecionados (uniformizar) + botão direito para o automático** — v13.0 / DEC-013, DEC-014.

- **Frontmatter YAML na exportação Markdown**
````

## Edicao 23 — `meta/IDEAS.md` · Feedback para o Kit: licao de processo

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **Arquivo no lugar errado:** `meta/README.md` era a versão nova do `tests/README.md`. Nenhuma comparação do pacote apontaria isso; apareceu porque o CONTEXT dizia que um README em `meta/` «seria outro arquivo».
````

**Substituir por:**

````
- **Arquivo no lugar errado:** `meta/README.md` era a versão nova do `tests/README.md`. Nenhuma comparação do pacote apontaria isso; apareceu porque o CONTEXT dizia que um README em `meta/` «seria outro arquivo».

### 2026-11-03 — Instrução de ritmo vazou do lote em que foi dada
O autor pediu as decisões C1, C2 e Q1 «uma de cada vez». O assistente carregou o pedido para as perguntas da F4 parte 2, que eram independentes, e gastou um turno do autor entregando uma pergunta só — contra o princípio «consolida perguntas inevitáveis num único momento». Lição: instrução de ritmo vale para o lote em que foi dada; perguntas independentes vêm juntas, e só se separa quando a resposta de uma muda a outra, dizendo o motivo. Se repetir, vira item no CEREBRO.
### 2026-11-03 — Ideia implementada ficou em «Ativas»
A wo0002 implementou duas ideias do autor e não mudou o status delas no IDEAS; só apareceu na conferência da wo0003. Sugestão ao kit: o checklist da WO que entrega uma ideia inclui «status da ideia no IDEAS → Concluídas».
````

## Edicao 24 — `meta/ROADMAP.md` · F4: titulo

**Forma:** Substituir.

**Ancora:**

````
## 🟡 F4 — UX de propriedades avançada + conforto de edição *(em curso — parte 1 na v13.0)*
````

**Substituir por:**

````
## 🟢 F4 — UX de propriedades avançada + conforto de edição *(entregue — v13.0 e v13.1; v13.1 falta conferir no navegador)*
````

## Edicao 25 — `meta/ROADMAP.md` · F4: parte 1 conferida

**Forma:** Substituir.

**Ancora:**

````
- [x] Propriedades em blocos selecionados — **uniformizar** (DEC-013), v13.0. Falta conferir no navegador.
````

**Substituir por:**

````
- [x] Propriedades em blocos selecionados — **uniformizar** (DEC-013), v13.0. Conferida no navegador pelo autor.
````

## Edicao 26 — `meta/ROADMAP.md` · F4: parte 2 entregue

**Forma:** Substituir.

**Ancora:**

````
- [ ] Controles de tamanho / autosize das caixas de texto — parte 2.
````

**Substituir por:**

````
- [x] Controles de tamanho / autosize das caixas de texto — parte 2 (DEC-017), v13.1.
- [x] Quadrado geral de seleção respeitando o filtro (DEC-016), v13.1 — pedido no caminho da F4.
````

## Edicao 27 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.0** — 2026-11-03 — marcar propriedade nos blocos selecionados (uniformizar) e botão direito para a adição automática (F4 parte 1). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 28/28 (rodada da wo0002).
````

**Substituir por:**

````
**Lunoda v13.1** — 2026-11-03 — quadrado geral de seleção respeitando o filtro e tamanho das caixas de texto (F4 concluída). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 39/39 (rodada da wo0003).
````

## Edicao 28 — `meta/STATUS.md` · funcionando: itens novos

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Marcar propriedade nos blocos selecionados (uniformizar, `✓`/`–`) e botão direito para a adição automática (v13.0).
````

**Substituir por:**

````
- Marcar propriedade nos blocos selecionados (uniformizar, `✓`/`–`) e botão direito para a adição automática (v13.0).
- Quadrado geral de seleção de blocos, que age nos visíveis e mostra os selecionados fora do filtro (v13.1).
- Tamanho das caixas de texto: Auto (padrão) · Mín · P · M · G, padrão pelo botão direito (v13.1).
````

## Edicao 29 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.0 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03 (o resultado volta para o chat).
````

**Substituir por:**

````
- **v13.1 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03. A v13.0 já foi conferida pelo autor (roteiro de 8 itens, todos ok).
````

## Edicao 30 — `meta/STATUS.md` · backlog: v13.0 conferida sai, v13.1 entra

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.0 no navegador** (roteiro na conversa de 2026-11-03).
````

**Substituir por:**

````
- [ ] **Conferir a v13.1 no navegador** (roteiro na conversa de 2026-11-03).
````

## Edicao 31 — `meta/STATUS.md` · backlog: proxima frente

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Projetar a F4 parte 2 (caixas de texto) e a F6 (empurrão de versão, DEC-015)** como WOs. Alternativa: **F9 parte 2 — reimportar `.md`**.
````

**Substituir por:**

````
- [ ] **Projetar a F6 — empurrão de versão (DEC-015)** como WO. Alternativa: **F9 parte 2 — reimportar `.md`**.
````

## Edicao 32 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1 (uniformizar, DEC-013), C2 (botão direito = automático, DEC-014) e Q1 (empurrão de versão, DEC-015). Entregue a **v13.0** (F4 parte 1) pela wo0002.
````

**Substituir por:**

````
**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1, C2 e Q1 (DEC-013/014/015); entregue a **v13.0** (wo0002, `49c087e`), conferida no navegador. Desenhados e entregues o quadrado geral de seleção (DEC-016) e o tamanho das caixas (DEC-017): **v13.1** pela wo0003.
````

## Edicao 33 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.0 no navegador; depois F4 parte 2 ou F6.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.1 no navegador; depois F6 ou F9 parte 2.
````

## Edicao 34 — `logs/2026-11-03.md` · secao do chat (continuacao 2)

**Forma:** ACRESCENTAR NO FIM DO ARQUIVO (sem ancora: a ultima linha do log se repete em duas secoes do Code, entao nao e unica). Garanta UMA quebra de linha entre o fim atual e o texto abaixo.

**Texto:**

````

## Conversa 1 — chat (planejamento, continuação 2)

### Feito
- Conferido o relatório da wo0002 (`49c087e`, alinhado com `origin/main`); testes rodados pelo chat no repositório: smoke 28/0, history 28/0. Roteiro v13.0 do autor: 8/8 ok. Relatório da wo0001 arquivado.
- Ideia nova do autor — quadrado geral de seleção respeitando o filtro — pesquisada (design systems e reclamações de usuários de tabelas) e desenhada; aprovada como proposta (DEC-016).
- F4 parte 2 decidida: P1 = híbrido com padrão Auto; P2 = cinco modos; P3 = sem «Mín» nos blocos; P4 = botão direito torna padrão (DEC-017). Dois ajustes do chat, ditos ao autor: padrão por tipo de caixa (não único) e botões só no hover.
- Escrita a wo0003 (v13.1). Edições de código testadas no Chromium em cópia (seleção com filtro, contador de ocultos, confirm, os cinco modos, padrão pelo botão direito, reabrir a entrada) — nenhum erro de JS; WO inteira simulada contra o repositório a partir do próprio texto.
- A ponte com o computador caiu duas vezes no meio do turno; o código foi feito sobre uma cópia de hash conferido (`24ca7e77`) e só depois cruzado com o disco.

### Aprendizados / armadilhas
- O chat separou em dois turnos perguntas independentes, carregando um «uma de cada vez» que valia só para C1/C2/Q1. Registrado no Feedback para o Kit.
- A wo0002 entregou duas ideias sem mudar o status delas no IDEAS; a verificação pedida pelo autor pegou. Corrigido nesta WO.
- Achados de leitura: o confirm do Excluir em massa dizia «Não pode ser desfeito» (falso desde a v12.2), e ações em massa já agiam em blocos escondidos pelo filtro sem aviso.
````

## Edicao 35 — `logs/2026-11-03.md` · secao do Code

Depois da Edicao 34, acrescente no FIM do arquivo `## Conversa 1 — Code (execucao, wo0003)` com o seu relatorio resumido. Nao altere as outras secoes.

---

## Fora de escopo

- F6 (empurrao de versao), F5 (botao do meio / heranca entre versoes), F9 parte 2.
- Mover, duplicar e transferir em massa: comportamento inalterado (agem em todos os selecionados).
- Higiene geral do IDEAS (ideias concluidas repetidas em «Ativas — Assistente»; ideias fora da secao) — segue no backlog. Esta WO so marca o status das ideias do autor entregues na v13.0/v13.1.
- O confirm de excluir ENTRADA («Excluir esta entrada? Nao pode ser desfeito.») e verdadeiro (o undo e do editor) — nao mexer.

## Armadilhas desta WO

- `index.html` cheio de glifos (`✓`, `–`, `·`, `—`); as ancoras os contem porque foram recortadas por script. Aplique por script ou edicao exata, nunca redigitando. Arquivos LF.
- Edicao 8 (confirm): o texto novo tem `\n` DENTRO de template literal JS — e a sequencia de escape de dois caracteres (barra + n), nao quebra de linha real. Confira com `grep -c 'escondido(s) pelo filtro e' index.html` = 1 numa linha so.
- A Edicao 9 insere ~150 linhas ANTES do comentario do «FILTRO INTERNO DE BLOCOS»; depois dela, `^function getFilteredBlocks(` continua 1.
- `tests/history.mjs`: a secao 12 entra ANTES da linha `console.log('\nLunoda — teste do historico (undo/redo)\n');`, como a secao 11 entrou.
- Log: a ultima linha do arquivo (`- **Commit/push:** ver ...`) existe em DUAS secoes do Code — por isso a Edicao 34 acrescenta no fim, sem ancora.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado — em vermelho, suspeite primeiro do instrumento.

- [ ] `git status --short` -> exatamente `M` em: `index.html logs/2026-11-03.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/history.mjs`, e `??` nesta WO. Nada alem.
- [ ] `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`.
- [ ] `node tests/history.mjs` -> `39 ok, 0 falha(s)` (28 antigas + 11 da secao 12).
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"` -> `SINTAXE_OK`.
- [ ] `wc -l index.html` -> `3308`.
- [ ] Sem duplicacao, por LINHA (`grep -c`), todos -> 1: `"^function toggleSelectAllVisibleBlocks("` · `"^function blockSelectAllState("` · `"^function hiddenSelectedCount("` · `"^function taApply("` · `"^function taFit("` · `"^function getFilteredBlocks("` · `"^function renderEditorProps("` · `'id="blkSelAll"'` · `'id="epDescWrap"'` · `'${taToolbarHTML(b.id)}'` · `"^const TA_SIZE_KEY = 'lunoda_ta_size';"` · `"escondido(s) pelo filtro e"` · `"taApply(bid);   // ao expandir"`. E `grep -c "Não pode ser desfeito" index.html` -> `1` (sobra so o confirm de excluir ENTRADA, que e verdadeiro).
- [ ] Registro: `grep -c "^## DEC-01[67] " meta/DECISIONS.md` -> 2 · `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.1.0] — 2026-11-03`, `## [13.0.0] — 2026-11-03` · `grep -c "^> \*\*Status (2026-11-03):\*\*" meta/IDEAS.md` -> 4 · `grep -c "^### 2026-11 — Selecionar/desmarcar todos os blocos" meta/IDEAS.md` -> 1 · `grep -c "^### 2026-11-03 — Instrução de ritmo vazou" meta/IDEAS.md` -> 1 · `grep -c "^## 🟢 F4" meta/ROADMAP.md` -> 1 · `grep -c "^\*\*Lunoda v13.1\*\*" meta/STATUS.md` -> 1 · `grep -c "Conferir a v13.0 no navegador" meta/STATUS.md` -> 0 · `grep -c "39 asserções" tests/README.md` -> 1 · `grep -c "^## Conversa 1 — chat (planejamento, continuação 2)" logs/2026-11-03.md` -> 1.
- [ ] **Teste no navegador — NAO e seu.** Exige olho humano num renderizador: vai como roteiro ao autor, no fecho do chat. **Chega no ramo?** cabecalho -> `toggleSelectAllVisibleBlocks` -> `renderBlocks` -> `updateBlockMassBar`; caixas: `openEditor` -> `taRenderDescBar`/`taRefreshAll` -> `taApply`/`taFit`. **Pergunta que os testes NAO respondem:** «presta na tela, com os dados reais?» — contraste dos botoes, altura com texto longo de verdade.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0003.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/history.mjs tests/README.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md meta/CONTEXT.md meta/GLOSSARY.md logs/2026-11-03.md meta/workorders/261103-wo0003-v13-1-selecao-geral-tamanho-caixas.md
```

```
git commit -m "feat(blocos): quadrado geral de selecao respeitando o filtro e tamanho das caixas de texto" -m "v13.1, fecha a F4. Quadrado no cabecalho age nos blocos visiveis, mostra os selecionados fora do filtro e o confirm do Excluir os avisa (DEC-016). Caixas com Auto, Min, P, M e G; botao direito torna padrao, guardado fora do db (DEC-017). Corrige o confirm que dizia nao poder desfazer. history.mjs ganha 11 assercoes. IDEAS marca as ideias entregues na v13.0."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-03 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
