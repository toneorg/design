# Como trabalhar neste repositório

Este é o design system da tone. Três produtos o instalam por tag do git; o que entra aqui muda a interface de todos eles no próximo bump.

- **Só `tokens/*.json` define valor.** `dist/` é gerado: nunca edite à mão. Depois de mexer em token, rode `node scripts/build.mjs` e commite `dist/` no mesmo commit.
- **Regra e valor andam juntos.** Mudou um token, atualize `DESIGN.md` e a ficha em `components/` no mesmo commit. Toda promessa de contraste do `DESIGN.md` tem teste em `tests/contrast.test.mjs`.
- **Sem dependências.** O pacote é instalado direto do git, sem build: `scripts/` e `bin/` usam só o Node.
- **Nome é contrato.** Renomear ou remover um token quebra os produtos: é versão major, e o tema do Tailwind tem de manter os nomes que o site usa (`tests/build.test.mjs`).
- **Antes de commitar:** `node scripts/build.mjs --check` e `node --test`.
- **Língua:** documentação em português do Brasil; identificadores em inglês.
- **O repositório é público.** Nada de estratégia de produto, dado pessoal ou segredo aqui: só o sistema visual.
- Lançar versão: veja "Lançar uma versão" no `README.md`. Conventional commits (`feat:`, `fix:`, `docs:`, `chore:`).
