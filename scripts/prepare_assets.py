"""Regenerate website assets without changing the original PDFs."""
import json
from pathlib import Path
import pymupdf
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = [
    ('civilization', '문명6', '문명 VI', '생산 시스템 규칙', '2026.09.21', ['System']),
    ('genshin', '원신', '원신', '월드 임무 「산속의 긴 하루」 콘텐츠 역기획', '2026.09.28', ['Contents']),
    ('tft', '전략적팀전투', '전략적 팀 전투', '상점 시스템 역기획', '2026.10.12', ['System', 'UI/UX']),
    ('danganronpa', '단간론파', '단간론파', '학급재판 논스톱 논의 시스템 역기획', '2026.10.19', ['System', 'UI/UX']),
    ('pubg', '배틀그라운드', 'PUBG: 배틀그라운드', '반동 시스템 역기획', '2026.10.19', ['System']),
    ('mabinogi', '마비노기모바일', '마비노기 모바일', '성능 개선 시스템 역기획', '2026.11.02', ['System', 'UI/UX']),
    ('elden-ring', '엘든링', '엘든 링', '보스 ‘트리 가드’ 역기획', '2026.11.09', ['Contents', 'Monster']),
    ('one-more-try', '자유발표', '실패했는데, 왜 한 판 더 하고 싶었을까?', '어려운 게임을 계속하게 되는 이유', '2026.11.16', ['Idea']),
]

def main():
    projects = []
    for slug, keyword, title, subtitle, date, tags in PROJECTS:
        matches = list(ROOT.glob(f'*_{keyword}_*.pdf'))
        if len(matches) != 1:
            raise ValueError(f'Expected one PDF for {keyword}, got {len(matches)}')
        source = matches[0]
        target = ROOT / 'assets' / 'projects' / slug
        target.mkdir(parents=True, exist_ok=True)
        pages = []
        with pymupdf.open(source) as document:
            for number, page in enumerate(document, 1):
                scale = 2200 / page.rect.width
                pixmap = page.get_pixmap(matrix=pymupdf.Matrix(scale, scale), alpha=False, colorspace=pymupdf.csRGB)
                image = Image.frombytes('RGB', (pixmap.width, pixmap.height), pixmap.samples)
                filename = f'{number:03}.webp'
                image.save(target / filename, 'WEBP', quality=86, method=4)
                pages.append({'src': f'assets/projects/{slug}/{filename}', 'width': image.width, 'height': image.height})
                if number == 1:
                    image.thumbnail((900, 900))
                    image.save(target / 'cover.webp', 'WEBP', quality=88)
        projects.append(dict(id=slug, title=title, subtitle=subtitle, date=date, tags=tags,
                             pdf=source.name, cover=f'assets/projects/{slug}/cover.webp', pages=pages))
        print(f'{slug}: {len(pages)} pages', flush=True)
    (ROOT / 'projects.js').write_text('window.PORTFOLIO_PROJECTS = ' + json.dumps(projects, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')

if __name__ == '__main__':
    main()
