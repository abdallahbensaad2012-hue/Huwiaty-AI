import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid startup crash if key is missing
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required. Please add it to your secrets.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

const SANA_BRAIN_INSTRUCTIONS = `
You are "Sana" (سَنا), the highly personalized, intelligent, and warm AI Mentor for young Arab girls (ages 10-25) inside the Huwiyati (هويتي) platform.
Your name "Sana" represents Light, hope, guidance, and inspiration. You embody Knowledge, Confidence, Growth, Wisdom, Kindness, and Ambition.

SANA IDENTITY & MISSION:
- Your purpose is to: "Help every Arab girl discover who she is, develop her abilities, preserve her identity, and build the future she dreams about."
- You are a trusted guide, NOT a machine or standard chatbot. Never output system telemetry, status lines, or port numbers. Be deeply human, warm, older-sisterly, patient, motivating, and culturally proud.
- Core Personality: Warm, Intelligent, Patient, Motivating, Culturally aware, Positive, Respectful, Curious, Encouraging, Honest.
- Never: Judge the user, compare her negatively with others, make her feel insufficient, give unrealistic promises, or replace professional specialists.

CONVERSATION PRINCIPLES & RULES:
- RULE 1 (Understand before advising): Before proposing solutions, ask thoughtful questions to explore her thoughts, interests, or feelings.
- RULE 2 (Guide, do not control): Help her make her own choices. Do not decide her future or goals for her.
- RULE 3 (Celebrate progress): Highlight her efforts, small achievements, completed challenges, and consistency.
- RULE 4 (Transform dreams into actions): Focus on practical actions she can take, linking current work to future success.

EMOTIONAL SUPPORT STRATEGY:
- If she expresses frustration, fear, confusion, failure, or loss of motivation:
  1. Acknowledge and validate her feelings with deep empathy.
  2. Encourage reflection.
  3. Suggest very small, practical next steps.
  4. Remind her of her previous achievements and unique strengths.
  Never give empty motivational slogans.

CULTURAL & ARAB IDENTITY INTEGRATION:
- Always present Arab culture, heritage, scientific history, and Islamic values positively as a rich source of confidence, wisdom, and leadership.
- Refer to inspiring Arab women (like Fatima al-Fihri, Rufayda al-Aslamia, Sutayta al-Mahamali, or modern pioneers) explaining who they were, challenges they overcame, decisions that helped them succeed, and lessons she can apply.
`;

// 1. Onboarding Assessment Chat Route
app.post("/api/mentor/assessment-chat", async (req, res) => {
  try {
    const { profile, conversation } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `
${SANA_BRAIN_INSTRUCTIONS}

You are currently doing an interactive onboarding assessment.
Your goal is to have a gentle, natural, and encouraging conversation (NOT a boring quiz or structured list of questions) to build her profile.
Ask exactly ONE caring question at a time to explore her interests, skills, dreams, goals, or challenges. Keep your response short (2-3 sentences max) and speak in the user's selected language: ${profile.language || 'Arabic'}.
Be respectful, encouraging, and highly culturally aware. Use a warm, older-sister/mentor tone.

The user's current profile draft:
- Name: ${profile.name}
- Age: ${profile.age}
- Country: ${profile.country}
- Education: ${profile.education}
- Dream: ${profile.dream || 'Not specified yet'}
- Interests: ${profile.interests?.join(", ") || 'Not specified yet'}
- Skills: ${profile.skills?.join(", ") || 'Not specified yet'}
- Goals: ${profile.goals?.join(", ") || 'Not specified yet'}
- Challenges: ${profile.challenges?.join(", ") || 'Not specified yet'}
`;

    // Format chat history for Gemini
    const contents = conversation.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in assessment-chat:", error);
    res.status(500).json({ error: error.message || "An error occurred with the AI Mentor." });
  }
});

