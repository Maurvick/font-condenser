import fontforge
import sys
import psMat
import os

input_file = sys.argv[1]
output_dir = sys.argv[2]

font = fontforge.open(input_file)

# Condense every glyph width by 6%
for g in font.glyphs():
    g.transform(psMat.scale(0.94, 1.0))

# Setting the font name and family name
font.fontname += " Condensed"
font.familyname += " Condensed"
font.fullname += " Condensed"

# Generate the output file in the specified directory
output_filename = font.familyname + os.path.splitext(input_file)[1]
output_path = os.path.join(output_dir, output_filename)

font.generate(output_path)

# Print the output path to be captured by the node script
print(output_path)
