import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { cleanStudentNotesAndTags, formatTopicsToStudentPhrase } from '../utils/textUtils.ts';

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

// Procedural unique report generator when offline or fallback
function generateProceduralReport(req: ReportGenerationRequest): { paragraphs: string[]; promptSummary: string } {
  const date = req.date?.trim() || "22-09-2026";
  const formattedDate = date.includes("September") ? date : (date === "22-09-2026" ? "22nd September 2026" : date);
  const gotChance = req.gotChance === true;
  const topics = (req.topicsDiscussed || []).map(t => cleanStudentNotesAndTags(t)).filter(Boolean);
  const rawCustom = req.customDetails?.trim() || req.prompt?.trim() || "";
  const custom = cleanStudentNotesAndTags(rawCustom);
  const randomSeed = Math.floor(Math.random() * 4);

  // Paragraph 1: Setup & Shared Activity Context (18yo Kerala Engineering Student voice)
  const para1Variations = [
    `On ${formattedDate}, our Ma’am conducted an exciting group formation and self-introduction activity for our class. Out of 59 students in our batch, 50 were present and divided into 6 groups based on our roll numbers (1–10, 11–20, 21–30, 31–40, 41–50, and 51–59). We were given around 10 to 15 minutes to sit together with our group members and practice our self-introductions in English. Ma’am told us that after the practice time, 3 students would be picked from each group to speak in front of the whole class.`,
    `On ${formattedDate}, we had our Life Skills class where our Ma’am organized a group formation and self-introduction activity. Out of 59 students in our class, 50 of us were present that day. We were split into 6 groups according to our roll-number ranges, with roughly 10 students in each group. Ma’am gave us 10 to 15 minutes to introduce ourselves to our group friends, practice speaking in English, and get ready because 3 students from each group were going to be chosen to present in front of everyone.`,
    `On ${formattedDate}, our Ma’am conducted a fun and interactive self-introduction activity in our class. There were 50 students attending out of 59, and we were organized into 6 groups based on our roll numbers (1–10, 11–20, 21–30, 31–40, 41–50, and 51–59). Each group had about 10 students. We got 10–15 minutes of preparation time to sit together, help each other rehearse our self-introductions in English, and prepare for 3 of us being called up to speak to the entire class.`,
    `On ${formattedDate}, our class took part in a group formation and self-introduction activity arranged by our Ma’am. Among the 59 students in our class, 50 were present and divided into 6 groups based on roll numbers. We had about 10 to 15 minutes to interact with our group members, practice what to say, and practice speaking in English. Ma’am instructed that 3 students from each group would be selected to introduce themselves in front of all 50 classmates.`
  ];
  const para1 = para1Variations[randomSeed % para1Variations.length];

  let para2 = "";
  let para3 = "";

  if (gotChance) {
    // Student GOT a chance to speak
    const topicsListStr = formatTopicsToStudentPhrase(topics);
    const customAddition = custom ? ` I also mentioned ${custom.replace(/^I\s+(also\s+)?(talked|spoke|mentioned)\s+about\s+/i, '')}.` : '';

    const p2Options = [
      `I was really thrilled and a little nervous when Ma’am selected me as one of the three students from our group to speak! When my turn came, I went up to the front and introduced myself before all 50 classmates and Ma’am. I spoke about ${topicsListStr}.${customAddition} Practicing with my roll-number friends just a few minutes earlier made me feel much more confident, and I was able to talk without getting stuck.`,
      `When our group was called, Ma’am picked me to give my self-introduction in front of the class. I was quite excited to share my thoughts and spoke about ${topicsListStr}.${customAddition} Standing up there in front of everyone was a great feeling, and the encouragement from my group members sitting in the bench helped me speak smoothly in English without stage fright.`,
      `I felt really happy when I got the chance to be one of the three speakers chosen from our group. I stood in front of the whole class and introduced myself, sharing ${topicsListStr}.${customAddition} At first my heart was beating fast, but seeing my friends smiling and listening gave me a big boost of confidence to speak loudly and clearly.`,
      `It was an exciting moment for me when Ma’am selected my name to introduce myself to the class. During my speech, I talked about ${topicsListStr}.${customAddition} Thanks to the quick practice session we had in our group where friends corrected my sentences, I was able to deliver my introduction with good energy and confidence.`
    ];
    para2 = p2Options[randomSeed % p2Options.length];

    const p3Options = [
      `Through this activity, I learned many valuable things that will help me in college and future interviews. Ma’am explained that we should always be honest about our real weaknesses instead of pretending to be perfect, because admitting areas where we need improvement shows genuine self-awareness. She also reminded us not to start with "Myself..." and gave us great tips on how to speak with confidence. It was a really enjoyable session that helped reduce my stage fear and made me excited for upcoming activities.`,
      `This session taught me a lot about introducing myself properly and communicating in English without fear. Hearing our classmates share their goals—like wanting to become software engineers or build their own startups—was really motivating. Ma’am’s advice about discussing our genuine strengths and honest weaknesses was very eye-opening for future job placements. Overall, it was a memorable and interactive class that boosted my self-confidence.`,
      `Reflecting on the activity, I realized how much preparation and teamwork can help when speaking in front of an audience. Ma’am gave us very helpful feedback on maintaining a positive attitude and being natural instead of memorizing lines. Learning that it is okay to acknowledge our weaknesses in an interview made a big impression on me. The activity was full of positive energy and made me feel much more comfortable talking to my classmates.`,
      `Overall, this self-introduction activity was both fun and very practical for our first year in engineering. I learned that speaking clearly in English just takes a little practice and good friends who support you. Ma’am’s guidance on being authentic, talking about our real ambitions, and admitting our weaknesses openly gave me a clear idea of what interviewers look for. I truly enjoyed the experience and feel much more confident now.`
    ];
    para3 = p3Options[randomSeed % p3Options.length];
  } else {
    // Student DID NOT get a chance to speak
    const customAddition = custom ? ` During our group discussions, we also talked about ${custom.replace(/^I\s+(also\s+)?(talked|spoke|mentioned)\s+about\s+/i, '')}.` : '';

    const p2Options = [
      `Even though I wasn't among the three students picked to go up on stage, I had a really great time in our group. For the 15 minutes of preparation time, all of us in our roll-number group sat together and took turns practicing our self-introductions in English.${customAddition} We helped each other correct common mistakes, laughed together, and cheered enthusiastically when our three group friends went up to the front to speak.`,
      `Although I didn't get called to speak in front of the whole class this time, our group preparation was super fun and active. We sat in a circle with our benchmates and rehearsed how we would introduce ourselves in English.${customAddition} Listening to my friends talk about their backgrounds and dreams gave me new ideas, and we made sure our three chosen speakers felt fully supported when they went to the stage.`,
      `I didn't happen to be selected as one of the three stage presenters, but participating in our group was an amazing experience. We used our 10 to 15 minutes to listen to each member introduce themselves and suggested simple ways to make our introductions sound better.${customAddition} It felt like real teamwork, and watching other groups present also gave me a lot of tips on how to speak confidently.`,
      `While only three students from our group were chosen to speak to the whole class, being part of the group practice was very exciting. We took turns speaking in English, encouraged each other not to feel shy, and helped each other prepare good points.${customAddition} Seeing our classmates present on stage was inspiring, and I felt proud of how well our group members represented us.`
    ];
    para2 = p2Options[randomSeed % p2Options.length];

    const p3Options = [
      `Through this activity, I gained a lot of useful insights into self-confidence and communication. Ma’am gave us very helpful feedback on why acknowledging real weaknesses alongside strengths creates a truthful and positive impression during job interviews. It was also fun learning simple things like not saying "Myself..." when introducing ourselves. Overall, the activity was super engaging and helped me feel much more confident speaking in front of my peers.`,
      `This exercise showed me that practicing with friends and active listening are just as helpful as speaking on stage. I learned how to explain my career interests in technology clearly and without hesitation. The session was very friendly and encouraging, and it gave me a lot of confidence for future classroom presentations.`,
      `Reflecting on this class, I really liked how interactive and lively the environment was. Seeing how differently my classmates spoke about their ambitions—whether wanting to get into software development or start something new—was truly motivating. Ma’am’s guidance on honesty and self-awareness gave me a clear perspective for future interviews.`,
      `The activity was a fun, memorable experience for all of us freshers. Observing different students present their introductions helped me understand how body language and a clear voice make a big difference. It was a great learning session that brought our class closer and helped reduce our hesitation.`
    ];
    para3 = p3Options[randomSeed % p3Options.length];
  }

  const promptSummary = gotChance
    ? `Selected to speak: presented [${topics.join(', ') || 'Self-introduction'}]${custom ? ` - "${custom}"` : ''}`
    : `Participated in group preparation; not selected to speak on stage${custom ? ` - "${custom}"` : ''}`;

  return {
    paragraphs: [para1, para2, para3].map(p => cleanStudentNotesAndTags(p)),
    promptSummary
  };
}

