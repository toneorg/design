# Seleção

## Caixa de marcar

| | Marca | Bancada |
|---|---|---|
| Caixa | 24, raio 7 | 24, raio 7 |
| Desmarcada | fundo branco, anel 1,5 px `muted` | `surface`, borda 1,5 px `control` |
| Marcada | fundo `wine`, visto branco de 16 px com traço 2 | fundo `ink`, visto `onInk` |
| Inválida | anel 2 px `coral-700` | borda 2 px `alert` |

A caixa fica a 12 px do texto e a linha inteira é clicável, com 44 px de altura no mínimo (`size.touch`). O foco aparece na caixa: contorno de 2 px afastado 2 px. Transição de 150 ms.

## Escolha (uma entre poucas)

Pílulas lado a lado, uma marcada. Altura mínima 44, respiro lateral 16, texto 16 px.

| | Marca | Bancada |
|---|---|---|
| Solta | `coral-50` com anel 1 px `coral-200`, texto `wine` | `surface` com sombra `raised`, texto `ink` |
| Marcada | fundo `wine`, texto branco | fundo `ink`, texto `onInk` |

A escolha marcada é preenchida; um anel sozinho não basta.

## Etiqueta

Estática, não é botão: raio 8 (`radius.tag`), respiro 8 por 3, texto 12 / 16 peso 600. `ink` com `onInk`, ou `surface` com `ink`.

## Segmentado (duas ou três vistas da mesma coisa)

Trilho em pílula com respiro interno de 4; segmento de 44 de altura mínima, respiro lateral 20, texto 15 px (`ui`).

| | Marca | Bancada |
|---|---|---|
| Trilho | `wine` a 10% | `sunken` |
| Segmento marcado | fundo `wine`, texto branco | `surface` com sombra `raised`, texto `ink` peso 600 |

## Opção em lista

Linha inteira clicável: altura mínima 60, respiro 10 por 20, fio de 1 px `rule` entre linhas, dica em 14 px. Marcada, fundo `ink` e texto `onInk`.
