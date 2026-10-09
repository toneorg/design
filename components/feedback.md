# Retorno

## Erro de campo

Texto logo abaixo do campo, 15 px peso 500, `coral-700` na marca e `alert` na bancada, anunciado ao leitor de tela (`role="alert"`). Veja [Campo](field.md).

## Erro de tela e tela vazia

Um círculo de 64 com o ícone, uma frase, uma explicação em `graphite` e uma ação. Na versão compacta do erro, o texto vai em 14 / 20 peso 500 com um botão `outline` pequeno.

## Aviso rápido

Pílula `ink` com texto `onInk` de 14 / 20 peso 600, respiro 18 por 12, altura mínima 40, largura máxima 420, perto do topo. Fica 2,4 s, entra e sai em 150 ms e é anunciada ao leitor de tela.

## Espera

- **No botão**: desabilitado, dizendo o que faz. Veja [Botão](button.md).
- **Lendo um link**: três pontos que pulsam em sequência, 1,1 s por ciclo, 160 ms entre um e outro.
- **Tela inteira**: indicador com uma frase, com papel de barra de progresso para o leitor de tela.

Com movimento reduzido a animação para e o texto continua.

## Medidor de confiança

Três barras lado a lado; as preenchidas dizem o nível. O nível vem sempre escrito ao lado: as barras sozinhas não informam.

| | Marca | Bancada |
|---|---|---|
| Barra | 4 de largura por 12 de altura, vão 2 | 22 de largura por 6 de altura, raio 3, vão 3 |
| Cheia / vazia | `wine` / `wine` a 20% | `ink` / `rule` |
| Texto | 14 px | 15 px, peso 600 |
