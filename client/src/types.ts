// types.ts
export enum Role {
  STUDENT = "STUDENT",
  LECTURER = "LECTURER",
}

export enum AssignmentType {
  DOCUMENT_UPLOAD = "DOCUMENT_UPLOAD",
  QUIZ = "QUIZ",
}

export interface User {
  id: string;
  matricNo?: string | null;
  email: string;
  password: string;
  department: string;
  faculty: string;
  level?: string | null;
  firstName: string;
  lastName: string;
  otherNames: string;
  profileImage: string;
  role: Role;
  createdAt: Date;

  // Relationships
  lecturerCourses?: Course[];
  enrolledCourses?: Course[];
  createdAssignments?: Assignment[];
  submissions?: Submission[];
  gradedSubmissions?: Submission[];
}

export interface Course {
  id: string;
  title: string;
  courseCode: string;
  createdAt: Date;

  // Relationships
  lecturerId: string;
  lecturer?: User;
  students?: User[];
  assignments?: Assignment[];
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  category: string;
  type: AssignmentType;
  createdAt: Date;

  // Relationships
  courseId: string;
  course?: Course;
  files?: File[];
  questions?: Question[];
  lecturerId: string;
  lecturer?: User;
  submissions?: Submission[];
}

export interface Question {
  id: string;
  question: string;
  answer: string;
  options: string;
  assignmentId: string;
  assignment?: Assignment;
}

export interface File {
  id: string;
  fileUrl: string;
  assignmentId: string;
  assignment?: Assignment;
}

export interface Submission {
  id: string;
  fileUrl?: string | null;
  quizAnswers?: JSON | null;
  submittedAt: Date;
  grade?: number | null;
  gradedAt?: Date | null;

  // Relationships
  studentId: string;
  student?: User;
  assignmentId: string;
  assignment?: Assignment;
  gradedById?: string | null;
  gradedBy?: User | null;
}
