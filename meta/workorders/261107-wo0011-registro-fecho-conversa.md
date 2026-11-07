# WO 0011 — registro do fecho da conversa de 3 a 7/11: v13.6 conferida, achado da busca, frente em aberto

> **Tipo:** DOC (STATUS, IDEAS, log). **Sem codigo:** `index.html` e testes nao mudam.
> **Config sugerida:** Sonnet, `/effort` baixo. Texto pronto e ancoras exatas; nenhuma decisao delegada.
> **Pre-requisito:** HEAD `117149d` (wrap da wo0010). `sha1sum index.html` = `7c3328e71a926421cc31040aed7ae1f875080ada` (so para conferir que nada mudou). Arvore limpa exceto `logs/2026-11-07.md` (NOVO, gravado pelo chat, hash abaixo) e esta WO. ANTES: smoke 101/0 e history 52/0.
> **Base:** pedido do autor em 2026-11-07: conferir a v13.6, trazer as opcoes da proxima frente e fechar a conversa com tudo registrado, commitado e enviado.
> **Depende de:** wo0010.
> **Canal dos meta neste ciclo = CODE** para STATUS, IDEAS e a secao do Code no log. O log do dia o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** antes de cada edicao, procure o texto NOVO INTEIRO; se ja esta e a ancora nao (salvo ancora dentro do texto novo), PULE e diga no relatorio.
> **Proximo comando:** nenhum.

