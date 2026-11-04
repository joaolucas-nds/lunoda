# WO 0005 — v13.3: empurrao de versao (F6) + registro

> **Tipo:** mista — CODIGO (`index.html`, `tests/history.mjs`, `tests/README.md`) + REGISTRO (DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS).
> **Config sugerida:** Sonnet, `/effort` medio. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD em `9fa7c5c`; `sha1sum index.html` = `22c4a19d55fcf06ff82dd9e74956bcb8dace6689`; arvore limpa exceto `meta/CONTEXT.md`, `meta/GLOSSARY.md` e `logs/2026-11-04.md` (gravados pelo chat, hashes abaixo — o log e arquivo NOVO) e esta WO. ANTES de aplicar: `node tests/smoke.mjs` 28/0 e `node tests/history.mjs` 39/0.
> **Base:** DEC-015 (regras do empurrao, decididas pelo autor em 2026-11-03) e a ordem combinada (pacote de interface -> F6 -> F9 parte 2). Detalhes de implementacao registrados aqui como DEC-021.
> **Depende de:** wo0004 (aplicada, `9fa7c5c`).
> **Canal dos meta neste ciclo = CODE** para DECISIONS, CHANGELOG, IDEAS, ROADMAP, STATUS e a secao do Code no log. CONTEXT, GLOSSARY e o log de 2026-11-04 o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
60d8866f2c47900f8da06eaa6e02ca48e526e30f  meta/CONTEXT.md
0038f1e32b8c0ec1960f49a9d633b27773644ef7  meta/GLOSSARY.md
4a62087a7c0af354778f6b721d8e486c7c8dcaac  logs/2026-11-04.md
```

**Ancoras lidas em:** cada ancora foi RECORTADA por script dos arquivos do repositorio copiados do disco em 2026-11-04 ~10:15 (HEAD `9fa7c5c`, `index.html` com o sha1 acima) e conferida com `count == 1`. O trecho literal e o proprio bloco «Ancora» de cada edicao. A WO inteira foi simulada numa copia aplicando as edicoes lidas DESTE arquivo.

---

## 1. Por que

F6, proxima pela ordem combinada. Regras fechadas na DEC-015. Achado no caminho: mudar o numero de versao hoje nao entra no undo (`syncVer`/`adjVer` nao estao na lista do embrulho) — com o empurrao, um numero muda varios blocos, entao precisa entrar.

## 2. Contexto factual

- **Medido no `index.html` (`9fa7c5c`):** `syncVer` so grava `b.version`; `adjVer` soma o delta (minimo 1) e atualiza o campo; nenhum dos dois na lista do embrulho; `updateVerHint` compara subtitulo com `trim().toLowerCase()`; `applySug` grava o proximo numero livre.
- **Medido na simulacao:** smoke 28/0, history 52/0, sintaxe OK, `index.html` 3.405 -> 3.435 linhas. Prova de vida: contra o `index.html` antigo, 39 ok / 1 falha; mutante «subir sem empurrar», 50 ok / 2 falhas; mutante «fora do embrulho», 50 ok / 2 falhas.
- **Medido em Chromium headless** (copia com as edicoes de codigo DESTA WO; entrada com «Claude» v1–v4 e «Gemini» v2): digitar 1 no campo da v4 da `C2 C3 C4 C1` com a ordem da lista intacta e o aviso «v4 → v1 · 3 versão(ões) renumerada(s)»; `Ctrl+Z` volta a `C1 C2 C3 C4`; «+» na v1 troca com a v2; «+» no Gemini (numero livre) so grava; nenhum erro de JS.
- **Nao medido:** o Chrome real do autor com os dados dele — roteiro do autor.

## Inventario

18 edicoes com ancora + 1 do Code, em 8 arquivos. Codigo: 3 edicoes no `index.html` — os pontos sairam de `grep -n "version" index.html` filtrado para quem ESCREVE `b.version` a partir da interface: `syncVer`, `adjVer` e `applySug` (este fica de fora: ja escolhe numero livre, DEC-021). Import, duplicar e transferir copiam a versao, nao a editam.

---

## Edicao 0 — conferir hashes e baseline

`sha1sum index.html` = `22c4a19d55fcf06ff82dd9e74956bcb8dace6689`, e `sha1sum -c` nas 3 linhas acima -> `OK`. `node tests/smoke.mjs` -> `28 ok, 0 falha(s)`; `node tests/history.mjs` -> `39 ok, 0 falha(s)`. Qualquer divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · syncVer passa pelo empurrao

**Forma:** Substituir.

**Ancora:**

````
function syncVer(bid, val) {
  const b = editBlocks.find(x=>x.id===bid); if (b) b.version = val;
}
````

**Substituir por:**

````
function syncVer(bid, val) {
  setBlockVersion(bid, val);   // número ocupado no mesmo subtítulo empurra os vizinhos (DEC-015)
}
````

## Edicao 2 — `index.html` · adjVer passa pelo empurrao + setBlockVersion

**Forma:** Substituir.

**Ancora:**

````
function adjVer(bid, delta) {
  const b = editBlocks.find(x=>x.id===bid); if (!b) return;
  b.version = Math.max(1, (b.version||1) + delta);
  const inp = document.querySelector(`.ver-num[onchange*="${bid}"]`);
  if (inp) inp.value = b.version;
}
````

**Substituir por:**

````
function adjVer(bid, delta) {
  const b = editBlocks.find(x=>x.id===bid); if (!b) return;
  setBlockVersion(bid, (b.version||1) + delta);   // −/+ num número ocupado = troca com o vizinho
}

/* Muda a versão de um bloco — o empurrão da F6 (DEC-015, detalhes na DEC-021).
   Se o número novo já está ocupado por OUTRO bloco do mesmo subtítulo (sem diferença de
   maiúsculas e espaços nas pontas), é um MOVER: os do intervalo andam uma casa
   (v5→v3: v3→v4 e v4→v5; v2→v4: v3→v2 e v4→v3); duplicatas andam juntas. Número livre só é gravado.
   Só números mudam — a posição dos blocos na lista fica. Ignora a seleção.
   Bloco sem subtítulo não forma grupo: não empurra ninguém.
   Coberta pelo undo: o nome está na lista do embrulho. */
function setBlockVersion(bid, val) {
  const b = editBlocks.find(x => x.id === bid); if (!b) return;
  const from = b.version || 1;
  const to   = Math.max(1, parseInt(val, 10) || 1);
  const key  = (b.subtitle || '').trim().toLowerCase();
  const group = key
    ? editBlocks.filter(x => x.id !== bid && (x.subtitle || '').trim().toLowerCase() === key)
    : [];
  const shifted = [];
  if (to !== from && group.some(x => (x.version || 1) === to)) {
    group.forEach(x => {
      const v = x.version || 1;
      if (to < from && v >= to && v < from)      { x.version = v + 1; shifted.push(x.id); }
      else if (to > from && v > from && v <= to) { x.version = v - 1; shifted.push(x.id); }
    });
  }
  b.version = to;
  // Atualiza só os campos que mudaram (sem redesenhar a lista: o foco e as alturas ficam)
  [bid, ...shifted].forEach(id => {
    const inp = document.querySelector(`.ver-num[onchange*="${id}"]`);
    if (inp) inp.value = editBlocks.find(x => x.id === id).version;
  });
  if (shifted.length) showToast(`v${from} → v${to} · ${shifted.length} versão(ões) renumerada(s)`);
}
````

## Edicao 3 — `index.html` · setBlockVersion na lista do embrulho (undo)

**Forma:** Substituir.

**Ancora:**

````
 'disableAutoFromBlock', 'applyPropToSelectedBlocks'].forEach(name => {
````

**Substituir por:**

````
 'disableAutoFromBlock', 'applyPropToSelectedBlocks', 'setBlockVersion'].forEach(name => {
````

## Edicao 4 — `tests/history.mjs` · secao 13: empurrao de versao

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
console.log('\nLunoda — teste do historico (undo/redo)\n');
````

**Substituir por:**

````
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
````

## Edicao 5 — `tests/README.md` · README: contagem

**Forma:** Substituir.

**Ancora:**

````
Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 39 asserções, incluindo:
````

**Substituir por:**

````
Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 52 asserções, incluindo:
````

## Edicao 6 — `tests/README.md` · README: item do empurrao

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- **quadrado geral de seleção com filtro** (DEC-016), com as funções REAIS: misto → marca todos os visíveis e mantém o oculto; todos → desmarca só os visíveis; o contador de ocultos ignora id que não existe mais.
````

**Substituir por:**

````
- **quadrado geral de seleção com filtro** (DEC-016), com as funções REAIS: misto → marca todos os visíveis e mantém o oculto; todos → desmarca só os visíveis; o contador de ocultos ignora id que não existe mais.
- **empurrão de versão** (DEC-015, DEC-021), com a função REAL: descendo e subindo, número livre, troca pelo −/+, duplicatas juntas, grupo sem diferença de caixa, sem subtítulo não empurra, ordem da lista intacta e undo.
````

## Edicao 7 — `meta/DECISIONS.md` · DEC-021 no fim

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
Mesma regra em dois lugares (caixa e geral), mesmo código (`taToolbarHTML('all')`). Sem mudança no formato dos dados.
````

**Substituir por:**

````
Mesma regra em dois lugares (caixa e geral), mesmo código (`taToolbarHTML('all')`). Sem mudança no formato dos dados.

---

## DEC-021 — Detalhes da implementação do empurrão de versão (F6)
**Data:** 2026-11-04 · **Status:** aceita · complementa a DEC-015

### Contexto
A DEC-015 fixou as regras do empurrão. Ao implementar, apareceram três pontos que ela não cobria.

### Decisão
- **Bloco sem subtítulo não forma grupo** e não empurra ninguém — blocos sem nome não são versões de uma mesma coisa; tratá-los como grupo renumeraria blocos sem relação entre si.
- **O grupo ignora maiúsculas e espaços nas pontas** («A» e «a » são o mesmo subtítulo) — a mesma comparação que o aviso «mesmo subtítulo existe» já usava (`updateVerHint`).
- **A sugestão de versão (`applySug`) não empurra:** ela já escolhe o próximo número livre.
- Quando o empurrão renumera alguém, um aviso diz «v5 → v3 · N versão(ões) renumerada(s)»; os campos mudam no lugar, sem redesenhar a lista.

### Alternativas consideradas
- **Tratar «sem subtítulo» como um grupo** — coerente no papel, mas renumeraria em cascata blocos que só têm em comum a falta de nome.

### Consequências
Implementado em `setBlockVersion()`, chamado por `syncVer` (campo) e `adjVer` (−/+), na lista do embrulho do undo. Coberto pela seção 13 do `tests/history.mjs`.
````

## Edicao 8 — `meta/CHANGELOG.md` · [13.3.0] acima da 13.2

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.2.0] — 2026-11-03
````

**Substituir por:**

````
## [13.3.0] — 2026-11-04

### Adicionado
- **Empurrão de versão** (F6, DEC-015, DEC-021): trocar o número de versão de um bloco para um número já ocupado no mesmo subtítulo renumera os vizinhos (v5→v3 faz v3→v4 e v4→v5); os botões −/+ trocam com o vizinho. Só números mudam, a posição na lista fica. Um aviso diz quantas versões foram renumeradas. Coberto pelo undo — antes, mudar o número de versão não entrava no histórico.
- `tests/history.mjs` cobre o empurrão (13 asserções novas, 52 no total).

## [13.2.0] — 2026-11-03
````

## Edicao 9 — `meta/IDEAS.md` · ideia do empurrao: concluida

**Forma:** Substituir.

**Ancora:**

````
> **Status (2026-11-03):** Q1 resolvida (DEC-015); implementação na F6.
````

**Substituir por:**

````
> **Status (2026-11-03):** Q1 resolvida (DEC-015).
> **Status (2026-11-04):** implementada na v13.3 (DEC-021) — ver Concluídas.
````

## Edicao 10 — `meta/IDEAS.md` · Concluidas: empurrao

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Legibilidade: contraste WCAG AA e piso de 11px** — v13.2 / DEC-018.
````

**Substituir por:**

````
## ✅ Concluídas

- **Reordenação por número de versão (empurrão)** — v13.3 / DEC-015, DEC-021. Fecha a F6.
- **Legibilidade: contraste WCAG AA e piso de 11px** — v13.2 / DEC-018.
````

## Edicao 11 — `meta/ROADMAP.md` · F6 entregue

**Forma:** Substituir.

**Ancora:**

````
## 🔵 F6 — Reordenação por número de versão *(futuro, sem data)*
**Objetivo:** mudar o número de versão de um bloco empurrando os demais.
- **Desbloqueada:** regras fechadas na DEC-015 (Q1) — o empurrão ignora a seleção, age só no grupo de mesmo subtítulo e só muda números, não posições.
````

**Substituir por:**

````
## 🟢 F6 — Reordenação por número de versão *(entregue — v13.3; falta conferir no navegador)*
**Objetivo:** mudar o número de versão de um bloco empurrando os demais.
- [x] Empurrão no campo de versão e nos −/+ (DEC-015, DEC-021), v13.3 — ignora a seleção, age só no grupo de mesmo subtítulo e só muda números, não posições.
````

## Edicao 12 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.2** — 2026-11-03 — legibilidade (contraste WCAG AA, piso de 11px), painel do editor ajustável/maximizar e controle geral do tamanho das caixas. Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 39/39 (rodada da wo0004).
````

**Substituir por:**

````
**Lunoda v13.3** — 2026-11-04 — empurrão de versão (F6). Arquivo canônico `index.html`. Testes: `smoke` 28/28 e `history` 52/52 (rodada da wo0005).
````

## Edicao 13 — `meta/STATUS.md` · funcionando: empurrao

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
- Texto secundário com contraste ≥ 4,5:1 e nada abaixo de 11px (v13.2).
````

**Substituir por:**

````
- Texto secundário com contraste ≥ 4,5:1 e nada abaixo de 11px (v13.2).
- Empurrão de versão: número ocupado no mesmo subtítulo renumera os vizinhos; −/+ troca; coberto pelo undo (v13.3).
````

## Edicao 14 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.2 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-03. v13.0 e v13.1 já conferidas pelo autor (todos os itens ok).
````

**Substituir por:**

````
- **v13.3 aplicada; falta a conferência no navegador** — roteiro na conversa de 2026-11-04. v13.0, v13.1 e v13.2 já conferidas pelo autor (todos os itens ok).
````

## Edicao 15 — `meta/STATUS.md` · backlog: conferencia

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.2 no navegador** (roteiro na conversa de 2026-11-03).
````

**Substituir por:**

````
- [ ] **Conferir a v13.3 no navegador** (roteiro na conversa de 2026-11-04).
````

## Edicao 16 — `meta/STATUS.md` · backlog: proxima frente

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Projetar a F6 — empurrão de versão (DEC-015)** como WO — próxima pela ordem combinada; depois **F9 parte 2 — reimportar `.md`** (começa por análise).
````

**Substituir por:**

````
- [ ] **F9 parte 2 — reimportar `.md`**: começar pela **análise escrita** (`meta/analises/`) — próxima pela ordem combinada.
````

## Edicao 17 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-03** — Migração para o KCM v1.133.0 / modo Code (wo0001, `552d577`). Decididas C1, C2 e Q1 (DEC-013/014/015); entregue a **v13.0** (wo0002, `49c087e`), conferida no navegador. Desenhados e entregues o quadrado geral de seleção (DEC-016) e o tamanho das caixas (DEC-017): **v13.1** pela wo0003, conferida no navegador. Pacote de interface (DEC-018/019/020) aprovado com prints de antes/depois: **v13.2** pela wo0004.
````

**Substituir por:**

````
**2026-11-04** — Conferida a v13.2 (wo0004, `9fa7c5c`; roteiro do autor ok). Entregue a **F6 — empurrão de versão** (DEC-021) como **v13.3** pela wo0005. Histórico da véspera (migração para o KCM v1.133.0, v13.0–v13.2) no log de 2026-11-03.
````

## Edicao 18 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.2 no navegador; depois F6, depois F9 parte 2.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.3 no navegador; depois a análise da F9 parte 2.
````

## Edicao 19 — `logs/2026-11-04.md` · secao do Code

Acrescente no FIM do arquivo `## Conversa 1 — Code (execucao, wo0005)` com o seu relatorio resumido. Nao altere a secao do chat.

