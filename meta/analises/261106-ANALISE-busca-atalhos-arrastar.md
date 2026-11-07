# ANALISE — Busca no conteúdo, atalhos de teclado e arrastar arquivo para importar (F10)

> **Status:** Decidida (2026-11-06) — 1a, 2a, 3a, 4a, como recomendado; virou DEC-024 e a wo0010
> **Data:** 2026-11-06 (data de criacao; nao muda depois)
> **Elos:** ROADMAP F10 · IDEAS «Busca full-text dentro do conteúdo dos blocos», «Atalhos de teclado» · ideia do autor de 2026-11-06 (arrastar o JSON para a tela) · DEC-010 (undo) · DEC-001 (sem dependências)

## Problema

Três dores de uso diário, pedidas juntas pelo autor:

1. **Achar um trecho no acervo.** O texto que importa está dentro dos blocos. Quando a busca acha uma entrada, não diz onde nem por quê; ao abrir a entrada, o termo se perde e é preciso caçar o bloco.
2. **Atalhos.** O IDEAS pede novo bloco, próximo/anterior bloco, foco na busca e fechar o editor.
3. **Importar arrastando.** O gesto natural (arrastar o `.json` para a janela) não funciona.

## Restricoes / o que foi medido

Medido pelo chat em 2026-11-06 (HEAD `a2c55d9`, `index.html` `5c9db21f`):

- **A busca da tabela JÁ procura no conteúdo.** `getFiltered()` testa título, descrição e `subtitle + ' ' + content` de cada bloco. O ROADMAP («Busca full-text no conteúdo dos blocos») e o IDEAS («hoje alcança título e metadados») estão **defasados**: o que falta não é alcance, é o resto abaixo.
- **Acento quebra a busca.** Medido no Chromium: uma entrada com «uma função qualquer» é achada por `função` e **não** por `funcao`. A comparação é só `toLowerCase().includes(q)`, sem tirar acentos e sem separar palavras (`funcao modelo` procura a frase inteira, nessa ordem).
- **O filtro interno do editor procura só no subtítulo** (`getFilteredBlocks`: `b.subtitle.includes(text)`; rótulo «Subtítulo:»). Dentro de uma entrada, não há como filtrar os blocos pelo conteúdo.
- **O Ctrl+F do navegador já acha texto dentro das caixas de texto** (o Chromium tem caso de teste próprio para isso: `find_in_page/textintextarea.html`). Destacar a palavra *dentro* de um `textarea` não é possível sem sobrepor uma camada espelhada — e não é preciso: basta levar o usuário ao bloco certo.
- **Desempenho**, acervo sintético no teto do armazenamento (837 entradas, 6.696 blocos, 4,8 MB), `node`, mediana de 15 rodadas:

| Busca | Por tecla |
|---|---|
| atual (`toLowerCase`) | 3,7 ms |
| sem acento, recalculada a cada tecla | 43 ms |
| sem acento, com cache por entrada | 0,1 ms (o cache custa 64 ms para montar e precisa ser invalidado em toda mudança) |

  43 ms no pior caso, com uma espera de ~150 ms entre teclas, não se sente; o acervo real está longe do teto. **Sem cache**: invalidar em toda operação que mexe em blocos (mover, copiar, empurrão, undo…) é exatamente o tipo de estado espalhado que quebra em silêncio.
- **Atalhos existentes** (`keydown` no fim do script): `P` alterna a barra lateral (fora de campo) · `Ctrl+N` nova entrada · `Ctrl+S` salva · `Ctrl+Z`/`Ctrl+Y` desfazer/refazer estrutural (fora de campo) · `Esc` fecha modal ou editor.
- **Dois defeitos nos atalhos atuais:**
  1. **`Ctrl+N` nunca chega à página no Chrome**: desde o Chrome 4, Ctrl+N, Ctrl+T e Ctrl+W são reservados ao navegador (abre janela nova) — e o Firefox faz o mesmo fora da tela cheia. O atalho existe no código e não funciona.
  2. **`P` não confere modificador**: medido no Chromium, `Ctrl+P` alterna a barra lateral e o `preventDefault` bloqueia a impressão do navegador.
