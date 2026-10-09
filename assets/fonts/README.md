# Fontes

Crimson Pro (títulos) e Host Grotesk (texto e interface), as duas sob a SIL Open Font License (`OFL-CrimsonPro.txt`, `OFL-HostGrotesk.txt`).

| Pasta | Para | Arquivos |
|---|---|---|
| `variable/` | Web sem `next/font` (página embutida, e-mail, página gerada no servidor) | `CrimsonPro-Variable.woff2` (peso 200 a 900), `CrimsonPro-Italic-Variable.woff2`, `HostGrotesk-Variable.woff2` (peso 300 a 800) |
| `static/` | App nativo, que precisa de um arquivo por corte | os oito cortes abaixo |

No Next, use `next/font/google` com as variáveis `--font-crimson-pro` e `--font-host-grotesk`; não precisa destes arquivos.

## Cortes estáticos

No iOS a fonte é chamada pelo nome PostScript; no Android, pelo nome do arquivo.

| Arquivo | Nome PostScript | Peso |
|---|---|---|
| `CrimsonPro-Light.ttf` | `CrimsonProRoman-Light` | 300 |
| `CrimsonPro-Regular.ttf` | `CrimsonProRoman-Regular` | 400 |
| `CrimsonPro-Medium.ttf` | `CrimsonProRoman-Medium` | 500 |
| `CrimsonPro-LightItalic.ttf` | `CrimsonProItalic-LightItalic` | 300 |
| `CrimsonPro-Italic.ttf` | `CrimsonProItalic-Italic` | 400 |
| `HostGrotesk-Regular.ttf` | `HostGrotesk-Regular` | 400 |
| `HostGrotesk-Medium.ttf` | `HostGrotesk-Medium` | 500 |
| `HostGrotesk-SemiBold.ttf` | `HostGrotesk-SemiBold` | 600 |

## Gerar de novo

Os arquivos saem das fontes variáveis do repositório `google/fonts` (`ofl/crimsonpro`, `ofl/hostgrotesk`) com `scripts/fonts.py`:

```sh
uvx --from 'fonttools[woff]' python -I scripts/fonts.py <pasta com as .ttf variáveis> assets/fonts
```
