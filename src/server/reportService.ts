import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let aiClient: GoogleGenAI | null = null;

function getAIClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
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
}

export interface ReportGenerationResponse {
  paragraphs: string[];
  activityTitle: string;
  date: string;
  studentName: string;
  source: 'gemini' | 'template';
  generatedPrompt?: string;
}

// Built-in authentic templates mirroring Muhammed Shifan's template PDF context
const LUCKY_VARIATIONS = [
  {
    prompt: "I was part of Group 3. During the 20-minute prep, we rehearsed elevator pitches. I was selected to introduce myself on stage in front of the whole class and received valuable feedback from Ma'am.",
    activityTitle: "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)",
    paragraphs: [
      "On 19th September 2026, our Ma’am conducted a group formation and self-introduction activity for our class. There were 50 students present, divided into groups of 10. We were given 15–20 minutes for preparation, after which 3 students were randomly selected from each group to introduce themselves.",
      "I was fortunate to be chosen from our group to deliver my introduction before the entire class. Standing before my peers, I shared my educational background, passion for computer science, and career aspirations. Our group's earlier rehearsal gave me the clarity to speak fluently without hesitation.",
      "Through this activity, I learned the critical importance of non-verbal cues, including maintaining steady eye contact and an upright posture. Ma’am provided constructive feedback on voice modulation and advised avoiding casual openers like “Myself”. Overall, the session transformed my public speaking hesitation into genuine confidence."
    ]
  },
  {
    prompt: "I rehearsed my introduction with my group members. Although I wasn't picked for the stage presentation, our group worked together closely and critiqued each other's introduction structure.",
    activityTitle: "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)",
    paragraphs: [
      "On 19th September 2026, our Ma’am conducted a group formation and self-introduction activity. There were 50 students present, divided into groups of 10. We were given 15–20 minutes for preparation, after which 3 students were randomly selected from each group to introduce themselves.",
      "Although I was not selected to introduce myself in front of the class, I got an opportunity to rehearse my introduction with my group members. Our group performed well, and the rehearsal helped me practise presenting myself effectively.",
      "Through this activity, I learned that we should not begin an introduction with “Myself”; instead, we should use phrases like “I am” or “My name is.” I also learned how to present our strengths and weaknesses appropriately, especially in interviews. Overall, the activity improved my understanding of effective self-introduction and increased my confidence through practice."
    ]
  },
  {
    prompt: "I acted as the discussion coordinator for our 10-member team. We practiced answering standard interview self-introduction questions, timing our speeches to strictly under two minutes.",
    activityTitle: "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)",
    paragraphs: [
      "On 19th September 2026, our Ma’am organized a structured group formation and self-introduction exercise for Batch-B. The 50 students in attendance were organized into groups of 10, receiving a 15–20 minute preparation window before selected candidates presented.",
      "In our group, I took the initiative to coordinate the mock introductions and keep track of individual speaking times. Each member received constructive feedback regarding speech clarity, and we supported our designated presenters with helpful suggestions prior to the final classroom showcase.",
      "The activity provided invaluable insight into professional self-representation. I learned how to succinctly articulate technical competencies and personal attributes without sounding boastful. Participating in this collaborative drill strengthened both my communication skills and interpersonal teamwork."
    ]
  },
  {
    prompt: "We practiced identifying strengths and articulating genuine areas of improvement during our self-introduction rehearsal in Computer Science Batch-B.",
    activityTitle: "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)",
    paragraphs: [
      "On 19th September 2026, our Ma’am conducted an interactive group formation and professional self-introduction session. The class comprised 50 students grouped into units of 10, with 15–20 minutes allotted to prepare structured personal introductions.",
      "During our internal team rounds, my peers and I took turns delivering our introductions while assessing pacing and language. The constructive peer evaluation allowed us to refine our delivery, ensuring our statements were concise, articulate, and suited for formal academic evaluation.",
      "Through this practical activity, I recognized common grammatical pitfalls, such as starting statements with informal colloquialisms. I learned to structure my professional background effectively for future interview panels. The exercise notably enhanced my self-assurance and verbal readiness."
    ]
  }
];

