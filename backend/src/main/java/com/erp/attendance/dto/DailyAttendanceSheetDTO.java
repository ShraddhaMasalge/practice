package com.erp.attendance.dto;

import com.erp.attendance.model.AttendanceStatus;

public class DailyAttendanceSheetDTO {

    private Long studentId;
    private String rollNumber;
    private String name;
    private String email;
    private String className;
    private String section;
    private String course;
    private Long attendanceId;
    private AttendanceStatus status;
    private String remarks;

    public DailyAttendanceSheetDTO() {}

    public DailyAttendanceSheetDTO(Long studentId, String rollNumber, String name, String email, 
                                   String className, String section, String course, 
                                   Long attendanceId, AttendanceStatus status, String remarks) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.className = className;
        this.section = section;
        this.course = course;
        this.attendanceId = attendanceId;
        this.status = status;
        this.remarks = remarks;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }

    public Long getAttendanceId() { return attendanceId; }
    public void setAttendanceId(Long attendanceId) { this.attendanceId = attendanceId; }

    public AttendanceStatus getStatus() { return status; }
    public void setStatus(AttendanceStatus status) { this.status = status; }

    public String getRemarks() { return remarks; }
    public void setRemarks(String remarks) { this.remarks = remarks; }
}
