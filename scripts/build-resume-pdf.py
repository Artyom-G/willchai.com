"""Build the PDF edition from the same record as the Astro resume page.

Requires reportlab, fonttools and brotli. Run from the repository root.
"""
import json
import re
import subprocess
from PIL import Image
from pathlib import Path
from tempfile import TemporaryDirectory
from xml.sax.saxutils import escape

from fontTools.ttLib import TTFont as SourceFont
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.pagesizes import A4
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
data = json.loads((ROOT / 'src/data/resume.json').read_text())
profile = data['profile']
tokens = (ROOT / 'system/tokens.css').read_text()
def color_token(name):
    return re.search(r'--wc-' + name + r':\s*(#[0-9a-fA-F]{6});', tokens).group(1)
ink = colors.HexColor(color_token('ink'))
slate = colors.HexColor(color_token('slate'))
blue = colors.HexColor(color_token('blue'))


def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Funnel', 9)
    canvas.setFillColor(slate)
    canvas.drawString(42, 25, 'William Chai | Résumé | September 2026')
    canvas.drawRightString(A4[0] - 42, 25, str(doc.page))
    canvas.restoreState()


with TemporaryDirectory() as temp:
    for name, asset, weight in [
        ('Funnel', 'funnel-sans-latin.woff2', 400),
        ('FunnelBold', 'funnel-sans-latin.woff2', 600),
        ('Unbounded', 'unbounded-latin.woff2', 400),
    ]:
        font = SourceFont(ROOT / 'public/assets' / asset)
        if 'fvar' in font:
            font = instantiateVariableFont(font, {'wght': weight}, inplace=True)
        font.flavor = None
        font_path = Path(temp) / (name + '.ttf')
        font.save(font_path)
        pdfmetrics.registerFont(TTFont(name, str(font_path)))

    styles = {
        'name': ParagraphStyle('name', fontName='Unbounded', fontSize=23, leading=30, textColor=ink, spaceAfter=12),
        'body': ParagraphStyle('body', fontName='Funnel', fontSize=11.25, leading=15, textColor=ink, spaceAfter=5),
        'section': ParagraphStyle('section', fontName='FunnelBold', fontSize=16, leading=21, textColor=blue, spaceBefore=17, spaceAfter=12, keepWithNext=True),
        'title': ParagraphStyle('title', fontName='FunnelBold', fontSize=11.25, leading=15, textColor=ink, spaceAfter=3),
        'meta': ParagraphStyle('meta', fontName='Funnel', fontSize=10.5, leading=14, textColor=slate, spaceAfter=4),
    }

    def paragraph(text, style='body'):
        return Paragraph(escape(text), styles[style])

    story = [paragraph(profile['name'], 'name'), paragraph(profile['headline']),
             paragraph(profile['location'], 'meta'),
             paragraph(' | '.join([profile['email'], profile['website'], profile['linkedin']]), 'meta')]
    for section in data['sections']:
        for index, item in enumerate(section['items']):
            parts = [paragraph(section['title'], 'section')] if index == 0 else []
            title = paragraph(item['title'], 'title')
            if item.get('href'):
                href = item['href']
                if href.startswith('/'):
                    href = 'https://willchai.com' + href
                title = Paragraph('<link href="' + escape(href, {'"': '&quot;'}) + '" color="' + color_token('blue') + '">' + escape(item['title']) + '</link>', styles['title'])
            parts.extend([title, paragraph(item['role'])])
            if item.get('date'):
                parts.append(paragraph(item['date'], 'meta'))
            if item.get('detail'):
                parts.append(paragraph(item['detail']))
            parts.append(Spacer(1, 9))
            story.append(KeepTogether(parts))
    story.extend([Spacer(1, 15), paragraph(profile['sourceNote'], 'meta')])
    output = ROOT / 'public/resume.pdf'
    doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=42, leftMargin=42,
                            topMargin=38, bottomMargin=43, title='William Chai Résumé', author='William Chai')
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    preview_prefix = str(Path(temp) / 'resume-preview')
    subprocess.run(['pdftoppm', '-f', '1', '-singlefile', '-scale-to', '1200', '-png', str(output), preview_prefix], check=True)
    Image.open(preview_prefix + '.png').save(ROOT / 'public/assets/resume-preview.webp', quality=88)
    print(output)
