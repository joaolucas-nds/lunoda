# WO 0006 — v13.4: reimportar o Markdown exportado (F9 parte 2) + registro

> **Tipo:** mista — CODIGO (`index.html`, `tests/smoke.mjs`, `tests/README.md`) + REGISTRO (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, log do dia).
> **Config sugerida:** Sonnet, `/effort` medio. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD em `8f2e2dc`; `sha1sum index.html` = `ed49df9621887220186a201b9b1145b51cf51c4f`; arvore limpa exceto os 4 arquivos gravados pelo chat (hashes abaixo; `meta/analises/` e pasta NOVA, nao rastreada) e esta WO. ANTES de aplicar: `node tests/smoke.mjs` 28/0 e `node tests/history.mjs` 52/0.
> **Base:** analise `meta/analises/261104-ANALISE-reimportar-md.md`, decidida pelo autor em 2026-11-04: opcao B; entrada que ja existe -> perguntar na previa; lembrete de backup JSON no backlog; F5 adiada. Registrada como DEC-022.
> **Depende de:** wo0005 (aplicada, `e40b37a`). **A wo0007 (faxina) depende DESTA:** aplique esta primeiro.
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e o log. A analise, o modelo de analise, CONTEXT e GLOSSARY o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** `/apply-wo meta/workorders/261104-wo0007-faxina-prefixos-roadmap-ideas.md`

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
bec9fff5532827632d7c2581a0261c81f12fb7d9  meta/analises/261104-ANALISE-reimportar-md.md
aefb86bbd73bb754704f461d015ee31821c7a504  meta/CONTEXT.md
12b562b1cdc8e450c70e4a383b766b7f9b4afde3  meta/GLOSSARY.md
34bf231057d93f82c024cb073b16958de276788c  meta/analises/_TEMPLATE.md
```

**Ancoras lidas em:** cada ancora foi RECORTADA por script dos arquivos do repositorio copiados do disco em 2026-11-04 ~12:40 (HEAD `8f2e2dc`, `index.html` com o sha1 acima) e conferida com `count == 1`. O trecho literal e o proprio bloco «Ancora» de cada edicao. A WO inteira foi simulada numa copia aplicando as edicoes lidas DESTE arquivo.

---

## 1. Por que

F9 parte 2: o `.md` que o autor guarda nao voltava para o app — so o JSON. A analise mediu que o formato da DEC-008 ja devolve quase tudo; esta WO entrega o leitor, a linha `DADOS` que fecha a perda de data e IDs, a previa e o registro.

## 2. Contexto factual

- **Medido no `index.html` (`8f2e2dc`):** `handleImport` so faz `JSON.parse`; `accept=".json"`; `entryToMD` escreve `<!-- ENTRADA -->`, `**ID:**`, datas por `fmtDate` (minuto, fuso local), `<!-- BLOCO n -->` e os delimitadores de conteudo; propriedades por nome, unidas por ` · `.
- **Medido (analise):** leitor-prototipo devolve titulo, descricao, ID, blocos, subtitulo, versao e conteudo exatos da fixture hostil; propriedade chamada «ID» colide no corpo; export real do autor de 05/07 tem 1 `<!-- ENTRADA -->`, 3 linhas `# ` e 0 delimitadores.
- **Medido na simulacao:** smoke 46/0 (28 + 18), history 52/0, sintaxe OK, `index.html` 3.435 -> 3.661 linhas. Prova de vida: smoke novo contra o `index.html` antigo aborta («funcao nao encontrada: mdDados»); mutante «ID sem posicao» 41 ok / 5 falhas; mutante «export sem DADOS» 44 ok / 2 falhas.
- **Medido em Chromium headless** (copia com as edicoes de codigo DESTA WO): exportar pelo botao Markdown (6 linhas `DADOS`) -> importar o arquivo numa base vazia -> previa «2 entrada(s), 4 bloco(s)… Propriedade(s) nova(s): Tags, IA Utilizada» -> Importar -> IDs, titulos, descricoes, datas, blocos, conteudo e propriedades por nome **identicos** ao original, gravados no `localStorage`; reimportar na mesma base -> previa «2 entrada(s) ja existe(m)» com Pular/Copia; Copia -> 4 entradas, 2 com «(cópia)»; arquivo pre-v12.1 -> mensagem de recusa, botao Importar oculto; `.json` continua importando; nenhum erro de JS.
- **Artefato da fixture, nao defeito:** a 2a entrada da fixture tem propriedades de ENTRADA sem correspondencia nos blocos; o import recalcula a entrada como uniao dos blocos (DEC-003), entao ela volta sem elas. Em dado real a entrada ja e essa uniao.
- **Nao medido:** os `.md` reais do autor e o Chrome dele — roteiro do autor.

## Inventario

25 edicoes com ancora + 1 de log (fim do arquivo) + 1 do Code, em 11 arquivos. Codigo: 8 edicoes no `index.html` (export: 2 linhas `DADOS`; import: `accept`, desvio no `handleImport`, modal, fechar ao clicar fora, funcoes, CSS). Os pontos de export sairam de `grep -n "<!-- ENTRADA -->\|<!-- BLOCO" index.html` (1 cada, so no `entryToMD`); os de import, de `grep -n "importFile\|handleImport" index.html`.

