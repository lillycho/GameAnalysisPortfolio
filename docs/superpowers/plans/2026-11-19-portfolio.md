# Portfolio Implementation Plan

**Goal:** Ship a GitHub Pages-ready portfolio for eight supplied PDFs.
**Architecture:** Buildless HTML/CSS/JS, hash routing, pre-rendered lazy WebP pages.
**Tech Stack:** Browser APIs, Python / PyMuPDF / Pillow for asset preparation only.
**Spec:** ../specs/2026-11-19-portfolio-design.md

## Tasks
- [x] Generate project metadata, cover thumbnails and all PDF pages using scripts/prepare_assets.py. Preserve original PDFs.
- [x] Build index.html, styles.css, app.js with responsive grid and hash-routed reader.
- [x] Verify all referenced files and page counts, direct detail links, invalid links, back navigation, zoom and mobile overflow.
- [x] Write Korean deployment and update instructions; package ready-to-upload files.

## Review focus
Repository subpaths must work; all URLs are relative. Long documents must lazy load. Invalid hashes must show recovery navigation. Mobile controls must fit. Original PDF links must preserve Korean filenames.