- **Teclado do autor: ABNT2 no Windows.** Ali `AltGr` = `Ctrl+Alt`, e `AltGr+Q/W/E/C/1…=` produzem `/ ? ° ₢ ¹ ² ³ £ ¢ ¬ §`. **Qualquer atalho com `Ctrl+Alt` dispara ao digitar esses símbolos** — fica fora.
- **Arrastar hoje:** não há `dragover`/`drop` no app. Soltar um arquivo na janela cai no comportamento padrão do navegador, que **abre o arquivo no lugar da página** — o app sai da tela e uma edição não salva se perde. (Não medido aqui: evento de arrastar sintético não dispara essa navegação.) O caminho de importar já existe inteiro (`handleImport` → JSON com mesclar/substituir, ou `.md` com prévia); só lê de `ev.target.files[0]`.

## Opcoes consideradas

### C — Busca

- **C1 — Busca sem acento e por palavras.** Cada palavra digitada precisa aparecer, em qualquer ordem e em qualquer campo; acento e maiúscula não contam (`funcao modelo` acha «Modelo … função»). Funções puras (`foldText`, `searchTokens`, `entryMatches`), testáveis no smoke. *Custo:* pequeno. **Entra.**
- **C2 — Trecho na tabela.** Quando o que casou está nos blocos (não no título), mostrar sob o título uma linha «…trecho com o **termo** destacado…» e «em 3 blocos». O destaque precisa mapear a posição do texto sem acento de volta ao original (acento muda o comprimento em NFD) — função pura `searchSnippet`, testável. *Custo:* pequeno-médio. **Entra.**
- **C3 — Levar a busca para dentro da entrada.** Ao abrir uma entrada com a busca ativa, o filtro interno já vem com o termo e mostra só os blocos que casam (com «3 de 12 blocos» e o Limpar que já existe); o Ctrl+F do navegador cuida da palavra dentro da caixa. Exige o filtro interno procurar também no conteúdo (ver ponto de decisão 2). *Custo:* pequeno — reaproveita o filtro inteiro. **Entra** (ponto de decisão 1).
  - *C3b — mostrar todos e só marcar os que casam:* não esconde contexto, mas numa entrada de 30 blocos a marca se perde na rolagem; o filtro já tem o Limpar a um clique.
  - *C3c — não levar o termo:* é o problema 1 de hoje.
- **C4 — Destaque dentro da caixa de texto** (camada espelhada atrás do `textarea`). *Descartada:* frágil (fonte, quebra de linha, rolagem, os cinco tamanhos de caixa) e o Ctrl+F do navegador já faz.
- **C5 — Cache de texto normalizado.** *Descartada:* ver medição — ganho invisível no tamanho real, custo de invalidação alto.
- **C6 — Frase exata entre aspas, regex, operadores.** *Fora:* nada pede isso hoje; cabe depois sem mudar C1.

### B — Atalhos

Regra de desenho: **tecla solta só fora de campo de texto** (como o `P` já faz); **dentro de campo, só com modificador**; nunca `Ctrl+Alt` (AltGr); nunca combinação reservada do navegador. E o que não se descobre não existe: um `?` mostra a lista, e o `title` dos botões passa a citar o atalho.

| Atalho | Onde | Faz | Situação |
|---|---|---|---|
| `/` | fora de campo | foca a busca da tabela | novo |
| `Esc` na busca | na busca | limpa a busca e tira o foco | novo |
| `N` | fora de campo | nova entrada | novo — **substitui o `Ctrl+N` morto** |
| `P` | fora de campo, **sem modificador** | barra lateral | conserta o `Ctrl+P` |
| `?` | fora de campo | janela com a lista de atalhos | novo |
| `Alt+↓` / `Alt+↑` | no editor, inclusive digitando | vai para a caixa do bloco seguinte/anterior (visível) | novo |
| `Alt+Enter` | no editor, inclusive digitando | novo bloco (o mesmo do botão «Adicionar bloco», no fim) | novo |
| `Ctrl+S`, `Ctrl+Z`/`Ctrl+Y`, `Esc` | — | como hoje | sem mudança |

