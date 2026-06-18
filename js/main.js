const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  siteNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }));
}

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

const filterButtons = document.querySelectorAll('.filter');
const pubItems = document.querySelectorAll('.pub-item');
const searchInput = document.getElementById('pubSearch');
let activeFilter = 'all';

function filterPublications(){
  const query = (searchInput?.value || '').toLowerCase().trim();
  pubItems.forEach(item => {
    const type = item.dataset.type || '';
    const haystack = (item.textContent + ' ' + (item.dataset.keywords || '') + ' ' + (item.dataset.year || '')).toLowerCase();
    const matchesFilter = activeFilter === 'all' || type.includes(activeFilter);
    const matchesSearch = !query || haystack.includes(query);
    item.classList.toggle('hide', !(matchesFilter && matchesSearch));
  });
}

filterButtons.forEach(btn => btn.addEventListener('click', () => {
  filterButtons.forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  filterPublications();
}));
if (searchInput) searchInput.addEventListener('input', filterPublications);

document.querySelectorAll('.copy-cite').forEach(button => {
  button.addEventListener('click', async () => {
    const pub = button.closest('.pub-item');
    const citation = pub ? pub.querySelector('p')?.innerText + ' ' + pub.querySelector('h3')?.innerText : '';
    try {
      await navigator.clipboard.writeText(citation.trim());
      const original = button.textContent;
      button.textContent = 'Copied';
      setTimeout(() => button.textContent = original, 1300);
    } catch (e) {
      button.textContent = 'Select citation manually';
    }
  });
});


// Auto-rotating project image sliders: one visible image, 5-second loop
const projectSliders = document.querySelectorAll('[data-slider]');
projectSliders.forEach((slider) => {
  const slides = Array.from(slider.querySelectorAll('.project-slide'));
  const dots = Array.from(slider.querySelectorAll('.slider-dots span'));
  if (slides.length <= 1) return;

  let current = Math.max(0, slides.findIndex((slide) => slide.classList.contains('active')));
  if (current === -1) current = 0;

  const showSlide = (index) => {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  };

  dots.forEach((dot, index) => {
    dot.addEventListener('click', (event) => {
      event.stopPropagation();
      showSlide(index);
    });
  });

  setInterval(() => {
    showSlide((current + 1) % slides.length);
  }, 5000);
});

// Image lightbox: click project/research images to enlarge; Esc closes
const lightbox = document.querySelector('[data-lightbox]');
const lightboxImg = lightbox ? lightbox.querySelector('[data-lightbox-img]') : null;
const lightboxCaption = lightbox ? lightbox.querySelector('[data-lightbox-caption]') : null;
const lightboxClose = lightbox ? lightbox.querySelector('[data-lightbox-close]') : null;

const openLightbox = (src, alt) => {
  if (!lightbox || !lightboxImg) return;
  lightboxImg.src = src;
  lightboxImg.alt = alt || 'Expanded project image';
  if (lightboxCaption) lightboxCaption.textContent = alt || '';
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeLightbox = () => {
  if (!lightbox || !lightboxImg) return;
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  lightboxImg.src = '';
  document.body.style.overflow = '';
};

document.querySelectorAll('.project-slider').forEach((slider) => {
  slider.addEventListener('click', () => {
    const active = slider.querySelector('.project-slide.active') || slider.querySelector('.project-slide');
    if (active) openLightbox(active.currentSrc || active.src, active.alt);
  });
});

document.querySelectorAll('.research-image, .gallery-image, .project-image').forEach((img) => {
  img.addEventListener('click', () => openLightbox(img.currentSrc || img.src, img.alt));
});

if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightbox) {
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
}
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeLightbox();
});