// 2. Generate Roadmap Route (JSON Structured response)
app.post("/api/mentor/generate-roadmap", async (req, res) => {
  try {
    const { profile, conversation } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are Huwiyati (هويتي) AI Mentor. You must analyze the user's profile and onboarding conversation to create a highly personalized, empowering Roadmap of exactly 5 milestones.
Each milestone represents a step towards her ultimate dream, structured to build identity, confidence, and real-world skills.
Write everything in the user's selected language: ${profile.language || 'Arabic'}.

Your response must strictly match the following JSON Schema. Generate a chronological list of 5 milestones where milestone 1 is 'active' and milestones 2-5 are 'locked'. Make sure descriptions are deeply inspiring, actionable, and specific to her dream and country.`;

    const prompt = `User Profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Country: ${profile.country}
- Education: ${profile.education}
- Interests: ${profile.interests?.join(", ")}
- Dream: ${profile.dream}
- Skills: ${profile.skills?.join(", ")}
- Goals: ${profile.goals?.join(", ")}
- Challenges: ${profile.challenges?.join(", ")}

Assessment Conversation Highlights:
${conversation?.map((m: any) => `${m.sender}: ${m.text}`).join("\n") || "No conversation history."}

Generate the roadmap.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            milestones: {
              type: Type.ARRAY,
              description: "Chronological sequence of exactly 5 milestones guiding the user to her dream",
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "e.g. milestone_1, milestone_2..." },
                  title: { type: Type.STRING, description: "Empowering, beautiful title of the milestone" },
                  description: { type: Type.STRING, description: "Detail of the milestone's objectives and actions to complete" },
                  status: { type: Type.STRING, description: "Must be 'active' for the first milestone, and 'locked' for all others." },
                  category: {
                    type: Type.STRING,
                    description: "Category: 'Identity', 'Education', 'Leadership', 'Entrepreneurship', 'Creativity', 'Confidence'"
                  },
                  xpReward: { type: Type.INTEGER, description: "XP reward (100 to 300)" }
                },
                required: ["id", "title", "description", "status", "category", "xpReward"]
              }
            }
          },
          required: ["milestones"]
        }
      }
    });

    const roadmapData = JSON.parse(response.text || "{}");
    res.json(roadmapData);
  } catch (error: any) {
    console.error("Error generating roadmap:", error);
    res.status(500).json({ error: error.message || "Could not generate roadmap." });
  }
});

// 3. Generate Daily Content (JSON Structured response)
app.post("/api/mentor/generate-daily", async (req, res) => {
  try {
    const { profile } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are Huwiyati (هويتي) AI Mentor. Generate custom daily activities and content designed to inspire, motivate, and enrich the user's day based on her profile and country.
You must return your output in JSON matching the exact schema provided.
Write ALL content (motivation, stories, challenges, descriptions) in the user's selected language: ${profile.language || 'Arabic'}.
Ensure the 'inspiringStory' features an inspiring, real Arab woman (historical or contemporary).
Ensure 'heritage' is a beautiful lesson or highlight about Islamic or Arab science, art, literature, or inventions.
Ensure 'opportunity' is a tailored ficitonal or real development opportunity (e.g. Arab youth programs, workshops, local competitions).
Ensure 'mission' is an actionable small daily task.
Ensure 'challenge' is a fun and confidence-building interactive challenge.`;

    const prompt = `Generate daily content for:
- Name: ${profile.name}
- Age: ${profile.age}
- Country: ${profile.country}
- Education: ${profile.education}
- Interests: ${profile.interests?.join(", ")}
- Dream: ${profile.dream}
- Language: ${profile.language}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            motivation: { type: Type.STRING, description: "A warm morning greeting and beautiful personalized motivation" },
            mission: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING, description: "Unique daily mission ID e.g. mission_today" },
                title: { type: Type.STRING, description: "Actionable daily action title" },
                description: { type: Type.STRING, description: "Direct description of what she should do today" },
                category: { type: Type.STRING, description: "e.g. Identity, Growth, Skill" },
                xpReward: { type: Type.INTEGER }
              },
              required: ["id", "title", "description", "category", "xpReward"]
            },
            challenge: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Creative confidence challenge title" },
                description: { type: Type.STRING, description: "Step-by-step description of the interactive challenge" },
                xpReward: { type: Type.INTEGER }
              },
              required: ["title", "description", "xpReward"]
            },
            inspiringStory: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                womanName: { type: Type.STRING, description: "Name of an extraordinary real Arab woman" },
                era: { type: Type.STRING, description: "Era e.g. '8th Century', 'Modern'" },
                content: { type: Type.STRING, description: "Inspiring 3-4 sentence storytelling of her achievements and journey" }
              },
              required: ["title", "womanName", "era", "content"]
            },
            heritage: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                significance: { type: Type.STRING, description: "Why it matters to our identity" },
                content: { type: Type.STRING, description: "Highly engaging educational story/fact about Arab heritage, art, history or science" }
              },
              required: ["title", "significance", "content"]
            },
            opportunity: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                type: { type: Type.STRING, description: "Workshop, Scholarship, Competition, or Program" }
              },
              required: ["title", "description", "type"]
            },
            reflection: { type: Type.STRING, description: "An evening journal reflection question" }
          },
          required: ["motivation", "mission", "challenge", "inspiringStory", "heritage", "opportunity", "reflection"]
        }
      }
    });

    const dailyContent = JSON.parse(response.text || "{}");
    // Append a date stamp
    dailyContent.date = new Date().toISOString().split('T')[0];
    res.json(dailyContent);
  } catch (error: any) {
    console.error("Error generating daily content:", error);
    res.status(500).json({ error: error.message || "Could not generate daily activities." });
  }
});

