# WO 0013 — Registro: v13.7 conferida pelo autor; log de 2026-11-09

> **Tipo:** DOC (registro). Sem codigo.
> **Config sugerida:** Sonnet, `/effort` baixo.
> **Pre-requisito:** HEAD `6a37cad` (wrap da wo0012), arvore limpa exceto `?? logs/2026-11-09.md` (gravado pelo chat) e `??` nesta WO. `sha1sum index.html` = `ca8abc7ccf8fcc51ca7b41c6eff7f1542f104452`.
> **Base:** conversa de 2026-11-09 — autor relatou «Roteiro v13.7: todos ok».
> **Canal dos meta neste ciclo = CODE** para STATUS e IDEAS. O log novo o chat ja gravou: so conferir e versionar.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** texto novo INTEIRO ja presente e ancora ausente (salvo ancora dentro do texto novo) -> PULE e diga.
> **Proximo comando:** nenhum.

**Arquivos que o chat gravou no disco e esta WO versiona** (`sha1sum` medido ao gravar):

```
fea3b20390d8ffbd6ca1b786cad571cd59a4002b  logs/2026-11-09.md
```

**Ancoras lidas em:** RECORTADAS por script do disco em `6a37cad` (2026-11-09 ~20:50), cada uma com `count == 1`; WO simulada lendo o proprio texto. Nenhuma remocao de linha; nenhuma ancora ou texto novo comeca ou termina em quebra de linha.

---

## 1. Por que

A v13.7 foi conferida pelo autor no navegador; o STATUS ainda a mostra como aguardando, e a falha de transporte inversa da aplicacao da wo0012 so existe no relatorio.

## Edicao 0 — conferir hashes e baseline

`git log -1 --format=%h` = `6a37cad`; `sha1sum -c` na linha acima -> `OK`; `sha1sum index.html` = `ca8abc7ccf8fcc51ca7b41c6eff7f1542f104452`. Divergencia: **PARE e reporte**.

## Edicao 1 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.7 aguardando a conferência do autor no navegador** (roteiro na conversa de 2026-11-07). v13.0 a v13.6 conferidas pelo autor (v13.6 em 2026-11-07 [relatado pelo dono]).
````

**Substituir por:**

````
- Nada em andamento. **v13.0 a v13.7 conferidas pelo autor** (v13.7 em 2026-11-09 [relatado pelo dono]). A próxima frente não foi decidida — opções em `logs/2026-11-07.md` (B, C, D, E).
````

## Edicao 2 — `meta/STATUS.md` · backlog: escolher a frente

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir a v13.7 no navegador** — roteiro na conversa de 2026-11-07: «co» acha «conversa» e não «acordo»; `*cor` acha «acordo»; o trecho de «transferencia de co» mostra «transferência» inteira; a nota da busca na lista do `?`.
````

**Substituir por:**

````
- [ ] **Escolher a próxima frente** — B (`.zip`, depende da conferência do frontmatter acima), C (`base_v4` ilegível), D (exportar só os blocos selecionados), E (arrastar blocos); detalhe em `logs/2026-11-07.md`.
````

## Edicao 3 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-07 (conversa nova)** — wo0011 conferida e arquivada com o brief. Escolhida a frente A; o autor decidiu a regra da busca (DEC-025): começo de palavra em todas as palavras, `*` na frente para «em qualquer parte», trecho na palavra mais longa sem partir a marca; a C ficou de fora. Entregue a v13.7 (wo0012).
````

**Substituir por:**

````
**2026-11-09** — wo0012 conferida (`3e88a60` + wrap `6a37cad`; smoke 113/0, history 52/0 no disco) e **roteiro v13.7 todo ok** [relatado pelo dono]. Antes, em 2026-11-07: frente A escolhida e a regra da busca decidida (DEC-025).
````

## Edicao 4 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** o autor confere a v13.7 pelo roteiro; depois, escolher a próxima frente entre B, C, D e E (`logs/2026-11-07.md`).
````

**Substituir por:**

````
**Próximo passo óbvio:** escolher a próxima frente entre B, C, D e E (`logs/2026-11-07.md`).
````

## Edicao 5 — `meta/IDEAS.md` · feedback para o Kit: transporte inverso

**Forma:** Substituir.

**Ancora:**

````
Sugestão ao kit: no template de WO, proibir âncora que comece/termine em quebra de linha e, quando a WO tiver escape `\u`, incluir a contagem de caracteres invisíveis na conferência.
````

**Substituir por:**

````
Sugestão ao kit: no template de WO, proibir âncora que comece/termine em quebra de linha e, quando a WO tiver escape `\u`, incluir a contagem de caracteres invisíveis na conferência.

### 2026-11-09 — A mesma falha de transporte, no sentido inverso, pega pelo hash
Na aplicação da wo0012, a ferramenta de edição do Code converteu acentos de 3 linhas de comentário em escapes `\uXXXX` literais — o contrário do item acima. Nenhum teste pegaria (era comentário). Pegou o `sha1sum` final do `index.html` que a WO previa a partir da simulação. Sugestão ao kit: WO de código traz sempre o hash final esperado de cada arquivo de código, medido na simulação; é a única conferência que cobre os dois sentidos.
````

---

## Fora de escopo

- Nada de codigo. CHANGELOG, DECISIONS e ROADMAP nao mudam (a v13.7 ja esta registrada).

---

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux).

- [ ] `git status --short` -> exatamente `M meta/IDEAS.md`, `M meta/STATUS.md`, `?? logs/2026-11-09.md` e `??` nesta WO. Nada alem.
- [ ] `sha1sum index.html` -> `ca8abc7ccf8fcc51ca7b41c6eff7f1542f104452` (inalterado) · smoke `113 ok, 0 falha(s)` · history `52 ok, 0 falha(s)`.
- [ ] `grep -c "" meta/STATUS.md meta/IDEAS.md` -> 62 · 274 · `grep -c "^- Nada em andamento. \*\*v13.0 a v13.7" meta/STATUS.md` -> 1 · `grep -c "^- \[ \] \*\*Conferir a v13.7" meta/STATUS.md` -> **0** · `grep -c "^### 2026-11-09 — A mesma falha" meta/IDEAS.md` -> 1.
- [ ] Combinantes literais (`node -e "const t=require('fs').readFileSync(process.argv[1],'utf8');let n=0;for(const c of t){const k=c.codePointAt(0);if(k>=0x300&&k<=0x36f)n++}console.log(n)" <arquivo>`): `meta/STATUS.md` 0 · `meta/IDEAS.md` 0 · `logs/2026-11-09.md` 0.
- [ ] Acrescente no FIM de `logs/2026-11-09.md`, com UMA linha em branco antes, `## Code (execucao, wo0013)` com o seu relatorio resumido (depois do `sha1sum -c` da Edicao 0).

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0013.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add meta/STATUS.md meta/IDEAS.md logs/2026-11-09.md meta/workorders/261109-wo0013-registro-v13-7-conferida.md
```

```
git commit -m "docs(meta): registra a v13.7 conferida pelo autor" -m "Roteiro v13.7 todo ok. STATUS sem nada em andamento; feedback para o Kit sobre a falha de transporte inversa pega pelo hash. Log de 2026-11-09. Sem mudanca de codigo."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-09 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
