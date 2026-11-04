# WO 0008 — v13.5: lembrete de backup JSON no topo

> **Tipo:** mista — CODIGO (`index.html`, `tests/smoke.mjs`) + DOC (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS, `tests/README.md`, log).
> **Config sugerida:** Sonnet, `/effort` medio. Codigo e texto prontos, ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD `31d17c3` (wrap das wo0006/wo0007). `sha1sum index.html` = `e32d3e2887dab3593c9f2f130e45889164f226bb`. Arvore limpa exceto `meta/CONTEXT.md` e `meta/GLOSSARY.md` (gravados pelo chat, hashes abaixo) e esta WO. ANTES: smoke 46/0 e history 52/0.
> **Base:** lembrete de backup JSON aprovado pelo autor para o backlog em 2026-11-04 (opcao D do panorama); pedido de WO na mesma data.
> **Depende de:** wo0007.
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e log. CONTEXT e GLOSSARY o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio. Edicoes de REMOCAO: o texto novo e um pedaco da ancora.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
cc854e7a2d6273d3ba5f14a0c45f161c0ba6e2f6  meta/CONTEXT.md
ebf485dcc1651de1f7c2267d7c1ade332085b90f  meta/GLOSSARY.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia do repositorio em `31d17c3` (2026-11-04 ~17:30), cada uma com `count == 1`. A WO foi simulada lendo as edicoes deste proprio arquivo; o resultado foi testado no Chromium.

---

## 1. Por que

Os dados vivem so no `localStorage` de um navegador: limpar os dados do navegador apaga o acervo. O JSON completo e o backup, mas nada lembrava de faze-lo. Agora o topo mostra se ha mudancas sem backup e ha quantos dias, e um clique baixa o backup (DEC-023, texto na Edicao 11).

## 2. Contexto factual

- **Medido:** so `exportAllJSON()` gera o JSON completo (`'lunoda_backup_'+dateSlug()+'.json'`); `exportSelectedJSON` e o JSON de uma entrada sao parciais e NAO contam.
- **Medido:** `renderTable()` roda a cada mudanca da tabela (salvar, importar, excluir) e ja atualiza `#topbar-count`; o indicador vai junto dele.
- **Medido:** toda entrada tem `createdAt`; `updatedAt` existe nas editadas. O estado compara os dois com a data do ultimo backup.
- **Chave nova** fora do `db` (DEC-011): `localStorage['lunoda_last_backup']`, data ISO. Leitura e escrita em `try/catch`.
- **Estados** (`backupStatus`, funcao PURA, testada no smoke): `vazio` (sem entradas: indicador some) · `nunca` · `em-dia` (nada mudou desde o backup, sem contar dias) · `recente` (mudou, < 7 dias) · `atrasado` (mudou, >= 7 dias). `nunca` e `atrasado` = amarelo + um aviso por abertura do app.
- **Junto:** na previa do import de `.md`, quando o arquivo e recusado o botao diz «Fechar» (achado do teste da v13.4: «Cancelar» sem nada a cancelar).

## Inventario

25 edicoes em 8 arquivos (+ 2 gravados pelo chat). Codigo: 8 no `index.html` (HTML do topo, `renderTable`, `exportAllJSON`, previa do `.md` x3, funcoes novas, CSS) e 1 no `tests/smoke.mjs` (8 asserções).