*Consideradas e fora:* `Ctrl+K` para a busca (duplica o `/`); `Ctrl+F` sobrescrito (tiraria do usuário o localizar do navegador, que C3 aproveita); `Alt+N` para nova entrada (funciona, mas o `N` solto segue o padrão do `P`; ponto de decisão 3); mover bloco com `Alt+Shift+↑/↓` (os botões Subir/Descer já existem; cabe depois).

### D — Arrastar arquivo para importar

- **D1 — Soltar em qualquer lugar da janela.** Com arquivo sendo arrastado (só `Files`; arrastar texto entre caixas não é afetado), uma camada «Solte para importar (.json ou .md)» cobre a tela; ao soltar, o arquivo segue **o mesmo caminho do botão Importar** (JSON pergunta mesclar/substituir; `.md` abre a prévia). Mais de um arquivo: importa o primeiro e avisa. Outra extensão: avisa e não faz nada. E **sempre** `preventDefault` no `drop`, para o navegador nunca mais trocar o app pelo arquivo. *Custo:* pequeno — `handleImport` passa a receber o arquivo. **Entra.**
- **D2 — Área de soltar só na janela de importar.** *Descartada:* não existe janela de importar (o botão abre o seletor do sistema direto); criar uma só para isso é mais clique, não menos.

## Recomendacao

**C1 + C2 + C3 + B + D1 numa versão só (v13.6), numa WO só.** São peças pequenas que se apoiam (o `/` leva à busca, a busca leva à entrada, o filtro leva ao bloco, o `Alt+↓` anda entre eles) e mexem em regiões separadas do código. A medição tirou o maior item do caminho: a busca no conteúdo já existe; o que entra é acento, trecho e continuidade até o bloco. E conserta dois defeitos de atalho que estão hoje no código.

Melhor argumento contra: é a WO com mais pontos de interface desde o pacote de interface (v13.2). Mitigação: tudo que é lógica vira função pura testada no smoke (dobrar acento, separar palavras, casar entrada, recortar trecho, casar bloco), e o resto é conferido no Chromium antes de entregar — como nas anteriores.

## Riscos

- **`Alt` sozinho no Windows ativa a barra de menu do navegador** em alguns navegadores ao soltar a tecla; com `↓`/`↑`/`Enter` junto o evento chega à página, mas o sinal cedo é o foco «pular» para o menu. Conferir no roteiro do autor (Chrome no Windows), que o Chromium do container não reproduz.
- **Trecho com HTML do conteúdo**: o conteúdo é texto livre do usuário; o trecho passa por `esc()` antes de receber o `<mark>`. Teste com `<script>` no conteúdo.
- **Filtro interno mudando de comportamento** (se o ponto 2 for «campo único»): quem digitava um subtítulo passa a ver também os blocos que *citam* aquele nome. É um superconjunto — nunca esconde o que antes aparecia.
- **Importar arrastando com o editor aberto e não salvo**: é o mesmo que clicar Importar hoje com o editor aberto; não piora, mas o roteiro confere.
- **`N` e `/` disparando sem querer**: só fora de campo e sem modificador; dentro de `select`, botão com foco ou janela aberta também não dispara.

## Ponto de decisao

1. **Ao abrir uma entrada a partir da busca:** (a) o filtro interno já vem com o termo e mostra só os blocos que casam — *recomendado*; (b) mostra todos e só marca os que casam; (c) não leva o termo.
2. **Filtro interno de texto:** (a) vira um campo «Texto» que procura no subtítulo **e** no conteúdo — *recomendado*; (b) mantém «Subtítulo» e ganha um campo «Conteúdo» ao lado.
3. **Nova entrada:** (a) `N` fora de campo — *recomendado*; (b) `Alt+N`; (c) os dois.
4. **Arrastar para importar:** (a) nesta mesma versão — *recomendado*; (b) numa versão depois.
