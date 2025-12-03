import { GoogleGenAI } from "@google/genai";
import { ClimbPlan, PlanRequest } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateMountaineeringPlan = async (request: PlanRequest): Promise<ClimbPlan> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Please check your environment configuration.");
  }

  const prompt = `
    You are an expert mountaineering guide and "Smart Climb" AI assistant.
    I need a comprehensive plan for ${request.activity} at "${request.destination}" planned for the month of **${request.month}**.
    Additional user context: "${request.details}".

    Please use Google Search to find real, up-to-date information regarding:
    1. The best or most standard route for this objective.
    2. Typical weather patterns and specific hazards for ${request.month}.
    3. Find specific links for NOAA (or local meteo), SpotWx, and local avalanche centers (e.g., NWAC, CAIC) to help the user analyze conditions.
    4. Driving instructions, trailhead name, and specific parking passes/permits required.
    5. Permit requirements (climbing/wilderness) and regulations.
    6. Emergency contact info (nearest hospital, ranger station).
    7. Specific gear needed for ${request.month} conditions.

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
      "decisionAid": {
        "monthlyAnalysis": "string (Specific analysis for climbing in ${request.month}. Is it prime season? Early/Late season issues?)",
        "goNoGoCriteria": ["string (e.g. 'Wind gusts > 30mph')", "string (e.g. 'New snow > 6 inches')"],
        "criticalHazards": ["string (e.g. 'Rockfall in afternoon')", "string (e.g. 'Open crevasses')"]
      },
      "driving": {
        "trailheadName": "string",
        "directions": "string (summary of drive and approach)",
        "passes": "string (e.g. NW Forest Pass, America the Beautiful, Sno-Park)"
      },
      "logistics": {
        "permits": "string (wilderness/climbing permits)",
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
        { "title": "string (e.g. NOAA Point Forecast, NWAC Avalanche)", "url": "string", "description": "string" }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
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