---

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `31d17c3`; `sha1sum index.html` = `e32d3e2887dab3593c9f2f130e45889164f226bb`; `sha1sum -c` nas 2 linhas acima -> `OK`. smoke `46 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · indicador de backup no topo

**Forma:** Substituir.

**Ancora:**

````
  <div class="topbar-sp"></div>
  <button class="btn btn-ghost" onclick="openImport()">
````

**Substituir por:**

````
  <div class="topbar-sp"></div>
  <!-- Lembrete de backup JSON (DEC-023): texto e cor por renderBackupPill; clique baixa o backup -->
  <button class="btn btn-ghost backup-pill" id="backupPill" onclick="quickBackup()" style="display:none"></button>
  <button class="btn btn-ghost" onclick="openImport()">
````

## Edicao 2 — `index.html` · renderTable atualiza o indicador

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
  document.getElementById('topbar-count').textContent =
    db.entries.length + (db.entries.length === 1 ? ' entrada' : ' entradas');
````

**Substituir por:**

````
  document.getElementById('topbar-count').textContent =
    db.entries.length + (db.entries.length === 1 ? ' entrada' : ' entradas');
  renderBackupPill();   // o lembrete acompanha toda mudança na tabela (DEC-023)
````

## Edicao 3 — `index.html` · exportAllJSON registra o backup

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
function exportAllJSON() {
  dl(JSON.stringify(db,null,2), 'lunoda_backup_'+dateSlug()+'.json', 'application/json');
````

**Substituir por:**

````
function exportAllJSON() {
  dl(JSON.stringify(db,null,2), 'lunoda_backup_'+dateSlug()+'.json', 'application/json');
  markBackup();   // só o JSON COMPLETO conta como backup (DEC-023)
````

## Edicao 4 — `index.html` · previa: botao de fechar com id

**Forma:** Substituir.

**Ancora:**

````
      <button class="btn btn-ghost" onclick="closeModal('mdImportModal')">Cancelar</button>
````

**Substituir por:**

````
      <button class="btn btn-ghost" id="mdImportCancel" onclick="closeModal('mdImportModal')">Cancelar</button>
````

## Edicao 5 — `index.html` · previa: recusa diz Fechar

**Forma:** Substituir.

**Ancora:**

````
    go.style.display = 'none';
````

**Substituir por:**

````
    go.style.display = 'none';
    document.getElementById('mdImportCancel').textContent = 'Fechar';   // sem nada a importar, não há o que cancelar
````

## Edicao 6 — `index.html` · previa: com importacao volta a Cancelar

**Forma:** Substituir.

**Ancora:**

````
  go.style.display = '';
````

**Substituir por:**

````
  go.style.display = '';
  document.getElementById('mdImportCancel').textContent = 'Cancelar';
````

## Edicao 7 — `index.html` · funcoes do lembrete de backup

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
function openImport() { document.getElementById('importFile').click(); }
````

**Substituir por:**

````
/* ──────────────────────────────
   LEMBRETE DE BACKUP JSON (DEC-023)
   Os dados vivem só no localStorage de um navegador: limpar o navegador apaga tudo.
   O indicador no topo diz quando foi o último backup JSON completo e baixa um com um clique.
   Data em chave própria, fora do db (DEC-011).
────────────────────────────── */
const BACKUP_KEY = 'lunoda_last_backup';
let backupAvisado = false;   // o aviso de atraso sai uma vez por abertura do app

/* PURA. Estado do lembrete: 'vazio' (sem entradas) · 'nunca' · 'em-dia' (nada mudou desde o
   último backup, não importa há quantos dias) · 'recente' (mudou, há menos de `limite` dias) ·
   'atrasado' (mudou e já passou do limite). `dias` = dias inteiros desde o último backup. */
function backupStatus(ultimoIso, entries, agoraMs, limite = 7) {
  if (!entries || entries.length === 0) return { estado: 'vazio', dias: null };
  const ult = ultimoIso ? Date.parse(ultimoIso) : NaN;
  if (isNaN(ult)) return { estado: 'nunca', dias: null };
  const dias = Math.max(0, Math.floor((agoraMs - ult) / 86400000));
  const mudou = entries.some(e => (Date.parse(e.updatedAt || e.createdAt || '') || 0) > ult);
  if (!mudou) return { estado: 'em-dia', dias };
  return { estado: dias >= limite ? 'atrasado' : 'recente', dias };
}

function lastBackup() {
  try { return localStorage.getItem(BACKUP_KEY) || ''; } catch (_) { return ''; }
}
function markBackup() {
  try { localStorage.setItem(BACKUP_KEY, new Date().toISOString()); } catch (_) {}
  renderBackupPill();
}

/* Desenha o indicador do topo a partir do estado. */
function renderBackupPill() {
  const el = document.getElementById('backupPill'); if (!el) return;
  const st = backupStatus(lastBackup(), db.entries, Date.now());
  if (st.estado === 'vazio') { el.style.display = 'none'; return; }
  const quando = st.dias === 0 ? 'hoje' : (st.dias === 1 ? 'há 1 dia' : `há ${st.dias} dias`);
  const txt = { 'nunca': 'Backup: nunca', 'em-dia': 'Backup em dia',
                'recente': `Backup ${quando}`, 'atrasado': `Backup ${quando}` }[st.estado];
  el.textContent = txt;
  el.classList.toggle('warn', st.estado === 'nunca' || st.estado === 'atrasado');
  el.title = (st.estado === 'em-dia'
      ? `Último backup JSON ${quando}; nada mudou desde então.`
      : st.estado === 'nunca' ? 'Nenhum backup JSON registrado neste navegador.'
      : `Último backup JSON ${quando}, e houve mudanças desde então.`)
    + ' Clique para baixar um backup JSON completo agora.';
  el.style.display = '';
  if (!backupAvisado && (st.estado === 'nunca' || st.estado === 'atrasado')) {
    backupAvisado = true;
    setTimeout(() => showToast(st.estado === 'nunca'
      ? 'Nenhum backup JSON ainda — clique em «Backup» no topo'
      : `Último backup JSON ${quando} — clique em «Backup» no topo`), 1200);
  }
}

/* Clique no indicador: o mesmo backup completo do «Exportar tudo → JSON». */
function quickBackup() { exportAllJSON(); }

function openImport() { document.getElementById('importFile').click(); }
````

## Edicao 8 — `index.html` · CSS do indicador

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
.topbar-sp { flex: 1; }
````

**Substituir por:**

````
.topbar-sp { flex: 1; }
/* Lembrete de backup (DEC-023): discreto quando em dia; amarelo quando nunca ou atrasado */
.backup-pill { font-family: var(--mono); font-size: 11px; color: var(--text-dim); }
.backup-pill.warn { color: var(--yellow); border: 1px solid rgba(245,197,66,.45); }
````

## Edicao 9 — `tests/smoke.mjs` · secao do lembrete de backup

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
/* ── Relatório ──────────────────────────────────────────────── */
````

**Substituir por:**

````
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

/* ── Relatório ──────────────────────────────────────────────── */
````

## Edicao 10 — `tests/README.md` · README: smoke cobre o lembrete

**Forma:** Substituir.

**Ancora:**

````
Desde a v13.4, a **ida e volta do Markdown** (DEC-022): o smoke exporta a fixture hostil com o `entryToMD` real, relê com o `parseLunodaMD` real e compara campo a campo (título, descrição, IDs, datas, blocos, conteúdo, propriedades por nome); cobre também o export sem a linha `DADOS` (v12.1–v13.3), CRLF, as recusas (pré-v12.1, arquivo estranho, total de blocos divergente) e pular × cópia. 46 asserções no total.
````

**Substituir por:**

````
Desde a v13.4, a **ida e volta do Markdown** (DEC-022): o smoke exporta a fixture hostil com o `entryToMD` real, relê com o `parseLunodaMD` real e compara campo a campo (título, descrição, IDs, datas, blocos, conteúdo, propriedades por nome); cobre também o export sem a linha `DADOS` (v12.1–v13.3), CRLF, as recusas (pré-v12.1, arquivo estranho, total de blocos divergente) e pular × cópia. Desde a v13.5, também o **estado do lembrete de backup** (`backupStatus`, DEC-023): nunca, em dia, recente, atrasado e o limite. 54 asserções no total.
````

## Edicao 11 — `meta/DECISIONS.md` · DEC-023 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
O `.md` vira caminho de recuperação e de volta do Obsidian. Continuam fora do `.md`: cores e adição automática (vêm do JSON). O formato do export agora é contrato do leitor: mudar marcador ou campo exige mudar `parseLunodaMD` e o teste de ida e volta do smoke.
````

**Substituir por:**

````
O `.md` vira caminho de recuperação e de volta do Obsidian. Continuam fora do `.md`: cores e adição automática (vêm do JSON). O formato do export agora é contrato do leitor: mudar marcador ou campo exige mudar `parseLunodaMD` e o teste de ida e volta do smoke.

---

## DEC-023 — Lembrete de backup JSON no topo, pelo que mudou desde o último backup
**Data:** 2026-11-04 · **Status:** aceita · origem: opção D da análise da F9 parte 2

### Contexto
Os dados vivem só no `localStorage` de um navegador; limpar os dados do navegador apaga o acervo. O JSON é o backup completo, mas nada lembrava de fazê-lo. O autor aprovou o lembrete para o backlog.

### Decisão
- Indicador no topo, ao lado de «Importar»: **«Backup em dia»** (discreto) quando nenhuma entrada mudou depois do último backup — **não importa há quantos dias** —; **«Backup há N dias» / «hoje»** quando houve mudança; em **amarelo** quando nunca houve backup ou quando houve mudança e já passaram **7 dias**. Some sem entradas.
- **Um clique** baixa o mesmo JSON completo do «Exportar tudo → JSON».
- Só o **JSON completo** registra backup (JSON de uma entrada, de seleção, Markdown e HTML não contam). Data em `localStorage['lunoda_last_backup']`, fora do `db` (DEC-011).
- Se estiver amarelo, um **aviso** aparece uma vez por abertura do app.
- O estado é calculado por uma função pura (`backupStatus`), coberta pelo smoke.

### Alternativas consideradas
- **Só por dias desde o backup** — avisaria quem não mexeu em nada; o que importa é o que mudou desde então.
- **Backup automático** (baixar sozinho) — o navegador pediria permissão de download a cada vez, ou encheria a pasta de Downloads.
- **Modal bloqueante** — insistente demais para uma ferramenta pessoal.

### Consequências
O risco principal do projeto fica visível o tempo todo, sem interromper. O limite de 7 dias é um padrão (`backupStatus(…, limite)`), mudável num ponto só. O registro é por navegador: outro navegador mostra «nunca» até o primeiro backup nele.
````

## Edicao 12 — `meta/CHANGELOG.md` · [13.5.0] acima da 13.4.1

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.4.1] — 2026-11-04
````

**Substituir por:**

````
## [13.5.0] — 2026-11-04

### Adicionado
- **Lembrete de backup JSON** (DEC-023): indicador no topo — «Backup em dia», «Backup há N dias», amarelo quando nunca houve backup ou quando há mudanças há 7 dias ou mais — e um clique baixa o backup JSON completo. Aviso uma vez por abertura quando atrasado.
- `tests/smoke.mjs` cobre o estado do lembrete (8 asserções novas, 54 no total).

### Modificado
- Na prévia do import de Markdown, quando não há nada a importar (arquivo recusado), o botão diz «Fechar» em vez de «Cancelar».

## [13.4.1] — 2026-11-04
````

## Edicao 13 — `meta/IDEAS.md` · ideia do lembrete: status

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-11-04 — Lembrete de backup JSON
````

**Substituir por:**

````
### 2026-11-04 — Lembrete de backup JSON
> **Status (2026-11-04):** implementada na v13.5 (DEC-023) — ver Concluídas.
````

## Edicao 14 — `meta/IDEAS.md` · Concluidas: lembrete

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Prefixos de exportação `lunoda_`** — v13.4.1.
````

**Substituir por:**

````
## ✅ Concluídas

- **Lembrete de backup JSON no topo** — v13.5 / DEC-023.
- **Prefixos de exportação `lunoda_`** — v13.4.1.
````

## Edicao 15 — `meta/ROADMAP.md` · F8: lembrete de backup

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- [x] Undo/redo no editor (Ctrl+Z / Ctrl+Y) sobre snapshots do estado — v12.2, ver DEC-010.
````

**Substituir por:**

````
- [x] Undo/redo no editor (Ctrl+Z / Ctrl+Y) sobre snapshots do estado — v12.2, ver DEC-010.
- [x] Lembrete de backup JSON no topo, pelo que mudou desde o último backup — v13.5, ver DEC-023 (acrescentado depois de a fase fechar).
````

## Edicao 16 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.4.1** — 2026-11-04 — reimportar o Markdown exportado (F9 parte 2) + faxina (prefixos `lunoda_`, README). Arquivo canônico `index.html`. Testes: `smoke` 46/46 e `history` 52/52 (rodada da wo0007).
````

**Substituir por:**

````
**Lunoda v13.5** — 2026-11-04 — lembrete de backup JSON no topo. Arquivo canônico `index.html`. Testes: `smoke` 54/54 e `history` 52/52 (rodada da wo0008).
````

## Edicao 17 — `meta/STATUS.md` · funcionando: lembrete

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Importar `.md` exportado pelo app: prévia, só mescla, pular ou copiar o que já existe; recusa exports pré-v12.1 (v13.4).
````

**Substituir por:**

````
- Importar `.md` exportado pelo app: prévia, só mescla, pular ou copiar o que já existe; recusa exports pré-v12.1 (v13.4).
- Lembrete de backup JSON no topo: em dia / há N dias / amarelo quando nunca ou atrasado; um clique baixa o backup (v13.5).
````

## Edicao 18 — `meta/STATUS.md` · backlog: conferencia

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.4 e a v13.4.1 no navegador** (roteiro na conversa de 2026-11-04).
````

**Substituir por:**

````
- [ ] **Conferir a v13.5 no navegador** (roteiro na conversa de 2026-11-04).
````

## Edicao 19 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.4 e v13.4.1 aplicadas (`8274e0c`, `d779c80`); falta a conferência no navegador** — roteiro na conversa de 2026-11-04; na v13.4.1, conferir o nome `lunoda_backup_AAAA-MM-DD.json` ao exportar. v13.0 a v13.3 já conferidas pelo autor.
````

**Substituir por:**

````
- **v13.5 aplicada pela wo0008; falta a conferência no navegador** — roteiro na conversa de 2026-11-04. v13.0 a v13.4.1 já conferidas pelo autor.
````

## Edicao 20 — `meta/STATUS.md` · backlog: instrucoes coladas

**Forma:** Remover a linha.

**Ancora:**

````
- [ ] **Colar `INSTRUCOES-DO-PROJETO.md` no painel do Projeto** (arquivo novo, versionado em `d779c80`).

````

**Substituir por:**

````

````

## Edicao 21 — `meta/STATUS.md` · backlog: lembrete feito

**Forma:** Remover a linha.

**Ancora:**

````
- [ ] **Lembrete de backup JSON** — «último backup há N dias» + botão rápido (IDEAS, 2026-11-04).

````

**Substituir por:**

````

````

## Edicao 22 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
**2026-11-04** — v13.2 e v13.3 conferidas pelo autor. Entregue a F6 (empurrão de versão, DEC-021) como v13.3 (`e40b37a`). Análise da F9 parte 2 medida e decidida (opção B, DEC-022); entregue como **v13.4** pela wo0006 (`8274e0c`); faxina (prefixos `lunoda_`, README, ROADMAP, IDEAS) como **v13.4.1** pela wo0007 (`d779c80`). F5 adiada pelo autor. Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03.
````

**Substituir por:**

````
**2026-11-04** — v13.2 e v13.3 conferidas pelo autor. Entregue a F6 (empurrão de versão, DEC-021) como v13.3 (`e40b37a`). Análise da F9 parte 2 medida e decidida (opção B, DEC-022); entregue como **v13.4** pela wo0006 (`8274e0c`); faxina (prefixos `lunoda_`, README, ROADMAP, IDEAS) como **v13.4.1** pela wo0007 (`d779c80`). F5 adiada pelo autor. Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03. v13.4 e v13.4.1 conferidas pelo autor; Instruções coladas no painel; entregue o **lembrete de backup JSON** (DEC-023) como **v13.5** pela wo0008.
````

## Edicao 23 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.4 no navegador; depois o lembrete de backup JSON.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.5 no navegador; depois escolher a próxima frente (F9 `.zip`, F10 busca no conteúdo, ou testes de `calcPropertyValues`/`migrateOptionModes`/`loadDB`).
````

## Edicao 24 — `logs/2026-11-04.md` · secao do chat (continuacao 2)

**Forma:** ACRESCENTAR NO FIM DO ARQUIVO (sem ancora: o fim do log e da secao do wrap). Garanta UMA linha em branco entre o fim atual e o texto abaixo.

**Texto:**

````

## Conversa 1 — chat (planejamento, continuação 2)

### Feito
- Conferidos os relatórios das wo0006 e wo0007 (`8274e0c`, `d779c80` + wrap `31d17c3`): batem com o git. Roteiro v13.4 do autor: todos ok; Instruções coladas no painel.
- Escrita a wo0008 (v13.5, lembrete de backup JSON, DEC-023): indicador no topo, `backupStatus` puro, `markBackup` só no JSON completo, aviso uma vez por abertura; na prévia do `.md`, o botão vira «Fechar» quando nada pode ser importado. Smoke +8 asserções (54).
- Verificado no container: smoke 54/0, history 52/0, sintaxe; dois mutantes pegos (53/1 cada); Chromium com os cinco estados (vazio, nunca, em dia, recente, atrasado), download pelo clique e nenhum erro de JS.

### Decisões
- O lembrete conta pelo que **mudou** desde o último backup, não só pelos dias: sem mudança, «em dia» mesmo depois de um mês.
- Só o JSON completo registra backup; os outros exports não restauram tudo.

### Próximos passos
- Aplicar a wo0008 e passar o roteiro v13.5.
- Escolher a próxima frente: F9 `.zip`, F10 busca no conteúdo, ou testes de `calcPropertyValues`/`migrateOptionModes`/`loadDB`.
````

## Edicao 25 — `logs/2026-11-04.md` · secao do Code

Acrescente no FIM do arquivo (depois da Edicao 24) `## Conversa 1 — Code (execucao, wo0008)` com o seu relatorio resumido.

