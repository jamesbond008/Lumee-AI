export interface TrendData {
  trendScore: number;
  risingKeywords: string[];
  competitorAnalysis: string;
  pricingRecommendation: {
    min: number;
    max: number;
    currency: string;
  };
}

export interface DesignData {
  imageUrl: string;
  techPackId: string;
  estimatedCost: number;
}

export interface MarketingData {
  title: string;
  description: string;
  sellingPoints: string[];
  socialHook: string;
}

export interface AgentState {
  goal: string;
  isProcessing: boolean;
  currentStepIndex: number;
  language: 'en' | 'zh';
  steps: {
    id: string;
    label: string;
    status: 'idle' | 'processing' | 'done' | 'error';
    thoughts: string[];
    data?: any;
  }[];
}
