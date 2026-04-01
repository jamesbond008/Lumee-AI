import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface AgentStep {
  id: string;
  title: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  thoughtProcess: string[];
  result?: any;
}

export const runTrendAnalysis = async (goal: string, language: 'en' | 'zh' = 'en'): Promise<GenerateContentResponse> => {
  const prompt = language === 'zh' 
    ? `分析此目标的时尚趋势: "${goal}"。
    提供 JSON 响应，包含:
    1. trendScore (0-100)
    2. risingKeywords (字符串数组)
    3. competitorAnalysis (简短文本，中文)
    4. pricingRecommendation (对象，包含 min, max, currency)`
    : `Analyze fashion trends for this goal: "${goal}". 
    Provide a JSON response with:
    1. trendScore (0-100)
    2. risingKeywords (array)
    3. competitorAnalysis (short text)
    4. pricingRecommendation (object with min, max, currency)`;

  return await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          trendScore: { type: Type.NUMBER },
          risingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          competitorAnalysis: { type: Type.STRING },
          pricingRecommendation: {
            type: Type.OBJECT,
            properties: {
              min: { type: Type.NUMBER },
              max: { type: Type.NUMBER },
              currency: { type: Type.STRING }
            }
          }
        }
      }
    }
  });
};

export const generateDesignIdeation = async (goal: string, insights: string, language: 'en' | 'zh' = 'en'): Promise<GenerateContentResponse> => {
  const prompt = language === 'zh'
    ? `为以下目标创建高端时尚设计视觉稿: ${goal}。背景信息: ${insights}。设计应专业、前卫且可投入生产。`
    : `Create a high-end fashion design visual for: ${goal}. Context: ${insights}. The design should be professional, trend-forward, and ready for production.`;

  return await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      imageConfig: {
        aspectRatio: "3:4"
      }
    }
  });
};

export const generateMarketingCopy = async (goal: string, designDescription: string, language: 'en' | 'zh' = 'en'): Promise<GenerateContentResponse> => {
  const prompt = language === 'zh'
    ? `为以下目标生成高转化率的产品列表: ${goal}。
    设计细节: ${designDescription}。
    包含:
    1. 产品标题 (中文)
    2. 引人入胜的描述 (中文)
    3. 3 个核心卖点 (中文数组)
    4. 社交媒体钩子 (TikTok/Instagram, 中文)`
    : `Generate a high-conversion product listing for: ${goal}. 
    Design details: ${designDescription}.
    Include:
    1. Product Title
    2. Compelling Description
    3. 3 Key Selling Points
    4. Social Media Hook (TikTok/Instagram)`;

  return await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          sellingPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          socialHook: { type: Type.STRING }
        }
      }
    }
  });
};
