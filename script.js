/**
 * Koosha Kazemi — Homepage Script
 * Minimalist Theme Toggle (Dark / Light) & BibTeX Copy Helper
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

// BibTeX Toggle Helper
window.toggleBibtex = function (id, btn) {
  const el = document.getElementById(id);
  if (!el) return;
  const isShowing = el.classList.toggle('show');
  if (btn) {
    btn.setAttribute('aria-expanded', isShowing ? 'true' : 'false');
    const labelSpan = btn.querySelector('span');
    if (labelSpan) {
      labelSpan.textContent = isShowing ? 'Hide BibTeX' : 'BibTeX';
    }
  }
};

// Clipboard Copy Fallback
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
    showToast('Failed to copy to clipboard');
  }
  document.body.removeChild(ta);
}

// BibTeX Copy Function
window.copyBibtex = function (codeId, btn) {
  const codeEl = document.getElementById(codeId);
  if (!codeEl) return;
  const text = codeEl.innerText.trim();

  function onCopied() {
    showToast('Copied BibTeX snippet to clipboard');
    if (btn) {
      const textSpan = btn.querySelector('.copy-btn-text') || btn;
      const originalText = textSpan.textContent;
      textSpan.textContent = 'Copied!';
      btn.style.borderColor = 'var(--accent)';
      setTimeout(() => {
        textSpan.textContent = originalText;
        btn.style.borderColor = '';
      }, 1600);
    }
  }

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(onCopied).catch(() => fallbackCopy(text, onCopied));
  } else {
    fallbackCopy(text, onCopied);
  }
};

// Initialize Theme & Listeners on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  const themeToggle = document.getElementById('theme-toggle');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function getActiveTheme() {
    return document.documentElement.getAttribute('data-theme') ||
           localStorage.getItem('theme') ||
           (prefersDark.matches ? 'dark' : 'light');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  // Set initial theme
  setTheme(getActiveTheme());

  // Click toggle
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'light';
      const next = current === 'dark' ? 'light' : 'dark';
      setTheme(next);
    });
  }

  // Listen to OS theme changes if user hasn't explicitly set a preference
  prefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
});
