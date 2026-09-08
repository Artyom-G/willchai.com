from __future__ import annotations

import json
from collections import OrderedDict
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase.pdfmetrics import stringWidth
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / "src" / "data" / "resume.json"
OUTPUT = ROOT / "output" / "pdf" / "resume.pdf"
PUBLIC_OUTPUT = ROOT / "public" / "resume.pdf"

PAGE_WIDTH, PAGE_HEIGHT = letter
MARGIN = 42
INK = HexColor("#151718")
SLATE = HexColor("#545C62")
BLUE = HexColor("#1712DF")
VERMILION = HexColor("#FF4B32")
CLOUD = HexColor("#EEF0F2")
WHITE = HexColor("#FFFFFF")


def wrapped_lines(text: str, font: str, size: float, max_width: float) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if current and stringWidth(candidate, font, size) > max_width:
            lines.append(current)
            current = word
        else:
            current = candidate
    if current:
        lines.append(current)
    return lines


def draw_wrapped(
    pdf: canvas.Canvas,
    text: str,
    x: float,
    y: float,
    max_width: float,
    font: str,
    size: float,
    leading: float,
    color=INK,
) -> float:
    pdf.setFillColor(color)
    pdf.setFont(font, size)
    for line in wrapped_lines(text, font, size, max_width):
        pdf.drawString(x, y, line)
        y -= leading
    return y


def draw_footer(pdf: canvas.Canvas, page_number: int) -> None:
    pdf.setStrokeColor(CLOUD)
    pdf.setLineWidth(0.6)
    pdf.line(MARGIN, 28, PAGE_WIDTH - MARGIN, 28)
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica", 7.8)
    pdf.drawString(MARGIN, 16, "willchai.com")
    pdf.drawRightString(PAGE_WIDTH - MARGIN, 16, str(page_number))


def draw_contact_line(pdf: canvas.Canvas, profile: dict[str, str], y: float) -> None:
    parts = [profile["location"], profile["email"], profile["website"], profile["linkedin"]]
    pdf.setFont("Helvetica", 8.6)
    pdf.setFillColor(WHITE)
    x = MARGIN
    for index, part in enumerate(parts):
        pdf.drawString(x, y, part)
        width = stringWidth(part, "Helvetica", 8.6)
        if part == profile["email"]:
            pdf.linkURL(f"mailto:{part}", (x, y - 2, x + width, y + 9), relative=0)
        elif part == profile["website"]:
            pdf.linkURL(f"https://{part}", (x, y - 2, x + width, y + 9), relative=0)
        elif part == profile["linkedin"]:
            pdf.linkURL(f"https://{part}", (x, y - 2, x + width, y + 9), relative=0)
        x += width
        if index < len(parts) - 1:
            pdf.setFillColor(VERMILION)
            pdf.circle(x + 8, y + 3, 1.3, fill=1, stroke=0)
            x += 17
            pdf.setFillColor(WHITE)


def draw_experience_page(pdf: canvas.Canvas, profile: dict, experience: dict) -> None:
    pdf.setFillColor(BLUE)
    pdf.rect(0, PAGE_HEIGHT - 150, PAGE_WIDTH, 150, fill=1, stroke=0)
    pdf.setFillColor(WHITE)
    pdf.setFont("Helvetica-Bold", 29)
    pdf.drawString(MARGIN, PAGE_HEIGHT - 58, profile["name"].upper())
    draw_wrapped(
        pdf,
        profile["headline"],
        MARGIN,
        PAGE_HEIGHT - 82,
        PAGE_WIDTH - (MARGIN * 2),
        "Helvetica",
        10.2,
        13,
        WHITE,
    )
    draw_contact_line(pdf, profile, PAGE_HEIGHT - 130)

    y = PAGE_HEIGHT - 182
    pdf.setFillColor(BLUE)
    pdf.setFont("Helvetica-Bold", 15)
    pdf.drawString(MARGIN, y, "EXPERIENCE")
    pdf.setStrokeColor(VERMILION)
    pdf.setLineWidth(2)
    pdf.line(MARGIN, y - 9, PAGE_WIDTH - MARGIN, y - 9)
    y -= 31

    groups: OrderedDict[str, list[dict]] = OrderedDict()
    for item in experience["items"]:
        groups.setdefault(item["title"], []).append(item)

    for organization, roles in groups.items():
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 9.8)
        pdf.drawString(MARGIN, y, organization)
        y -= 14
        for role in roles:
            role_lines = wrapped_lines(role["role"], "Helvetica", 8.8, 338)
            pdf.setFillColor(INK)
            pdf.setFont("Helvetica", 8.8)
            for line_index, line in enumerate(role_lines):
                pdf.drawString(MARGIN + 10, y - (line_index * 10.5), line)
            pdf.setFillColor(SLATE)
            pdf.setFont("Helvetica", 8.2)
            pdf.drawRightString(PAGE_WIDTH - MARGIN, y, role["date"])
            y -= max(13, len(role_lines) * 10.5 + 2)
        y -= 7

    draw_footer(pdf, 1)
    pdf.showPage()


