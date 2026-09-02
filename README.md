# 🎓 Student Attendance ERP System

A full-stack **Enterprise Resource Planning (ERP)** web application for schools, colleges, and educational institutes to manage students and record **daily present/absent attendance directly into a database**.

Built using the architecture and multi-tier structure of [EasyCRUD](https://github.com/IamPaimon/EasyCRUD.git) as a reference, transformed and elevated into a comprehensive attendance ERP platform.

---

## 🌟 Key Features

### 1. 📋 Daily Attendance Entry (Core Functionality)
- **Interactive Attendance Sheet**: Select any date and filter by **Class** and **Section**.
- **1-Click Batch Actions**:
  - `✓ Mark All Present` — Mark the entire class present with one click.
  - `✗ Mark All Absent` — Fast absentee handling.
  - `↺ Reset` — Reset status selections.
- **Detailed Status Toggles**: Per-student toggle buttons for **Present** (Green), **Absent** (Red), **Late** (Amber), and **Excused** (Blue).
- **Remarks & Notes**: Add reason for absence (e.g., *fever*, *bus delay*, *doctor appointment*).
- **Live Counter Banner**: Live breakdown of total students, present count, absent count, late count, and current attendance rate (%).
- **Database Persistence**: Click **Save Attendance to Database** to persist records. Re-submitting on the same date safely updates the record without duplicate errors.

### 2. 📊 ERP Analytics Dashboard
- **Live KPI Metrics**: Total Enrolled Students, Present Today, Absent Today, and Institutional Attendance Rate.
- **Attendance Breakdown Bar**: Visual multi-segment progress bar representing real-time presence distribution.
- **Today's Absentee List**: Real-time list of absent students with emergency parent contact info for immediate follow-up.

### 3. 👥 Student Directory & Management (CRUD)
- Register new students with:
  - Roll Number (unique identifier, e.g. `STU-101`)
  - Full Name, Email
  - Class / Grade & Section (e.g. `Class 10 - A`, `Class 11 - CS`)
  - Course / Stream (e.g. `Computer Science`, `General Science`, `Commerce`)
  - Student Contact Phone & Parent / Guardian Contact
  - Gender & Active / Inactive Status
- Search by student name, roll number, or email.
- Edit and Delete student records with cascading attendance cleanup.

### 4. 📈 Attendance Reports & Analytics
- Calculate student-wise attendance percentages over custom date ranges.
- **Low-Attendance Warning System**: Automatically flags students with **< 75%** attendance with a `⚠ Shortage (<75%)` badge.
- **CSV Export**: Export filtered attendance records into `.csv` spreadsheets with a single click.

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 18, Vite, CSS3 | Clean, modern ERP dashboard interface |
| **Backend** | Spring Boot 3.3.5, Java 17 | RESTful API controllers, services, repositories |
| **Persistence** | Spring Data JPA, Hibernate | ORM mapping with automated schema updates |
| **Database** | MariaDB / MySQL & H2 | MariaDB for Docker/Production, Embedded H2 for zero-config local run |
| **DevOps** | Docker, Docker Compose | Multi-stage Dockerfiles and container orchestration |

---

## 📁 Project Structure

```
StudentAttendanceERP/
├── backend/
│   ├── src/main/java/com/erp/attendance/
│   │   ├── StudentAttendanceErpApplication.java
│   │   ├── config/
│   │   │   ├── WebConfig.java             # Permissive CORS configuration
│   │   │   └── DataInitializer.java       # Automatic student & attendance seeder
│   │   ├── controller/
│   │   │   ├── StudentController.java     # /api/students endpoints
│   │   │   └── AttendanceController.java  # /api/attendance endpoints
│   │   ├── dto/
│   │   │   ├── AttendanceEntryDTO.java
│   │   │   ├── BulkAttendanceRequest.java
│   │   │   ├── DailyAttendanceSheetDTO.java
│   │   │   └── AttendanceSummaryDTO.java
│   │   ├── model/
│   │   │   ├── Student.java               # Student Entity (Mapped to `students`)
│   │   │   ├── Attendance.java            # Attendance Entity (Mapped to `attendance`)
│   │   │   └── AttendanceStatus.java      # PRESENT, ABSENT, LATE, EXCUSED
│   │   ├── repository/
│   │   │   ├── StudentRepository.java
│   │   │   └── AttendanceRepository.java
│   │   └── service/
│   │       ├── StudentService.java
│   │       └── AttendanceService.java
│   ├── src/main/resources/
│   │   ├── application.properties         # Default: H2 embedded DB + Console
│   │   └── application-mysql.properties   # MariaDB / MySQL profile
│   ├── pom.xml
│   ├── Dockerfile
│   └── mvnw / mvnw.cmd
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   ├── client.js                  # Axios configured instance
│   │   │   ├── studentService.js          # Student CRUD API calls
│   │   │   └── attendanceService.js       # Daily attendance & report API calls
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Toast.jsx
│   │   ├── views/
│   │   │   ├── DailyAttendanceView.jsx    # Core Daily Present/Absent entry UI
│   │   │   ├── DashboardView.jsx          # KPI cards & attendance progress
│   │   │   ├── StudentsView.jsx           # Student Directory & Registration
│   │   │   └── ReportsView.jsx            # Attendance analytics & CSV export
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── db/
│   └── init.sql                           # MariaDB/MySQL table schema and seeds
├── preview/
│   └── index.html                         # Zero-dependency interactive web client
├── compose.yml                            # Complete MariaDB + Backend + Frontend stack
└── README.md
```

---

## 🚀 How to Run the Project

### Option 1: Instant Standalone Preview (No Java / Node Needed)
If you want to immediately see and interact with the ERP application:
1. Navigate to:
   ```
   StudentAttendanceERP/preview/index.html
   ```
2. Double-click to open it in your browser (Chrome, Edge, Firefox).
3. You can mark attendance, filter classes, view dashboard metrics, add students, and export CSV reports immediately!

---

### Option 2: Docker Compose (One-Command Full-Stack Setup)
Make sure Docker Desktop is installed and running:

```powershell
cd C:\Users\Shraddha\.gemini\antigravity\scratch\StudentAttendanceERP
docker compose up --build
```

- **Frontend ERP Web App**: `http://localhost` (Port 80)
- **Backend REST API**: `http://localhost:8080/api`
- **MariaDB Database**: `localhost:3306` (Database: `attendance_erp`, User: `root`, Password: `admin`)

---

### Option 3: Run Locally (Standard Development)

#### 1. Backend (Spring Boot):
```powershell
cd C:\Users\Shraddha\.gemini\antigravity\scratch\StudentAttendanceERP\backend

# Run with embedded H2 database (Zero setup, includes sample students & logs)
.\mvnw spring-boot:run

# Or run with MariaDB:
.\mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
```
- Backend starts at `http://localhost:8080`
- Embedded H2 Console: `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:file:./data/attendance_erp_db`, User: `sa`, Password: `[blank]`)