---

## Edicao 0 — conferir hashes e baseline

`sha1sum index.html` = `ed49df9621887220186a201b9b1145b51cf51c4f`, e `sha1sum -c` nas 4 linhas acima -> `OK`. `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`; `node tests/history.mjs` -> `52 ok, 0 falha(s)`. Qualquer divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · export: linha DADOS da entrada

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
  md += `<!-- ENTRADA -->\n`;
````

**Substituir por:**

````
  md += `<!-- ENTRADA -->\n`;
  // Dados exatos para a reimportação (DEC-022): comentário, invisível no render.
  // Fecha o que o corpo perde (data com segundos e fuso). Nenhum marcador existente muda.
  md += `<!-- DADOS ${mdDados({ id: e.id || '', criado: e.createdAt || '', modificado: e.updatedAt || '' })} -->\n`;
````

## Edicao 2 — `index.html` · export: linha DADOS do bloco

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
    md += `<!-- BLOCO ${num} -->\n`;
````

**Substituir por:**

````
    md += `<!-- BLOCO ${num} -->\n`;
    md += `<!-- DADOS ${mdDados({ id: b.id || '' })} -->\n`;
````

## Edicao 3 — `index.html` · import aceita .md

**Forma:** Substituir.

**Ancora:**

````
<input type="file" id="importFile" accept=".json" style="display:none" onchange="handleImport(event)">
````

**Substituir por:**

````
<input type="file" id="importFile" accept=".json,.md,.markdown" style="display:none" onchange="handleImport(event)">
````

## Edicao 4 — `index.html` · modal da previa do import .md

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
<div class="modal-bg" id="addPropModal">
````

**Substituir por:**

````
<!-- Prévia da importação de Markdown (DEC-022): nada é gravado antes do «Importar» -->
<div class="modal-bg" id="mdImportModal">
  <div class="modal" style="width:540px;max-width:95vw">
    <h3>Importar Markdown</h3>
    <div id="mdImportBody" class="md-imp-body"></div>
    <div class="modal-foot">
      <button class="btn btn-ghost" onclick="closeModal('mdImportModal')">Cancelar</button>
      <button class="btn btn-primary" id="mdImportGo" onclick="confirmMdImport()">Importar</button>
    </div>
  </div>
</div>

<div class="modal-bg" id="addPropModal">
````

## Edicao 5 — `index.html` · handleImport desvia o .md para o leitor proprio

**Forma:** Substituir.

**Ancora:**