**Arquivo que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
f74c3d6e495a0852dfd3caa90a93013402d7de7d  logs/2026-11-07.md
```

**Ancoras lidas em:** RECORTADAS por script de uma copia de `meta/STATUS.md` e `meta/IDEAS.md` em `117149d` (2026-11-07 ~09:10), cada uma com `count == 1`. A WO foi simulada lendo as edicoes deste proprio arquivo. Nenhuma ancora comeca ou termina em quebra de linha.

---

## 1. Por que

A conversa de 3 a 7/11 (v13.0 → v13.6) encerra com transferencia para uma conversa nova, que vai ler o repositorio. Tres fatos so existiam no chat: a v13.6 conferida pelo autor; o achado do autor sobre o trecho da busca (print + nota na pasta-pai); e que a proxima frente ficou em aberto. Esta WO os registra e commita.

## 2. Contexto factual

- **[relatado pelo dono, 2026-11-07]** Roteiro v13.6: todos ok — inclusive `Alt+↓/↑` e `Alt+Enter` no Chrome do Windows.
- **[medido por instrumento]** O defeito do trecho reproduz com as funcoes reais do `index.html`: busca «transferencia de co» -> `[co]nversa [co]m ASU: Estou retomando após [tra]…`. Nao corrigido aqui; vira ideia (Edicao 5).
- O log do dia (`logs/2026-11-07.md`, novo) ja traz as opcoes da proxima frente com a recomendacao.
- O brief de transferencia (`../261107-HANDOFF-BRIEF.md`) fica **fora** do repositorio e NAO entra no commit.

## Inventario

7 edicoes em 3 arquivos (+ 1 gravado pelo chat).

---

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `117149d`; `sha1sum index.html` = `7c3328e71a926421cc31040aed7ae1f875080ada`; `sha1sum -c` na linha acima -> `OK`. smoke `101 ok, 0 falha(s)`; history `52 ok, 0 falha(s)`. Divergencia: **PARE e reporte**.

## Edicao 1 — `meta/STATUS.md` · em progresso: nada

**Forma:** Substituir.

**Ancora:**

````
- **v13.6 aplicada pela wo0010 (`d033aed`); falta a conferência no navegador** — roteiro na conversa de 2026-11-06. v13.0 a v13.5.1 já conferidas pelo autor.
````

**Substituir por:**

````
- Nada em andamento. **v13.0 a v13.6 conferidas pelo autor** (v13.6 em 2026-11-07 [relatado pelo dono]). A próxima frente não foi decidida — opções e recomendação em `logs/2026-11-07.md`.
````

## Edicao 2 — `meta/STATUS.md` · backlog: escolher a frente

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.6 no navegador** (roteiro na conversa de 2026-11-06) — em especial `Alt+↓/↑` e `Alt+Enter` no Chrome do Windows, que o Chromium do container não reproduz.
````

**Substituir por:**

````
- [ ] **Escolher a próxima frente** — opções em `logs/2026-11-07.md` (recomendada: A, refino do trecho da busca). Ponto em aberto da A: palavra da busca casa só no começo de palavra, ou em qualquer parte sem destacar as de 1–2 letras, ou as duas?
````

## Edicao 3 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-06** — v13.5 conferida pelo autor. Frente escolhida: testes do núcleo. Entregues 26 asserções no smoke e duas correções que elas acharam (FIX-004: entrada sem blocos; FIX-005: mescla perdia opções), como **v13.5.1** pela wo0009. Achado registrado sem corrigir: `base_v4` ilegível cai para a chave legada (IDEAS). Depois: v13.5.1 conferida; análise da F10 medida (a busca já alcançava o conteúdo; `Ctrl+N` morto; `P` capturando `Ctrl+P`) e decidida com o autor (1a, 2a, 3a, 4a); entregue como **v13.6** pela wo0010 (DEC-024).
````

**Substituir por:**

````
**2026-11-07** — v13.6 conferida pelo autor [relatado pelo dono]. Achado do dono num print: com «transferencia de co», o trecho se ancora na primeira palavra («co») e corta a longa («tra…»); reproduzido e registrado no IDEAS, não corrigido. Encerrada a conversa de 3 a 7/11 (v13.0 → v13.6, wo0001 a wo0011) com transferência: brief `../261107-HANDOFF-BRIEF.md`, fora do repositório.
````

## Edicao 4 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** conferir a v13.6 no navegador; depois escolher a próxima frente (F9 `.zip`, a ideia da `base_v4` ilegível, ou as pendências do autor no backlog).
````

**Substituir por:**

````
**Próximo passo óbvio:** na conversa nova, escolher a próxima frente (A recomendada) e responder o ponto em aberto da busca.
````

## Edicao 5 — `meta/IDEAS.md` · ideia nova do autor: trecho da busca

**Forma:** Substituir (ancora repetida no inicio).

**Ancora:**

````
> Fonte: conversa de 2026-11-06. **Status:** implementada na v13.6 (DEC-024) — vale para `.json` e `.md` — ver Concluídas.
````

**Substituir por:**

````
> Fonte: conversa de 2026-11-06. **Status:** implementada na v13.6 (DEC-024) — vale para `.json` e `.md` — ver Concluídas.

### 2026-11 — Trecho da busca: palavra curta acende em tudo e a longa sai cortada
Print do autor buscando «transferencia de co»: o «co» acende em «conversa» e «com», e «transferência» aparece cortada como «tra…». Reproduzido com as funções reais: tokens `transferencia`, `de`, `co`; trecho `[co]nversa [co]m ASU: Estou retomando após [tra]…`. Três causas: (1) a janela do trecho se ancora na **primeira** palavra encontrada, não na mais informativa; (2) o raio de 40 caracteres corta a palavra e **parte a marca**; (3) palavra de 1–2 letras casa como pedaço de qualquer palavra. Proposta: ancorar na palavra mais longa, estender a janela até o fim da marca e decidir o tratamento das palavras curtas — (a) casar só no começo de palavra (recomendado); (b) casar em qualquer parte, sem destacar as de 1–2 letras; (c) as duas.
> Fonte: conversa de 2026-11-07, nota `261107-0845.txt` e print do autor (arquivados em `notas-arquivadas`). **Status:** aberta — opção A da próxima frente (`logs/2026-11-07.md`).
````

## Edicao 6 — `meta/IDEAS.md` · Feedback para o Kit: falhas de transporte

**Forma:** ACRESCENTAR NO FIM DO ARQUIVO (sem ancora: o fim do arquivo e a secao «Feedback para o Kit»). Garanta UMA linha em branco entre o fim atual e o texto abaixo.

**Texto:**

````

### 2026-11-07 — Duas falhas de transporte do assistente, pegas só por conferência mecânica
1. **Escape `\u` virando caractere:** o `\u0300-\u036f` que o assistente escrevia chegava ao arquivo como os próprios caracteres combinantes (duas vezes na v13.6; heredoc com aspas não evitou). O código funcionava — nenhum teste falharia —; foi pego por um pente que compara a contagem de caracteres U+0300–U+036F antes e depois. A WO passou a trazer essa contagem na conferência.
2. **Âncora com quebra de linha na borda:** na wo0008 (Edição 20) a âncora terminava em `\n` e, dentro do bloco cercado, isso parecia uma linha em branco a mais; o Code fugiu do texto para aplicar. O gerador de WO do chat passou a recusar âncora ou texto novo que comece ou termine em quebra de linha.
Sugestão ao kit: no template de WO, proibir âncora que comece/termine em quebra de linha e, quando a WO tiver escape `\u`, incluir a contagem de caracteres invisíveis na conferência.
````

## Edicao 7 — `logs/2026-11-07.md` · secao do Code

Acrescente no FIM do arquivo (o chat ja o criou) `## Conversa 1 — Code (execucao, wo0011)` com o seu relatorio resumido.

