# Componentes

Uma ficha por conceito de interface que os produtos da tone compartilham. Cada ficha é a **referência**: medidas, cores por terreno, estados e acessibilidade. A forma vem do site, que é a direção aprovada; as variantes da bancada neutra vêm do app.

Os componentes não são código compartilhado: React, React Native e Preact não dividem interface. Cada produto implementa o seu a partir da ficha e dos tokens, e lista no próprio `AGENTS.md` o que ainda faz diferente da referência. Ao mexer num componente, leve-o para a referência; se a referência não serve, mude a ficha aqui primeiro.

| Ficha | Cobre |
|---|---|
| [Botão](button.md) | Ação principal, secundária e discreta; botão de ícone |
| [Campo](field.md) | Texto, lista, busca, rótulo, dica e erro |
| [Seleção](selection.md) | Caixa de marcar, escolha, etiqueta, segmentado |
| [Superfície](surface.md) | Painel, cartão, folha, barra flutuante |
| [Tom de pele](tone.md) | Amostra e seletor de tom |
| [Retorno](feedback.md) | Erro, aviso, espera, medidor de confiança |
| [Ícone](icon.md) | Traço, grade, tamanhos |
