// ============================================================
// IQRA Academy – Demo Data Seeder
// Populates 10 students per course (60 total) with
// attendance records (last 14 days) and fee data.
// Runs only once – skips if data already exists.
// ============================================================

(function seedDemoData() {

  // Skip if students already exist
  const existing = JSON.parse(localStorage.getItem('iqra_students') || '[]');
  if (existing.length > 0) return;

  /* ── Pakistani Student Names Pool ───────────────────────── */
  const maleStudents = [
    { name: 'Muhammad Ali',      father: 'Muhammad Akbar' },
    { name: 'Ahmed Hassan',      father: 'Hassan Raza' },
    { name: 'Abdullah Khan',     father: 'Imran Khan' },
    { name: 'Usman Tariq',       father: 'Tariq Mehmood' },
    { name: 'Bilal Hussain',     father: 'Ghulam Hussain' },
    { name: 'Zain ul Abideen',   father: 'Abideen Shah' },
    { name: 'Hamza Nawaz',       father: 'Nawaz Sharif' },
    { name: 'Faisal Mahmood',    father: 'Mahmood Akhtar' },
    { name: 'Saad Iqbal',        father: 'Iqbal Ahmed' },
    { name: 'Asad Rehman',       father: 'Habib ur Rehman' },
    { name: 'Omar Farooq',       father: 'Farooq Ahmed' },
    { name: 'Rizwan Haider',     father: 'Haider Ali' },
    { name: 'Kamran Javed',      father: 'Javed Iqbal' },
    { name: 'Shoaib Akhtar',     father: 'Akhtar Hussain' },
    { name: 'Waqas Malik',       father: 'Malik Aslam' },
    { name: 'Talha Siddiqui',    father: 'Siddiqui Sahib' },
    { name: 'Daniyal Butt',      father: 'Butt Sahib' },
    { name: 'Aqib Javed',        father: 'Javed Miandad' },
    { name: 'Salman Baig',       father: 'Baig Sahib' },
    { name: 'Farhan Qureshi',    father: 'Qureshi Sahib' },
    { name: 'Junaid Naeem',      father: 'Naeem Akhtar' },
    { name: 'Khurram Shehzad',   father: 'Shehzad Ahmed' },
    { name: 'Shahid Afridi',     father: 'Afridi Khan' },
    { name: 'Noman Khalid',      father: 'Khalid Latif' },
    { name: 'Adnan Siddiqui',    father: 'Siddiqui Ahmed' },
    { name: 'Wasim Akram',       father: 'Akram Khan' },
    { name: 'Imran Nazir',       father: 'Nazir Ahmed' },
    { name: 'Zubair Ansari',     father: 'Ansari Sahib' },
    { name: 'Yasir Shah',        father: 'Shah Sahib' },
    { name: 'Babar Azam',        father: 'Azam Khan' }
  ];

  const femaleStudents = [
    { name: 'Fatima Zahra',      father: 'Zahra ul Islam' },
    { name: 'Ayesha Siddiqui',   father: 'Siddiqui Sahib' },
    { name: 'Zainab Hussain',    father: 'Hussain Ahmed' },
    { name: 'Maryam Nawaz',      father: 'Nawaz Ahmed' },
    { name: 'Sana Mirza',        father: 'Mirza Sahib' },
    { name: 'Hira Baig',         father: 'Baig Sahib' },
    { name: 'Iqra Malik',        father: 'Malik Sahib' },
    { name: 'Nadia Khan',        father: 'Khan Sahib' },
    { name: 'Asma Akhtar',       father: 'Akhtar Sahib' },
    { name: 'Rabia Tariq',       father: 'Tariq Sahib' },
    { name: 'Sadia Rehman',      father: 'Rehman Sahib' },
    { name: 'Bushra Qureshi',    father: 'Qureshi Sahib' },
    { name: 'Maham Raza',        father: 'Raza Sahib' },
    { name: 'Komal Ansari',      father: 'Ansari Sahib' },
    { name: 'Aliza Sheikh',      father: 'Sheikh Sahib' }
  ];

  /* ── Gender & Name Assignment Pattern per course ─────────── */
  // Each course: 6 male + 4 female (varied mix)
  const courseMixes = {
    ENG: [0,1,2,3,0,1,0,1,2,3],   // 0=male, 1=male, 2=male, 3=male, then female indices
    PHY: [0,1,2,3,4,5,0,1,2,3],
    CHE: [4,5,6,7,0,1,2,3,4,5],
    MAT: [6,7,8,9,2,3,4,5,6,7],
    BIO: [10,11,12,13,14,6,7,8,9,10],
    CIT: [15,16,17,18,8,9,10,11,12,13]
  };

  // Female indices per course (4 female out of 10)
  const femaleSlots = {
    ENG: [3,5,7,9],
    PHY: [2,4,7,9],
    CHE: [1,3,6,8],
    MAT: [0,4,6,8],
    BIO: [2,5,7,9],
    CIT: [1,3,8,9]
  };

  /* ── Mobile Number Generator ─────────────────────────────── */
  const mobilePrefixes = ['0300','0301','0302','0303','0311','0312','0313','0321','0322','0333'];
  function genMobile(seed) {
    const prefix = mobilePrefixes[seed % mobilePrefixes.length];
    const num    = String(1000000 + (seed * 7919) % 9000000);
    return `${prefix}-${num}`;
  }

  /* ── Admission Dates (spread over last 8 months) ─────────── */
  const admissionDates = [
    '2025-10-01','2025-10-05','2025-10-10','2025-10-15',
    '2025-11-01','2025-11-08','2025-11-15','2025-11-22',
    '2025-12-01','2025-12-10','2026-01-05','2026-01-15',
    '2026-02-01','2026-02-10','2026-03-01','2026-03-15',
    '2026-04-01','2026-04-10','2026-05-01','2026-05-15',
    '2026-06-01','2026-06-05','2026-06-08','2026-06-10'
  ];

  /* ── Course Config ───────────────────────────────────────── */
  const courseConfig = {
    ENG: { name: 'English',                         teacher: 'Sir Khalid Mehmood Soomro', fee: 1500 },
    PHY: { name: 'Physics',                         teacher: 'Sir Mashooque',             fee: 1800 },
    CHE: { name: 'Chemistry',                       teacher: 'Sir Zaheer Abbas',           fee: 1800 },
    MAT: { name: 'Mathematics',                     teacher: 'Sir Mazhar Baloch',          fee: 1800 },
    BIO: { name: 'Biology',                         teacher: 'Sir Muneer Ahmed Shaikh',    fee: 1800 },
    CIT: { name: 'Computer Information Technology', teacher: 'Sir Muhammad Ali Shaikh',   fee: 2000 }
  };

  /* ── Build Students ──────────────────────────────────────── */
  const students = [];
  let maleIdx   = 0;
  let femaleIdx = 0;
  let dateIdx   = 0;
  let mobileIdx = 1;

  Object.keys(courseConfig).forEach(code => {
    const cfg  = courseConfig[code];
    const fem  = femaleSlots[code];

    for (let i = 0; i < 10; i++) {
      const isFemale = fem.includes(i);
      let person;
      if (isFemale) {
        person = femaleStudents[femaleIdx % femaleStudents.length];
        femaleIdx++;
      } else {
        person = maleStudents[maleIdx % maleStudents.length];
        maleIdx++;
      }

      const rollNum = String(i + 1).padStart(3, '0');
      // Set counter
      localStorage.setItem(`iqra_counter_${code}`, i + 1);

      students.push({
        rollNumber:    `${code}-${rollNum}`,
        studentName:   person.name,
        fatherName:    person.father,
        gender:        isFemale ? 'Female' : 'Male',
        mobile:        genMobile(mobileIdx++),
        courseCode:    code,
        courseName:    cfg.name,
        teacher:       cfg.teacher,
        monthlyFee:    cfg.fee,
        admissionDate: admissionDates[dateIdx++ % admissionDates.length]
      });
    }
  });

  localStorage.setItem('iqra_students', JSON.stringify(students));

  /* ── Build Attendance (last 14 days) ─────────────────────── */
  const attendance = {};

  // Generate last 14 days (excluding weekends for realism)
  const pastDays = [];
  const today = new Date();
  for (let d = 14; d >= 1; d--) {
    const dt = new Date(today);
    dt.setDate(today.getDate() - d);
    const dayOfWeek = dt.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // skip Sunday (0) and Saturday (6)
      pastDays.push(dt.toISOString().split('T')[0]);
    }
  }

  // Attendance patterns per student (some students more regular than others)
  const attendanceProfiles = [
    [1,1,1,1,1,1,1,1,1,1],  // 100% – excellent
    [1,1,1,1,1,1,1,1,1,0],  // 90% – very good
    [1,1,1,1,1,1,1,0,1,0],  // 80% – good
    [1,1,1,0,1,1,1,1,0,1],  // 80%
    [1,1,1,1,0,1,1,0,1,1],  // 80%
    [1,0,1,1,1,0,1,1,1,0],  // 70%
    [1,1,0,1,0,1,1,0,1,0],  // 60%
    [0,1,1,0,1,0,1,1,0,1],  // 60%
    [1,0,0,1,1,0,1,0,0,1],  // 50%
    [1,1,0,0,1,1,0,0,1,0],  // 50%
  ];

  students.forEach((s, idx) => {
    const profile = attendanceProfiles[idx % attendanceProfiles.length];
    attendance[s.rollNumber] = {};

    pastDays.forEach((date, dayIdx) => {
      const patternIdx  = dayIdx % profile.length;
      const isPresent   = profile[patternIdx] === 1;
      attendance[s.rollNumber][date] = isPresent ? 'present' : 'absent';
    });
  });

  localStorage.setItem('iqra_attendance', JSON.stringify(attendance));

  /* ── Build Fee Data (current + last month) ───────────────── */
  const fees = {};
  const now  = new Date();

  const months = [
    `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,  // current
    `${now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear()}-${String(now.getMonth() === 0 ? 12 : now.getMonth()).padStart(2, '0')}` // last
  ];

  students.forEach((s, idx) => {
    fees[s.rollNumber] = {};
    // Last month: most paid
    fees[s.rollNumber][months[1]] = idx % 10 < 8 ? 'paid' : 'unpaid';
    // Current month: mixed
    fees[s.rollNumber][months[0]] = idx % 10 < 6 ? 'paid' : 'unpaid';
  });

  localStorage.setItem('iqra_fees', JSON.stringify(fees));

  console.log(`✅ IQRA Academy: Seeded ${students.length} students (${Object.keys(courseConfig).length} courses × 10) with attendance & fee data.`);

})();