#### 2. Frontend (React + Vite):
```powershell
cd C:\Users\Shraddha\.gemini\antigravity\scratch\StudentAttendanceERP\frontend
npm install
npm run dev
```
- Frontend starts at `http://localhost:5173`

---

## 🗄️ Database Schema & Relational Design

```sql
-- Students Table
CREATE TABLE students (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    roll_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    class_name VARCHAR(50) NOT NULL,
    section VARCHAR(20) NOT NULL,
    course VARCHAR(100),
    gender VARCHAR(20),
    contact_number VARCHAR(20),
    parent_contact VARCHAR(20),
    status VARCHAR(20) DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_class_sec (class_name, section)
);

-- Daily Attendance Table
CREATE TABLE attendance (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    student_id BIGINT NOT NULL,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PRESENT', 'ABSENT', 'LATE', 'EXCUSED'
    remarks VARCHAR(255),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    recorded_by VARCHAR(100) DEFAULT 'ERP Admin',
    CONSTRAINT fk_student_att FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uk_student_date UNIQUE (student_id, attendance_date),
    INDEX idx_att_date (attendance_date)
);
```

---

## 📡 REST API Reference

### 🧑‍🎓 Student Endpoints (`/api/students`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all students (Supports query params: `className`, `section`, `query`) |
| `GET` | `/api/students/{id}` | Get student profile by ID |
| `POST` | `/api/students` | Register a new student |
| `PUT` | `/api/students/{id}` | Update existing student information |
| `DELETE` | `/api/students/{id}` | Delete student record |
| `GET` | `/api/students/classes` | Fetch distinct list of available classes |
| `GET` | `/api/students/sections?className=...` | Fetch distinct sections for a class |

### 📝 Attendance Endpoints (`/api/attendance`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/attendance/sheet?date=YYYY-MM-DD&className=...&section=...` | Get daily attendance roster with marked status |
| `POST` | `/api/attendance/bulk` | Bulk save daily attendance entries into the database |
| `POST` | `/api/attendance/single?date=YYYY-MM-DD` | Record single student attendance |
| `GET` | `/api/attendance/summary?date=YYYY-MM-DD` | Get today's KPI metrics for dashboard |
| `GET` | `/api/attendance/report?className=...&startDate=...&endDate=...` | Get aggregated student attendance percentage report |

#### Sample Bulk Attendance JSON Request:
```json
POST /api/attendance/bulk
Content-Type: application/json

{
  "date": "2026-09-03",
  "recordedBy": "Prof. Admin",
  "entries": [
    { "studentId": 1, "status": "PRESENT", "remarks": "On time" },
    { "studentId": 2, "status": "ABSENT", "remarks": "Medical leave - doctor note" },
    { "studentId": 3, "status": "LATE", "remarks": "Delayed by bus 15 mins" }
  ]
}
```

---

## 💡 Differences & Upgrades Compared to Reference Repository (EasyCRUD)

1. **Enterprise Scope**: EasyCRUD was a basic single-page student registration form with a read modal. This project is a complete **Institutional Attendance ERP** system.
2. **Daily Attendance Workflow**: Full UI and backend for daily roll calls with batch operations ("Mark All Present", "Mark All Absent"), per-student Present / Absent / Late / Excused toggles, and customizable remarks.
3. **Relational Database Model**: Adds relational foreign keys and a `UNIQUE(student_id, attendance_date)` constraint for idempotent daily entries.
4. **Institutional Analytics**: Automatically computes daily attendance rates, tracks today's absentees with emergency contact details, and calculates student-by-student attendance percentages over custom date ranges.
5. **Shortage Warning**: Automatically identifies and highlights students falling below the 75% attendance threshold.
6. **Zero-Setup Compatibility**: Supports both MariaDB (like EasyCRUD) and embedded H2 with pre-seeded data, plus an interactive standalone preview that runs immediately in any browser.
