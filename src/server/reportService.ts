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

CRITICAL MANDATE — NATURAL, SHORT & HUMAN (DO NOT SOUND LIKE AN AI):
- DO NOT elaborate or write fancy, lengthy paragraphs. Long, elaborate text feels robotic and AI-generated to our teacher.
- Write like a real college student writing a brief, clear, natural report.
- LENGTH CONSTRAINT:
    * Exactly THREE short paragraphs.
    * Exactly 2 to 3 short, direct sentences per paragraph (around 25 to 35 words per paragraph; total report 75 to 105 words).
    * NOT 10-15 words (that is too brief), but short, realistic report paragraphs that fit comfortably with plenty of room for margins and the teacher's signature.
    * BANNED AI WORDS & FLUFF: "esteemed faculty", "foster holistic competencies", "transformative pedagogy", "active camaraderie", "profoundly resonated", "spearheaded", "synthesized", "interpersonal competencies", "pedagogical milestone".
    * Use plain, everyday student English.

CRITICAL FACTUAL CHRONOLOGY & DATES (MANDATORY CUSTOM INSTRUCTION):
- ACTIVITY CONDUCTED DATE: 19th September 2026 (the activity was held on 19th September 2026).
- REPORT SUBMISSION DATE: 22nd September 2026 (${formattedDate}) (this is the date when this report is formally submitted).
- UNDER NO CIRCUMSTANCES say that the activity took place on the 22nd. The activity was held on 19th September 2026, and 22nd September 2026 is the submission day.

MANDATORY CONTEXT: CLASS ATTENDANCE VARIATION (59 ENROLLED, 50 PRESENT):
- FACTUAL CONTEXT: 59 students are enrolled in the batch, but only 50 were present on that day (9 absent).
- DO NOT repeat the exact same sentence in every report. Express this attendance context differently each time using varied, natural phrasing:
    * "Although our batch has 59 students, 9 were absent, leaving 50 of us present for the session."
    * "Out of our total class roll of 59 students, 50 were present in the hall and split into 6 roll-number teams."
    * "From our total strength of 59, 50 classmates attended that day while 9 were on leave."
    * "Our Ma’am divided the 50 attending classmates, from our class strength of 59, into 6 roll-number groups."
    * "Fifty of our 59 batchmates attended the class and gathered into 6 groups."
- In Paragraph 2, describe the audience simply (e.g., "in front of the class", "before my batchmates", "to the gathered students").

CRITICAL DIVERSITY MANDATE:
- Every single student report MUST be completely different in phrasing, sentence structure, opening hook, and rhythm.
- DO NOT use cliché repetitive openings like "On 19th September 2026, our Life Skills class conducted...". Vary how you begin.
- DO NOT reuse identical stock sentences. Write an original, genuine reflection.

STRICT FORMATTING & BALANCE CONSTRAINTS:
1. ABSOLUTELY NO HASHTAGS OR RAW TAGS:
   - Under NO circumstances should any '#' symbols or raw hashtags appear (e.g., NEVER write '#Engineer', '#SoftwareEngineer', or '#Coding').
   - Weave topics into natural student English (e.g., 'wanting to become a software engineer', 'my coding projects', 'learning to speak with clear pacing').

2. PRECISE PARAGRAPH SIZING:
   - Exactly THREE paragraphs.
   - Each paragraph: 2 to 3 clear, natural sentences (~25–35 words per paragraph).
   - The entire report MUST fit effortlessly on a single A4 page with 12pt Times New Roman font and 1.5 line spacing, leaving 15-20% space at the bottom for teacher remarks and signature.

3. AUTHENTIC STUDENT TONE:
   - Natural student English: roll-number benchmates, practicing in English for 10 minutes, not saying "Myself..." but "I am...", and Ma’am’s practical advice on being honest about weaknesses in placement interviews.
   - Respect our teacher as "our Ma’am".

SHARED FACTUAL CONTEXT:
- Activity Conducted Date: 19th September 2026.
- Report Submission Date: 22nd September 2026.
- Total students in class: 59. Students present on activity day: 50.
- Ma’am divided the class into 6 groups based on roll-number ranges (roughly 8–9 students per group).
- Preparation time: 10–15 minutes practicing in English together.
- 3 students were selected from each group to speak.
- Ma’am’s guidance: Be honest about both genuine strengths and genuine weaknesses in interviews; never pretend to be perfect; avoid saying "Myself...".

PARAGRAPH RULES:
- Paragraph 1: Setup & class context (activity held on 19th September 2026 in Life Skills with our Ma'am, attendance variation for 50 present out of 59, 6 roll-number groups, 10 minutes English prep).
- Paragraph 2: Personal experience during the activity.
    * If gotChance is TRUE: Chosen as 1 of the 3 speakers. Stood before the class, spoke simply about ${topics.length > 0 ? topics.join(', ') : 'becoming a software engineer, tech interests, and strengths'}, student notes: ${custom || 'none'}. Practicing with group helped.
    * If gotChance is FALSE: Rehearsed in the group for 10 minutes, practiced speaking in English, cheered for our 3 group speakers.
- Paragraph 3: Reflection on Ma'am's advice (honesty with real weaknesses in placement interviews, avoiding "Myself...", submitting this report on 22nd September 2026).

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
