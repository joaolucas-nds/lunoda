# WO 0010 — v13.6: busca sem acento com trecho, atalhos de teclado e arrastar para importar (F10, DEC-024)

> **Tipo:** mista — CODIGO (`index.html`, `tests/smoke.mjs`) + DOC (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, `tests/README.md`, log).
> **Config sugerida:** Sonnet, `/effort` medio. Codigo e texto prontos, ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD `a2c55d9` (wrap da wo0009). `sha1sum index.html` = `5c9db21fb78cd54ae85e8669bd4ecc4445cc858e`. Arvore limpa exceto os 4 arquivos gravados pelo chat (hashes abaixo; a analise e NOVA, `??`) e esta WO. ANTES: smoke 80/0 e history 52/0.
> **Base:** analise `meta/analises/261106-ANALISE-busca-atalhos-arrastar.md`, decidida pelo autor em 2026-11-06: 1a (filtro herda o termo), 2a (campo «Texto»), 3a (`N`), 4a (arrastar nesta versao).
> **Depende de:** wo0009.
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e log. CONTEXT, GLOSSARY, README e a analise o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
898746e146574bec6f67f532cba8944db45ea816  meta/CONTEXT.md
9d3b075b4cd64ac3ed0f948e3cc59d7d4fe33dc4  meta/GLOSSARY.md
216db8b599a4ff1cafe4d6cf4631d4d92f41f56b  README.md
c98f7d34941155a38daa0c7cbff9224a497e0eb6  meta/analises/261106-ANALISE-busca-atalhos-arrastar.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia do repositorio em `a2c55d9` (2026-11-06 ~19:00), cada uma com `count == 1`. A WO foi simulada lendo as edicoes deste proprio arquivo; o resultado foi testado no Chromium. **Nenhuma edicao e de remocao de linha**, e nenhuma ancora comeca ou termina em quebra de linha.

---

## 1. Por que

Decidido na analise (texto inteiro em DEC-024, Edicao 24): a busca passa a ignorar acento e a valer por palavras, mostra onde casou e leva o termo ate o bloco; atalhos para o uso diario, sem conflito com o navegador nem com o AltGr; e soltar um `.json`/`.md` na janela importa — hoje o navegador troca o app pelo arquivo.

## 2. Contexto factual

- **Medido no Chromium, versao atual (`5c9db21f…`):** `funcao` nao acha «função»; `Ctrl+P` alterna a barra lateral e nao imprime. Pesquisado: `Ctrl+N` e reservado pelo navegador (nunca chega a pagina).
- **Medido no Chromium, versao nova:** `/` foca a busca; `funcao` acha as duas entradas certas, com o titulo e o trecho destacados e «em 2 blocos»; `<script>` do conteudo sai escapado; `Esc` limpa; clicar a linha abre a entrada com o filtro «funcao claude» e «2 de 3 blocos»; entrada achada so pelo titulo abre sem filtro; `Alt+↓` b1 -> b3 (visiveis), para na ponta, `Alt+↑` volta; `Alt+Enter` cria o bloco, limpa o filtro, avisa e foca o subtitulo; `N` abre nova entrada e, na busca, so digita «n»; `Ctrl+P` nao e mais cancelado; `P` alterna; `?` abre a lista e `Esc` fecha; arrastar texto nao mostra a camada nem cancela; `.txt` solto avisa «Só dá para importar .json ou .md»; `.json` solto pergunta mesclar e importa. Nenhum erro de JS.
- **Desempenho**, teto do armazenamento (775 entradas, 4,8 MB), Chromium: redesenho da tabela sem busca ~170–200 ms (custo que ja existe); com busca ate ~80 ms a mais.
- **Prova de vida:** dez mutantes (sem tirar acento, frase inteira, basta uma palavra, memoria que nunca recalcula, trecho sem escapar, sem reticencias, so a primeira marca, acento solto fora da marca, trecho quando so o titulo casa, `Alt+setas` dando a volta) — todos derrubam pelo menos 1 asserção.
- `addBlock` esta na lista do embrulho do undo; a edicao muda so o corpo dela, o nome continua — o embrulho segue valendo (history 52/0).

## Inventario

40 edicoes em 8 arquivos (+ 4 gravados pelo chat). Codigo: 21 no `index.html` (CSS, HTML do topo/busca/filtro/janela/camada, funcoes da busca, `getFiltered`, `renderTable`, `handleRowClick`, filtro interno, `importFile`, lista de janelas, atalhos, `addBlock`, arrastar) e 1 no `tests/smoke.mjs` (21 asserções).

