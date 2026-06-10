// ============================================================
// IQRA Academy – Dashboard Module
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initLayout();

  // Date display
  const dateEl = document.getElementById('dashDate');
  if (dateEl) {
    dateEl.textContent = new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  renderStats();
  renderCharts();
  renderRecentAdmissions();
});

/* ── Statistics ────────────────────────────────────────── */
function renderStats() {
  const students   = getStudents();
  const fees       = getFees();
  const attendance = getAttendance();
  const today      = todayISO();

  // Attendance counts for today
  let presentToday = 0, absentToday = 0;
  students.forEach(s => {
    const rec = attendance[s.rollNumber];
    if (rec && rec[today] === 'present') presentToday++;
    else if (rec && rec[today] === 'absent') absentToday++;
  });

  // Fee counts
  let paid = 0, unpaid = 0;
  students.forEach(s => {
    const month = today.slice(0, 7);
    if (fees[s.rollNumber] && fees[s.rollNumber][month] === 'paid') paid++;
    else unpaid++;
  });

  animateCount('stat-totalStudents', students.length);
  animateCount('stat-present', presentToday);
  animateCount('stat-absent', absentToday);
  animateCount('stat-paid', paid);
  animateCount('stat-unpaid', unpaid);
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  if (!el) return;
  let current = 0;
  const step  = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 30);
}

/* ── Charts ────────────────────────────────────────────── */
let courseChartInst, attChartInst, feeChartInst;

function getChartColors(dark) {
  return {
    gridColor: dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)',
    textColor:  dark ? '#94a3b8' : '#64748b'
  };
}

function renderCharts() {
  const students = getStudents();
  const dark     = document.documentElement.getAttribute('data-theme') === 'dark';
  const { gridColor, textColor } = getChartColors(dark);

  const commonOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: textColor, font: { family: 'Inter', size: 11 }, padding: 12 } } }
  };

  // ── Course Bar Chart ────────────────────────────────
  const courseCounts = {};
  Object.keys(COURSES).forEach(c => courseCounts[c] = 0);
  students.forEach(s => { if (courseCounts[s.courseCode] !== undefined) courseCounts[s.courseCode]++; });

  const courseCtx = document.getElementById('courseChart');
  if (courseCtx) {
    if (courseChartInst) courseChartInst.destroy();
    courseChartInst = new Chart(courseCtx, {
      type: 'bar',
      data: {
        labels: Object.values(COURSES).map(c => c.code),
        datasets: [{
          label: 'Students',
          data: Object.values(courseCounts),
          backgroundColor: [
            'rgba(59,130,246,0.8)',
            'rgba(99,102,241,0.8)',
            'rgba(16,185,129,0.8)',
            'rgba(245,158,11,0.8)',
            'rgba(239,68,68,0.8)',
            'rgba(168,85,247,0.8)'
          ],
          borderRadius: 6,
          borderSkipped: false
        }]
      },
      options: {
        ...commonOpts,
        scales: {
          x: { grid: { color: gridColor }, ticks: { color: textColor, font: { family: 'Inter', size: 10 } } },
          y: { grid: { color: gridColor }, ticks: { color: textColor, stepSize: 1, font: { family: 'Inter', size: 10 } } }
        },
        plugins: { ...commonOpts.plugins, legend: { display: false } }
      }
    });
  }

  // ── Attendance Doughnut ──────────────────────────────
  const attCtx = document.getElementById('attendanceChart');
  if (attCtx) {
    if (attChartInst) attChartInst.destroy();
    const today     = todayISO();
    const attendance = getAttendance();
    let present = 0, absent = 0, unmarked = 0;
    students.forEach(s => {
      const rec = attendance[s.rollNumber];
      if (rec && rec[today] === 'present') present++;
      else if (rec && rec[today] === 'absent') absent++;
      else unmarked++;
    });

    attChartInst = new Chart(attCtx, {
      type: 'doughnut',
      data: {
        labels: ['Present', 'Absent', 'Not Marked'],
        datasets: [{
          data: [present, absent, unmarked],
          backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(239,68,68,0.85)', 'rgba(148,163,184,0.5)'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        ...commonOpts,
        cutout: '68%',
        plugins: {
          ...commonOpts.plugins,
          legend: { ...commonOpts.plugins.legend, position: 'bottom' }
        }
      }
    });
  }

  // ── Fee Status Doughnut ──────────────────────────────
  const feeCtx = document.getElementById('feeChart');
  if (feeCtx) {
    if (feeChartInst) feeChartInst.destroy();
    const fees  = getFees();
    const month = todayISO().slice(0, 7);
    let paid = 0, unpaid = 0;
    students.forEach(s => {
      if (fees[s.rollNumber] && fees[s.rollNumber][month] === 'paid') paid++;
      else unpaid++;
    });

    feeChartInst = new Chart(feeCtx, {
      type: 'doughnut',
      data: {
        labels: ['Paid', 'Unpaid'],
        datasets: [{
          data: [paid, unpaid],
          backgroundColor: ['rgba(16,185,129,0.85)', 'rgba(239,68,68,0.85)'],
          borderWidth: 0,
          hoverOffset: 6
        }]
      },
      options: {
        ...commonOpts,
        cutout: '68%',
        plugins: {
          ...commonOpts.plugins,
          legend: { ...commonOpts.plugins.legend, position: 'bottom' }
        }
      }
    });
  }
}

/* ── Recent Admissions ──────────────────────────────────── */
function renderRecentAdmissions() {
  const students = getStudents();
  const tbody    = document.getElementById('recentBody');
  if (!tbody) return;

  // Show last 8 admitted (newest first)
  const recent = [...students].reverse().slice(0, 8);

  if (recent.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6">
          <div class="empty-state">
            <i class="fas fa-user-graduate"></i>
            <h3>No Students Yet</h3>
            <p>Add students to see recent admissions here.</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = recent.map((s, i) => `
    <tr>
      <td>${i + 1}</td>
      <td><span class="badge badge-blue">${s.rollNumber}</span></td>
      <td>
        <div style="display:flex; align-items:center; gap:.6rem;">
          <div style="width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,var(--primary-500),var(--accent-500));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:.75rem;flex-shrink:0;">
            ${s.studentName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style="font-weight:600;">${escHtml(s.studentName)}</div>
            <div style="font-size:.72rem;color:var(--text-muted);">${escHtml(s.fatherName)}'s Son/Daughter</div>
          </div>
        </div>
      </td>
      <td><span class="badge badge-purple">${escHtml(s.courseName)}</span></td>
      <td>${escHtml(s.teacher)}</td>
      <td>${formatDate(s.admissionDate)}</td>
    </tr>
  `).join('');
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
