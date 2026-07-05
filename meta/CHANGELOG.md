# CHANGELOG

> Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/) e versionamento [SemVer](https://semver.org/lang/pt-BR/).
> **Cresce**: entradas novas no topo. Registra só o que foi de fato concluído/entregue.

---

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
