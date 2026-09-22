export interface ReportData {
  college: string;
  department: string;
  batch: string;
  subjectCode: string;
  subjectName: string;
  studentName: string;
  date: string;
  activityTitle: string;
  paragraphs: string[];
  orientation?: 'landscape' | 'portrait';
  gotChance?: boolean | null;
  topicsDiscussed?: string[];
  customDetails?: string;
  borderColor?: string;
  headingColor?: string;
  title1Color?: string;
  title2Color?: string;
  showTeacherSignature?: boolean;
}

export interface ActivityPreset {
  id: string;
  code: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  defaultPrompt: string;
}

