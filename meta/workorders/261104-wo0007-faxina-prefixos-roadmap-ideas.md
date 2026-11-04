# WO 0007 — faxina: prefixos `lunoda_` nos exports, README do produto, ROADMAP e IDEAS em ordem

> **Tipo:** mista — CODIGO (`index.html`: so nomes de arquivo exportado) + DOC (CONTEXT, ROADMAP, IDEAS, CHANGELOG, STATUS, README, Instrucoes).
> **Config sugerida:** Sonnet, `/effort` medio. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** a **wo0006 aplicada** (as ancoras foram recortadas do resultado dela). `sha1sum index.html` = `91bf815d3044b9255e79015c37ebcf9ac723dd9e` (o da wo0006). Arvore limpa exceto `README.md` e `INSTRUCOES-DO-PROJETO.md` (gravados pelo chat, hashes abaixo) e esta WO. ANTES: smoke 46/0 e history 52/0.
> **Base:** faxina aprovada pelo autor em 2026-11-04 (renomear prefixos, titulos defasados do ROADMAP, higiene do IDEAS) + README do produto, que estava na v12.
> **Depende de:** wo0006.
> **Canal dos meta neste ciclo = CODE** para CONTEXT, ROADMAP, IDEAS, CHANGELOG e STATUS (todas as edicoes abaixo). README e Instrucoes o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**. Nas «SUBSTITUIR TODAS», a contagem ANTES tem de bater.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio. Edicoes de REMOCAO: o texto novo e um pedaco da ancora.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
84dff954900c6afe91bb015c2b80896ab284e4a2  README.md
d1f02b6c0caa5e1d4b3ffb493afb5e5f912e6cba  INSTRUCOES-DO-PROJETO.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia do repositorio com a wo0006 aplicada a partir do texto dela (2026-11-04 ~13:00), e conferidas com `count == 1` (ou a contagem declarada). A wo0006 + esta WO foram simuladas em sequencia, lendo as edicoes dos proprios arquivos.

---

## 1. Por que

Itens de faxina que o autor aprovou: o export ainda saia com o prefixo do nome antigo (`base_`); tres titulos do ROADMAP diziam «falta conferir» de fases ja conferidas; o IDEAS tinha quatro ideias fora da secao delas e seis ideias do assistente sem o status de resolvidas. E o `README.md` do produto ainda descrevia a v12, com `Lunoda_v12.html`, guias e docs na raiz.

## 2. Contexto factual

- **Medido:** `grep -n "base_" index.html` (sem `base_v4`/`base_notas_vN`, que sao chaves de dados) = 5 pontos, todos nomes de arquivo de `dl(...)`: `'base_selecionados_'` x2, `'base_backup_'` x1, `'base_notas_'` x2. A importacao le o conteudo, nao o nome. `.gitignore` ja ignora `lunoda_*` e `base_*`.
- **Medido:** a chave `STORAGE_KEY = 'base_v4'` **nao** e tocada (renomear apagaria os dados — armadilha do CONTEXT).
- **Medido:** Instrucoes sem a linha da armadilha `base_` = 6.506 caracteres (`LC_ALL=C.UTF-8 wc -m`), teto ~6.900. **O autor precisa colar o arquivo novo no painel do Projeto.**
- IDEAS: «Reimportar `.md`» e «Estender o smoke» estavam depois de «Descartadas»; «.zip» e «Embrulho de funções» dentro de «Feedback para o Kit». Vao para «Ativas — Assistente», com status. MOVER em duas metades: Edicoes de remocao primeiro, insercao depois.

## Inventario

23 edicoes em 6 arquivos (+ 2 gravados pelo chat). Codigo: 3 «SUBSTITUIR TODAS» no `index.html` (5 ocorrencias). Os pontos sairam do `grep` acima; nenhum outro arquivo do repositorio monta nome de export.

---

## Edicao 0 — conferir hashes e baseline

