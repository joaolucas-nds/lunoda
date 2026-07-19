# CLAUDE.md — Lunoda

Instruções para o Claude Code neste repositório. Leia antes de qualquer alteração.

## O que é este projeto

**Lunoda** é uma ferramenta pessoal, offline, em **arquivo `.html` único**: `index.html` (HTML+CSS+JS vanilla, ~2.770 linhas, sem build, sem dependências, sem backend). Serve para capturar interações com IAs em blocos e exportar tudo num arquivo só (JSON/MD/HTML).

O arquivo único é **decisão consciente** (`meta/DECISIONS.md`, DEC-001), não dívida técnica. **Não proponha framework, bundler ou backend** sem o usuário levantar o assunto.

## Antes de escrever código: leia o `meta/`

Este repositório usa o **Kit de Contexto Universal (KCM)** — um sistema de documentação que preserva contexto entre sessões de IA. Os arquivos ficam em `meta/` e têm papéis distintos:

| Arquivo | Papel | Quando ler |
|---|---|---|
| `meta/CEREBRO.md` | Como o assistente deve agir (princípios, higiene, gatilhos) | Início de sessão |
| `meta/CONTEXT.md` | O que o projeto é: modelo de dados, peças críticas, **armadilhas** | Início de sessão |
| `meta/STATUS.md` | O agora: o que funciona, o que quebrou, arquivos críticos | Início de sessão |
| `meta/CHANGELOG.md` | Versões entregues (SemVer) | Última entrada, no início |
| `meta/DECISIONS.md` | **Por que** as coisas são como são (DEC-N) e bugs graves (FIX-N) | Antes de mudar arquitetura |
| `meta/IDEAS.md` | Segundo cérebro — nunca perde nada | Ao capturar ideia nova |
| `meta/ROADMAP.md` | Fases de evolução (F1…F11) | Ao escolher o que fazer |
| `meta/GLOSSARY.md` | Termos próprios | Ao topar jargão |
| `meta/HISTORY.md` | Conhecimento consolidado de fases antigas | Sob demanda |

**Ordem de leitura no início:** `CEREBRO` → `CONTEXT` → `STATUS` → última entrada do `CHANGELOG`.

**Regra de higiene que mais importa:** `STATUS.md` é **rolante** (o resolvido sai e vira linha no `CHANGELOG`); `IDEAS.md` **nunca perde** (ideia muda de status, não some). Uma fonte de verdade por dado.

Ao final de uma mudança relevante, atualize `STATUS`, `CHANGELOG`, `DECISIONS` (se houve decisão), `IDEAS` (se surgiu ideia) e escreva `logs/AAAA-MM-DD.md`.

## Armadilhas do código — confira antes de mexer

- **`STORAGE_KEY = 'base_v4'`** — não renomeie sem rotina de migração: **apaga os dados do usuário**. O nome antigo do app era outro; a chave ficou.
- **`editProps` é legado.** A fonte de verdade das propriedades é o **bloco** (`blockProps`); a entrada é **calculada** por `calcPropertyValues()` (união das opções dos blocos). Não volte a usar `editProps` para decidir o que a entrada "tem".
- **Nunca deixe uma entrada com 0 blocos** — ao mover/excluir todos, recrie um bloco vazio.
- **Exportações usam prefixo `base_`** (nome antigo). Ao renomear para `lunoda_`, confira a concordância no entorno.
- **Sem suíte de testes até agora.** A ferramenta é visual; ver `tests/` abaixo para o que já dá para verificar automaticamente.

## Modelo de dados (resumo)

```js
db = {
  properties: [ { id, name, options: [ { id, name, colorId } ] } ],
  entries: [ {
    id, title, description,
    propertyValues:    { propId: [optId] },  // CALCULADO: união dos blocos
    propertyAutoFlags: { propId: [optId] },  // herda só para blocos NOVOS
    blocks: [ { id, subtitle, version, content, blockProps: { propId: [optId] } } ],
    createdAt, updatedAt
  } ]
}
```

## Testes

Não há framework. `tests/smoke.mjs` é um harness em Node puro que **extrai funções do `index.html`** e as executa isoladamente — não precisa de navegador nem de instalação.

```
node tests/smoke.mjs
```

Cobre hoje o `entryToMD()` (geração do Markdown), que é uma função pura dado um `db`. Roda em segundos e falha com mensagem clara. Detalhes em `tests/README.md`.

**Ao alterar `entryToMD`, `calcPropertyValues` ou qualquer coisa de export: rode o smoke antes de dizer que está pronto.**

Para o que o smoke não cobre (interface, `localStorage`, arrastar, cores), verifique no navegador e diga explicitamente o que testou e o que não deu para testar.

## Convenções

- Nomes de arquivos, funções e variáveis em **inglês**; comentários em **PT-BR**.
- Commits em PT-BR, imperativo curto, **sem acento** (o CMD do usuário corrompe).
- Legibilidade primeiro; performance só se medida.
- **Mudança mínima que resolve** — prefira o diff menor ao refactor grande não pedido.
- Preserve comentários existentes; remova só os órfãos.

## Ambiente

Windows (CMD). Comandos numa linha só, sem `\` de continuação; `-m` repetido para múltiplos parágrafos no commit; caminhos com `\`.

## ASU (Atualizador Automático de Scripts)

O repositório tem o ASU em `meta/ASU/`. É a via preferida para **editar** arquivos existentes a partir do chat: uma instrução `.yaml` aplica patches por âncora, com backup e rollback.

No Claude Code você edita direto — **não precisa gerar ASU aqui**. O ASU existe para quando o trabalho acontece no chat, sem acesso ao disco. Se você mudar o formato de algum doc de heading estável, lembre que âncoras de terceiros podem depender dele.

Referência: `meta/ASU/INSTRUCTION_GUIDE.md`.
