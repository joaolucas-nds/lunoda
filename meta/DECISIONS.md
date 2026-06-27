# DECISIONS.md — Registro de Decisões

> Arquivo que **cresce devagar**. Guarda o PORQUÊ — o que o código sozinho não conta.
> Duas naturezas: **DEC** (decisões de arquitetura/design) e **FIX** (bugs graves resolvidos, para não repetir).
> Não reescreva entradas antigas; se uma decisão for substituída, marque «SUPERADA por DEC-N» e adicione a nova.
> Quando passar de ~700 linhas, mova as mais antigas para `DECISIONS-archive.md`.

---

## Como usar
Cada decisão recebe um ID sequencial (DEC-001, DEC-002…) e segue o formato abaixo (ADR simplificado). Bugs graves usam FIX-001, FIX-002… com sintoma/causa/solução/lição.

---

## DEC-[N] — [Título curto da decisão]
**Data:** AAAA-MM-DD · **Status:** aceita | superada por DEC-X

### Contexto
[Que problema ou pergunta forçou esta decisão.]

### Decisão
[O que foi decidido, em uma ou duas frases diretas.]

### Alternativas consideradas
- **[Alternativa A]** — [por que não.]
- **[Alternativa B]** — [por que não.]

### Consequências
[O que isso facilita, o que isso custa, o que passa a ser verdade no projeto por causa disso.]

---

## FIX-[N] — [Título do bug grave]
**Data:** AAAA-MM-DD

- **Sintoma:** [o que se observava.]
- **Causa raiz:** [o que realmente estava errado — não o sintoma.]
- **Solução:** [o que foi feito.]
- **Lição:** [o que evita que volte a acontecer; virou armadilha em CONTEXT?]
