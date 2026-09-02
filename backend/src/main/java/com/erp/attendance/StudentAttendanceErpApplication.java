package com.erp.attendance;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentAttendanceErpApplication {

    public static void main(String[] args) {
        SpringApplication.run(StudentAttendanceErpApplication.class, args);
        System.out.println("==================================================================");
        System.out.println(" Student Attendance ERP Backend Started Successfully on Port 8080");
        System.out.println(" API Base URL: http://localhost:8080/api");
        System.out.println(" H2 Web Console (default profile): http://localhost:8080/h2-console");
        System.out.println("==================================================================");
    }
}
