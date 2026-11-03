# WO 0002 — v13.0: marcar propriedade nos blocos selecionados e botao direito para o automatico (F4 parte 1) + registro de C1, C2 e Q1

> **Tipo:** mista — CODIGO (`index.html`, `tests/history.mjs`, `tests/README.md`) + REGISTRO (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, log do dia).
> **Config sugerida:** Sonnet, `/effort` medio. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD em `552d577`, arvore limpa exceto `meta/GLOSSARY.md` e `meta/CONTEXT.md` (gravados pelo chat, hashes abaixo) e esta WO. `node tests/smoke.mjs` 28/0 e `node tests/history.mjs` 18/0 ANTES de aplicar.
> **Base:** decisoes do autor em 2026-11-03 — C1 = uniformizar, C2 = (b), Q1 = (1) com as regras propostas. Registradas aqui como DEC-013, DEC-014, DEC-015.
> **Depende de:** wo0001 (aplicada, `552d577`).
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e o log (Edicoes 12-24). GLOSSARY e CONTEXT o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
9b586539f39d455b2fd493af35a5aa96a394e4f8  meta/GLOSSARY.md
2127929f5c2193266d5c6badfcc25d6e161c4b94  meta/CONTEXT.md
```

**Ancoras lidas em:** cada ancora foi RECORTADA por script do arquivo vivo em 2026-11-03 (HEAD `552d577` + as duas gravacoes acima) e conferida com `count == 1`. O trecho literal e o proprio bloco «Ancora» de cada edicao. A WO inteira foi simulada numa copia aplicando as edicoes lidas DESTE arquivo.

---

## 1. Por que

A F4 estava parada so por decisoes (C1, C2, Q1), fechadas hoje pelo autor. Esta WO entrega a parte de propriedades da F4 (v13.0) e registra as tres decisoes. No caminho, corrige um texto de ajuda que contradizia a DEC-004 desde a v12.

## 2. Contexto factual

- **Medido no `index.html` (552d577):** o clique esquerdo numa opcao do painel da entrada chamava `toggleEntryPropAuto` (so o automatico); o app nao tinha `contextmenu` em lugar nenhum; `updateBlockMassBar` e chamada em toda mudanca de selecao; `restoreEditorSnapshot` limpa a selecao; o embrulho do undo cobre os nomes de uma lista literal.
- **Medido:** o texto de ajuda dizia «ao clicar, a opcao e adicionada a todos os blocos existentes e futuros», e o codigo so marca NOVOS blocos (DEC-004).
- **Medido na simulacao:** smoke 28/0, history 28/0, sintaxe OK, `index.html` 3.084 -> 3.140 linhas. Prova de vida: o teste novo contra o `index.html` antigo da 18 ok / 1 falha; com o nome fora do embrulho, 26 ok / 2 falhas.
- **Medido pelo chat em Chromium headless** (copia do `index.html` com as 6 edicoes de codigo DESTA WO, fixture `tests/fixtures/sample-db.json`): sem selecao o clique nao muda nada e mostra o aviso; misto mostra `–` e o clique da a todos os selecionados; todos-tem remove de todos; bloco nao selecionado intocado; undo desfaz; botao direito liga o automatico com `defaultPrevented = true`; nenhum erro de JS. **Nao medido:** botao direito no chip do BLOCO e o Chrome real do autor — vao no roteiro dele.

## Inventario

24 edicoes em 11 arquivos: `index.html` (6: renderEditorProps + 2 funcoes novas, toggleEntryPropAuto, chip do bloco, updateBlockMassBar, lista do embrulho, CSS), `tests/history.mjs` (3), `tests/README.md` (2), DECISIONS (1), CHANGELOG (1), IDEAS (3), ROADMAP (2), STATUS (5), log (1). Os pontos do `index.html` sairam de ler TODO clique em opcao de propriedade: `grep -n "toggleEntryPropAuto(\|toggleBlockPropOpt(\|disableAutoFromBlock(" index.html` — painel da entrada (1 lugar) e painel do bloco (1 lugar, `buildBlockPropBody`).

---

## Edicao 0 — conferir hashes e baseline

`sha1sum -c` com as 2 linhas acima -> `OK` nas duas. E `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`; `node tests/history.mjs` -> `18 ok, 0 falha(s)`. Qualquer divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · renderEditorProps refeita + onEntryOptClick + applyPropToSelectedBlocks

**Forma:** Substituir (funcao inteira; as duas funcoes novas entram logo depois dela).

**Ancora:**

````
function renderEditorProps() {
  const area = document.getElementById('epPropsArea');
  area.innerHTML = '';
  if (db.properties.length === 0) return;

  const wrap = document.createElement('div');
  wrap.className = 'ep-prop-section';

  let html = `<div class="field-lbl" style="margin-bottom:4px">Propriedades</div>`;
  html += `<div class="ep-props-hint">● = herança ativa — ao clicar, a opção é adicionada a todos os blocos existentes e futuros. Clique novamente para desativar (não remove dos blocos).</div>`;
  html += `<div class="ep-props-wrap">`;

  db.properties.forEach(prop => {
    if (prop.options.length === 0) return;
    const autoFlags = editPropAutoFlags[prop.id] || [];

    html += `<div class="ep-prop-group">
      <span class="ep-prop-lbl">${esc(prop.name)}</span>
      <div class="ep-prop-opts-row">`;

    prop.options.forEach(opt => {
      const col    = getColor(opt.colorId);
      const isAuto = autoFlags.includes(opt.id);
      html += `<button class="ep-opt ${isAuto ? 'sel auto' : ''}"
        style="background:${col.bg};color:${col.text}"
        onclick="toggleEntryPropAuto('${prop.id}','${opt.id}')"
        title="${isAuto
          ? 'Herança ativa — clique para desativar (os blocos já marcados permanecem)'
          : 'Clique para herdar esta opção a todos os blocos (existentes e novos)'
        }">${esc(opt.name)}${isAuto ? '<span class="ep-opt-auto-dot"></span>' : ''}</button>`;
    });

    html += `</div></div>`;
  });

  html += `</div>`;
  wrap.innerHTML = html;
  area.appendChild(wrap);
}
````

