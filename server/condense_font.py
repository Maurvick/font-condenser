import fontforge
import sys
import psMat
import os

input = sys.argv[1]  # Input font file
output_dir = sys.argv[2]  # Output directory

font = fontforge.open(input)

for g in font.glyphs():
    g.transform(psMat.scale(0.94, 1.0))

# Setting the font name and family name
font.fontname += " Condensed"
font.familyname += " Condensed"
font.fullname += " Condensed"

# Generate the output file in the specified directory
output_filename = font.familyname + ".otf"
output_path = os.path.join(output_dir, output_filename)

font.generate(output_path)
