# Botão

## Referência

Pílula (`radius.full`), rótulo em Host Grotesk peso 500, numa linha só.

| Tamanho | Altura mínima | Respiro lateral | Rótulo |
|---|---|---|---|
| `md` | 44 (`size.controlMd`) | 20 | 15 px (`ui`) |
| `lg` | 52 (`size.controlLg`) | 28 | 17 px |

### Variantes no terreno de marca

| Variante | Quando | Fundo | Rótulo | Hover | Desabilitado | Anel de foco |
|---|---|---|---|---|---|---|
| `wine` | Ação principal sobre branco, blush e coral | `wine` | branco | `wine-800` | `wine-800` | `wine` |
| `coral` | Ação principal sobre vinho | `coral` | `wine` | `coral-300` | `coral-300` | `coral-200` |
| `quiet` | Ação secundária | `coral-100` | `wine` | `coral-200` | | `wine` |

### Variantes na bancada neutra

| Variante | Fundo | Rótulo | Desabilitado |
|---|---|---|---|
| `solid` | `ink` | `onInk` | fundo `rule`, rótulo `graphite` |
| `outline` | `surface` com sombra `raised` | `ink` | opacidade 0,5 |
| `ghost` | transparente | `ink` | opacidade 0,5 |
| `danger` | `surface` com sombra `raised` | `alert` | opacidade 0,5 |

### Estados

- **Pressionado**: escala 0,96 em 150 ms com `easing.soft` (utilitário `press`). Com movimento reduzido, sem escala.
- **Foco**: contorno de 2 px afastado 2 px, na cor da tabela.
- **Em espera**: o botão fica desabilitado e diz o que está fazendo: troca o rótulo ou, na bancada, mostra um indicador sobre `inkDisabled`. O leitor de tela é avisado de que ele está ocupado.
- **Com ícone**: ícone de 20 px com traço 2, a 8 px do rótulo; o lado do ícone leva 2 px a menos de respiro.

Botão só de ícone tem 44 px e nome acessível.

Um botão embutido na página de outra marca (o da loja) usa fonte do sistema e deixa a loja trocar a cor e o raio; fora isso segue esta ficha.