**Substituir por:**

````
function renderEditorProps() {
  const area = document.getElementById('epPropsArea');
  area.innerHTML = '';
  if (db.properties.length === 0) return;

  // Blocos selecionados, na ordem do editor: com seleção, o clique esquerdo age neles (DEC-013)
  const selIds = editBlocks.filter(b => selectedBlockIds.has(b.id)).map(b => b.id);
  const nSel   = selIds.length;

  const wrap = document.createElement('div');
  wrap.className = 'ep-prop-section';

  let html = `<div class="field-lbl" style="margin-bottom:4px">Propriedades</div>`;
  html += nSel > 0
    ? `<div class="ep-props-hint">${nSel} bloco${nSel!==1?'s':''} selecionado${nSel!==1?'s':''} — clique marca ou desmarca nos selecionados (✓ = todos têm · – = misto: o clique dá a todos). Botão direito: adição automática a novos blocos (●).</div>`
    : `<div class="ep-props-hint">● = adição automática a NOVOS blocos — botão direito liga/desliga (não mexe nos blocos existentes). Para marcar em blocos, selecione-os e use o clique esquerdo.</div>`;
  html += `<div class="ep-props-wrap">`;

  db.properties.forEach(prop => {
    if (prop.options.length === 0) return;
    const autoFlags = editPropAutoFlags[prop.id] || [];

    html += `<div class="ep-prop-group">
      <span class="ep-prop-lbl">${esc(prop.name)}</span>
      <div class="ep-prop-opts-row">`;

    prop.options.forEach(opt => {
      const col    = getColor(opt.colorId);
      const isAuto = autoFlags.includes(opt.id);
      // Estado da opção nos blocos selecionados: 'all' | 'mixed' | 'none' (só existe com seleção)
      let selState = 'none';
      if (nSel > 0) {
        const have = selIds.filter(id => ((editBlockProps[id] || {})[prop.id] || []).includes(opt.id)).length;
        selState = have === nSel ? 'all' : (have > 0 ? 'mixed' : 'none');
      }
      const cls  = [isAuto ? 'sel auto' : '', selState === 'all' ? 'blk-all' : '',
                    selState === 'mixed' ? 'blk-mixed' : ''].join(' ').trim();
      const mark = selState === 'all'   ? '<span class="ep-opt-sel-mark">✓</span>'
                 : selState === 'mixed' ? '<span class="ep-opt-sel-mark">–</span>' : '';
      const tip  = nSel > 0
        ? (selState === 'all'   ? `Todos os ${nSel} selecionados têm — clique para remover de todos`
         : selState === 'mixed' ? 'Misto nos selecionados — clique para dar a todos'
         :                        `Clique para adicionar aos ${nSel} selecionados`)
        : 'Selecione blocos para marcar com o clique esquerdo';
      html += `<button class="ep-opt ${cls}"
        style="background:${col.bg};color:${col.text}"
        onclick="onEntryOptClick('${prop.id}','${opt.id}')"
        oncontextmenu="event.preventDefault();toggleEntryPropAuto('${prop.id}','${opt.id}')"
        title="${tip} · Botão direito: ${isAuto ? 'desligar' : 'ligar'} a adição automática a novos blocos">${mark}${esc(opt.name)}${isAuto ? '<span class="ep-opt-auto-dot"></span>' : ''}</button>`;
    });

    html += `</div></div>`;
  });

  html += `</div>`;
  wrap.innerHTML = html;
  area.appendChild(wrap);
}