`sha1sum index.html` = `91bf815d3044b9255e79015c37ebcf9ac723dd9e`, e `sha1sum -c` nas 2 linhas acima -> `OK`. smoke `46 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `index.html` · prefixo 'base_selecionados_' -> lunoda_

**Forma:** SUBSTITUIR TODAS AS OCORRENCIAS (texto literal). Contagem ANTES: **2** — `grep -o "'base_selecionados_'" index.html | wc -l`; diferente: PARE. Depois: 0.

**Trecho:**

````
'base_selecionados_'
````

**Por:**

````
'lunoda_selecionados_'
````

## Edicao 2 — `index.html` · prefixo 'base_backup_' -> lunoda_

**Forma:** SUBSTITUIR TODAS AS OCORRENCIAS (texto literal). Contagem ANTES: **1** — `grep -o "'base_backup_'" index.html | wc -l`; diferente: PARE. Depois: 0.

**Trecho:**

````
'base_backup_'
````

**Por:**

````
'lunoda_backup_'
````

## Edicao 3 — `index.html` · prefixo 'base_notas_' -> lunoda_

**Forma:** SUBSTITUIR TODAS AS OCORRENCIAS (texto literal). Contagem ANTES: **2** — `grep -o "'base_notas_'" index.html | wc -l`; diferente: PARE. Depois: 0.

**Trecho:**

````
'base_notas_'
````

**Por:**

````
'lunoda_notas_'
````

## Edicao 4 — `meta/CONTEXT.md` · CONTEXT: prefixos

**Forma:** Substituir.

**Ancora:**

````
- **Prefixos de exportação** — arquivos exportados usam prefixo `base_` no nome (`base_backup_`, `base_notas_`, `base_selecionados_`) — resquício do nome antigo. Ver IDEAS (renomear para `lunoda_`).
````

**Substituir por:**

````
- **Prefixos de exportação** — desde a v13.4.1 os arquivos saem como `lunoda_backup_`, `lunoda_notas_`, `lunoda_selecionados_`; exports antigos têm `base_`. O nome do arquivo não importa para a importação (que lê o conteúdo) e o `.gitignore` cobre os dois. A chave `base_v4` do `localStorage` **não** mudou (ver acima).
````

## Edicao 5 — `meta/ROADMAP.md` · titulo: ## 🟢 F4 —

**Forma:** Substituir.

**Ancora:**

````
## 🟢 F4 — UX de propriedades avançada + conforto de edição *(entregue — v13.0 e v13.1; v13.1 falta conferir no navegador)*
````

**Substituir por:**

````
## 🟢 F4 — UX de propriedades avançada + conforto de edição *(concluída — v13.0 e v13.1)*
````

## Edicao 6 — `meta/ROADMAP.md` · titulo: ## 🟢 F6 —

**Forma:** Substituir.

**Ancora:**

````
## 🟢 F6 — Reordenação por número de versão *(entregue — v13.3; falta conferir no navegador)*
````

**Substituir por:**

````
## 🟢 F6 — Reordenação por número de versão *(concluída — v13.3)*
````

## Edicao 7 — `meta/ROADMAP.md` · titulo: ## 🟢 F12 —

**Forma:** Substituir.

**Ancora:**

````
## 🟢 F12 — Legibilidade e ergonomia do editor *(entregue — v13.2; falta conferir no navegador)*
````

**Substituir por:**

````
## 🟢 F12 — Legibilidade e ergonomia do editor *(concluída — v13.2)*
````

## Edicao 8 — `meta/ROADMAP.md` · titulo: ## 🟡 F9 —

**Forma:** Substituir.

**Ancora:**

````
## 🟡 F9 — Interoperabilidade do export *(parte 1 entregue na v12.3)*
````

**Substituir por:**

````
## 🟡 F9 — Interoperabilidade do export *(partes 1 e 2 entregues — v12.3 e v13.4; resta o `.zip`)*
````

## Edicao 9 — `meta/IDEAS.md` · MOVER 1/4 — remove as ideias soltas depois de Descartadas

**Forma:** Remover o bloco inteiro (texto novo vazio).

**Ancora:**

````

---

### 2026-07-19 — Reimportar `.md` (não só JSON)
Com os delimitadores da DEC-008, o `.md` exportado passou a ser **parseável**: dá para reconstruir entradas, blocos e propriedades a partir dele. Hoje só o JSON reimporta. Seria a rede de segurança definitiva — o usuário poderia recuperar o acervo a partir do arquivo que ele de fato guarda e lê. Depende da F9 (frontmatter) para recuperar os metadados com fidelidade.

### 2026-07-19 — Estender o smoke conforme o risco crescer
O `tests/smoke.mjs` cobre só `entryToMD`. Candidatas naturais, por ordem de risco: `calcPropertyValues` (núcleo do modelo), `migrateOptionModes` e `loadDB` (migração de formatos antigos — quebrar ali inutiliza backups), `moveSelectedBlocks` (algoritmo com caso de borda). Todas são puras ou quase.

````

**Substituir por:**

````

````

## Edicao 10 — `meta/IDEAS.md` · MOVER 2/4 — remove .zip e embrulho do Feedback para o Kit

**Forma:** Remover (sobra a ancora final).

**Ancora:**

````
### 2026-07-19 — Embrulho de funções: registrar como padrão do projeto?
A DEC-010 embrulhou 11 mutadores em vez de editá-los um a um. Funcionou bem e o diff ficou minúsculo. Se o padrão se repetir (ex.: para telemetria de uso, ou para marcar "sujo" no editor), vale promovê-lo a convenção no CONTEXT — com a ressalva de que depende de declaração de função no topo do script.

### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
O frontmatter da v12.3 só é lido como metadado num arquivo que contenha **uma** entrada. Para jogar o acervo inteiro num vault do Obsidian, o usuário precisaria exportar entrada por entrada. Um `.zip` com um `.md` por entrada resolveria — mas exige biblioteca de compressão, o que contraria o zero-dependência da DEC-001.
Alternativas a avaliar: (a) escrever um zip mínimo à mão (formato *stored*, sem compressão, é simples o bastante); (b) disparar vários downloads em sequência; (c) aceitar a limitação e documentar. A opção (a) é a única que mantém o zero-dependência **e** entrega o resultado.

### 2026-07-19 — Segunda vez que um teste apontou para o lugar errado
````

**Substituir por:**

````
### 2026-07-19 — Segunda vez que um teste apontou para o lugar errado
````

## Edicao 11 — `meta/IDEAS.md` · MOVER 3/4 — as quatro ideias entram em Ativas — Assistente

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````

---

## ⚠️ Análise de conflitos e questões abertas — v13
````

**Substituir por:**

````

### 2026-07-19 — Reimportar `.md` (não só JSON)
> **Status (2026-11-04):** implementada na v13.4 (DEC-022) — ver Concluídas.
Com os delimitadores da DEC-008, o `.md` exportado passou a ser **parseável**: dá para reconstruir entradas, blocos e propriedades a partir dele. Hoje só o JSON reimporta. Seria a rede de segurança definitiva — o usuário poderia recuperar o acervo a partir do arquivo que ele de fato guarda e lê. Depende da F9 (frontmatter) para recuperar os metadados com fidelidade.

### 2026-07-19 — Estender o smoke conforme o risco crescer
> **Status (2026-11-04):** em parte — o smoke cobre export e reimportação; o `history.mjs` cobre uniformizar, quadrado geral e empurrão. Seguem sem teste `calcPropertyValues`, `migrateOptionModes` e `loadDB`.
O `tests/smoke.mjs` cobre só `entryToMD`. Candidatas naturais, por ordem de risco: `calcPropertyValues` (núcleo do modelo), `migrateOptionModes` e `loadDB` (migração de formatos antigos — quebrar ali inutiliza backups), `moveSelectedBlocks` (algoritmo com caso de borda). Todas são puras ou quase.

### 2026-07-19 — Exportar um arquivo por entrada (`.zip`)
> **Status (2026-11-04):** aberta — único item restante da F9.
O frontmatter da v12.3 só é lido como metadado num arquivo que contenha **uma** entrada. Para jogar o acervo inteiro num vault do Obsidian, o usuário precisaria exportar entrada por entrada. Um `.zip` com um `.md` por entrada resolveria — mas exige biblioteca de compressão, o que contraria o zero-dependência da DEC-001.
Alternativas a avaliar: (a) escrever um zip mínimo à mão (formato *stored*, sem compressão, é simples o bastante); (b) disparar vários downloads em sequência; (c) aceitar a limitação e documentar. A opção (a) é a única que mantém o zero-dependência **e** entrega o resultado.

### 2026-07-19 — Embrulho de funções: registrar como padrão do projeto?
> **Status (2026-11-04):** o padrão se repetiu duas vezes depois da DEC-010 (`applyPropToSelectedBlocks` na DEC-013, `setBlockVersion` na DEC-021), sem atrito: basta o nome na lista. O CONTEXT cita a lista no empurrão e nos «Arquivos Críticos» (`tests/history.mjs`). Promover a convenção escrita fica para o próximo caso.
A DEC-010 embrulhou 11 mutadores em vez de editá-los um a um. Funcionou bem e o diff ficou minúsculo. Se o padrão se repetir (ex.: para telemetria de uso, ou para marcar "sujo" no editor), vale promovê-lo a convenção no CONTEXT — com a ressalva de que depende de declaração de função no topo do script.

---

## ⚠️ Análise de conflitos e questões abertas — v13
````

## Edicao 12 — `meta/IDEAS.md` · status:  Renomear prefixos de exportação de `base_` 

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-05 — Renomear prefixos de exportação de `base_` para `lunoda_`
````

**Substituir por:**

````
### 2026-07-05 — Renomear prefixos de exportação de `base_` para `lunoda_`
> **Status (2026-11-04):** implementada na v13.4.1 — ver Concluídas.
````

## Edicao 13 — `meta/IDEAS.md` · status:  Migrar `STORAGE_KEY` com cuidado (ou deixar

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-05 — Migrar `STORAGE_KEY` com cuidado (ou deixar como está)
````

**Substituir por:**

````
### 2026-07-05 — Migrar `STORAGE_KEY` com cuidado (ou deixar como está)
> **Status (2026-11-04):** mantida como está — risco de perder dados sem ganho para o usuário.
````

## Edicao 14 — `meta/IDEAS.md` · status:  Sugestões de resolução dos conflitos das id

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-05 — Sugestões de resolução dos conflitos das ideias da v13 (abaixo)
````

**Substituir por:**

````
### 2026-07-05 — Sugestões de resolução dos conflitos das ideias da v13 (abaixo)
> **Status (2026-11-03):** C1, C2 e Q1 resolvidos (DEC-013/014/015); C3 adiada com a F5.
````

## Edicao 15 — `meta/IDEAS.md` · status:  Teto do `localStorage` (~5 MB): medir agora

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-19 — Teto do `localStorage` (~5 MB): medir agora, migrar depois *(fundamentada em pesquisa)*
````

**Substituir por:**

````
### 2026-07-19 — Teto do `localStorage` (~5 MB): medir agora, migrar depois *(fundamentada em pesquisa)*
> **Status:** passos 1 e 2 na v12.1 (aviso aos 80%, cota no `saveDB`, `persist()`); passo 3 (IndexedDB) adiado — ver Adiadas e ROADMAP F11.
````

## Edicao 16 — `meta/IDEAS.md` · status:  Exportar Markdown com YAML frontmatter *(fu

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-19 — Exportar Markdown com YAML frontmatter *(fundamentada em pesquisa)*
````

**Substituir por:**

````
### 2026-07-19 — Exportar Markdown com YAML frontmatter *(fundamentada em pesquisa)*
> **Status:** implementada na v12.3 (DEC-011) — ver Concluídas.
````

## Edicao 17 — `meta/IDEAS.md` · status:  Undo/redo no editor

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
### 2026-07-19 — Undo/redo no editor
````

**Substituir por:**

````
### 2026-07-19 — Undo/redo no editor
> **Status:** implementada na v12.2 (DEC-010) — ver Concluídas.
````

## Edicao 18 — `meta/IDEAS.md` · MOVER 4/4 — Concluidas: prefixos

**Forma:** Substituir.

**Ancora:**

````
## ✅ Concluídas

- **Reimportar o `.md` exportado** — v13.4 / DEC-022. Fecha a F9 parte 2.
````

**Substituir por:**

````
## ✅ Concluídas

- **Prefixos de exportação `lunoda_`** — v13.4.1.
- **Reimportar o `.md` exportado** — v13.4 / DEC-022. Fecha a F9 parte 2.
````

## Edicao 19 — `meta/CHANGELOG.md` · [13.4.1] acima da 13.4

**Forma:** Substituir (ancora repetida no fim).

**Ancora:**

````
## [13.4.0] — 2026-11-04
````

**Substituir por:**

````
## [13.4.1] — 2026-11-04

### Modificado
- Arquivos exportados com prefixo **`lunoda_`** (`lunoda_backup_`, `lunoda_notas_`, `lunoda_selecionados_`) no lugar do antigo `base_`. A importação lê o conteúdo, não o nome: arquivos antigos seguem importando. A chave `base_v4` do `localStorage` não muda.
- `README.md` do produto atualizado para a v13 (estava na v12, com estrutura e fluxo antigos).

## [13.4.0] — 2026-11-04
````

## Edicao 20 — `meta/STATUS.md` · backlog: higiene feita

**Forma:** Remover a linha.

**Ancora:**

````
- [ ] **Higiene do IDEAS** — ideias já implementadas (teto do `localStorage`, frontmatter, undo/redo) seguem também em «Ideias Ativas — Assistente», e três ideias ativas (reimportar `.md`, estender o smoke, exportar `.zip`) estão fora da seção delas (sob «Descartadas» e «Feedback para o Kit»). Curadoria por WO própria.

````

**Substituir por:**

````

````

## Edicao 21 — `meta/STATUS.md` · backlog: faxina feita

**Forma:** Remover a linha.

**Ancora:**

````
- [ ] **Faxina** — `base_` → `lunoda_` nos arquivos exportados, títulos defasados do ROADMAP, higiene do IDEAS: wo0007, já escrita.

````

**Substituir por:**

````

````

## Edicao 22 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.4 no navegador; aplicar a wo0007 (faxina); depois o lembrete de backup JSON.
````

**Substituir por:**

````
**Próximo passo óbvio:** conferir a v13.4 no navegador; depois o lembrete de backup JSON.
````

## Edicao 23 — `meta/STATUS.md` · versao atual

**Forma:** Substituir.

**Ancora:**

````
**Lunoda v13.4** — 2026-11-04 — reimportar o Markdown exportado (F9 parte 2). Arquivo canônico `index.html`. Testes: `smoke` 46/46 e `history` 52/52 (rodada da wo0006).
````

**Substituir por:**

````
**Lunoda v13.4.1** — 2026-11-04 — reimportar o Markdown exportado (F9 parte 2) + faxina (prefixos `lunoda_`, README). Arquivo canônico `index.html`. Testes: `smoke` 46/46 e `history` 52/52 (rodada da wo0007).
````

## Edicao 24 — `logs/2026-11-04.md` · secao do Code

Acrescente no FIM do arquivo `## Conversa 1 — Code (execucao, wo0007)` com o seu relatorio resumido.

