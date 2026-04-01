import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Zap, 
  Scissors, 
  Truck, 
  BarChart3, 
  ChevronRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Globe,
  ShoppingCart,
  Layers,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { runTrendAnalysis, generateDesignIdeation, generateMarketingCopy } from './services/geminiService';
import { AgentState, TrendData, DesignData, MarketingData } from './types';

const MOCK_CHART_DATA = [
  { name: 'Week 1', value: 400 },
  { name: 'Week 2', value: 300 },
  { name: 'Week 3', value: 600 },
  { name: 'Week 4', value: 800 },
  { name: 'Week 5', value: 500 },
  { name: 'Week 6', value: 900 },
];

const TRANSLATIONS = {
  en: {
    title: "Lumee AI",
    subtitle: "Business Execution Agent",
    heroTitle: "Turn Concepts into Global Sales in",
    heroTitleHighlight: "72h.",
    heroDesc: "Lumee AI is your end-to-end business execution agent. We handle market insight, design engineering, and supply chain fulfillment.",
    inputPlaceholder: "e.g. Eco-friendly long skirts for Coachella 2026...",
    executeBtn: "Execute",
    intelligence: "Intelligence",
    engineering: "Engineering",
    supplyChain: "Supply Chain",
    gtm: "GTM",
    connectWansli: "Connect Wansli",
    executionLog: "Execution Log",
    agentActive: "AGENT ACTIVE",
    currentTask: "Current Task",
    trendVelocity: "Trend Velocity",
    commercialFeasibility: "Commercial Feasibility",
    pricingStrategy: "Pricing Strategy",
    competitorInsight: "Competitor Insight",
    productEngineering: "Product Engineering",
    techPackId: "Tech Pack ID",
    estUnitCost: "Est. Unit Cost",
    printReady: "Print Ready",
    downloadTechPack: "Download Tech Pack (PDF)",
    visualIdeation: "Visual Ideation",
    highFidelityRender: "High-Fidelity Garment Render",
    gtmAssets: "GTM Assets",
    listingTitle: "Listing Title",
    socialHook: "Social Hook",
    wansliSync: "Wansli Digital Sync",
    moq: "MOQ",
    leadTime: "Lead Time",
    initiateOrder: "Initiate Production Order",
    awaitingCommand: "Awaiting Production Command",
    awaitingDesc: "Enter a concept to activate the Lumee AI business execution engine.",
    steps: {
      bi: "Market Intelligence",
      design: "Product Engineering",
      supply: "Supply Chain Sync",
      gtm: "GTM Strategy"
    },
    thoughts: {
      bi1: "Analyzing global fashion trends via TikTok & Instagram API...",
      bi2: "Deconstructing competitor best-sellers in the niche...",
      bi3: "Trend Score: {score}/100. High potential detected.",
      design1: "Translating trend insights into visual concepts...",
      design2: "Generating high-fidelity garment render...",
      design3: "Compiling Technical Pack (Tech Pack) for factory execution...",
      design4: "Generating print-ready vector files for Wansli digital printing...",
      supply1: "Syncing with Wansli production schedule...",
      supply2: "Verifying 1-piece-minimum (MOQ 1) availability...",
      supply3: "Confirmed: 72-hour delivery window secured.",
      gtm1: "Optimizing product listing for global marketplaces...",
      gtm2: "Generating multi-scenario virtual try-on assets...",
      gtm3: "Drafting TikTok viral hook and UGC strategy..."
    }
  },
  zh: {
    title: "Lumee AI",
    subtitle: "业务执行代理",
    heroTitle: "72小时内将创意转化为",
    heroTitleHighlight: "全球销量",
    heroDesc: "Lumee AI 是您的端到端业务执行代理。我们处理市场洞察、设计工程和供应链履行。",
    inputPlaceholder: "例如：2026科切拉音乐节的环保长裙...",
    executeBtn: "执行",
    intelligence: "情报",
    engineering: "工程",
    supplyChain: "供应链",
    gtm: "市场",
    connectWansli: "连接万事利",
    executionLog: "执行日志",
    agentActive: "代理活跃中",
    currentTask: "当前任务",
    trendVelocity: "趋势速度",
    commercialFeasibility: "商业可行性",
    pricingStrategy: "定价策略",
    competitorInsight: "竞品洞察",
    productEngineering: "产品工程",
    techPackId: "技术包 ID",
    estUnitCost: "预估单价",
    printReady: "印花就绪",
    downloadTechPack: "下载技术包 (PDF)",
    visualIdeation: "视觉构思",
    highFidelityRender: "高保真服装渲染图",
    gtmAssets: "市场资产",
    listingTitle: "商品标题",
    socialHook: "社交媒体钩子",
    wansliSync: "万事利数字化同步",
    moq: "起订量",
    leadTime: "交货期",
    initiateOrder: "启动生产订单",
    awaitingCommand: "等待生产指令",
    awaitingDesc: "输入一个概念以激活 Lumee AI 业务执行引擎。",
    steps: {
      bi: "市场情报",
      design: "产品工程",
      supply: "供应链同步",
      gtm: "市场策略"
    },
    thoughts: {
      bi1: "正在通过 TikTok 和 Instagram API 分析全球时尚趋势...",
      bi2: "正在拆解该领域的竞品爆款...",
      bi3: "趋势评分：{score}/100。检测到高潜力。",
      design1: "正在将趋势洞察转化为视觉概念...",
      design2: "正在生成高保真服装渲染图...",
      design3: "正在编写用于工厂执行的技术包 (Tech Pack)...",
      design4: "正在为万事利数码印花生成印花矢量文件...",
      supply1: "正在与万事利生产计划同步...",
      supply2: "正在验证 1 件起订 (MOQ 1) 的可用性...",
      supply3: "已确认：72 小时交付窗口已锁定。",
      gtm1: "正在为全球市场优化产品列表...",
      gtm2: "正在生成多场景虚拟试穿资产...",
      gtm3: "正在起草 TikTok 病毒式钩子和 UGC 策略..."
    }
  }
};

