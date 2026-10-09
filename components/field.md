# Campo

## Referência

| | Valor |
|---|---|
| Altura mínima | 52 (`size.controlLg`) |
| Respiro lateral | 16 |
| Raio | 16 (`radius.input`) |
| Texto | 16 px (`body`). Nunca menos: o iOS dá zoom ao focar |

| Terreno | Fundo | Texto | Borda | Hover | Foco | Inválido |
|---|---|---|---|---|---|---|
| Marca (campo sobre painel branco) | `coral-50` | `wine`, exemplo em `muted` | anel interno 1 px `coral-200` | anel `coral-300` | contorno 2 px `wine`, para dentro | anel interno 2 px `coral-700` |
| Bancada | `surface` | `ink` | 1 px `rule` | | 2 px `ink` | 2 px `alert` |

A borda e o estado inválido ficam numa propriedade e o foco em outra, para um nunca apagar o outro. A transição é de 150 ms.

### Rótulo, dica e erro

- Rótulo acima do campo: 16 px, peso 500. A 4 px da dica e a 12 px do campo.
- Dica: 15 px, peso 400, na cor secundária do terreno.
- Erro: 15 px, peso 500, `coral-700` na marca e `alert` na bancada.
- Dica e erro ligados ao campo por `aria-describedby`; campo inválido com `aria-invalid`. Ao enviar com erro, o foco vai para o primeiro campo inválido.

### Variações

- **Lista**: o mesmo campo com uma seta de 16 px no fim (respiro de 44 px desse lado).
- **Busca**: pílula de 48 de altura, ícone de 20 px, botão de limpar com área de toque ampliada.
- **Campo com ação** (captura de e-mail): pílula branca com o campo e um botão `md` dentro; o foco e o erro aparecem como anel de 2 px `wine` na pílula inteira.
