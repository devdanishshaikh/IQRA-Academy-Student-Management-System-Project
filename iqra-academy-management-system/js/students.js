// ============================================================
// IQRA Academy – Students Module
// ============================================================

let deleteTargetIndex = -1;

document.addEventListener('DOMContentLoaded', () => {
  initLayout();
  renderStudentsTable();
  bindEvents();
});

/* ── Event Bindings ──────────────────────────────────────── */
function bindEvents() {
  // Open add modal
  document.getElementById('btnAddStudent').addEventListener('click', openAddModal);

  // Close modal buttons
  document.getElementById('modalClose').addEventListener('click', closeStudentModal);
  document.getElementById('modalCancelBtn').addEventListener('click', closeStudentModal);

  // Save student
  document.getElementById('saveStudentBtn').addEventListener('click', saveStudent);

  // Course → auto assign teacher
  document.getElementById('course').addEventListener('change', onCourseChange);

  // Search / filter
  document.getElementById('searchInput').addEventListener('input', renderStudentsTable);
  document.getElementById('filterCourse').addEventListener('change', renderStudentsTable);
  document.getElementById('filterGender').addEventListener('change', renderStudentsTable);

  // Confirm delete
  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
  document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
    closeModal('confirmModal');
    deleteTargetIndex = -1;
  });

  // Close modal on backdrop click
  document.getElementById('studentModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('studentModal')) closeStudentModal();
  });
  document.getElementById('confirmModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('confirmModal')) closeModal('confirmModal');
  });
}

/* ── Render Table ────────────────────────────────────────── */
function renderStudentsTable() {
  const students = getStudents();
  const query    = document.getElementById('searchInput').value.trim().toLowerCase();
  const course   = document.getElementById('filterCourse').value;
  const gender   = document.getElementById('filterGender').value;
  const tbody    = document.getElementById('studentsBody');

  let filtered = students.filter(s => {
    const matchQuery  = !query || [s.studentName, s.rollNumber, s.courseName, s.teacher].some(f => f.toLowerCase().includes(query));
    const matchCourse = !course || s.courseCode === course;
    const matchGender = !gender || s.gender === gender;
    return matchQuery && matchCourse && matchGender;
  });

  const countEl = document.getElementById('resultCount');
  countEl.textContent = `Showing ${filtered.length} of ${students.length} students`;

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="11">
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <h3>${students.length === 0 ? 'No Students Yet' : 'No Results Found'}</h3>
            <p>${students.length === 0 ? 'Click "Add Student" to enroll your first student.' : 'Try a different search or filter.'}</p>
          </div>
        </td>
      </tr>`;
    return;
  }

  tbody.innerHTML = filtered.map((s, i) => {
    const globalIdx = students.indexOf(s);
    const genderBadge = s.gender === 'Male'
      ? '<span class="badge badge-blue"><i class="fas fa-mars"></i> Male</span>'
      : '<span class="badge badge-purple"><i class="fas fa-venus"></i> Female</span>';

    return `
      <tr>
        <td style="color:var(--text-muted);font-size:.78rem;">${i + 1}</td>
        <td><span class="badge badge-blue" style="font-family:monospace;">${escHtml(s.rollNumber)}</span></td>
        <td>
          <div style="display:flex;align-items:center;gap:.6rem;">
            <div style="width:32px;height:32px;border-radius:50%;background:linear-gradient(135deg,var(--primary-500),var(--accent-500));display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:.8rem;flex-shrink:0;">
              ${s.studentName.charAt(0).toUpperCase()}
            </div>
            <span style="font-weight:600;">${escHtml(s.studentName)}</span>
          </div>
        </td>
        <td>${escHtml(s.fatherName)}</td>
        <td>${genderBadge}</td>
        <td><i class="fas fa-phone" style="color:var(--text-muted);margin-right:4px;font-size:.78rem;"></i>${escHtml(s.mobile)}</td>
        <td><span class="badge badge-purple">${escHtml(s.courseName)}</span></td>
        <td style="font-size:.8rem;">${escHtml(s.teacher)}</td>
        <td style="font-weight:600;color:var(--success);">Rs. ${Number(s.monthlyFee).toLocaleString()}</td>
        <td style="font-size:.78rem;color:var(--text-muted);">${formatDate(s.admissionDate)}</td>
        <td>
          <div style="display:flex;gap:.35rem;">
            <button class="btn btn-sm btn-primary" onclick="openEditModal(${globalIdx})" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn btn-sm btn-danger" onclick="openDeleteConfirm(${globalIdx})" title="Delete">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>`;
  }).join('');
}

/* ── Modal Helpers ───────────────────────────────────────── */
function openModal(id) {
  document.getElementById(id).classList.add('open');
}

function closeModal(id) {
  document.getElementById(id).classList.remove('open');
}