---

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `a2c55d9`; `sha1sum index.html` = `5c9db21fb78cd54ae85e8669bd4ecc4445cc858e`; `sha1sum -c` nas 4 linhas acima -> `OK`. smoke `80 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · CSS: trecho da busca, atalhos, camada de soltar

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
.backup-pill.warn { color: var(--yellow); border: 1px solid rgba(245,197,66,.45); }
````

**Substituir por:**

````
.backup-pill.warn { color: var(--yellow); border: 1px solid rgba(245,197,66,.45); }
/* Busca: trecho sob o título (DEC-024) */
.search-hit { font-size: 11px; font-weight: 400; color: var(--text-dim); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; margin-top: 2px; }
.search-hit mark, .search-hit-n { font-family: inherit; }
.search-hit mark { background: rgba(245,197,66,.28); color: var(--text); border-radius: 2px; padding: 0 1px; }
.search-hit-n { color: var(--text-dim); }
/* Lista de atalhos (DEC-024) */
.kbd-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.kbd-table td { padding: 5px 4px; border-bottom: 1px solid var(--border); vertical-align: top; }
.kbd-table td:first-child { white-space: nowrap; width: 1%; padding-right: 14px; }
.kbd-table kbd, .kbd-note kbd { font-family: var(--mono); font-size: 11px; border: 1px solid var(--border); border-radius: 4px; padding: 1px 6px; background: var(--surface2); color: var(--text); }
.kbd-note { font-size: 12px; color: var(--text-dim); margin-top: 10px; }
/* Camada de soltar arquivo (DEC-024) — pointer-events: none para não roubar os eventos do arrastar */
.drop-overlay { position: fixed; inset: 0; z-index: 9999; display: none; align-items: center; justify-content: center; background: rgba(10,10,14,.72); pointer-events: none; }
.drop-overlay.open { display: flex; }
.drop-box { border: 2px dashed var(--accent); border-radius: 12px; padding: 28px 40px; text-align: center; color: var(--text); font-size: 16px; background: var(--surface2); }
.drop-box small { display: block; margin-top: 6px; font-size: 12px; color: var(--text-dim); }
````

## Edicao 2 — `index.html` · topo: botao de atalhos

**Forma:** Substituir.

**Ancora:**

````
  <div class="topbar-sp"></div>
  <!-- Lembrete de backup JSON (DEC-023)
````

**Substituir por:**

````
  <div class="topbar-sp"></div>
  <button class="icon-btn" onclick="openModal('shortcutsModal')" title="Atalhos de teclado (?)" style="font-weight:600">?</button>
  <!-- Lembrete de backup JSON (DEC-023)
````

## Edicao 3 — `index.html` · Nova entrada: title (N)

**Forma:** Substituir.

**Ancora:**

````
  <button class="btn btn-primary" onclick="openEditor()">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Nova entrada
````

**Substituir por:**

````
  <button class="btn btn-primary" onclick="openEditor()" title="Nova entrada (N)">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
    Nova entrada
````

## Edicao 4 — `index.html` · busca: placeholder com o atalho

**Forma:** Substituir.

**Ancora:**

````
<input class="search-input" type="text" placeholder="Pesquisar..." id="searchInput" oninput="renderTable()">
````

**Substituir por:**

````
<input class="search-input" type="text" placeholder="Pesquisar…  ( / )" title="Procura no título, na descrição e nos blocos; acento não conta (/ para vir aqui, Esc para limpar)" id="searchInput" oninput="renderTable()">
````

## Edicao 5 — `index.html` · filtro interno: campo Texto

**Forma:** Substituir.

**Ancora:**

````
          <span class="blk-filter-lbl">Subtítulo:</span>
          <input type="text" class="blk-filter-input" id="blkFText" placeholder="Buscar subtítulo..." oninput="applyBlockFilter()" style="flex:1;min-width:120px">
````

**Substituir por:**

````
          <span class="blk-filter-lbl">Texto:</span>
          <input type="text" class="blk-filter-input" id="blkFText" placeholder="Buscar no subtítulo e no conteúdo..." oninput="applyBlockFilter()" style="flex:1;min-width:120px">
````

## Edicao 6 — `index.html` · Adicionar bloco: title (Alt+Enter)

**Forma:** Substituir.

**Ancora:**

````
      <button class="add-block-btn" onclick="addBlock()" style="margin-top:4px">
````

**Substituir por:**

````
      <button class="add-block-btn" onclick="addBlock()" title="Novo bloco (Alt+Enter)" style="margin-top:4px">
````

## Edicao 7 — `index.html` · janela de atalhos e camada de soltar

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
<div class="modal-bg" id="addPropModal">
````

**Substituir por:**

````
<!-- Lista de atalhos de teclado (DEC-024) -->
<div class="modal-bg" id="shortcutsModal">
  <div class="modal" style="width:480px;max-width:95vw">
    <h3>Atalhos de teclado</h3>
    <table class="kbd-table">
      <tr><td><kbd>/</kbd></td><td>Ir para a busca</td></tr>
      <tr><td><kbd>Esc</kbd> na busca</td><td>Limpar a busca</td></tr>
      <tr><td><kbd>N</kbd></td><td>Nova entrada</td></tr>
      <tr><td><kbd>P</kbd></td><td>Mostrar / ocultar as propriedades</td></tr>
      <tr><td><kbd>?</kbd></td><td>Esta lista</td></tr>
      <tr><td><kbd>Ctrl</kbd> + <kbd>S</kbd></td><td>Salvar a entrada</td></tr>
      <tr><td><kbd>Alt</kbd> + <kbd>↓</kbd> / <kbd>↑</kbd></td><td>Próximo / anterior bloco (também digitando)</td></tr>
      <tr><td><kbd>Alt</kbd> + <kbd>Enter</kbd></td><td>Novo bloco (também digitando)</td></tr>
      <tr><td><kbd>Ctrl</kbd> + <kbd>Z</kbd> / <kbd>Y</kbd></td><td>Desfazer / refazer no editor (fora de campo de texto)</td></tr>
      <tr><td><kbd>Esc</kbd></td><td>Fechar a janela ou o editor</td></tr>
    </table>
    <p class="kbd-note">As teclas soltas (<kbd>/</kbd> <kbd>N</kbd> <kbd>P</kbd> <kbd>?</kbd>) não valem enquanto você digita num campo. Para importar, também dá para arrastar um <code>.json</code> ou <code>.md</code> para a janela.</p>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal('shortcutsModal')">Fechar</button>
    </div>
  </div>
</div>

<!-- Camada de soltar arquivo para importar (DEC-024) -->
<div class="drop-overlay" id="dropOverlay"><div class="drop-box">Solte para importar<small>.json (backup) ou .md (exportado pelo Lunoda)</small></div></div>

<div class="modal-bg" id="addPropModal">
````

## Edicao 8 — `index.html` · funcoes da busca + getFiltered sem acento

**Forma:** Substituir.

**Ancora:**

````
function getFiltered() {
  const q   = document.getElementById('searchInput').value.toLowerCase().trim();
````

**Substituir por:**

````
/* ──────────────────────────────
   BUSCA (v13.6, DEC-024)
   Acento e maiúscula não contam; cada palavra digitada precisa aparecer,
   em qualquer ordem. Funções puras (salvo esc), testadas no smoke.
────────────────────────────── */

/* Texto sem acento e em minúsculas, para comparar. */
function foldText(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}

/* Palavras da busca, já sem acento. Busca vazia = lista vazia. */
function searchTokens(q) {
  return foldText(q).split(/\s+/).filter(Boolean);
}

/* Memória do texto dobrado, por objeto (entrada ou bloco). Confere a fonte a
   cada uso — se o texto mudou, recalcula —, então nunca fica velha e não
   precisa ser invalidada. Dobrar acento é o que pesa: medido, metade do custo
   da busca num acervo grande. */
const foldMemo = new WeakMap();
function foldOf(obj, fonte) {
  const m = foldMemo.get(obj);
  if (m && m.fonte === fonte) return m.dobrado;
  const dobrado = foldText(fonte);
  foldMemo.set(obj, { fonte, dobrado });
  return dobrado;
}
function blockFold(b) { return foldOf(b, (b.subtitle || '') + '\n' + (b.content || '')); }

/* A entrada casa se cada palavra aparecer em algum lugar dela:
   título, descrição, subtítulo ou conteúdo de qualquer bloco.
   (Palavra não tem espaço, então não casa «atravessando» dois campos.) */
function entryMatches(e, tokens) {
  if (!tokens.length) return true;
  const td = foldOf(e, (e.title || '') + '\n' + (e.description || ''));
  return tokens.every(w => td.includes(w) || (e.blocks || []).some(b => blockFold(b).includes(w)));
}

/* O bloco casa se cada palavra aparecer no subtítulo ou no conteúdo DELE. */
function blockMatches(b, tokens) {
  if (!tokens.length) return true;
  const t = blockFold(b);
  return tokens.every(w => t.includes(w));
}

/* Recorta um trecho do texto em volta da primeira palavra encontrada e
   destaca todas as palavras com <mark>. Devolve HTML já escapado ('' se
   nada casar). O texto sem acento pode ter outro comprimento que o
   original, então cada caractere dobrado guarda a posição de origem. */
function searchSnippet(text, tokens, raio = 40) {
  const src = String(text || '');
  if (!src || !tokens.length) return '';
  let dob = foldText(src);
  let orig = null;                      // orig[k] = índice em src do k-ésimo caractere dobrado
  if (dob.length !== src.length) {
    // Caminho lento, só para texto com acento já decomposto (raro): mapa caractere a caractere.
    // Texto comum (acento composto) dobra com o MESMO comprimento: posições batem 1 para 1.
    dob = ''; orig = [];
    for (let i = 0; i < src.length; i++) {
      const f = foldText(src[i]);
      for (let k = 0; k < f.length; k++) { dob += f[k]; orig.push(i); }
    }
  }
  const at = k => (orig ? orig[k] : k);
  // Todas as ocorrências de todas as palavras, em posições do original
  const faixas = [];
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
  // Junta faixas que se sobrepõem, só dentro da janela
  const marcas = [];
  faixas.filter(f => f[0] < fim && f[1] > ini).forEach(([a, b]) => {
    a = Math.max(a, ini); b = Math.min(b, fim);
    const u = marcas[marcas.length - 1];
    if (u && a <= u[1]) u[1] = Math.max(u[1], b); else marcas.push([a, b]);
  });
  const limpa = s => esc(s.replace(/\s+/g, ' '));
  let html = ini > 0 ? '…' : '', pos = ini;
  marcas.forEach(([a, b]) => {
    html += limpa(src.slice(pos, a)) + '<mark>' + limpa(src.slice(a, b)) + '</mark>';
    pos = b;
  });
  html += limpa(src.slice(pos, fim)) + (fim < src.length ? '…' : '');
  return html;
}

/* Onde a busca casou nos blocos de uma entrada: quantos blocos e o trecho
   do primeiro. null se nenhum bloco casa sozinho (a entrada casou pelo
   título, pela descrição, ou com as palavras espalhadas). */
function searchHit(e, tokens) {
  if (!tokens.length) return null;
  const blocos = (e.blocks || []).filter(b => blockMatches(b, tokens));
  if (!blocos.length) return null;
  const b = blocos[0];
  const texto = (b.subtitle ? b.subtitle + ': ' : '') + (b.content || '');
  return { count: blocos.length, html: searchSnippet(texto, tokens) };
}

/* Índice do bloco vizinho para Alt+↓/↑: fora de um bloco (i = -1) vai para o
   primeiro (↓) ou o último (↑); nas pontas devolve -1 (fica onde está). */
function siblingBlockIndex(i, dir, n) {
  if (n <= 0) return -1;
  const j = i === -1 ? (dir > 0 ? 0 : n - 1) : i + dir;
  return (j < 0 || j >= n) ? -1 : j;
}

/* Leva a busca da tabela para dentro da entrada aberta (DEC-024): o filtro de
   blocos já vem com o termo e mostra só os blocos que casam. Só se algum bloco
   casar — senão a entrada achada pelo título abriria com «0 de N blocos». */
function carrySearchIntoEditor() {
  const q = document.getElementById('searchInput').value.trim();
  const tokens = searchTokens(q);
  if (!tokens.length || !editBlocks.some(b => blockMatches(b, tokens))) return;
  blkFilterText = q;
  const bar = document.getElementById('blkFilterBar');
  if (!bar.classList.contains('open')) {
    bar.classList.add('open');
    document.getElementById('blkFilterBtn').style.color = 'var(--accent)';
  }
  renderBlockFilterBar();
  renderBlocks();
}

/* Alt+↓/↑ (DEC-024): foco na caixa de texto do bloco visível vizinho.
   Bloco recolhido é aberto, senão a caixa não recebe o foco. */
function focusSiblingBlock(dir) {
  const ids = getFilteredBlocks().map(b => b.id);
  const ativo = document.activeElement;
  const atual = ativo && ativo.closest ? ativo.closest('.block-item') : null;
  const j = siblingBlockIndex(atual ? ids.indexOf(atual.dataset.bid) : -1, dir, ids.length);
  if (j === -1) return;
  const wrap = document.querySelector(`.block-item[data-bid="${ids[j]}"]`);
  if (wrap) wrap.classList.remove('collapsed');
  const ta = document.querySelector(`textarea.fi-ta[data-bid="${ids[j]}"]`);
  if (!ta) return;
  ta.focus();
  ta.scrollIntoView({ block: 'nearest' });
}

/* Campo onde se digita (tecla solta não pode virar atalho ali).
   Checkbox e botão não contam: com foco neles, `/` e `N` ainda funcionam. */
function isTypingTarget(el) {
  if (!el) return false;
  if (el.isContentEditable || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT') return true;
  return el.tagName === 'INPUT'
    && !['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'range', 'color'].includes(el.type);
}

function getFiltered() {
  // Busca sem acento, por palavras (DEC-024)
  const tokens = searchTokens(document.getElementById('searchInput').value);
````

## Edicao 9 — `index.html` · getFiltered usa entryMatches

**Forma:** Substituir.

**Ancora:**

````
  if (q) list = list.filter(e => {
    if ((e.title||'').toLowerCase().includes(q)) return true;
    if ((e.description||'').toLowerCase().includes(q)) return true;
    return (e.blocks||[]).some(b => (b.subtitle+' '+b.content).toLowerCase().includes(q));
  });
````

**Substituir por:**

````
  if (tokens.length) list = list.filter(e => entryMatches(e, tokens));
````

## Edicao 10 — `index.html` · renderTable: palavras da busca

**Forma:** Substituir.

**Ancora:**

````
  tbody.innerHTML = list.map(e => {
    const propHtml = db.properties.map(p => {
````

**Substituir por:**

````
  const tokens = searchTokens(document.getElementById('searchInput').value);
  tbody.innerHTML = list.map(e => {
    const propHtml = db.properties.map(p => {
````

## Edicao 11 — `index.html` · renderTable: trecho sob o titulo

**Forma:** Substituir.

**Ancora:**

````
      <td class="td-title" title="${esc(e.title)}">${esc(e.title)||'<span style="color:var(--text-muted)">Sem título</span>'}</td>
````

**Substituir por:**

````
      <td class="td-title" title="${esc(e.title)}">${titleHtml(e, tokens)||'<span style="color:var(--text-muted)">Sem título</span>'}${hitHtml(e, tokens)}</td>
````

## Edicao 12 — `index.html` · abrir pela tabela leva a busca

**Forma:** Substituir.

**Ancora:**

````
function handleRowClick(ev, id) {
  if (ev.target.type === 'checkbox') return;
  openEditor(id);
}
````

**Substituir por:**

````
/* Título com as palavras da busca destacadas (o título inteiro, sem recorte). */
function titleHtml(e, tokens) {
  return (tokens.length && searchSnippet(e.title, tokens, Infinity)) || esc(e.title);
}

/* Linha do trecho sob o título, quando a busca casou num bloco (DEC-024). */
function hitHtml(e, tokens) {
  const hit = searchHit(e, tokens);
  if (!hit) return '';
  return `<div class="search-hit">${hit.html} <span class="search-hit-n">· em ${hit.count} bloco${hit.count === 1 ? '' : 's'}</span></div>`;
}

function handleRowClick(ev, id) {
  if (ev.target.type === 'checkbox') return;
  openEditor(id);
  carrySearchIntoEditor();   // o filtro de blocos já vem com o termo da busca (DEC-024)
}
````

## Edicao 13 — `index.html` · filtro interno: subtitulo e conteudo, sem acento

**Forma:** Substituir.

**Ancora:**

````
      results.push((b.subtitle || '').toLowerCase().includes(text));
````

**Substituir por:**

````
      results.push(blockMatches(b, searchTokens(text)));   // subtítulo E conteúdo, sem acento (DEC-024)
````

## Edicao 14 — `index.html` · handleImport delega a importFile

**Forma:** Substituir.

**Ancora:**

````
function handleImport(ev) {
  const file = ev.target.files[0]; if (!file) return;
  const reader = new FileReader();
````

**Substituir por:**

````
function handleImport(ev) {
  const file = ev.target.files[0]; if (!file) return;
  importFile(file);
  ev.target.value = '';
}

/* Importa um arquivo escolhido no seletor ou solto na janela (DEC-024):
   .md vai para a prévia; o resto é lido como backup JSON. */
function importFile(file) {
  const reader = new FileReader();
````

## Edicao 15 — `index.html` · importFile: fim sem ev

**Forma:** Substituir.

**Ancora:**

````
    } catch(err) { alert('Erro ao importar: '+err.message); }
  };
  reader.readAsText(file);
  ev.target.value = '';
}
````

**Substituir por:**

````
    } catch(err) { alert('Erro ao importar: '+err.message); }
  };
  reader.readAsText(file);
}
````

## Edicao 16 — `index.html` · janela de atalhos fecha no clique fora

**Forma:** Substituir.

**Ancora:**

````
['exportModal','addPropModal','unsavedModal','blockTransferModal','mdImportModal'].forEach(id => {
````

**Substituir por:**

````
['exportModal','addPropModal','unsavedModal','blockTransferModal','mdImportModal','shortcutsModal'].forEach(id => {
````

## Edicao 17 — `index.html` · P sem modificador

**Forma:** Substituir.

**Ancora:**

````
  if (e.key === 'p' || e.key === 'P') {
````

**Substituir por:**

````
  // Sem modificador: Ctrl+P é do navegador (imprimir) (DEC-024)
  if ((e.key === 'p' || e.key === 'P') && !e.ctrlKey && !e.metaKey && !e.altKey) {
````

## Edicao 18 — `index.html` · atalhos novos no lugar do Ctrl+N

**Forma:** Substituir.

**Ancora:**

````
  if ((e.ctrlKey||e.metaKey) && e.key === 'n') { e.preventDefault(); openEditor(); }
````

**Substituir por:**

````
  // Atalhos da v13.6 (DEC-024). Ctrl+N saiu: é reservado pelo navegador e
  // nunca chegava aqui. Tecla solta só fora de campo; nunca Ctrl+Alt (AltGr no ABNT2).
  const emCampo     = isTypingTarget(document.activeElement);
  const edAberto    = document.getElementById('editorPanel').classList.contains('open');
  const modalAberto = !!document.querySelector('.modal-bg.open');
  if (!emCampo && !modalAberto) {
    if (e.key === '?') { e.preventDefault(); openModal('shortcutsModal'); return; }
    if (!edAberto && e.key === '/') {
      e.preventDefault();
      const s = document.getElementById('searchInput'); s.focus(); s.select();
      return;
    }
    if (!edAberto && (e.key === 'n' || e.key === 'N') && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault(); openEditor(); return;
    }
  }
  if (edAberto && !modalAberto && e.altKey && !e.ctrlKey && !e.metaKey) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); focusSiblingBlock(e.key === 'ArrowDown' ? 1 : -1); return;
    }
    if (e.key === 'Enter') { e.preventDefault(); addBlock(); return; }
  }
````

## Edicao 19 — `index.html` · Esc na busca limpa

**Forma:** Substituir.

**Ancora:**

````
  if (e.key === 'Escape') {
    closeAllSugs();
````

**Substituir por:**

````
  // Esc na busca: limpa e sai do campo (DEC-024)
  if (e.key === 'Escape' && document.activeElement && document.activeElement.id === 'searchInput') {
    const s = document.activeElement;
    if (s.value) { s.value = ''; renderTable(); }
    s.blur();
    return;
  }
  if (e.key === 'Escape') {
    closeAllSugs();
````

## Edicao 20 — `index.html` · arrastar arquivo para importar

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ──────────────────────────────
   INIT
────────────────────────────── */
````

**Substituir por:**

````
/* ──────────────────────────────
   ARRASTAR ARQUIVO PARA IMPORTAR (v13.6, DEC-024)
   Só reage a arrastar ARQUIVO (arrastar texto entre caixas segue normal).
   O drop sempre é cancelado: sem isso o navegador abre o arquivo no lugar
   do app e uma edição não salva se perde.
────────────────────────────── */
let dropDepth = 0;   // dragenter/dragleave disparam a cada elemento cruzado
function dragHasFiles(e) {
  return !!(e.dataTransfer && Array.from(e.dataTransfer.types || []).includes('Files'));
}
function showDropOverlay(on) {
  document.getElementById('dropOverlay').classList.toggle('open', on);
}
document.addEventListener('dragenter', e => {
  if (!dragHasFiles(e)) return;
  e.preventDefault(); dropDepth++; showDropOverlay(true);
});
document.addEventListener('dragover', e => {
  if (!dragHasFiles(e)) return;
  e.preventDefault(); e.dataTransfer.dropEffect = 'copy';
});
document.addEventListener('dragleave', e => {
  if (!dragHasFiles(e)) return;
  dropDepth = Math.max(0, dropDepth - 1);
  if (dropDepth === 0) showDropOverlay(false);
});
document.addEventListener('drop', e => {
  if (!dragHasFiles(e)) return;
  e.preventDefault(); dropDepth = 0; showDropOverlay(false);
  const files = e.dataTransfer.files;
  if (!files || !files.length) return;
  const f = files[0];
  if (!/\.(json|md|markdown)$/i.test(f.name)) { showToast('Só dá para importar .json ou .md'); return; }
  if (files.length > 1) showToast(`Um arquivo por vez: importando «${f.name}»`);
  importFile(f);
});

/* ──────────────────────────────
   INIT
────────────────────────────── */
````

## Edicao 21 — `index.html` · bloco novo com filtro ativo limpa o filtro

**Forma:** Substituir.

**Ancora:**

````
function addBlock() {
  const nb = { id: uid(), subtitle: '', version: 1, content: '', blockProps: {} };
````

**Substituir por:**

````
function addBlock() {
  // Com filtro ativo, o bloco novo (vazio) nasceria escondido: limpa o filtro (DEC-024)
  if (blkFilterText.trim() || blkFilterVer !== null || (blkFilterPropId && blkFilterOptIds.size > 0)) {
    blkFilterText = ''; blkFilterVer = null; blkFilterPropId = null;
    blkFilterOptIds.clear(); blkFilterMode = 'and';
    renderBlockFilterBar();
    showToast('Filtro dos blocos limpo para mostrar o bloco novo');
  }
  const nb = { id: uid(), subtitle: '', version: 1, content: '', blockProps: {} };
````

## Edicao 22 — `tests/smoke.mjs` · secao da busca

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ── Relatório ──────────────────────────────────────────────── */
````

**Substituir por:**

````
/* ── Busca sem acento, por palavras, e trecho destacado (DEC-024) ── */
{
  const BUSCA = ['esc', 'foldText', 'searchTokens', 'foldOf', 'blockFold', 'entryMatches', 'blockMatches',
                 'searchSnippet', 'searchHit', 'siblingBlockIndex'];
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
````

## Edicao 23 — `tests/README.md` · README: smoke cobre a busca

**Forma:** Substituir.

**Ancora:**

````
`mergeImportedProperties`. 80 asserções no total.
````

**Substituir por:**

````
`mergeImportedProperties`. Desde a v13.6, a **busca** (DEC-024): acento e maiúscula não contam, todas as palavras em qualquer ordem, o bloco casa só com as palavras dele, a memória do texto dobrado acompanha a edição, o trecho (destaque, HTML escapado, reticências, acento decomposto, marcas sobrepostas) e o índice do `Alt+↓/↑`. 101 asserções no total.
````

## Edicao 24 — `meta/DECISIONS.md` · DEC-024 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **Lição:** id fixo de dado padrão é compartilhado entre instalações; mescla «por id» tem de descer até o nível das opções.
````

**Substituir por:**

````
- **Lição:** id fixo de dado padrão é compartilhado entre instalações; mescla «por id» tem de descer até o nível das opções.

---

## DEC-024 — Busca sem acento com trecho e continuidade até o bloco; atalhos sem conflito; arrastar para importar (F10)
**Data:** 2026-11-06 · **Status:** aceita · origem: `meta/analises/261106-ANALISE-busca-atalhos-arrastar.md` (pontos 1a, 2a, 3a, 4a)

### Contexto
A busca da tabela já procurava no conteúdo dos blocos, mas `funcao` não achava «função», não dizia onde casou e o termo se perdia ao abrir a entrada; o filtro interno procurava só no subtítulo. Dos atalhos, `Ctrl+N` nunca chegava à página (reservado pelo navegador desde o Chrome 4) e o `P` capturava o `Ctrl+P`. Soltar um arquivo na janela fazia o navegador abrir o arquivo no lugar do app.

### Decisão
- **Busca:** acento e maiúscula não contam (`foldText`: NFD sem marcas combinantes); cada palavra precisa aparecer, em qualquer ordem, em qualquer campo da entrada (`entryMatches`). Na tabela, o título mostra as palavras destacadas e, quando um bloco casa sozinho, uma linha com o **trecho** destacado e «em N blocos» (`searchHit`/`searchSnippet`, HTML escapado antes do `<mark>`).
- **Continuidade:** abrir uma entrada pela tabela com a busca ativa já abre o filtro de blocos com o termo (`carrySearchIntoEditor`) — só se algum bloco casar. O filtro de texto passa a se chamar **«Texto»** e procura no subtítulo **e** no conteúdo, sem acento. Dentro da caixa, o `Ctrl+F` do navegador acha a palavra (não há destaque dentro do `textarea`).
- **Bloco novo com filtro ativo limpa o filtro** e avisa — senão o bloco vazio nascia escondido (já acontecia pelo botão; com o filtro herdado da busca, ficaria comum).
- **Atalhos:** tecla solta só fora de campo de texto e sem janela aberta — `/` busca, `N` nova entrada (no lugar do `Ctrl+N`), `P` barra lateral (agora sem modificador), `?` lista de atalhos; `Esc` na busca limpa. No editor, inclusive digitando: `Alt+↓/↑` bloco vizinho visível, `Alt+Enter` novo bloco. Nunca `Ctrl+Alt` (AltGr no ABNT2) nem combinação reservada do navegador. Lista em `#shortcutsModal`, aberta pelo `?` ou pelo botão `?` no topo; `title` dos botões cita o atalho.
- **Arrastar:** arquivo (só `Files`) solto em qualquer lugar da janela segue o mesmo caminho do botão Importar (`importFile`); `.json`/`.md` só, um por vez; o `drop` de arquivo é sempre cancelado.
- **Desempenho:** o texto dobrado fica numa memória por objeto (`foldMemo`) que **confere a fonte a cada uso** — nunca fica velha, nada a invalidar. Medido no teto (775 entradas, 4,8 MB, Chromium): a busca soma até ~80 ms ao redesenho da tabela, que já custa ~170–200 ms com 775 linhas sem busca nenhuma (custo anterior, não mudado).

