# 조윤빈 · 게임 분석 포트폴리오

8개 프로젝트, 136페이지의 PDF를 웹에서 세로로 읽을 수 있는 포트폴리오입니다. HTML / CSS / JavaScript만 사용하며 서버, Node.js, npm, 빌드 과정이 필요하지 않습니다.

## 미리 보기

`index.html`을 더블 클릭하면 볼 수 있습니다. 또는 이 폴더에서 아래 명령을 실행하고 http://localhost:4173 으로 접속하세요.

```sh
python -m http.server 4173
```

## GitHub 웹에서 업로드하고 배포하기

1. GitHub에서 새 **Public** 저장소를 만듭니다. 이름은 `portfolio` 등 원하는 이름을 사용하세요.
2. `portfolio-github-pages.zip`을 **압축 해제**합니다. ZIP 자체를 올리면 사이트가 배포되지 않습니다.
3. 저장소의 **Add file → Upload files**에서 압축 해제한 파일과 `assets` 폴더를 업로드합니다. `index.html`이 저장소 최상위에 있어야 합니다. 바깥 폴더 자체를 한 단계 더 감싸서 올리지 마세요.
4. 파일 개수 제한이 나오면 여러 번 나눠서 업로드하세요. 루트 파일과 PDF를 먼저 올리고, 이후 `assets/projects` 하위의 프로젝트 폴더들을 나눠 올릴 수 있습니다. 웹 업로드 한 번에 100개 이하로 나눠서 진행하면 됩니다. 각 파일의 상대 경로는 유지하세요. `.nojekyll`은 숨김 파일 표시를 켜서 함께 올리는 것을 권장합니다.
5. **Commit changes**로 저장합니다.
6. **Settings → Pages → Build and deployment**에서 Source를 **Deploy from a branch**, Branch를 **main**, 폴더를 **/(root)**로 선택한 뒤 **Save**합니다.
7. 배포가 완료되면 Pages 화면에 나타나는 주소로 접속합니다. 일반적으로 `https://사용자이름.github.io/저장소이름/` 형태입니다.

공식 안내: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

웹 업로드가 번거로우면 GitHub Desktop에서 이 폴더를 저장소로 추가한 뒤 Publish repository로 올려도 됩니다. 저장소 생성·계정 업로드·실제 공개 배포는 아직 수행하지 않았습니다.

## 포함된 기능

- PC 3열 / 태블릿 2열 / 모바일 1열
- 실제 PDF 표지 썸네일, 가벼운 이미지 확대 및 화살표 호버
- 프로젝트별 공유 가능한 주소 (`#project/civilization` 등)
- 전체 페이지 세로 스크롤, 페이지 선택, 150% 확대와 화면 맞춤
- 현재 페이지 표시, 목록 복귀 시 위치 복원, 다음 프로젝트
- 원본 PDF 열기, 이미지 로딩 실패 시 원본 링크
- 지연 로딩, 키보드 포커스, 모션 감소 설정

PDF는 원본 디자인을 유지한 고해상도 WebP 이미지로 표시합니다. 본문 텍스트 선택·검색과 원본 확대는 **원본 PDF 열기**를 이용하세요. 파일을 수정하지 않고 그대로 보관했습니다.

## 제목 / 날짜 / 순서 수정

`projects.js`에서 `title`, `subtitle`, `date`, `tags`와 항목 순서를 수정하면 됩니다. 날짜는 PDF 표지에 적힌 날짜를 사용했습니다. 이름과 소개 문구는 `index.html`, `app.js`에 있습니다. 색상과 간격은 `styles.css`에서 변경합니다.

## PDF 교체 / 추가

표시용 이미지도 갱신해야 하므로 PDF 파일만 바꾸면 웹 화면에는 반영되지 않습니다.

1. 루트 폴더에 PDF를 넣습니다.
2. `scripts/prepare_assets.py`의 `PROJECTS`에서 식별자, 파일명 키워드, 제목, 부제, 날짜, 태그를 수정하거나 추가합니다. 키워드에 맞는 PDF는 하나만 있어야 합니다.
3. 아래 명령을 실행합니다. **projects.js를 수동 수정했다면 먼저 생성 스크립트에도 반영하세요.** 생성 시 덮어씁니다.

```sh
python -m pip install -r scripts/requirements.txt
python scripts/prepare_assets.py
python scripts/verify.py
python scripts/package.py
```

4. 갱신된 `projects.js`, 해당 프로젝트의 `assets/projects/식별자/` 폴더, 원본 PDF를 GitHub에 업로드합니다.

검증 스크립트의 프로젝트 개수는 최초 제공된 8개를 기준으로 하므로 프로젝트를 추가하면 해당 검사도 변경하세요. 목록 상단 기간과 사이트 설명도 필요에 따라 `app.js`, `index.html`에서 수정합니다.

## 파일 구조

```text
index.html              페이지 뼈대
styles.css              반응형 디자인
app.js                  프로젝트 목록, 문서 뷰어, 화면 전환
projects.js             프로젝트 정보와 페이지 목록
assets/projects/        각 PDF의 표지와 페이지 이미지
assets/favicon.svg      사이트 아이콘
*.pdf                   원본 문서 8개
.nojekyll               GitHub Pages 정적 파일 설정
scripts/                이미지 재생성, 검증, ZIP 제작 도구
```

배포 ZIP에는 실행에 필요한 정적 파일과 README만 포함합니다. 생성 도구와 설계 기록은 원래 작업 폴더에 보관됩니다.
