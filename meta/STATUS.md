# STATUS.md — Estado Atual

> Arquivo **rolante**: descreve só o AGORA. O assistente lê no início para saber onde retomar.
> Item resolvido SAI daqui — vai para o CHANGELOG (se foi entrega) e/ou para o log da sessão.
> Médio e longo prazo NÃO ficam aqui — ficam no ROADMAP.

---

## Versão atual

**Lunoda v12.2** (v12.1 aplicada; v12.2 pendente de aplicação) — arquivo canônico `index.html` (no Projeto, ~2771 linhas, todas as funções da v12 confirmadas no disco).

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

- **v12.2 entregue como `260719-asu0002.yaml`, aguardando aplicação.** Undo/redo estrutural no editor — fecha a fase F8. Validada em cópia: história 18/18, smoke 13/13 (sem regressão), `node --check` OK.

## 📁 Arquivos críticos (não mexer sem contexto)

| Arquivo | Por quê |
|---|---|
| `index.html` | É o produto inteiro. Não editar às cegas; ver armadilhas no CONTEXT. |
| `tests/smoke.mjs` | Verifica o export. Rode antes de fechar qualquer mudança em `entryToMD`. |
| `tests/history.mjs` | Verifica o undo/redo. Rode ao mexer nos mutadores estruturais ou na lista de embrulho. |
| `STORAGE_KEY = 'base_v4'` (dentro do HTML) | Renomear sem migração **apaga os dados do usuário**. |
| `calcPropertyValues()` / `blockProps` | Núcleo do modelo de propriedades (DEC-003). Mudança aqui afeta exportação e filtros. |
| `loadDB()` / `handleImport()` / `migrateOptionModes()` | Migração de formatos antigos. Quebrar aqui inutiliza backups antigos. |
| `guides/lunoda_vN_guide.md` | Memória da evolução. Nunca sobrescrever guia antigo. |

## Backlog curto (próximos passos concretos)

- **Definir escopo da v13** a partir das ideias novas do `Lunoda_ideias.txt` (ver IDEAS): propriedades em blocos selecionados (inverter posse), controles de tamanho das caixas de texto, ações por botão do mouse (esq/meio/dir), herança entre versões de um mesmo nome de bloco, reordenação por número de versão. Há **conflitos/ambiguidades entre essas ideias** que precisam ser resolvidos antes de projetar (detalhado no IDEAS).
- Produzir o **guia `lunoda_v13_guide.md`** depois de fechado o escopo.

## Última sessão

**2026-07-19 (sessão 3)** — Verificada a aplicação da v12.1 no repositório: smoke 13/13 contra o `index.html` real, sintaxe válida, sem duplicação de âncora e o `saveDB` antigo removido. Em seguida, desenvolvida a **v12.2 (undo/redo)**, entregue como `260719-asu0002.yaml` e validada em cópia.

**Próximo passo óbvio:** aplicar a v12.2, rodar os dois testes, conferir o desfazer no navegador. Depois: reexportar os `.md` antigos e decidir a F4 (exige resolver C1/C2/Q1 do IDEAS) ou a F9 (frontmatter YAML).