### Alternativas consideradas
- Mostrar todos os blocos e só marcar os que casam (1b) — a marca se perde na rolagem; o filtro tem o Limpar a um clique.
- Campo «Conteúdo» separado no filtro (2b) — dois campos para o mesmo gesto; o campo único é superconjunto do antigo.
- `Alt+N` para nova entrada (3b) — funciona, mas o `N` solto segue o padrão do `P`.
- Destaque dentro do `textarea` (camada espelhada) — frágil e o `Ctrl+F` do navegador já faz.
- Cache invalidado por evento — estado espalhado por todos os mutadores; a memória que confere a fonte resolve sem isso.
- Espera entre teclas (debounce) — desnecessária no acervo real; o custo de base da tabela é anterior a esta versão (ver IDEAS).

### Consequências
Achar um trecho deixa de depender de lembrar a grafia exata, e o caminho busca → entrada → bloco não perde o termo. O filtro interno passa a mostrar também blocos que *citam* o texto digitado. `Ctrl+N` deixa de constar do código; quem usava (não funcionava) usa `N`. O `drop` cancelado protege a edição não salva.
````

## Edicao 25 — `meta/CHANGELOG.md` · [13.6.0] acima da 13.5.1

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.5.1] — 2026-11-06
````

**Substituir por:**