---

## Fora de escopo

- F9 parte 2 (proxima; comeca por analise).
- `applySug`, importar, duplicar e transferir: nao mudam.
- Ordenar a lista por versao: a posicao dos blocos fica (DEC-015).

## Armadilhas desta WO

- `index.html` com glifos (`→`, `−`, `—`); ancoras recortadas por script. Aplique por script ou edicao exata. Arquivos LF.
- `syncVer` e `adjVer` passam a chamar `setBlockVersion` pelo nome global — e o nome que o embrulho troca. Nao chame a funcao por referencia guardada antes do embrulho.
- `tests/history.mjs`: a secao 13 entra ANTES da linha `console.log('\nLunoda — teste do historico (undo/redo)\n');`, como as secoes 11 e 12.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado — em vermelho, suspeite primeiro do instrumento.

- [ ] `git status --short` -> exatamente `M` em: `index.html meta/CHANGELOG.md meta/CONTEXT.md meta/DECISIONS.md meta/GLOSSARY.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md tests/README.md tests/history.mjs`, e `??` em `logs/2026-11-04.md` e nesta WO. Nada alem.
- [ ] `node tests/smoke.mjs` -> `28 ok, 0 falha(s)` · `node tests/history.mjs` -> `52 ok, 0 falha(s)` (39 antigas + 13 da secao 13).
- [ ] Sintaxe: `node -e "const t=require('fs').readFileSync('index.html','utf8');const m=[...t.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(x=>x[1]).sort((a,b)=>b.length-a.length)[0];new Function(m);console.log('SINTAXE_OK')"` -> `SINTAXE_OK`.
- [ ] `wc -l index.html` -> `3435`.
- [ ] Por LINHA (`grep -c`), -> 1: `"^function setBlockVersion("` · `"^function syncVer("` · `"^function adjVer("` · `"'applyPropToSelectedBlocks', 'setBlockVersion'\].forEach"` · `"setBlockVersion(bid, val);"` · `"setBlockVersion(bid, (b.version||1) + delta);"`. Codigo antigo -> 0: `"  b.version = Math.max(1, (b.version||1) + delta);"` · `"  const b = editBlocks.find(x=>x.id===bid); if (b) b.version = val;"`.
- [ ] Registro: `grep -c "^## DEC-021 " meta/DECISIONS.md` -> 1 · `grep -m2 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]` e `## [13.3.0] — 2026-11-04` · `grep -c "^> \*\*Status (2026-11-04):\*\* implementada na v13.3" meta/IDEAS.md` -> 1 · `grep -c "^## 🟢 F6" meta/ROADMAP.md` -> 1 · `grep -c "^\*\*Lunoda v13.3\*\*" meta/STATUS.md` -> 1 · `grep -c "Conferir a v13.2 no navegador" meta/STATUS.md` -> 0 · `grep -c "52 asserções" tests/README.md` -> 1.
- [ ] **Teste no navegador — NAO e seu.** Vai como roteiro ao autor. **Chega no ramo?** campo `.ver-num` -> `syncVer` -> `setBlockVersion`; `−/+` -> `adjVer` -> `setBlockVersion`. **Pergunta que os testes NAO respondem:** «presta com os dados reais dele?» — subtitulos com variacoes, muitas versoes.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0005.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html tests/history.mjs tests/README.md meta/DECISIONS.md meta/CHANGELOG.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md meta/CONTEXT.md meta/GLOSSARY.md logs/2026-11-04.md meta/workorders/261104-wo0005-v13-3-empurrao-de-versao.md
```

```
git commit -m "feat(versao): empurrao de versao no mesmo subtitulo, coberto pelo undo" -m "v13.3, fecha a F6. Numero de versao ocupado no mesmo subtitulo move os do intervalo; -/+ troca com o vizinho; so numeros mudam, nunca a posicao (DEC-015, DEC-021). Mudar a versao passa a entrar no undo. history.mjs ganha 13 assercoes."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-04 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
