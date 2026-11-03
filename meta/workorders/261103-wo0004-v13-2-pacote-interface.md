# WO 0004 — v13.2: pacote de interface — legibilidade, painel ajustavel/maximizar e controle geral das caixas + registro

> **Tipo:** mista — CODIGO (`index.html`) + REGISTRO (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, log do dia).
> **Config sugerida:** Sonnet, `/effort` medio. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD em `0188322`; `sha1sum index.html` = `2a39f10ee102a40621f6d00c0cce0823c533eb60`; arvore limpa exceto `meta/CONTEXT.md` e `meta/GLOSSARY.md` (gravados pelo chat, hashes abaixo) e esta WO. ANTES de aplicar: `node tests/smoke.mjs` 28/0 e `node tests/history.mjs` 39/0.
> **Base:** conversa de 2026-11-03 — ordem aprovada (pacote de interface -> F6 -> F9 parte 2); propostas 1 (controle geral), 2 (painel) e 3 (legibilidade) aprovadas como estao; legibilidade aprovada pelos prints de antes/depois. Registradas como DEC-018, DEC-019, DEC-020.
> **Depende de:** wo0003 (aplicada, `70d5a55`).
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e o log. CONTEXT e GLOSSARY o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**. Nas edicoes «SUBSTITUIR TODAS», a contagem ANTES tem de bater com a declarada; diferente -> **PARE**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
b4f4f0a47cf2c3c9f52f271cbc6aa8aaa2fd016b  meta/CONTEXT.md
556ac3a027807939c9b8efa1ca02396a67febc10  meta/GLOSSARY.md
```

**Ancoras lidas em:** cada ancora foi RECORTADA por script dos arquivos do repositorio copiados do disco em 2026-11-03 ~18:50 (HEAD `0188322`, `index.html` com o sha1 acima) e conferida com `count == 1` (ou com a contagem declarada, nas «SUBSTITUIR TODAS»). O trecho literal e o proprio bloco de cada edicao. A WO inteira foi simulada numa copia aplicando as edicoes lidas DESTE arquivo.

---

## 1. Por que

O autor achou a interface pouco nitida e o painel apertado. Medido: texto secundario com 1,7–1,8:1 de contraste (`--text-muted`) e 3,9–4,2:1 (`--text-dim`), contra o minimo WCAG AA de 4,5:1; 22 textos em 9–10px; painel fixo em 780px. E aplicar um tamanho a todos os blocos so era possivel por um gesto escondido.

## 2. Contexto factual

- **Medido no `index.html` (`0188322`):** tokens `--text-dim: #7a7a8c` e `--text-muted: #44444f`; `font-size: 9px` x5, `font-size: 10px` x14, `font-size:10px` x3, todos da interface (nenhum no modelo do HTML exportado); `.ep-opt` com `opacity: .48`; painel com `right: -820px` fechado e `width: min(var(--editor-w), 92vw)`.
- **Medido pelo chat (contraste WCAG):** #87879d = 5,04 / 4,62 / 4,83 / 5,45 : 1 contra surface / surface2 / surface3 / bg; #a2a2b6 = 7,06 / 6,47 / 6,77 / 7,64 : 1.
- **Medido em Chromium headless** (copia com as edicoes de codigo DESTA WO, fixture): tokens aplicados; painel abre com 780px; arrastar a alca ate x=400 da 1040px e grava `{"w":1040,"max":false}`; fechado fica fora da tela (x=1500 numa janela de 1440); reabre com 1040; maximizar = 1440 e titulo «Restaurar largura»; restaurar = 1040; duplo clique na alca = 780 e `{"w":null}`; controle geral «Caixas Auto P M G»: M poe os 3 blocos em M; um bloco em P deixa o geral sem ativo; botao direito em G grava `{"block":"g"}` e poe todos em G; `renderBlocks` mantem o estado; nenhum erro de JS.
- **Nao medido:** o Chrome real do autor, com os dados e as cores de propriedade dele — roteiro do autor.

## Inventario

32 edicoes com ancora/contagem + 1 de log (fim do arquivo) + 1 do Code, em 7 arquivos. Codigo: 20 edicoes no `index.html`. As 22 trocas de fonte sairam de `grep -n "font-size: \?\(9\|10\)px" index.html` (22 linhas; a da `.ta-size button` e trocada na Edicao 4, junto com o preenchimento, e por isso as «SUBSTITUIR TODAS» de 9px esperam 4, nao 5). Sem teste automatico novo: as mudancas sao de interface; `smoke` e `history` seguem como rede de regressao.

---

## Edicao 0 — conferir hashes e baseline