export async function generateReportContent(req: ReportGenerationRequest): Promise<ReportGenerationResponse> {
  const studentName = req.studentName?.trim() || "Muhammed Shifan";
  const date = req.date?.trim() || "19-09-2026";
  const activityTitle = req.activityTitle?.trim() || "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)";
  const college = req.college?.trim() || "COLLEGE OF ENGINEERING KARUNAGAPPALLY";
  const department = req.department?.trim() || "DEPARTMENT OF COMPUTER SCIENCE";
  const batch = req.batch?.trim() || "BATCH-B";
  const subjectCode = req.subjectCode?.trim() || "UCHUT128";
  const subjectName = req.subjectName?.trim() || "Life Skills & Professional Communication";

  // Handle "I am feeling lucky" without custom prompt
  if (req.isLucky && !req.prompt?.trim()) {
    const randomPick = LUCKY_VARIATIONS[Math.floor(Math.random() * LUCKY_VARIATIONS.length)];
    return {
      paragraphs: randomPick.paragraphs,
      activityTitle: randomPick.activityTitle,
      date,
      studentName,
      source: 'template',
      generatedPrompt: randomPick.prompt
    };
  }

  const ai = getAIClient();
  const userPrompt = req.prompt?.trim();

  // If no AI key is configured, intelligently adapt or pick from templates
  if (!ai) {
    if (!userPrompt) {
      const pick = LUCKY_VARIATIONS[0];
      return {
        paragraphs: pick.paragraphs,
        activityTitle,
        date,
        studentName,
        source: 'template',
        generatedPrompt: pick.prompt
      };
    }

    // Adapt user prompt into the 3-paragraph format directly
    return {
      paragraphs: [
        `On ${date}, our Ma’am conducted the ${activityTitle.toLowerCase().replace(/report.*$/, '')} session for ${department} (${batch}) at ${college}. There were students present divided into collaborative working groups with dedicated preparation time.`,
        `During the session, ${userPrompt.endsWith('.') ? userPrompt : userPrompt + '.'} Our group worked cooperatively to rehearse, exchange feedback, and prepare thoroughly for the presentation requirements.`,
        `Through this activity, I learned essential professional communication principles, including structured articulation, active listening, and confident delivery. Overall, this activity enhanced my interpersonal skills, self-awareness, and readiness for future academic and interview presentations.`
      ],
      activityTitle,
      date,
      studentName,
      source: 'template',
      generatedPrompt: userPrompt
    };
  }

  // Use Gemini API to format strictly according to the reference PDF structure
  try {
    const systemInstruction = `You are an academic report formatter for engineering students at College of Engineering Karunagappally.
You must transform student notes or prompts into an exact 3-paragraph academic activity report.

Reference Style & Pacing Rules:
1. Exactly THREE paragraphs.
2. Paragraph 1 (Setup & Context): State the date (${date}), the faculty ("our Ma’am"), the activity topic, classroom attendance/grouping, and allotted preparation time (e.g. 15–20 minutes).
3. Paragraph 2 (Participation & Experience): Describe the student's specific experience, whether rehearsing with group members or presenting to the class, how the group performed, and mutual support.
4. Paragraph 3 (Key Learnings & Takeaways): Highlight specific communication or life skills learned (e.g. avoiding "Myself", using "I am" or "My name is", framing strengths and weaknesses appropriately for interviews, speech clarity, posture, and confidence building).
5. Tone: Formal, polite, reflective, academic English matching Indian Engineering college life skills coursework.
6. Output format: Return strictly a valid JSON object with the shape:
{
  "paragraphs": ["Paragraph 1 text...", "Paragraph 2 text...", "Paragraph 3 text..."],
  "activityTitle": "${activityTitle}"
}
Do NOT include markdown backticks like \`\`\`json. Return only the JSON string.`;

    const promptText = userPrompt
      ? `Student input notes/prompt: "${userPrompt}". Format this into the exact 3-paragraph report matching the required style.`
      : `Generate a realistic variation for Activity 1.1 based on the context: 50 students, groups of 10, 15-20 min prep, introducing oneself in front of class or rehearsing with group, learning interview etiquette and self-introduction.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `${systemInstruction}\n\n${promptText}`,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text?.trim() || '{}';
    const parsed = JSON.parse(responseText);

    if (Array.isArray(parsed.paragraphs) && parsed.paragraphs.length === 3) {
      return {
        paragraphs: parsed.paragraphs,
        activityTitle: parsed.activityTitle || activityTitle,
        date,
        studentName,
        source: 'gemini',
        generatedPrompt: userPrompt || 'Auto-generated using AI context'
      };
    }
  } catch (error) {
    console.error('Gemini generation error, falling back to template engine:', error);
  }

  // Fallback if parsing failed
  const fallback = LUCKY_VARIATIONS[1];
  return {
    paragraphs: fallback.paragraphs,
    activityTitle,
    date,
    studentName,
    source: 'template',
    generatedPrompt: userPrompt || fallback.prompt
  };
}
