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
  matricNo: string;
  email: string;
  department: string;
  faculty: string;
  level?: string;
  firstName: string;
  lastName: string;
  otherNames: string;
  profileImage: string;
  role: Role;
  createdAt: Date;
  courses?: Course[];
  assignments?: Assignment[];
}

export interface Course {
  id: string;
  title: string;
  courseCode: string;
  lecturerId: string;
  lecturer?: User;
}

export interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  description: string;
  dueDate: Date;
  category: string;
  type: AssignmentType;
  files?: File[];
  createdAt: Date;
  lecturerId?: string;
  lecturer?: User;
  questions?: Question[];
}

export interface Question {
  id: string;
  question: string;
  options: string;
  answer?: string;
  assignmentId?: string;
}

export interface File {
  id: string;
  fileUrl: string;
  assignmentId: string;
}

export interface Submission {
  id: string;
  fileUrl?: string;
  textResponse?: string;
  submittedAt: Date;
  studentId: string;
  assignmentId: string;
}
