// ============================================================
// IQRA Academy – Attendance Module
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initLayout();

  // Default to today
  document.getElementById('attendanceDate').value = todayISO();

  renderAttendanceTable();
  bindAttEvents();
});

/* ── Events ──────────────────────────────────────────────── */
function bindAttEvents() {
  document.getElementById('attendanceDate').addEventListener('change', renderAttendanceTable);
  document.getElementById('attFilterCourse').addEventListener('change', renderAttendanceTable);
  document.getElementById('attSearch').addEventListener('input', renderAttendanceTable);
  document.getElementById('markAllPresent').addEventListener('click', () => markAll('present'));
  document.getElementById('markAllAbsent').addEventListener('click',  () => markAll('absent'));
}

/* ── Render Table ────────────────────────────────────────── */
function renderAttendanceTable() {
  const date    = document.getElementById('attendanceDate').value || todayISO();
  const course  = document.getElementById('attFilterCourse').value;
  const query   = document.getElementById('attSearch').value.trim().toLowerCase();
  const students = getStudents();
  const att      = getAttendance();

  let filtered = students.filter(s => {
    const matchCourse = !course || s.courseCode === course;
    const matchQuery  = !query  || s.studentName.toLowerCase().includes(query) || s.rollNumber.toLowerCase().includes(query);
    return matchCourse && matchQuery;
  });

  const tbody = document.getElementById('attendanceBody');

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <i class="fas fa-clipboard-list"></i>
            <h3>${students.length === 0 ? 'No Students Enrolled' : 'No Results'}</h3>
            <p>${students.length === 0 ? 'Enroll students first from the Students page.' : 'Try adjusting your search or filter.'}</p>
          </div>
        </td>
      </tr>`;
    updateAttStats(filtered, date, att);
    return;
  }

  tbody.innerHTML = filtered.map((s, i) => {
    const record  = att[s.rollNumber] || {};
    const status  = record[date] || 'none';
    const pct     = calcAttendancePct(record);
    const pctClass = pct >= 75 ? 'pct-high' : pct >= 50 ? 'pct-medium' : 'pct-low';

    return `
      <tr id="row-${s.rollNumber}">
        <td style="color:var(--text-muted);font-size:.78rem;">${i + 1}</td>
        <td><span class="badge badge-blue" style="font-family:monospace;">${escHtml(s.rollNumber)}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:.6rem;">
            <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--primary-500),var(--accent-500));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:.78rem;flex-shrink:0;">
              ${s.studentName.charAt(0).toUpperCase()}
            </div>
            <span style="font-weight:600;">${escHtml(s.studentName)}</span>
          </div>
        </td>
        <td><span class="badge badge-purple">${escHtml(s.courseCode)}</span></td>
        <td style="font-size:.8rem;">${escHtml(s.teacher)}</td>
        <td style="text-align:center;">
          <div class="attendance-toggle">
            <button
              class="present-btn ${status === 'present' ? 'active' : ''}"
              onclick="markAttendance('${s.rollNumber}', '${date}', 'present')"
              title="Mark Present"
            >
              🟢 Present
            </button>
            <button
              class="absent-btn ${status === 'absent' ? 'active' : ''}"
              onclick="markAttendance('${s.rollNumber}', '${date}', 'absent')"
              title="Mark Absent"
            >
              🔴 Absent
            </button>
          </div>
        </td>
        <td style="text-align:center;">
          <span class="attendance-pct ${pctClass}">${pct}%</span>
        </td>
      </tr>`;
  }).join('');

  updateAttStats(filtered, date, att);
}

/* ── Mark Single Student ─────────────────────────────────── */
function markAttendance(rollNumber, date, status) {
  const att = getAttendance();
  if (!att[rollNumber]) att[rollNumber] = {};

  // Toggle: click same button again to clear
  if (att[rollNumber][date] === status) {
    delete att[rollNumber][date];
  } else {
    att[rollNumber][date] = status;
  }
  saveAttendance(att);

  const label = status === 'present' ? 'Present' : 'Absent';
  showToast('Attendance Updated', `Marked as ${label} for ${rollNumber}`, 'success');
  renderAttendanceTable();
}

/* ── Mark All ────────────────────────────────────────────── */
function markAll(status) {
  const date    = document.getElementById('attendanceDate').value || todayISO();
  const course  = document.getElementById('attFilterCourse').value;
  const students = getStudents().filter(s => !course || s.courseCode === course);
  const att      = getAttendance();

  students.forEach(s => {
    if (!att[s.rollNumber]) att[s.rollNumber] = {};
    att[s.rollNumber][date] = status;
  });

  saveAttendance(att);
  const label = status === 'present' ? 'Present' : 'Absent';
  showToast('Bulk Update', `All ${students.length} students marked as ${label}.`, 'success');
  renderAttendanceTable();
}

/* ── Stats ───────────────────────────────────────────────── */
function updateAttStats(students, date, att) {
  let present = 0, absent = 0, unmarked = 0;
  students.forEach(s => {
    const rec = att[s.rollNumber];
    if (rec && rec[date] === 'present')      present++;
    else if (rec && rec[date] === 'absent')  absent++;
    else                                     unmarked++;
  });

  document.getElementById('att-total').textContent    = students.length;
  document.getElementById('att-present').textContent  = present;
  document.getElementById('att-absent').textContent   = absent;
  document.getElementById('att-unmarked').textContent = unmarked;
}

/* ── Percentage Calculation ──────────────────────────────── */
function calcAttendancePct(record) {
  if (!record || Object.keys(record).length === 0) return 0;
  const total   = Object.keys(record).length;
  const present = Object.values(record).filter(v => v === 'present').length;
  return total === 0 ? 0 : Math.round((present / total) * 100);
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