````
## [13.6.0] — 2026-11-06

### Adicionado
- **Busca sem acento e por palavras** (DEC-024): `funcao modelo` acha «Modelo … função», em qualquer ordem e em qualquer campo. Na tabela, o título destaca as palavras e, quando um bloco casa, aparece o **trecho** destacado e «em N blocos».
- **Abrir pela busca leva o termo**: o filtro de blocos já vem com ele e mostra só os blocos que casam.
- **Atalhos**: `/` busca · `Esc` na busca limpa · `N` nova entrada · `?` lista de atalhos · `Alt+↓/↑` bloco vizinho · `Alt+Enter` novo bloco. Botão `?` no topo.
- **Arrastar um `.json` ou `.md` para a janela** importa, pelo mesmo caminho do botão Importar.
- `tests/smoke.mjs` cobre a busca (21 asserções novas, 101 no total).

### Modificado
- O filtro de blocos procura no subtítulo **e** no conteúdo, sem acento (campo «Texto»).
- Adicionar um bloco com o filtro ativo limpa o filtro, para o bloco novo não nascer escondido.

### Corrigido
- `Ctrl+N` nunca funcionava (é reservado pelo navegador): nova entrada agora é `N`.
- `P` capturava o `Ctrl+P` e impedia imprimir.
- Soltar um arquivo na janela fazia o navegador trocar o app pelo arquivo.