````
  reader.onload = e => {
    try {
      let data = JSON.parse(e.target.result);
````

**Substituir por:**

````
  reader.onload = e => {
    // .md exportado pelo Lunoda: leitor próprio, com prévia e só mesclar (DEC-022)
    if (/\.(md|markdown)$/i.test(file.name)) { startMdImport(e.target.result, file.name); return; }
    try {
      let data = JSON.parse(e.target.result);
````

## Edicao 6 — `index.html` · previa fecha ao clicar fora

**Forma:** Substituir.

**Ancora:**

````
['exportModal','addPropModal','unsavedModal','blockTransferModal'].forEach(id => {
````

**Substituir por:**

````
['exportModal','addPropModal','unsavedModal','blockTransferModal','mdImportModal'].forEach(id => {
````

## Edicao 7 — `index.html` · funcoes do import .md

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
function openImport() { document.getElementById('importFile').click(); }
````

**Substituir por:**

````
/* ──────────────────────────────
   REIMPORTAR MARKDOWN (F9 parte 2 — DEC-022; análise em meta/analises/261104-ANALISE-reimportar-md.md)
   Lê o .md que o próprio app exporta (v12.1+), pelos marcadores — nunca pelo texto livre.
   Só MESCLA: o .md não leva cores nem a adição automática; o backup completo é o JSON.
────────────────────────────── */

/* Objeto -> JSON seguro dentro de comentário HTML (um "-->" no valor fecharia o comentário). */
function mdDados(o) {
  return JSON.stringify(o).replace(/-->/g, '--\\u003e');
}

/* "22/05/26 13:24" (fmtDate, hora local) -> ISO. Cai aqui só quando falta a linha DADOS. */
function mdDateToISO(txt) {
  const m = String(txt || '').match(/^(\d{2})\/(\d{2})\/(\d{2,4})\s+(\d{2}):(\d{2})/);
  if (!m) return '';
  const ano = m[3].length === 2 ? 2000 + parseInt(m[3], 10) : parseInt(m[3], 10);
  const d = new Date(ano, parseInt(m[2], 10) - 1, parseInt(m[1], 10), parseInt(m[4], 10), parseInt(m[5], 10));
  return isNaN(d) ? '' : d.toISOString();
}

/* Lê o texto do .md e devolve { erro, entries, invalidas, avisos } — PURA, sem db nem DOM.
   Regras: marcadores mandam; campo de formato vale pela POSIÇÃO (o primeiro é o campo,
   um repetido é propriedade com o mesmo nome — ex.: uma propriedade chamada «ID»);
   conteúdo é o que está entre os delimitadores, byte a byte; entrada cujo nº de blocos
   não bate com «Total de blocos», ou com bloco sem fim, é recusada inteira. */
function parseLunodaMD(txt) {
  const L = String(txt).replace(/\r\n?/g, '\n').split('\n');
  const res = { erro: null, entries: [], invalidas: 0, avisos: [] };
  let i = 0;
  const fm = {};
  if (L[0] === '---') {   // frontmatter: só pares simples; usado para as datas do export de UMA entrada
    for (i = 1; i < L.length && L[i] !== '---'; i++) {
      const m = L[i].match(/^([a-z0-9_]+):\s*"?(.*?)"?\s*$/); if (m) fm[m[1]] = m[2];
    }
    i++;
  }
  if (!L.includes('<!-- ENTRADA -->')) {
    res.erro = 'Este arquivo não parece um Markdown exportado pelo Lunoda (falta o marcador <!-- ENTRADA -->).';
    return res;
  }
  if (!L.some(l => l.startsWith('<!-- CONTEUDO:INICIO'))) {
    res.erro = 'Markdown exportado antes da v12.1: sem os delimitadores de conteúdo não dá para separar o texto da estrutura com segurança. Reexporte pelo app (os dados ainda estão nele) ou use o JSON.';
    return res;
  }
  const campo = l => { const m = l.match(/^\*\*(.+?):\*\* (.*?)\s*$/); return m ? [m[1], m[2]] : null; };
  const dados = l => { const m = l.match(/^<!-- DADOS (.*) -->$/); if (!m) return null; try { return JSON.parse(m[1]); } catch (_) { return null; } };
  let titulo = null, desc = [];
  for (; i < L.length; i++) {
    const l = L[i];
    if (l.startsWith('# ')) { titulo = l.slice(2); desc = []; continue; }
    if (l.startsWith('> ') || l === '>') { desc.push(l.replace(/^> ?/, '')); continue; }
    if (l === '<!-- ENTRADA -->') {
      const e = { title: titulo ?? '', description: '', id: '', criado: '', modificado: '',
                  criadoTxt: '', modificadoTxt: '', total: null, blocks: [], quebrada: false };
      if (desc.length) { desc[0] = desc[0].replace(/^\*\*Descrição\/Resumo:\*\* ?/, ''); e.description = desc.join('\n'); }
      let viuDados = false, viuId = false, viuC = false, viuM = false;
      for (i++; i < L.length && !L[i].startsWith('━'); i++) {
        const d = dados(L[i]);
        if (d && !viuDados) { viuDados = true; e.id = d.id || ''; e.criado = d.criado || ''; e.modificado = d.modificado || ''; continue; }
        const c = campo(L[i]); if (!c) continue;
        if (c[0] === 'ID' && !viuId) { viuId = true; if (!e.id) e.id = c[1].replace(/^`|`$/g, ''); }   // DADOS manda; **ID:** é a reserva
        else if (c[0] === 'Criado em' && !viuC) { viuC = true; e.criadoTxt = c[1]; }
        else if (c[0] === 'Modificado em' && !viuM) { viuM = true; e.modificadoTxt = c[1]; }
        else if (c[0] === 'Total de blocos' && e.total === null) e.total = parseInt(c[1], 10);
      }
      if (e.id === '—') e.id = '';
      res.entries.push(e); titulo = null; desc = []; continue;
    }
    const bm = l.match(/^<!-- BLOCO (\d+) -->$/);
    if (bm && res.entries.length) {
      const n = bm[1], e = res.entries[res.entries.length - 1];
      const b = { id: '', subtitle: '', version: 1, props: {}, content: '' };
      let viuS = false, viuV = false, fechou = false;
      for (i++; i < L.length && L[i] !== `<!-- CONTEUDO:INICIO bloco=${n} -->`; i++) {
        const d = dados(L[i]); if (d && !b.id) { b.id = d.id || ''; continue; }
        const c = campo(L[i]); if (!c) continue;
        // Subtítulo só vale antes da Versão: depois dela, é propriedade com esse nome
        if (c[0] === 'Subtítulo' && !viuS && !viuV) { viuS = true; b.subtitle = c[1]; }
        else if (c[0] === 'Versão' && !viuV) { viuV = true; b.version = parseInt(c[1].replace(/^v/, ''), 10) || 1; }
        else b.props[c[0]] = c[1].split(' · ').map(x => x.trim()).filter(Boolean);
      }
      const corpo = [];
      for (i++; i < L.length; i++) {
        if (L[i] === `<!-- CONTEUDO:FIM bloco=${n} -->`) { fechou = true; break; }
        corpo.push(L[i]);
      }
      if (!fechou) { e.quebrada = true; res.avisos.push(`«${e.title}», bloco ${n}: falta o fim do conteúdo.`); continue; }
      b.content = corpo.join('\n');
      if (b.content === '*(vazio)*') b.content = '';
      e.blocks.push(b);
    }
  }
  const unica = res.entries.length === 1;
  res.entries = res.entries.filter(e => {
    if (e.quebrada || e.total !== e.blocks.length) {
      res.invalidas++;
      if (!e.quebrada) res.avisos.push(`«${e.title}»: o arquivo declara ${e.total} bloco(s) e foram lidos ${e.blocks.length} — entrada recusada.`);
      return false;
    }
    // Datas: linha DADOS > frontmatter (export de uma entrada) > texto do corpo (perde segundos)
    if (!e.criado) e.criado = (unica && fm.created && (!fm.id || fm.id === e.id)) ? fm.created : mdDateToISO(e.criadoTxt);
    if (!e.modificado) e.modificado = (unica && fm.updated && (!fm.id || fm.id === e.id)) ? fm.updated : mdDateToISO(e.modificadoTxt);
    return true;
  });
  return res;
}

/* Monta o plano de importação sobre o db atual, SEM gravar: propriedades e opções por NOME
   (cria as que faltam, com cor nova), entradas no formato do db, e separa as que já existem. */
function planMdImport(parsed) {
  const props = JSON.parse(JSON.stringify(db.properties));
  const propsNovas = [], optsNovas = [];
  const optId = (pNome, oNome) => {
    let p = props.find(x => x.name.trim() === pNome.trim());
    if (!p) { p = { id: uid(), name: pNome.trim(), options: [] }; props.push(p); propsNovas.push(p.name); }
    let o = p.options.find(x => x.name.trim() === oNome.trim());
    if (!o) { o = { id: uid(), name: oNome.trim(), colorId: randColor() }; p.options.push(o); optsNovas.push(`${p.name}: ${o.name}`); }
    return [p.id, o.id];
  };
  const existe = new Set(db.entries.map(e => e.id));
  const novas = [], existentes = [];
  let blocos = 0;
  parsed.entries.forEach(pe => {
    const blocks = pe.blocks.map(pb => {
      const bp = {};
      Object.entries(pb.props).forEach(([pn, ons]) => ons.forEach(on => {
        const [pid, oid] = optId(pn, on);
        (bp[pid] = bp[pid] || []).includes(oid) || bp[pid].push(oid);
      }));
      return { id: pb.id || uid(), subtitle: pb.subtitle, version: pb.version, content: pb.content, blockProps: bp };
    });
    blocos += blocks.length;
    const pv = {};
    blocks.forEach(b => Object.entries(b.blockProps).forEach(([pid, oids]) =>
      oids.forEach(oid => { (pv[pid] = pv[pid] || []).includes(oid) || pv[pid].push(oid); })));
    const agora = new Date().toISOString();
    const ent = { id: pe.id || uid(), title: pe.title, description: pe.description,
      propertyValues: pv, propertyAutoFlags: {}, blocks,
      createdAt: pe.criado || agora, updatedAt: pe.modificado || pe.criado || agora };
    (existe.has(ent.id) ? existentes : novas).push(ent);
  });
  return { props, propsNovas, optsNovas, novas, existentes, blocos };
}

/* Grava o plano. modo para as que já existem: 'pular' | 'copia' (ids novos e « (cópia)» no título). */
function applyMdImport(plan, modo) {
  const copias = modo === 'copia' ? plan.existentes.map(e => ({
    ...e, id: uid(), title: `${e.title} (cópia)`,
    blocks: e.blocks.map(b => ({ ...b, id: uid() })) })) : [];
  db.properties = plan.props;
  db.entries = [...db.entries, ...plan.novas, ...copias];
  return { novas: plan.novas.length, copias: copias.length, puladas: modo === 'copia' ? 0 : plan.existentes.length };
}

let mdImportPlan = null;

/* Lê o arquivo e abre a prévia. Nada é gravado aqui. */
function startMdImport(txt, nome) {
  const parsed = parseLunodaMD(txt);
  const body = document.getElementById('mdImportBody');
  const go = document.getElementById('mdImportGo');
  mdImportPlan = null;
  if (parsed.erro || parsed.entries.length === 0) {
    body.innerHTML = `<p class="md-imp-erro">${esc(parsed.erro || 'Nenhuma entrada válida no arquivo.')}</p>`
      + (parsed.avisos.length ? `<ul class="md-imp-avisos">${parsed.avisos.map(a => `<li>${esc(a)}</li>`).join('')}</ul>` : '');
    go.style.display = 'none';
    openModal('mdImportModal'); return;
  }
  const plan = planMdImport(parsed);
  mdImportPlan = plan;
  const n = parsed.entries.length;
  let html = `<p><b>${esc(nome)}</b>: ${n} entrada(s), ${plan.blocos} bloco(s).</p><ul class="md-imp-lista">`;
  html += `<li>${plan.novas.length} entrada(s) nova(s)</li>`;
  if (plan.propsNovas.length) html += `<li>Propriedade(s) nova(s): ${plan.propsNovas.map(esc).join(', ')}</li>`;
  if (plan.optsNovas.length) html += `<li>Opção(ões) nova(s), com cor nova: ${plan.optsNovas.map(esc).join(', ')}</li>`;
  if (parsed.invalidas) html += `<li class="md-imp-aviso">${parsed.invalidas} entrada(s) recusada(s) — ver abaixo</li>`;
  html += `</ul>`;
  if (plan.existentes.length) {
    html += `<div class="md-imp-dup"><p>${plan.existentes.length} entrada(s) já existe(m) no app (mesmo ID): `
      + plan.existentes.slice(0, 5).map(e => `«${esc(e.title)}»`).join(', ') + (plan.existentes.length > 5 ? '…' : '') + `</p>`
      + `<label><input type="radio" name="mdDup" value="pular" checked> Pular — manter a do app como está</label>`
      + `<label><input type="radio" name="mdDup" value="copia"> Importar como cópia nova — «(cópia)» no título</label></div>`;
  }
  if (parsed.avisos.length) html += `<ul class="md-imp-avisos">${parsed.avisos.map(a => `<li>${esc(a)}</li>`).join('')}</ul>`;
  html += `<p class="md-imp-nota">Só mescla — nada do que já existe é apagado. O Markdown não leva cores nem a adição automática; para um backup completo, use o JSON.</p>`;
  body.innerHTML = html;
  go.style.display = '';
  openModal('mdImportModal');
}

function confirmMdImport() {
  if (!mdImportPlan) { closeModal('mdImportModal'); return; }
  const modo = (document.querySelector('input[name="mdDup"]:checked') || {}).value || 'pular';
  const r = applyMdImport(mdImportPlan, modo);
  mdImportPlan = null;
  closeModal('mdImportModal');
  saveDB(); renderSidebar(); renderTableHead(); renderTable();
  showToast(`${r.novas + r.copias} entrada(s) importada(s)` + (r.copias ? ` (${r.copias} como cópia)` : '') + (r.puladas ? ` · ${r.puladas} pulada(s)` : ''));
}

function openImport() { document.getElementById('importFile').click(); }
````

## Edicao 8 — `index.html` · CSS da previa

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
.ta-def-dot { display: inline-block; width: 3px; height: 3px; border-radius: 50%;
````

**Substituir por:**

````
/* Prévia do import de Markdown (DEC-022) */
.md-imp-body { font-size: 13px; color: var(--text); line-height: 1.6; margin-bottom: 6px; }
.md-imp-body p { margin-bottom: 8px; }
.md-imp-lista, .md-imp-avisos { margin: 0 0 10px 18px; }
.md-imp-avisos li, .md-imp-aviso, .md-imp-erro { color: var(--yellow); }
.md-imp-dup { border: 1px solid var(--border); border-radius: var(--rs); padding: 8px 10px; margin-bottom: 10px; }
.md-imp-dup label { display: block; cursor: pointer; margin-top: 4px; }
.md-imp-nota { font-size: 12px; color: var(--text-muted); }
.ta-def-dot { display: inline-block; width: 3px; height: 3px; border-radius: 50%;
````

## Edicao 9 — `tests/smoke.mjs` · smoke recorta mdDados (o entryToMD passa a chama-la)

**Forma:** Substituir.

**Ancora:**

````
const NEEDED = ['fmtDate', 'getBlockEffectivePropsSaved', 'entryToMD'];
````

**Substituir por:**

````
// mdDados: desde a v13.4 o entryToMD escreve a linha <!-- DADOS … --> (DEC-022).
const NEEDED = ['fmtDate', 'getBlockEffectivePropsSaved', 'mdDados', 'entryToMD'];
````

## Edicao 10 — `tests/smoke.mjs` · secao de ida e volta do Markdown

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ── Relatório ──────────────────────────────────────────────── */
````

**Substituir por:**

````
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
  }
}

/* ── Relatório ──────────────────────────────────────────────── */
````

## Edicao 11 — `tests/README.md` · README: cobertura do smoke

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
`entryToMD()` — a geração do Markdown exportado — e, desde a v12.3, o **frontmatter YAML**. Foi escolhida primeiro porque é onde o defeito é mais caro e menos visível: um export corrompido só aparece quando o usuário vai reler o arquivo, possivelmente meses depois.
````

**Substituir por:**

````
`entryToMD()` — a geração do Markdown exportado — e, desde a v12.3, o **frontmatter YAML**. Foi escolhida primeiro porque é onde o defeito é mais caro e menos visível: um export corrompido só aparece quando o usuário vai reler o arquivo, possivelmente meses depois.

Desde a v13.4, a **ida e volta do Markdown** (DEC-022): o smoke exporta a fixture hostil com o `entryToMD` real, relê com o `parseLunodaMD` real e compara campo a campo (título, descrição, IDs, datas, blocos, conteúdo, propriedades por nome); cobre também o export sem a linha `DADOS` (v12.1–v13.3), CRLF, as recusas (pré-v12.1, arquivo estranho, total de blocos divergente) e pular × cópia. 46 asserções no total.
````

## Edicao 12 — `meta/DECISIONS.md` · DEC-022 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
Implementado em `setBlockVersion()`, chamado por `syncVer` (campo) e `adjVer` (−/+), na lista do embrulho do undo. Coberto pela seção 13 do `tests/history.mjs`.
````

**Substituir por:**

````
Implementado em `setBlockVersion()`, chamado por `syncVer` (campo) e `adjVer` (−/+), na lista do embrulho do undo. Coberto pela seção 13 do `tests/history.mjs`.

---

## DEC-022 — Reimportar o `.md`: leitor pelos marcadores, linha DADOS no export, prévia, só mesclar
**Data:** 2026-11-04 · **Status:** aceita · análise: `meta/analises/261104-ANALISE-reimportar-md.md`

### Contexto
Só o JSON reimportava. A análise mediu, com um leitor-protótipo sobre o export real da fixture hostil, que o formato da DEC-008 já devolve título, descrição, ID, blocos, subtítulo, versão e conteúdo exatos; perdiam-se a data (o corpo tem minuto e fuso local), as cores e a adição automática. Achou também que uma propriedade com nome de campo do formato (ex.: «ID») colide no corpo, e mediu que o export real do autor de 05/07 (pré-v12.1) não tem delimitadores.

### Decisão
Opção B da análise, aprovada pelo autor:
- **Leitor pelos marcadores** (`parseLunodaMD`, pura): campo de formato vale pela posição (o primeiro é o campo); conteúdo é o que está entre os delimitadores; entrada com total de blocos divergente ou bloco sem fim é recusada inteira.
- **Linha `<!-- DADOS {json} -->`** depois de `<!-- ENTRADA -->` (id e datas ISO) e de cada `<!-- BLOCO n -->` (id) — comentário, invisível no render; nenhum marcador existente mudou. Sem ela (exports v12.1–v13.3), a data cai para o frontmatter de entrada única ou para o texto do corpo.
- **Prévia antes de gravar** (entradas, blocos, propriedades e opções novas, avisos) e **só mesclar**. Entrada que já existe (mesmo ID): **a prévia pergunta** — pular (padrão) ou importar como cópia nova, com «(cópia)» no título.
- Propriedades e opções **por nome**; as que faltam são criadas com cor nova.
- **Pré-v12.1 é recusado** com mensagem: reexportar pelo app resolve.

### Alternativas consideradas
- **A (sem a linha DADOS)** — perderia segundos e fuso da data e os ids de bloco.
- **C (JSON completo no comentário)** — dobra o arquivo e polui o modo edição do Obsidian; o JSON já é o backup completo.
- **E (leitor heurístico pré-v12.1)** — o arquivo real tem `#` e `---` dentro do conteúdo; reexportar resolve sem risco.

### Consequências
O `.md` vira caminho de recuperação e de volta do Obsidian. Continuam fora do `.md`: cores e adição automática (vêm do JSON). O formato do export agora é contrato do leitor: mudar marcador ou campo exige mudar `parseLunodaMD` e o teste de ida e volta do smoke.
````

## Edicao 13 — `meta/CHANGELOG.md` · [13.4.0] acima da 13.3

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.3.0] — 2026-11-04
````

**Substituir por:**

````
## [13.4.0] — 2026-11-04

### Adicionado
- **Reimportar o Markdown exportado** (F9 parte 2, DEC-022): o botão Importar aceita `.md`. Uma **prévia** mostra entradas, blocos, propriedades e opções novas e avisos antes de gravar; só mescla; entrada que já existe pode ser pulada ou importada como cópia. Exports anteriores à v12.1 são recusados com explicação.
- Linha `<!-- DADOS … -->` no Markdown exportado (invisível no render), com IDs e datas exatas para a reimportação.
- `tests/smoke.mjs` cobre a ida e volta do Markdown (18 asserções novas, 46 no total).

## [13.3.0] — 2026-11-04
````

## Edicao 14 — `meta/IDEAS.md` · Adiadas: F5

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **Esquerdo sem seleção = marcar em todos os blocos da entrada** (opção (c) da C2) — adiada porque, no hábito antigo, o clique que ligava o automático viraria marcação em massa — **volta quando** o autor notar que, mesmo com o quadrado geral da v13.1 (DEC-016), ainda marca todos os blocos com frequência só para aplicar uma propriedade.
````

**Substituir por:**

````
- **Esquerdo sem seleção = marcar em todos os blocos da entrada** (opção (c) da C2) — adiada porque, no hábito antigo, o clique que ligava o automático viraria marcação em massa — **volta quando** o autor notar que, mesmo com o quadrado geral da v13.1 (DEC-016), ainda marca todos os blocos com frequência só para aplicar uma propriedade.
- **Herança entre versões + botão do meio (F5, conflito C3)** — adiada por decisão do autor em 2026-11-04: é a de maior risco e reintroduz estado por nome de bloco (DEC-003) — **volta quando** aparecer um caso concreto em que propagar uma propriedade entre versões à mão custe tempo de verdade.
````

## Edicao 15 — `meta/IDEAS.md` · Concluidas: reimportar md

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Reordenação por número de versão (empurrão)**
````

**Substituir por:**

````
## ✅ Concluídas

- **Reimportar o `.md` exportado** — v13.4 / DEC-022. Fecha a F9 parte 2.
- **Reordenação por número de versão (empurrão)**
````

## Edicao 16 — `meta/IDEAS.md` · ideia nova: lembrete de backup JSON

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
### 2026-07-19 — Undo/redo no editor
````

**Substituir por:**

````
### 2026-11-04 — Lembrete de backup JSON
Os dados vivem só no `localStorage` de um navegador: limpar o navegador apaga tudo. Mostrar «último backup JSON há N dias» e um botão de backup rápido ataca esse risco com custo baixo (opção D da análise da F9 parte 2). Aprovado pelo autor para o backlog.

### 2026-07-19 — Undo/redo no editor
````

## Edicao 17 — `meta/ROADMAP.md` · F9: reimportar entregue

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Reimportar `.md`** (hoje só o JSON reimporta) — único item grande restante da fase; viável agora que o conteúdo é delimitado (DEC-008) e os metadados vão em YAML (DEC-011).
````

**Substituir por:**

````
- [x] **Reimportar `.md`** — v13.4 (DEC-022): leitor pelos marcadores, linha `DADOS`, prévia, só mesclar.
````

## Edicao 18 — `meta/ROADMAP.md` · F5: adiada pelo autor

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Maior risco de complexidade (conflito C3 no IDEAS). Tratar isolada, com protótipo antes de integrar.
````

**Substituir por:**

````
- Maior risco de complexidade (conflito C3 no IDEAS). Tratar isolada, com protótipo antes de integrar.
> **Adiada por decisão do autor (2026-11-04)** — gatilho em IDEAS, «Adiadas».
````

## Edicao 19 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.3** — 2026-11-04 — empurrão de versão (F6). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 52/52 (rodada da wo0005).
````

**Substituir por:**

````
**Lunoda v13.4** — 2026-11-04 — reimportar o Markdown exportado (F9 parte 2). Arquivo canônico `index.html`. Testes: `smoke` 46/46 e `history` 52/52 (rodada da wo0006).
````

## Edicao 20 — `meta/STATUS.md` · funcionando: import md

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Empurrão de versão: número ocupado no mesmo subtítulo renumera os vizinhos; −/+ troca; coberto pelo undo (v13.3).
````

**Substituir por:**

````
- Empurrão de versão: número ocupado no mesmo subtítulo renumera os vizinhos; −/+ troca; coberto pelo undo (v13.3).
- Importar `.md` exportado pelo app: prévia, só mescla, pular ou copiar o que já existe; recusa exports pré-v12.1 (v13.4).
````

## Edicao 21 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.3 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-04. v13.0, v13.1 e v13.2 já conferidas pelo autor (todos os itens ok).
````

**Substituir por:**

````
- **v13.4 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-04. v13.0 a v13.3 já conferidas pelo autor.
````

## Edicao 22 — `meta/STATUS.md` · backlog: conferencia

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.3 no navegador** (roteiro na conversa de 2026-11-04).
````

**Substituir por:**

````
- [ ] **Conferir a v13.4 no navegador** (roteiro na conversa de 2026-11-04).
````

## Edicao 23 — `meta/STATUS.md` · backlog: proximas

**Forma:** Substituir.

**Ancora:**

````
- [ ] **F9 parte 2 — reimportar `.md`**: começar pela **análise escrita** (`meta/analises/`) — próxima pela ordem combinada.
````

**Substituir por:**

````
- [ ] **Faxina** — `base_` → `lunoda_` nos arquivos exportados, títulos defasados do ROADMAP, higiene do IDEAS: wo0007, já escrita.
- [ ] **Lembrete de backup JSON** — «último backup há N dias» + botão rápido (IDEAS, 2026-11-04).
````

## Edicao 24 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-04** — Conferida a v13.2 (wo0004, `9fa7c5c`; roteiro do autor ok). Entregue a **F6 — empurrão de versão** (DEC-021) como **v13.3** pela wo0005 (`e40b37a`). Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03.
````

**Substituir por:**

````
**2026-11-04** — v13.2 e v13.3 conferidas pelo autor. Entregue a F6 (empurrão de versão, DEC-021) como v13.3 (`e40b37a`). Análise da F9 parte 2 medida e decidida (opção B, DEC-022); entregue como **v13.4** pela wo0006. F5 adiada pelo autor. Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03.
````

## Edicao 25 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.3 no navegador; depois a análise da F9 parte 2.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.4 no navegador; aplicar a wo0007 (faxina); depois o lembrete de backup JSON.
````

## Edicao 26 — `logs/2026-11-04.md` · secao do chat (continuacao)

**Forma:** ACRESCENTAR NO FIM DO ARQUIVO (sem ancora: o fim do log e da secao do wrap). Garanta UMA quebra de linha entre o fim atual e o texto abaixo.

**Texto:**

````

## Conversa 1 — chat (planejamento, continuação)

### Feito
- Conferido o relatório da wo0005 (`e40b37a` + wrap `8f2e2dc`); testes rodados pelo chat no repositório: smoke 28/0, history 52/0. Roteiro v13.3 do autor: todos ok.
- Panorama entregue ao autor (fases, ideias abertas, sugestões). Decidido: F5 adiada; lembrete de backup JSON no backlog; faxina aprovada.
- Análise da F9 parte 2 escrita com medição (leitor-protótipo sobre o export real da fixture; contagens no export real do autor de 05/07, sem ler o conteúdo). Achada a colisão «propriedade chamada ID» no corpo do `.md`. Autor aprovou a opção B e «perguntar na prévia» → DEC-022.
- Escrita a wo0006 (v13.4): linha `DADOS` no export, leitor `parseLunodaMD`, `planMdImport`/`applyMdImport`, prévia com pular × cópia, recusa pré-v12.1; smoke com ida e volta (18 asserções, 46 no total). Prova de vida: mutante «ID sem posição» 41/5, mutante «export sem DADOS» 44/2. Chromium, ponta a ponta pelo próprio app: exportar pelo botão → importar numa base vazia → **idêntico** (IDs, datas, blocos, conteúdo, propriedades por nome); reimportar na mesma base → prévia oferece pular/cópia; pré-v12.1 recusado; JSON segue importando; nenhum erro de JS.
- Escrita a wo0007 (faxina), simulada sobre o resultado da wo0006.

### Aprendizados / armadilhas
- Um teste meu terminava em `|| true` e passava sempre; pego na revisão antes de entregar. Teste que não pode falhar não testa.
- Mutante revelou fragilidade real: linha `DADOS` sem `id` apagaria o ID do corpo — corrigido (o `**ID:**` é a reserva).
````

## Edicao 27 — `logs/2026-11-04.md` · secao do Code

Depois da Edicao 26, acrescente no FIM do arquivo `## Conversa 1 — Code (execucao, wo0006)` com o seu relatorio resumido. Nao altere as outras secoes.

---

## Fora de escopo

- Leitor de exports pre-v12.1 (recusado por desenho — DEC-022).
- Renomear `base_` -> `lunoda_`, titulos do ROADMAP, higiene do IDEAS: wo0007.
- Lembrete de backup JSON: so entra no backlog aqui.
- O HTML exportado e o frontmatter YAML: nao mudam.

## Armadilhas desta WO

- `index.html` com glifos; ancoras recortadas por script. Aplique por script ou edicao exata. Arquivos LF.
- O `entryToMD` passa a chamar `mdDados`: por isso a Edicao 9 poe `mdDados` no `NEEDED` do smoke. Sem ela, o smoke aborta com «funcao nao encontrada».
- `mdDados` troca `-->` por `-->` (escape JSON): a barra invertida e literal no fonte JS e o `JSON.parse` devolve `>`.
- A secao nova do smoke entra ANTES da linha `/* ── Relatório ──…`.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado — em vermelho, suspeite primeiro do instrumento.

- [ ] `git status --short` -> exatamente `M` em: `index.html logs/2026-11-04.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/smoke.mjs`, e `??` em `meta/analises/` e nesta WO (e na wo0007, se ja estiver na pasta). Nada alem.
- [ ] `node tests/smoke.mjs` -> `46 ok, 0 falha(s)` (28 + 18 da ida e volta) · `node tests/history.mjs` -> `52 ok, 0 falha(s)`.
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"` -> `SINTAXE_OK`.
- [ ] `wc -l index.html` -> `3661`.
- [ ] Por LINHA (`grep -c`), -> 1: `"^function parseLunodaMD("` · `"^function planMdImport("` · `"^function applyMdImport("` · `"^function startMdImport("` · `"^function confirmMdImport("` · `"^function mdDados("` · `"^function mdDateToISO("` · `'id="mdImportModal"'` · `'accept=".json,.md,.markdown"'` · `"'blockTransferModal','mdImportModal'\]"`. -> 2: `'<!-- DADOS ${mdDados('` (entrada e bloco). Codigo antigo -> 0: `'accept=".json" style'`.
- [ ] Registro: `grep -c "^## DEC-022 " meta/DECISIONS.md` -> 1 · `grep -m2 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]` e `## [13.4.0] — 2026-11-04` · `grep -c "^- \*\*Reimportar o \`.md\` exportado\*\* — v13.4" meta/IDEAS.md` -> 1 · `grep -c "^- \*\*Herança entre versões + botão do meio (F5" meta/IDEAS.md` -> 1 · `grep -c "^### 2026-11-04 — Lembrete de backup JSON" meta/IDEAS.md` -> 1 · `grep -c "^\*\*Lunoda v13.4\*\*" meta/STATUS.md` -> 1 · `grep -c "46 asserções" tests/README.md` -> 1 · `grep -c "'mdDados', 'entryToMD'\]" tests/smoke.mjs` -> 1.
- [ ] **Teste no navegador — NAO e seu.** Vai como roteiro ao autor. **Chega no ramo?** botao Importar -> `#importFile` -> `handleImport` -> `startMdImport` -> `parseLunodaMD`/`planMdImport` -> `#mdImportModal` -> `confirmMdImport` -> `applyMdImport` -> `saveDB`. **Pergunta que os testes NAO respondem:** «presta com os `.md` reais dele?» — arquivos grandes, editados no Obsidian.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0006.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/smoke.mjs tests/README.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md meta/CONTEXT.md meta/GLOSSARY.md meta/analises logs/2026-11-04.md meta/workorders/261104-wo0006-v13-4-reimportar-md.md
```

```
git commit -m "feat(import): reimporta o Markdown exportado, com previa e so mesclar" -m "v13.4, F9 parte 2. Leitor pelos marcadores, campo de formato por posicao, linha DADOS no export com IDs e datas exatas, previa com pular ou copia para entradas existentes, recusa de exports pre-v12.1 (DEC-022). smoke ganha a ida e volta do Markdown (18 assercoes). Versiona a analise e o modelo de analise."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-04 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
