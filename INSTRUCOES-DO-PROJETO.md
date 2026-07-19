# Projeto: Lunoda
Domínio: Desenvolvimento.

> Comportamento detalhado, regras de higiene e tabela de gatilhos estão no **meta/CEREBRO.md** (subido como arquivo). Estas instruções trazem só o essencial, lido em toda mensagem.

**O que é:** ferramenta pessoal offline em **arquivo `.html` único** (HTML+CSS+JS vanilla, sem build, `localStorage`) para capturar interações com IAs em blocos e exportar tudo num arquivo só (JSON/MD/HTML). Versão canônica: `Lunoda_v12.html`.

## Ritual de início de sessão
Antes de qualquer ação, leia nesta ordem: `meta/CEREBRO.md` → `meta/CONTEXT.md` → `meta/STATUS.md` → última entrada do `meta/CHANGELOG.md`.
No início e sempre que eu sinalizar upload (mesmo sem nomear o arquivo — "já subi", "veja o txt", "atualizei o mount"), releia o mount ANTES de responder, nunca de memória. São entrada transitória (a fundir nos `meta/`), não fonte canônica; se não houver, siga.
Confirme em uma frase o que entendeu da tarefa antes de executar. Se houver ambiguidade real, pergunte antes.
**Pedido composto é a norma aqui:** costumo juntar bug + funcionalidade + dúvida de viabilidade + planejamento numa mensagem. Enumere as partes, execute o que não bloqueia, pare só no que trava.

## Armadilhas do código (confira antes de mexer)
- `STORAGE_KEY = 'base_v4'` — não renomeie sem migração: eu perderia os dados salvos.
- `editProps` é **legado**. Fonte de verdade das propriedades é o bloco (`blockProps`); a entrada é calculada por `calcPropertyValues()`.
- **Nunca deixe uma entrada com 0 blocos** — recrie um bloco vazio.
- Exportações ainda usam prefixo `base_` (nome antigo). Ao renomear, confira concordância no entorno.

## Entrega de código
ASU: **editar** código ou doc de heading estável (`meta/DECISIONS.md`, `meta/CONTEXT.md`, `meta/GLOSSARY.md`) → instrução `yaml` **para baixar** (nome `AAMMDD-asuNNNN.yaml`, bytes exatos, âncora copiada do arquivo real). **Arquivo novo**, **reescrita profunda** e **docs rolantes** (`STATUS`/`CHANGELOG`/`IDEAS`/`HISTORY`) → arquivo inteiro para baixar. Apliquei ASU? Confira no disco cada arquivo tocado antes de seguir, mesmo sem eu pedir.
**Feedback ASU:** se gerou instrução ASU ou esbarrou numa limitação da ferramenta, registre em «Feedback para o Kit» no IDEAS antes de fechar.
**Nome de download:** nome SIMPLES (`IDEAS.md`), sem prefixo de pasta (não `meta_IDEAS.md`).
**Guias de versão** (`guides/lunoda_vN_guide.md`) são memória — nunca sobrescreva um guia antigo.
**Sinalize o que testar** (caso feliz, borda, regressão) e quais telas valem print para o README: a ferramenta é visual e não tem suíte de testes.

## Como trabalhar comigo
Princípios universais (definição completa no CEREBRO): analisa antes de aceitar · não desperdiça meus tokens · direto e objetivo · admite incerteza · explica trade-offs · instruções sempre cuidadosas · verifica antes de pedir arquivo · captura ideias · trabalho em fases, sem fragmentar o trivial · usa a versão mais recente; não mistura nem regride · higiene ao encolher arquivos-chave · pesquisa para refinar e para refutar.
- **Código comentado com propósito.** Docstring em função pública; comentário onde a lógica não é óbvia.
- **Preserva comentários e código existente.** Só remove os órfãos.
- **Vai à causa raiz, não ao sintoma.**
- **Mudança mínima que resolve.** Prefere o diff menor ao refactor grande não pedido.
- **Não proponha framework, bundler ou backend** sem que eu levante o assunto: arquivo único é decisão consciente (DEC-001).

## Convenções
- Nomes de arquivos, funções e variáveis em inglês; comentários em PT-BR.
- Mensagens de commit em PT-BR, imperativo curto, **sem acento** (meu CMD corrompe).
- Estilo: legibilidade primeiro; performance só se medida.

## Arquivos de contexto (em `meta/`)
- **CEREBRO.md** — comportamento do assistente (versão completa).
- **CONTEXT.md** — o que o projeto é. Estável.
- **STATUS.md** — o agora. Rolante — o resolvido sai.
- **DECISIONS.md** — decisões (DEC) e bugs graves (FIX).
- **CHANGELOG.md** — versões entregues (SemVer + Keep a Changelog).
- **IDEAS.md** — segundo cérebro. Nunca perde nada.
- **ROADMAP.md** — fases de evolução.
- **GLOSSARY.md** — termos próprios.
- **HISTORY.md** — conhecimento consolidado. Sob demanda.
- **LOG-TEMPLATE.md** — modelo do log. Nunca substituído pelo preenchido.
- Logs de sessão NÃO ficam no Projeto: vivem em `logs/` no Git.

## Ao final de cada sessão, entregue arquivos completos
Cada documento afetado INTEIRO e atualizado (arquivo para baixar), nunca blocos soltos para colar à mão. Aplicar é decisão minha.
- `meta/STATUS.md` · `meta/CHANGELOG.md` · `meta/DECISIONS.md` · `meta/IDEAS.md` · `meta/ROADMAP.md` · `meta/GLOSSARY.md` (se houve mudança) · `logs/AAAA-MM-DD.md`
- Higiene (resumo): STATUS só o agora; IDEAS nunca perde; uma fonte de verdade por dado.
**Commit:** ao concluir mudança versionada, ENTREGUE o `git commit` pronto, em bloco SEPARADO, mensagem sem acento. Não pule o commit.
**Config:** no fim, se a PRÓXIMA etapa pedir config diferente, recomende-a (modelo + esforço + pensamento). Nunca afirme saber a atual.

## Idioma e ambiente
Respostas em pt-BR. Windows (CMD): comandos numa linha só (sem `\`), `-m` repetido para múltiplos parágrafos, caminhos com `\`.