def draw_record_section(pdf: canvas.Canvas, section: dict, y: float) -> float:
    pdf.setFillColor(BLUE)
    pdf.setFont("Helvetica-Bold", 13)
    pdf.drawString(MARGIN, y, section["title"].upper())
    pdf.setStrokeColor(CLOUD)
    pdf.setLineWidth(0.8)
    pdf.line(MARGIN, y - 8, PAGE_WIDTH - MARGIN, y - 8)
    y -= 27

    for item in section["items"]:
        title_lines = wrapped_lines(item["title"], "Helvetica-Bold", 9.8, 338)
        pdf.setFillColor(INK)
        pdf.setFont("Helvetica-Bold", 9.8)
        for line_index, line in enumerate(title_lines):
            pdf.drawString(MARGIN, y - (line_index * 11), line)
        pdf.setFillColor(SLATE)
        pdf.setFont("Helvetica", 8.2)
        pdf.drawRightString(PAGE_WIDTH - MARGIN, y, item["date"])
        y -= len(title_lines) * 11 + 1
        y = draw_wrapped(pdf, item["role"], MARGIN, y, 430, "Helvetica", 8.8, 10.5, INK)
        if item.get("detail"):
            y = draw_wrapped(pdf, item["detail"], MARGIN, y, 430, "Helvetica", 8.2, 10, SLATE)
        y -= 10
    return y - 3


def draw_record_page(pdf: canvas.Canvas, profile: dict, sections: list[dict]) -> None:
    pdf.setFillColor(BLUE)
    pdf.rect(0, PAGE_HEIGHT - 10, PAGE_WIDTH, 10, fill=1, stroke=0)
    pdf.setFillColor(INK)
    pdf.setFont("Helvetica-Bold", 23)
    pdf.drawString(MARGIN, PAGE_HEIGHT - 50, "EDUCATION AND SELECTED WORK")
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica", 9.2)
    pdf.drawString(MARGIN, PAGE_HEIGHT - 70, "Current professional record · September 2026")

    y = PAGE_HEIGHT - 104
    for section in sections:
        y = draw_record_section(pdf, section, y)

    note = f"Dates and titles checked against William Chai’s LinkedIn record in {profile['checked']}."
    pdf.setFillColor(SLATE)
    pdf.setFont("Helvetica", 7.8)
    pdf.drawString(MARGIN, 42, note)
    draw_footer(pdf, 2)
    pdf.showPage()


def main() -> None:
    data = json.loads(SOURCE.read_text(encoding="utf-8"))
    profile = data["profile"]
    experience = data["sections"][0]
    remaining_sections = data["sections"][1:]

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    pdf = canvas.Canvas(str(OUTPUT), pagesize=letter, pageCompression=1)
    pdf.setTitle("William Chai Résumé")
    pdf.setAuthor("William Chai")
    pdf.setSubject("Professional résumé")
    draw_experience_page(pdf, profile, experience)
    draw_record_page(pdf, profile, remaining_sections)
    pdf.save()
    PUBLIC_OUTPUT.write_bytes(OUTPUT.read_bytes())


if __name__ == "__main__":
    main()
