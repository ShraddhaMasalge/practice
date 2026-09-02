package com.erp.attendance.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "attendance",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_student_date", columnNames = {"student_id", "attendance_date"})
    },
    indexes = {
        @Index(name = "idx_attendance_date", columnList = "attendance_date"),
        @Index(name = "idx_student_id", columnList = "student_id")
    }
)
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AttendanceStatus status;

    @Column(length = 255)
    private String remarks;

    @Column(name = "recorded_at")
    private LocalDateTime recordedAt;

    @Column(name = "recorded_by", length = 100)
    private String recordedBy;

    @PrePersist
    @PreUpdate
    public void onSave() {
        this.recordedAt = LocalDateTime.now();
        if (this.recordedBy == null || this.recordedBy.trim().isEmpty()) {
            this.recordedBy = "ERP System / Teacher";
        }
    }

    public Attendance() {}

    public Attendance(Student student, LocalDate attendanceDate, AttendanceStatus status, String remarks, String recordedBy) {
        this.student = student;
        this.attendanceDate = attendanceDate;
        this.status = status;
        this.remarks = remarks;
        this.recordedBy = recordedBy;
        this.recordedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }

    public LocalDateTime getRecordedAt() { return recordedAt; }
    public void setRecordedAt(LocalDateTime recordedAt) { this.recordedAt = recordedAt; }

    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }
}
