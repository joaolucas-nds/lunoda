# WO 0015 — Registro: v13.8 conferida; Obsidian e `.zip` adiados pelo autor

> **Tipo:** DOC (registro). Sem codigo.
> **Config sugerida:** Sonnet, `/effort` baixo.
> **Pre-requisito:** HEAD `e179b46` (wrap da wo0014), arvore limpa exceto `??` nesta WO. `sha1sum index.html` = `f56d0f2e06d9abbe204f611c9d7194df8af10b7a`.
> **Base:** conversa de 2026-11-10 — autor: «Roteiro v13.8: todos ok» e «deixemos o Obsidian para outro momento, como ideia para retomar caso surja a necessidade».
> **Canal dos meta neste ciclo = CODE** para STATUS, IDEAS, ROADMAP e log.
> **Ancora semantica:** trecho que nao bater EXATAMENTE -> **PARE e reporte**.
> **Idempotencia:** texto novo INTEIRO ja presente e ancora ausente (salvo ancora dentro do texto novo) -> PULE e diga.
> **Proximo comando:** nenhum.

**Ancoras lidas em:** RECORTADAS por script do disco em `e179b46` (2026-11-10 ~12:50), cada uma com `count == 1`; WO simulada lendo o proprio texto. A Edicao 2 troca CINCO linhas seguidas do backlog por tres (o item do Obsidian e os dois da v13.8 saem; o dos prints perde «propriedades renderizadas no Obsidian»). Nenhuma ancora ou texto novo comeca ou termina em quebra de linha.

---

## 1. Por que

A v13.8 foi conferida pelo autor, e ele adiou o Obsidian e a B (`.zip`). O STATUS ainda a mostra aguardando e mantem a conferencia do Obsidian como pendencia; o passo a passo dela so existia no chat.

## Edicao 0 — conferir baseline

`git log -1 --format=%h` = `e179b46`; `sha1sum index.html` = `f56d0f2e06d9abbe204f611c9d7194df8af10b7a`. Divergencia: **PARE e reporte**.

## Edicao 1 — `meta/STATUS.md` · em progresso

**Forma:** Substituir.

**Ancora:**

````
- **v13.8 aguardando a conferência do autor no navegador** (roteiro na conversa de 2026-11-10). v13.0 a v13.7 conferidas pelo autor (v13.7 em 2026-11-09 [relatado pelo dono]).
````

**Substituir por:**

````
- Nada em andamento. **v13.0 a v13.8 conferidas pelo autor** (v13.8 em 2026-11-10 [relatado pelo dono]). A próxima frente não foi decidida — opções na conversa de 2026-11-10 (`logs/2026-11-10.md`).
````

## Edicao 2 — `meta/STATUS.md` · backlog: Obsidian adiado, v13.8 conferida

**Forma:** Substituir.

**Ancora:**

````
- [ ] **Conferir o frontmatter no Obsidian** (nunca testado em navegador) — exportar UMA entrada pelo botão MD do editor, jogar num vault e ver as propriedades como campos; depois desmarcar o checkbox no modal e confirmar que volta ao Markdown simples.
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; propriedades renderizadas no Obsidian.
- [ ] **Conferir a v13.8 no navegador** — roteiro na conversa de 2026-11-10: exportar 2 blocos em MD e HTML, pedido de salvar com mudança pendente, reimportar o `.md` parcial, e a chave ilegível numa janela anônima.
- [ ] **Depois: escolher a próxima frente** — B (`.zip`, depende da conferência do frontmatter acima) ou E (arrastar blocos); detalhe em `logs/2026-11-07.md`.
````

**Substituir por:**

````
- [ ] **Conferir o undo/redo no navegador** — excluir blocos em massa e `Ctrl+Z`; `Ctrl+Z` dentro de campo de texto desfaz a digitação, não a estrutura; botões esmaecidos sem histórico; abrir outra entrada zera o histórico.
- [ ] **Prints para o README** — cabeçalho do editor com Desfazer/Refazer; modal de exportação com o checkbox de frontmatter; barra de seleção de blocos com MD e HTML.
- [ ] **Escolher a próxima frente** — E (arrastar blocos) ou outro item da F7 (entrada favorita/fixada, cor da entrada, histórico de versões de bloco); opções em `logs/2026-11-10.md`. Obsidian e `.zip` adiados pelo autor (IDEAS, «Adiadas»).
````

## Edicao 3 — `meta/STATUS.md` · ultima conversa

**Forma:** Substituir.

**Ancora:**

````
**2026-11-10** — wo0013 conferida (`42cc085`). O autor escolheu as frentes D e C juntas: entregue a v13.8 (wo0014, DEC-026, commit `37cd070`). Passo a passo da conferência do frontmatter no Obsidian (desbloqueia a B) entregue no chat.
````

**Substituir por:**

