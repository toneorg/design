# tone · design system

A fonte única da interface da tone: cor, tipografia, espaço, raio, movimento, marca e as regras de uso. O site ([`toneorg/web`](https://github.com/toneorg/web)), o app e o produto para marcas instalam este repositório como dependência, numa versão fixa.

- **As regras** estão em [`DESIGN.md`](DESIGN.md) e nas fichas de [`components/`](components/README.md). É o que pessoa ou agente lê antes de mexer em interface.
- **Os valores** estão em [`tokens/`](tokens) e saem gerados em `dist/`.
- **A marca** está em [`assets/`](assets): logo e fontes.

## O que tem aqui

| Pasta | O quê |
|---|---|
| `tokens/` | Os tokens, em JSON, no estilo do Design Tokens Community Group (`$value`, `$type`, `$description`). É a única coisa que se edita para mudar um valor |
| `dist/` | Gerado e commitado: `theme.css` (Tailwind 4), `tokens.css` (variáveis CSS), `index.js` com tipos (JavaScript e React Native), `tokens.json`, e as duas folhas do esquema escuro |
| `DESIGN.md`, `components/` | Regras de uso e fichas de componentes |
| `assets/logo` | O logo em SVG e PNG |
| `assets/fonts` | Crimson Pro e Host Grotesk: woff2 variáveis e cortes estáticos em TTF |
| `bin/check.mjs` | `tone-design-check`: falha quando um produto escreve cor à mão |
| `scripts/build.mjs` | Gera `dist/` |
| `tests/` | Testes do gerador, da checagem e das regras de contraste |

## Usar num produto

```sh
pnpm add github:toneorg/design#v0.1.0   # ou: npm install github:toneorg/design#v0.1.0
```

Nada é publicado em registry: a dependência aponta para a tag deste repositório, e o lockfile trava o commit.

```css
/* Tailwind 4 */
@import "tailwindcss";
@import "@toneorg/design/theme.css";

/* CSS puro */
@import "@toneorg/design/tokens.css";
```

```ts
import { color, neutral, radius } from "@toneorg/design";
```

Em cada produto:

1. O `AGENTS.md` aponta para `node_modules/@toneorg/design/DESIGN.md`, para toda sessão de agente já começar sabendo onde estão as regras.
2. Um `tone-design.json` na raiz diz o que a checagem lê, e o CI roda `tone-design-check`:

```json
{
  "include": ["src"],
  "allow": ["src/lib/tones.ts"],
  "legacy": { "src/antigo.ts": 4 }
}
```

`allow` são arquivos em que cor é dado (tons de pele, cartelas). `legacy` são cores literais que já existiam antes da migração, com a contagem por arquivo: o número tem de bater, então não sobe sem ninguém ver e a entrada sai quando chega a zero. Uma linha isolada pode levar `tone-design-ignore: <motivo>`.

## Mudar o sistema

1. Edite `tokens/*.json` (e o `DESIGN.md` ou a ficha, se a regra muda).
2. `node scripts/build.mjs` e `node --test`.
3. Commite os tokens e o `dist/` juntos.

O CI falha se `dist/` não corresponde aos tokens.

## Lançar uma versão

```sh
npm version minor --no-git-tag-version   # ou patch, ou major
node scripts/build.mjs                   # a versão entra em dist/
node --test
git commit -am "chore: v0.2.0"
git tag v0.2.0
git push --follow-tags
```

Depois, em cada produto: `pnpm add github:toneorg/design#v0.2.0`, rodar os testes e abrir o PR.

| Tipo | Quando |
|---|---|
| patch | Texto das regras, correção que não muda valor |
| minor | Token novo, valor mudado, ficha nova |
| major | Token renomeado ou removido (o produto quebra ao atualizar) |

## Fontes e logo

As duas famílias são livres (SIL Open Font License; as licenças estão em `assets/fonts`). O logo e o nome tone são da tone e não estão sob licença aberta.