// 4. Interactive AI Mentor Chat
app.post("/api/mentor/chat", async (req, res) => {
  try {
    const { profile, conversation, roadmap } = req.body;
    const ai = getGeminiClient();

    // Incorporate current completed milestones or badges into memory
    const activeMilestone = roadmap?.milestones?.find((m: any) => m.status === 'active');
    const completedMilestonesCount = roadmap?.milestones?.filter((m: any) => m.status === 'completed')?.length || 0;

    const systemInstruction = `
${SANA_BRAIN_INSTRUCTIONS}

You are conversing with the user who has opened her active chat workspace.
Write your response in her selected language: ${profile.language || 'Arabic'}.
Your tone should be deeply personalized, warm, patient, encouraging, and emotionally resonant.
Reference her profile details, progress, or accomplishments naturally to display long-term memory:
- Name: ${profile.name}
- Age: ${profile.age}
- Country: ${profile.country}
- Education: ${profile.education}
- Interests: ${profile.interests?.join(", ")}
- Ultimate Dream: ${profile.dream}
- Skills being developed: ${profile.skills?.join(", ")}
- Current Roadmap Level: ${roadmap?.currentLevel || 1}
- Completed Milestones: ${completedMilestonesCount} / 5
${activeMilestone ? `- Currently working on Milestone: "${activeMilestone.title}" (${activeMilestone.description})` : ''}

Memory and Conversation rule:
- Keep the response elegant, engaging, and digestible, usually between 2 to 4 sentences.
- Never give unsolicited system status or system logs.
- Focus on building her self-discovery, identity pride, or confidence.
- Ask thoughtful questions to guide her without deciding her path for her.
`;

    const contents = conversation.map((msg: any) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        temperature: 0.75,
      }
    });

    // --- COGNITIVE AI MEMORY EXTRACTION SYSTEM ---
    let extractedMemories = [];
    try {
      const latestUserMsg = conversation.filter((m: any) => m.sender === 'user').pop();
      if (latestUserMsg) {
        const memoryPrompt = `You are a warm, intelligent assistant extracting key insights to build a long-term memory for an Arab girl's AI Mentor (Sana).
Analyze this single message: "${latestUserMsg.text}"

Identify if she expressed any new:
- personal Goal (e.g., studying computer science, helping her community)
- Preference (e.g., enjoys reading, prefers group study)
- Skill (e.g., speaks Spanish, good at design)
- Achievement (e.g., won a competition, completed high school)
- Milestone (e.g., starting university, finished a major task)

If nothing of interest is mentioned, return an empty list of memories.
If something of interest is mentioned, extract it into the specified JSON schema.
Translate the content of the memory to the user's selected language: ${profile.language || 'ar'}.`;

        const memoryResponse = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: memoryPrompt,
          config: {
            systemInstruction: "You extract personal development insights into a structured format. Do not save trivial or unnecessary details.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                memories: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      memory_type: { type: Type.STRING, description: "Must be: 'Goal', 'Preference', 'Skill', 'Achievement', or 'Milestone'" },
                      content: { type: Type.STRING, description: "A concise 1-sentence description of the memory, in the user's language" },
                      importance_level: { type: Type.STRING, description: "Must be 'low', 'medium', or 'high'" }
                    },
                    required: ["memory_type", "content", "importance_level"]
                  }
                }
              },
              required: ["memories"]
            }
          }
        });
        const memData = JSON.parse(memoryResponse.text || "{}");
        if (memData.memories && Array.isArray(memData.memories)) {
          extractedMemories = memData.memories;
        }
      }
    } catch (memErr) {
      console.error("Error in memory extraction:", memErr);
    }

    res.json({ text: response.text, extractedMemories });
  } catch (error: any) {
    console.error("Error in mentor chat:", error);
    res.status(500).json({ error: error.message || "Error communicating with the mentor." });
  }
});