````
**2026-11-10** — wo0013 conferida (`42cc085`). O autor escolheu as frentes D e C juntas: entregue a v13.8 (wo0014, DEC-026, commit `37cd070`) e **roteiro v13.8 todo ok** [relatado pelo dono]. O autor **adiou o Obsidian e a B** (`.zip`) até precisar ou dominar o Obsidian; o passo a passo da conferência ficou no log do dia.
````

## Edicao 4 — `meta/STATUS.md` · proximo passo

**Forma:** Substituir.

**Ancora:**

````
**Próximo passo óbvio:** o autor confere a v13.8 pelo roteiro; quando puder, confere o frontmatter no Obsidian (passo a passo de 2026-11-10) para destravar a B.
````

**Substituir por:**

````
**Próximo passo óbvio:** escolher a próxima frente (E ou outro item da F7; `logs/2026-11-10.md`).
````

## Edicao 5 — `meta/IDEAS.md` · ideia do .zip: adiada

**Forma:** Substituir.

**Ancora:**

````
> **Status (2026-11-04):** aberta — único item restante da F9.
````

**Substituir por:**

````
> **Status (2026-11-10):** adiada pelo autor — ver «Adiadas». Observado num print do autor (export «Exportar tudo» num vault de teste): o Obsidian leu o frontmatter do **documento** como Propriedades (`source`, `exported`, `entries`); o de **uma entrada** (`tags`, `ia_utilizada`) não chegou a ser testado. Os comentários `<!-- … -->` aparecem esmaecidos no modo de edição e somem no modo de leitura — é o Obsidian, não defeito do export.
````

## Edicao 6 — `meta/IDEAS.md` · Adiadas: Obsidian e .zip

**Forma:** Substituir.

**Ancora:**

````
- **Herança entre versões + botão do meio (F5, conflito C3)** — adiada por decisão do autor em 2026-11-04: é a de maior risco e reintroduz estado por nome de bloco (DEC-003) — **volta quando** aparecer um caso concreto em que propagar uma propriedade entre versões à mão custe tempo de verdade.
````

**Substituir por:**

````
- **Herança entre versões + botão do meio (F5, conflito C3)** — adiada por decisão do autor em 2026-11-04: é a de maior risco e reintroduz estado por nome de bloco (DEC-003) — **volta quando** aparecer um caso concreto em que propagar uma propriedade entre versões à mão custe tempo de verdade.
- **Obsidian: conferir o frontmatter de uma entrada e o `.zip` com um `.md` por entrada (F9)** — adiada pelo autor em 2026-11-10: ainda não usa o Obsidian o bastante para valer o trabalho — **volta quando** surgir a necessidade de levar o acervo para um vault, ou o autor dominar o Obsidian. O passo a passo da conferência está em `logs/2026-11-10.md`; feita a conferência, o `.zip` *stored* escrito à mão é o caminho (ideia «Exportar um arquivo por entrada»).
````

## Edicao 7 — `meta/ROADMAP.md` · F9: titulo

**Forma:** Substituir.

**Ancora:**

````
## 🟡 F9 — Interoperabilidade do export *(partes 1 e 2 entregues — v12.3 e v13.4; resta o `.zip`)*
````

**Substituir por:**

````
## 🟡 F9 — Interoperabilidade do export *(partes 1 e 2 entregues — v12.3 e v13.4; o `.zip` está adiado pelo autor)*
````

## Edicao 8 — `meta/ROADMAP.md` · F9: .zip adiado

**Forma:** Substituir.

**Ancora:**

````
- [ ] Exportar uma entrada por arquivo (`.zip`) — o que um vault realmente quer; esbarra no zero-dependência (ver IDEAS).
````

**Substituir por:**

````
- [ ] Exportar uma entrada por arquivo (`.zip`) — o que um vault realmente quer; esbarra no zero-dependência (ver IDEAS). **Adiado pelo autor em 2026-11-10** até ele precisar ou dominar o Obsidian (IDEAS, «Adiadas»).
````

## Edicao 9 — `logs/2026-11-10.md` · secao do chat: conferencia e Obsidian adiado

**Forma:** Substituir.

**Ancora:**

````
- Pendente: o autor conferir a v13.8 no navegador (roteiro no STATUS).
````

**Substituir por:**

````
- Pendente: o autor conferir a v13.8 no navegador (roteiro no STATUS).

## Conversa 2 — chat (v13.8 conferida; Obsidian adiado)

### Feito
- Relatórios da wo0014 lidos inteiros e conferidos com o git: `37cd070` (v13.8) + wrap `e179b46` em `origin/main`, árvore limpa; rodados no disco smoke 124/0, history 52/0; `sha1sum index.html` = `f56d0f2e…` = o simulado [medido por instrumento]. Arquivados MOVENDO, com quatro prints do autor do Obsidian.
- **Roteiro v13.8: todos ok** [relatado pelo dono].
- **Prints do autor (Obsidian, vault de teste):** export «Exportar tudo» aberto no Obsidian; o frontmatter do documento aparece como Propriedades (`source: Lunoda`, `exported`, `entries: 7`) [visto nos prints]. O frontmatter de uma entrada não foi testado. Os comentários `<!-- ENTRADA -->`, `<!-- DADOS … -->`, `<!-- CONTEUDO:… -->` aparecem esmaecidos no modo de edição — o Obsidian os esconde no modo de leitura. O acervo real tem 7 entradas [visto no print].
- O autor **adiou** a conferência do Obsidian e a B (`.zip`) até precisar ou dominar o Obsidian (IDEAS, «Adiadas»). Escrita a wo0015 (só registro).

