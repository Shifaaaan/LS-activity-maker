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
  // PARAGRAPH 1: Class Context, Setup & Formation (12–18 words/sentence, 45–60 words total)
  // Activity held on 19th September 2026; submission on 22nd September 2026
  // ─────────────────────────────────────────────────────────────
  const p1Openers = [
    `On ${activityDateStr}, our Life Skills period began with an engaging self-introduction and group activity led by our Ma’am.`,
    `During our college session on ${activityDateStr}, our Ma’am organized an interactive team formation and speaking exercise.`,
    `An inspiring self-introduction session took place during our Life Skills class on ${activityDateStr} with our Ma’am.`,
    `On ${activityDateStr}, our Ma’am conducted a lively group communication session designed to build our presentation confidence.`,
    `Our morning class on ${activityDateStr} was dedicated to an engaging self-introduction workshop coordinated by our Ma’am.`,
    `On ${activityDateStr}, our first-year batch took part in an interactive team communication activity directed by our Ma’am.`,
    `Our Ma’am guided us through a memorable group formation and personal introduction exercise on ${activityDateStr}.`,
    `On ${activityDateStr}, we enjoyed a lively Life Skills activity centered on conversational practice and group formation.`,
    `A productive self-introduction and teamwork session was coordinated by our Ma’am on ${activityDateStr}.`,
    `To develop our communication skills, our Ma’am arranged a hands-on speaking exercise on ${activityDateStr}.`
  ];

  const p1Attendance = [
    `Although our batch comprises 59 students, 9 were absent, leaving 50 of us present for the morning session.`,
    `With 50 out of 59 classmates present in the hall, our Ma’am arranged us into 6 roll-number teams.`,
    `From our registered class strength of 59, 50 students attended the day's exercise and formed 6 collaborative squads.`,
    `While 9 students were away, having 50 of our 59 batchmates present made for a vibrant, high-energy classroom.`,
    `A turnout of 50 students from our total class roll of 59 participated enthusiastically, divided into 6 teams.`,
    `The attendance recorded 50 students present out of 59 enrolled, whom our Ma’am split into 6 roll-number clusters.`,
    `Out of the 59 students in our branch, exactly 50 attended that morning, partitioned neatly into 6 groups.`,
    `Fifty of our 59 batchmates were seated in the hall, and our Ma’am organized us into 6 roll-number divisions.`,
    `Even with 9 absentees from our 59-member batch, the 50 attending students created 6 buzzing discussion circles.`,
    `From our full strength of 59, 50 of us attended the session and gathered into 6 roll-number groups of roughly 8 to 9 peers.`,
    `Our teacher divided the 50 attending classmates—out of 59 enrolled in our batch—into 6 designated roll-number teams.`,
    `Of the 59 students on our class register, 50 were present in the classroom, ready for the group exercises.`,
    `Our class has a total strength of 59, and on that day, 50 students were present to take part in the activity.`,
    `With 9 classmates absent, the remaining 50 of our 59-student batch were assembled into 6 roll-number groups.`,
    `Among the 59 enrolled first-year students, 50 of us attended the class and sat together in 6 collaborative squads.`,
    `There were 50 of us in attendance from the total batch size of 59, forming 6 active roll-number clusters.`,
    `Fifty out of our 59 peers attended the period, allowing our Ma’am to distribute us evenly into 6 groups.`,
    `The day saw 50 students present out of the 59 in our batch, all eager to participate across 6 roll-number tables.`,
    `Accounting for 9 absentees from our 59-student class, 50 of us were present and split into 6 interactive teams.`,
    `A total of 50 students out of 59 attended the session, filling the classroom with lively discussions across 6 squads.`
  ];

  const p1Prep = [
    `We spent 10 to 15 minutes practicing our self-introductions in English, before 3 students per group were picked to speak.`,
    `Ma’am gave us 10 to 15 minutes to rehearse in English before selecting 3 representatives per group to address the class.`,
    `Each team was given 10 to 15 minutes of English preparation, with 3 peers chosen to present to everyone.`,
    `We utilized 10 to 15 minutes to practice speaking in English as 3 members from each squad were selected to present.`,
    `After 10 to 15 minutes of group discussion in English, our Ma’am called on 3 students from each team to speak.`,
    `We were allotted 10 to 15 minutes to rehearse together before 3 students from each group were chosen to speak.`
  ];

  const para1 = `${pickRandom(p1Openers)} ${pickRandom(p1Attendance)} ${pickRandom(p1Prep)}`;

  // ─────────────────────────────────────────────────────────────
  // PARAGRAPH 2: Personal Experience (Spoke vs Rehearsed)
  // ─────────────────────────────────────────────────────────────
  let para2 = '';

  if (gotChance) {
    const p2Selection = [
      `I was really excited and slightly nervous when our Ma’am selected me as one of the three group speakers.`,
      `It was an exhilarating moment when my name was called to speak on behalf of our roll-number group.`,
      `When our group took the stage, I felt honored to be chosen by Ma’am to deliver my self-introduction.`,
      `I felt an instant rush of energy when our Ma’am nominated me to introduce myself to our assembled batchmates.`,
      `Being selected as a presenter for our group brought a genuine mix of anticipation and excitement.`,
      `I was pleasantly surprised when our Ma’am chose me to represent our group before the entire class.`
    ];

    const customAdd = customNote
      ? `, touching also on ${customNote.replace(/^I\s+(also\s+)?(talked|spoke|mentioned)\s+about\s+/i, '')}`
      : '';

    const p2Speaking = [
      `Standing before the class, I spoke about ${topicsPhrase}${customAdd} with clarity and enthusiasm.`,
      `I introduced myself to the gathered classmates, sharing ${topicsPhrase}${customAdd} with sincerity.`,
      `During my turn, I spoke clearly about ${topicsPhrase}${customAdd} while outlining my future aspirations.`,
      `I walked the class through my background, discussing ${topicsPhrase}${customAdd} with growing confidence.`,
      `I took the opportunity to explain ${topicsPhrase}${customAdd}, conveying my genuine interests to my peers.`
    ];

    const p2Support = [
      `Practicing with my roll-number teammates beforehand helped me articulate my sentences smoothly without hesitation.`,
      `The encouragement from my group members sitting in the benches gave me the courage to speak with poise.`,
      `Having rehearsed with my 10 group friends just minutes earlier gave me great confidence during my presentation.`,
      `The warm smiles and active listening from my classmates made speaking in English feel completely natural.`
    ];

    para2 = `${pickRandom(p2Selection)} ${pickRandom(p2Speaking)} ${pickRandom(p2Support)}`;
  } else {
    const p2NoSelection = [
      `Although I was not selected to present on stage, actively collaborating with my group was very rewarding.`,
      `Even without being called up to the front, participating in our roll-number group was thoroughly enjoyable.`,
      `While three other members were chosen to present, our 10-student group practice proved to be lively and motivating.`,
      `Though I was not among the three stage presenters, I had a wonderful time rehearsing with my group friends.`,
      `Not being picked for stage speaking did not dampen my enthusiasm during our active group preparation.`
    ];

    const customAddNo = customNote
      ? ` We also discussed ${customNote.replace(/^I\s+(also\s+)?(talked|spoke|mentioned)\s+about\s+/i, '')}.`
      : '';

    const p2NoRehearsal = [
      `We spent the 15 minutes taking turns practicing our English introductions, offering constructive tips, and laughing together.${customAddNo}`,
      `Our group sat in a circle to rehearse our introductions, helping each other correct small errors in phrasing.${customAddNo}`,
      `All 10 of us actively shared our career interests, practiced speaking in English, and supported one another.${customAddNo}`,
      `We utilized our preparation time to help each other prepare thoughtful points and build conversational confidence.${customAddNo}`
    ];

    const p2NoCheering = [
      `We listened attentively as our three group speakers delivered their introductions, feeling proud of their performance.`,
      `When our group representatives stepped up before our assembled classmates, we cheered enthusiastically for their effort.`,
      `As our group speakers took the stage in front of the room, we listened intently and supported their courage.`,
      `Watching our group friends present on stage gave all of us a shared feeling of accomplishment and teamwork.`,
      `Seeing our classmates introduce themselves with poise inspired me to participate actively in future classroom activities.`
    ];

    para2 = `${pickRandom(p2NoSelection)} ${pickRandom(p2NoRehearsal)} ${pickRandom(p2NoCheering)}`;
  }

  // ─────────────────────────────────────────────────────────────
  // PARAGRAPH 3: Teacher's Guidance & Personal Reflections (45–60 words)
  // ─────────────────────────────────────────────────────────────
  const p3Honesty = [
    `Our Ma’am gave us valuable advice on admitting real weaknesses honestly during future placement interviews rather than pretending to be flawless.`,
    `The most memorable takeaway was our Ma’am’s guidance on sharing genuine strengths while acknowledging real weaknesses with sincerity.`,
    `Our Ma’am emphasized that accepting our weaknesses truthfully reflects mature self-awareness and integrity in placement interviews.`,
    `A key learning was our Ma’am’s advice to discuss authentic areas for growth candidly, as interviewers appreciate honesty.`,
    `During the debrief, our Ma’am explained that admitting our real weaknesses openly creates a trustworthy impression in job interviews.`
  ];

  const p3Etiquette = [
    `She also reminded us to avoid opening with "Myself" and taught us how to introduce ourselves naturally.`,
    `She advised us never to begin with "Myself..." and gave us practical tips on speaking with steady confidence.`,
    `We learned to replace informal phrases like "Myself..." with professional, articulate English greetings.`,
    `Ma’am also corrected the habit of saying "Myself..." and provided great suggestions for overcoming stage hesitation.`
  ];

  const p3Conclusion = [
    `This interactive session reduced my hesitation significantly and made me look forward to future college activities.`,
    `Overall, the activity built a stronger camaraderie among our batch and bolstered my confidence in speaking English.`,
    `The session was an enjoyable experience that dispelled my stage fear and left me energized for the semester ahead.`,
    `In all, it was a productive and engaging exercise that set an optimistic, confident foundation for our engineering studies.`
  ];

  const para3 = `${pickRandom(p3Honesty)} ${pickRandom(p3Etiquette)} ${pickRandom(p3Conclusion)}`;

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