export async function generateReportContent(req: ReportGenerationRequest): Promise<ReportGenerationResponse> {
  const studentName = cleanStudentNotesAndTags(req.studentName?.trim() || "");
  const date = req.date?.trim() || "22-09-2026";
  const formattedDate = date.includes("September") ? date : (date === "22-09-2026" ? "22nd September 2026" : date);
  const activityTitle = req.activityTitle?.trim() || "GROUP FORMATION AND SELF-INTRODUCTION REPORT (ACTIVITY 1.1)";
  const gotChance = req.gotChance === true;
  const topics = (req.topicsDiscussed || []).map(t => cleanStudentNotesAndTags(t)).filter(Boolean);
  const custom = cleanStudentNotesAndTags(req.customDetails?.trim() || req.prompt?.trim() || "");

  const ai = getAIClient();

  // If no Gemini client is available, use procedural generation
  if (!ai) {
    const procedural = generateProceduralReport(req);
    return {
      paragraphs: procedural.paragraphs,
      activityTitle,
      date,
      studentName,
      source: 'algorithmic',
      generatedPrompt: procedural.promptSummary
    };
  }

  // Use Gemini API with candidate model fallback
  const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.8-flash', 'gemini-flash-latest'];

  const systemInstruction = `You are an 18-year-old 1st-year B.Tech Computer Science student from Kerala at College of Engineering Karunagappally (CEK). You are writing your own personal activity report for your Life Skills class.

CRITICAL INSTRUCTIONS & PRECISE FORMATTING:
1. ABSOLUTELY NO HASHTAGS OR RAW TAGS:
   - Under NO circumstances should any '#' symbols or raw hashtags appear anywhere in the paragraphs (e.g., NEVER write '#Engineer', '#SoftwareEngineer', '#Entrepreneur', or '#Coding').
   - If user notes or topics contain hashtags or keywords, naturally transform them into everyday student conversational English (e.g., '#SoftwareEngineer' -> 'wanting to become a software engineer', '#Entrepreneur' -> 'my dream of starting a tech startup', '#Coding' -> 'my passion for coding and web development').

2. BALANCE & EXACT SINGLE-PAGE LENGTH (STRICT):
   - The report MUST fit comfortably on a single A4 page with 12pt Times New Roman font and 1.5 line spacing, leaving space for the teacher's signature and approval at the bottom.
   - Do NOT elaborate excessively. Do NOT write long or bloated paragraphs.
   - Each of the three paragraphs must be balanced and concise: exactly 3 to 4 sentences (approx 45 to 60 words per paragraph; total words ~140 to 175).

3. AUTHENTIC 18-YEAR-OLD KERALA STUDENT TONE:
   - DO NOT write like an AI, corporate consultant, or HR manager!
   - BANNED CLICHÉS: "spearheaded", "synthesized", "balanced character portrait", "interpersonal competencies", "poise", "pedagogical milestone", "foster mutual camaraderie", "non-verbal posture", "invaluable learning milestone".
   - Write in genuine, modest, and enthusiastic student English. Mention sitting with roll-number friends, initial nervousness, practicing speaking in English for 10-15 minutes, laughing together, helping benchmates not say "Myself..." but "I am...", and Ma’am’s practical advice on being honest about weaknesses in placement interviews.
   - Respect our teacher as "our Ma’am".

SHARED FACTUAL CONTEXT (Grounded in the real class):
- Total students in class: 59.
- Students present on activity day: 50.
- Ma’am divided the class into 6 groups based on roll-number ranges (1–10, 11–20, 21–30, 31–40, 41–50, 51–59), roughly 10 students per group.
- Preparation time: 10–15 minutes sitting together.
- Language of communication: English.
- 3 students were selected from each group to speak in front of all 50 classmates.
- Ma’am’s guidance: Be honest about both genuine strengths and genuine weaknesses in interviews; don't pretend to be perfect; avoid saying "Myself...".
- Many students discussed wanting to become Software Engineers or exploring tech careers.

PARAGRAPH RULES:
- Exactly THREE paragraphs.
- Paragraph 1: Setup & class context (date ${formattedDate}, Ma'am, 50 present out of 59, 6 roll-number groups, 10–15 mins prep, English, 3 students picked per group).
- Paragraph 2: Personal experience during the activity.
    * If gotChance is TRUE: The student was picked as one of the 3 speakers. Describe the excitement and a little nervousness standing in front of 50 classmates, what they said (${topics.length > 0 ? topics.join(', ') : 'Software Engineer, hobbies, strengths and weaknesses'}, student notes: ${custom || 'none'}), and how practicing with group friends helped them speak clearly.
    * If gotChance is FALSE: The student was not picked to speak on stage, but had a great time practicing in their 10-student group for 15 mins, taking turns speaking in English, correcting mistakes, laughing, and cheering for the 3 friends who went up.
- Paragraph 3: Personal reflection on what they learned from Ma'am (honesty about strengths and weaknesses in interviews, avoiding "Myself...", getting over stage fear, excitement for future college activities).

Return strictly a valid JSON object:
{
  "paragraphs": ["Paragraph 1...", "Paragraph 2...", "Paragraph 3..."],
  "activityTitle": "${activityTitle}"
}`;

  const studentContextPrompt = `Student Name: "${studentName || 'Student'}"
Did the student get a chance to introduce themselves to the class?: ${gotChance ? 'YES' : 'NO'}
${gotChance ? `Topics discussed: ${topics.join(', ') || 'General introduction'}
Student's notes on what they said: "${custom || 'Introduced background and career aspirations'}"` : `Student's optional notes on their group experience: "${custom || 'Participated actively in group preparation'}"`}

Generate the balanced 3-paragraph report following all instructions above.`;

  for (const modelName of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model: modelName,
        contents: `${systemInstruction}\n\n${studentContextPrompt}`,
        config: {
          responseMimeType: 'application/json',
        }
      });

      const responseText = response.text?.trim() || '{}';
      const parsed = JSON.parse(responseText);

      if (Array.isArray(parsed.paragraphs) && parsed.paragraphs.length === 3) {
        // Sanitize any remaining '#' or awkward formatting
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
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.warn(`Gemini model ${modelName} returned notice: ${msg.slice(0, 100)}... trying alternative.`);
    }
  }

  // Fallback to procedural unique generator
  const procedural = generateProceduralReport(req);
  return {
    paragraphs: procedural.paragraphs,
    activityTitle,
    date,
    studentName,
    source: 'algorithmic',
    generatedPrompt: procedural.promptSummary
  };
}

