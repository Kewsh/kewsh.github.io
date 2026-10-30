/**
 * Koosha Kazemi — Hacker Terminal Script
 * Theme toggle (dark/light) & BibTeX copy helper
 */

// Toast Notification
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

// BibTeX Toggle & Copy Helpers (available immediately)
window.toggleBibtex = function (id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const isShowing = el.classList.toggle('show');
  if (btn) {
    btn.textContent = isShowing ? '[hide_bibtex]' : '[show_bibtex]';
    btn.setAttribute('aria-expanded', isShowing ? 'true' : 'false');
  }
};

function fallbackCopy(text, cb) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  ta.style.pointerEvents = 'none';
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try {
    const ok = document.execCommand('copy');
    if (ok && cb) cb();
  } catch (e) {
    showToast('Failed to copy');
  }
  document.body.removeChild(ta);
}

window.copyBibtex = function (id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const text = el.innerText.trim();

  function onCopied() {
    showToast('Copied BibTeX snippet to clipboard');
    if (btn) {
      const orig = btn.textContent;
      btn.textContent = '[copied!]';
      setTimeout(() => { btn.textContent = orig; }, 1600);
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onCopied).catch(() => fallbackCopy(text, onCopied));
  } else {
    fallbackCopy(text, onCopied);
  }
};

// Theme synchronization and events
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const themeLabel = document.getElementById('theme-label');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)');

  function getTheme() {
    return localStorage.getItem('theme') || (prefersLight.matches ? 'light' : 'dark');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeLabel) {
      themeLabel.textContent = theme;
    }
  }

  // Ensure label matches currently active theme
  const initialTheme = document.documentElement.getAttribute('data-theme') || getTheme();
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  prefersLight.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      applyTheme(e.matches ? 'light' : 'dark');
    }
  });

  // Dynamic Uptime Calculator (Birth: Nov 5, 2001)
  const uptimeEl = document.getElementById('uptime-val');
  if (uptimeEl) {
    const birthDate = new Date(2001, 10, 5); // Month index 10 = November
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const parts = [];
    parts.push(`${years} ${years === 1 ? 'year' : 'years'}`);
    if (months > 0) parts.push(`${months} ${months === 1 ? 'month' : 'months'}`);
    if (days > 0) parts.push(`${days} ${days === 1 ? 'day' : 'days'}`);
    uptimeEl.textContent = parts.join(', ');
  }
});