/* Clique esquerdo numa opção do painel da entrada (DEC-014).
   Com blocos selecionados: uniformiza nos selecionados (DEC-013).
   Sem seleção: não age — só ensina o caminho (o automático foi para o botão direito). */
function onEntryOptClick(propId, optId) {
  if (selectedBlockIds.size > 0) { applyPropToSelectedBlocks(propId, optId); return; }
  showToast('Selecione blocos para marcar · botão direito liga o automático');
}

/* Uniformiza uma opção nos blocos selecionados (DEC-013):
   se TODOS os selecionados já têm, remove de todos; senão (nenhum ou misto), dá a todos.
   Bloco não selecionado não é tocado. Coberta pelo undo: o nome está na lista do embrulho. */
function applyPropToSelectedBlocks(propId, optId) {
  const ids = editBlocks.filter(b => selectedBlockIds.has(b.id)).map(b => b.id);
  if (ids.length === 0) return;
  const has = id => ((editBlockProps[id] || {})[propId] || []).includes(optId);
  const removeAll = ids.every(has);
  ids.forEach(id => {
    if (!editBlockProps[id]) editBlockProps[id] = {};
    if (!editBlockProps[id][propId]) editBlockProps[id][propId] = [];
    const arr = editBlockProps[id][propId];
    const idx = arr.indexOf(optId);
    if (removeAll) { if (idx >= 0) arr.splice(idx, 1); }
    else if (idx < 0) arr.push(optId);
  });
  renderEditorProps();
  ids.forEach(id => { renderBlockPropBar(id); buildBlockPropBody(id); });
}
````

## Edicao 2 — `index.html` · toggleEntryPropAuto reconstroi paineis de bloco abertos

**Forma:** Substituir.

**Ancora:**

````
  renderEditorProps();
  // Não precisa renderBlocks() — blocos existentes não mudam
}
````

**Substituir por:**

````
  renderEditorProps();
  // Blocos existentes não mudam; só os painéis de bloco abertos precisam mostrar o ● novo
  editBlocks.forEach(b => buildBlockPropBody(b.id));
}
````

## Edicao 3 — `index.html` · chip do bloco ganha botao direito

**Forma:** Substituir.

**Ancora:**

````
      const title  = isAuto
        ? `title="● Auto ativo — clique para remover deste bloco E desativar herança automática"`
        : `title="${isOn ? 'Remover' : 'Adicionar'} ${esc(opt.name)} neste bloco"`;
      html += `<span class="${cls}" ${click} ${title} style="background:${col.bg};color:${col.text}">${esc(opt.name)}</span>`;
````

**Substituir por:**

````
      const title  = isAuto
        ? `title="● Auto ativo — clique para remover deste bloco E desativar a adição automática · botão direito: só desativar a automática"`
        : `title="${isOn ? 'Remover' : 'Adicionar'} ${esc(opt.name)} neste bloco · botão direito: ligar a adição automática a novos blocos"`;
      // Botão direito = adição automática da ENTRADA, igual ao painel da entrada (DEC-014)
      const ctxm   = `oncontextmenu="event.preventDefault();toggleEntryPropAuto('${prop.id}','${opt.id}')"`;
      html += `<span class="${cls}" ${click} ${ctxm} ${title} style="background:${col.bg};color:${col.text}">${esc(opt.name)}</span>`;
````

## Edicao 4 — `index.html` · painel da entrada acompanha a selecao

**Forma:** Substituir.

**Ancora:**

````
  if (desBtn) desBtn.style.display = n > 0 ? '' : 'none';
}
````

**Substituir por:**

````
  if (desBtn) desBtn.style.display = n > 0 ? '' : 'none';
  // O painel da entrada mostra o estado (✓ / –) dos selecionados: acompanha a seleção
  renderEditorProps();
}
````

