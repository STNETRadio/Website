document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-btn');
  const header = document.querySelector('header');
  const nav = document.getElementById('site-nav') || document.querySelector('nav');

  if (!hamburger || !header) return;

  const setOpenState = (open) => {
    header.classList.toggle('mobile-nav-open', open);
    document.body.classList.toggle('no-scroll', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Close navigation' : 'Toggle navigation');
  };

  hamburger.addEventListener('click', () => {
    setOpenState(!header.classList.contains('mobile-nav-open'));
  });

  if (nav) {
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a') && header.classList.contains('mobile-nav-open')) {
        setOpenState(false);
      }
    });
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('mobile-nav-open')) {
      setOpenState(false);
      hamburger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 700 && header.classList.contains('mobile-nav-open')) {
      setOpenState(false);
    }
  });
});
