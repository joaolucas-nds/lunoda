# HISTORY.md — Conhecimento Consolidado

> **Opcional.** Arquivo-baú para conhecimento denso que já foi aprendido e não muda mais — guias técnicos, análises de viabilidade, notas de migração — que tornariam o CONTEXT pesado demais.
> Não é lido no início da sessão; o assistente consulta sob demanda quando o assunto aparece.

---

## 1. Evolução das versões (linha do tempo consolidada)

**Origem do projeto.** O autor queria substituir um fluxo manual em Google Docs / Notion: capturar interações com IAs em blocos organizados por propriedades e exportar tudo num único arquivo reimportável. Nasceu como app `.html` único (nomes antigos: base / Nexus / Synap).

**v8–v9 (base/Synap).** Editor de blocos, tabela, propriedades na entrada, exportação. Herança de propriedades ainda **opaca** (dizia que o bloco "herdava" sem nomear a opção na exportação).

**v10 (Synap, guia por outra IA — `synap_v10_guide.md`).** Introduziu propriedades por bloco com modos **Todos/Custom/Nenhum** por opção, MD com melhor identificação, filtro por propriedade na tabela, favicon. Esse modelo por modos foi considerado complexo e pouco intuitivo, e empilhava a UI.

**v11 (`lunoda_v11_guide.md`).** Reformulou o sistema de propriedades: **bloco vira a fonte de verdade** (`blockProps`), entrada calculada como união (`calcPropertyValues`), herança por flag (`propertyAutoFlags`) substituindo os modos. Migração automática `propertyOptionModes`→`propertyAutoFlags` e `inheritProps`→`blockProps`. Corrigiu o sumiço do filtro por data (FIX-001). Consolidou o nome **Lunoda**.

**v12 (`lunoda_v12_guide.md`).** Gestão de blocos: seleção interna (checkbox), ações em massa (reordenar em grupo, duplicar, excluir), transferência/cópia entre entradas (existente/nova, 4 modos), filtro interno de blocos (subtítulo/versão/propriedade, E/OU), duplicar bloco. Corrigiu a herança automática para afetar só blocos novos (DEC-004) e tornou o chip `●auto` clicável.

## 2. Regra do algoritmo "mover grupo selecionado" (referência)

`moveSelectedBlocks(delta)` move blocos selecionados (possivelmente não contíguos) como grupo, preservando a ordem relativa entre eles:
- **Subir (-1):** percorre o array da esquerda para a direita; troca cada selecionado com o vizinho anterior **não-selecionado**.
- **Descer (+1):** percorre da direita para a esquerda; troca cada selecionado com o vizinho seguinte não-selecionado.
- Exemplo canônico: `[1,2,3,4,5]` com `{1,2,4,5}` selecionados → subir → `[1,2,4,5,3]` (o bloco 3, não-selecionado, "desce" para o fim do grupo).

## 3. Migração de dados entre formatos (referência)

`loadDB` e `handleImport` normalizam formatos antigos sem perda:
- Formatos `base_notas_v2/v3` com `categories` → convertidos para `properties`.
- Opções em string (formato Gemini) → objeto `{id, name, colorId}`.
- `inheritProps` (bloco, antigo) → `blockProps`.
- `propertyOptionModes` (v10) → `propertyAutoFlags` via `migrateOptionModes` (só o que estava em modo `all` vira flag; `custom`/`none` são ignorados porque os blocos já guardam suas opções explícitas).
- Chaves de `localStorage` tentadas em ordem: `base_v4` (atual), `base_notas_v3`, `base_notas_v2`, `nexus_db_v4`.

## 4. Fluxo de trabalho de desenvolvimento (procedimento herdado)

1. Autor descreve o que quer para a próxima versão (texto livre, às vezes via `Lunoda_ideias.txt` no mount).
2. Assistente lê a versão canônica (`Lunoda_v12.html` no mount) + guias anteriores, analisa, projeta.
3. Assistente entrega **guia `lunoda_vN_guide.md`** com passo a passo: bloco antigo a localizar (âncora literal) → bloco novo completo. Sem editar o arquivo diretamente.
4. Autor aplica manualmente, testa e sobe a nova versão ao GitHub (upload por arrastar).

> Ver DEC-002. Os guias das versões ficam preservados — são a memória da evolução e a base para reconstruir contexto.
