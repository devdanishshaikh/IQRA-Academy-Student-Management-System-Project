// ============================================================
// IQRA Academy – Fee Management Module
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initLayout();

  // Default to current month
  const now = new Date();
  document.getElementById('feeMonth').value =
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

  renderFeesTable();
  bindFeeEvents();
});

/* ── Events ──────────────────────────────────────────────── */
function bindFeeEvents() {
  document.getElementById('feeMonth').addEventListener('change', renderFeesTable);
  document.getElementById('feeFilterCourse').addEventListener('change', renderFeesTable);
  document.getElementById('feeFilterStatus').addEventListener('change', renderFeesTable);
  document.getElementById('feeSearch').addEventListener('input', renderFeesTable);
}

/* ── Render Table ────────────────────────────────────────── */
function renderFeesTable() {
  const month   = document.getElementById('feeMonth').value;
  const course  = document.getElementById('feeFilterCourse').value;
  const status  = document.getElementById('feeFilterStatus').value;
  const query   = document.getElementById('feeSearch').value.trim().toLowerCase();
  const students = getStudents();
  const fees     = getFees();

  let filtered = students.filter(s => {
    const feeStatus   = fees[s.rollNumber]?.[month] || 'unpaid';
    const matchCourse = !course || s.courseCode === course;
    const matchStatus = !status || feeStatus === status;
    const matchQuery  = !query  ||
      s.studentName.toLowerCase().includes(query) ||
      s.rollNumber.toLowerCase().includes(query);
    return matchCourse && matchStatus && matchQuery;
  });

  const tbody = document.getElementById('feesBody');

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7">
          <div class="empty-state">
            <i class="fas fa-money-bill-wave"></i>
            <h3>${students.length === 0 ? 'No Students Enrolled' : 'No Results'}</h3>
            <p>${students.length === 0 ? 'Enroll students first from the Students page.' : 'Try adjusting filters.'}</p>
          </div>
        </td>
      </tr>`;
    updateFeeStats(students, month, fees);
    return;
  }

  tbody.innerHTML = filtered.map((s, i) => {
    const feeStatus = fees[s.rollNumber]?.[month] || 'unpaid';
    const isPaid    = feeStatus === 'paid';
    const rowClass  = isPaid ? 'paid-row' : '';

    const badgeHtml = isPaid
      ? `<span class="badge badge-green"><i class="fas fa-check-circle"></i> Paid</span>`
      : `<span class="badge badge-red"><i class="fas fa-times-circle"></i> Unpaid</span>`;

    return `
      <tr class="${rowClass}" id="fee-row-${s.rollNumber}">
        <td style="color:var(--text-muted);font-size:.78rem;">${i + 1}</td>
        <td><span class="badge badge-blue" style="font-family:monospace;">${escHtml(s.rollNumber)}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:.6rem;">
            <div style="width:30px;height:30px;border-radius:50%;background:${isPaid ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,var(--primary-500),var(--accent-500))'};display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:.78rem;flex-shrink:0;">
              ${s.studentName.charAt(0).toUpperCase()}
            </div>
            <span style="font-weight:600;">${escHtml(s.studentName)}</span>
          </div>
        </td>
        <td><span class="badge badge-purple">${escHtml(s.courseCode)}</span></td>
        <td style="font-weight:700;color:var(--primary-600);">Rs. ${Number(s.monthlyFee).toLocaleString()}</td>
        <td style="text-align:center;">
          <div class="fee-checkbox-wrapper" onclick="toggleFee('${s.rollNumber}', '${month}')">
            <div class="fee-checkbox ${isPaid ? 'checked' : ''}" title="${isPaid ? 'Click to mark unpaid' : 'Click to mark paid'}">
              ${isPaid ? '<i class="fas fa-check"></i>' : ''}
            </div>
          </div>
        </td>
        <td style="text-align:center;">${badgeHtml}</td>
      </tr>`;
  }).join('');

  updateFeeStats(students, month, fees);
}

/* ── Toggle Fee Status ───────────────────────────────────── */
function toggleFee(rollNumber, month) {
  const fees = getFees();
  if (!fees[rollNumber]) fees[rollNumber] = {};

  const current = fees[rollNumber][month] || 'unpaid';
  fees[rollNumber][month] = current === 'paid' ? 'unpaid' : 'paid';
  saveFees(fees);

  const newStatus = fees[rollNumber][month];
  const students  = getStudents();
  const student   = students.find(s => s.rollNumber === rollNumber);
  const name      = student ? student.studentName : rollNumber;
  const label     = newStatus === 'paid' ? 'Paid' : 'Unpaid';

  showToast('Fee Updated', `${name} marked as ${label}`, newStatus === 'paid' ? 'success' : 'warning');
  renderFeesTable();
}

/* ── Stats ───────────────────────────────────────────────── */
function updateFeeStats(students, month, fees) {
  let paid = 0, unpaid = 0, totalCollection = 0, pendingAmount = 0;

  students.forEach(s => {
    const feeStatus = fees[s.rollNumber]?.[month] || 'unpaid';
    if (feeStatus === 'paid') {
      paid++;
      totalCollection += Number(s.monthlyFee) || 0;
    } else {
      unpaid++;
      pendingAmount += Number(s.monthlyFee) || 0;
    }
  });

  document.getElementById('fee-paid').textContent    = paid;
  document.getElementById('fee-unpaid').textContent  = unpaid;
  document.getElementById('fee-total').textContent   = `Rs. ${totalCollection.toLocaleString()}`;
  document.getElementById('fee-pending').textContent = `Rs. ${pendingAmount.toLocaleString()}`;
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
