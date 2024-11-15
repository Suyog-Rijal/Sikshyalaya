# Sikshyalaya School Management System - Business Rules

---

### 1. Admin

- **Admin Profile**: Admins have a name, email, phone number, and secure password for system access.
- **System Management**: Admins maintain control over the entire system, including adding, editing, or removing users such as students, teachers, and parents.
- **Academic Administration**: Manages class schedules, student enrollments, and class promotions.
- **Financial Oversight**: Admins handle fee structures, monitor payment statuses, and generate financial reports for efficient tracking.
- **Permissions and Access**: Admins have unrestricted access across all system modules to ensure smooth school operations.
- **Uniqueness**: Each admin must have a unique email and phone number.
- **Mandatory Fields**: Name, email, phone number, password.

---

### 2. Teachers

- **Teacher Profile**: Each teacher has a name, email, phone number, password, and an assigned role type (Teaching Staff or Managing Staff).
- **Teaching Staff Responsibilities**:
  - **Instructional Support**: Teaching staff can upload assignments, share course materials, and record exam results.
  - **Student Progress Tracking**: Teachers can track and update student performance, manage attendance, and input term grades.
  - **Direct Communication**: Can communicate with students, send important notices, and provide academic support.
- **Managing Staff Responsibilities**:
  - **Enrollment and Fees**: Managing staff can monitor and process student enrollments, track fee statuses, and oversee class assignment.
  - **Event and Calendar Management**: Handles scheduling of class events, updates calendars, and coordinates school-wide activities.
  - **Parent-Teacher Interaction**: Can respond to parent inquiries, providing a bridge between school administration and families.
  
---

### 3. Students

- **Student Profile**: Students have a name, email, password, and unique student ID.
- **Academic Dashboard**: Provides access to personal academic data, including grades, attendance records, and assignment details.
- **Assignment Submission**: Students can submit assignments, view feedback from teachers, and track their academic progress.
- **Communication Hub**: Students can receive messages and announcements from teachers and admins and can respond within specified threads.
- **Payment and Fees**: Students can view fee structures, payment histories, and upcoming payment deadlines.
- **Uniqueness**: Each student must have a unique student ID and email.
- **Mandatory Fields**: Name, email, password, student ID.

---

### 4. Data Management

- **Secure Student Records**: Student information, academic history, attendance, and fee statuses are managed and secured to ensure data privacy.
- **Assignment and Material Management**: Teachers upload assignments and materials directly, making them easily accessible for students while allowing teachers to manage updates.
- **Role-Based Access Control**: Permissions are strictly defined; admins have full access, teachers have functional access based on their role, and students have access limited to their own data and materials.
- **Privacy and Security**: User data is encrypted and access is password-protected, safeguarding user information from unauthorized access.

---

### 5. Notifications and Alerts

- **Academic Updates**: Automated notifications alert students about new assignments, grades, and any upcoming exams.
- **Financial Reminders**: Students and parents are notified of pending fee payments and approaching due dates.
- **Event and Schedule Reminders**: Updates on school events, holidays, and other scheduled activities keep users informed.

---

### 6. Attendance and Performance Tracking

- **Daily Attendance**: Teachers log attendance records, visible to both students and admins for real-time tracking of attendance.
- **Progress Reports**: Regularly updated to provide students and parents with a clear overview of academic standing and term results.

---

### 7. Communication and Accountability

- **Message Logging**: All communications are documented to ensure accountability, fostering a professional and respectful communication environment.
- **Controlled Interactions**: Teachers and admins can post updates, while students respond within existing threads, maintaining organized communication channels.

</br>

# ERD diagram
![drawSQL-image-export-2024-11-15](https://github.com/user-attachments/assets/010aeb33-e053-4671-9d95-2055bf61f054)

  
