package com.erp.attendance.service;

import com.erp.attendance.dto.*;
import com.erp.attendance.model.Attendance;
import com.erp.attendance.model.AttendanceStatus;
import com.erp.attendance.model.Student;
import com.erp.attendance.repository.AttendanceRepository;
import com.erp.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;
    private final StudentRepository studentRepository;

    @Autowired
    public AttendanceService(AttendanceRepository attendanceRepository, StudentRepository studentRepository) {
        this.attendanceRepository = attendanceRepository;
        this.studentRepository = studentRepository;
    }

    /**
     * Get Daily Attendance Sheet for the given date, optionally filtered by class and section.
     */
    public List<DailyAttendanceSheetDTO> getDailyAttendanceSheet(LocalDate date, String className, String section) {
        List<Student> students;
        if (className != null && !className.trim().isEmpty() && section != null && !section.trim().isEmpty()) {
            students = studentRepository.findByClassNameAndSectionOrderByNameAsc(className.trim(), section.trim());
        } else if (className != null && !className.trim().isEmpty()) {
            students = studentRepository.findByClassNameOrderByNameAsc(className.trim());
        } else {
            students = studentRepository.findAll();
            students.sort(Comparator.comparing(Student::getClassName).thenComparing(Student::getRollNumber));
        }

        // Fetch existing attendance records for that day
        List<Attendance> existingAttendances = attendanceRepository.findByAttendanceDate(date);
        Map<Long, Attendance> attendanceMap = existingAttendances.stream()
                .collect(Collectors.toMap(a -> a.getStudent().getId(), a -> a, (a1, a2) -> a1));

        List<DailyAttendanceSheetDTO> sheet = new ArrayList<>();
        for (Student s : students) {
            DailyAttendanceSheetDTO row = new DailyAttendanceSheetDTO();
            row.setStudentId(s.getId());
            row.setRollNumber(s.getRollNumber());
            row.setName(s.getName());
            row.setEmail(s.getEmail());
            row.setClassName(s.getClassName());
            row.setSection(s.getSection());
            row.setCourse(s.getCourse());

            Attendance recorded = attendanceMap.get(s.getId());
            if (recorded != null) {
                row.setAttendanceId(recorded.getId());
                row.setStatus(recorded.getStatus());
                row.setRemarks(recorded.getRemarks());
            } else {
                row.setStatus(null); // Not marked yet
                row.setRemarks("");
            }
            sheet.add(row);
        }

        return sheet;
    }

    /**
     * Record single student attendance (create or update).
     */
    public Attendance recordSingleAttendance(LocalDate date, AttendanceEntryDTO entry, String recordedBy) {
        Student student = studentRepository.findById(entry.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + entry.getStudentId()));

        Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndAttendanceDate(student.getId(), date);

        Attendance attendance;
        if (existingOpt.isPresent()) {
            attendance = existingOpt.get();
            attendance.setStatus(entry.getStatus());
            attendance.setRemarks(entry.getRemarks());
            if (recordedBy != null && !recordedBy.trim().isEmpty()) {
                attendance.setRecordedBy(recordedBy.trim());
            }
        } else {
            attendance = new Attendance(student, date, entry.getStatus(), entry.getRemarks(), recordedBy);
        }

        return attendanceRepository.save(attendance);
    }

    /**
     * Bulk save daily attendance entries into the database.
     */
    public Map<String, Object> saveBulkAttendance(BulkAttendanceRequest request) {
        LocalDate date = request.getDate();
        String recorder = request.getRecordedBy() != null ? request.getRecordedBy() : "ERP System";

        int createdCount = 0;
        int updatedCount = 0;

        for (AttendanceEntryDTO entry : request.getEntries()) {
            Optional<Student> studentOpt = studentRepository.findById(entry.getStudentId());
            if (studentOpt.isEmpty()) {
                continue;
            }
            Student student = studentOpt.get();

            Optional<Attendance> existingOpt = attendanceRepository.findByStudentIdAndAttendanceDate(student.getId(), date);
            if (existingOpt.isPresent()) {
                Attendance existing = existingOpt.get();
                existing.setStatus(entry.getStatus());
                existing.setRemarks(entry.getRemarks());
                existing.setRecordedBy(recorder);
                attendanceRepository.save(existing);
                updatedCount++;
            } else {
                Attendance newAttendance = new Attendance(student, date, entry.getStatus(), entry.getRemarks(), recorder);
                attendanceRepository.save(newAttendance);
                createdCount++;
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("date", date);
        response.put("savedTotal", createdCount + updatedCount);
        response.put("created", createdCount);
        response.put("updated", updatedCount);
        response.put("message", "Daily attendance successfully recorded in database.");
        return response;
    }

    /**
     * Get Daily Attendance Summary & KPIs for Dashboard.
     */
    public AttendanceSummaryDTO getAttendanceSummary(LocalDate date) {
        long totalStudents = studentRepository.count();
        long presentCount = attendanceRepository.countByAttendanceDateAndStatus(date, AttendanceStatus.PRESENT);
        long absentCount = attendanceRepository.countByAttendanceDateAndStatus(date, AttendanceStatus.ABSENT);
        long lateCount = attendanceRepository.countByAttendanceDateAndStatus(date, AttendanceStatus.LATE);
        long excusedCount = attendanceRepository.countByAttendanceDateAndStatus(date, AttendanceStatus.EXCUSED);

        long markedTotal = presentCount + absentCount + lateCount + excusedCount;
        long unmarkedCount = Math.max(0, totalStudents - markedTotal);

        double percentage = 0.0;
        if (markedTotal > 0) {
            // Present + Late count towards presence
            percentage = Math.round(((double) (presentCount + lateCount) / markedTotal) * 1000.0) / 10.0;
        }

        return new AttendanceSummaryDTO(date, totalStudents, presentCount, absentCount, lateCount, excusedCount, unmarkedCount, percentage);
    }

    /**
     * Get Student-wise Attendance Report over a date range.
     */
    public List<StudentReportDTO> getStudentsReport(String className, LocalDate startDate, LocalDate endDate) {
        List<Student> students;
        if (className != null && !className.trim().isEmpty()) {
            students = studentRepository.findByClassNameOrderByNameAsc(className.trim());
        } else {
            students = studentRepository.findAll();
        }

        List<StudentReportDTO> reports = new ArrayList<>();

        for (Student s : students) {
            List<Attendance> records;
            if (startDate != null && endDate != null) {
                records = attendanceRepository.findByStudentIdAndAttendanceDateBetweenOrderByAttendanceDateAsc(s.getId(), startDate, endDate);
            } else {
                records = attendanceRepository.findByStudentIdOrderByAttendanceDateDesc(s.getId());
            }

            long totalDays = records.size();
            long presentDays = records.stream().filter(r -> r.getStatus() == AttendanceStatus.PRESENT).count();
            long absentDays = records.stream().filter(r -> r.getStatus() == AttendanceStatus.ABSENT).count();
            long lateDays = records.stream().filter(r -> r.getStatus() == AttendanceStatus.LATE).count();
            long excusedDays = records.stream().filter(r -> r.getStatus() == AttendanceStatus.EXCUSED).count();

            double percentage = 0.0;
            if (totalDays > 0) {
                percentage = Math.round(((double) (presentDays + lateDays) / totalDays) * 1000.0) / 10.0;
            }

            boolean isShort = totalDays > 0 && percentage < 75.0;

            reports.add(new StudentReportDTO(
                    s.getId(), s.getRollNumber(), s.getName(), s.getClassName(), s.getSection(),
                    totalDays, presentDays, absentDays, lateDays, excusedDays, percentage, isShort
            ));
        }

        return reports;
    }
}
