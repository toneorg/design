"""Gera os arquivos de fonte do design system a partir das variáveis do Google Fonts.

As variáveis vêm de github.com/google/fonts (ofl/crimsonpro, ofl/hostgrotesk), salvas como
CrimsonPro-wght.ttf, CrimsonPro-Italic-wght.ttf e HostGrotesk-wght.ttf.

uso: uvx --from 'fonttools[woff]' python -I scripts/fonts.py <pasta com as .ttf variáveis> assets/fonts
"""
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

src, out = Path(sys.argv[1]), Path(sys.argv[2])
(out / "variable").mkdir(parents=True, exist_ok=True)
(out / "static").mkdir(parents=True, exist_ok=True)

VARIABLE = {
    "CrimsonPro-wght.ttf": "CrimsonPro-Variable.woff2",
    "CrimsonPro-Italic-wght.ttf": "CrimsonPro-Italic-Variable.woff2",
    "HostGrotesk-wght.ttf": "HostGrotesk-Variable.woff2",
}
# (arquivo de origem, peso, nome do corte)
STATIC = [
    ("CrimsonPro-wght.ttf", 300, "CrimsonPro-Light"),
    ("CrimsonPro-wght.ttf", 400, "CrimsonPro-Regular"),
    ("CrimsonPro-wght.ttf", 500, "CrimsonPro-Medium"),
    ("CrimsonPro-Italic-wght.ttf", 300, "CrimsonPro-LightItalic"),
    ("CrimsonPro-Italic-wght.ttf", 400, "CrimsonPro-Italic"),
    ("HostGrotesk-wght.ttf", 400, "HostGrotesk-Regular"),
    ("HostGrotesk-wght.ttf", 500, "HostGrotesk-Medium"),
    ("HostGrotesk-wght.ttf", 600, "HostGrotesk-SemiBold"),
]

for name, target in VARIABLE.items():
    font = TTFont(src / name)
    axes = {axis.axisTag: (axis.minValue, axis.maxValue) for axis in font["fvar"].axes}
    font.flavor = "woff2"
    font.save(out / "variable" / target)
    print(f"variable/{target}  eixos {axes}")

for name, weight, cut in STATIC:
    font = TTFont(src / name)
    static = instancer.instantiateVariableFont(font, {"wght": weight}, updateFontNames=True)
    static.save(out / "static" / f"{cut}.ttf")
    names = {record.nameID: record.toUnicode() for record in static["name"].names if record.platformID == 3}
    print(f"static/{cut}.ttf  postscript={names.get(6)}  família={names.get(16, names.get(1))}  estilo={names.get(17, names.get(2))}  peso={static['OS/2'].usWeightClass}")
