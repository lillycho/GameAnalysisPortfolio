"""Package only public website files for upload; no build tooling is required."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
files = [root / name for name in ['index.html', 'styles.css', 'app.js', 'projects.js', '.nojekyll', 'README.md']]
files += list(root.glob('*.pdf'))
files += list((root / 'assets' / 'projects').rglob('*.webp'))
files += [root / 'assets' / 'favicon.svg']
output = root / 'portfolio-github-pages.zip'
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for file in files:
        archive.write(file, file.relative_to(root).as_posix())
print(f'{output.name}: {len(files)} files, {output.stat().st_size / 1024 / 1024:.1f} MB')
