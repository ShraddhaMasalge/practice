package com.erp.attendance.repository;

import com.erp.attendance.model.Attendance;
import com.erp.attendance.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    Optional<Attendance> findByStudentIdAndAttendanceDate(Long studentId, LocalDate attendanceDate);

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    List<Attendance> findByAttendanceDateBetweenOrderByAttendanceDateAsc(LocalDate startDate, LocalDate endDate);

    List<Attendance> findByStudentIdOrderByAttendanceDateDesc(Long studentId);

    List<Attendance> findByStudentIdAndAttendanceDateBetweenOrderByAttendanceDateAsc(
            Long studentId, LocalDate startDate, LocalDate endDate);

    long countByAttendanceDateAndStatus(LocalDate attendanceDate, AttendanceStatus status);

    long countByAttendanceDate(LocalDate attendanceDate);

    long countByStudentId(Long studentId);

    long countByStudentIdAndStatus(Long studentId, AttendanceStatus status);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date AND a.student.className = :className ORDER BY a.student.rollNumber ASC")
    List<Attendance> findByDateAndClassName(@Param("date") LocalDate date, @Param("className") String className);

    @Query("SELECT a FROM Attendance a WHERE a.attendanceDate = :date AND a.student.className = :className AND a.student.section = :section ORDER BY a.student.rollNumber ASC")
    List<Attendance> findByDateAndClassNameAndSection(@Param("date") LocalDate date, @Param("className") String className, @Param("section") String section);
}
