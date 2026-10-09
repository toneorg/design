# Superfície

## Painel (terreno de marca)

O bloco grande do site: uma cor chapada, sem sombra e sem borda.

| | Valor |
|---|---|
| Raio | 32 (`radius.tile`) |
| Respiro | 24; 40 a partir de 640 px; 56 nas seções maiores |
| Fundo | branco, `coral-50`, `coral-100`, `coral-200`, `coral`, `wine-800` ou `wine-950` |
| Dentro dele | cartão de raio 20 (`radius.panel`) ou linha de raio 16, com respiro 16 a 24 |

O texto segue as regras de contraste do fundo (veja Cor no `DESIGN.md`).

## Cartão (bancada neutra)

| | Valor |
|---|---|
| Raio | 28 (`radius.card`) |
| Respiro | 20 |
| Fundo | `surface` com sombra `raised` |
| Dentro dele | bloco `sunken` de raio 20 e respiro 16; grupo de linhas de raio 20 separado por fio `rule` |

A borda do cartão é a sombra `raised`, não uma linha: ela se adapta ao que está atrás e vira um anel claro no escuro.

## Folha

| | Valor |
|---|---|
| Topo | raio 28, alça de 36 por 4 |
| Altura | até 88% da tela |
| Corpo | margem lateral 20 (`size.gutter`), 16 entre blocos; rodapé com 12 de respiro acima |
| Fundo | `paper`, sobre véu `scrim` |
| Movimento | entra em 300 ms com `easing.soft`, sai em 150 ms; sem movimento quando reduzido |

A folha é modal para o leitor de tela.

## Barra flutuante

Pílula fixa embaixo: fundo `wine-950` a 90% com desfoque, links `coral-200` que ficam brancos, 44 de altura mínima por link, respeitando a área segura do aparelho.
