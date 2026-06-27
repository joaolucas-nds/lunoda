# CONTEXT.md — [Nome do Projeto]

> Arquivo **estável**. O assistente lê no início de cada sessão para se ambientar.
> Muda pouco: só em alteração estrutural (stack, arquitetura, escopo, nova armadilha descoberta).
> Mantenha enxuto — descreve o que o projeto É, não o que está acontecendo agora (isso é o STATUS).

---

## Visão Geral
[2-4 frases: o que o projeto faz, para quem, qual problema resolve. Sem marketing.]

## Stack Tecnológica
- **Linguagem(ns):** [ex: Python 3.11]
- **Framework(s):** [ex: FastAPI]
- **Banco / persistência:** [ex: SQLite via SQLAlchemy]
- **Front-end:** [se houver]
- **Testes:** [ex: pytest]
- **Deploy:** [ex: Docker + VPS]

## Estrutura do Projeto
```
[Árvore de pastas essencial — só o que importa para navegar.
Não cole a árvore inteira; só os diretórios e arquivos que um recém-chegado
precisa entender. Anote a função de cada um em uma linha.]

projeto/
├── src/
│   ├── core/          # [o que vive aqui]
│   └── ...
├── tests/
└── ...
```

## Convenções de Código
- **Nomes:** [arquivos, funções, variáveis — idioma e estilo. Ex: snake_case, inglês.]
- **Comentários:** [idioma; quando comentar.]
- **Commits:** [formato. Ex: imperativo curto em PT-BR; Conventional Commits.]
- **Estilo:** [linter/formatter. Ex: ruff + black; eslint + prettier.]
- **Imports/organização:** [convenção, se houver.]

## Como o [componente crítico] funciona (CRÍTICO)
> Use esta seção para o(s) mecanismo(s) central(is) que, se mal-entendidos, geram bug.
> Ex: como o arquivo de configuração central é lido; como o pipeline de dados flui;
> como a autenticação encadeia. Explique em prosa + exemplo mínimo.

[Descrição do mecanismo. O assistente vai consultar isto antes de mexer na peça.]

## Arquitetura — pontos-chave
[Decisões estruturais em uma linha cada, com referência ao raciocínio completo em DECISIONS.md.]
- [Ponto] — ver DEC-00X.
- [Ponto] — ver DEC-00Y.

## Armadilhas Conhecidas (o que NÃO fazer)
> A parte mais valiosa do arquivo. Cada armadilha já custou tempo uma vez.
> Formato: o que parece certo → por que está errado → o que fazer em vez disso.

1. **[Armadilha]** — [por que morde] → [o certo].
2. **[Armadilha]** — [por que morde] → [o certo].

## Contexto de Produto
> Por que o projeto existe e para onde aponta. Evita decisões tecnicamente corretas mas erradas para o produto.
- **Usuário-alvo:** [quem usa]
- **Dor que resolve:** [a dor concreta]
- **O que é sucesso:** [como se mede]
- **O que o projeto deliberadamente NÃO é:** [limites de escopo]