`sha1sum index.html` = `2a39f10ee102a40621f6d00c0cce0823c533eb60`, e `sha1sum -c` nas 2 linhas acima -> `OK`. `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`; `node tests/history.mjs` -> `39 ok, 0 falha(s)`. Qualquer divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · token --text-dim

**Forma:** Substituir.

**Ancora:**

````
  --text-dim:    #7a7a8c;
````

**Substituir por:**

````
  --text-dim:    #a2a2b6;   /* 6,5–7,6:1 nos fundos do app (DEC-018) */
````

## Edicao 2 — `index.html` · token --text-muted

**Forma:** Substituir.

**Ancora:**

````
  --text-muted:  #44444f;
````

**Substituir por:**

````
  --text-muted:  #87879d;   /* 4,6–5,5:1 — piso WCAG AA para texto comum (DEC-018) */
````

## Edicao 3 — `index.html` · btn-xs maior

**Forma:** Substituir.

**Ancora:**

````
.btn-xs { padding: 3px 7px; font-size: 11px; }
````

**Substituir por:**

````
.btn-xs { padding: 4px 9px; font-size: 11.5px; }
````

## Edicao 4 — `index.html` · botoes de tamanho maiores

**Forma:** Substituir.

**Ancora:**

````
.ta-size button { font-family: var(--mono); font-size: 9px; line-height: 1; padding: 3px 5px;
````

**Substituir por:**

````
.ta-size button { font-family: var(--mono); font-size: 11px; line-height: 1; padding: 4px 7px;
````

## Edicao 5 — `index.html` · opcao nao marcada menos apagada

**Forma:** Substituir.

**Ancora:**

````
  cursor: pointer; border: 2px solid transparent; transition: all .1s;
  opacity: .48;
````

**Substituir por:**

````
  cursor: pointer; border: 2px solid transparent; transition: all .1s;
  opacity: .7;   /* era .48: ilegível; a marcada segue em 1 e com ✓ (DEC-018) */
````

## Edicao 6 — `index.html` · piso de 11px (9px)

**Forma:** SUBSTITUIR TODAS AS OCORRENCIAS (texto literal). Contagem ANTES: **4** — `grep -o "font-size: 9px" index.html | wc -l`; diferente: PARE. Depois: 0.

**Trecho:**

````
font-size: 9px
````

**Por:**

````
font-size: 11px
````

## Edicao 7 — `index.html` · piso de 11px (10px)

**Forma:** SUBSTITUIR TODAS AS OCORRENCIAS (texto literal). Contagem ANTES: **14** — `grep -o "font-size: 10px" index.html | wc -l`; diferente: PARE. Depois: 0.

**Trecho:**

````
font-size: 10px
````

**Por:**

````
font-size: 11px
````

## Edicao 8 — `index.html` · piso de 11px (10px inline)

**Forma:** SUBSTITUIR TODAS AS OCORRENCIAS (texto literal). Contagem ANTES: **3** — `grep -o "font-size:10px" index.html | wc -l`; diferente: PARE. Depois: 0.

**Trecho:**

````
font-size:10px
````

**Por:**

````
font-size:11px
````

## Edicao 9 — `index.html` · painel fechado por transform (qualquer largura)

**Forma:** Substituir.

**Ancora:**

````
  position: fixed; top: 0; right: -820px; width: min(var(--editor-w), 92vw);
````

**Substituir por:**

````
  /* Fechado por transform, não por right negativo: com largura ajustável (DEC-019), um right fixo
     deixaria o painel largo aparecendo pela borda */
  position: fixed; top: 0; right: 0; transform: translateX(calc(100% + 60px)); width: min(var(--editor-w), 92vw);
````

## Edicao 10 — `index.html` · transicao do painel + maximizado + alca

**Forma:** Substituir.

**Ancora:**

````
  transition: right .26s cubic-bezier(.4,0,.2,1);
  box-shadow: -12px 0 40px rgba(0,0,0,.55);
}
.editor-panel.open { right: 0; }
````

**Substituir por:**

````
  transition: transform .26s cubic-bezier(.4,0,.2,1);
  box-shadow: -12px 0 40px rgba(0,0,0,.55);
}
.editor-panel.open { transform: none; }
.editor-panel.ep-max { width: 100vw !important; border-left: none; }
/* Alça de largura na borda esquerda (DEC-019) */
.ep-resize { position: absolute; left: -4px; top: 0; bottom: 0; width: 8px; cursor: col-resize; z-index: 5; }
.ep-resize:hover, .ep-resize.drag { background: var(--accent-soft); }
.editor-panel.ep-max .ep-resize { display: none; }
````