---

## Fora de escopo

- `STORAGE_KEY = 'base_v4'`: NAO mexer. A chave nova e `lunoda_last_backup`, separada.
- Os outros exports (JSON de selecao, de uma entrada, Markdown, HTML): NAO chamam `markBackup`.
- O limite de 7 dias: e o padrao do parametro `limite` de `backupStatus`; nao criar opcao na interface.

## Armadilhas desta WO

- A Edicao 7 insere funcoes ANTES de `function openImport()`; a ancora e a linha inteira dessa funcao e ela continua no texto novo.
- As Edicoes 5 e 6 sao parecidas (`go.style.display = 'none';` e `go.style.display = '';`): cada uma tem `count == 1` exato; nao troque uma pela outra.
- O smoke extrai `backupStatus` com `extractFunction`: o nome e a assinatura tem de ficar como no texto.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado.

- [ ] `git status --short` -> exatamente `M` em: `index.html logs/2026-11-04.md meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/smoke.mjs`, e `??` nesta WO. Nada alem.
- [ ] smoke `54 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · sintaxe `SINTAXE_OK` (comando abaixo) · `wc -l index.html` -> `3727` · `sha1sum index.html` -> `99ab0b25239e2fea999702c8c7cfa24bbb3b8bbc`.
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"`
- [ ] Ocorrencias no `index.html` (`grep -oF "..." index.html | wc -l`): `function backupStatus(` 1 · `function markBackup(` 1 · `function renderBackupPill(` 1 · `function quickBackup(` 1 · `markBackup();` 1 · `renderBackupPill();` **2** (renderTable e markBackup) · `lunoda_last_backup` 1 · `id="backupPill"` 1 · `id="mdImportCancel"` 1 · `base_v4` **1** (a chave de dados NAO muda).
- [ ] Docs: `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.5.0] — 2026-11-04`, `## [13.4.1] — 2026-11-04` · `grep -c "^## DEC-023" meta/DECISIONS.md` -> 1 · `grep -c "^\*\*Lunoda v13.5\*\*" meta/STATUS.md` -> 1 · `grep -c "Lembrete de backup JSON\*\*\|Colar \`INSTRUCOES\|Conferir a v13.4" meta/STATUS.md` -> 0 · `grep -c "54 asserções" tests/README.md` -> 1 · `grep -c "" meta/STATUS.md meta/IDEAS.md logs/2026-11-04.md` -> 57 · 231 · 77 (o log, ANTES da secao do Code).
- [ ] **Teste no navegador — NAO e seu.** O autor passa o roteiro v13.5.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0008.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/smoke.mjs tests/README.md meta/CONTEXT.md meta/GLOSSARY.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md logs/2026-11-04.md meta/workorders/261104-wo0008-v13-5-lembrete-backup.md
```

```
git commit -m "feat: lembrete de backup JSON no topo" -m "v13.5, DEC-023. Indicador ao lado de Importar: em dia, ha N dias, amarelo quando nunca ou com mudancas ha 7 dias ou mais; um clique baixa o backup completo. Data em lunoda_last_backup, fora do db. Smoke com 8 assercoes novas (54). Previa do md diz Fechar quando o arquivo e recusado."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-04 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
