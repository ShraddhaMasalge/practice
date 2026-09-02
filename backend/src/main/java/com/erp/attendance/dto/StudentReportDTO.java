package com.erp.attendance.dto;

public class StudentReportDTO {

    private Long studentId;
    private String rollNumber;
    private String name;
    private String className;
    private String section;
    private long totalDays;
    private long presentDays;
    private long absentDays;
    private long lateDays;
    private long excusedDays;
    private double percentage;
    private boolean shortAttendance; // below 75% threshold

    public StudentReportDTO() {}

    public StudentReportDTO(Long studentId, String rollNumber, String name, String className, 
                            String section, long totalDays, long presentDays, long absentDays, 
                            long lateDays, long excusedDays, double percentage, boolean shortAttendance) {
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.name = name;
        this.className = className;
        this.section = section;
        this.totalDays = totalDays;
        this.presentDays = presentDays;
        this.absentDays = absentDays;
        this.lateDays = lateDays;
        this.excusedDays = excusedDays;
        this.percentage = percentage;
        this.shortAttendance = shortAttendance;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public String getRollNumber() { return rollNumber; }
    public void setRollNumber(String rollNumber) { this.rollNumber = rollNumber; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getClassName() { return className; }
    public void setClassName(String className) { this.className = className; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public long getTotalDays() { return totalDays; }
    public void setTotalDays(long totalDays) { this.totalDays = totalDays; }

    public long getPresentDays() { return presentDays; }
    public void setPresentDays(long presentDays) { this.presentDays = presentDays; }

    public long getAbsentDays() { return absentDays; }
    public void setAbsentDays(long absentDays) { this.absentDays = absentDays; }

    public long getLateDays() { return lateDays; }
    public void setLateDays(long lateDays) { this.lateDays = lateDays; }

    public long getExcusedDays() { return excusedDays; }
    public void setExcusedDays(long excusedDays) { this.excusedDays = excusedDays; }

    public double getPercentage() { return percentage; }
    public void setPercentage(double percentage) { this.percentage = percentage; }

    public boolean isShortAttendance() { return shortAttendance; }
    public void setShortAttendance(boolean shortAttendance) { this.shortAttendance = shortAttendance; }
}
