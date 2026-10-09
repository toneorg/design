# Tom de pele

Tom de pele é dado, não cor de interface. A escala é a de dez tons (Monk), guardada num arquivo de dados em cada produto, e esse arquivo entra em `allow` no `tone-design.json`. O tom é identificado pelo número, de 1 a 10.

## Amostra

- Círculo preenchido com a cor do dado.
- Anel de 1 px por dentro, preto a 10% no claro e branco a 10% no escuro (`imageOutline`). Nunca tingido: é ele que impede o tom mais claro de se dissolver no fundo.
- **Escolhida**: um vão e um anel na cor de ação. Na marca, 3 px de branco e 2 px de `wine`; na amostra pequena, 2 px e 1,5 px. Na bancada, o anel é `ink`.
- Texto em cima de uma amostra: branco a cerca de 90% sobre tom profundo, `ink` a cerca de 70% sobre tom claro.
- Onde ela compara amostras, o fundo é a bancada ou um cartão branco ou blush. Coral nunca encosta numa amostra.

## Seletor de tom

Os dez tons em ordem, do mais claro ao mais profundo, com o número visível e uma saída para quem não sabe dizer.

| | Valor |
|---|---|
| Amostra | círculo de 44 (48 a partir de 640 px) |
| Grade | 5 por linha no celular, 10 a partir de 640 px; 8 de vão na horizontal e 16 na vertical |
| Número | embaixo da amostra, 14 px, algarismos tabulares |
| Escolhido | vão branco de 3 px e anel de 2 px na cor de ação |
| Foco | contorno de 2 px na cor de ação, afastado 2 px |
| Inválido | contorno de 2 px `coral-700` (`alert` na bancada) em volta do grupo |
| "Não sei dizer" | um círculo de 24 com anel, ao fim da escala |

O tom escolhido fica sempre marcado, também quando ela volta à pergunta.

## Amostra de produto

A mesma amostra, com a cor da cartela vinda do catálogo. De 12 px (ponto num botão) a 32 px (lista de cores), sempre com o anel de 1 px.
