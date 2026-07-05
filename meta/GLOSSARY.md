# GLOSSARY.md — Termos do Projeto

> **Opcional.** Use quando o projeto tem vocabulário próprio (nomes de módulos, conceitos, identificadores) que o assistente reexplicaria a cada sessão sem isto.
> Mantenha curto: só o que não é óbvio para alguém de fora.

---

## Conceitos do projeto
- **Entrada (entry)** — um registro/"página" da tabela. Tem título, descrição, propriedades e uma lista de blocos.
- **Bloco (block)** — unidade de conteúdo dentro de uma entrada. Tem subtítulo, versão, conteúdo e suas próprias propriedades (`blockProps`). É a **fonte de verdade** das propriedades.
- **Propriedade (property)** — categoria com opções coloridas (ex.: "Tags", "IA Utilizada"). Cada opção tem `id`, `name`, `colorId`.
- **Herança automática** — flag por opção (`propertyAutoFlags`) que faz **blocos novos** nascerem com aquela opção. Não afeta blocos existentes.
- **Chip `●auto`** — no painel de um bloco, indica opção vinda da herança automática. Clicar remove do bloco e desliga a flag na entrada.
- **Inverter posse** — (ideia v13) com blocos selecionados, clicar numa propriedade adiciona a quem não tem e remove de quem tem.
- **Herança entre versões** — (ideia v13) propagar/travar uma propriedade em todas as versões de um mesmo subtítulo de bloco.

## Arquiteturas / módulos
- **`propertyValues`** — propriedades da entrada, **calculadas** como união das opções de todos os blocos ao salvar. Não editar à mão.
- **`propertyAutoFlags`** — `{ propId: [optId] }`, opções com adição automática a novos blocos ligada.
- **`blockProps`** — `{ propId: [optId] }` por bloco, o que o bloco realmente tem.
- **`editProps`** — variável legada do editor; **não é mais fonte de verdade** (ver armadilha no CONTEXT).

## Comandos / artefatos
- **`Lunoda_vN.html`** — a aplicação. Versão canônica atual: `Lunoda_v12.html`.
- **`lunoda_vN_guide.md`** — guia passo a passo de uma versão para a próxima (o produto de cada sessão de dev — ver DEC-002).
- **`favicon.png`** — ícone na raiz do repositório GitHub.

## Identificadores
- **`STORAGE_KEY = 'base_v4'`** — chave do `localStorage`. Não muda com a versão do app; não alterar sem migração (perderia dados).
- **`AI_HINTS`** — lista de nomes de IAs sugeridos como subtítulo de bloco (Claude, Gemini, ChatGPT, etc.).
- **DEC-N / FIX-N** — IDs de decisões e correções no DECISIONS.md.
- **C1–C3 / Q1** — conflitos e questão aberta das ideias da v13 (ver IDEAS).

## Nomes históricos
- **Synap / base / Nexus** — nomes antigos do app (daí `base_v4`, prefixos `base_`, chave legada `nexus_db_v4`). Nome atual: **Lunoda**.
