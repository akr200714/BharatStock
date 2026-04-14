import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface StockAnalysis {
  recommendation: 'BUY' | 'SELL' | 'HOLD';
  confidence: number;
  summary: string;
  technicalPoints: string[];
  fundamentalPoints: string[];
  risks: string[];
}

export async function analyzeStock(symbol: string, companyName: string): Promise<StockAnalysis> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the Indian stock ${symbol} (${companyName}) based on current market trends (April 2026), international news, and typical fundamentals. Provide a recommendation.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING, enum: ['BUY', 'SELL', 'HOLD'] },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            technicalPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            fundamentalPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ['recommendation', 'confidence', 'summary', 'technicalPoints', 'fundamentalPoints', 'risks']
        }
      }
    });

    if (!response.text) throw new Error("No response from Gemini");
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return {
      recommendation: 'HOLD',
      confidence: 0.5,
      summary: "Unable to perform real-time analysis at this moment. Please check back later.",
      technicalPoints: ["Data unavailable"],
      fundamentalPoints: ["Data unavailable"],
      risks: ["Market volatility"]
    };
  }
}

export async function getMarketNews() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Provide a summary of the top 5 news events affecting the Indian stock market today (April 2026), including international events like Fed rates or global tensions.",
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              impact: { type: Type.STRING, enum: ['POSITIVE', 'NEGATIVE', 'NEUTRAL'] },
              summary: { type: Type.STRING },
              category: { type: Type.STRING }
            },
            required: ['title', 'impact', 'summary', 'category']
          }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("News Fetch Error:", error);
    return [];
  }
}