## [13.5.1] — 2026-11-06
````

## Edicao 26 — `meta/IDEAS.md` · ideia busca: status

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-19 — Busca full-text dentro do conteúdo dos blocos
````

**Substituir por:**

````
### 2026-07-19 — Busca full-text dentro do conteúdo dos blocos
> **Status (2026-11-06):** implementada na v13.6 (DEC-024). A medição mostrou que a busca já alcançava o conteúdo; a v13.6 tirou o acento, mostra o trecho e leva o termo ao editor — ver Concluídas.
````

## Edicao 27 — `meta/IDEAS.md` · ideia atalhos: status

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-19 — Atalhos de teclado
````

**Substituir por:**

````
### 2026-07-19 — Atalhos de teclado
> **Status (2026-11-06):** implementada na v13.6 (DEC-024), com `/`, `N`, `?`, `Alt+↓/↑`, `Alt+Enter`; `Ctrl+N` (morto) saiu e o `P` deixou de capturar o `Ctrl+P` — ver Concluídas.
````

## Edicao 28 — `meta/IDEAS.md` · ideia nova do autor: arrastar

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: conversa de 2026-11-03. **Status:** primeira passada na v13.2 (DEC-018) — ver Concluídas. Novas observações de nitidez entram aqui.
````

**Substituir por:**