---

## Fora de escopo

- `STORAGE_KEY = 'base_v4'` e as chaves legadas de migracao: NAO mexer.
- O `.gitignore` (ja cobre os dois prefixos).
- Conteudo das ideias movidas no IDEAS: so muda de lugar e ganha status.

## Armadilhas desta WO

- Aplique **depois** da wo0006: as ancoras do STATUS, IDEAS e CHANGELOG sao o texto que ela insere.
- Edicoes 9 e 10 removem blocos que as Edicoes 11 reinsere (MOVER). Ordem: 9, 10, 11.
- As «SUBSTITUIR TODAS» sao de texto literal com as aspas simples (`'base_backup_'`), para nao pegar `base_v4`.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux); o Git Bash do Code nao foi testado.

- [ ] `git status --short` -> exatamente `M` em: `INSTRUCOES-DO-PROJETO.md README.md index.html logs/2026-11-04.md meta/CHANGELOG.md meta/CONTEXT.md meta/IDEAS.md meta/ROADMAP.md meta/STATUS.md`, e `??` nesta WO. Nada alem.
- [ ] smoke `46 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · sintaxe `SINTAXE_OK` (mesmo comando da wo0006) · `wc -l index.html` -> `3661` (nomes trocados na mesma linha).
- [ ] Ocorrencias (`grep -o ... | wc -l`): `"'base_selecionados_'"` 0 · `"'base_backup_'"` 0 · `"'base_notas_'"` 0 · `"'lunoda_selecionados_'"` 2 · `"'lunoda_backup_'"` 1 · `"'lunoda_notas_'"` 2 · `"base_v4"` **1** (a chave de dados NAO pode mudar).
- [ ] IDEAS: `grep -c "^### 2026-07-19 — Reimportar\|^### 2026-07-19 — Estender o smoke\|^### 2026-07-19 — Exportar um arquivo por entrada\|^### 2026-07-19 — Embrulho de funções" meta/IDEAS.md` -> **4** (cada uma uma vez: nada duplicou no MOVER) · `grep -c "" meta/IDEAS.md` -> `229`.
- [ ] `grep -c "falta conferir no navegador" meta/ROADMAP.md` -> 0 · `grep -m3 "^## \[" meta/CHANGELOG.md` -> `## [Não lançado]`, `## [13.4.1] — 2026-11-04`, `## [13.4.0] — 2026-11-04` · `grep -c "^\*\*Lunoda v13.4.1\*\*" meta/STATUS.md` -> 1 · `grep -c "^- \[ \] \*\*Higiene do IDEAS\*\*\|^- \[ \] \*\*Faxina\*\*" meta/STATUS.md` -> 0.
- [ ] **Teste no navegador — NAO e seu.** O autor exporta um JSON e confere o nome `lunoda_backup_AAAA-MM-DD.json`.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0007.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add index.html README.md INSTRUCOES-DO-PROJETO.md meta/CONTEXT.md meta/ROADMAP.md meta/IDEAS.md meta/CHANGELOG.md meta/STATUS.md logs/2026-11-04.md meta/workorders/261104-wo0007-faxina-prefixos-roadmap-ideas.md
```

```
git commit -m "chore: prefixos lunoda_ nos exports, README da v13, ROADMAP e IDEAS em ordem" -m "v13.4.1. Arquivos exportados com lunoda_ no lugar de base_ (a chave base_v4 nao muda). README do produto atualizado. Titulos defasados do ROADMAP corrigidos; quatro ideias movidas para a secao certa do IDEAS e status nas resolvidas. Instrucoes sem a armadilha obsoleta."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-04 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
