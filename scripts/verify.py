"""Validate every deployable asset and compare rendered pages to source PDFs."""
import json
from pathlib import Path
import pymupdf
from PIL import Image

root = Path(__file__).resolve().parents[1]
data = (root / 'projects.js').read_text(encoding='utf-8')
projects = json.loads(data.removeprefix('window.PORTFOLIO_PROJECTS = ').strip().removesuffix(';'))
assert len(projects) == 8
assert len({p['id'] for p in projects}) == len(projects)
total = 0
for p in projects:
    assert (root / p['pdf']).is_file(), p['pdf']
    assert (root / p['cover']).is_file(), p['cover']
    with pymupdf.open(root / p['pdf']) as pdf:
        assert len(pdf) == len(p['pages']), p['id']
    for page in p['pages']:
        assert not page['src'].startswith('/'), page['src']
        with Image.open(root / page['src']) as image:
            assert image.size == (page['width'], page['height']), page['src']
            image.verify()
        total += 1
for name in ['index.html', 'styles.css', 'app.js', 'assets/favicon.svg', '.nojekyll']:
    assert (root / name).is_file(), name
print(f'PASS: {len(projects)} projects, {total} pages, all source PDFs and image assets valid.')