````
> Fonte: conversa de 2026-11-03. **Status:** primeira passada na v13.2 (DEC-018) — ver Concluídas. Novas observações de nitidez entram aqui.

### 2026-11 — Arrastar o JSON para a tela para importar
Poder arrastar o arquivo (por exemplo o `.json`) para a janela em vez de passar pelo botão Importar.
> Fonte: conversa de 2026-11-06. **Status:** implementada na v13.6 (DEC-024) — vale para `.json` e `.md` — ver Concluídas.
````

## Edicao 29 — `meta/IDEAS.md` · ideia nova: tabela grande redesenha tudo

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
````

**Substituir por:**

````
### 2026-11-06 — Tabela com centenas de entradas redesenha tudo a cada tecla
> **Status:** aberta — medido ao fazer a busca da v13.6; não pesa no acervo real.
`renderTable` refaz o `innerHTML` de todas as linhas a cada mudança: medido no Chromium, ~170–200 ms com 775 entradas (o teto do `localStorage`), **sem** busca. Se o acervo chegar a centenas de entradas, digitar na busca vai arrastar. Caminhos, do barato ao caro: espera curta entre teclas (debounce); desenhar só as primeiras ~200 linhas com «mostrar mais»; virtualizar a lista. Gatilho: o próprio autor sentir a busca lenta.

### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
````

## Edicao 30 — `meta/IDEAS.md` · Concluidas: busca, atalhos, arrastar

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Testes do núcleo no smoke** — v13.5.1 / FIX-004, FIX-005.
````

**Substituir por:**

````
## ✅ Concluídas

- **Busca sem acento, com trecho e levando o termo ao editor** — v13.6 / DEC-024.
- **Atalhos de teclado** (`/`, `N`, `?`, `Alt+↓/↑`, `Alt+Enter`) — v13.6 / DEC-024.
- **Arrastar `.json`/`.md` para importar** — v13.6 / DEC-024.
- **Testes do núcleo no smoke** — v13.5.1 / FIX-004, FIX-005.
````

