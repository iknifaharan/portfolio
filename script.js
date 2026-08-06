(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const header = document.querySelector('[data-header]');
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav-links');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 18);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const setNavigation = open => {
    navToggle?.setAttribute('aria-expanded', String(open));
    const label = navToggle?.querySelector('.sr-only');
    if (label) label.textContent = open ? 'Close navigation' : 'Open navigation';
    nav?.classList.toggle('open', open);
    document.body.classList.toggle('nav-open', open);
  };

  navToggle?.addEventListener('click', () => setNavigation(navToggle.getAttribute('aria-expanded') !== 'true'));
  nav?.addEventListener('click', event => {
    if (event.target.closest('a')) setNavigation(false);
  });
  window.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navToggle?.getAttribute('aria-expanded') === 'true') {
      setNavigation(false);
      navToggle.focus();
    }
  });

  document.querySelectorAll('.details-toggle').forEach(button => {
    button.addEventListener('click', () => {
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      const willOpen = button.getAttribute('aria-expanded') !== 'true';

      document.querySelectorAll('.details-toggle[aria-expanded="true"]').forEach(openButton => {
        if (openButton === button) return;
        openButton.setAttribute('aria-expanded', 'false');
        const openPanel = document.getElementById(openButton.getAttribute('aria-controls'));
        openPanel?.classList.remove('opening');
        if (openPanel) openPanel.hidden = true;
      });

      button.setAttribute('aria-expanded', String(willOpen));
      if (!panel) return;
      panel.hidden = !willOpen;
      panel.classList.toggle('opening', willOpen && !reduceMotion);
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach(item => item.classList.add('visible'));
  } else {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -45px' });
    revealItems.forEach(item => revealObserver.observe(item));
  }

  const timeline = document.querySelector('[data-timeline]');
  const experiences = document.querySelectorAll('[data-experience]');
  let timelineFrame = 0;
  const updateTimeline = () => {
    timelineFrame = 0;
    if (!timeline) return;
    const rect = timeline.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (window.innerHeight * 0.62 - rect.top) / rect.height));
    timeline.style.setProperty('--progress', progress.toFixed(3));
    experiences.forEach(item => item.classList.toggle('active', item.getBoundingClientRect().top < window.innerHeight * 0.64));
  };
  const requestTimelineUpdate = () => {
    if (!timelineFrame) timelineFrame = window.requestAnimationFrame(updateTimeline);
  };
  updateTimeline();
  window.addEventListener('scroll', requestTimelineUpdate, { passive: true });
  window.addEventListener('resize', requestTimelineUpdate);

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();
})();
