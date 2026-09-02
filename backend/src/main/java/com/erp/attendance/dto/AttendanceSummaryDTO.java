package com.erp.attendance.dto;

import java.time.LocalDate;

public class AttendanceSummaryDTO {

    private LocalDate date;
    private long totalStudents;
    private long presentCount;
    private long absentCount;
    private long lateCount;
    private long excusedCount;
    private long unmarkedCount;
    private double attendancePercentage;

    public AttendanceSummaryDTO() {}

    public AttendanceSummaryDTO(LocalDate date, long totalStudents, long presentCount, 
                                long absentCount, long lateCount, long excusedCount, 
                                long unmarkedCount, double attendancePercentage) {
        this.date = date;
        this.totalStudents = totalStudents;
        this.presentCount = presentCount;
        this.absentCount = absentCount;
        this.lateCount = lateCount;
        this.excusedCount = excusedCount;
        this.unmarkedCount = unmarkedCount;
        this.attendancePercentage = attendancePercentage;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long totalStudents) { this.totalStudents = totalStudents; }

    public long getPresentCount() { return presentCount; }
    public void setPresentCount(long presentCount) { this.presentCount = presentCount; }

    public long getAbsentCount() { return absentCount; }
    public void setAbsentCount(long absentCount) { this.absentCount = absentCount; }

    public long getLateCount() { return lateCount; }
    public void setLateCount(long lateCount) { this.lateCount = lateCount; }

    public long getExcusedCount() { return excusedCount; }
    public void setExcusedCount(long excusedCount) { this.excusedCount = excusedCount; }

    public long getUnmarkedCount() { return unmarkedCount; }
    public void setUnmarkedCount(long unmarkedCount) { this.unmarkedCount = unmarkedCount; }

    public double getAttendancePercentage() { return attendancePercentage; }
    public void setAttendancePercentage(double attendancePercentage) { this.attendancePercentage = attendancePercentage; }
}