## Edicao 31 — `meta/ROADMAP.md` · F10 concluida

**Forma:** Substituir.

**Ancora:**

````
## 🔵 F10 — Navegação em acervo grande *(futuro)*
**Objetivo:** manter a ferramenta usável quando houver centenas de entradas.
- [ ] Busca full-text no conteúdo dos blocos, com destaque do trecho.
- [ ] Atalhos de teclado (novo bloco, navegar entre blocos, foco na busca, fechar editor).
````

**Substituir por:**

````
## 🟢 F10 — Navegação em acervo grande *(concluída — v13.6)*
**Objetivo:** manter a ferramenta usável quando houver centenas de entradas.
- [x] Busca no conteúdo dos blocos com destaque do trecho — v13.6, ver DEC-024. (A busca já alcançava o conteúdo; a v13.6 tirou o acento, separou as palavras, mostra o trecho e leva o termo ao filtro de blocos.)
- [x] Atalhos de teclado (`/`, `N`, `?`, `Alt+↓/↑`, `Alt+Enter`; `Esc` já fechava) — v13.6, ver DEC-024.
- [x] Arrastar `.json`/`.md` para a janela para importar — v13.6 (ideia do autor, acrescentada à fase).
> Fica em aberto, como ideia: a tabela redesenha todas as linhas a cada tecla (~200 ms com 775 entradas) — ver IDEAS.
````

## Edicao 32 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.5.1** — 2026-11-06 — testes do núcleo + duas correções da importação (FIX-004, FIX-005). Arquivo canônico `index.html`. Testes: `smoke` 80/80 e `history` 52/52 (rodada da wo0009).
````

**Substituir por:**

````
**Lunoda v13.6** — 2026-11-06 — busca sem acento com trecho, atalhos de teclado e arrastar para importar (DEC-024). Arquivo canônico `index.html`. Testes: `smoke` 101/101 e `history` 52/52 (rodada da wo0010).
````

## Edicao 33 — `meta/STATUS.md` · funcionando: filtro interno

**Forma:** Substituir.

**Ancora:**

````
- Filtro interno de blocos (subtítulo, versão, propriedade+opções) com modo E/OU.
````

**Substituir por:**

````
- Filtro interno de blocos (texto no subtítulo e no conteúdo, versão, propriedade+opções) com modo E/OU.
````

## Edicao 34 — `meta/STATUS.md` · funcionando: busca, atalhos, arrastar

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Importar backup JSON: entrada sem blocos ganha um bloco vazio; mesclar traz as opções novas de propriedades existentes (v13.5.1).
````

**Substituir por:**

````
- Importar backup JSON: entrada sem blocos ganha um bloco vazio; mesclar traz as opções novas de propriedades existentes (v13.5.1).
- Busca sem acento e por palavras, com trecho destacado; abrir pela busca leva o termo ao filtro de blocos (v13.6).
- Atalhos `/` `N` `P` `?` fora de campo; `Alt+↓/↑` e `Alt+Enter` no editor; lista no botão `?` (v13.6).
- Arrastar `.json`/`.md` para a janela importa (v13.6).
````

## Edicao 35 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.5.1 aplicada pela wo0009 (`a51ac58`); falta a conferência no navegador** — roteiro na conversa de 2026-11-06. v13.0 a v13.5 já conferidas pelo autor.
````

**Substituir por:**

````
- **v13.6 aplicada pela wo0010; falta a conferência no navegador** — roteiro na conversa de 2026-11-06. v13.0 a v13.5.1 já conferidas pelo autor.
````

## Edicao 36 — `meta/STATUS.md` · backlog: conferencia

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.5.1 no navegador** (roteiro na conversa de 2026-11-06).
````

**Substituir por:**

````
- [ ] **Conferir a v13.6 no navegador** (roteiro na conversa de 2026-11-06) — em especial `Alt+↓/↑` e `Alt+Enter` no Chrome do Windows, que o Chromium do container não reproduz.
````

## Edicao 37 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
**2026-11-06** — v13.5 conferida pelo autor. Frente escolhida: testes do núcleo. Entregues 26 asserções no smoke e duas correções que elas acharam (FIX-004: entrada sem blocos; FIX-005: mescla perdia opções), como **v13.5.1** pela wo0009. Achado registrado sem corrigir: `base_v4` ilegível cai para a chave legada (IDEAS).
````

**Substituir por:**

````
**2026-11-06** — v13.5 conferida pelo autor. Frente escolhida: testes do núcleo. Entregues 26 asserções no smoke e duas correções que elas acharam (FIX-004: entrada sem blocos; FIX-005: mescla perdia opções), como **v13.5.1** pela wo0009. Achado registrado sem corrigir: `base_v4` ilegível cai para a chave legada (IDEAS). Depois: v13.5.1 conferida; análise da F10 medida (a busca já alcançava o conteúdo; `Ctrl+N` morto; `P` capturando `Ctrl+P`) e decidida com o autor (1a, 2a, 3a, 4a); entregue como **v13.6** pela wo0010 (DEC-024).
````

## Edicao 38 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.5.1 no navegador; depois a próxima frente — C (busca no conteúdo dos blocos, com análise curta) com B (atalhos de teclado) junto.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.6 no navegador; depois escolher a próxima frente (F9 `.zip`, a ideia da `base_v4` ilegível, ou as pendências do autor no backlog).
````

## Edicao 39 — `logs/2026-11-06.md` · secao do chat (continuacao)

**Forma:** ACRESCENTAR NO FIM DO ARQUIVO (sem ancora: o fim do log e da secao do Code da wo0009). Garanta UMA linha em branco entre o fim atual e o texto abaixo.

**Texto:**

````

## Conversa 1 — chat (planejamento, continuação)

### Feito
- Conferidos os relatórios da wo0009 (`a51ac58` + wrap `a2c55d9`): batem com o git. Roteiro v13.5.1 do autor: todos ok.
- Análise da F10 (`meta/analises/261106-ANALISE-busca-atalhos-arrastar.md`) medida e decidida com o autor (1a, 2a, 3a, 4a). Ideia nova do autor: arrastar o JSON para a tela.
- Escrita a wo0010 (v13.6, DEC-024): busca sem acento por palavras, trecho na tabela, termo levado ao filtro de blocos, atalhos, arrastar para importar. Smoke +21 (101). Verificado no container: smoke 101/0, history 52/0, sintaxe; dez mutantes, todos pegos; Chromium de ponta a ponta (cada atalho, o filtro herdado, o arrastar de arquivo, de texto e de extensão errada), nenhum erro de JS.

