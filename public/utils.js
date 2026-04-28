// ─── MedConnect Shared Utilities ─────────────────────────────────────────────

const MC = {
  // ─── API Helper ─────────────────────────────────────────────────────────────
  async api(method, url, body = null) {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin'
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(url, opts);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  get: (url) => MC.api('GET', url),
  post: (url, body) => MC.api('POST', url, body),
  put: (url, body) => MC.api('PUT', url, body),
  delete: (url) => MC.api('DELETE', url),

  // ─── Toast Notifications ─────────────────────────────────────────────────
  toast(msg, type = 'info', duration = 3500) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }
    const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
    const t = document.createElement('div');
    t.className = `toast ${type}`;
    t.innerHTML = `<span>${icons[type] || icons.info}</span><span>${msg}</span>`;
    container.appendChild(t);
    setTimeout(() => {
      t.style.animation = 'toastOut 0.3s ease forwards';
      setTimeout(() => t.remove(), 300);
    }, duration);
  },

  // ─── Loading Overlay ──────────────────────────────────────────────────────
  loading(show) {
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'loading-overlay';
      overlay.innerHTML = '<div class="spinner"></div>';
      document.body.appendChild(overlay);
    }
    overlay.classList.toggle('active', show);
  },

  // ─── Auth ─────────────────────────────────────────────────────────────────
  async getMe() {
    try { return await MC.get('/api/auth/me'); }
    catch { return null; }
  },

  async requireAuth(role = null) {
    const data = await MC.getMe();
    if (!data) { window.location.href = '/'; return null; }
    if (role && data.user.role !== role) {
      window.location.href = data.user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard';
      return null;
    }
    return data.user;
  },

  async logout() {
    await MC.post('/api/auth/logout');
    window.location.href = '/';
  },

  // ─── Render Helpers ───────────────────────────────────────────────────────
  initNavbar(user) {
    const nameEl = document.querySelectorAll('[data-user-name]');
    const initEl = document.querySelectorAll('[data-user-initials]');
    nameEl.forEach(el => el.textContent = user.name);
    initEl.forEach(el => el.textContent = user.initials);
  },

  renderBadge(status) {
    const map = {
      confirmed: 'badge-confirmed', pending: 'badge-pending',
      completed: 'badge-completed', cancelled: 'badge-cancelled',
      success: 'badge-success', pending: 'badge-warning'
    };
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    return `<span class="badge ${map[status] || 'badge-primary'}">${label}</span>`;
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);
    if (d.getTime() === today.getTime()) return 'Today';
    if (d.getTime() === tomorrow.getTime()) return 'Tomorrow';
    const diffDays = Math.round((today - d) / 86400000);
    if (diffDays === 1) return 'Yesterday';
    if (diffDays > 1 && diffDays < 30) return `${diffDays} days ago`;
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  getInitials(name) {
    return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  },

  getAvatarGradient(index = 0) {
    const gradients = [
      'linear-gradient(135deg,#2563eb,#3b82f6)',
      'linear-gradient(135deg,#10b981,#059669)',
      'linear-gradient(135deg,#8b5cf6,#7c3aed)',
      'linear-gradient(135deg,#f59e0b,#d97706)',
      'linear-gradient(135deg,#ef4444,#dc2626)',
    ];
    return gradients[index % gradients.length];
  }
};

// ─── Global logout handler ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-logout]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      MC.logout();
    });
  });
});
