# IQRA Academy Student Management System

<div align="center">

![IQRA Academy](https://img.shields.io/badge/IQRA%20Academy-Management%20System-2563eb?style=for-the-badge&logo=graduation-cap)
![Version](https://img.shields.io/badge/Version-1.0.0-10b981?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-f59e0b?style=for-the-badge)

**Learn • Grow • Succeed**

A complete, professional ERP-style Student Management System built with pure HTML5, CSS3, and Vanilla JavaScript.

</div>

---

## 📋 Project Overview

IQRA Academy Management System is a fully functional, client-side web application for managing student enrollment, attendance tracking, and fee management at IQRA Academy. It requires no backend, database, or server — all data is persisted using the browser's **LocalStorage API**.

---

## ✨ Features

### 🔐 Authentication
- Secure login with session management via `sessionStorage`
- Route protection — all pages redirect to login if not authenticated
- Password change functionality from Settings page
- Auto-logout support

### 📊 Dashboard
- Real-time statistics cards (Total Students, Courses, Teachers, Present/Absent, Paid/Unpaid)
- Interactive charts powered by **Chart.js**:
  - Students per Course (Bar Chart)
  - Attendance Overview (Doughnut Chart)
  - Fee Status (Doughnut Chart)
- Recent Admissions table (latest 8 students)
- Live clock display

### 👨‍🎓 Student Management
- Full CRUD: Add, Edit, Delete students
- Real-time search by name, roll number, course, or teacher
- Filter by course and gender
- **Auto Roll Number Generation**: ENG-001, PHY-002, etc. (counters stored in LocalStorage, never repeat)
- **Auto Teacher Assignment** based on selected course
- Student fields: Name, Father Name, Gender, Mobile, Course, Teacher, Roll No., Monthly Fee, Admission Date

### 📅 Attendance Management
- Mark Present / Absent with a single click per student
- Toggle support — click same status to unmark
- Bulk "Mark All Present" / "Mark All Absent" actions
- Date picker for viewing/editing historical attendance
- Filter by course and search by name
- **Automatic attendance percentage calculation** per student
- Color-coded percentages (Green ≥75%, Orange ≥50%, Red <50%)

### 💰 Fee Management
- Monthly fee tracking per student
- **One-click toggle** (no save button needed) — auto-saves instantly
- Green row highlight for paid students
- Filter by month, course, and payment status
- Live statistics: Total Paid, Total Unpaid, Total Collection, Pending Amount

### ⚙️ Settings
- Toggle **Dark Mode** (preference saved to LocalStorage)
- **Change Admin Password** with validation
- System information panel
- **Danger Zone**: Clear all data with confirmation dialog

### 🎨 UI/UX
- Professional **Blue Theme** with glassmorphism cards
- Full **Dark Mode** support
- Responsive: Mobile, Tablet, Desktop
- Smooth animations and micro-interactions
- Toast notifications for all actions
- Font Awesome 6 icons throughout

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Page structure and semantics |
| CSS3 | Styling, animations, glassmorphism |
| Vanilla JavaScript (ES6+) | Logic, DOM manipulation |
| LocalStorage API | Data persistence |
| SessionStorage API | Login session management |
| Chart.js 4.4 | Interactive data charts |
| Font Awesome 6.5 | Icons |
| Google Fonts (Inter) | Typography |

---

## 📁 Project Structure

```
iqra-academy-management-system/
│
├── index.html              # Login page
├── dashboard.html          # Main dashboard
├── students.html           # Student management
├── attendance.html         # Attendance tracking
├── fees.html               # Fee management
├── settings.html           # System settings
│
├── README.md               # This file
│
├── report/
│   └── IQRA_Academy_Project_Report.pdf
│
├── css/
│   └── style.css           # Complete stylesheet (all pages)
│
├── js/
│   ├── auth.js             # Auth, layout, shared utilities
│   ├── dashboard.js        # Dashboard charts & stats
│   ├── students.js         # Student CRUD
│   ├── attendance.js       # Attendance marking
│   ├── fees.js             # Fee management
│   └── settings.js         # Settings & preferences
│
└── assets/
    ├── logo/
    ├── images/
    └── icons/
```

---

## 🚀 Installation & Setup

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- No server or installation required!

### Steps

1. **Download / Clone** the project folder:
   ```bash
   git clone <repository-url>
   cd iqra-academy-management-system
   ```

2. **Open the application**:
   - Simply double-click `index.html`, OR
   - Open it in your browser: `File → Open File → index.html`
   - Or use a local server (VS Code Live Server extension recommended)

3. **Login** with demo credentials:
   ```
   Username: admin
   Password: admin123
   ```

4. **Start using** the system — all data saves automatically!

---

## 📖 Usage Guide

### First-Time Setup
1. Open `index.html` in your browser
2. Login with `admin` / `admin123`
3. You'll be redirected to the **Dashboard**

### Adding Students
1. Navigate to **Students** from the sidebar
2. Click **"+ Add Student"**
3. Fill in the form — Teacher auto-assigns when you pick a Course
4. Roll Number is automatically generated
5. Click **"Save Student"**

### Marking Attendance
1. Navigate to **Attendance**
2. Select the date (defaults to today)
3. Click **🟢 Present** or **🔴 Absent** for each student
4. Click again on the same button to unmark
5. Use "Mark All Present/Absent" for bulk actions

### Managing Fees
1. Navigate to **Fee Management**
2. Select the month
3. Click the checkbox ☑️ next to a student's name to toggle paid/unpaid
4. No save button needed — changes are instant

### Changing Password
1. Navigate to **Settings**
2. Enter your current password
3. Enter and confirm new password
4. Click **"Update Password"**

### Enabling Dark Mode
1. Navigate to **Settings**, OR
2. Click the 🌙 icon in the navbar (any page)

---

## 🎓 Course Information

| Course | Code | Teacher |
|---|---|---|
| English | ENG | Sir Khalid Mehmood Soomro |
| Physics | PHY | Sir Mashooque |
| Chemistry | CHE | Sir Zaheer Abbas |
| Mathematics | MAT | Sir Mazhar Baloch |
| Biology | BIO | Sir Muneer Ahmed Shaikh |
| Computer Information Technology | CIT | Sir Muhammad Ali Shaikh |

---

## 💾 LocalStorage Schema

| Key | Data |
|---|---|
| `iqra_session` | Login session (sessionStorage) |
| `iqra_students` | Array of student objects |
| `iqra_attendance` | Object: `{rollNo: {date: 'present'/'absent'}}` |
| `iqra_fees` | Object: `{rollNo: {YYYY-MM: 'paid'/'unpaid'}}` |
| `iqra_settings` | Settings object `{darkMode: bool}` |
| `iqra_admin_password` | Hashed admin password |
| `iqra_counter_ENG` | Roll number counter per course |

---

## 🔮 Future Enhancements

- [ ] Export to PDF / Excel
- [ ] Student photo upload
- [ ] Email/SMS notifications
- [ ] Multi-admin support with roles
- [ ] Academic performance tracking
- [ ] Timetable management
- [ ] Certificate generation
- [ ] Parent portal

---

## 👨‍💻 Developer Notes

- All modules are decoupled and communicate via shared LocalStorage
- `auth.js` must be loaded on every page (it contains shared utilities)
- Roll number counters are never reset to ensure uniqueness
- Attendance percentages are calculated across all marked days

---

## 📄 License

MIT License — Free to use for educational and portfolio purposes.

---

<div align="center">
Made with ❤️ for IQRA Academy | Learn • Grow • Succeed
</div>
