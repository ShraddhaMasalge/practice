package com.erp.attendance.repository;

import com.erp.attendance.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    Optional<Student> findByRollNumber(String rollNumber);

    boolean existsByRollNumber(String rollNumber);

    boolean existsByRollNumberAndIdNot(String rollNumber, Long id);

    List<Student> findByClassNameAndSectionOrderByNameAsc(String className, String section);

    List<Student> findByClassNameOrderByNameAsc(String className);

    List<Student> findByStatusOrderByNameAsc(String status);

    @Query("SELECT DISTINCT s.className FROM Student s WHERE s.className IS NOT NULL ORDER BY s.className")
    List<String> findDistinctClasses();

    @Query("SELECT DISTINCT s.section FROM Student s WHERE s.className = :className AND s.section IS NOT NULL ORDER BY s.section")
    List<String> findDistinctSectionsByClassName(@Param("className") String className);

    @Query("SELECT s FROM Student s WHERE " +
           "LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.rollNumber) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.className) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.email) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "ORDER BY s.rollNumber ASC")
    List<Student> searchStudents(@Param("query") String query);
}
