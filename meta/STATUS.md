# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log da sessão.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão atual

**Lunoda v12.1** (pendente de aplicação) — arquivo canônico `index.html` (no Projeto, ~2771 linhas, todas as funções da v12 confirmadas no disco).

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

- **v12.1 entregue como instrução ASU `260719-asu0001.yaml`, aguardando aplicação.** Corrige a integridade do export MD (FIX-002) e adiciona rede de segurança de armazenamento (F8, parte 1). Validada em cópia: smoke 13/13 e `node --check` OK.

## Em progresso (antigo)

- Nada em execução no código no momento. A sessão de hoje montou o **sistema de documentação** do Projeto.

## Quebrado / pendências

- **FIX-002 corrigido na v12.1, pendente de aplicação:** exports da v12 têm descrição multilinha sem `>` a partir da 2ª linha e conteúdo de bloco sem delimitador. Arquivos já exportados seguem com o defeito — reexportar depois de aplicar o patch.
- `saveDB` da v12 não trata estouro de cota (corrigido na v12.1, mesma pendência).

## 📁 Arquivos críticos (não mexer sem contexto)

| Arquivo | Por quê |
|---|---|
| `index.html` | É o produto inteiro. Não editar às cegas; ver armadilhas no CONTEXT. |
| `tests/smoke.mjs` | Única verificação automática do projeto. Rode antes de fechar mudança de export. |
| `STORAGE_KEY = 'base_v4'` (dentro do HTML) | Renomear sem migração **apaga os dados do usuário**. |
| `calcPropertyValues()` / `blockProps` | Núcleo do modelo de propriedades (DEC-003). Mudança aqui afeta exportação e filtros. |
| `loadDB()` / `handleImport()` / `migrateOptionModes()` | Migração de formatos antigos. Quebrar aqui inutiliza backups antigos. |
| `guides/lunoda_vN_guide.md` | Memória da evolução. Nunca sobrescrever guia antigo. |

## Backlog curto (próximos passos concretos)

- **Definir escopo da v13** a partir das ideias novas do `Lunoda_ideias.txt` (ver IDEAS): propriedades em blocos selecionados (inverter posse), controles de tamanho das caixas de texto, ações por botão do mouse (esq/meio/dir), herança entre versões de um mesmo nome de bloco, reordenação por número de versão. Há **conflitos/ambiguidades entre essas ideias** que precisam ser resolvidos antes de projetar (detalhado no IDEAS).
- Produzir o **guia `lunoda_v13_guide.md`** depois de fechado o escopo.

## Última sessão

**2026-07-19** — Verificados os `.txt` e o export `Lunoda - Blocos de notas.md` do mount: **tudo já registrado, pode arquivar**. O export real revelou dois defeitos de integridade (FIX-002), corrigidos na instrução ASU `260719-asu0001.yaml` junto com a rede de segurança de armazenamento. Criados `CLAUDE.md` e `tests/` (smoke em Node puro, sem dependências).

**Próximo passo óbvio:** aplicar o ASU, rodar `node tests/smoke.mjs`, reexportar os `.md` antigos e então decidir entre F8-parte-2 (undo/redo) e F4 (UX de propriedades, que exige resolver C1/C2/Q1).
