(() => {
  'use strict';
  const projects = [...(window.PORTFOLIO_PROJECTS || [])].sort((a, b) => b.date.localeCompare(a.date));
  const main = document.querySelector('main');
  let observer;
  let resizeReader;
  let homeScroll = 0;
  let lastProject = null;
  let currentId = null;
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const href = p => '#project/' + p.id;
  const pdfURL = p => encodeURIComponent(p.pdf);
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  function home() {
    document.title = '조윤빈 · 게임 분석 포트폴리오';
    main.innerHTML = `<section class="intro"><div><p class="eyebrow">Game Analysis Portfolio</p><h1>게임 분석 포트폴리오</h1></div><p class="intro-name">Cho Yunbeen</p></section><section aria-label="프로젝트 목록"><div class="collection-bar"><span class="collection-label">SELECTED WORKS <span class="count">${String(projects.length).padStart(2,'0')}</span></span><span class="collection-period">2026.09 — 2026.11</span></div><div class="project-grid">${projects.map((p,i) => `<a class="project-card" href="${href(p)}" data-project="${p.id}" aria-label="${esc(p.title+' '+p.subtitle)} 보기"><div class="cover"><img src="${p.cover}" alt="${esc(p.title)} 표지" width="900" height="506" ${i>2?'loading="lazy"':'fetchpriority="high"'} decoding="async"><span class="cover-cta" aria-hidden="true">프로젝트 보기 ↗</span></div><div class="card-kicker"><span>${p.tags.join(' / ')}</span><span>${String(i+1).padStart(2,'0')}</span></div><h2>${esc(p.title)}<span class="card-arrow" aria-hidden="true">↗</span></h2><p class="card-subtitle">${esc(p.subtitle)}</p><time class="card-date" datetime="${p.date.replaceAll('.','-')}">${p.date}</time></a>`).join('')}</div></section>`;
  }
  function reader(p) {
    document.title = `${p.title} · 조윤빈 포트폴리오`;
    const next = projects[(projects.indexOf(p)+1)%projects.length];
    main.innerHTML = `<section class="reader-header"><a class="back-link text-link" href="#">← 모든 프로젝트</a><div class="reader-heading"><div><p class="eyebrow">${p.tags.join(' / ')}</p><h1>${esc(p.title)}</h1><p>${esc(p.subtitle)}</p></div><div class="reader-meta">${p.date}<br>${p.pages.length} PAGES · CHO YUNBEEN</div></div></section><div class="reader-toolbar"><div class="reader-tools"><label for="page-select">PAGE</label><select id="page-select" aria-label="페이지 이동">${p.pages.map((_,i)=>`<option value="${i+1}">${i+1} / ${p.pages.length}</option>`).join('')}</select><button class="tool-button" id="zoom" aria-pressed="false">확대 +</button></div><a class="pdf-link text-link" href="${pdfURL(p)}" target="_blank" rel="noopener">원본 PDF 열기 ↗</a><div class="progress-track" aria-hidden="true"><div class="progress-fill"></div></div></div><div class="reader-canvas"><div class="page-stack">${p.pages.map((page,i)=>`<figure class="pdf-page" id="page-${i+1}" data-page="${i+1}"><img src="${page.src}" width="${page.width}" height="${page.height}" alt="${esc(p.title)} 문서 ${i+1} / ${p.pages.length}페이지. 텍스트 검색과 선택은 원본 PDF에서 이용할 수 있습니다." ${i?'loading="lazy"':'fetchpriority="high"'} decoding="async"><figcaption>${String(i+1).padStart(2,'0')} / ${String(p.pages.length).padStart(2,'0')}</figcaption></figure>`).join('')}</div></div><nav class="reader-bottom" aria-label="프로젝트 탐색"><a class="text-link" href="#">← 목록으로</a><a class="next-project text-link" href="${href(next)}"><span>NEXT PROJECT</span>${esc(next.title)} ↗</a></nav>`;
    const select = document.querySelector('#page-select');
    const progress = document.querySelector('.progress-fill');
    progress.style.width = `${100/p.pages.length}%`;
    const jumpToPage = (number, behavior) => {
      const page = document.getElementById(`page-${number}`);
      const toolbarHeight = document.querySelector('.reader-toolbar').offsetHeight;
      window.scrollTo({top:window.scrollY + page.getBoundingClientRect().top - toolbarHeight - 16, behavior});
    };
    select.addEventListener('change', () => jumpToPage(select.value, reducedMotion?'instant':'smooth'));
    document.querySelector('#zoom').addEventListener('click', event => {
      const currentPage = select.value;
      const zoomed = document.querySelector('.page-stack').classList.toggle('zoomed');
      event.currentTarget.setAttribute('aria-pressed', String(zoomed));
      event.currentTarget.textContent = zoomed ? '화면 맞춤 −' : '확대 +';
      requestAnimationFrame(() => {
        jumpToPage(currentPage, 'instant');
        select.value = currentPage;
      });
    });
    resizeReader = () => {
      observer?.disconnect();
      const toolbarHeight = document.querySelector('.reader-toolbar').offsetHeight;
      // Pixel margins: IntersectionObserver percentage margins use viewport width.
      const bottom = Math.max(0, window.innerHeight - toolbarHeight - 100);
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) if (entry.isIntersecting) {
          select.value = entry.target.dataset.page;
          progress.style.width = `${Number(select.value)/p.pages.length*100}%`;
        }
      }, {rootMargin:`-${toolbarHeight}px 0px -${bottom}px 0px`, threshold:0});
      document.querySelectorAll('.pdf-page').forEach(page => observer.observe(page));
    };
    resizeReader();
    window.addEventListener('resize', resizeReader);
    document.querySelectorAll('.pdf-page img').forEach(img => img.addEventListener('error', () => {
      const note = document.createElement('p'); note.className = 'image-error';
      note.innerHTML = `페이지를 불러오지 못했습니다. <a href="${pdfURL(p)}" target="_blank" rel="noopener">원본 PDF 보기 ↗</a>`;
      img.replaceWith(note);
    }, {once:true}));
  }
  function route(initial = false) {
    const hash = location.hash;
    const leavingHome = !currentId;
    if (!initial && leavingHome && hash && hash !== '#') homeScroll = window.scrollY;
    observer?.disconnect();
    if (resizeReader) window.removeEventListener('resize', resizeReader);
    const id = hash.startsWith('#project/') ? hash.slice(9) : null;
    const project = projects.find(p=>p.id===id);
    if (!hash || hash==='#' || hash==='#main') {
      const restore = currentId;
      currentId = null;
      home();
      requestAnimationFrame(()=>{
        if (restore && lastProject) main.querySelector(`[data-project="${lastProject}"]`)?.focus({preventScroll:true});
        window.scrollTo({top:restore?homeScroll:0,behavior:'instant'});
      });
    } else if(project) {
      currentId = project.id; lastProject = project.id; reader(project);
      window.scrollTo({top:0,behavior:'instant'});
      if (!initial) main.focus({preventScroll:true});
    } else {
      currentId = 'missing'; document.title = '프로젝트를 찾을 수 없습니다 · 조윤빈';
      main.innerHTML='<section class="error-view"><p class="eyebrow">PROJECT NOT FOUND</p><h1>프로젝트를 찾을 수 없습니다.</h1><p>주소를 확인하거나 목록에서 프로젝트를 선택해 주세요.</p><a class="text-link" href="#">← 모든 프로젝트</a></section>';
      window.scrollTo({top:0,behavior:'instant'});
    }
  }
  document.querySelector('#footer-top').addEventListener('click', e=>{e.preventDefault();window.scrollTo({top:0,behavior:reducedMotion?'instant':'smooth'});});
  document.querySelector('.skip').addEventListener('click', e=>{e.preventDefault();main.focus();});
  if ('scrollRestoration' in history) history.scrollRestoration='manual';
  window.addEventListener('hashchange',()=>route());
  route(true);
})();
