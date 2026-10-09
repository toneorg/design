# Design system da tone

Regras de interface para os produtos da tone: o site, o app e o produto para marcas. Quem vai criar ou mudar uma tela, pessoa ou agente, lê este arquivo inteiro antes e depois a ficha do componente em `components/`.

Os valores moram em `tokens/` e chegam ao produto pelos arquivos gerados em `dist/`. No código do produto nunca se copia um valor: usa-se a classe, a variável ou o import. Se falta um token ou um componente, a mudança é feita neste repositório (`toneorg/design`), sai numa versão nova e só então entra no produto.

## Princípios

1. **Um matiz, muitos tons.** Toda cor de marca é o coral movido para cima ou para baixo em luminosidade. A paleta é, literalmente, uma cartela de tons.
2. **A única cor que informa é a pele.** Tom de pele e cor de produto são dado: aparecem só onde dizem alguma coisa, nunca como enfeite. Onde ela compara tons, o entorno é neutro, para a cor ser lida de verdade.
3. **Título serifado, grande e leve; interface em grotesca.** Crimson Pro fala, Host Grotesk trabalha.
4. **Movimento com motivo.** Uma animação mostra um estado ou uma sequência do produto. Nada se mexe só para enfeitar, e nada se mexe para quem pediu menos movimento.
5. **Acessível por padrão.** Contraste, foco visível e alvo de toque não são etapa de revisão: já vêm nos tokens e nas fichas.

## Dois terrenos

Toda tela está em um de dois terrenos. A forma (tipografia, raio, espaço, movimento) é a mesma nos dois; o que muda é a cor.

| | Terreno de marca | Bancada neutra |
|---|---|---|
| Quando | Site, entrada no app, telas vazias, momentos de marca | Toda tela em que ela escolhe o próprio tom, vê uma cartela, lê um veredito com amostra ou compara fotos de produto |
| Fundo | Branco, blush (`coral-50`, `coral-100`), coral ou vinho | `paper`, com `surface` e `sunken` |
| Texto | `wine`; secundário `muted` | `ink`; secundário `graphite` |
| Ação principal | Botão vinho (botão coral sobre vinho) | Botão `ink` |
| Esquema escuro | Não tem | Tem (`neutral.dark`) |

Para decidir: a tela mostra amostra de pele, cor de produto ou foto de produto para ela comparar? Então é bancada. Num terreno de marca, uma amostra só aparece dentro de um cartão branco ou blush, nunca encostada no coral.

Dentro do terreno de marca, o coral é onde a tone fala em primeira pessoa: a abertura, uma promessa, a chamada para a lista. Não é fundo de leitura longa.

## Cor

### Marca

| Token | Valor | Uso |
|---|---|---|
| `coral-50` | `#fff4f2` | Blush: fundo claro, texto claro sobre vinho |
| `coral-100` | `#fee9e5` | Fundo do botão discreto, painel claro |
| `coral-200` | `#ffd4cd` | Seleção de texto, anel de foco sobre vinho, texto secundário sobre vinho |
| `coral-300` | `#ffb5aa` | Hover do botão coral |
| `coral` (`coral-500`) | `#e26b5c` | O coral da marca: campo de cor e título grande. Nunca texto pequeno |
| `coral-600` | `#c44134` | Coral em texto pequeno sobre branco |
| `coral-700` | `#9e2d28` | Erro de campo e ênfase em texto sobre fundo claro |
| `wine-800` | `#50171c` | Hover e desabilitado do botão vinho, painel escuro |
| `wine` (`wine-900`) | `#340b10` | O vinho da marca: texto e ação principal |
| `wine-950` | `#210507` | Painel escuro mais profundo |
| `muted` | `#75595c` | Texto secundário em fundo claro |
| `white`, `black` | `#ffffff`, `#000000` | |

### Contraste

Estas regras são testadas contra os tokens em `tests/contrast.test.mjs`.

- Sobre coral, o único texto permitido é vinho (5,4:1). Branco sobre coral dá 3,2:1: só em título de 24 px ou mais.
- Coral como texto pequeno sobre branco é `coral-600` (5,1:1), nunca `coral`.
- `muted` passa de 4,5:1 sobre branco, `coral-50` e `coral-100`. Não use sobre coral nem sobre vinho.
- Sobre vinho: branco, `coral-50`, `coral-200`, `coral-300` e `coral` passam como texto.

### Bancada neutra

Os mesmos nomes no claro e no escuro.