## Edicao 5 — `index.html` · novo mutador na lista do embrulho (undo)

**Forma:** Substituir.

**Ancora:**

````
 'disableAutoFromBlock'].forEach(name => {
````

**Substituir por:**

````
 'disableAutoFromBlock', 'applyPropToSelectedBlocks'].forEach(name => {
````

## Edicao 6 — `index.html` · CSS do estado todos/misto

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
.ep-opt.sel { opacity: 1; border-color: rgba(255,255,255,.25); }
````

**Substituir por:**

````
.ep-opt.sel { opacity: 1; border-color: rgba(255,255,255,.25); }
/* Estado da opção nos blocos selecionados (DEC-013): ✓ todos têm · – misto */
.ep-opt.blk-all { opacity: 1; }
.ep-opt.blk-mixed { opacity: .8; border-style: dashed; border-color: rgba(255,255,255,.35); }
.ep-opt-sel-mark { font-family: var(--mono); font-weight: 700; margin-right: 4px; }
````

## Edicao 7 — `tests/history.mjs` · novoEditor aceita preparo

**Forma:** Substituir.

**Ancora:**

````
function novoEditor() {
````

**Substituir por:**

````
function novoEditor(prep) {
````

## Edicao 8 — `tests/history.mjs` · preparo roda antes do embrulho

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
  const api = new Function('ctx', `with (ctx) {
````

**Substituir por:**

````
  // Preparo opcional: instala mutadores REAIS antes de o embrulho rodar.
  if (prep) prep(ctx);

  const api = new Function('ctx', `with (ctx) {
````

## Edicao 9 — `tests/history.mjs` · secao 11: uniformizar

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
console.log('\nLunoda — teste do historico (undo/redo)\n');
````

**Substituir por:**

````
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

console.log('\nLunoda — teste do historico (undo/redo)\n');
````

## Edicao 10 — `tests/README.md` · README: contagem e cobertura nova

**Forma:** Substituir.

**Ancora:**

````
Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 18 asserções, incluindo:
````

**Substituir por:**

````
Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 28 asserções, incluindo:
````

## Edicao 11 — `tests/README.md` · README: item novo

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- abrir outra entrada zera o histórico.
````

**Substituir por:**

````
- abrir outra entrada zera o histórico.
- **uniformizar nos blocos selecionados** (DEC-013), com a função REAL recortada do `index.html`: misto → todos recebem, todos têm → todos perdem, bloco não selecionado intocado, e o nome na lista do embrulho (undo).
````

## Edicao 12 — `meta/DECISIONS.md` · DEC-013, DEC-014 e DEC-015 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Os guias de versão (`lunoda_vN_guide.md`) não existem no repositório; a regra de preservá-los saiu do CEREBRO.
````

**Substituir por:**

````
- Os guias de versão (`lunoda_vN_guide.md`) não existem no repositório; a regra de preservá-los saiu do CEREBRO.

---

## DEC-013 — Marcar propriedade nos blocos selecionados: UNIFORMIZAR, não inverter (C1)
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
Com blocos selecionados, o clique numa opção do painel da entrada deve agir nos selecionados. Duas ideias do autor descreviam regras diferentes para o caso misto (uns têm, outros não): inverter a posse de cada um, ou um «marca/desmarca/inverte» ambíguo (conflito C1 no IDEAS).

### Decisão
**Uniformizar:** se TODOS os selecionados têm a opção, o clique remove de todos; senão (nenhum ou misto), dá a todos. Bloco não selecionado não é tocado. O painel mostra `✓` (todos têm) e `–` (misto). Implementado em `applyPropToSelectedBlocks()`, coberto pelo undo (nome na lista do embrulho, DEC-010).

### Alternativas consideradas
- **Inverter posse por bloco** — era a regra descrita em detalhe e a sugestão do assistente em julho. Descartada: no estado misto, inverter produz OUTRO estado misto, e nenhum número de cliques chega a «todos com» ou «todos sem». Nos estados uniformes as duas regras coincidem; a diferença é só no misto, e ali inverter não serve ao uso real.

### Consequências
Dois cliques levam a qualquer estado uniforme. O estado misto passa a ser visível no painel. Regra coberta por `tests/history.mjs` (seção 11) com a função real recortada do `index.html`.

---

## DEC-014 — Botão direito liga o automático; esquerdo sem seleção só avisa (C2)
**Data:** 2026-11-03 · **Status:** aceita · SUBSTITUI o clique esquerdo da v12 no painel da entrada

### Contexto
Até a v12.3, o clique esquerdo numa opção do painel da entrada ligava/desligava a adição automática a novos blocos. Com a DEC-013, o esquerdo com seleção ganhou outra função, e o autor queria o automático no botão direito — o app não usava o botão direito em lugar nenhum (conflito C2).

### Decisão
**Botão direito** (`contextmenu` com `preventDefault`) liga/desliga a adição automática — no painel da entrada E nos chips do bloco (o automático é da entrada). **Esquerdo sem seleção não age:** mostra o aviso «Selecione blocos para marcar · botão direito liga o automático». O clique esquerdo no chip `●auto` dentro do bloco continua como na v12 (`disableAutoFromBlock`).

### Alternativas consideradas
- **(a) Manter o esquerdo-sem-seleção como automático** — zero aprendizado, mas o esquerdo faria duas coisas diferentes conforme houvesse seleção.
- **(c) Esquerdo-sem-seleção = marcar em TODOS os blocos** — a mais elegante («sem seleção = todos»), mas no hábito antigo o clique que ligava o automático viraria marcação em massa. Adiada no IDEAS, com gatilho.

### Consequências
Troca de memória muscular, mitigada pelo aviso. Esquerdo sempre marca; direito sempre controla o automático. Painéis de bloco abertos passam a ser reconstruídos ao ligar o automático (antes ficavam sem o `●auto` novo).

---

## DEC-015 — Empurrão de versão ignora a seleção e só renumera (Q1)
**Data:** 2026-11-03 · **Status:** aceita · implementação na F6

### Contexto
A ideia «reordenar por número de versão» (F6) tinha uma pergunta aberta do autor: o que fazer com duas versões selecionadas. No código, a versão é um número por bloco, editado no campo `ver-num` (`syncVer`) ou pelos botões −/+ (`adjVer`) — sempre um bloco por vez; duplicata de número não é impedida.

### Decisão
O empurrão **ignora a seleção**: age só no bloco cujo número foi editado. Regras: só no grupo de **mesmo subtítulo**; só quando o número novo **já está ocupado** no grupo (número livre é só gravado); é um **mover** (v5→v3 faz v3→v4 e v4→v5, a vaga deixada é ocupada; duplicatas existentes se movem juntas, sem renumerar o resto); −/+ seguem a mesma regra (trocam com o vizinho); **só os números mudam — a posição dos blocos na lista fica**; coberto pelo undo.

### Alternativas consideradas
- **Bloquear o campo com 2+ selecionados** — atrapalharia sem motivo: selecionar para uma ação em massa impediria corrigir um número.
- **Aplicar a todos os selecionados em sequência** — resultado dependente da ordem, imprevisível.
- **Reposicionar os blocos junto com o número** — mais código e confusão com Subir/Descer; o autor escolheu só números.

### Consequências
A F6 fica desbloqueada e especificada. A função nova entra na lista do embrulho do undo.
````

## Edicao 13 — `meta/CHANGELOG.md` · [13.0.0] acima da 12.3

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [12.3.0] — 2026-07-19 *(aplicada — commit `0699b26`)*
````

**Substituir por:**

````
## [13.0.0] — 2026-11-03

### Modificado
- **Clique nas opções de propriedade** (F4 parte 1, DEC-014). O **botão direito** liga/desliga a adição automática a novos blocos — no painel da entrada e nos chips do bloco. O **esquerdo sem blocos selecionados não age mais**: mostra um aviso curto com o caminho novo. *Muda a memória muscular: até a v12.3 o esquerdo ligava o automático.*

### Adicionado
- **Marcar propriedade nos blocos selecionados** (DEC-013): com blocos selecionados, o clique esquerdo numa opção do painel da entrada **uniformiza** — se todos os selecionados têm, remove de todos; senão, dá a todos. O painel mostra `✓` (todos têm) e `–` (misto). Coberto pelo undo.
- `tests/history.mjs` cobre a regra de uniformizar e o embrulho no undo (10 asserções novas, 28 no total).

### Corrigido
- O texto de ajuda do painel de propriedades dizia que ativar uma opção a adicionava «a todos os blocos existentes e futuros»; desde a v12 (DEC-004) só os NOVOS recebem. Texto refeito.
- Painéis de propriedade de bloco abertos não mostravam o `●auto` ao ligar o automático na entrada; agora são reconstruídos.

## [12.3.0] — 2026-07-19 *(aplicada — commit `0699b26`)*
````

## Edicao 14 — `meta/IDEAS.md` · conflitos: registro do que foi resolvido

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> O CEREBRO manda analisar antes de aceitar. Estas ideias novas se sobrepõem em alguns pontos; resolver antes de projetar a WO da F4.
````

**Substituir por:**

````
> O CEREBRO manda analisar antes de aceitar. Estas ideias novas se sobrepõem em alguns pontos; resolver antes de projetar a WO da F4.
> **Resolvidos em 2026-11-03:** C1 → uniformizar (DEC-013) · C2 → botão direito = automático, esquerdo sem seleção só avisa (DEC-014) · Q1 → o empurrão ignora a seleção e só renumera (DEC-015). **C3 segue aberto** (F5).
````

## Edicao 15 — `meta/IDEAS.md` · Adiadas: opcao (c) da C2

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **Migração para IndexedDB** — adiada porque o uso real não se aproxima do teto de ~5 MB — **volta quando** o aviso dos 80% (`warnIfStorageTight()`) disparar em uso real. Plano em ROADMAP, F11.
````

**Substituir por:**

````
- **Migração para IndexedDB** — adiada porque o uso real não se aproxima do teto de ~5 MB — **volta quando** o aviso dos 80% (`warnIfStorageTight()`) disparar em uso real. Plano em ROADMAP, F11.
- **Esquerdo sem seleção = marcar em todos os blocos da entrada** (opção (c) da C2) — adiada porque, no hábito antigo, o clique que ligava o automático viraria marcação em massa — **volta quando** o autor notar que seleciona todos os blocos à mão com frequência (hoje o editor não tem «selecionar todos os blocos»).
````

## Edicao 16 — `meta/IDEAS.md` · Descartadas: inverter posse

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
- **Modelo Todos/Custom/Nenhum por opção (v10)** — descartado porque era complexo, pouco intuitivo e empilhava a UI verticalmente. Substituído pela herança por flag (DEC-003).
````

**Substituir por:**

````
- **Inverter posse no caso misto (C1, opção A)** — descartada em 2026-11-03 porque, no estado misto, inverter produz outro estado misto e nenhum número de cliques uniformiza. Substituída por uniformizar (DEC-013).
- **Modelo Todos/Custom/Nenhum por opção (v10)** — descartado porque era complexo, pouco intuitivo e empilhava a UI verticalmente. Substituído pela herança por flag (DEC-003).
````

## Edicao 17 — `meta/ROADMAP.md` · F4: parte 1 entregue

**Forma:** Substituir.

**Ancora:**

````
## 🟡 F4 — UX de propriedades avançada + conforto de edição *(próxima — depende de decisão)*
**Objetivo:** tornar a marcação de propriedades mais rápida (seleção em massa, botões do mouse) e a edição de texto mais confortável (tamanho das caixas).
**Critério de conclusão:** a definir junto com o escopo da v13.
- [ ] Propriedades em blocos selecionados (inverter posse) — depende de resolver conflito C1 (IDEAS).
- [ ] Controles de tamanho / autosize das caixas de texto.
- [ ] Ações por botão do mouse (esq/meio/dir) — depende de resolver C2 (IDEAS).
> Antes de projetar a WO da F4, fechar os conflitos C1–C2 e a questão Q1 listados no IDEAS.
````

**Substituir por:**

````
## 🟡 F4 — UX de propriedades avançada + conforto de edição *(em curso — parte 1 na v13.0)*
**Objetivo:** tornar a marcação de propriedades mais rápida (seleção em massa, botões do mouse) e a edição de texto mais confortável (tamanho das caixas).
**Critério de conclusão:** marcação em massa e botão direito funcionando (parte 1) + caixas de texto com tamanho controlável (parte 2).
- [x] Propriedades em blocos selecionados — **uniformizar** (DEC-013), v13.0. Falta conferir no navegador.
- [x] Botão direito = adição automática; esquerdo sem seleção só avisa (DEC-014), v13.0. O botão do meio fica com a F5.
- [ ] Controles de tamanho / autosize das caixas de texto — parte 2.
````

## Edicao 18 — `meta/ROADMAP.md` · F6 desbloqueada

**Forma:** Substituir.

**Ancora:**

````
- Depende de resolver a questão Q1 (duas versões selecionadas).
````

**Substituir por:**

````
- **Desbloqueada:** regras fechadas na DEC-015 (Q1) — o empurrão ignora a seleção, age só no grupo de mesmo subtítulo e só muda números, não posições.
````

## Edicao 19 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v12.3** — 2026-07-19 — frontmatter YAML no export Markdown. Aplicada e commitada (`0699b26`). Arquivo canônico `index.html` (~3.084 linhas). Testes: `smoke` 28/28 e `history` 18/18 na última rodada registrada (2026-07-19).
````

**Substituir por:**

````
**Lunoda v13.0** — 2026-11-03 — marcar propriedade nos blocos selecionados (uniformizar) e botão direito para a adição automática (F4 parte 1). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 28/28 (rodada da wo0002).
````

## Edicao 20 — `meta/STATUS.md` · funcionando: item novo

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.
````

**Substituir por:**

````
- Marcar propriedade nos blocos selecionados (uniformizar, `✓`/`–`) e botão direito para a adição automática (v13.0).
- Verificação automática: `node tests/smoke.mjs` e `node tests/history.mjs`.
````

## Edicao 21 — `meta/STATUS.md` · em progresso: migracao saiu

**Forma:** Substituir.

**Ancora:**

````
- **Migração do processo para o KCM v1.133.0, modo Code** (2026-11-03). Docs de curadoria já gravados pelo chat; falta o Code aplicar `meta/workorders/261103-wo0001-kcm-v1133-modo-code.md` (DECISIONS, CHANGELOG, IDEAS, ROADMAP, HISTORY + commit da migração inteira).
````

**Substituir por:**

````
- **v13.0 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03 (o resultado volta para o chat).
````

## Edicao 22 — `meta/STATUS.md` · backlog: C1/C2/Q1 resolvidos

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Decidir C1, C2 e Q1** (IDEAS, «Análise de conflitos») e então projetar a **F4** como WO. Alternativa se não quiser decidir agora: **F9 parte 2 — reimportar `.md`**.
````

**Substituir por:**

````
- [ ] **Conferir a v13.0 no navegador** (roteiro na conversa de 2026-11-03).
- [ ] **Projetar a F4 parte 2 (caixas de texto) e a F6 (empurrão de versão, DEC-015)** como WOs. Alternativa: **F9 parte 2 — reimportar `.md`**.
````

## Edicao 23 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-03** — Aplicado o template-update do KCM v1.133.0: troca ASU → Code (DEC-012). Criados `.claude/` (settings + skills `apply-wo`, `wrap`, `sondar`), `CLAUDE.md` novo, `meta/SPEC.md` e `meta/workorders/`; CEREBRO e Instruções refeitos sobre a base nova; legado do ASU e os `CLAUDE.md` antigos movidos para `..\_para-excluir\`. Nenhuma mudança no `index.html`.

**Próximo passo óbvio:** aplicar a wo0001 no Code; depois colar as Instruções novas no painel do Projeto e decidir C1/C2/Q1.
````

**Substituir por:**

````
**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1 (uniformizar, DEC-013), C2 (botão direito = automático, DEC-014) e Q1 (empurrão de versão, DEC-015). Entregue a **v13.0** (F4 parte 1) pela wo0002.

**Próximo passo óbvio:** conferir a v13.0 no navegador; depois F4 parte 2 ou F6.
````

## Edicao 24 — `logs/2026-11-03.md` · log: secao do chat (continuacao)

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **Commit/push:** ver `git log -1` (hash no relatorio em `../`).
````

**Substituir por:**

````
- **Commit/push:** ver `git log -1` (hash no relatorio em `../`).

## Conversa 1 — chat (planejamento, continuação)

### Feito
- Conferido o relatório da wo0001 contra o repositório: `552d577` alinhado com `origin/main`, 29 arquivos, 33 arquivos em LF. Pacote `261103-kcm-update-v1.133.0\` e `HANDOFF-BRIEF.md` arquivados em `notas-arquivadas\`.
- Apresentadas e decididas, uma de cada vez: C1 → uniformizar (DEC-013); C2 → botão direito = automático, esquerdo sem seleção só avisa (DEC-014); Q1 → empurrão ignora a seleção e só renumera (DEC-015).
- Escrita a wo0002: v13.0 (F4 parte 1) + registro das três decisões. Simulada numa cópia a partir do texto da WO: smoke 28/0, history 28/0, `node --check` OK; prova de vida — contra o `index.html` antigo o teste novo dá 18 ok / 1 falha, e sem o nome no embrulho 26 ok / 2 falhas.

### Aprendizados / armadilhas
- O texto de ajuda do painel de propriedades contradizia a DEC-004 desde a v12 («adicionada a todos os blocos existentes»). Só apareceu porque o código foi lido antes de projetar.
- A lista de testes é citada em 9 lugares; os testes novos foram para o `history.mjs` em vez de um arquivo novo, para não ter de atualizar as 9 citações.
````

## Edicao 25 — `logs/2026-11-03.md` · secao do Code

Acrescente no FIM do arquivo `## Conversa 1 — Code (execucao, wo0002)` com o seu relatorio resumido. Nao altere as outras secoes.

---

## Fora de escopo

- F4 parte 2 (caixas de texto), F6 (empurrao de versao — so a decisao entra aqui), botao do meio (F5).
- Qualquer outra mudanca no `index.html`, inclusive renomear `base_` / `STORAGE_KEY`.
- Higiene do IDEAS (ja no backlog).

## Armadilhas desta WO

- `index.html` e cheio de glifos (`●`, `—`, `·`, `✓`, `–`); as ancoras os contem porque foram recortadas por script. Aplique por script ou ferramenta de edicao exata, nunca redigitando. Arquivos LF.
- A Edicao 1 troca a funcao `renderEditorProps` INTEIRA e acrescenta duas funcoes logo depois. Depois dela, `^function renderEditorProps(` tem de continuar 1 (nao duplicou).
- O embrulho do undo so cobre funcoes cujo NOME esta na lista (Edicao 5). Sem ela o recurso funciona, mas o Ctrl+Z nao desfaz — o teste da secao 11 pega isso.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado — em vermelho, suspeite primeiro do instrumento.

- [ ] `git status --short` -> exatamente `M` em: `index.html logs/2026-11-03.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/history.mjs`, e `??` nesta WO. Nada alem.
- [ ] `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`.
- [ ] `node tests/history.mjs` -> `28 ok, 0 falha(s)` (18 antigas + 10 da secao 11).
- [ ] Sintaxe do script (sem arquivo temporario): `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"` -> `SINTAXE_OK`.
- [ ] Sem duplicacao e codigo antigo fora, por LINHA (`grep -c`): `"^function renderEditorProps("` -> 1 · `"^function onEntryOptClick("` -> 1 · `"^function applyPropToSelectedBlocks("` -> 1 · `"'applyPropToSelectedBlocks'\].forEach"` -> 1 · `'oncontextmenu="event.preventDefault();toggleEntryPropAuto('` -> 2 · `'onclick="toggleEntryPropAuto('` -> 0 · `"ao clicar, a opção é adicionada a todos os blocos existentes e futuros"` -> 0.
- [ ] `wc -l index.html` -> `3140`.
- [ ] Registro: `grep -c "^## DEC-01[345] " meta/DECISIONS.md` -> 3 · `grep -m2 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]` e `## [13.0.0] — 2026-11-03` · `grep -c "^> \*\*Resolvidos em 2026-11-03:\*\*" meta/IDEAS.md` -> 1 · `grep -c "^- \*\*Esquerdo sem seleção = marcar em todos" meta/IDEAS.md` -> 1 · `grep -c "^## Conversa 1 — chat (planejamento, continuação)" logs/2026-11-03.md` -> 1.
- [ ] **Teste no navegador — NAO e seu.** Exige olho humano num renderizador: vai como roteiro ao autor, no fecho do chat. **Chega no ramo?** `renderEditorProps` -> `onEntryOptClick` -> `applyPropToSelectedBlocks` (a secao 11 do history cobre a regra; a tela, nao). **Pergunta que os testes NAO respondem:** «presta na tela?» — traco, cores, menu do navegador suprimido.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0002.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/history.mjs tests/README.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md meta/GLOSSARY.md meta/CONTEXT.md logs/2026-11-03.md meta/workorders/261103-wo0002-v13-props-selecao-botao-direito.md
```

```
git commit -m "feat(props): marca propriedade nos blocos selecionados e move o automatico para o botao direito" -m "F4 parte 1 (v13.0). Com blocos selecionados, o clique esquerdo uniformiza a opcao (DEC-013); o botao direito liga a adicao automatica e o esquerdo sem selecao so avisa (DEC-014). Registra a DEC-015 (empurrao de versao, F6). Corrige o texto de ajuda que contradizia a DEC-004. history.mjs ganha 10 assercoes."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-03 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
