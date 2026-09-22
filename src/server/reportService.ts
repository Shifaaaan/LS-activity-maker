import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { cleanStudentNotesAndTags } from '../utils/textUtils.ts';
import { generateCombinatoricReport } from '../utils/reportGenerator.ts';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });
  }
  return aiClient;
}

export interface ReportGenerationRequest {
  prompt?: string;
  studentName?: string;
  date?: string;
  activityTitle?: string;
  college?: string;
  department?: string;
  batch?: string;
  subjectCode?: string;
  subjectName?: string;
  isLucky?: boolean;
  gotChance?: boolean | null;
  topicsDiscussed?: string[];
  customDetails?: string;
}

export interface ReportGenerationResponse {
  paragraphs: string[];
  activityTitle: string;
  date: string;
  studentName: string;
  source: 'gemini' | 'algorithmic';
  generatedPrompt?: string;
}

export async function generateReportContent(req: ReportGenerationRequest): Promise<ReportGenerationResponse> {
  const studentName = req.studentName?.trim() || "";
  const date = req.date?.trim() || "22-09-2026";
  const formattedDate = date.includes("September") ? date : (date === "22-09-2026" ? "22nd September 2026" : date);
  const activityTitle = req.activityTitle?.trim() || "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)";
  const gotChance = req.gotChance === true;
  const topics = (req.topicsDiscussed || []).map(t => cleanStudentNotesAndTags(t)).filter(Boolean);
  const custom = cleanStudentNotesAndTags(req.customDetails?.trim() || req.prompt?.trim() || "");

  const ai = getAIClient();

  // If no Gemini client is available, use our high-diversity combinatoric generation engine
  if (!ai) {
    const procedural = generateCombinatoricReport(req);
    return {
      paragraphs: procedural.paragraphs,
      activityTitle,
      date,
      studentName,
      source: 'algorithmic',
      generatedPrompt: procedural.summary
    };
  }

  // Use Gemini API with candidate model fallback - prioritising high-throughput gemini-3.1-flash-lite
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

  // Diverse stylistic perspectives to guarantee every single generation is uniquely voiced
  const perspectives = [
    'Energetic and collaborative — focus on group camaraderie, lively peer rehearsals, and public speaking courage',
    'Thoughtful and observant — focus on classroom atmosphere, peer support, and insightful takeaways from Ma\'am',
    'Goal-oriented and enthusiastic — focus on college aspirations, tech interests, and overcoming initial stage hesitation',
    'Candid and natural — focus on genuine peer interactions, laughing through mistakes, and practical interview advice',
    'Team-focused and reflective — focus on mutual encouragement, active listening, and building communication confidence'
  ];
  const chosenPerspective = perspectives[Math.floor(Math.random() * perspectives.length)];
  const nonce = `${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  const systemInstruction = `You are an 18-year-old 1st-year B.Tech Computer Science student from Kerala at College of Engineering Karunagappally (CEK). You are writing your personal activity report for your Life Skills class.

PERSPECTIVE FOR THIS RUN (${nonce}): ${chosenPerspective}.

CRITICAL FACTUAL CHRONOLOGY & DATES (MANDATORY CUSTOM INSTRUCTION):
- ACTIVITY CONDUCTED DATE: 19th September 2026 (the activity was held on 19th September 2026).
- REPORT SUBMISSION DATE: 22nd September 2026 (${formattedDate}) (this is the date when this report is formally submitted).
- UNDER NO CIRCUMSTANCES say that the activity took place on the 22nd. The activity was held on 19th September 2026, and 22nd September 2026 is the submission day.

MANDATORY CONTEXT: CLASS ATTENDANCE VARIATION (59 ENROLLED, 50 PRESENT):
- FACTUAL CONTEXT: There are 59 students in the class, but only 50 of them were present on the activity day (meaning 9 students were absent).
- DO NOT use the same generic sentence or repetitive wording (like "Out of 59 students in our batch, 50 were present") in every report.
- You MUST formulate this attendance context differently each time using varied angles, phrasing, and vocabulary:
    * Absence perspective: "Although our batch comprises 59 students, 9 were absent, leaving 50 of us present for the morning session..."
    * Turnout perspective: "From our registered class strength of 59, 50 classmates attended and assembled into 6 roll-number teams..."
    * Room & seating perspective: "Fifty of our 59 batchmates were seated in the hall, ready to take part in the team exercises..."
    * Roll register perspective: "The attendance sheet recorded 50 students present out of our 59-member class..."
    * Grouping perspective: "Our Ma’am organized the 50 attending students, out of the total batch size of 59, into 6 collaborative teams..."
    * Dynamic student phrasing: "With 50 out of 59 peers present in class that day...", "Of our 59 enrolled classmates, 50 were in attendance...", "Even with 9 students away, having 50 of our 59 batchmates present created a bustling atmosphere..."
- Also vary how the audience is described in Paragraph 2 (e.g., "speaking before the gathered class", "addressing the 50 students in attendance", "sharing my introduction with our assembled batchmates", "standing in front of our peers").

CRITICAL DIVERSITY MANDATE:
- Every single student report MUST be completely different in phrasing, sentence structure, opening hook, and rhythm.
- DO NOT use cliché repetitive openings like "On 19th September 2026, our Life Skills class conducted...". Vary how you begin (e.g. mention the session energy on the 19th, how Ma'am kicked off the activity, the roll-number team division, or practicing English with benchmates).
- DO NOT reuse identical stock sentences. Write an original, genuine reflection.

STRICT FORMATTING & BALANCE CONSTRAINTS:
1. ABSOLUTELY NO HASHTAGS OR RAW TAGS:
   - Under NO circumstances should any '#' symbols or raw hashtags appear (e.g., NEVER write '#Engineer', '#SoftwareEngineer', or '#Coding').
   - Weave topics into natural student English (e.g., 'wanting to become a software engineer', 'my coding projects', 'learning to speak with clear pacing').

2. PRECISE SENTENCE AND PARAGRAPH SIZING:
   - Exactly THREE paragraphs.
   - Sentences: 12 to 18 words per sentence. Crisp, grammatically correct, and easy to read.
   - Paragraph length: Exactly 3 to 4 balanced sentences per paragraph (45 to 60 words per paragraph; total words ~140 to 175).
   - The entire report MUST fit on a single A4 page with 12pt Times New Roman font and 1.5 line spacing, leaving sufficient space at the bottom for teacher signature and approval.

3. AUTHENTIC 18-YEAR-OLD KERALA STUDENT TONE:
   - BANNED CLICHÉS: "spearheaded", "synthesized", "interpersonal competencies", "pedagogical milestone", "foster mutual camaraderie", "non-verbal posture".
   - Natural student English: roll-number benchmates, practicing English for 10-15 minutes, not saying "Myself..." but "I am...", and Ma’am’s practical advice on being honest about weaknesses in placement interviews.
   - Respect our teacher as "our Ma’am".

SHARED FACTUAL CONTEXT:
- Activity Conducted Date: 19th September 2026.
- Report Submission Date: 22nd September 2026.
- Total students in class: 59. Students present on activity day: 50.
- Ma’am divided the class into 6 groups based on roll-number ranges (roughly 10 students per group).
- Preparation time: 10–15 minutes practicing in English together.
- 3 students were selected from each group to speak in front of all 50 classmates.
- Ma’am’s guidance: Be honest about both genuine strengths and genuine weaknesses in interviews; never pretend to be perfect; avoid saying "Myself...".

PARAGRAPH RULES:
- Paragraph 1: Setup & class context (activity was held on 19th September 2026 in our Life Skills class with our Ma'am, 50 present out of 59, 6 roll-number groups, 10–15 mins English prep, 3 students chosen per group).
- Paragraph 2: Personal experience during the activity held on 19th September.
    * If gotChance is TRUE: Chosen as 1 of the 3 speakers. Standing before 50 classmates, topics discussed (${topics.length > 0 ? topics.join(', ') : 'Software Engineer, tech interests, strengths and weaknesses'}, student notes: ${custom || 'none'}), and how practicing with group friends helped.
    * If gotChance is FALSE: Rehearsed in the 10-student group for 15 mins, took turns speaking in English, corrected phrasing, supported the 3 chosen speakers.
- Paragraph 3: Personal reflection on Ma'am's advice (honesty about real weaknesses in placement interviews, avoiding "Myself...", overcoming stage hesitation, feeling confident as we submit this report on 22nd September 2026).

Return strictly a valid JSON object:
{
  "paragraphs": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3..."],
  "activityTitle": "${activityTitle}"
}`;

  const studentContextPrompt = `Student Name: "${studentName || 'Student'}"
Chronology note: The activity was held on 19th September 2026, and this report submission date is 22nd September 2026.
Did the student get a chance to introduce themselves to the class?: ${gotChance ? 'YES' : 'NO'}
${gotChance ? `Topics discussed: ${topics.join(', ') || 'General introduction'}
Student's notes on what they said: "${custom || 'Introduced background and career aspirations'}"` : `Student's optional notes on their group experience: "${custom || 'Participated actively in group preparation'}"`}

Generate the completely fresh 3-paragraph reflection following all instructions above. Strictly remember: the activity was conducted on 19th September 2026, while 22nd September 2026 is the report submission date.`;

  for (const modelName of candidateModels) {
    // Retry up to 2 times on temporary spikes (503/429)
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: `${systemInstruction}\n\n${studentContextPrompt}`,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.95,
          }
        });

        const responseText = response.text?.trim() || '{}';
        const parsed = JSON.parse(responseText);

        if (Array.isArray(parsed.paragraphs) && parsed.paragraphs.length === 3) {
          const sanitizedParagraphs = parsed.paragraphs.map((p: string) => cleanStudentNotesAndTags(p));
          return {
            paragraphs: sanitizedParagraphs,
            activityTitle: parsed.activityTitle || activityTitle,
            date,
            studentName,
            source: 'gemini',
            generatedPrompt: gotChance
              ? `Spoke on: ${topics.join(', ')}${custom ? ` (${custom})` : ''}`
              : `Group preparation participant${custom ? ` (${custom})` : ''}`
          };
        }
      } catch (err: unknown) {
        // If transient spike (503 or 429), pause briefly and retry
        const isTransient = err && typeof err === 'object' && 'status' in err && (err.status === 503 || err.status === 429);
        if (attempt === 0 && isTransient) {
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
        // Move to next candidate model or fallback smoothly
        break;
      }
    }
  }

  // Fallback to procedural combinatoric generator
  const procedural = generateCombinatoricReport(req);
  return {
    paragraphs: procedural.paragraphs,
    activityTitle,
    date,
    studentName,
    source: 'algorithmic',
    generatedPrompt: procedural.summary
  };
}