| Papel | Claro | Escuro | Uso |
|---|---|---|---|
| `paper` | `#f3f3f2` | `#151413` | Fundo da página |
| `surface` | `#ffffff` | `#211f1d` | Cartões, campos e folhas |
| `sunken` | `#e9e8e6` | `#2b2927` | Preenchimento discreto atrás de imagens e dentro de painéis |
| `ink` | `#292420` | `#f3f3f2` | Texto e ação principal |
| `inkPressed` | `#3d3631` | `#dad9d7` | Ação principal pressionada |
| `inkDisabled` | `#5b534d` | `#8f8b87` | Ação principal em espera |
| `onInk` | `#f3f3f2` | `#1d1b19` | Texto sobre `ink` |
| `graphite` | `#5e5a57` | `#aba7a3` | Texto secundário |
| `rule` | `#dad9d7` | `#383532` | Fios e bordas de campo |
| `edge` | `#b9b7b4` | `#55514d` | Borda mais marcada que `rule` |
| `control` | `#8f8b87` | `#7d7975` | Contorno de controle desmarcado (3:1, não é cor de texto) |
| `alert` | `#a8241c` | `#f08a80` | Erro |
| `scrim` | preto quente a 45% | preto a 60% | Véu atrás de folhas |
| `imageOutline` | preto a 10% | branco a 10% | Anel de 1 px por dentro de toda imagem e amostra |
| `raised` (sombra) | anel e um pouco de altura | um anel claro | Borda de superfície elevada: cartão, botão de contorno, chip |
| `floating` (sombra) | fio e sombra para cima | um fio claro | Barra fixa de baixo sobre conteúdo que rola |

O anel de imagem é sempre preto ou branco puro, nunca tingido: é ele que separa uma amostra clara do fundo sem mudar a cor que ela mostra.

### Cor que é dado

Tons de pele (a escala Monk de dez tons), cores de cartela e fotos vêm de dados, não dos tokens. Ficam em arquivos próprios (`tones.ts`, `color.ts`, catálogo) e esses arquivos entram em `allow` no `tone-design.json` do produto. Toda outra cor escrita à mão faz `tone-design-check` falhar.

## Tipografia

Duas famílias, e só elas.

| Papel | Família | Pesos em uso |
|---|---|---|
| Título (`display`) | Crimson Pro | 300, 400, 500, com itálico |
| Texto e interface (`sans`) | Host Grotesk | 400, 500, 600 |

### Títulos

Crimson Pro tem o olho da letra pequeno, então os tamanhos são maiores do que uma grotesca pediria. O título é leve em tela larga, onde o tamanho sustenta, e um passo mais pesado no celular, onde o traço fino sumiria sobre o coral. A virada é em 48rem.

| Estilo | Tamanho | Entrelinha | Espaço entre letras | Peso (celular / largo) | No celular |
|---|---|---|---|---|---|
| `display-xl` | `clamp(2.75rem, 10.8vw, 9.5rem)` | 0,94 | -0,025em | 400 / 300 | 44 px |
| `display-word` | `clamp(4rem, 17vw, 9.5rem)` | 0,94 | -0,025em | 400 / 300 | 64 px |
| `display-lg` | `clamp(2.6rem, 8vw, 6.25rem)` | 0,98 | -0,02em | 400 / 300 | 41,6 px |
| `display-md` | `clamp(1.95rem, 3.8vw, 3rem)` | 1,04 | -0,015em | 400 / 300 | 31,2 px |
| `display-sm` | `1.625rem` | 1,15 | -0,01em | 500 / 400 | 26 px |

`display-word` é para uma ou duas palavras que podem ficar enormes no celular; uma frase inteira usa `display-xl`. A coluna "No celular" é o piso do `clamp`: o tamanho que um celular recebe e o ponto de partida para o app nativo (`display.xl.phone` no módulo JS).

### Texto

| Estilo | Tamanho / entrelinha | Peso | Uso |
|---|---|---|---|
| `lead` | `clamp(1.125rem, 1.6vw, 1.3125rem)` / 1,5 | 400 | Parágrafo de abertura |
| `subheading` | 17 / 23 | 600 | Título de bloco dentro de uma tela |
| `body` | 16 / 24 | 400 | Texto corrido; também o texto de campo |
| `ui` | 15 / 20 | 500 | Rótulo de botão padrão, link, dica e erro de campo |
| `small` | 14 / 20 | 400 | Texto de apoio |
| `caption` | 13 / 18 | 400 | Legenda, número de tom |
| `label` | 11 / 14 | 500 | Rótulo de aba. O menor texto permitido |

- Campo de texto tem 16 px ou mais: abaixo disso o iOS dá zoom ao focar.
- Título equilibra as linhas (`text-wrap: balance`); parágrafo evita viúva (`text-wrap: pretty`).
- Número que muda ou se alinha em coluna (número de tom, preço) usa algarismos tabulares.
- Serifa em itálico é a voz dela (as perguntas que ela se faz); em romano, é a tone respondendo.

### Logo

O logo é a palavra "tone" em Crimson Pro Medium (500), minúscula, com -0,04em entre as letras. Os arquivos estão em `assets/logo` (palavra, o "t" sozinho e o "t" num quadrado, em vinho, coral, blush, preto e branco), todos em contorno. Em tela, use o arquivo; só componha em texto onde a fonte já está carregada.

### Arquivos de fonte

`assets/fonts/variable` tem os woff2 variáveis (web sem `next/font`) e `assets/fonts/static` os cortes estáticos em TTF (app nativo). Veja `assets/fonts/README.md`. No Next, as fontes entram por `next/font/google` nas variáveis `--font-crimson-pro` e `--font-host-grotesk`, que `theme.css` já lê.

