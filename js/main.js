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
