import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeSkills(resumeText: string, jobDescription: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("API Key is missing. Please configure GEMINI_API_KEY.");
  }
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following Resume and Job Description.
    1. Extract skills from the Resume and assign a proficiency level (1-5).
    2. Extract required skills from the Job Description and assign a target level (1-5).
    3. Identify gaps where the Resume level is lower than the JD level or the skill is missing.
    4. Provide a reasoning for each gap.

    Resume:
    ${resumeText}

    Job Description:
    ${jobDescription}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          resumeSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ["Hard Skill", "Soft Skill"] }
              },
              required: ["name", "level", "type"]
            }
          },
          jobDescriptionSkills: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                level: { type: Type.NUMBER },
                type: { type: Type.STRING, enum: ["Hard Skill", "Soft Skill"] }
              },
              required: ["name", "level", "type"]
            }
          },
          gaps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                skill: { type: Type.STRING },
                currentLevel: { type: Type.NUMBER },
                targetLevel: { type: Type.NUMBER },
                reasoning: { type: Type.STRING }
              },
              required: ["skill", "currentLevel", "targetLevel", "reasoning"]
            }
          }
        },
        required: ["resumeSkills", "jobDescriptionSkills", "gaps"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateLearningPath(gaps: any[], courseCatalog: any[]) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Based on the following skill gaps and the available course catalog, generate a personalized learning path.
    Sequence the learning modules logically (e.g., prerequisites first).
    Group them into weeks.
    Provide a reasoning for each recommendation.

    Gaps:
    ${JSON.stringify(gaps)}

    Course Catalog:
    ${JSON.stringify(courseCatalog)}
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          overallReasoning: { type: Type.STRING },
          learningPath: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                week: { type: Type.STRING },
                modules: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      skill: { type: Type.STRING },
                      courseName: { type: Type.STRING },
                      reasoning: { type: Type.STRING },
                      learningResource: { type: Type.STRING }
                    },
                    required: ["skill", "courseName", "reasoning", "learningResource"]
                  }
                }
              },
              required: ["week", "modules"]
            }
          }
        },
        required: ["overallReasoning", "learningPath"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
}

export async function generateAudioSummary(text: string) {
  const model = "gemini-2.5-flash-preview-tts";
  
  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Summarize this learning path cheerfully for a commute: ${text}` }] }],
    config: {
      responseModalities: ["AUDIO"],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: "Zephyr" }
        }
      }
    }
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
}
