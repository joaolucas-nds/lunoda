# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

---

## [12.1.0] — 2026-07-19 *(entregue como ASU, pendente de aplicação)*

### Corrigido
- **FIX-002 — integridade do Markdown exportado.** Descrição multilinha agora tem `>` em **todas** as linhas: antes, da 2ª linha em diante o texto escapava da citação e uma linha iniciada por `#` ou `-` virava estrutura do documento.
- **FIX-002 — conteúdo de bloco sem delimitação.** O conteúdo agora vai entre `<!-- CONTEUDO:INICIO bloco=N -->` e `<!-- CONTEUDO:FIM bloco=N -->`, tornando possível separar conteúdo de estrutura mesmo quando o texto imita o formato do próprio export.

### Adicionado
- Marcador `<!-- BLOCO N -->` por bloco, par do `<!-- ENTRADA -->` já existente.
- `saveDB` trata `QuotaExceededError`: avisa em vez de perder a alteração em silêncio.
- `requestPersistence()` pede ao navegador para não expurgar os dados.
- `warnIfStorageTight()` avisa uma vez por sessão ao passar de ~80% do teto prático (~5 MB).
- `tests/smoke.mjs` — primeira verificação automática do projeto (Node puro, sem dependências).
- `CLAUDE.md` — orientação para o Claude Code, incluindo o sistema `meta/` e o KCM.

## [Não lançado]

### Adicionado
- Sistema de documentação de contexto migrado para `meta/` e alinhado ao Kit de Contexto Universal v1.74.0.
- `.flatdropignore` (enxuga o que sobe ao Projeto do Claude).
- Seção «Específico deste projeto (Lunoda)» no CEREBRO.

> Nada aqui altera o `Lunoda_v12.html` — são mudanças de documentação e processo.

## [12.0.0] — 2026-07-05

### Adicionado
- Seleção interna de blocos no editor (checkbox por bloco) com barra de ações em massa.
- Reordenar blocos selecionados em grupo (Subir/Descer) preservando ordem relativa.
- Duplicar bloco individual e duplicar blocos selecionados.
- Excluir blocos selecionados em massa (mantendo a invariante de ≥1 bloco por entrada).
- Mover/copiar blocos para entrada existente ou nova (4 modos), com salvamento automático e abertura da entrada destino.
- Filtro interno de blocos por subtítulo, versão e propriedade+opções, com modo E/OU entre critérios.
- Botão de duplicar em cada bloco.

### Corrigido
- Herança automática de propriedades agora afeta só blocos novos, não os existentes (ver DEC-004).
- Chip `●auto` dentro do bloco tornou-se clicável: remove a opção do bloco e desliga a flag na entrada.

## [11.0.0] — 2026-04-30

### Adicionado
- Novo sistema de propriedades por bloco: cada bloco é a fonte de verdade; a entrada é calculada como união das opções dos blocos (ver DEC-003).
- Herança automática por flag (`propertyAutoFlags`) substituindo o modelo Todos/Custom/Nenhum.
- Filtro da tabela por propriedade + opções.
- Exportação Markdown com identificação rica (ID, datas, total de blocos, tags e propriedades por bloco, divisores).
- Favicon (`favicon.png`) e nome do app "Lunoda".

### Corrigido
- FIX-001: restaurado o botão "Datas" na toolbar (havia sido removido ao adicionar o filtro por propriedade). Filtros de data e propriedade agora independentes.

### Removido
- Modelo de modos por opção (Todos/Custom/Nenhum) da v10, substituído pela herança por flag.

## [10.0.0] — 2026-04-29 *(como "Synap", guia por outra IA)*

### Adicionado
- Sistema de propriedades por bloco com modos Todos/Custom/Nenhum (posteriormente substituído).
- Exportação Markdown com melhor identificação de subtítulos e blocos.
- Base do editor com blocos, versões e sugestões.

---

> **Nota histórica:** versões anteriores à v10 (Synap/base/Nexus v8–v9) não têm changelog formal — o projeto adotou este registro a partir da montagem do sistema de documentação (2026-07-05), reconstruindo v10–v12 a partir dos guias existentes. Detalhes densos das fases antigas, se necessário, vão para o HISTORY.md.
