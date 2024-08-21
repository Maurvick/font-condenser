# Source: https://horstmann.com/unblog/2010-11-22/fonts.html

import fontforge
import os
import psMat
import sys

inputFont = sys.argv[1]
outputFont = os.path.splitext(inputFont)[0] + ".otf"

font = fontforge.open(inputFont);
for x in font:
    font[x].transform(psMat.scale(0.75, 1.0))
font.fontname=font.fontname + "Condensed"
font.familyname=font.familyname + " Condensed"
font.fullname=font.fullname + " Condensed"
font.generate(outputFont) 