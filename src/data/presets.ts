import { ReportData, ActivityPreset } from '../types.ts';

export const SHARED_ACTIVITY_CONTEXT = {
  name: "Group Formation and Self-Introduction Activity",
  class_total_students: 59,
  students_present: 50,
  groups: 6,
  intended_group_size: 10,
  grouping_method: "Roll-number ranges",
  roll_number_ranges: [
    "1-10",
    "11-20",
    "21-30",
    "31-40",
    "41-50",
    "51-59"
  ],
  students_selected_per_group: 3,
  preparation_time_minutes: "10-15",
  language: "English",
  activity_components: [
    "Group formation",
    "Self-introduction preparation",
    "Peer practice",
    "Peer correction",
    "Self-introduction",
    "Strength identification",
    "Weakness identification",
    "Career aspiration discussion"
  ],
  teacher_guidance: [
    "Students should introduce themselves in English",
    "Students should discuss their strengths and weaknesses",
    "Students should practice and improve their introductions within their groups",
    "Students should develop self-awareness and communication skills"
  ],
  key_values: [
    "Self-awareness",
    "Honesty",
    "Communication",
    "Confidence",
    "Personal improvement"
  ],
  career_discussions: [
    "Software Engineer",
    "Entrepreneur",
    "Uncertain about future career"
  ],
  general_experience: "The activity was interactive, practical, and enjoyable, with students having different levels of participation and different opportunities to speak."
};

export const CHANCE_SUGGESTIONS = [
  "Software Engineer",
  "Entrepreneur",
  "Strength",
  "Weakness",
  "Hobbies",
  "Future Goals",
  "Leadership",
  "Creativity",
  "Problem Solving",
  "Communication",
  "Technology",
  "Higher Studies",
  "Personal Interests",
  "Team Collaboration"
];

export const BORDER_COLORS = [
  { id: 'navy', name: 'Navy Blue', hex: '#234994', borderClass: 'border-[#234994]', bgClass: 'bg-[#234994]', description: 'Default official CEK navy' },
  { id: 'royal', name: 'Royal Blue', hex: '#1d4ed8', borderClass: 'border-[#1d4ed8]', bgClass: 'bg-[#1d4ed8]', description: 'Vibrant academic blue' },
  { id: 'maroon', name: 'Academic Maroon', hex: '#800020', borderClass: 'border-[#800020]', bgClass: 'bg-[#800020]', description: 'Deep institutional burgundy' },
  { id: 'emerald', name: 'Emerald Green', hex: '#15803d', borderClass: 'border-[#15803d]', bgClass: 'bg-[#15803d]', description: 'Scholastic forest green' },
  { id: 'charcoal', name: 'Formal Charcoal', hex: '#1f2937', borderClass: 'border-[#1f2937]', bgClass: 'bg-[#1f2937]', description: 'Executive graphite black' },
  { id: 'indigo', name: 'Deep Indigo', hex: '#4338ca', borderClass: 'border-[#4338ca]', bgClass: 'bg-[#4338ca]', description: 'Refined deep purple-blue' },
];

export const HEADING_COLORS = [
  { id: 'maroon', name: 'Academic Maroon', hex: '#800020', textClass: 'text-[#800020]', bgClass: 'bg-[#800020]', description: 'Default classic CEK heading' },
  { id: 'navy', name: 'Navy Blue', hex: '#234994', textClass: 'text-[#234994]', bgClass: 'bg-[#234994]', description: 'Matches navy border tone' },
  { id: 'black', name: 'Formal Black', hex: '#111827', textClass: 'text-[#111827]', bgClass: 'bg-[#111827]', description: 'Strict high-contrast monochrome' },
];

export const TITLE_COLORS = [
  { id: 'black', name: 'Formal Black', hex: '#000000' },
  { id: 'navy', name: 'CEK Navy Blue', hex: '#234994' },
  { id: 'maroon', name: 'Academic Maroon', hex: '#800020' },
  { id: 'royal', name: 'Royal Blue', hex: '#1d4ed8' },
  { id: 'emerald', name: 'Forest Green', hex: '#15803d' },
  { id: 'charcoal', name: 'Formal Charcoal', hex: '#1f2937' },
];

export const DESIGN_TEMPLATES = [
  {
    id: 'cek-classic',
    name: 'CEK Classic',
    borderColor: '#234994',
    headingColor: '#800020',
    description: 'Navy border with Maroon heading (Submitted Standard)'
  },
  {
    id: 'royal-navy',
    name: 'Royal Monogram',
    borderColor: '#1d4ed8',
    headingColor: '#234994',
    description: 'Royal blue frame with deep navy heading'
  },
  {
    id: 'heritage-maroon',
    name: 'Heritage Crimson',
    borderColor: '#800020',
    headingColor: '#800020',
    description: 'Full maroon academic border and title'
  },
  {
    id: 'scholastic-emerald',
    name: 'Scholastic Forest',
    borderColor: '#15803d',
    headingColor: '#800020',
    description: 'Emerald green border with maroon title'
  },
  {
    id: 'formal-monochrome',
    name: 'Executive Formal',
    borderColor: '#1f2937',
    headingColor: '#111827',
    description: 'Charcoal border with formal black title'
  },
  {
    id: 'deep-indigo',
    name: 'Indigo Scholar',
    borderColor: '#4338ca',
    headingColor: '#234994',
    description: 'Indigo border with navy heading'
  }
];

export const INITIAL_TEMPLATE_REPORT: ReportData = {
  college: 'COLLEGE OF ENGINEERING KARUNAGAPPALLY',
  department: 'DEPARTMENT OF COMPUTER SCIENCE AND ENGINEERING',
  batch: 'BATCH-B',
  subjectCode: 'UCHUT128',
  subjectName: 'Life Skills & Professional Communication',
  studentName: '', // Initial state: completely empty
  date: '22-09-2026',
  activityTitle: 'GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)',
  paragraphs: [
    'On 19th September 2026, our Life Skills class had a group activity led by our Ma’am. Although our batch comprises 59 students, 9 were absent, leaving 50 of us present to form 6 roll-number groups. We were given 10 minutes to practice our introductions in English before 3 students from each group were picked to speak.',
    'During our group practice time, all 10 of us sat together and took turns rehearsing our self-introductions in English. We helped each other correct small phrasing errors and cheered for our group representatives when they presented on stage.',
    'Our Ma’am gave us valuable feedback, advising us to be honest about our real weaknesses in placement interviews and avoid saying "Myself...". It was a useful activity, and I am glad to submit this report on 22nd September 2026.'
  ],
  orientation: 'portrait', // Paper size: A4, Orientation: Portrait (210 × 297 mm)
  gotChance: null,
  topicsDiscussed: [],
  customDetails: '',
  borderColor: '#234994', // Default CEK Navy
  headingColor: '#800020', // Default Academic Maroon
  title1Color: '#234994', // Default CEK Navy (matching college name in format)
  title2Color: '#234994', // Default CEK Navy (matching department in format)
  showTeacherSignature: true, // Default: Teacher's Remarks & Signature footer enabled
};

export const ACTIVITY_PRESETS: ActivityPreset[] = [
  {
    id: 'act-1-1',
    code: 'ACTIVITY 1.1',
    title: 'GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)',
    subjectCode: 'UCHUT128',
    subjectName: 'Life Skills & Professional Communication',
    defaultPrompt: ''
  }
];

