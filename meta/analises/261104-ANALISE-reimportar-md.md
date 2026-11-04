# ANALISE — Reimportar o `.md` exportado (F9 parte 2)

> **Status:** Decidida (2026-11-04) — opção B; virou DEC-022 e a wo0006
> **Data:** 2026-11-04 (data de criacao; nao muda depois)
> **Elos:** ROADMAP F9 · DEC-008 (delimitadores) · DEC-011 (frontmatter) · FIX-002 · IDEAS «Reimportar `.md` (não só JSON)»

## Problema

Hoje só o JSON reimporta. O `.md` é o arquivo que o autor de fato guarda e lê (e o que vai para um vault do Obsidian), mas não volta para o app. Se os dados do navegador se perderem e só houver o `.md`, o acervo não se recupera; e o que for editado no vault não tem caminho de volta. Os dados vivem só no `localStorage` de um navegador — esse é o maior risco do projeto.

## Restricoes / o que foi medido

Medido pelo chat em 2026-11-04 (HEAD `8f2e2dc`, `index.html` `ed49df96`):

- **Protótipo de leitor** (máquina de estados sobre os marcadores `<!-- ENTRADA -->`, `<!-- BLOCO n -->`, `<!-- CONTEUDO:INICIO/FIM bloco=n -->`) rodado sobre o export REAL do app, gerado no Chromium a partir da fixture hostil `tests/fixtures/sample-db.json`, nos três formatos (vários com frontmatter, vários sem, uma entrada com frontmatter). Resultado, por campo:

| Campo | Volta? |
|---|---|
| Título, descrição multilinha (com linhas `#` e `-`) | **sim, exato** |
| ID da entrada | **sim** — depois de resolver a colisão abaixo |
| Nº de blocos, subtítulo, versão | **sim, exato** (o `**Total de blocos:**` serve de conferência) |
| Conteúdo do bloco, inclusive o que imita o próprio export (`# …`, `## [Bloco 99]`, `<!-- ENTRADA -->`, `---`) | **sim, exato** |
| Propriedades do bloco | **por NOME** (o `.md` não leva ids nem cores) |
| Datas de criação/modificação | **com perda**: no corpo saem como `22/05/26 13:24` (sem segundos, fuso local); ISO só no frontmatter de export de UMA entrada |
| Adição automática (`propertyAutoFlags`), cores das opções, ids de propriedade/opção/bloco | **não exportados** — perdem-se |

- **Ambiguidades do formato achadas na medição:**
  1. Propriedade com nome de campo do formato colide no corpo: a fixture tem uma propriedade «ID», que sai como `**ID:** Com "aspas"…` logo abaixo do `**ID:**` da entrada. O protótipo errou o ID até ler **por posição** (o primeiro é o campo). Vale para `ID`, `Criado em`, `Modificado em`, `Total de blocos` (entrada) e `Subtítulo`, `Versão` (bloco).
  2. Bloco vazio é exportado como `*(vazio)*`: um bloco cujo conteúdo real seja exatamente `*(vazio)*` volta vazio.
  3. Valores de propriedade são unidos por ` · `: um nome de opção que contenha ` · ` volta partido em dois.
- **Exports anteriores à v12.1** não têm delimitadores. Medido no arquivo real do autor (`notas-arquivadas\Lunoda - Blocos de notas.md`, 05/07; só contagens, conteúdo não lido): 1 `<!-- ENTRADA -->`, 20 blocos, **3 linhas `# `** (1 título + 2 dentro de conteúdo) e **9 linhas `---`** soltas, 0 delimitadores de conteúdo. É o FIX-002: um leitor partiria errado.
- O import atual (`handleImport`) só lê JSON; mescla pulando ids que já existem, ou substitui tudo.

## Opcoes consideradas

**A — Leitor do formato atual (v12.1+), com prévia e só mesclar.** Lê pelos marcadores, resolve as colisões por posição, confere `Total de blocos`, cria propriedade/opção por nome quando não existir (cor nova). Antes de gravar, mostra uma prévia: N entradas, M blocos, propriedades/opções novas, avisos. Só **mesclar** — substituir o acervo inteiro a partir de um arquivo que não leva cores nem automático seria trocar dado bom por dado pior.
*Custo:* médio (um leitor + uma prévia). *Perde:* precisão da data, automático, cores.

