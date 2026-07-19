# tests — verificação do Lunoda

O Lunoda é um `.html` único e visual, sem build e sem framework (DEC-001). Uma suíte tradicional exigiria `package.json` e `node_modules`, o que contraria o zero-setup do projeto.

A solução é um **smoke em Node puro, sem dependências**.

## Rodar

```
node tests/smoke.mjs      (export / entryToMD)
node tests/history.mjs    (undo/redo do editor)
```

Sai com código `1` se algo falhar. Para ver o Markdown gerado quando há falha:

```
set DUMP=1 && node tests/smoke.mjs
```

## Como funciona

`smoke.mjs` lê o `index.html`, recorta funções por varredura de chaves balanceadas (ignorando chaves dentro de string, template literal e comentário) e as executa isoladas, com um `db` de fixture injetado. **Não executa o script inteiro**, que dependeria de DOM.

Isso permite testar as funções **puras** sem tocar no arquivo único.

## O que cobre hoje

`entryToMD()` — a geração do Markdown exportado. Foi escolhida primeiro porque é onde o defeito é mais caro e menos visível: um export corrompido só aparece quando o usuário vai reler o arquivo, possivelmente meses depois.

As asserções incluem duas **regressões** do FIX-002:
- toda linha da descrição precisa começar com `>`;
- todo bloco precisa ter os delimitadores `<!-- CONTEUDO:INICIO/FIM -->`.

## A fixture é hostil de propósito

`fixtures/sample-db.json` contém, deliberadamente:
- descrição multilinha com uma linha iniciada por `#` e outra por `-`;
- um bloco cujo conteúdo **imita a estrutura do próprio export** (`# titulo`, `## [Bloco 99]`, `<!-- ENTRADA -->`, `---`);
- um bloco vazio.

O FIX-002 sobreviveu a três versões porque o export parecia certo com dados bem-comportados. Testar com entrada hostil é o ponto.

## `history.mjs` — undo/redo

Monta um **editor de mentira** (dublês de DOM e mutadores) e recorta o bloco de histórico do `index.html` para exercitá-lo. 18 asserções, incluindo:

- ação sem efeito não suja o histórico (o caso do `confirm` cancelado);
- ramo novo invalida o refazer;
- **undo/redo nunca deixa a entrada com 0 blocos** — a invariante do projeto;
- o teto de 50 entradas é respeitado;
- abrir outra entrada zera o histórico.

Rode ao mexer nos mutadores estruturais ou na lista de nomes embrulhados (DEC-010).

> Uma fixture com **um único bloco** esconde bug de ordenação e finge bug onde não há — foi o que aconteceu ao escrever este teste. Use 2–3 blocos quando a asserção envolver ordem.

## O que NÃO cobre

Interface, `localStorage`, cores, arrastar, filtros e qualquer coisa que dependa de DOM ou de navegador. Isso continua sendo verificação manual — e quem mexe deve **declarar explicitamente** o que testou no navegador e o que não deu para testar.

## Ao adicionar cobertura

Boas candidatas, por ordem de risco (todas puras ou quase):

1. `calcPropertyValues` — núcleo do modelo de propriedades.
2. `migrateOptionModes` / `loadDB` — migração de formatos antigos; quebrar ali inutiliza backups.
3. `moveSelectedBlocks` — algoritmo com caso de borda (grupos não contíguos).

Basta acrescentar o nome em `NEEDED` no `smoke.mjs` e escrever as asserções com o helper `check()`.
