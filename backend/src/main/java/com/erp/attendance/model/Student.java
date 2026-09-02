package com.erp.attendance.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "students", indexes = {
    @Index(name = "idx_roll_number", columnList = "rollNumber", unique = true),
    @Index(name = "idx_class_section", columnList = "className, section")
})
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String rollNumber;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(length = 150)
    private String email;

    @Column(name = "class_name", nullable = false, length = 50)
    private String className;

    @Column(nullable = false, length = 20)
    private String section;

    @Column(length = 100)
    private String course;

    @Column(length = 20)
    private String gender;

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @Column(name = "parent_contact", length = 20)
    private String parentContact;

    @Column(length = 20)
    private String status = "ACTIVE";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (this.createdAt == null) {
            this.createdAt = LocalDateTime.now();
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }

    public Student() {}

    public Student(Long id, String rollNumber, String name, String email, String className, 
                   String section, String course, String gender, String contactNumber, 
                   String parentContact, String status) {
        this.id = id;
        this.rollNumber = rollNumber;
        this.name = name;
        this.email = email;
        this.className = className;
        this.section = section;
        this.course = course;
        this.gender = gender;
        this.contactNumber = contactNumber;
        this.parentContact = parentContact;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

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

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getParentContact() { return parentContact; }
    public void setParentContact(String parentContact) { this.parentContact = parentContact; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