---

## Fora de escopo

- Qualquer mudanca no `index.html` ou nos testes: NAO (o refino da busca e a frente A, ainda nao decidida).
- O brief `../261107-HANDOFF-BRIEF.md`: fica fora do repositorio; NAO copiar, NAO versionar.
- CHANGELOG, DECISIONS, ROADMAP: nada a mudar (nenhuma entrega, nenhuma decisao).

## Armadilhas desta WO

- A Edicao 6 acrescenta no FIM do `meta/IDEAS.md` (a secao «Feedback para o Kit» e a ultima do arquivo). O texto contem os escapes `\u0300-\u036f` e `\n` como TEXTO (barra invertida + letra); se a sua ferramenta os transformar em caractere, a conferencia abaixo pega.

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio.

- [ ] `git status --short` -> exatamente `M` em `meta/IDEAS.md meta/STATUS.md`, e `??` em `logs/2026-11-07.md` e nesta WO. Nada alem (o `index.html` NAO aparece).
- [ ] smoke `101 ok, 0 falha(s)` · history `52 ok, 0 falha(s)` · `sha1sum index.html` -> `7c3328e71a926421cc31040aed7ae1f875080ada` (inalterado).
- [ ] `grep -c "^### 2026-11 — Trecho da busca\|^### 2026-11-07 — Duas falhas" meta/IDEAS.md` -> 2 · `grep -c "^\*\*2026-11-07\*\* — v13.6 conferida\|^- Nada em andamento\|^- \[ \] \*\*Escolher a próxima frente" meta/STATUS.md` -> 3 · `grep -c "Conferir a v13.6" meta/STATUS.md` -> 0.
- [ ] Escapes como texto: `grep -c 'u0300-' meta/IDEAS.md` -> 1 · caracteres combinantes literais: `node -e "const t=require('fs').readFileSync('meta/IDEAS.md','utf8');console.log((t.match(/[\u0300-\u036f]/g)||[]).length)"` -> 0.
- [ ] `grep -c "" meta/STATUS.md meta/IDEAS.md logs/2026-11-07.md` -> 61 · 258 · 39 (o log, ANTES da secao do Code).

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · arquivos tocados · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0011.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add meta/STATUS.md meta/IDEAS.md logs/2026-11-07.md meta/workorders/261107-wo0011-registro-fecho-conversa.md
```

```
git commit -m "docs(meta): registra o fecho da conversa de 3 a 7/11" -m "v13.6 conferida pelo autor; achado do trecho da busca no IDEAS; proxima frente em aberto, opcoes no log de 2026-11-07. Sem mudanca de codigo."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-07 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
