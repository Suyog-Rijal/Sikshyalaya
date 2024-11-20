# Final Business Rule Document

## **Roles and Features**

### **1. Teachers**
- **Core Functionalities**:
  - Take attendance for their classes and view past attendance records.
  - Create, assign, and collect assignments with deadlines and instructions.
  - Post announcements for specific classes, including attached resources (e.g., links or documents).
  - View student profiles, including basic personal details and academic records (attendance, grades, assignments).
  - Enter and update subject-specific marks and grades, and view subject-wise grade breakdown.
  - Access their scheduled class routines.
  - Upload and organize subject-related materials for students (e.g., PDFs, videos, links).

### **2. Students**
- **Core Functionalities**:
  - View personal profiles, attendance records, and grades.
  - Check subject-wise marks, grades, and teacher-provided feedback.
  - Submit assignments with file uploads or text inputs, and track submission status.
  - View class schedules and routines.
  - Access teacher contact details (e.g., email) for communication.
  - Submit and track leave requests with reasons and dates.
  - Download and filter subject-specific resources uploaded by teachers.

### **3. School Management Department**
- **Core Functionalities**:
  - Add/enroll students and teachers.
  - Address parent complaints and suggestions.
  - Manage student counseling and academic growth.
  - Assign subjects to classes and generate student report cards.
  - Promote students based on academic performance.
  - Oversee overall school operations.

### **4. Finance Department**
- **Core Functionalities**:
  - Manage billing, receipts, and student fee collection.
  - Process teacher salaries.
  - Oversee accounting for events, programs, and school finances.

### **5. Transportation Department**
- **Core Functionalities**:
  - Track school bus routes and student attendance on buses.
  - Maintain records of student-specific routes and schedules.

### **6. Parents' Portal (Optional)**
- **Core Functionalities**:
  - Submit feedback and suggestions to the School Management Department.
  - View children’s academic reports, report cards, and performance summaries.

---

## **Academic Relationships**

1. **Teacher ↔ Class**  
   - **Relationship**: A teacher teaches one or more classes, but each class is taught by a single teacher per subject.  
   - **Type**: One-to-Many.

2. **Class ↔ Subject**  
   - **Relationship**: Each class has multiple subjects, and each subject belongs to a specific class.  
   - **Type**: One-to-Many.

3. **Subject ↔ Student**  
   - **Relationship**: Students enroll in multiple subjects, and each subject can have multiple students.  
   - **Type**: Many-to-Many (via the Class entity).

4. **Teacher ↔ Subject**  
   - **Relationship**: Teachers manage one or more subjects, and a subject is managed by a single teacher.  
   - **Type**: One-to-Many.

5. **Student ↔ Attendance**  
   - **Relationship**: Each attendance entry is tied to a specific student, with multiple records for each student.  
   - **Type**: One-to-Many.

6. **Student ↔ Grade**  
   - **Relationship**: Each grade is unique to a student and linked to a subject.  
   - **Type**: One-to-Many.

7. **Teacher ↔ LeaveRequest**  
   - **Relationship**: Teachers manage student leave requests.  
   - **Type**: One-to-Many.

---

## **Departments**

### **1. Academic Departments**
- Includes teachers, students, and optionally, a class teacher.

### **2. Non-Academic Departments**
- **School Management Department**: Handles administration, counseling, and academic operations.
- **Finance Department**: Manages finances, salaries, and fees.
- **Transportation Department**: Oversees school transportation systems and logistics.

### **3. Parents' Portal (Optional)**
- Provides parents with access to children’s performance reports and a feedback mechanism.

---