## Edicao 11 — `index.html` · alca no painel

**Forma:** Substituir.

**Ancora:**

````
<div class="editor-panel" id="editorPanel">
  <div class="ep-head">
````

**Substituir por:**

````
<div class="editor-panel" id="editorPanel">
  <div class="ep-resize" id="epResize" title="Arraste para ajustar a largura · duplo clique: tamanho original"></div>
  <div class="ep-head">
````

## Edicao 12 — `index.html` · botao maximizar no cabecalho

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
    <button class="icon-btn" onclick="requestCloseEditor()">
````

**Substituir por:**

````
    <button class="icon-btn" id="epMaxBtn" onclick="toggleEditorMax()" title="Maximizar (tela inteira)"></button>
    <button class="icon-btn" onclick="requestCloseEditor()">
````

## Edicao 13 — `index.html` · openEditor aplica a largura lembrada

**Forma:** Substituir.

**Ancora:**

````
  document.getElementById('editorPanel').classList.add('open');
  document.getElementById('editorOverlay').classList.add('visible');
  taRenderDescBar();
````

**Substituir por:**

````
  applyEditorWidth();   // largura lembrada / maximizado (DEC-019)
  document.getElementById('editorPanel').classList.add('open');
  document.getElementById('editorOverlay').classList.add('visible');
  taRenderDescBar();
````

## Edicao 14 — `index.html` · controle geral no cabecalho dos blocos

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
          <span class="filter-info" id="blockCount"></span>
````

**Substituir por:**

````
          <!-- Controle geral de tamanho das caixas dos blocos (DEC-020); desenhado por taRenderAllBar -->
          <div class="ta-size ta-size-all" data-ta="all"></div>
          <span class="filter-info" id="blockCount"></span>
````

## Edicao 15 — `index.html` · renderBlocks redesenha o controle geral

**Forma:** Substituir.

**Ancora:**

````
  updateBlockMassBar();
  // Tamanho das caixas (DEC-017): o HTML acabou de ser recriado, reaplica o modo de cada uma
  editBlocks.forEach(b => taApply(b.id));
}
````

**Substituir por:**

````
  updateBlockMassBar();
  // Tamanho das caixas (DEC-017): o HTML acabou de ser recriado, reaplica o modo de cada uma
  editBlocks.forEach(b => taApply(b.id));
  taRenderAllBar();
}
````

## Edicao 16 — `index.html` · taToolbarHTML ganha a variante geral

**Forma:** Substituir.

**Ancora:**

````
/* Barra de botões de uma caixa; o ponto marca o padrão do tipo. */
function taToolbarHTML(key) {
  const kind = taKind(key), def = taDefaults()[kind];
  return `<div class="ta-size" data-ta="${key}">` + TA_MODES[kind].map(m =>
    `<button type="button" data-mode="${m}" title="${TA_LABEL[m]} — ${TA_TIP[m]}${m === def ? ' (padrão)' : ''} · botão direito: usar como padrão">`
    + `${TA_LABEL[m]}${m === def ? '<span class="ta-def-dot"></span>' : ''}</button>`).join('') + `</div>`;
}
````

**Substituir por:**

````
/* Barra de botões de uma caixa; o ponto marca o padrão do tipo.
   key 'all' = controle geral do cabeçalho (DEC-020): sempre visível, age em todos os blocos,
   e o botão ativo é o modo comum a todos (nenhum, se estiverem diferentes). */
function taToolbarHTML(key) {
  const kind = taKind(key), def = taDefaults()[kind];
  const all = key === 'all', common = all ? taCommonBlockMode() : null;
  return `<div class="ta-size${all ? ' ta-size-all' : ''}" data-ta="${key}">`
    + (all ? '<span class="ta-all-lbl">Caixas</span>' : '')
    + TA_MODES[kind].map(m =>
    `<button type="button" data-mode="${m}"${all && m === common ? ' class="on"' : ''} title="${all ? 'Todos os blocos: ' : ''}${TA_LABEL[m]} — ${TA_TIP[m]}${m === def ? ' (padrão)' : ''} · botão direito: usar como padrão">`
    + `${TA_LABEL[m]}${m === def ? '<span class="ta-def-dot"></span>' : ''}</button>`).join('') + `</div>`;
}
/* Modo comum a todos os blocos, ou null se diferem. */
function taCommonBlockMode() {
  const ms = editBlocks.map(b => taModeOf(b.id));
  return ms.length && ms.every(m => m === ms[0]) ? ms[0] : null;
}
function taRenderAllBar() {
  const bar = document.querySelector('.ta-size[data-ta="all"]');
  if (bar) bar.outerHTML = taToolbarHTML('all');
}
````