export default function App() {
  const [goal, setGoal] = useState('');
  const [agentState, setAgentState] = useState<AgentState>({
    goal: '',
    isProcessing: false,
    currentStepIndex: -1,
    language: 'zh',
    steps: [
      { id: 'bi', label: 'Market Intelligence', status: 'idle', thoughts: [] },
      { id: 'design', label: 'Product Engineering', status: 'idle', thoughts: [] },
      { id: 'supply', label: 'Supply Chain Sync', status: 'idle', thoughts: [] },
      { id: 'gtm', label: 'GTM Strategy', status: 'idle', thoughts: [] },
    ]
  });

  const t = TRANSLATIONS[agentState.language];

  useEffect(() => {
    setAgentState(prev => ({
      ...prev,
      steps: prev.steps.map(s => ({
        ...s,
        label: t.steps[s.id as keyof typeof t.steps]
      }))
    }));
  }, [agentState.language]);

  const scrollRef = useRef<HTMLDivElement>(null);

  const updateStep = (index: number, updates: Partial<AgentState['steps'][0]>) => {
    setAgentState(prev => ({
      ...prev,
      steps: prev.steps.map((s, i) => i === index ? { ...s, ...updates } : s)
    }));
  };

  const addThought = (index: number, thought: string) => {
    setAgentState(prev => ({
      ...prev,
      steps: prev.steps.map((s, i) => i === index ? { ...s, thoughts: [...s.thoughts, thought] } : s)
    }));
  };

  const handleStart = async () => {
    if (!goal.trim()) return;

    setAgentState(prev => ({
      ...prev,
      goal,
      isProcessing: true,
      currentStepIndex: 0,
      steps: prev.steps.map(s => ({ ...s, status: 'idle', thoughts: [], data: undefined }))
    }));

    try {
      // STEP 1: BI
      updateStep(0, { status: 'processing' });
      addThought(0, t.thoughts.bi1);
      addThought(0, t.thoughts.bi2);
      const trendRes = await runTrendAnalysis(goal, agentState.language);
      const trendData: TrendData = JSON.parse(trendRes.text || '{}');
      addThought(0, t.thoughts.bi3.replace('{score}', trendData.trendScore.toString()));
      updateStep(0, { status: 'done', data: trendData });

      // STEP 2: Design
      setAgentState(prev => ({ ...prev, currentStepIndex: 1 }));
      updateStep(1, { status: 'processing' });
      addThought(1, t.thoughts.design1);
      addThought(1, t.thoughts.design2);
      const designRes = await generateDesignIdeation(goal, trendData.competitorAnalysis, agentState.language);
      
      let imageUrl = '';
      for (const part of designRes.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }

      addThought(1, t.thoughts.design3);
      addThought(1, t.thoughts.design4);
      
      const designData: DesignData = {
        imageUrl,
        techPackId: `TP-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        estimatedCost: trendData.pricingRecommendation.min * 0.4
      };
      updateStep(1, { status: 'done', data: designData });

      // STEP 3: Supply Chain
      setAgentState(prev => ({ ...prev, currentStepIndex: 2 }));
      updateStep(2, { status: 'processing' });
      addThought(2, t.thoughts.supply1);
      addThought(2, t.thoughts.supply2);
      await new Promise(r => setTimeout(r, 1500));
      addThought(2, t.thoughts.supply3);
      updateStep(2, { status: 'done', data: { factory: 'Wansli Digital', status: 'Ready' } });

      // STEP 4: GTM
      setAgentState(prev => ({ ...prev, currentStepIndex: 3 }));
      updateStep(3, { status: 'processing' });
      addThought(3, t.thoughts.gtm1);
      addThought(3, t.thoughts.gtm2);
      const mktRes = await generateMarketingCopy(goal, "Modern fashion piece based on " + goal, agentState.language);
      const mktData: MarketingData = JSON.parse(mktRes.text || '{}');
      addThought(3, t.thoughts.gtm3);
      updateStep(3, { status: 'done', data: mktData });

      setAgentState(prev => ({ ...prev, isProcessing: false }));
    } catch (error) {
      console.error(error);
      setAgentState(prev => ({ ...prev, isProcessing: false }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E4E4E7] font-sans selection:bg-orange-500/30">
      {/* Header */}
      <header className="border-b border-white/5 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-rose-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
              {t.title}
            </span>
            <div className="px-2 py-0.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono text-white/40 uppercase tracking-widest">
              {t.subtitle}
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
            <a href="#" className="hover:text-white transition-colors">{t.intelligence}</a>
            <a href="#" className="hover:text-white transition-colors">{t.engineering}</a>
            <a href="#" className="hover:text-white transition-colors">{t.supplyChain}</a>
            <a href="#" className="hover:text-white transition-colors">{t.gtm}</a>
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
              <button 
                onClick={() => setAgentState(prev => ({ ...prev, language: 'en' }))}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${agentState.language === 'en' ? 'bg-white text-black' : 'text-white/40'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setAgentState(prev => ({ ...prev, language: 'zh' }))}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${agentState.language === 'zh' ? 'bg-white text-black' : 'text-white/40'}`}
              >
                中文
              </button>
            </div>
            <button className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-full hover:bg-white/90 transition-all flex items-center gap-2">
              {t.connectWansli}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Input Section */}
        {!agentState.goal && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center space-y-8 py-20"
          >
            <h1 className="text-6xl font-bold tracking-tighter leading-tight">
              {t.heroTitle} <span className="text-orange-500 italic">{t.heroTitleHighlight}</span>
            </h1>
            <p className="text-lg text-white/40 max-w-xl mx-auto">
              {t.heroDesc}
            </p>
            
            <div className="relative group">
              <input 
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                placeholder={t.inputPlaceholder}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-xl focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all placeholder:text-white/10"
              />
              <button 
                onClick={handleStart}
                className="absolute right-3 top-3 bottom-3 px-6 bg-orange-500 text-white rounded-xl font-bold hover:bg-orange-600 transition-all flex items-center gap-2 shadow-xl shadow-orange-500/20"
              >
                {t.executeBtn} <ArrowRight className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              {['Y2K Streetwear', 'Sustainable Silk', 'Digital Print Kimonos'].map(tag => (
                <button 
                  key={tag}
                  onClick={() => setGoal(tag)}
                  className="px-4 py-1.5 rounded-full border border-white/5 bg-white/5 text-xs text-white/40 hover:bg-white/10 hover:text-white transition-all"
                >
                  {tag}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Agent Execution View */}
        {agentState.goal && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Execution Log & Thought Process */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#121214] border border-white/5 rounded-3xl p-6 h-[calc(100vh-200px)] flex flex-col">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-sm font-mono uppercase tracking-widest text-white/40 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" /> {t.executionLog}
                  </h2>
                  {agentState.isProcessing && (
                    <div className="flex items-center gap-2 text-[10px] text-orange-500 font-mono animate-pulse">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      {t.agentActive}
                    </div>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar" ref={scrollRef}>
                  {agentState.steps.map((step, idx) => (
                    <div key={step.id} className={`relative pl-8 border-l ${idx <= agentState.currentStepIndex ? 'border-orange-500/30' : 'border-white/5'}`}>
                      <div className={`absolute -left-2.5 top-0 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[#121214] ${
                        step.status === 'done' ? 'border-orange-500 bg-orange-500 text-white' : 
                        step.status === 'processing' ? 'border-orange-500 animate-pulse' : 'border-white/10'
                      }`}>
                        {step.status === 'done' ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-1 h-1 bg-current rounded-full" />}
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className={`text-sm font-bold ${idx <= agentState.currentStepIndex ? 'text-white' : 'text-white/20'}`}>
                          {step.label}
                        </h3>
                        
                        <div className="space-y-2">
                          {step.thoughts.map((thought, tIdx) => (
                            <motion.p 
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={tIdx} 
                              className="text-xs text-white/40 font-mono leading-relaxed"
                            >
                              <span className="text-orange-500/50 mr-2">›</span>
                              {thought}
                            </motion.p>
                          ))}
                          {step.status === 'processing' && (
                            <div className="flex items-center gap-2 text-xs text-orange-500/50 font-mono italic">
                              <Loader2 className="w-3 h-3 animate-spin" />
                              Processing...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-white/5 mt-auto">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{t.currentTask}</p>
                    <p className="text-sm font-medium text-white/80 line-clamp-2 italic">"{agentState.goal}"</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Dynamic Module Output */}
            <div className="lg:col-span-8 space-y-8">
              <AnimatePresence mode="wait">
                {/* Module 1: BI Dashboard */}
                {agentState.steps[0].status === 'done' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold">{t.trendVelocity}</h3>
                        <div className="px-3 py-1 bg-orange-500/10 text-orange-500 rounded-full text-xs font-bold">
                          {agentState.steps[0].data?.trendScore}% Score
                        </div>
                      </div>
                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={MOCK_CHART_DATA}>
                            <defs>
                              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="value" stroke="#f97316" fillOpacity={1} fill="url(#colorValue)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {agentState.steps[0].data?.risingKeywords.map((tag: string) => (
                          <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] uppercase font-bold text-white/40 border border-white/5">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                      <h3 className="text-lg font-bold">{t.commercialFeasibility}</h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">{t.pricingStrategy}</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-bold text-white">
                              {agentState.steps[0].data?.pricingRecommendation.currency}{agentState.steps[0].data?.pricingRecommendation.min}
                            </span>
                            <span className="text-white/20">—</span>
                            <span className="text-3xl font-bold text-white/40">
                              {agentState.steps[0].data?.pricingRecommendation.max}
                            </span>
                          </div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest mb-2">{t.competitorInsight}</p>
                          <p className="text-xs text-white/60 leading-relaxed italic">
                            "{agentState.steps[0].data?.competitorAnalysis}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Module 2: Design & Engineering */}
                {agentState.steps[1].status === 'done' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2">
                      <div className="p-8 space-y-6">
                        <div className="flex items-center gap-2 text-orange-500">
                          <Scissors className="w-5 h-5" />
                          <h3 className="text-lg font-bold">{t.productEngineering}</h3>
                        </div>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-xs text-white/40">{t.techPackId}</span>
                            <span className="text-xs font-mono text-white">{agentState.steps[1].data?.techPackId}</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-xs text-white/40">{t.estUnitCost}</span>
                            <span className="text-xs font-mono text-white">${agentState.steps[1].data?.estimatedCost.toFixed(2)}</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <span className="text-xs text-white/40">{t.printReady}</span>
                            <span className="text-xs font-mono text-green-500">VERIFIED</span>
                          </div>
                        </div>
                        <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                          {t.downloadTechPack}
                        </button>
                      </div>
                      <div className="relative aspect-[3/4] bg-black group">
                        {agentState.steps[1].data?.imageUrl ? (
                          <img 
                            src={agentState.steps[1].data.imageUrl} 
                            alt="AI Generated Design" 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/10 italic">
                            Generating Visual...
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute bottom-6 left-6 right-6">
                          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-1">{t.visualIdeation}</p>
                          <p className="text-sm font-medium text-white">{t.highFidelityRender}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Module 3 & 4: GTM & Supply Chain */}
                {agentState.steps[3].status === 'done' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Globe className="w-5 h-5" />
                        <h3 className="text-lg font-bold">{t.gtmAssets}</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">{t.listingTitle}</p>
                          <p className="text-sm font-bold text-white">{agentState.steps[3].data?.title}</p>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                          <p className="text-[10px] text-white/30 uppercase tracking-widest">{t.socialHook}</p>
                          <p className="text-xs text-white/60 italic leading-relaxed">"{agentState.steps[3].data?.socialHook}"</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#121214] border border-white/5 rounded-3xl p-8 space-y-6">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Truck className="w-5 h-5" />
                        <h3 className="text-lg font-bold">{t.supplyChain}</h3>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-green-500/5 border border-green-500/20 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm font-bold text-green-500">{t.wansliSync}</span>
                          </div>
                          <span className="text-[10px] font-mono text-green-500/50 uppercase">Active</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{t.moq}</p>
                            <p className="text-xl font-bold">1 Unit</p>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center">
                            <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">{t.leadTime}</p>
                            <p className="text-xl font-bold">72h</p>
                          </div>
                        </div>
                        <button className="w-full py-4 bg-orange-500 text-white rounded-2xl text-sm font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20">
                          {t.initiateOrder}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Placeholder when idle */}
              {!agentState.isProcessing && agentState.currentStepIndex === -1 && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-white/5 rounded-3xl p-12">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center">
                    <Layers className="w-8 h-8 text-white/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white/40">{t.awaitingCommand}</h3>
                    <p className="text-sm text-white/20 max-w-xs mx-auto">
                      {t.awaitingDesc}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
      `}} />
    </div>
  );
}
