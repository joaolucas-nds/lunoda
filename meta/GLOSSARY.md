# GLOSSARY.md — Termos do Projeto

> **Opcional.** Use quando o projeto tem vocabulário próprio (nomes de módulos, conceitos, identificadores) que o assistente reexplicaria a cada conversa sem isto.
> Mantenha curto: só o que não é óbvio para alguém de fora.

---

## Conceitos do projeto
- **Entrada (entry)** — um registro/"página" da tabela. Tem título, descrição, propriedades e uma lista de blocos.
- **Bloco (block)** — unidade de conteúdo dentro de uma entrada. Tem subtítulo, versão, conteúdo e suas próprias propriedades (`blockProps`). É a **fonte de verdade** das propriedades.
- **Propriedade (property)** — categoria com opções coloridas (ex.: "Tags", "IA Utilizada"). Cada opção tem `id`, `name`, `colorId`.
- **Herança automática / adição automática** — flag por opção (`propertyAutoFlags`) que faz **blocos novos** nascerem com aquela opção. Não afeta blocos existentes. Desde a v13, liga/desliga pelo **botão direito** (DEC-014).
- **Chip `●auto`** — no painel de um bloco, indica opção vinda da herança automática. Clicar remove do bloco e desliga a flag na entrada.
- **Uniformizar** — (v13, DEC-013) com blocos selecionados, o clique esquerdo numa opção da entrada dá a todos os selecionados, ou remove de todos se todos já têm. `✓` = todos têm · `–` = misto.
- **Inverter posse** — *(descartada, C1)* regra alternativa em que quem tinha perdia e quem não tinha recebia; no caso misto não uniformiza nunca.
- **Empurrão de versão** — (F6, DEC-015) trocar o número de versão de um bloco para um número já ocupado no mesmo subtítulo renumera os vizinhos; só números, não posições.
- **Herança entre versões** — (ideia v13) propagar/travar uma propriedade em todas as versões de um mesmo subtítulo de bloco.

## Arquiteturas / módulos
- **`propertyValues`** — propriedades da entrada, **calculadas** como união das opções de todos os blocos ao salvar. Não editar à mão.
- **`propertyAutoFlags`** — `{ propId: [optId] }`, opções com adição automática a novos blocos ligada.
- **`blockProps`** — `{ propId: [optId] }` por bloco, o que o bloco realmente tem.
- **`editProps`** — variável legada do editor; **não é mais fonte de verdade** (ver armadilha no CONTEXT).

## Comandos / artefatos
- **`index.html`** — a aplicação. Nos uploads antigos aparece como `Lunoda_vN.html` / `base_vN.html`.
- **`lunoda_vN_guide.md`** — *(histórico)* guia passo a passo de uma versão para a próxima, o produto do fluxo da DEC-002 (v10–v12). Os arquivos não estão no repositório.
- **WO (work order)** — `meta/workorders/AAMMDD-woNNNN-desc.md`: instrução escrita pelo chat, com âncoras exatas, aplicada pelo Code com `/apply-wo`. Substitui o guia e a instrução ASU (DEC-012).
- **`/apply-wo` · `/wrap` · `/sondar`** — skills do Claude Code em `.claude/skills/`: aplicar uma WO; fechar a tarefa (append + commit + push); passada exploratória que devolve candidatos, nunca veredito.
- **Relatório de trabalho** — `../AAMMDD-HHMM-code-lunoda-<ato>-<alvo>.txt`, na pasta-pai, fora do Git: o que o Code fez, conferências cruas, commit.
- **`favicon.png`** — ícone na raiz do repositório GitHub.
- **ASU** — *(histórico)* Atualizador Automático de Scripts: patch YAML por âncora usado nas v12.1–v12.3. Desligado em 2026-11-03 (DEC-012).

## Identificadores
- **`STORAGE_KEY = 'base_v4'`** — chave do `localStorage`. Não muda com a versão do app; não alterar sem migração (perderia dados).
- **`AI_HINTS`** — lista de nomes de IAs sugeridos como subtítulo de bloco (Claude, Gemini, ChatGPT, etc.).
- **DEC-N / FIX-N** — IDs de decisões e correções no DECISIONS.md.
- **C1–C3 / Q1** — conflitos e questão aberta das ideias da v13 (ver IDEAS).

## Nomes históricos
- **Synap / base / Nexus** — nomes antigos do app (daí `base_v4`, prefixos `base_`, chave legada `nexus_db_v4`). Nome atual: **Lunoda**.
