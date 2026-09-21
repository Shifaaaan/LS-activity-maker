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
}

export interface ActivityPreset {
  id: string;
  code: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  defaultPrompt: string;
}
