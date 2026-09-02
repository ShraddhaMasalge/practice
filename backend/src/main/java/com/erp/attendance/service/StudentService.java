package com.erp.attendance.service;

import com.erp.attendance.model.Student;
import com.erp.attendance.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StudentService {

    private final StudentRepository studentRepository;

    @Autowired
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public List<Student> getAllStudents(String className, String section, String query) {
        if (query != null && !query.trim().isEmpty()) {
            return studentRepository.searchStudents(query.trim());
        }
        if (className != null && !className.trim().isEmpty() && section != null && !section.trim().isEmpty()) {
            return studentRepository.findByClassNameAndSectionOrderByNameAsc(className.trim(), section.trim());
        }
        if (className != null && !className.trim().isEmpty()) {
            return studentRepository.findByClassNameOrderByNameAsc(className.trim());
        }
        return studentRepository.findAll();
    }

    public Optional<Student> getStudentById(Long id) {
        return studentRepository.findById(id);
    }

    public Optional<Student> getStudentByRollNumber(String rollNumber) {
        return studentRepository.findByRollNumber(rollNumber);
    }

    public Student createStudent(Student student) {
        if (studentRepository.existsByRollNumber(student.getRollNumber())) {
            throw new IllegalArgumentException("Student with roll number '" + student.getRollNumber() + "' already exists.");
        }
        return studentRepository.save(student);
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        Student existing = studentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Student not found with ID: " + id));

        if (studentRepository.existsByRollNumberAndIdNot(updatedStudent.getRollNumber(), id)) {
            throw new IllegalArgumentException("Roll number '" + updatedStudent.getRollNumber() + "' is already in use by another student.");
        }

        existing.setRollNumber(updatedStudent.getRollNumber());
        existing.setName(updatedStudent.getName());
        existing.setEmail(updatedStudent.getEmail());
        existing.setClassName(updatedStudent.getClassName());
        existing.setSection(updatedStudent.getSection());
        existing.setCourse(updatedStudent.getCourse());
        existing.setGender(updatedStudent.getGender());
        existing.setContactNumber(updatedStudent.getContactNumber());
        existing.setParentContact(updatedStudent.getParentContact());
        if (updatedStudent.getStatus() != null) {
            existing.setStatus(updatedStudent.getStatus());
        }

        return studentRepository.save(existing);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new IllegalArgumentException("Student not found with ID: " + id);
        }
        studentRepository.deleteById(id);
    }

    public List<String> getDistinctClasses() {
        return studentRepository.findDistinctClasses();
    }

    public List<String> getDistinctSections(String className) {
        return studentRepository.findDistinctSectionsByClassName(className);
    }
}