## Edicao 17 — `index.html` · clique esquerdo: geral aplica a todos os blocos

**Forma:** Substituir.

**Ancora:**

````
  const key = btn.closest('.ta-size').dataset.ta;
  taSessionModes[key] = btn.dataset.mode;
  taApply(key);
});
````

**Substituir por:**

````
  const key = btn.closest('.ta-size').dataset.ta;
  if (key === 'all') {   // controle geral: todos os blocos, só nesta sessão (DEC-020)
    editBlocks.forEach(b => { taSessionModes[b.id] = btn.dataset.mode; taApply(b.id); });
  } else {
    taSessionModes[key] = btn.dataset.mode;
    taApply(key);
  }
  taRenderAllBar();
});
````

## Edicao 18 — `index.html` · botao direito no geral: todos seguem o padrao novo

**Forma:** Substituir.

**Ancora:**

````
  delete taSessionModes[key];   // a caixa clicada passa a seguir o padrão novo
````

**Substituir por:**

````
  // a caixa clicada passa a seguir o padrão novo; no controle geral, todos os blocos
  if (key === 'all') editBlocks.forEach(b => { delete taSessionModes[b.id]; });
  else delete taSessionModes[key];
````

## Edicao 19 — `index.html` · funcoes da largura do painel

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ──────────────────────────────
   FILTRO INTERNO DE BLOCOS
────────────────────────────── */
````

**Substituir por:**

````
/* ──────────────────────────────
   LARGURA DO PAINEL DO EDITOR (DEC-019)
   Alça na borda esquerda + botão maximizar. Lembrado em localStorage, fora do db (DEC-011).
────────────────────────────── */
const EDITOR_W_KEY = 'lunoda_editor_w';
const EDITOR_W_MIN = 480;
const ICON_MAX     = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';
const ICON_RESTORE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>';

function editorPrefs() {
  try {
    const v = JSON.parse(localStorage.getItem(EDITOR_W_KEY) || '{}') || {};
    return { w: Number(v.w) || null, max: !!v.max };
  } catch (_) { return { w: null, max: false }; }
}
function saveEditorPrefs(p) {
  try { localStorage.setItem(EDITOR_W_KEY, JSON.stringify(p)); } catch (_) {}
}
/* Nunca menor que o mínimo, nunca maior que a janela. */
function clampEditorW(w) {
  return Math.max(Math.min(EDITOR_W_MIN, window.innerWidth), Math.min(w, window.innerWidth));
}
/* Aplica largura lembrada ou maximizado; sem preferência, vale o CSS (780px ou 92% da janela). */
function applyEditorWidth() {
  const panel = document.getElementById('editorPanel'); if (!panel) return;
  const p = editorPrefs();
  panel.classList.toggle('ep-max', p.max);
  panel.style.width = (!p.max && p.w) ? clampEditorW(p.w) + 'px' : '';
  const btn = document.getElementById('epMaxBtn');
  if (btn) {
    btn.title = p.max ? 'Restaurar largura' : 'Maximizar (tela inteira)';
    btn.innerHTML = p.max ? ICON_RESTORE : ICON_MAX;
  }
}
function toggleEditorMax() {
  const p = editorPrefs(); p.max = !p.max;
  saveEditorPrefs(p); applyEditorWidth();
  requestAnimationFrame(taRefreshAll);   // largura nova muda a altura das caixas em Auto
}
// Arrastar a alça; duplo clique volta ao tamanho original.
(function () {
  const h = document.getElementById('epResize'); if (!h) return;
  h.addEventListener('mousedown', ev => {
    ev.preventDefault();
    const panel = document.getElementById('editorPanel');
    h.classList.add('drag'); document.body.style.userSelect = 'none';
    const move = e => { panel.style.width = clampEditorW(window.innerWidth - e.clientX) + 'px'; };
    const up = () => {
      document.removeEventListener('mousemove', move); document.removeEventListener('mouseup', up);
      h.classList.remove('drag'); document.body.style.userSelect = '';
      saveEditorPrefs({ w: parseInt(panel.style.width, 10) || null, max: false });
      applyEditorWidth(); taRefreshAll();
    };
    document.addEventListener('mousemove', move); document.addEventListener('mouseup', up);
  });
  h.addEventListener('dblclick', () => { saveEditorPrefs({ w: null, max: false }); applyEditorWidth(); taRefreshAll(); });
})();
window.addEventListener('resize', applyEditorWidth);
applyEditorWidth();   // desenha o ícone do botão já na carga