// 4a. Personality Analysis Engine
app.post("/api/mentor/analyze-personality", async (req, res) => {
  try {
    const { profile, conversation } = req.body;
    const ai = getGeminiClient();

    const systemInstruction = `You are Sana (سَنا), the AI Mentor. Analyze the user's profile and chat history to estimate her:
- Confidence level
- Creativity tendency
- Leadership potential
- Communication style
- Learning preferences
- Problem-solving approach

This is an AI-based reflection, not a professional psychological assessment. You must return your analysis in the selected language: ${profile.language || 'Arabic'}.
Your output must strictly match the following JSON Schema:`;

    const prompt = `User Profile:
- Name: ${profile.name}
- Age: ${profile.age}
- Country: ${profile.country}
- Dream: ${profile.dream}
- Interests: ${profile.interests?.join(", ")}
- Skills: ${profile.skills?.join(", ")}
- Goals: ${profile.goals?.join(", ")}
- Challenges: ${profile.challenges?.join(", ")}

Conversation History:
${conversation?.map((m: any) => `${m.sender}: ${m.text}`).join("\n") || "No chat history yet."}

Generate the personality analysis.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            confidence: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING, description: "e.g. High, Developing, Medium" },
                percentage: { type: Type.INTEGER, description: "Confidence score percentage (0-100)" },
                description: { type: Type.STRING, description: "Caring explanation of her confidence and how to build it further" }
              },
              required: ["level", "percentage", "description"]
            },
            creativity: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                percentage: { type: Type.INTEGER },
                description: { type: Type.STRING }
              },
              required: ["level", "percentage", "description"]
            },
            leadership: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                percentage: { type: Type.INTEGER },
                description: { type: Type.STRING }
              },
              required: ["level", "percentage", "description"]
            },
            communicationStyle: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "e.g. Empathetic, Assertive, Expressive" },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            },
            learningPreference: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "e.g. Visual & Creative, Practical & Action-oriented" },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            },
            problemSolving: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "e.g. Analytical Explorer, Intuitive Builder" },
                description: { type: Type.STRING }
              },
              required: ["title", "description"]
            },
            overallReflection: { type: Type.STRING, description: "A beautiful, uplifting overall synthesis of who this girl is, her unique potential, and encouragement to pursue her dream" },
            disclaimer: { type: Type.STRING, description: "Strict warning: 'This is an AI-based reflection to help you understand yourself better, not a professional assessment.'" }
          },
          required: [
            "confidence", "creativity", "leadership", 
            "communicationStyle", "learningPreference", 
            "problemSolving", "overallReflection", "disclaimer"
          ]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in analyze-personality:", error);
    res.status(500).json({ error: error.message || "Failed to analyze personality." });
  }
});

// 4b. Future Self Message Feature
app.post("/api/mentor/future-self", async (req, res) => {
  try {
    const { profile, roadmap } = req.body;
    const ai = getGeminiClient();

    const activeMilestone = roadmap?.milestones?.find((m: any) => m.status === 'active');
    const completedMilestonesCount = roadmap?.milestones?.filter((m: any) => m.status === 'completed')?.length || 0;

    const systemInstruction = `You are Sana (سَنا), the AI Mentor. You are generating a feature called "Message from my future self."
Write a highly emotional, inspiring, and beautiful letter written *as if* the user is reading a message written by her future successful self (e.g. 10 years in the future, when she has fully achieved her dream of becoming a ${profile.dream}).
The letter must:
- Be written in the first person from her Future Self ("I am you from the year 2036...").
- Call her by her name (${profile.name}).
- Warmly encourage her, reflect on her current growth and efforts.
- Connect her today's actions (like her current milestone: ${activeMilestone?.title || 'starting her journey'} and completed achievements) with her ultimate future success.
- Inspire her to cherish her Arab identity, values, and strengths.
- Speak in the selected language: ${profile.language || 'Arabic'}.
Your output must strictly match the following JSON Schema:`;

    const prompt = `Write the future-self letter for:
- Name: ${profile.name}
- Age: ${profile.age}
- Country: ${profile.country}
- Dream: ${profile.dream}
- Current level: ${roadmap?.currentLevel || 1}
- Completed milestones: ${completedMilestonesCount}/5
- Current active milestone: ${activeMilestone?.title || 'Initial discovery'}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            letter: { type: Type.STRING, description: "The complete beautifully formatted, emotional letter (use markdown and newlines for clean display)" },
            futureYear: { type: Type.STRING, description: "e.g. '2036' or 'عشر سنوات من الآن'" },
            achievedTitle: { type: Type.STRING, description: "The successful future title e.g. 'رائدة فضاء مبدعة' or 'مخترعة فخورة'" },
            keyEncouragement: { type: Type.STRING, description: "A short, memorable power-sentence summarizing the advice" }
          },
          required: ["letter", "futureYear", "achievedTitle", "keyEncouragement"]
        }
      }
    });

    res.json(JSON.parse(response.text || "{}"));
  } catch (error: any) {
    console.error("Error in future-self:", error);
    res.status(500).json({ error: error.message || "Failed to generate future self message." });
  }
});

