package com.erp.attendance.controller;

import com.erp.attendance.dto.*;
import com.erp.attendance.model.Attendance;
import com.erp.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;

    @Autowired
    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    /**
     * Get daily attendance sheet for a specific date and class.
     */
    @GetMapping("/sheet")
    public ResponseEntity<List<DailyAttendanceSheetDTO>> getDailySheet(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false) String className,
            @RequestParam(required = false) String section) {
        if (date == null) {
            date = LocalDate.now();
        }
        return ResponseEntity.ok(attendanceService.getDailyAttendanceSheet(date, className, section));
    }

    /**
     * Bulk save daily attendance entries into the database.
     */
    @PostMapping("/bulk")
    public ResponseEntity<?> saveBulkAttendance(@Valid @RequestBody BulkAttendanceRequest request) {
        try {
            Map<String, Object> result = attendanceService.saveBulkAttendance(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Save single student attendance record.
     */
    @PostMapping("/single")
    public ResponseEntity<?> recordSingleAttendance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(required = false, defaultValue = "ERP Teacher") String recordedBy,
            @Valid @RequestBody AttendanceEntryDTO entry) {
        try {
            Attendance saved = attendanceService.recordSingleAttendance(date, entry, recordedBy);
            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Get KPI summary statistics for the dashboard on a specific date.
     */
    @GetMapping("/summary")
    public ResponseEntity<AttendanceSummaryDTO> getSummary(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        if (date == null) {
            date = LocalDate.now();
        }
        return ResponseEntity.ok(attendanceService.getAttendanceSummary(date));
    }

    /**
     * Get attendance report across date ranges.
     */
    @GetMapping("/report")
    public ResponseEntity<List<StudentReportDTO>> getReport(
            @RequestParam(required = false) String className,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getStudentsReport(className, startDate, endDate));
    }
}