/* ──────────────────────────────
   FILTRO INTERNO DE BLOCOS
────────────────────────────── */
````

## Edicao 20 — `index.html` · CSS do controle geral

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
.ta-def-dot { display: inline-block; width: 3px; height: 3px; border-radius: 50%;
````

**Substituir por:**

````
/* Controle geral (DEC-020): no cabeçalho, sempre visível — não é sobreposto ao texto */
.ta-size.ta-size-all { position: static; opacity: 1; pointer-events: auto; align-items: center; gap: 3px; margin-right: 4px; }
.ta-all-lbl { font-family: var(--mono); font-size: 11px; color: var(--text-muted); margin-right: 3px; }
.ta-def-dot { display: inline-block; width: 3px; height: 3px; border-radius: 50%;
````

## Edicao 21 — `meta/DECISIONS.md` · DEC-018, DEC-019 e DEC-020 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
Nenhuma mudança no formato dos dados nem no undo (tamanho não é estado da entrada). Altura arrastada à mão se perde quando a lista de blocos é redesenhada (ex.: ao filtrar) — aceito: o ajuste por caixa já é provisório por desenho.
````

**Substituir por:**

````
Nenhuma mudança no formato dos dados nem no undo (tamanho não é estado da entrada). Altura arrastada à mão se perde quando a lista de blocos é redesenhada (ex.: ao filtrar) — aceito: o ajuste por caixa já é provisório por desenho.

---

## DEC-018 — Legibilidade: piso de contraste WCAG AA (4,5:1) e de 11px
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
O autor achava botões e opções pouco nítidos. Medido: `--text-muted` (#44444f, 41 usos — dicas, rótulos, contadores) tinha **1,7 a 1,8:1** contra os fundos do app, e `--text-dim` (#7a7a8c) **3,9 a 4,2:1**; o mínimo WCAG AA para texto comum é 4,5:1. Havia 22 textos em 9–10px e as opções não marcadas tinham opacidade .48.

### Decisão
`--text-dim` → #a2a2b6 (6,5–7,6:1) e `--text-muted` → #87879d (4,6–5,5:1), medidos contra `--bg`, `--surface`, `--surface2` e `--surface3`. Todo `font-size` de 9 ou 10px passa a 11px. `.btn-xs` e os botões de tamanho ganham preenchimento maior. Opção de propriedade não marcada: opacidade .7. Aprovado pelo autor com prints de antes/depois.

### Alternativas consideradas
- **Só clarear o `--text-muted`** — deixava títulos de seção (`--text-dim`) abaixo de 4,5:1 no `--surface2`.
- **Branco para tudo** — perderia a hierarquia texto > dim > muted que organiza a tela.

### Consequências
Regra para cor nova de texto: **medir o contraste contra o `--surface2` (o fundo mais claro) e não ficar abaixo de 4,5:1**; nada abaixo de 11px. A hierarquia visual continua, mais clara.

---

## DEC-019 — Painel do editor com largura ajustável e maximizar
**Data:** 2026-11-03 · **Status:** aceita

### Contexto
Largura fixa de 780px (ou 92% da janela) apertava comandos e textos.

### Decisão
Alça na borda esquerda do painel (arrastar ajusta; mínimo 480px, máximo a janela; duplo clique volta ao original) e botão **maximizar/restaurar** no cabeçalho. Preferência em `localStorage['lunoda_editor_w']` (`{w, max}`), fora do `db` (DEC-011). O painel passou a fechar por `transform` em vez de `right` negativo — com largura variável, um `right: -820px` fixo deixaria o painel largo aparecendo pela borda.

### Alternativas consideradas
- **Só maximizar** — resolve o aperto, mas tira a tabela de vista sempre que se quer só um pouco mais de espaço.
- **Larguras pré-definidas (P/M/G)** — menos controle que arrastar, e mais um conjunto de botões.

### Consequências
Ao mudar a largura, as caixas em Auto são re-medidas (`taRefreshAll`). Largura maior que a janela é limitada ao abrir e ao redimensionar a janela.

---

## DEC-020 — Controle geral de tamanho das caixas dos blocos no cabeçalho
**Data:** 2026-11-03 · **Status:** aceita · complementa a DEC-017

### Contexto
Aplicar um tamanho a todos os blocos já era possível pelo botão direito (que torna o modo o padrão), mas escondido. O autor pediu um controle geral.

### Decisão
«Caixas: Auto · P · M · G» no cabeçalho da lista de blocos, sempre visível. **Clique esquerdo** aplica a todos os blocos só nesta sessão; **botão direito** torna o padrão — os mesmos gestos das caixas individuais. O botão ativo é o modo comum a todos os blocos; se estiverem diferentes, nenhum fica ativo.

### Alternativas consideradas
- **Deixar só o botão direito** — funcional, mas não descobrível.

### Consequências
Mesma regra em dois lugares (caixa e geral), mesmo código (`taToolbarHTML('all')`). Sem mudança no formato dos dados.
````

## Edicao 22 — `meta/CHANGELOG.md` · [13.2.0] acima da 13.1

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.1.0] — 2026-11-03
````

**Substituir por:**

````
## [13.2.0] — 2026-11-03

### Adicionado
- **Painel do editor ajustável** (DEC-019): alça na borda esquerda para arrastar a largura (duplo clique volta ao original) e botão **maximizar/restaurar** no cabeçalho. A largura é lembrada.
- **Controle geral «Caixas: Auto · P · M · G»** no cabeçalho da lista de blocos (DEC-020): aplica a todos os blocos; botão direito torna padrão.

### Modificado
- **Legibilidade** (DEC-018): cores de texto secundário clareadas até o piso WCAG AA (`--text-muted` 1,7→4,6:1; `--text-dim` 3,9→6,5:1, no fundo mais claro), nada abaixo de 11px, botões pequenos maiores, opções não marcadas menos apagadas.
- O painel fecha por `transform` em vez de `right` negativo (necessário para a largura variável).

## [13.1.0] — 2026-11-03
````

## Edicao 23 — `meta/IDEAS.md` · ideias novas do autor (pacote de interface)

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: conversa de 2026-11-03. **Status:** implementada na v13.1 (DEC-016) — ver Concluídas.
````

**Substituir por:**

````
> Fonte: conversa de 2026-11-03. **Status:** implementada na v13.1 (DEC-016) — ver Concluídas.

### 2026-11 — Controle geral de tamanho para todos os blocos
Além dos botões por caixa, um controle geral para aplicar o tamanho a todos os blocos de uma vez.
> Fonte: conversa de 2026-11-03. **Status:** implementada na v13.2 (DEC-020) — ver Concluídas.

### 2026-11 — Painel do editor mais largo ou em tela inteira
Poder expandir o painel da direita para a esquerda, ou abri-lo completo: o espaço pequeno aperta comandos e deixa botões e opções pequenos ou difíceis de ver.
> Fonte: conversa de 2026-11-03. **Status:** implementada na v13.2 (DEC-019) — ver Concluídas.

### 2026-11 — Interface mais nítida e intuitiva
Algumas coisas não estão nítidas; usar mais UX/UI. Medido pelo assistente: contraste do texto secundário de 1,7:1 (mínimo recomendado 4,5:1) e 22 textos em 9–10px.
> Fonte: conversa de 2026-11-03. **Status:** primeira passada na v13.2 (DEC-018) — ver Concluídas. Novas observações de nitidez entram aqui.
````

## Edicao 24 — `meta/IDEAS.md` · Concluidas: pacote de interface

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Quadrado geral de seleção respeitando o filtro** — v13.1 / DEC-016.
````

**Substituir por:**

````
## ✅ Concluídas

- **Legibilidade: contraste WCAG AA e piso de 11px** — v13.2 / DEC-018.
- **Painel do editor ajustável e maximizar** — v13.2 / DEC-019.
- **Controle geral de tamanho das caixas dos blocos** — v13.2 / DEC-020.
- **Quadrado geral de seleção respeitando o filtro** — v13.1 / DEC-016.
````

## Edicao 25 — `meta/ROADMAP.md` · fase do pacote de interface

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
---

## 🚫 Itens descartados desta visão
````

**Substituir por:**

````
## 🟢 F12 — Legibilidade e ergonomia do editor *(entregue — v13.2; falta conferir no navegador)*
**Objetivo:** a interface nítida e confortável em telas de uso real.
**Critério de conclusão:** texto secundário ≥ 4,5:1, nada abaixo de 11px, painel com largura ajustável, controle geral das caixas.
- [x] Contraste WCAG AA e piso de 11px (DEC-018).
- [x] Painel ajustável + maximizar (DEC-019).
- [x] Controle geral «Caixas» (DEC-020).
> Ordem combinada com o autor: esta fase, depois F6, depois F9 parte 2.

---

## 🚫 Itens descartados desta visão
````

## Edicao 26 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.1** — 2026-11-03 — quadrado geral de seleção respeitando o filtro e tamanho das caixas de texto (F4 concluída). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 39/39 (rodada da wo0003).
````

**Substituir por:**

````
**Lunoda v13.2** — 2026-11-03 — legibilidade (contraste WCAG AA, piso de 11px), painel do editor ajustável/maximizar e controle geral do tamanho das caixas. Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 39/39 (rodada da wo0004).
````

## Edicao 27 — `meta/STATUS.md` · funcionando: itens novos

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Tamanho das caixas de texto: Auto (padrão) · Mín · P · M · G, padrão pelo botão direito (v13.1).
````

**Substituir por:**

````
- Tamanho das caixas de texto: Auto (padrão) · Mín · P · M · G, padrão pelo botão direito (v13.1).
- Painel do editor com largura ajustável (alça) e maximizar; largura lembrada (v13.2).
- Controle geral «Caixas: Auto · P · M · G» no cabeçalho dos blocos (v13.2).
- Texto secundário com contraste ≥ 4,5:1 e nada abaixo de 11px (v13.2).
````

## Edicao 28 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.1 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03. A v13.0 já foi conferida pelo autor (roteiro de 8 itens, todos ok).
````

**Substituir por:**

````
- **v13.2 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03. v13.0 e v13.1 já conferidas pelo autor (todos os itens ok).
````

## Edicao 29 — `meta/STATUS.md` · backlog: conferencia

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.1 no navegador** (roteiro na conversa de 2026-11-03).
````

**Substituir por:**

````
- [ ] **Conferir a v13.2 no navegador** (roteiro na conversa de 2026-11-03).
````

## Edicao 30 — `meta/STATUS.md` · backlog: ordem combinada

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Projetar a F6 — empurrão de versão (DEC-015)** como WO. Alternativa: **F9 parte 2 — reimportar `.md`**.
````

**Substituir por:**

````
- [ ] **Projetar a F6 — empurrão de versão (DEC-015)** como WO — próxima pela ordem combinada; depois **F9 parte 2 — reimportar `.md`** (começa por análise).
````

## Edicao 31 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1, C2 e Q1 (DEC-013/014/015); entregue a **v13.0** (wo0002, `49c087e`), conferida no navegador. Desenhados e entregues o quadrado geral de seleção (DEC-016) e o tamanho das caixas (DEC-017): **v13.1** pela wo0003.
````

**Substituir por:**

````
**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1, C2 e Q1 (DEC-013/014/015); entregue a **v13.0** (wo0002, `49c087e`), conferida no navegador. Desenhados e entregues o quadrado geral de seleção (DEC-016) e o tamanho das caixas (DEC-017): **v13.1** pela wo0003, conferida no navegador. Pacote de interface (DEC-018/019/020) aprovado com prints de antes/depois: **v13.2** pela wo0004.
````

## Edicao 32 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.1 no navegador; depois F6 ou F9 parte 2.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.2 no navegador; depois F6, depois F9 parte 2.
````

## Edicao 33 — `logs/2026-11-03.md` · secao do chat (continuacao 3)

**Forma:** ACRESCENTAR NO FIM DO ARQUIVO (sem ancora: a ultima linha do log e da secao do wrap e nao e garantidamente unica). Garanta UMA quebra de linha entre o fim atual e o texto abaixo.

**Texto:**

````

## Conversa 1 — chat (planejamento, continuação 3)

### Feito
- Conferido o relatório da wo0003 (`70d5a55` + wrap `0188322`, alinhados com `origin/main`); testes rodados pelo chat no repositório: smoke 28/0, history 39/0; `index.html` com o mesmo sha1 do testado no Chromium. Roteiro v13.1 do autor: todos ok.
- F6 e F9 parte 2 apresentadas; ideias novas do autor: controle geral de tamanho, painel mais largo/tela inteira, interface mais nítida. Ordem aprovada: pacote de interface → F6 → F9 parte 2.
- Legibilidade medida (contraste WCAG): `--text-muted` 1,7–1,8:1 e `--text-dim` 3,9–4,2:1; 22 textos em 9–10px. Prints de antes/depois aprovados pelo autor (DEC-018).
- Escrita a wo0004 (v13.2): legibilidade, painel ajustável/maximizar (DEC-019), controle geral «Caixas» (DEC-020). Testada no Chromium em cópia (largura 780→1040 lembrada, fechado fora da tela, maximizar 1440 e restaurar, duplo clique volta a 780; geral M/P/G e botão direito; nenhum erro de JS) e simulada contra o repositório a partir do próprio texto.

### Aprendizados / armadilhas
- Com largura variável, fechar o painel por `right: -820px` deixaria o painel largo à mostra; trocado por `transform`.
- O contraste ruim não vinha só das cores: a opacidade .48 das opções não marcadas derrubava um texto já claro.
````

## Edicao 34 — `logs/2026-11-03.md` · secao do Code

Depois da Edicao 33, acrescente no FIM do arquivo `## Conversa 1 — Code (execucao, wo0004)` com o seu relatorio resumido. Nao altere as outras secoes.

---

## Fora de escopo

- F6 e F9 parte 2 (proximas, nessa ordem).
- O modelo do HTML exportado (`exportHTML`/`entryToHTML`) — tem estilo proprio; nao foi medido nem mexido.
- Outras cores (acento, vermelho, chips de propriedade) — fora da medicao desta passada.

## Armadilhas desta WO

- `index.html` cheio de glifos; ancoras recortadas por script. Aplique por script ou edicao exata. Arquivos LF.
- **Ordem importa:** a Edicao 4 troca a linha da `.ta-size button` (que tem `font-size: 9px`) ANTES das «SUBSTITUIR TODAS»; por isso a de 9px espera 4 ocorrencias. Aplicar fora de ordem da 5 e deve PARAR.
- As «SUBSTITUIR TODAS» sao de texto literal, nao regex: `font-size: 10px` (com espaco) e `font-size:10px` (sem espaco) sao edicoes separadas.
- Edicao 9: o painel passa a fechar por `transform`. Nao reintroduza `right: -820px`.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado — em vermelho, suspeite primeiro do instrumento.

- [ ] `git status --short` -> exatamente `M` em: `index.html logs/2026-11-03.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md`, e `??` nesta WO. Nada alem.
- [ ] `node tests/smoke.mjs` -> `28 ok, 0 falha(s)` · `node tests/history.mjs` -> `39 ok, 0 falha(s)` (sem teste novo: mudanca de interface).
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"` -> `SINTAXE_OK`.
- [ ] `wc -l index.html` -> `3405`.
- [ ] Sem duplicacao, por LINHA (`grep -c`), todos -> 1: `"^function applyEditorWidth("` · `"^function toggleEditorMax("` · `"^function clampEditorW("` · `"^function taCommonBlockMode("` · `"^function taRenderAllBar("` · `"^function taToolbarHTML("` · `'id="epResize"'` · `'id="epMaxBtn"'` · `'data-ta="all"></div>'` · `"^const EDITOR_W_KEY = 'lunoda_editor_w';"` · `"  --text-muted:  #87879d;"` · `"  --text-dim:    #a2a2b6;"`.
- [ ] Codigo antigo fora, por LINHA, todos -> 0: `"right: -820px"` · `"transition: right"` · `"  opacity: .48;"` · `"font-size: 9px"` · `"font-size: 10px"` · `"font-size:10px"`.
- [ ] Registro: `grep -c "^## DEC-0\(18\|19\|20\) " meta/DECISIONS.md` -> 3 · `grep -m2 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]` e `## [13.2.0] — 2026-11-03` · `grep -c "^### 2026-11 — Controle geral de tamanho\|^### 2026-11 — Painel do editor mais largo\|^### 2026-11 — Interface mais nítida" meta/IDEAS.md` -> 3 · `grep -c "^## 🟢 F12" meta/ROADMAP.md` -> 1 · `grep -c "^\*\*Lunoda v13.2\*\*" meta/STATUS.md` -> 1 · `grep -c "Conferir a v13.1 no navegador" meta/STATUS.md` -> 0 · `grep -c "^## Conversa 1 — chat (planejamento, continuação 3)" logs/2026-11-03.md` -> 1.
- [ ] **Teste no navegador — NAO e seu.** Vai como roteiro ao autor. **Chega no ramo?** `openEditor` -> `applyEditorWidth`; alca -> `mousedown`/`mouseup` -> `saveEditorPrefs`; cabecalho -> `taToolbarHTML('all')` -> listener de clique. **Pergunta que os testes NAO respondem:** «presta na tela dele?» — nitidez com as cores reais das propriedades, conforto da alca.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0004.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md meta/CONTEXT.md meta/GLOSSARY.md logs/2026-11-03.md meta/workorders/261103-wo0004-v13-2-pacote-interface.md
```

```
git commit -m "feat(ui): legibilidade, painel ajustavel e controle geral das caixas" -m "v13.2. Texto secundario com contraste WCAG AA e piso de 11px (DEC-018). Painel do editor com alca de largura e maximizar, lembrados fora do db; fecha por transform (DEC-019). Controle geral Caixas no cabecalho dos blocos (DEC-020)."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-03 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
