const body = document.body;
const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.global-nav a');

const syncHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 24);
syncHeader();
window.addEventListener('scroll', syncHeader, { passive: true });

const setMenuOpen = open => {
  body.classList.toggle('menu-open', open);
  menuButton?.setAttribute('aria-expanded', String(open));
  menuButton?.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  if (open) document.querySelector('.global-nav a')?.focus();
};

menuButton?.addEventListener('click', () => {
  setMenuOpen(!body.classList.contains('menu-open'));
});
navLinks.forEach(link => link.addEventListener('click', () => {
  setMenuOpen(false);
}));

document.addEventListener('keydown', event => {
  if (!body.classList.contains('menu-open')) return;
  if (event.key === 'Escape') {
    setMenuOpen(false);
    menuButton?.focus();
    return;
  }
  if (event.key !== 'Tab') return;
  const focusable = [...navLinks, menuButton].filter(Boolean);
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12, rootMargin: '0px 0px -30px' });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('[data-accordion]').forEach(button => {
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    const panel = document.getElementById(button.getAttribute('aria-controls'));
    button.setAttribute('aria-expanded', String(!expanded));
    panel.hidden = expanded;
  });
});

document.querySelectorAll('[data-filter]').forEach(button => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    document.querySelectorAll('[data-category]').forEach(item => {
      item.hidden = filter !== 'all' && item.dataset.category !== filter;
    });
  });
});

const inquiryType = document.querySelector('#type');
const selectInquiryType = value => {
  if (!inquiryType) return;
  inquiryType.value = value;
};
document.querySelectorAll('[data-inquiry-type]').forEach(link => {
  link.addEventListener('click', () => selectInquiryType(link.dataset.inquiryType));
});
if (window.location.hash === '#document') selectInquiryType('資料請求');

const form = document.querySelector('[data-contact-form]');
form?.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.checkValidity()) {
    form.reportValidity();
    return;
  }
  const message = form.querySelector('.form-message');
  message.textContent = '送信内容を確認しました。テストサイトのため実際の送信は行われません。';
  message.hidden = false;
  message.focus();
});