function openAddModal() {
  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-plus"></i> Add New Student';
  document.getElementById('studentForm').reset();
  document.getElementById('editIndex').value  = '-1';
  document.getElementById('rollNumber').value = '';
  document.getElementById('teacher').value    = '';
  document.getElementById('admissionDate').value = todayISO();
  openModal('studentModal');
  setTimeout(() => document.getElementById('studentName').focus(), 200);
}

function openEditModal(index) {
  const students = getStudents();
  const s = students[index];
  if (!s) return;

  document.getElementById('modalTitle').innerHTML = '<i class="fas fa-user-edit"></i> Edit Student';
  document.getElementById('editIndex').value    = index;
  document.getElementById('studentName').value  = s.studentName;
  document.getElementById('fatherName').value   = s.fatherName;
  document.getElementById('gender').value       = s.gender;
  document.getElementById('mobile').value       = s.mobile;
  document.getElementById('course').value       = s.courseCode;
  document.getElementById('teacher').value      = s.teacher;
  document.getElementById('rollNumber').value   = s.rollNumber;
  document.getElementById('monthlyFee').value   = s.monthlyFee;
  document.getElementById('admissionDate').value = s.admissionDate || '';

  openModal('studentModal');
}

function closeStudentModal() {
  closeModal('studentModal');
}

function openDeleteConfirm(index) {
  const students = getStudents();
  const s = students[index];
  if (!s) return;
  deleteTargetIndex = index;
  document.getElementById('deleteStudentName').textContent = s.studentName;
  openModal('confirmModal');
}

/* ── Course → Teacher auto-assign ───────────────────────── */
function onCourseChange() {
  const code = document.getElementById('course').value;
  const teacherEl = document.getElementById('teacher');
  const feeEl     = document.getElementById('monthlyFee');

  if (code && COURSES[code]) {
    teacherEl.value = COURSES[code].teacher;
    feeEl.value     = COURSES[code].fee;
    // Preview roll number for new students
    const editIdx = parseInt(document.getElementById('editIndex').value);
    if (editIdx === -1) {
      const students = getStudents();
      const existing = students.filter(s => s.courseCode === code);
      const next     = String(existing.length + 1).padStart(3, '0');
      document.getElementById('rollNumber').value = `${code}-${next} (preview)`;
    }
  } else {
    teacherEl.value = '';
  }
}

/* ── Save Student ────────────────────────────────────────── */
function saveStudent() {
  const editIndex = parseInt(document.getElementById('editIndex').value);
  const name  = document.getElementById('studentName').value.trim();
  const father= document.getElementById('fatherName').value.trim();
  const gender= document.getElementById('gender').value;
  const mobile= document.getElementById('mobile').value.trim();
  const code  = document.getElementById('course').value;
  const fee   = document.getElementById('monthlyFee').value;
  const date  = document.getElementById('admissionDate').value;

  // Validation
  if (!name || !father || !gender || !mobile || !code || !fee || !date) {
    showToast('Validation Error', 'Please fill in all required fields.', 'error');
    return;
  }

  const course = COURSES[code];
  const students = getStudents();

  if (editIndex === -1) {
    // NEW student
    const rollNumber = generateRollNumber(code);
    const student = {
      rollNumber,
      studentName: name,
      fatherName: father,
      gender,
      mobile,
      courseCode: code,
      courseName: course.name,
      teacher: course.teacher,
      monthlyFee: parseFloat(fee),
      admissionDate: date
    };
    students.push(student);
    saveStudents(students);
    showToast('Student Added', `${name} enrolled with Roll No. ${rollNumber}`, 'success');
  } else {
    // EDIT student
    const existing = students[editIndex];
    existing.studentName  = name;
    existing.fatherName   = father;
    existing.gender       = gender;
    existing.mobile       = mobile;
    existing.courseCode   = code;
    existing.courseName   = course.name;
    existing.teacher      = course.teacher;
    existing.monthlyFee   = parseFloat(fee);
    existing.admissionDate = date;
    students[editIndex]   = existing;
    saveStudents(students);
    showToast('Student Updated', `${name}'s record has been updated.`, 'info');
  }

  closeStudentModal();
  renderStudentsTable();
}

/* ── Delete Student ──────────────────────────────────────── */
function confirmDelete() {
  if (deleteTargetIndex === -1) return;
  const students = getStudents();
  const s = students[deleteTargetIndex];
  students.splice(deleteTargetIndex, 1);
  saveStudents(students);
  closeModal('confirmModal');
  deleteTargetIndex = -1;
  renderStudentsTable();
  showToast('Student Deleted', `${s.studentName} has been removed.`, 'error');
}

function escHtml(str) {
  const d = document.createElement('div');
  d.textContent = str || '';
  return d.innerHTML;
}
