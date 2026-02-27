// =============================================
// ACTIVE NAV HIGHLIGHTING
//
// As the user scrolls, we watch which section
// is currently in the viewport and highlight
// the matching nav link on the left sidebar.
// =============================================

const navLinks = document.querySelectorAll('.nav-link');

// Build a map of section id → nav link element
// so we can quickly find the right link to highlight
const navMap = {};
navLinks.forEach(link => {
  // link.href is something like "http://localhost/page#about"
  // We only want the part after "#" — the section id
  const id = link.getAttribute('href').replace('#', '');
  navMap[id] = link;
});

// Watch each section — when it enters the viewport,
// highlight its nav link and un-highlight the others
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Remove .active from all nav links
      navLinks.forEach(l => l.classList.remove('active'));
      // Add .active only to the link matching this section
      const activeLink = navMap[entry.target.id];
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, {
  // rootMargin shrinks the detection zone so the section highlights
  // when it's near the top of the screen, not just barely visible
  rootMargin: '-30% 0px -60% 0px'
});

document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});

// Set the first nav link as active on load
if (navLinks.length > 0) navLinks[0].classList.add('active');


// =============================================
// SCROLL-IN ANIMATIONS
// =============================================

const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.08 });

document.querySelectorAll('.section, .job').forEach((el, index) => {
  el.classList.add('fade-in');
  el.style.transitionDelay = `${index * 50}ms`;
  fadeObserver.observe(el);
});


// =============================================
// COPY EMAIL BUTTON
// =============================================

const copyBtn = document.querySelector('.copy-btn');

if (copyBtn) {
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(copyBtn.dataset.copy)
      .then(() => {
        copyBtn.textContent = 'copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      })
      .catch(() => {
        copyBtn.textContent = 'failed';
      });
  });
}
