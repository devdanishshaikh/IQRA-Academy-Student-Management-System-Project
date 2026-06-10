// ============================================================
// IQRA Academy - Auth Module
// ============================================================

const AUTH_KEY    = 'iqra_auth';
const SESSION_KEY = 'iqra_session';

const CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

/* ── Storage helpers ─────────────────────────────────────── */
function getSettings() {
  return JSON.parse(localStorage.getItem('iqra_settings') || '{}');
}

function applyTheme() {
  const s = getSettings();
  if (s.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
}

/* ── Session helpers ─────────────────────────────────────── */
function isLoggedIn() {
  return !!sessionStorage.getItem(SESSION_KEY);
}

function login(username, password) {
  const storedPwd = localStorage.getItem('iqra_admin_password') || CREDENTIALS.password;
  if (username === CREDENTIALS.username && password === storedPwd) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      username,
      loginTime: new Date().toISOString()
    }));
    return true;
  }
  return false;
}

function logout() {
  sessionStorage.removeItem(SESSION_KEY);
  window.location.href = 'index.html';
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = 'index.html';
  }
}

/* ── Login page logic ────────────────────────────────────── */
function initLoginPage() {
  applyTheme();

  // If already logged in, go to dashboard
  if (isLoggedIn()) {
    window.location.href = 'dashboard.html';
    return;
  }

  // Generate particles
  const particlesEl = document.getElementById('loginParticles');
  if (particlesEl) {
    for (let i = 0; i < 18; i++) {
      const p = document.createElement('div');
      p.className = 'login-particle';
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        animation-duration: ${5 + Math.random() * 10}s;
        animation-delay: ${Math.random() * 8}s;
      `;
      particlesEl.appendChild(p);
    }
  }

  // Toggle password visibility
  const toggleBtn = document.getElementById('togglePassword');
  const pwdInput  = document.getElementById('password');
  if (toggleBtn && pwdInput) {
    toggleBtn.addEventListener('click', () => {
      const isText = pwdInput.type === 'text';
      pwdInput.type = isText ? 'password' : 'text';
      toggleBtn.innerHTML = isText
        ? '<i class="fas fa-eye"></i>'
        : '<i class="fas fa-eye-slash"></i>';
    });
  }

  // Form submit
  const form = document.getElementById('loginForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const username  = document.getElementById('username').value.trim();
      const password  = document.getElementById('password').value;
      const errorEl   = document.getElementById('loginError');
      const btnEl     = document.getElementById('loginBtn');

      btnEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in…';
      btnEl.disabled  = true;

      setTimeout(() => {
        if (login(username, password)) {
          btnEl.innerHTML = '<i class="fas fa-check"></i> Success!';
          btnEl.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          setTimeout(() => { window.location.href = 'dashboard.html'; }, 600);
        } else {
          errorEl.style.display = 'block';
          errorEl.textContent   = 'Invalid username or password. Please try again.';
          btnEl.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
          btnEl.disabled  = false;
          // shake
          document.querySelector('.login-card').style.animation = 'none';
          setTimeout(() => {
            document.querySelector('.login-card').style.animation = '';
          }, 50);
        }
      }, 900);
    });

    // Hide error on input change
    form.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', () => {
        document.getElementById('loginError').style.display = 'none';
      });
    });
  }
}

/* ── Sidebar / Navbar shared init ───────────────────────── */
function initLayout() {
  requireAuth();
  applyTheme();

  // Highlight active nav item
  const currentPage = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-item').forEach(item => {
    const href = item.getAttribute('href');
    if (href === currentPage) {
      item.classList.add('active');
    }
  });

  // Sidebar toggle (mobile)
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('sidebarOverlay');
  const toggleBtn = document.getElementById('sidebarToggle');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      overlay.classList.toggle('open');
    });
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
    });
  }

  // Logout
  document.querySelectorAll('.logout-btn').forEach(btn => {
    btn.addEventListener('click', logout);
  });

  // Theme toggle
  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = getSettings();
      s.darkMode = !s.darkMode;
      localStorage.setItem('iqra_settings', JSON.stringify(s));
      applyTheme();
      updateThemeIcon();
    });
  });

  updateThemeIcon();

  // Clock
  function updateClock() {
    const el = document.getElementById('navbarTime');
    if (el) {
      const now = new Date();
      el.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }
  }
  updateClock();
  setInterval(updateClock, 1000);
}

function updateThemeIcon() {
  const s = getSettings();
  document.querySelectorAll('.theme-toggle i').forEach(icon => {
    icon.className = s.darkMode ? 'fas fa-sun' : 'fas fa-moon';
  });
}

/* ── Toast Notification System ───────────────────────────── */
function showToast(title, message, type = 'success') {
  const icons = {
    success: 'fas fa-check',
    error:   'fas fa-times',
    warning: 'fas fa-exclamation',
    info:    'fas fa-info'
  };

  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <div class="toast-icon"><i class="${icons[type] || icons.info}"></i></div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      ${message ? `<div class="toast-msg">${message}</div>` : ''}
    </div>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 350);
  }, 3200);
}

/* ── Data helpers (shared) ───────────────────────────────── */
const COURSES = {
  ENG: { name: 'English',                      code: 'ENG', teacher: 'Sir Khalid Mehmood Soomro', fee: 1500 },
  PHY: { name: 'Physics',                      code: 'PHY', teacher: 'Sir Mashooque',             fee: 1800 },
  CHE: { name: 'Chemistry',                    code: 'CHE', teacher: 'Sir Zaheer Abbas',           fee: 1800 },
  MAT: { name: 'Mathematics',                  code: 'MAT', teacher: 'Sir Mazhar Baloch',          fee: 1800 },
  BIO: { name: 'Biology',                      code: 'BIO', teacher: 'Sir Muneer Ahmed Shaikh',    fee: 1800 },
  CIT: { name: 'Computer Information Technology', code: 'CIT', teacher: 'Sir Muhammad Ali Shaikh', fee: 2000 }
};

function getStudents() {
  return JSON.parse(localStorage.getItem('iqra_students') || '[]');
}

function saveStudents(students) {
  localStorage.setItem('iqra_students', JSON.stringify(students));
}

function getAttendance() {
  return JSON.parse(localStorage.getItem('iqra_attendance') || '{}');
}

function saveAttendance(att) {
  localStorage.setItem('iqra_attendance', JSON.stringify(att));
}

function getFees() {
  return JSON.parse(localStorage.getItem('iqra_fees') || '{}');
}

function saveFees(fees) {
  localStorage.setItem('iqra_fees', JSON.stringify(fees));
}

function generateRollNumber(courseCode) {
  const key = `iqra_counter_${courseCode}`;
  const current = parseInt(localStorage.getItem(key) || '0') + 1;
  localStorage.setItem(key, current);
  return `${courseCode}-${String(current).padStart(3, '0')}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function todayISO() {
  return new Date().toISOString().split('T')[0];
}
