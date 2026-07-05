# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log da sessão.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão atual

**Lunoda v12** — arquivo canônico `Lunoda_v12.html` (no Projeto, ~2771 linhas, todas as funções da v12 confirmadas no disco).

## O que funciona

- Tabela de entradas com ordenação, seleção em massa e ações (exportar JSON/MD, excluir).
- Editor lateral: título, descrição, propriedades, blocos.
- Sistema de propriedades por bloco com herança automática **só para novos blocos** (corrigido na v12).
- Chip `●auto` clicável dentro do bloco (remove do bloco + desliga flag na entrada).
- Seleção interna de blocos + barra de ações (Subir/Descer em grupo, Duplicar, Excluir, Mover para, Copiar para).
- Duplicar bloco individual.
- Transferência/cópia de blocos para entrada existente ou nova (4 modos).
- Filtro interno de blocos (subtítulo, versão, propriedade+opções) com modo E/OU.
- Filtros da tabela: texto, data (Criado/Alterado, De/Até) e propriedade — independentes.
- Exportação JSON / Markdown (bem identificado) / HTML-PDF; importação com migração de formatos antigos.
- Favicon e nome "Lunoda" aplicados.

## Em progresso

- Nada em execução no código no momento. A sessão de hoje montou o **sistema de documentação** do Projeto.

## Quebrado / pendências

- Nenhum bug conhecido em aberto na v12.

## Backlog curto (próximos passos concretos)

- **Definir escopo da v13** a partir das ideias novas do `Lunoda_ideias.txt` (ver IDEAS): propriedades em blocos selecionados (inverter posse), controles de tamanho das caixas de texto, ações por botão do mouse (esq/meio/dir), herança entre versões de um mesmo nome de bloco, reordenação por número de versão. Há **conflitos/ambiguidades entre essas ideias** que precisam ser resolvidos antes de projetar (detalhado no IDEAS).
- Produzir o **guia `lunoda_v13_guide.md`** depois de fechado o escopo.

## Última sessão

**2026-07-05** — Montado o sistema de documentação de contexto (CONTEXT, STATUS, DECISIONS, CHANGELOG, IDEAS, ROADMAP, GLOSSARY, HISTORY, log). Capturadas no IDEAS as ideias novas do `Lunoda_ideias.txt` para a v13, com sinalização dos conflitos entre elas. Nenhuma alteração de código.

**Próximo passo óbvio:** revisar as ideias da v13 no IDEAS, decidir o que entra, resolver os conflitos apontados, e pedir o guia da v13.