## Espaço e tamanho

Base 4. No Tailwind é a escala numérica padrão.

| Token | px | Tailwind |
|---|---|---|
| `space.xs` | 4 | `1` |
| `space.sm` | 8 | `2` |
| `space.md` | 12 | `3` |
| `space.lg` | 16 | `4` |
| `space.xl` | 20 | `5` |
| `space.xxl` | 28 | `7` |
| `space.xxxl` | 40 | `10` |

| Token | px | |
|---|---|---|
| `size.gutter` | 20 | Margem lateral da tela no celular |
| `size.touch` | 44 | Alvo de toque mínimo. Um controle menor ganha área invisível até chegar nisso |
| `size.controlMd` | 44 | Altura mínima de botão no tamanho padrão |
| `size.controlLg` | 52 | Altura mínima de botão grande e de campo de texto |

## Raio

Raio por papel, não por tamanho.

| Token | px | Uso |
|---|---|---|
| `radius.full` | 999 | Botões, chips, pílulas |
| `radius.tile` | 32 | Painel grande nos terrenos de marca |
| `radius.card` | 28 | Cartão sobre a bancada e topo de folha |
| `radius.panel` | 20 | Superfície dentro de um painel ou cartão |
| `radius.input` | 16 | Campo de texto |
| `radius.thumb` | 12 | Miniatura |
| `radius.tag` | 8 | Etiqueta estática: mais quadrada que um chip, para não parecer botão |

Superfície dentro de superfície: o raio de dentro é o de fora menos o respiro entre elas, nunca menos de 4.

## Movimento

| Token | Valor | Uso |
|---|---|---|
| `duration.fast` | 150 ms | Resposta a toque e mudança de estado |
| `duration.enter` | 300 ms | Uma folha entra |
| `duration.exit` | 150 ms | Uma folha sai |
| `duration.rise` | 400 ms | Entrada em sequência de um bloco |
| `duration.stagger` | 100 ms | Intervalo entre um elemento e o próximo |
| `easing.soft` | `cubic-bezier(0.2, 0, 0, 1)` | Curva padrão |
| `motion.pressScale` | 0,96 | Controle enquanto é pressionado |
| `motion.riseDistance`, `motion.riseBlur` | 12 px, 4 px | Subida e desfoque inicial da entrada em sequência |

- Entrada em sequência: opacidade, subida de 12 px e um pouco de desfoque, em 400 ms, um elemento a cada 100 ms. Roda uma vez.
- Todo movimento tem a versão para `prefers-reduced-motion` (no app, "Reduzir movimento"): o estado final aparece de uma vez, e a escala do toque vira mudança de opacidade ou some.
- Animação em laço para quando sai da tela.

## Acessibilidade

- **Foco visível** em tudo que recebe teclado: contorno de 2 px, afastado 2 px no controle (3 px no padrão da página). Cada variante de botão nomeia a cor do próprio anel, porque a cor do texto sumiria contra o fundo.
- **Toque**: 44 px no mínimo.
- **Contraste**: as regras da seção de cor. Texto nunca usa `control`, `rule` ou `edge`.
- **Erro** não depende só de cor: tem texto, e o campo fica marcado como inválido para o leitor de tela.
- **Texto ampliado** é respeitado. No app, com teto por estilo para o layout aguentar.

## Componentes

As fichas estão em [`components/`](components/README.md): botão, campo, seleção (caixa, escolha, segmentado), superfície (painel, cartão, folha), tom de pele (seletor e amostra), retorno (erro, aviso, espera, medidor) e ícone. Cada ficha é a referência; o que um produto ainda faz diferente dela está listado no `AGENTS.md` do próprio produto.

## Como um produto recebe os tokens

| Onde | Entrada | Uso |
|---|---|---|
| Next + Tailwind 4 | `@import "@toneorg/design/theme.css";` depois de `@import "tailwindcss";` | Classes: `bg-coral`, `text-wine`, `bg-paper`, `text-ink`, `rounded-tile`, `shadow-raised`, `text-ui`, `display-xl`, `press` |
| CSS puro | `@import "@toneorg/design/tokens.css";` | Variáveis: `var(--tone-ink)`, `var(--tone-radius-full)`, `var(--tone-duration-fast)` |
| JavaScript e React Native | `import { color, neutral, radius } from "@toneorg/design";` | `color.coral[500]`, `neutral.light.ink`, `radius.card` |

O esquema escuro da bancada é opcional: `theme-dark.css` ou `tokens-dark.css`, com `data-tone-scheme="dark"` no elemento. No app, `neutral.dark`.

## Nunca

- Escrever cor à mão (hex, `rgb()`, `oklch()`) fora dos arquivos de dado.
- Texto pequeno em coral, ou texto branco pequeno sobre coral.
- Coral encostado numa amostra de pele ou numa cor de produto.
- Sombra ou anel de imagem tingido.
- Uma terceira família tipográfica. Tela que ainda usa outra fonte troca ao ser migrada.
- Animação sem a versão para movimento reduzido.
- Copiar um valor dos tokens para o código em vez de usar o token.
