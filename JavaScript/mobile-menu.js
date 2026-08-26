document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger-btn');
  const header = document.querySelector('header');
  const nav = document.getElementById('site-nav') || document.querySelector('nav');

  if (!hamburger || !header) return;

  const mobileQuery = window.matchMedia('(max-width: 700px)');
  const menuIcon = hamburger.querySelector('i');

  const setOpenState = (open, { restoreFocus = false } = {}) => {
    const shouldOpen = Boolean(open && mobileQuery.matches);
    header.classList.toggle('mobile-nav-open', shouldOpen);
    document.body.classList.toggle('no-scroll', shouldOpen);
    hamburger.setAttribute('aria-expanded', String(shouldOpen));
    hamburger.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Toggle navigation');

    if (menuIcon) {
      menuIcon.classList.toggle('fa-bars', !shouldOpen);
      menuIcon.classList.toggle('fa-xmark', shouldOpen);
    }

    if (shouldOpen && nav) {
      const firstLink = nav.querySelector('a');
      if (firstLink) requestAnimationFrame(() => firstLink.focus());
    } else if (restoreFocus && document.contains(hamburger)) {
      hamburger.focus();
    }
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
      setOpenState(false, { restoreFocus: true });
    }
  });

  const handleViewportChange = (event) => {
    if (!event.matches && header.classList.contains('mobile-nav-open')) {
      setOpenState(false);
    }
  };

  if (typeof mobileQuery.addEventListener === 'function') {
    mobileQuery.addEventListener('change', handleViewportChange);
  } else if (typeof mobileQuery.addListener === 'function') {
    mobileQuery.addListener(handleViewportChange);
  }
});
