import { ReportData, ActivityPreset } from '../types.ts';

export const INITIAL_TEMPLATE_REPORT: ReportData = {
  college: 'COLLEGE OF ENGINEERING KARUNAGAPPALLY',
  department: 'DEPARTMENT OF COMPUTER SCIENCE',
  batch: 'BATCH-B',
  subjectCode: 'UCHUT128',
  subjectName: 'Life Skills & Professional Communication',
  studentName: 'Muhammed Shifan',
  date: '19-09-2026',
  activityTitle: 'GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)',
  paragraphs: [
    'On 19th September 2026, our Ma’am conducted a group formation and self-introduction activity. There were 50 students present, divided into groups of 10. We were given 15–20 minutes for preparation, after which 3 students were randomly selected from each group to introduce themselves.',
    'Although I was not selected to introduce myself in front of the class, I got an opportunity to rehearse my introduction with my group members. Our group performed well, and the rehearsal helped me practise presenting myself effectively.',
    'Through this activity, I learned that we should not begin an introduction with “Myself”; instead, we should use phrases like “I am” or “My name is.” I also learned how to present our strengths and weaknesses appropriately, especially in interviews. Overall, the activity improved my understanding of effective self-introduction and increased my confidence through practice.'
  ],
  orientation: 'landscape',
};

export const ACTIVITY_PRESETS: ActivityPreset[] = [
  {
    id: 'act-1-1',
    code: 'ACTIVITY 1.1',
    title: 'GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)',
    subjectCode: 'UCHUT128',
    subjectName: 'Life Skills & Professional Communication',
    defaultPrompt: 'We formed groups of 10 for self-introduction, rehearsed with teammates, discussed how to structure our strengths and weaknesses, and avoided starting with Myself.'
  },
  {
    id: 'act-1-2',
    code: 'ACTIVITY 1.2',
    title: 'MOCK INTERVIEW AND RESUME BUILDING REPORT (ACTIVITY 1.2)',
    subjectCode: 'UCHUT128',
    subjectName: 'Life Skills & Professional Communication',
    defaultPrompt: 'In this session, we had mock interview drills in pairs. We reviewed resume action verbs, practiced answering tell me about yourself within 90 seconds, and received tips on professional posture.'
  },
  {
    id: 'act-1-3',
    code: 'ACTIVITY 1.3',
    title: 'GROUP DISCUSSION ON PROFESSIONAL ETHICS (ACTIVITY 1.3)',
    subjectCode: 'UCHUT128',
    subjectName: 'Life Skills & Professional Communication',
    defaultPrompt: 'Batch-B conducted a formal group discussion on ethical responsibilities in computing. Our team analyzed privacy concerns, practiced respectful turn-taking without interrupting, and synthesized key arguments.'
  },
  {
    id: 'act-1-4',
    code: 'ACTIVITY 1.4',
    title: 'NON-VERBAL COMMUNICATION & PRESENTATION SKILLS (ACTIVITY 1.4)',
    subjectCode: 'UCHUT128',
    subjectName: 'Life Skills & Professional Communication',
    defaultPrompt: 'Our Ma\'am guided an interactive drill on non-verbal communication, body language, vocal modulation, and stage presence during technical presentations.'
  }
];

export const PROMPT_IDEAS = [
  {
    label: "Stage Presenter",
    prompt: "I was selected as one of the 3 students from our group to introduce myself to the whole class of 50 students. I shared my background and goals, and Ma'am gave feedback on eye contact."
  },
  {
    label: "Group Rehearsal",
    prompt: "I rehearsed in our 10-student circle. Even though I wasn't picked for the main stage, our group practiced introducing strengths and weaknesses constructively."
  },
  {
    label: "Team Coordinator",
    prompt: "I coordinated our group during the 15-20 minutes preparation time, timing everyone's 60-second introductions and helping peers replace informal phrasing."
  },
  {
    label: "Overcoming Stage Fear",
    prompt: "I worked on overcoming nervousness when speaking in front of peers, focusing on steady breathing and speaking with clarity."
  }
];
