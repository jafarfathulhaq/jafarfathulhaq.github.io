// =============================================
// D: PAGE LOAD INTRO ANIMATION
// Sidebar elements fade + slide up in sequence
// =============================================

const introEls = [
  document.querySelector('.sidebar-top h1'),
  document.querySelector('.sidebar-company'),
  document.querySelector('.sidebar-tagline'),
  document.querySelector('.sidebar-nav'),
  document.querySelector('.sidebar-footer'),
].filter(Boolean);

// Set all sidebar elements hidden before page renders
introEls.forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
});

// Also hide the role separately — typewriter will reveal it
const roleEl = document.querySelector('.sidebar-role');
if (roleEl) {
  roleEl.style.opacity = '0';
  roleEl.style.transition = 'opacity 0.4s ease';
}

// Stagger each element's reveal
introEls.forEach((el, i) => {
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 150 + i * 120);
});


// =============================================
// B: TYPEWRITER EFFECT ON ROLE TITLE
// Types out the role character by character
// =============================================

function typeWriter(element, text, speed = 52) {
  element.textContent = '';
  // Add a blinking cursor
  const cursor = document.createElement('span');
  cursor.className = 'typing-cursor';
  cursor.textContent = '|';
  element.appendChild(cursor);

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      element.insertBefore(document.createTextNode(text[i]), cursor);
      i++;
    } else {
      clearInterval(interval);
      // Hide cursor 2s after typing finishes
      setTimeout(() => { cursor.style.display = 'none'; }, 2000);
    }
  }, speed);
}

if (roleEl) {
  const roleText = roleEl.textContent.trim();
  // Start typewriter after h1 has faded in (400ms)
  setTimeout(() => {
    roleEl.style.opacity = '1';
    typeWriter(roleEl, roleText);
  }, 400);
}


// =============================================
// ACTIVE NAV HIGHLIGHTING
//
// As the user scrolls, we watch which section
// is currently in the viewport and highlight
// the matching nav link on the left sidebar.
// =============================================

const navLinks = document.querySelectorAll('.nav-link');

// Build a map of section id → nav link element
const navMap = {};
navLinks.forEach(link => {
  const id = link.getAttribute('href').replace('#', '');
  navMap[id] = link;
});

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.remove('active'));
      const activeLink = navMap[entry.target.id];
      if (activeLink) activeLink.classList.add('active');
    }
  });
}, {
  rootMargin: '-30% 0px -60% 0px'
});

document.querySelectorAll('.section').forEach(section => {
  sectionObserver.observe(section);
});

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
// C: ANIMATED STAT COUNTERS
// Numbers count up when scrolled into view
// =============================================

function animateCounter(el, target, duration = 1400) {
  let startTime = null;
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    // Ease-out cubic — starts fast, slows at end
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(counter => {
        animateCounter(counter, parseInt(counter.dataset.target));
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsRow = document.querySelector('.stats-row');
if (statsRow) statsObserver.observe(statsRow);


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
