package com.erp.attendance.config;

import com.erp.attendance.model.Attendance;
import com.erp.attendance.model.AttendanceStatus;
import com.erp.attendance.model.Student;
import com.erp.attendance.repository.AttendanceRepository;
import com.erp.attendance.repository.StudentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository studentRepository;
    private final AttendanceRepository attendanceRepository;

    public DataInitializer(StudentRepository studentRepository, AttendanceRepository attendanceRepository) {
        this.studentRepository = studentRepository;
        this.attendanceRepository = attendanceRepository;
    }

    @Override
    public void run(String... args) {
        if (studentRepository.count() > 0) {
            return; // Data already exists
        }

        System.out.println(">>> Initializing sample data for Student Attendance ERP...");

        // Create initial students
        List<Student> initialStudents = List.of(
            new Student(null, "STU-101", "Aarav Sharma", "aarav.sharma@example.com", "Class 10", "A", "General Science", "Male", "9876543210", "9876543200", "ACTIVE"),
            new Student(null, "STU-102", "Ananya Verma", "ananya.verma@example.com", "Class 10", "A", "General Science", "Female", "9876543211", "9876543201", "ACTIVE"),
            new Student(null, "STU-103", "Rohan Gupta", "rohan.gupta@example.com", "Class 10", "A", "General Science", "Male", "9876543212", "9876543202", "ACTIVE"),
            new Student(null, "STU-104", "Diya Patel", "diya.patel@example.com", "Class 10", "A", "General Science", "Female", "9876543213", "9876543203", "ACTIVE"),
            new Student(null, "STU-105", "Kabir Singh", "kabir.singh@example.com", "Class 10", "A", "General Science", "Male", "9876543214", "9876543204", "ACTIVE"),
            new Student(null, "STU-106", "Ishita Iyer", "ishita.iyer@example.com", "Class 10", "B", "Commerce", "Female", "9876543215", "9876543205", "ACTIVE"),
            new Student(null, "STU-107", "Vikram Malhotra", "vikram.m@example.com", "Class 10", "B", "Commerce", "Male", "9876543216", "9876543206", "ACTIVE"),
            new Student(null, "STU-108", "Meera Joshi", "meera.j@example.com", "Class 10", "B", "Commerce", "Female", "9876543217", "9876543207", "ACTIVE"),
            new Student(null, "STU-201", "Aditya Roy", "aditya.roy@example.com", "Class 11", "CS", "Computer Science", "Male", "9876543218", "9876543208", "ACTIVE"),
            new Student(null, "STU-202", "Sneha Kulkarni", "sneha.k@example.com", "Class 11", "CS", "Computer Science", "Female", "9876543219", "9876543209", "ACTIVE"),
            new Student(null, "STU-203", "Karan Mehta", "karan.m@example.com", "Class 11", "CS", "Computer Science", "Male", "9876543220", "9876543210", "ACTIVE"),
            new Student(null, "STU-204", "Pooja Hegde", "pooja.h@example.com", "Class 11", "CS", "Computer Science", "Female", "9876543221", "9876543211", "ACTIVE")
        );

        List<Student> savedStudents = studentRepository.saveAll(initialStudents);

        // Seed some past attendance records
        LocalDate yesterday = LocalDate.now().minusDays(1);
        LocalDate twoDaysAgo = LocalDate.now().minusDays(2);
        String recorder = "Prof. Admin";

        // Seed yesterday's attendance for Class 10A
        attendanceRepository.save(new Attendance(savedStudents.get(0), yesterday, AttendanceStatus.PRESENT, "On time", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(1), yesterday, AttendanceStatus.PRESENT, "On time", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(2), yesterday, AttendanceStatus.ABSENT, "Sick leave", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(3), yesterday, AttendanceStatus.PRESENT, "On time", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(4), yesterday, AttendanceStatus.LATE, "Bus delay (15 min)", recorder));

        // Seed two days ago attendance for Class 10A
        attendanceRepository.save(new Attendance(savedStudents.get(0), twoDaysAgo, AttendanceStatus.PRESENT, "", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(1), twoDaysAgo, AttendanceStatus.PRESENT, "", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(2), twoDaysAgo, AttendanceStatus.PRESENT, "", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(3), twoDaysAgo, AttendanceStatus.ABSENT, "Family function", recorder));
        attendanceRepository.save(new Attendance(savedStudents.get(4), twoDaysAgo, AttendanceStatus.PRESENT, "", recorder));

        System.out.println(">>> Sample data seeded successfully: " + savedStudents.size() + " students created.");
    }
}