### Passo a passo guardado — conferir o frontmatter de UMA entrada no Obsidian (para quando a B voltar)
1. No Lunoda, «Exportar tudo» → confira que «Incluir frontmatter YAML no Markdown» está marcado; feche sem exportar.
2. Abra uma entrada com propriedades (Tags, IA Utilizada) e clique **MD** no cabeçalho do editor (não o «Exportar tudo»: o frontmatter de entrada só vai no arquivo de uma entrada).
3. Leve o `.md` para a pasta do vault e abra no Obsidian.
4. Certo: quadro Propriedades com `title`, `id`, `created`, `updated`, `blocks`, `tags` (como etiquetas) e `ia_utilizada` (lista); nenhum `---` como texto; corpo começando por `# <título>`.
5. Contraprova: desmarque o frontmatter, exporte a mesma entrada de novo e abra: sem Propriedades. Depois marque de novo (é o padrão).

### Opções da próxima frente (apresentadas no chat)
- **E — arrastar blocos para reordenar** (F7). Média; mexe no editor inteiro (eventos, foco, undo).
- **Entrada favorita/fixada** (F7): fixa no topo da tabela. Pequena.
- **Cor da entrada na tabela** (F7). Pequena.
- **Histórico de versões de bloco** (F7, snapshots + diff). Grande; pesa no `localStorage`.
````

---

## Fora de escopo

- Nada de codigo. CHANGELOG e DECISIONS nao mudam (o adiamento mora no IDEAS, «Adiadas», e no ROADMAP).

## Depois de aplicar — conferencia antes do commit

Cole a saida CRUA no relatorio. Numeros medidos pelo chat na simulacao (Linux).

- [ ] `git status --short` -> exatamente `M logs/2026-11-10.md`, `M meta/IDEAS.md`, `M meta/ROADMAP.md`, `M meta/STATUS.md` e `??` nesta WO. Nada alem.
- [ ] `sha1sum index.html` -> `f56d0f2e06d9abbe204f611c9d7194df8af10b7a` (inalterado).
- [ ] `grep -c "" meta/STATUS.md meta/IDEAS.md meta/ROADMAP.md logs/2026-11-10.md` -> meta/STATUS.md:63 · meta/IDEAS.md:277 · meta/ROADMAP.md:89 · logs/2026-11-10.md:60.
- [ ] `grep -c "^- \[ \] \*\*Conferir o frontmatter no Obsidian" meta/STATUS.md` -> **0** · `grep -c "^- \[ \] \*\*Conferir a v13.8" meta/STATUS.md` -> **0** · `grep -c "^- Nada em andamento. \*\*v13.0 a v13.8" meta/STATUS.md` -> 1 · `grep -c "^- \*\*Obsidian: conferir o frontmatter" meta/IDEAS.md` -> 1 · `grep -c "^## Conversa 2 — chat (v13.8 conferida" logs/2026-11-10.md` -> 1.
- [ ] Combinantes literais (`node -e "const t=require('fs').readFileSync(process.argv[1],'utf8');let n=0;for(const c of t){const k=c.codePointAt(0);if(k>=0x300&&k<=0x36f)n++}console.log(n)" <arquivo>`): STATUS · IDEAS · ROADMAP · log -> 0 · 0 · 0 · 0.
- [ ] Acrescente no FIM de `logs/2026-11-10.md`, com UMA linha em branco antes, `## Code (execucao, wo0015)` com o seu relatorio resumido.

## Relatorio de aplicacao

O que foi feito · o que fugiu da WO · saida crua das conferencias · commit e push. Escreva DEPOIS do push. Grave tambem em `../AAMMDD-HHMM-code-lunoda-apply-wo0015.txt` (`date +%y%m%d-%H%M`).

## Commit — blocos separados, mensagem SEM acento

```
git add meta/STATUS.md meta/IDEAS.md meta/ROADMAP.md logs/2026-11-10.md meta/workorders/261110-wo0015-registro-v13-8-obsidian-adiado.md
```

```
git commit -m "docs(meta): registra a v13.8 conferida e adia o Obsidian" -m "Roteiro v13.8 todo ok. Conferencia do frontmatter no Obsidian e o .zip da F9 adiados pelo autor, com gatilho no IDEAS e o passo a passo no log de 2026-11-10. Sem mudanca de codigo."
```

```
git push
```

*Gerado pelo Kit de Contexto Universal v1.133.0 — 2026-11-10 — esta linha e do KIT: nao funda, substitua pela do pacote mais recente.*
