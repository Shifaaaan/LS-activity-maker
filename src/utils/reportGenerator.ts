import { cleanStudentNotesAndTags, formatTopicsToStudentPhrase } from './textUtils.ts';

export interface ProceduralReportOptions {
  date?: string;
  studentName?: string;
  activityTitle?: string;
  gotChance?: boolean | null;
  topicsDiscussed?: string[];
  customDetails?: string;
  prompt?: string;
}

function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function generateCombinatoricReport(options: ProceduralReportOptions): {
  paragraphs: [string, string, string];
  summary: string;
} {
  const rawDate = options.date?.trim() || '22-09-2026';
  const submissionDateStr = rawDate.includes('September')
    ? rawDate
    : (rawDate === '22-09-2026' ? '22nd September 2026' : rawDate);
  const activityDateStr = '19th September 2026';
  const gotChance = options.gotChance === true;
  const rawTopics = (options.topicsDiscussed || []).map(t => cleanStudentNotesAndTags(t)).filter(Boolean);
  const topicsPhrase = formatTopicsToStudentPhrase(rawTopics);
  const rawCustom = options.customDetails?.trim() || options.prompt?.trim() || '';
  const customNote = cleanStudentNotesAndTags(rawCustom);

  // ─────────────────────────────────────────────────────────────
  // PARAGRAPH 1: Class Setup & Attendance (~28–35 words)
  // Short, natural, human-like student phrasing
  // ─────────────────────────────────────────────────────────────
  const p1Openers = [
    `On ${activityDateStr}, our Life Skills period was dedicated to a group activity led by our Ma’am.`,
    `During our Life Skills class on ${activityDateStr}, our Ma’am conducted an interactive group activity.`,
    `On ${activityDateStr}, our Ma’am organized a self-introduction exercise during our Life Skills hour.`,
    `Our class had an engaging self-introduction session on ${activityDateStr} coordinated by our Ma’am.`,
    `On ${activityDateStr}, we had a practical communication activity in our Life Skills class with our Ma’am.`
  ];

  const p1Attendance = [
    `Although our batch has 59 students, 9 were absent, leaving 50 of us present to form 6 roll-number teams.`,
    `Out of 59 students in our batch, 50 were present and divided into 6 roll-number groups.`,
    `With 50 out of 59 classmates present in the hall, our Ma’am arranged us into 6 groups.`,
    `From our registered strength of 59, 50 students attended that day and were split into 6 teams.`,
    `Fifty of our 59 batchmates were present, and our Ma’am divided us into 6 roll-number groups.`,
    `The attendance recorded 50 students present out of 59, whom Ma’am organized into 6 squads.`,
    `With 9 classmates absent from our 59-member batch, 50 of us gathered into 6 teams.`
  ];

  const p1Prep = [
    `We were given 10 minutes to practice our introductions in English before 3 students per group were picked to speak.`,
    `Ma’am gave us about 10 minutes to rehearse in English before 3 members from each group were called to present.`,
    `Each team had 10 minutes to prepare in English, and then 3 students from each group were chosen to speak to the class.`
  ];

  const para1 = `${pickRandom(p1Openers)} ${pickRandom(p1Attendance)} ${pickRandom(p1Prep)}`;

  // ─────────────────────────────────────────────────────────────
  // PARAGRAPH 2: Personal Experience (~25–35 words)
  // ─────────────────────────────────────────────────────────────
  let para2 = '';

  if (gotChance) {
    const p2Selection = [
      `I was selected as one of the three speakers from my group.`,
      `When our turn came, our Ma’am called me to speak on behalf of our group.`,
      `I was chosen by our Ma’am as one of the representatives for our roll-number team.`,
      `Our group picked me as one of the three students to present to the class.`
    ];

    const customAdd = customNote
      ? `, also touching on ${customNote.replace(/^I\s+(also\s+)?(talked|spoke|mentioned)\s+about\s+/i, '')}`
      : '';

    const p2Speaking = [
      `I stood before the class and introduced myself, speaking about ${topicsPhrase}${customAdd}.`,
      `I introduced myself to my batchmates, sharing my background and ${topicsPhrase}${customAdd}.`,
      `I spoke about ${topicsPhrase}${customAdd}, sharing my genuine interests with the class.`
    ];

    const p2Support = [
      `Practicing with my teammates beforehand helped me speak comfortably without stage fear.`,
      `Rehearsing with my group friends gave me the confidence to deliver my introduction smoothly.`,
      `The encouragement from my group members helped me speak clearly and naturally.`
    ];

    para2 = `${pickRandom(p2Selection)} ${pickRandom(p2Speaking)} ${pickRandom(p2Support)}`;
  } else {
    const p2NoSelection = [
      `Although I was not selected to speak on stage, I participated actively in our group practice.`,
      `While three other students were chosen to present, I had a good time practicing with my team.`,
      `I was not called to the front, but our 10-member group preparation was very lively and helpful.`
    ];

    const customAddNo = customNote
      ? ` We also discussed ${customNote.replace(/^I\s+(also\s+)?(talked|spoke|mentioned)\s+about\s+/i, '')}.`
      : '';

    const p2NoRehearsal = [
      `We took turns rehearsing our self-introductions in English and helped each other correct small phrasing errors.${customAddNo}`,
      `We practiced speaking in English together, giving each other tips and encouragement.${customAddNo}`,
      `All 10 of us sat together, practiced our introductions, and cheered for our group speakers.${customAddNo}`
    ];

    para2 = `${pickRandom(p2NoSelection)} ${pickRandom(p2NoRehearsal)}`;
  }

  // ─────────────────────────────────────────────────────────────
  // PARAGRAPH 3: Teacher's Guidance & Conclusion (~25–35 words)
  // ─────────────────────────────────────────────────────────────
  const p3Honesty = [
    `Our Ma’am gave us valuable feedback, advising us to be honest about our real weaknesses in placement interviews instead of pretending to be perfect.`,
    `Ma’am taught us that accepting our weaknesses truthfully shows genuine integrity during job interviews.`,
    `A key takeaway from our Ma’am was to discuss genuine areas for improvement honestly during interviews.`
  ];

  const p3Conclusion = [
    `She also reminded us to avoid saying "Myself...", and I am happy to submit this report on ${submissionDateStr}.`,
    `She advised us never to begin with "Myself", and this session helped build my speaking confidence for this report on ${submissionDateStr}.`,
    `She also corrected informal habits like saying "Myself", making this a very useful activity to report on ${submissionDateStr}.`
  ];

  const para3 = `${pickRandom(p3Honesty)} ${pickRandom(p3Conclusion)}`;

  const summary = gotChance
    ? `Presented to class on ${topicsPhrase}${customNote ? ` (${customNote})` : ''}`
    : `Participated actively in 10-member group practice${customNote ? ` (${customNote})` : ''}`;

  return {
    paragraphs: [
      cleanStudentNotesAndTags(para1),
      cleanStudentNotesAndTags(para2),
      cleanStudentNotesAndTags(para3)
    ],
    summary
  };
}