**B — A + uma linha de dados exatos no export.** Acrescentar, logo depois de `<!-- ENTRADA -->`, uma linha `<!-- DADOS id="…" criado="ISO" modificado="ISO" -->` (e o mesmo com `id` em cada bloco). É comentário: invisível no render e no Obsidian em modo leitura; **não muda nenhum marcador existente** (o smoke continua valendo) e o formato já é extensível. Fecha a perda de data e de ids de bloco.
*Custo:* pequeno sobre A. *Perde:* automático e cores (aceitável: o JSON continua sendo o backup completo).

**C — Embutir o JSON completo de cada entrada num comentário.** Volta tudo, sem perda. *Descartada:* dobra o tamanho do arquivo, polui o texto no modo edição do Obsidian, e JSON dentro de comentário HTML precisa escapar `-->`. Resolve um problema que o JSON já resolve.

**D — Não fazer; reforçar o JSON.** Lembrete «último backup JSON há N dias» e um botão de backup rápido. *Não substitui* a F9 (o `.md` continua sem volta), mas ataca o mesmo risco por outro lado e custa pouco — **vale como item próprio**, independente desta decisão.

**E — Leitor heurístico para exports antigos (pré-v12.1).** Partir por `## [Bloco N]` com numeração sequencial e conferir contra `Total de blocos`. *Descartada por agora:* acerta o caso medido só se nenhuma linha de conteúdo imitar o cabeçalho, e os dados desses arquivos ainda estão no app — reexportar (já no backlog) resolve sem risco. O leitor deve **recusar** o formato antigo com mensagem clara.

## Recomendacao

**B** (que inclui A): leitor do formato atual + linha `<!-- DADOS … -->` no export + prévia + só mesclar + recusar pré-v12.1. A medição mostrou que o formato da DEC-008 já carrega quase tudo; o que falta de verdade é a data exata, e a linha de dados fecha isso sem mexer em nada que existe. Automático e cores ficam com o JSON, que segue sendo o backup completo.

Melhor argumento contra: B muda o formato do export — e arquivos exportados antes dela (v12.1 a v13.3) seguem sem a linha. O leitor tem de aceitar os dois (com e sem `DADOS`), caindo para a data do corpo quando faltar. É mais um caminho para testar — mas os dois saem da mesma fixture.

Comando que audita o risco principal (colisão de nomes) depois de implementar: o teste de ida e volta com a fixture hostil — exportar, reimportar, comparar campo a campo — já é o protótipo desta análise; vira seção do smoke.

## Riscos

- **Entrada que já existe** (mesmo ID): pular, como o JSON faz, descarta em silêncio o que foi editado no vault. Ver ponto de decisão 2. Sinal precoce: a prévia mostra «K já existem».
- **Arquivo editado à mão no vault** pode perder um marcador: a entrada sem marcador completo é recusada com aviso (na prévia), nunca importada pela metade.
- Fim de linha CRLF (Windows/Obsidian) e espaços no fim da linha: o leitor normaliza CRLF e ignora espaços à direita nos campos, mas **não** no conteúdo entre delimitadores.

## Ponto de decisao

1. **Opção B** (leitor + linha `DADOS` no export + prévia + só mesclar + recusar pré-v12.1)?
2. **Entrada que já existe** no app: **pular** (como o JSON), **importar como cópia nova**, ou **perguntar na prévia**? Depende do uso: se reimportar é para *recuperar backup*, pular basta; se é para *editar no Obsidian e trazer de volta*, pular perde a edição.
3. **D (lembrete de backup JSON)** entra como item próprio no backlog?

**Decidido pelo autor (2026-11-04):** (1) opção B aprovada; (2) entrada que já existe: **perguntar na prévia** (pular é o padrão; importar como cópia nova é a outra escolha); (3) lembrete de backup JSON **entra no backlog**. Implementação: wo0006 (v13.4), registrada na DEC-022.

**Medido depois, na implementação:** a ida e volta pelo próprio app (exportar pelo botão, importar o arquivo numa base vazia) deu IDs, títulos, descrições, datas, blocos, conteúdo e propriedades por nome **idênticos**. Um mutante revelou que uma linha `DADOS` sem `id` apagaria o ID do corpo — o leitor final usa o `**ID:**` como reserva.
