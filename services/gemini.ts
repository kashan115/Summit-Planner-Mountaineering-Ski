import { GoogleGenAI } from "@google/genai";
import { ClimbPlan, PlanRequest } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMountaineeringPlan = async (request: PlanRequest): Promise<ClimbPlan> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const prompt = `
    You are an expert mountaineering guide and trip planner.
    I need a comprehensive plan for ${request.activity} at "${request.destination}".
    Additional user context: "${request.details}".

    Please use Google Search to find real, up-to-date information regarding:
    1. The best or most standard route for this objective.
    2. Current or typical weather/avalanche patterns for this season.
    3. Permit requirements, parking passes, and regulations.
    4. Emergency contact info (nearest hospital, ranger station).
    5. Specific gear needed (e.g., 3-season vs 4-season boots, crevasse rescue gear, specific rack for rock climbing).

    RETURN FORMAT:
    You must return a valid JSON object wrapped in a markdown code block like \`\`\`json ... \`\`\`.
    
    The JSON object must strictly adhere to this structure:
    {
      "destination": "string",
      "activity": "string",
      "summary": "string (brief overview)",
      "difficulty": "string (rating e.g., Grade II, 5.9, etc)",
      "routeInfo": {
        "name": "string",
        "description": "string",
        "length": "string",
        "elevationGain": "string",
        "technicalNotes": "string"
      },
      "conditions": {
        "weatherSummary": "string",
        "avalancheRisk": "string (mention check local avalanche center)",
        "seasonality": "string"
      },
      "logistics": {
        "permits": "string",
        "parking": "string",
        "nearestTown": "string"
      },
      "emergency": {
        "nearestHospital": "string (name and location)",
        "rangerStation": "string (name and phone)",
        "emergencyPhone": "string"
      },
      "gearList": [
        {
          "categoryName": "string (e.g., Footwear, Technical Gear, Clothing)",
          "items": [
             { "item": "string", "reason": "string (why is this needed?)" }
          ]
        }
      ],
      "betaLinks": [
        { "title": "string", "url": "string", "description": "string" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We cannot use responseMimeType: 'application/json' with googleSearch, 
        // so we rely on the prompt to enforce JSON format in the text output.
      },
    });

    const textResponse = response.text || '';
    
    // Extract JSON from code block
    const jsonMatch = textResponse.match(/```json\n([\s\S]*?)\n```/) || textResponse.match(/```([\s\S]*?)```/);
    let parsedData: any = {};
    
    if (jsonMatch && jsonMatch[1]) {
      parsedData = JSON.parse(jsonMatch[1]);
    } else {
      // Fallback attempt to parse the whole string if no code blocks found
      try {
          parsedData = JSON.parse(textResponse);
      } catch (e) {
          console.error("Failed to parse JSON directly", e);
          throw new Error("The AI response was not valid JSON. Please try again.");
      }
    }

    // Extract Grounding Sources if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((chunk: any) => chunk.web ? { title: chunk.web.title, url: chunk.web.uri } : null)
      .filter((item: any) => item !== null);

    return {
      ...parsedData,
      groundingSources: sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};