### Decisões
- DEC-024. Medido antes de decidir: a busca já alcançava o conteúdo (ROADMAP e IDEAS estavam defasados); `funcao` não achava «função»; `Ctrl+N` reservado pelo navegador; `P` capturando `Ctrl+P`; o Ctrl+F do navegador já acha texto em `textarea`.
- Memória do texto dobrado que confere a fonte a cada uso, em vez de cache invalidado: medido no teto (775 entradas), a busca caiu de ~100 ms para ~17 ms de JS por tecla.

### Bugs
- Achado no teste: com o filtro de blocos ativo, o bloco novo (vazio) nascia escondido — já acontecia pelo botão; corrigido junto (limpa o filtro e avisa).

### Aprendizados / armadilhas
- O `\u0300-\u036f` escrito pelo assistente chegou ao arquivo como o próprio caractere combinante (duas vezes; heredoc com aspas não evita) — funcionava, mas ilegível. Pego antes de entregar por um pente que compara a contagem de caracteres U+0300–U+036F antes e depois; virou armadilha no CONTEXT.
- `renderTable` custa ~170–200 ms com 775 entradas mesmo sem busca: custo antigo, registrado no IDEAS como ideia com gatilho.
````

## Edicao 40 — `logs/2026-11-06.md` · secao do Code

Acrescente no FIM do arquivo (depois da Edicao 39) `## Conversa 1 — Code (execucao, wo0010)` com o seu relatorio resumido.

---

## Fora de escopo

- `STORAGE_KEY = 'base_v4'`: NAO mexer.
- Espera entre teclas na busca (debounce), paginacao ou virtualizacao da tabela: so registradas no IDEAS, NAO fazer.
- Destaque dentro das caixas de texto: NAO (o Ctrl+F do navegador cobre).
- Frase exata entre aspas, operadores, regex na busca: NAO.

## Armadilhas desta WO

- **Escapes `\u0300-\u036f`:** a Edicao 8 (funcoes da busca), que os contem, tem de gravar a barra invertida e o `u` como TEXTO. Se a sua ferramenta transformar em caractere, a conferencia abaixo (`grep -c` dos escapes e o script de combinantes) pega.
- Edicoes 14 e 15: o `handleImport` antigo vira dois — `handleImport(ev)` (le o input e zera o `value`) e `importFile(file)` (o resto). A Edicao 15 tira o `ev.target.value = '';` do fim do antigo; as duas andam juntas.
- Edicao 18: as constantes `emCampo`/`edAberto`/`modalAberto` sao declaradas no corpo do `keydown`; o bloco do `Ctrl+Z` mais abaixo declara as suas proprias (`el`, `digitando`, `editorAberto`) dentro do `if` — nomes diferentes de proposito.
- O smoke extrai as funcoes por nome com `extractFunction`; a `foldMemo` (constante, nao funcao) e declarada no proprio teste.
- Teste de `Alt` no Chromium do container nao vale pelo Windows (la o `Alt` sozinho ativa a barra do navegador): fica com o roteiro do autor.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado.

- [ ] `git status --short` -> exatamente `M` em: `README.md index.html logs/2026-11-06.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/smoke.mjs`, e `??` em `meta/analises/261106-ANALISE-busca-atalhos-arrastar.md` e nesta WO. Nada alem.
- [ ] smoke `101 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · sintaxe `SINTAXE_OK` (comando abaixo) · `wc -l index.html` -> `4051` · `sha1sum index.html` -> `7c3328e71a926421cc31040aed7ae1f875080ada`.
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"`
- [ ] **Escapes intactos:** `grep -c 'u0300-' index.html` -> **3** (eram 1) · caracteres combinantes literais: `node -e "const t=require('fs').readFileSync('index.html','utf8');console.log((t.match(/[\u0300-\u036f]/g)||[]).length)"` -> **0**.
- [ ] Ocorrencias no `index.html` (`grep -oF "..." index.html | wc -l`): `function foldText(` 1 · `function foldOf(` 1 · `function entryMatches(` 1 · `function blockMatches(` 1 · `function searchSnippet(` 1 · `function searchHit(` 1 · `function siblingBlockIndex(` 1 · `function carrySearchIntoEditor(` 1 · `function focusSiblingBlock(` 1 · `function isTypingTarget(` 1 · `function titleHtml(` 1 · `function hitHtml(` 1 · `function importFile(` 1 · `id="shortcutsModal"` 1 · `id="dropOverlay"` 1 · `carrySearchIntoEditor();` 1 · `importFile(file);` 1 · `importFile(f);` 1 · `'shortcutsModal'` 4 · `e.key === 'n')` **0** (o `Ctrl+N` saiu) · `base_v4` **1**.
- [ ] Smoke: `grep -c "check('busca\|check('trecho\|check('Alt+setas" tests/smoke.mjs` -> 21.
- [ ] Docs: `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.6.0] — 2026-11-06`, `## [13.5.1] — 2026-11-06` · `grep -c "^## DEC-024" meta/DECISIONS.md` -> 1 · `grep -c "^\*\*Lunoda v13.6\*\*" meta/STATUS.md` -> 1 · `grep -c "101 asserções" tests/README.md` -> 1 · `grep -c "F10 — Navegação em acervo grande \*(concluída" meta/ROADMAP.md` -> 1 · `grep -c "" meta/STATUS.md meta/IDEAS.md meta/DECISIONS.md meta/ROADMAP.md logs/2026-11-06.md` -> 61 · 249 · 535 · 89 · 63 (o log, ANTES da secao do Code).
- [ ] **Teste no navegador — NAO e seu.** O autor passa o roteiro v13.6.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0010.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/smoke.mjs tests/README.md README.md meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md logs/2026-11-06.md meta/analises/261106-ANALISE-busca-atalhos-arrastar.md meta/workorders/261106-wo0010-v13-6-busca-atalhos-arrastar.md
```

```
git commit -m "feat: busca sem acento com trecho, atalhos de teclado e arrastar para importar" -m "v13.6, DEC-024. Busca por palavras ignorando acento, trecho destacado na tabela e termo levado ao filtro de blocos (que agora procura no conteudo). Atalhos / N P ? e Alt+setas/Alt+Enter; Ctrl+N morto saiu e P nao captura mais Ctrl+P. Soltar .json ou .md na janela importa. Smoke com 21 assercoes novas (101)."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-06 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
