-- =========================================================
-- Student Attendance ERP - MariaDB / MySQL Initialization
-- =========================================================

CREATE DATABASE IF NOT EXISTS attendance_erp;
USE attendance_erp;

-- Table: students
CREATE TABLE IF NOT EXISTS students (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Table: attendance
CREATE TABLE IF NOT EXISTS attendance (
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =========================================================
-- Initial Sample Data
-- =========================================================

INSERT IGNORE INTO students (id, roll_number, name, email, class_name, section, course, gender, contact_number, parent_contact, status) VALUES
(1, 'STU-101', 'Aarav Sharma', 'aarav.sharma@example.com', 'Class 10', 'A', 'General Science', 'Male', '9876543210', '9876543200', 'ACTIVE'),
(2, 'STU-102', 'Ananya Verma', 'ananya.verma@example.com', 'Class 10', 'A', 'General Science', 'Female', '9876543211', '9876543201', 'ACTIVE'),
(3, 'STU-103', 'Rohan Gupta', 'rohan.gupta@example.com', 'Class 10', 'A', 'General Science', 'Male', '9876543212', '9876543202', 'ACTIVE'),
(4, 'STU-104', 'Diya Patel', 'diya.patel@example.com', 'Class 10', 'A', 'General Science', 'Female', '9876543213', '9876543203', 'ACTIVE'),
(5, 'STU-105', 'Kabir Singh', 'kabir.singh@example.com', 'Class 10', 'A', 'General Science', 'Male', '9876543214', '9876543204', 'ACTIVE'),
(6, 'STU-106', 'Ishita Iyer', 'ishita.iyer@example.com', 'Class 10', 'B', 'Commerce', 'Female', '9876543215', '9876543205', 'ACTIVE'),
(7, 'STU-107', 'Vikram Malhotra', 'vikram.m@example.com', 'Class 10', 'B', 'Commerce', 'Male', '9876543216', '9876543206', 'ACTIVE'),
(8, 'STU-108', 'Meera Joshi', 'meera.j@example.com', 'Class 10', 'B', 'Commerce', 'Female', '9876543217', '9876543207', 'ACTIVE'),
(9, 'STU-201', 'Aditya Roy', 'aditya.roy@example.com', 'Class 11', 'CS', 'Computer Science', 'Male', '9876543218', '9876543208', 'ACTIVE'),
(10, 'STU-202', 'Sneha Kulkarni', 'sneha.k@example.com', 'Class 11', 'CS', 'Computer Science', 'Female', '9876543219', '9876543209', 'ACTIVE'),
(11, 'STU-203', 'Karan Mehta', 'karan.m@example.com', 'Class 11', 'CS', 'Computer Science', 'Male', '9876543220', '9876543210', 'ACTIVE'),
(12, 'STU-204', 'Pooja Hegde', 'pooja.h@example.com', 'Class 11', 'CS', 'Computer Science', 'Female', '9876543221', '9876543211', 'ACTIVE');

-- Sample Attendance for past dates
INSERT IGNORE INTO attendance (student_id, attendance_date, status, remarks, recorded_by) VALUES
(1, CURDATE(), 'PRESENT', 'On time', 'ERP Admin'),
(2, CURDATE(), 'PRESENT', 'On time', 'ERP Admin'),
(3, CURDATE(), 'ABSENT', 'Fever & Cold', 'ERP Admin'),
(4, CURDATE(), 'PRESENT', 'On time', 'ERP Admin'),
(5, CURDATE(), 'LATE', 'Late by 10 mins', 'ERP Admin');
