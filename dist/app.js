(() => {
  const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
  if ('IntersectionObserver' in window && !motionQuery.matches) {
    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);} });
    }, {threshold: 0.08});
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }
  motionQuery.addEventListener?.('change', event => {if(event.matches) document.documentElement.classList.remove('motion-ready');});
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#mobile-nav');
  const closeMenu = () => {if (!menu || !nav) return; menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); nav.hidden = true;};
  menu?.addEventListener('click', () => {const open = menu.getAttribute('aria-expanded') === 'true'; menu.setAttribute('aria-expanded',String(!open)); menu.setAttribute('aria-label',open ? 'Open navigation' : 'Close navigation'); nav.hidden = open;});
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click',closeMenu));
  document.addEventListener('keydown', event => {if(event.key === 'Escape') {if(nav && !nav.hidden){closeMenu();menu.focus();}}});
  document.addEventListener('click', event => {if(nav && !nav.hidden && !event.target.closest('.site-header')) closeMenu();});
  matchMedia('(min-width: 961px)').addEventListener?.('change', event => {if(event.matches)closeMenu();});
  const dialog = document.querySelector('#screenshot-dialog');
  const enlarged = document.querySelector('#enlarged-screenshot');
  const title = document.querySelector('#screenshot-title');
  let trigger = null;
  document.querySelectorAll('[data-screenshot]').forEach(button => {
    button.addEventListener('click', event => {
      if (!dialog?.showModal) return;
      event.preventDefault();
      const image = button.querySelector('img');
      const source = image.src.replace('-540.webp', '-1080.webp');
      trigger = button;
      enlarged.src = source;
      enlarged.alt = image.alt;
      title.textContent = button.dataset.title;
      dialog.showModal();
      document.body.classList.add('modal-open');
    });
  });
  document.querySelector('#close-screenshot')?.addEventListener('click', () => dialog?.close());
  dialog?.addEventListener('close', () => {document.body.classList.remove('modal-open');trigger?.focus();});
  dialog?.addEventListener('click', event => {if(event.target === dialog){const bounds=dialog.getBoundingClientRect();if(event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();}});
  const year=document.querySelector('#copyright-year');if(year)year.textContent=String(new Date().getFullYear());
})();
