// ============================================================
// IQRA Academy – Settings Module
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  loadSettings();
  bindSettingsEvents();

  // System info
  const sysEl = document.getElementById('sysStudents');
  if (sysEl) sysEl.textContent = getStudents().length;
});

/* ── Load Saved Settings ─────────────────────────────────── */
function loadSettings() {
  const s = getSettings();
  const darkCheck = document.getElementById('darkModeCheck');
  if (darkCheck) darkCheck.checked = !!s.darkMode;
}

/* ── Events ──────────────────────────────────────────────── */
function bindSettingsEvents() {
  // Dark mode toggle
  const darkCheck = document.getElementById('darkModeCheck');
  if (darkCheck) {
    darkCheck.addEventListener('change', () => {
      const s = getSettings();
      s.darkMode = darkCheck.checked;
      localStorage.setItem('iqra_settings', JSON.stringify(s));
      applyTheme();
      updateThemeIcon();
      showToast(
        s.darkMode ? 'Dark Mode On' : 'Light Mode On',
        `Theme switched to ${s.darkMode ? 'dark' : 'light'} mode.`,
        'info'
      );
    });
  }

  // Change password form
  const pwdForm = document.getElementById('changePasswordForm');
  if (pwdForm) {
    pwdForm.addEventListener('submit', (e) => {
      e.preventDefault();
      changePassword();
    });
  }

  // Clear data button
  document.getElementById('clearDataBtn')?.addEventListener('click', () => {
    document.getElementById('clearDataModal').classList.add('open');
  });
  document.getElementById('cancelClearBtn')?.addEventListener('click', () => {
    document.getElementById('clearDataModal').classList.remove('open');
  });
  document.getElementById('confirmClearBtn')?.addEventListener('click', clearAllData);
  document.getElementById('clearDataModal')?.addEventListener('click', (e) => {
    if (e.target === document.getElementById('clearDataModal')) {
      document.getElementById('clearDataModal').classList.remove('open');
    }
  });
}

/* ── Change Password ─────────────────────────────────────── */
function changePassword() {
  const current  = document.getElementById('currentPassword').value;
  const newPwd   = document.getElementById('newPassword').value;
  const confirm  = document.getElementById('confirmPassword').value;
  const storedPwd = localStorage.getItem('iqra_admin_password') || 'admin123';

  if (!current || !newPwd || !confirm) {
    showToast('Validation Error', 'Please fill in all password fields.', 'error');
    return;
  }

  if (current !== storedPwd) {
    showToast('Incorrect Password', 'Current password is wrong.', 'error');
    return;
  }

  if (newPwd.length < 6) {
    showToast('Weak Password', 'New password must be at least 6 characters.', 'warning');
    return;
  }

  if (newPwd !== confirm) {
    showToast('Mismatch', 'New password and confirmation do not match.', 'error');
    return;
  }

  localStorage.setItem('iqra_admin_password', newPwd);
  document.getElementById('changePasswordForm').reset();
  showToast('Password Changed', 'Your password has been updated successfully.', 'success');
}

/* ── Toggle Password Field Visibility ───────────────────── */
function togglePwdField(fieldId, btn) {
  const field = document.getElementById(fieldId);
  if (!field) return;
  const isText = field.type === 'text';
  field.type   = isText ? 'password' : 'text';
  btn.innerHTML = isText
    ? '<i class="fas fa-eye"></i>'
    : '<i class="fas fa-eye-slash"></i>';
}

/* ── Clear All Data ──────────────────────────────────────── */
function clearAllData() {
  localStorage.removeItem('iqra_students');
  localStorage.removeItem('iqra_attendance');
  localStorage.removeItem('iqra_fees');

  // Clear roll number counters
  Object.keys(COURSES).forEach(code => {
    localStorage.removeItem(`iqra_counter_${code}`);
  });

  document.getElementById('clearDataModal').classList.remove('open');
  showToast('Data Cleared', 'All records have been permanently deleted.', 'warning');

  // Update system info count
  const sysEl = document.getElementById('sysStudents');
  if (sysEl) sysEl.textContent = '0';
}
