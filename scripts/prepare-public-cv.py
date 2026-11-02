"""Build the public CV derivative; never reads or modifies the original PDFs."""
from pathlib import Path
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, KeepTogether

ROOT = Path(__file__).resolve().parents[1]
FONTS = ROOT / 'scripts/assets/fonts'
for name, file in [('Barlow', 'barlow-regular.ttf'), ('Barlow-Semibold', 'barlow-semibold.ttf'), ('Display', 'barlow-condensed-extrabold-italic.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(FONTS / file)))
pdfmetrics.registerFontFamily('Barlow', normal='Barlow', bold='Barlow-Semibold', italic='Barlow', boldItalic='Barlow-Semibold')
navy = colors.HexColor('#06121F')
blue = colors.HexColor('#134CCB')
styles = {
    'name': ParagraphStyle('Name', fontName='Display', fontSize=34, leading=35, textColor=navy, spaceAfter=5),
    'role': ParagraphStyle('Role', fontName='Barlow-Semibold', fontSize=12, leading=15, textColor=blue, spaceAfter=8),
    'body': ParagraphStyle('Body', fontName='Barlow', fontSize=10.2, leading=13.2, textColor=navy, spaceAfter=5),
    'links': ParagraphStyle('Links', fontName='Barlow', fontSize=9.4, leading=13, textColor=blue, spaceAfter=10),
    'section': ParagraphStyle('Section', fontName='Barlow-Semibold', fontSize=11, leading=14, textColor=blue, spaceBefore=13, spaceAfter=7),
    'job': ParagraphStyle('Job', fontName='Barlow-Semibold', fontSize=10.5, leading=14, textColor=navy, spaceAfter=2),
    'date': ParagraphStyle('Date', fontName='Barlow', fontSize=9.4, leading=12, textColor=colors.HexColor('#526176'), spaceAfter=4),
}
story = []
def p(text, style='body'):
    return Paragraph(text, styles[style])
story += [p('JAMES GATORU', 'name'), p('Software Developer / AI Agentic Engineer', 'role')]
story += [p('<link href="mailto:gatorumbugua@gmail.com">gatorumbugua@gmail.com</link><br/><link href="https://github.com/James-Toru">github.com/James-Toru</link>  |  <link href="https://www.linkedin.com/in/james-mbugua-78a63917b/">linkedin.com/in/james-mbugua-78a63917b</link>', 'links')]
story += [p('I build web applications and AI workflows, bringing together responsive interfaces, backend systems and human oversight.')]
story += [p('EXPERIENCE', 'section')]
jobs = [
    ('AI Agentic Engineer', 'TYTOS GmbH', 'April 2026 - present', 'Designed AI platforms and supervised multi-agent workflows with human approval, sandboxed execution, testing and audit trails. Integrated OpenAI, GitHub Actions, Temporal, Supabase/PostgreSQL, Next.js and TypeScript. Developed governed generative-image and LoRA-training pipelines.'),
    ('Technical Consultant', 'Info Gain Consulting', 'February 2024 - April 2026', 'Developed multi-tenant consignment management with role-based access, notifications and invoicing. Led the IGC Portal, integrating bid, contract and service-request modules. Built case-management workflows, APIs and a custom WordPress solution.'),
    ('Front-end Developer', 'Angaza Elimu', 'January 2024 - March 2024', 'Contributed responsive React interfaces to e-learning platforms and collaborated on RESTful API integration.'),
    ('Software Developer', 'Elixar Technologies', 'January 2023 - August 2023', 'Built responsive React interfaces, integrated RESTful APIs and contributed to church-management application development.'),
    ('Software Developer', 'Freelance', 'June 2020 - January 2023', 'Developed web applications, including Lugawa, Texplore and Aslice.'),
]
for role, organization, dates, summary in jobs:
    story += [KeepTogether([p(f'{role} | {organization}', 'job'), p(dates, 'date'), p(summary), Spacer(1, 5)])]
story += [p('SKILLS', 'section'), p('React, Next.js, TypeScript, Node.js, NestJS, Express, PostgreSQL, MongoDB, WordPress, Docker and CI/CD. Agentic AI, LLM integration, workflow orchestration, LoRA pipelines and human review. Figma, Illustrator and Photoshop.')]
story += [p('EDUCATION & CERTIFICATION', 'section')]
story += [p('<b>BSc Computer Science</b> | Jomo Kenyatta University of Agriculture and Technology<br/>2019 - 2023')]
story += [p('<b>Certificate in Web and Mobile Application Development</b> | Modcom Institute of Technology<br/>January 2019 - April 2019')]
story += [p('<b>PL400</b> | Microsoft Power Platform Developer Associate')]

def page_decoration(canvas, doc):
    width, height = A4
    canvas.setFillColor(blue)
    canvas.rect(0, height - 8, width, 8, fill=1, stroke=0)
    canvas.setStrokeColor(colors.HexColor('#D7DEE7'))
    canvas.line(42, 32, width - 42, 32)
    canvas.setFont('Barlow', 8)
    canvas.setFillColor(colors.HexColor('#526176'))
    canvas.drawString(42, 19, 'James Gatoru | Public CV')
    canvas.drawRightString(width - 42, 19, str(doc.page))

output = ROOT / 'public/james-gatoru-cv.pdf'
doc = SimpleDocTemplate(str(output), pagesize=A4, rightMargin=42, leftMargin=42, topMargin=30, bottomMargin=44, title='James Gatoru - Public CV', author='James Gatoru', subject='Software Developer and AI Agentic Engineer')
doc.build(story, onFirstPage=page_decoration, onLaterPages=page_decoration)
print(output)
