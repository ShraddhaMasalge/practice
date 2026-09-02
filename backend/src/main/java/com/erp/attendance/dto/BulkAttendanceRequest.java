package com.erp.attendance.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class BulkAttendanceRequest {

    @NotNull(message = "Attendance date is required")
    private LocalDate date;

    private String recordedBy;

    @NotEmpty(message = "At least one attendance entry must be provided")
    @Valid
    private List<AttendanceEntryDTO> entries;

    public BulkAttendanceRequest() {}

    public BulkAttendanceRequest(LocalDate date, String recordedBy, List<AttendanceEntryDTO> entries) {
        this.date = date;
        this.recordedBy = recordedBy;
        this.entries = entries;
    }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getRecordedBy() { return recordedBy; }
    public void setRecordedBy(String recordedBy) { this.recordedBy = recordedBy; }

    public List<AttendanceEntryDTO> getEntries() { return entries; }
    public void setEntries(List<AttendanceEntryDTO> entries) { this.entries = entries; }
}