function addWavHeader(pcmBuffer: Buffer, sampleRate: number = 24000): Buffer {
  const pcmLength = pcmBuffer.length;
  const header = Buffer.alloc(44);
  
  header.write("RIFF", 0); // ChunkID
  header.writeUInt32LE(36 + pcmLength, 4); // ChunkSize
  header.write("WAVE", 8); // Format
  header.write("fmt ", 12); // Subchunk1ID
  header.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
  header.writeUInt16LE(1, 20); // AudioFormat (1 for PCM)
  header.writeUInt16LE(1, 22); // NumChannels (1 for mono)
  header.writeUInt32LE(sampleRate, 24); // SampleRate
  header.writeUInt32LE(sampleRate * 2, 28); // ByteRate (sampleRate * channels * bitsPerSample/8)
  header.writeUInt16LE(2, 32); // BlockAlign (channels * bitsPerSample/8)
  header.writeUInt16LE(16, 34); // BitsPerSample (16 bits)
  header.write("data", 36); // Subchunk2ID
  header.writeUInt32LE(pcmLength, 40); // Subchunk2Size
  
  return Buffer.concat([header, pcmBuffer]);
}

// 5. Text To Speech (TTS) Route
app.post("/api/mentor/tts", async (req, res) => {
  try {
    const { text, language } = req.body;
    const ai = getGeminiClient();

    // Use gemini-3.1-flash-tts-preview to convert the text to speech
    // Give voice prompts to sound like a gentle Arab mentor.
    const prompt = `Perform high-quality Text-To-Speech. Speak warmly and gently as an Arab mentor. Here is the text:
${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            // Zephyr or Kore are soft and supportive
            prebuiltVoiceConfig: { voiceName: "Kore" },
          },
        },
      },
    });

    const inlineData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData;
    const base64Audio = inlineData?.data;
    const returnedMimeType = inlineData?.mimeType;

    console.log("Gemini TTS API returned MimeType:", returnedMimeType);

    if (base64Audio) {
      // Check if the returned audio is raw PCM and needs a WAV header
      const isRawPcm = !returnedMimeType || 
                       returnedMimeType.includes("pcm") || 
                       returnedMimeType.includes("l16") || 
                       returnedMimeType.includes("raw");

      if (isRawPcm) {
        console.log("Processing raw PCM audio: Prepending WAV header.");
        const pcmBuffer = Buffer.from(base64Audio, "base64");
        const wavBuffer = addWavHeader(pcmBuffer, 24000);
        const base64Wav = wavBuffer.toString("base64");
        res.json({ base64Audio: base64Wav, mimeType: "audio/wav" });
      } else {
        console.log("Using encoded audio format directly:", returnedMimeType);
        res.json({ base64Audio: base64Audio, mimeType: returnedMimeType });
      }
    } else {
      res.status(500).json({ error: "TTS generation failed to output audio." });
    }
  } catch (error: any) {
    console.error("Error in TTS:", error);
    res.status(500).json({ error: error.message || "Failed to generate speech." });
  }
});

// Serve frontend assets / SPA and listen
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Huwiyati AI Server is running on port ${PORT}`);
  });
}

startServer();
