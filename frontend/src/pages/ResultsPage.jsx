import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Brain, Check, Download, Rocket, Save, Sparkles, Users, AlertTriangle, BarChart3, ThumbsUp, ThumbsDown, RotateCcw, DollarSign, Target, PieChart, TrendingUp, BookOpen, User, Heart, ShoppingCart, Smile, Globe, Search, Layers, Lightbulb } from 'lucide-react';
import { AppNav } from '../components/PageShell.jsx';
import { generateIdeas, generatePlan, savePlan, generateFirst100Customers, saveCustomerStrategy, generateDecisionEngine, saveDecisionReport, generateBusinessPlan, saveBusinessPlan, generateCustomerInsights, saveCustomerInsights, generateMarketIntelligence, saveMarketIntelligence, createSavedIdea } from '../services/api.js';
import { getSession, readValue, saveValue } from '../services/storage.js';

function Score({ label, value }) {
  const pct = Math.max(0, Math.min(100, Number(value || 0) * 10));
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">{label}</span>
        <span className="text-[10px] font-black text-[#0A0A0A]">{Number(value || 0).toFixed(1)}</span>
      </div>
      <div className="h-2 border border-[#0A0A0A] bg-[#F5F3EE]">
        <div className="h-full bg-[#0A0A0A]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ListBlock({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="border-2 border-[#0A0A0A] p-5 bg-white">
      <h3 className="text-xs font-black uppercase tracking-widest mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-3 text-sm text-[#3A3A3A]">
            <Check className="h-4 w-4 text-[#0A0A0A] shrink-0 mt-0.5" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LoadingSkeleton({ title, items }) {
  return (
    <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-4 mb-4">
      <p className="text-[10px] font-black uppercase tracking-widest mb-3">{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {items.map((item) => (
          <div key={item} className="border-2 border-[#0A0A0A] bg-white p-3 text-center">
            <p className="text-[10px] font-black uppercase tracking-wide">{item}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const navigate = useNavigate();
  const profile = readValue('profile');
  const analysis = readValue('analysis');
  const [ideas, setIdeas] = useState(readValue('ideas', []));
  const cachedPlan = readValue('plan');
  const [selectedIdea, setSelectedIdea] = useState(readValue('selectedIdea', ideas[0] || null));
  const [plan, setPlan] = useState(cachedPlan);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [customerPlan, setCustomerPlan] = useState(readValue('customerPlan'));
  const [loadingCustomer, setLoadingCustomer] = useState(false);
  const [savingCustomer, setSavingCustomer] = useState(false);
  const [decisionReport, setDecisionReport] = useState(readValue('decisionReport'));
  const [loadingDecision, setLoadingDecision] = useState(false);
  const [savingDecision, setSavingDecision] = useState(false);
  const [businessPlan, setBusinessPlan] = useState(readValue('businessPlan'));
  const [loadingBusinessPlan, setLoadingBusinessPlan] = useState(false);
  const [savingBusinessPlan, setSavingBusinessPlan] = useState(false);
  const [businessPlanTab, setBusinessPlanTab] = useState('bmc');
  const [customerInsights, setCustomerInsights] = useState(readValue('customerInsights'));
  const [loadingCustomerInsights, setLoadingCustomerInsights] = useState(false);
  const [savingCustomerInsights, setSavingCustomerInsights] = useState(false);
  const [customerInsightsTab, setCustomerInsightsTab] = useState('personas');
  const [marketIntelligence, setMarketIntelligence] = useState(readValue('marketIntelligence'));
  const [loadingMarketIntel, setLoadingMarketIntel] = useState(false);
  const [savingMarketIntel, setSavingMarketIntel] = useState(false);
  const [savingIdea, setSavingIdea] = useState(false);
  const [marketIntelTab, setMarketIntelTab] = useState('size');
  const topIdea = useMemo(() => {
    return [...ideas].sort((a, b) => Number(b.opportunity_score || 0) - Number(a.opportunity_score || 0))[0];
  }, [ideas]);
  const averageScore = useMemo(() => {
    if (!ideas.length) return 0;
    return ideas.reduce((sum, idea) => sum + Number(idea.opportunity_score || 0), 0) / ideas.length;
  }, [ideas]);

  const planText = useMemo(() => (plan ? JSON.stringify(plan, null, 2) : ''), [plan]);
  const markdownText = useMemo(() => {
    if (!plan) return '';
    const lines = [
      `# ${plan.startup_name}`,
      '',
      `**Pitch:** ${plan.pitch}`,
      '',
      '## Problem',
      plan.problem,
      '',
      '## Solution',
      plan.solution,
      '',
      '## MVP Features',
      ...(plan.mvp_features || []).map((item) => `- ${item}`),
      '',
      '## Roadmap',
      ...(plan.roadmap || []).map((item) => `- Week ${item.week}: ${item.title} - ${(item.tasks || []).join(', ')}`),
      '',
      '## Revenue Model',
      JSON.stringify(plan.revenue_model || {}, null, 2),
      '',
      '## Risks',
      ...(plan.risks || []).map((item) => `- ${item}`),
    ];
    return lines.join('\n');
  }, [plan]);

  if (!profile || !ideas.length) {
    return (
      <main className="min-h-screen bg-[#F5F3EE] text-[#0A0A0A]">
        <AppNav />
        <section className="pt-32 px-6 max-w-3xl mx-auto">
          <div className="border-2 border-[#0A0A0A] bg-white p-8">
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#6A6A6A] mb-3">No Results</p>
            <h1 className="text-4xl font-black uppercase leading-none mb-4">Generate ideas first.</h1>
            <Link to="/input" className="h-12 px-8 inline-flex items-center gap-2 bg-[#0A0A0A] text-[#F5F3EE] border-2 border-[#0A0A0A] text-xs font-black uppercase tracking-widest hover:bg-white hover:text-[#0A0A0A] transition-colors">
              Start Form <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
    );
  }

  async function handlePlan() {
    setError('');
    setNotice('');
    setLoadingPlan(true);
    try {
      const nextPlan = await generatePlan(profile, selectedIdea);
      setPlan(nextPlan);
      saveValue('selectedIdea', selectedIdea);
      saveValue('plan', nextPlan);
      setNotice('Full startup plan generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingPlan(false);
    }
  }

  async function handleSave() {
    if (!plan) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this plan to your dashboard.');
      return;
    }
    setSaving(true);
    try {
      const result = await savePlan(profile, plan);
      setNotice(result.message || 'Plan saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveToIdeas() {
    if (!selectedIdea) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this idea.');
      return;
    }
    setSavingIdea(true);
    try {
      await createSavedIdea({
        title: selectedIdea.startup_name || 'Untitled Idea',
        description: selectedIdea.pitch || '',
        idea_data: selectedIdea,
        analysis: analysis || {},
        plan: plan || {},
        profile: profile || {},
      });
      setNotice('Idea saved! Access it from any feature page.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingIdea(false);
    }
  }

  async function handleRegenerateIdeas() {
    setError('');
    setNotice('');
    setRegenerating(true);
    try {
      const nextIdeas = await generateIdeas(profile);
      setIdeas(nextIdeas);
      setSelectedIdea(nextIdeas[0] || null);
      setPlan(null);
      saveValue('ideas', nextIdeas);
      saveValue('selectedIdea', nextIdeas[0] || null);
      saveValue('plan', null);
      setNotice('Startup ideas regenerated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setRegenerating(false);
    }
  }

  async function handleFirst100Customers() {
    if (!selectedIdea) return;
    setError('');
    setNotice('');
    setLoadingCustomer(true);
    try {
      const data = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        problem: selectedIdea.problem,
        solution: selectedIdea.solution,
        target_users: selectedIdea.target_users,
        mvp_features: selectedIdea.mvp_features,
        competitors: selectedIdea.competitors || [],
        industry: profile?.preferred_industry || '',
      };
      const result = await generateFirst100Customers(data);
      setCustomerPlan(result);
      saveValue('customerPlan', result);
      setNotice('First 100 Customers strategy generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingCustomer(false);
    }
  }

  async function handleSaveCustomerPlan() {
    if (!customerPlan || !selectedIdea) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this strategy to your dashboard.');
      return;
    }
    setSavingCustomer(true);
    try {
      const ideaContext = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        industry: profile?.preferred_industry || '',
      };
      const result = await saveCustomerStrategy(customerPlan, ideaContext);
      setNotice(result.message || 'Strategy saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingCustomer(false);
    }
  }

  async function handleDecisionEngine() {
    if (!selectedIdea) return;
    setError('');
    setNotice('');
    setLoadingDecision(true);
    try {
      const data = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        problem: selectedIdea.problem,
        solution: selectedIdea.solution,
        target_users: selectedIdea.target_users,
        industry: profile?.preferred_industry || '',
        mvp_features: plan?.mvp_features || selectedIdea.mvp_features || [],
        competitors: plan?.competitors || selectedIdea.competitors || [],
        market_demand: Number(analysis?.market_demand_score || 0),
        uniqueness: Number(analysis?.uniqueness_score || 0),
        feasibility: Number(analysis?.feasibility_score || 0),
        revenue_potential: Number(analysis?.revenue_potential_score || 0),
        risks: plan?.risks || analysis?.risks || [],
      };
      const result = await generateDecisionEngine(data);
      setDecisionReport(result);
      saveValue('decisionReport', result);
      setNotice('Decision report generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingDecision(false);
    }
  }

  async function handleSaveDecisionReport() {
    if (!decisionReport || !selectedIdea) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this report to your dashboard.');
      return;
    }
    setSavingDecision(true);
    try {
      const ideaContext = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        industry: profile?.preferred_industry || '',
      };
      const result = await saveDecisionReport(decisionReport, ideaContext);
      setNotice(result.message || 'Report saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingDecision(false);
    }
  }

  async function handleBusinessPlan() {
    if (!selectedIdea) return;
    setError('');
    setNotice('');
    setLoadingBusinessPlan(true);
    try {
      const planData = plan || {};
      const data = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        problem: selectedIdea.problem,
        solution: selectedIdea.solution,
        target_users: selectedIdea.target_users,
        industry: profile?.preferred_industry || '',
        mvp_features: planData.mvp_features || selectedIdea.mvp_features || [],
        competitors: planData.competitors || selectedIdea.competitors || [],
        market_demand: Number(analysis?.market_demand_score || 0),
        uniqueness: Number(analysis?.uniqueness_score || 0),
        feasibility: Number(analysis?.feasibility_score || 0),
        revenue_potential: Number(analysis?.revenue_potential_score || 0),
        risks: planData.risks || analysis?.risks || [],
        monetization_model: analysis?.monetization_model || '',
        revenue_model_type: planData?.revenue_model?.pricing_model || '',
      };
      const result = await generateBusinessPlan(data);
      setBusinessPlan(result);
      saveValue('businessPlan', result);
      setBusinessPlanTab('bmc');
      setNotice('Business plan generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingBusinessPlan(false);
    }
  }

  async function handleSaveBusinessPlan() {
    if (!businessPlan || !selectedIdea) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this plan to your dashboard.');
      return;
    }
    setSavingBusinessPlan(true);
    try {
      const ideaContext = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        industry: profile?.preferred_industry || '',
      };
      const result = await saveBusinessPlan(businessPlan, ideaContext);
      setNotice(result.message || 'Plan saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingBusinessPlan(false);
    }
  }

  async function handleCustomerInsights() {
    if (!selectedIdea) return;
    setError('');
    setNotice('');
    setLoadingCustomerInsights(true);
    try {
      const planData = plan || {};
      const data = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        problem: selectedIdea.problem,
        solution: selectedIdea.solution,
        target_users: selectedIdea.target_users,
        industry: profile?.preferred_industry || '',
        mvp_features: planData.mvp_features || selectedIdea.mvp_features || [],
        competitors: planData.competitors || selectedIdea.competitors || [],
        market_demand: Number(analysis?.market_demand_score || 0),
        uniqueness: Number(analysis?.uniqueness_score || 0),
        risks: planData.risks || analysis?.risks || [],
        monetization_model: analysis?.monetization_model || '',
      };
      const result = await generateCustomerInsights(data);
      setCustomerInsights(result);
      saveValue('customerInsights', result);
      setCustomerInsightsTab('personas');
      setNotice('Customer insights generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingCustomerInsights(false);
    }
  }

  async function handleSaveCustomerInsights() {
    if (!customerInsights || !selectedIdea) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this report to your dashboard.');
      return;
    }
    setSavingCustomerInsights(true);
    try {
      const ideaContext = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        industry: profile?.preferred_industry || '',
      };
      const result = await saveCustomerInsights(customerInsights, ideaContext);
      setNotice(result.message || 'Insights saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingCustomerInsights(false);
    }
  }

  async function handleMarketIntelligence() {
    if (!selectedIdea) return;
    setError('');
    setNotice('');
    setLoadingMarketIntel(true);
    try {
      const planData = plan || {};
      const data = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        problem: selectedIdea.problem,
        solution: selectedIdea.solution,
        target_users: selectedIdea.target_users,
        industry: profile?.preferred_industry || '',
        location: '',
        business_model: planData.revenue_model?.pricing_model || analysis?.monetization_model || '',
        mvp_features: planData.mvp_features || selectedIdea.mvp_features || [],
        competitors: planData.competitors || selectedIdea.competitors || [],
        market_demand: Number(analysis?.market_demand_score || 0),
        uniqueness: Number(analysis?.uniqueness_score || 0),
        risks: planData.risks || analysis?.risks || [],
        monetization_model: analysis?.monetization_model || '',
      };
      const result = await generateMarketIntelligence(data);
      setMarketIntelligence(result);
      saveValue('marketIntelligence', result);
      setMarketIntelTab('size');
      setNotice('Market intelligence report generated.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoadingMarketIntel(false);
    }
  }

  async function handleSaveMarketIntelligence() {
    if (!marketIntelligence || !selectedIdea) return;
    setError('');
    setNotice('');
    if (!getSession()?.token) {
      setError('Sign in to save this report to your dashboard.');
      return;
    }
    setSavingMarketIntel(true);
    try {
      const ideaContext = {
        startup_name: selectedIdea.startup_name,
        pitch: selectedIdea.pitch,
        industry: profile?.preferred_industry || '',
      };
      const result = await saveMarketIntelligence(marketIntelligence, ideaContext);
      setNotice(result.message || 'Report saved.');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSavingMarketIntel(false);
    }
  }

  function handleDownload(format = 'json') {
    const content = format === 'md' ? markdownText : planText;
    if (!content) return;
    const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${plan.startup_name || 'startup-plan'}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-[#F5F3EE] text-[#0A0A0A]">
      <AppNav />
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
            <div>
              <p className="section-label mb-4">AI Results</p>
              <h1 className="text-4xl md:text-6xl font-black uppercase leading-none tracking-tight">Startup<br />Opportunities.</h1>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={handleRegenerateIdeas} disabled={regenerating} className="h-12 px-6 border-2 border-[#0A0A0A] bg-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                {regenerating ? 'Regenerating' : 'Regenerate Ideas'}
              </button>
              <Link to="/input" className="h-12 px-6 border-2 border-[#0A0A0A] bg-white text-xs font-black uppercase tracking-widest inline-flex items-center justify-center hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors">Edit Inputs</Link>
            </div>
          </div>

          {analysis && (
            <div className="grid lg:grid-cols-4 border-2 border-[#0A0A0A] bg-white mb-10">
              <div className="p-5 border-b-2 lg:border-b-0 lg:border-r-2 border-[#0A0A0A]">
                <Brain className="h-5 w-5 mb-3" />
                <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Founder Type</p>
                <h2 className="text-lg font-black uppercase leading-tight">{analysis.founder_type}</h2>
              </div>
              <ListBlock title="Strengths" items={analysis.strengths} />
              <ListBlock title="Weaknesses" items={analysis.weaknesses} />
              <ListBlock title="Categories" items={analysis.best_startup_categories} />
            </div>
          )}

          <div className="grid md:grid-cols-3 border-2 border-[#0A0A0A] bg-white mb-10">
            <div className="p-5 border-b-2 md:border-b-0 md:border-r-2 border-[#0A0A0A]">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Best Candidate</p>
              <h2 className="text-lg font-black uppercase leading-tight">{topIdea?.startup_name || 'No idea'}</h2>
            </div>
            <div className="p-5 border-b-2 md:border-b-0 md:border-r-2 border-[#0A0A0A]">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Average Score</p>
              <p className="text-4xl font-black leading-none">{averageScore.toFixed(1)}</p>
            </div>
            <div className="p-5">
              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Next Move</p>
              <p className="text-sm text-[#3A3A3A] leading-relaxed">Pick the strongest idea, generate a full plan, then save it to your dashboard before regenerating.</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <h2 className="text-xs font-black uppercase tracking-widest mb-4">Generated Ideas</h2>
              <div className="space-y-[-2px]">
                {ideas.map((idea) => (
                  <button
                    key={idea.startup_name}
                    type="button"
                    onClick={() => {
                      setSelectedIdea(idea);
                      setPlan(null);
                      setCustomerPlan(null);
                      setDecisionReport(null);
                      setBusinessPlan(null);
                      setCustomerInsights(null);
                      setMarketIntelligence(null);
                      saveValue('selectedIdea', idea);
                      saveValue('customerPlan', null);
                      saveValue('decisionReport', null);
                      saveValue('businessPlan', null);
                      saveValue('customerInsights', null);
                      saveValue('marketIntelligence', null);
                    }}
                    className={`w-full text-left border-2 border-[#0A0A0A] p-5 transition-colors ${selectedIdea?.startup_name === idea.startup_name ? 'bg-[#0A0A0A] text-[#F5F3EE]' : 'bg-white hover:bg-[#F5F3EE]'}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-lg font-black uppercase tracking-tight ${selectedIdea?.startup_name === idea.startup_name ? 'text-[#F5F3EE]' : 'text-[#0A0A0A]'}`}>{idea.startup_name}</h3>
                        <p className={`text-sm leading-relaxed mt-2 ${selectedIdea?.startup_name === idea.startup_name ? 'text-[#F5F3EE]/70' : 'text-[#6A6A6A]'}`}>{idea.pitch}</p>
                      </div>
                      <span className={`text-sm font-black border-2 px-2 py-1 ${selectedIdea?.startup_name === idea.startup_name ? 'border-[#F5F3EE]' : 'border-[#0A0A0A]'}`}>{Number(idea.opportunity_score || 0).toFixed(1)}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="border-2 border-[#0A0A0A] bg-white p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 border-b-2 border-[#0A0A0A] pb-5 mb-6">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Selected Idea</p>
                    <h2 className="text-2xl font-black uppercase leading-none">{selectedIdea?.startup_name}</h2>
                    <p className="text-sm text-[#3A3A3A] mt-3 leading-relaxed">{selectedIdea?.solution}</p>
                  </div>
                  <button onClick={handlePlan} disabled={loadingPlan} className="h-12 px-6 bg-[#0A0A0A] text-[#F5F3EE] border-2 border-[#0A0A0A] text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                    {loadingPlan ? 'Generating...' : <>Full Plan <Sparkles className="h-4 w-4" /></>}
                  </button>
                </div>

                {loadingPlan && <LoadingSkeleton title="Building Your Startup Plan" items={["MVP Features", "Revenue Model", "Launch Strategy", "Roadmap"]} />}

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <Score label="Feasibility" value={selectedIdea?.feasibility_score} />
                  <Score label="Demand" value={selectedIdea?.demand_score} />
                  <Score label="Monetization" value={selectedIdea?.monetization_score} />
                  <Score label="Founder Fit" value={selectedIdea?.founder_fit_score} />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <ListBlock title="Target Users" items={selectedIdea?.target_users} />
                  <ListBlock title="Why Now" items={selectedIdea?.why_now ? [selectedIdea.why_now] : []} />
                </div>

                {notice && <p className="text-xs font-black uppercase tracking-wide border-l-4 border-[#0A0A0A] pl-3 mb-4">{notice}</p>}
                {error && <p className="text-xs font-black uppercase tracking-wide border-l-4 border-red-500 text-red-600 pl-3 mb-4">{error}</p>}

                {plan && (
                  <div className="border-t-2 border-[#0A0A0A] pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                      <h3 className="text-xl font-black uppercase leading-none">{plan.startup_name} Plan</h3>
                      <div className="flex gap-3">
                        <button onClick={handleSave} disabled={saving} className="h-10 px-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                          <Save className="h-4 w-4" /> {saving ? 'Saving' : 'Save'}
                        </button>
                        <button onClick={handleSaveToIdeas} disabled={savingIdea} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                          <Lightbulb className="h-4 w-4" /> {savingIdea ? 'Saving...' : 'Save to Ideas'}
                        </button>
                        <button onClick={() => handleDownload('json')} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors">
                          <Download className="h-4 w-4" /> JSON
                        </button>
                        <button onClick={() => handleDownload('md')} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors">
                          <Download className="h-4 w-4" /> MD
                        </button>
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <ListBlock title="MVP Features" items={plan.mvp_features} />
                      <ListBlock title="Advantages" items={plan.our_advantages} />
                      <ListBlock title="Risks" items={plan.risks} />
                      <ListBlock title="Pitch" items={[plan.thirty_second_pitch]} />
                    </div>
                    <div className="mt-4 border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5">
                      <h4 className="text-xs font-black uppercase tracking-widest mb-3 flex items-center gap-2"><Rocket className="h-4 w-4" /> Roadmap</h4>
                      <div className="grid sm:grid-cols-2 gap-3">
                        {plan.roadmap?.map((item) => (
                          <div key={`${item.week}-${item.title}`} className="border-2 border-[#0A0A0A] bg-white p-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Week {item.week}</p>
                            <h5 className="text-sm font-black uppercase my-2">{item.title}</h5>
                            <ul className="text-xs text-[#3A3A3A] space-y-1">
                              {item.tasks?.map((task) => <li key={task}>{task}</li>)}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t-2 border-[#0A0A0A] pt-6 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-xl font-black uppercase leading-none flex items-center gap-3"><Users className="h-6 w-6" /> First 100 Customers</h3>
                    <div className="flex gap-3">
                      {customerPlan && (
                        <button onClick={handleSaveCustomerPlan} disabled={savingCustomer} className="h-10 px-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                          <Save className="h-4 w-4" /> {savingCustomer ? 'Saving' : 'Save'}
                        </button>
                      )}
                      <button onClick={handleFirst100Customers} disabled={loadingCustomer} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                        {loadingCustomer ? 'Generating...' : <><Sparkles className="h-4 w-4" /> Generate Strategy</>}
                      </button>
                    </div>
                  </div>

                  {loadingCustomer && <LoadingSkeleton title="Building Acquisition Plan" items={["Early Adopters", "Channels", "Templates", "Metrics"]} />}

                  {customerPlan && (
                    <div className="space-y-4">
                      <div className="border-2 border-[#0A0A0A] bg-white p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Ideal Early Adopters</p>
                        <p className="text-sm text-[#3A3A3A] leading-relaxed">{customerPlan.ideal_early_adopters}</p>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <ListBlock title="Where to Find Them" items={customerPlan.where_to_find_them} />
                        <ListBlock title="Outreach Channels" items={customerPlan.outreach_channels} />
                      </div>

                      {Array.isArray(customerPlan.cold_message_templates) && customerPlan.cold_message_templates.length > 0 && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-3">Cold Message Templates</h4>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {customerPlan.cold_message_templates.map((tmpl, i) => (
                              <div key={i} className="border-2 border-[#0A0A0A] bg-white p-4">
                                <span className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">{tmpl.channel}</span>
                                <p className="text-xs font-bold mt-2 mb-1">Subject:</p>
                                <p className="text-xs text-[#3A3A3A] italic mb-3">{tmpl.subject}</p>
                                <p className="text-xs font-bold mb-1">Body:</p>
                                <p className="text-xs text-[#3A3A3A] leading-relaxed whitespace-pre-line">{tmpl.body}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="border-2 border-[#0A0A0A] bg-white p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Social Media Launch Plan</p>
                        <p className="text-sm text-[#3A3A3A] leading-relaxed">{customerPlan.social_media_launch_plan}</p>
                      </div>

                      <div className="border-2 border-[#0A0A0A] bg-white p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Referral Strategy</p>
                        <p className="text-sm text-[#3A3A3A] leading-relaxed">{customerPlan.referral_strategy}</p>
                      </div>

                      <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-3">7-Day Action Plan</h4>
                        <div className="grid sm:grid-cols-2 gap-3">
                          {customerPlan.seven_day_action_plan?.map((day) => (
                            <div key={day.day} className="border-2 border-[#0A0A0A] bg-white p-4">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Day {day.day}</p>
                              <h5 className="text-sm font-black uppercase my-2">{day.title}</h5>
                              <ul className="text-xs text-[#3A3A3A] space-y-1">
                                {day.tasks?.map((task) => <li key={task}>{task}</li>)}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <ListBlock title="Metrics to Track" items={customerPlan.metrics_to_track} />
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-[#0A0A0A] pt-6 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-xl font-black uppercase leading-none flex items-center gap-3"><BarChart3 className="h-6 w-6" /> Startup Decision Engine</h3>
                    <div className="flex gap-3">
                      {decisionReport && (
                        <button onClick={handleSaveDecisionReport} disabled={savingDecision} className="h-10 px-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                          <Save className="h-4 w-4" /> {savingDecision ? 'Saving' : 'Save'}
                        </button>
                      )}
                      <button onClick={handleDecisionEngine} disabled={loadingDecision} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                        {loadingDecision ? 'Analyzing...' : <><Brain className="h-4 w-4" /> Run Analysis</>}
                      </button>
                    </div>
                  </div>

                  {loadingDecision && <LoadingSkeleton title="Evaluating Your Startup" items={["Risk Analysis", "Success Probability", "Recommendation", "Action Steps"]} />}

                  {decisionReport && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div className={`border-2 p-4 text-center ${decisionReport?.risk_analysis?.overall_risk_level === 'High' ? 'border-red-500 bg-red-50' : decisionReport?.risk_analysis?.overall_risk_level === 'Medium' ? 'border-yellow-500 bg-yellow-50' : 'border-green-500 bg-green-50'}`}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <AlertTriangle className={`h-5 w-5 ${decisionReport?.risk_analysis?.overall_risk_level === 'High' ? 'text-red-600' : decisionReport?.risk_analysis?.overall_risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`} />
                            <span className={`text-xs font-black uppercase tracking-widest ${decisionReport?.risk_analysis?.overall_risk_level === 'High' ? 'text-red-600' : decisionReport?.risk_analysis?.overall_risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>{decisionReport?.risk_analysis?.overall_risk_level}</span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Risk Level</p>
                        </div>
                        <div className="border-2 border-[#0A0A0A] bg-white p-4 text-center sm:col-span-2">
                          <div className="flex items-center justify-center gap-2 mb-1">
                            <span className="text-2xl font-black">{decisionReport?.success_probability?.percentage ?? '?'}%</span>
                          </div>
                          <div className="w-full h-2 bg-[#E5E3DC] rounded-full overflow-hidden mb-1">
                            <div className="h-full bg-[#0A0A0A] rounded-full transition-all duration-500" style={{ width: `${decisionReport?.success_probability?.percentage || 0}%` }} />
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Success Probability</p>
                        </div>
                        <div className={`border-2 p-4 text-center ${decisionReport?.recommendation?.decision === 'Go' ? 'border-green-500 bg-green-50' : decisionReport?.recommendation?.decision === 'Pivot' ? 'border-yellow-500 bg-yellow-50' : 'border-red-500 bg-red-50'}`}>
                          <div className="flex items-center justify-center gap-2 mb-1">
                            {decisionReport?.recommendation?.decision === 'Go' ? <ThumbsUp className="h-5 w-5 text-green-600" /> : decisionReport?.recommendation?.decision === 'Pivot' ? <RotateCcw className="h-5 w-5 text-yellow-600" /> : <ThumbsDown className="h-5 w-5 text-red-600" />}
                            <span className={`text-xs font-black uppercase tracking-widest ${decisionReport?.recommendation?.decision === 'Go' ? 'text-green-600' : decisionReport?.recommendation?.decision === 'Pivot' ? 'text-yellow-600' : 'text-red-600'}`}>{decisionReport?.recommendation?.decision}</span>
                          </div>
                          <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Recommendation</p>
                        </div>
                      </div>

                      <div className="border-2 border-[#0A0A0A] bg-white p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Success Probability Reasoning</p>
                        <p className="text-sm text-[#3A3A3A] leading-relaxed">{decisionReport?.success_probability?.reason}</p>
                      </div>

                      <div className="border-2 border-[#0A0A0A] bg-white p-5">
                        <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Recommendation Explanation</p>
                        <p className="text-sm text-[#3A3A3A] leading-relaxed">{decisionReport?.recommendation?.explanation}</p>
                      </div>

                      <ListBlock title="Action Steps to Improve" items={decisionReport?.recommendation?.action_steps} />

                      <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5">
                        <h4 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Risk Analysis</h4>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <ListBlock title="Key Business Risks" items={decisionReport?.risk_analysis?.key_business_risks} />
                          <ListBlock title="Technical Risks" items={decisionReport?.risk_analysis?.technical_risks} />
                          <ListBlock title="Market Risks" items={decisionReport?.risk_analysis?.market_risks} />
                          <ListBlock title="Financial Risks" items={decisionReport?.risk_analysis?.financial_risks} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-[#0A0A0A] pt-6 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-xl font-black uppercase leading-none flex items-center gap-3"><BookOpen className="h-6 w-6" /> Business Planning</h3>
                    <div className="flex gap-3">
                      {businessPlan && (
                        <button onClick={handleSaveBusinessPlan} disabled={savingBusinessPlan} className="h-10 px-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                          <Save className="h-4 w-4" /> {savingBusinessPlan ? 'Saving' : 'Save'}
                        </button>
                      )}
                      <button onClick={handleBusinessPlan} disabled={loadingBusinessPlan} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                        {loadingBusinessPlan ? 'Generating...' : <><Sparkles className="h-4 w-4" /> Generate Plan</>}
                      </button>
                    </div>
                  </div>

                  {loadingBusinessPlan && <LoadingSkeleton title="Building Your Business Plan" items={["Business Model Canvas", "Lean Canvas", "Revenue Forecast", "Pricing Strategy"]} />}

                  {businessPlan && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1 border-2 border-[#0A0A0A] bg-white p-1">
                        {[
                          { key: 'bmc', label: 'Business Model Canvas', icon: Target },
                          { key: 'lean', label: 'Lean Canvas', icon: PieChart },
                          { key: 'revenue', label: 'Revenue Forecast', icon: TrendingUp },
                          { key: 'pricing', label: 'Pricing Strategy', icon: DollarSign },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button key={tab.key} onClick={() => setBusinessPlanTab(tab.key)} className={`flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${businessPlanTab === tab.key ? 'bg-[#0A0A0A] text-[#F5F3EE]' : 'bg-white text-[#0A0A0A] hover:bg-[#F5F3EE]'}`}>
                              <Icon className="h-3 w-3" /> {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {businessPlanTab === 'bmc' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Business Model Canvas</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2 border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Value Proposition</p>
                              <p className="text-sm text-[#3A3A3A] leading-relaxed">{businessPlan?.business_model_canvas?.value_proposition}</p>
                            </div>
                            <ListBlock title="Customer Segments" items={businessPlan?.business_model_canvas?.customer_segments} />
                            <ListBlock title="Channels" items={businessPlan?.business_model_canvas?.channels} />
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Customer Relationships</p>
                              <p className="text-sm text-[#3A3A3A] leading-relaxed">{businessPlan?.business_model_canvas?.customer_relationships}</p>
                            </div>
                            <ListBlock title="Revenue Streams" items={businessPlan?.business_model_canvas?.revenue_streams} />
                            <ListBlock title="Key Resources" items={businessPlan?.business_model_canvas?.key_resources} />
                            <ListBlock title="Key Activities" items={businessPlan?.business_model_canvas?.key_activities} />
                            <ListBlock title="Key Partners" items={businessPlan?.business_model_canvas?.key_partners} />
                            <ListBlock title="Cost Structure" items={businessPlan?.business_model_canvas?.cost_structure} />
                          </div>
                        </div>
                      )}

                      {businessPlanTab === 'lean' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Lean Canvas</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Unfair Advantage</p>
                              <p className="text-sm text-[#3A3A3A] leading-relaxed">{businessPlan?.lean_canvas?.unfair_advantage}</p>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Unique Value Proposition</p>
                              <p className="text-sm text-[#3A3A3A] leading-relaxed">{businessPlan?.lean_canvas?.unique_value_proposition}</p>
                            </div>
                            <ListBlock title="Problem" items={businessPlan?.lean_canvas?.problem} />
                            <ListBlock title="Customer Segments (Early Adopters)" items={businessPlan?.lean_canvas?.customer_segments} />
                            <ListBlock title="Solution" items={businessPlan?.lean_canvas?.solution} />
                            <ListBlock title="Channels" items={businessPlan?.lean_canvas?.channels} />
                            <ListBlock title="Revenue Streams" items={businessPlan?.lean_canvas?.revenue_streams} />
                            <ListBlock title="Cost Structure" items={businessPlan?.lean_canvas?.cost_structure} />
                            <ListBlock title="Key Metrics" items={businessPlan?.lean_canvas?.key_metrics} />
                          </div>
                        </div>
                      )}

                      {businessPlanTab === 'revenue' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Revenue Forecast (1-3 Years)</h4>

                          <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            {['year_1', 'year_2', 'year_3'].map((year, idx) => {
                              const y = businessPlan?.revenue_forecast?.[year] || {};
                              return (
                                <div key={year} className="border-2 border-[#0A0A0A] bg-white p-4">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Year {idx + 1}</p>
                                  <p className="text-2xl font-black mb-1">${Number(y.total_revenue || 0).toLocaleString()}</p>
                                  <p className="text-xs text-[#3A3A3A]">{y.estimated_customers || 0} customers</p>
                                  <p className="text-xs text-[#3A3A3A]">${Number(y.avg_revenue_per_customer || 0).toFixed(2)} avg/customer</p>
                                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mt-2">Growth: {y.growth_rate}</p>
                                </div>
                              );
                            })}
                          </div>

                          <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            {[
                              { key: 'best_case', label: 'Best Case', color: 'text-green-600' },
                              { key: 'expected_case', label: 'Expected Case', color: 'text-[#0A0A0A]' },
                              { key: 'worst_case', label: 'Worst Case', color: 'text-red-600' },
                            ].map((scenario) => {
                              const s = businessPlan?.revenue_forecast?.[scenario.key] || {};
                              return (
                                <div key={scenario.key} className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-4">
                                  <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${scenario.color}`}>{scenario.label}</p>
                                  <div className="space-y-1 text-xs text-[#3A3A3A]">
                                    <p>Y1: <span className="font-black">${Number(s.year_1_revenue || 0).toLocaleString()}</span></p>
                                    <p>Y2: <span className="font-black">${Number(s.year_2_revenue || 0).toLocaleString()}</span></p>
                                    <p>Y3: <span className="font-black">${Number(s.year_3_revenue || 0).toLocaleString()}</span></p>
                                    <p className="mt-2 text-[10px] italic">{s.assumptions}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          <ListBlock title="Growth Assumptions" items={businessPlan?.revenue_forecast?.growth_assumptions} />

                          <div className="border-2 border-[#0A0A0A] bg-white p-5 mt-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-3">Monthly Revenue Trajectory</p>
                            {['year_1', 'year_2', 'year_3'].map((year, idx) => {
                              const y = businessPlan?.revenue_forecast?.[year] || {};
                              const months = Array.isArray(y.monthly_revenue) ? y.monthly_revenue : [];
                              const maxRev = Math.max(...months, 1);
                              return (
                                <div key={year} className="mb-3">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Year {idx + 1}</p>
                                  <div className="flex items-end gap-1 h-12">
                                    {months.map((rev, mi) => {
                                      const pct = maxRev > 0 ? (rev / maxRev) * 100 : 0;
                                      return (
                                        <div key={mi} className="flex-1 flex flex-col items-center">
                                          <div className="w-full bg-[#0A0A0A]" style={{ height: `${Math.max(pct, 2)}%`, minHeight: '4px' }} title={`M${mi + 1}: $${rev}`} />
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {businessPlanTab === 'pricing' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Pricing Strategy</h4>
                          <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5 mb-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Recommended Model</p>
                            <p className="text-sm font-black uppercase tracking-wide">{businessPlan?.pricing_strategy?.recommended_model}</p>
                          </div>

                          <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            {(businessPlan?.pricing_strategy?.tiers || []).map((tier, i) => (
                              <div key={i} className={`border-2 border-[#0A0A0A] p-5 ${i === 1 ? 'bg-[#0A0A0A] text-[#F5F3EE]' : 'bg-white text-[#0A0A0A]'}`}>
                                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${i === 1 ? 'text-[#F5F3EE]/60' : 'text-[#6A6A6A]'}`}>{tier.name}</p>
                                <p className={`text-3xl font-black mb-3 ${i === 1 ? 'text-[#F5F3EE]' : ''}`}>${tier.price}<span className="text-xs font-bold">/mo</span></p>
                                <ul className="space-y-1">
                                  {(tier.features || []).map((f, fi) => (
                                    <li key={fi} className={`flex gap-2 text-xs ${i === 1 ? 'text-[#F5F3EE]/80' : 'text-[#3A3A3A]'}`}>
                                      <Check className={`h-3 w-3 shrink-0 mt-0.5 ${i === 1 ? 'text-[#F5F3EE]' : ''}`} /> {f}
                                    </li>
                                  ))}
                                </ul>
                                {tier.target_customers && (
                                  <p className={`text-[9px] font-black uppercase tracking-widest mt-3 ${i === 1 ? 'text-[#F5F3EE]/60' : 'text-[#6A6A6A]'}`}>{tier.target_customers}</p>
                                )}
                              </div>
                            ))}
                          </div>

                          <div className="border-2 border-[#0A0A0A] bg-white p-5 mb-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-3">Competitor Pricing</p>
                            <div className="overflow-x-auto">
                              <table className="w-full text-xs">
                                <thead>
                                  <tr className="border-b-2 border-[#0A0A0A]">
                                    <th className="text-left py-2 font-black uppercase tracking-widest">Competitor</th>
                                    <th className="text-left py-2 font-black uppercase tracking-widest">Model</th>
                                    <th className="text-right py-2 font-black uppercase tracking-widest">Price Range</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(businessPlan?.pricing_strategy?.competitor_pricing || []).map((cp, i) => (
                                    <tr key={i} className="border-b border-[#0A0A0A]/10">
                                      <td className="py-2 font-bold">{cp.competitor_name}</td>
                                      <td className="py-2">{cp.model}</td>
                                      <td className="py-2 text-right">{cp.price_range}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="border-2 border-[#0A0A0A] bg-white p-5 mb-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Pricing Justification</p>
                            <p className="text-sm text-[#3A3A3A] leading-relaxed">{businessPlan?.pricing_strategy?.justification}</p>
                          </div>

                          <ListBlock title="Monetization Recommendations" items={businessPlan?.pricing_strategy?.monetization_recommendations} />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-[#0A0A0A] pt-6 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-xl font-black uppercase leading-none flex items-center gap-3"><User className="h-6 w-6" /> Customer Insights</h3>
                    <div className="flex gap-3">
                      {customerInsights && (
                        <button onClick={handleSaveCustomerInsights} disabled={savingCustomerInsights} className="h-10 px-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                          <Save className="h-4 w-4" /> {savingCustomerInsights ? 'Saving' : 'Save'}
                        </button>
                      )}
                      <button onClick={handleCustomerInsights} disabled={loadingCustomerInsights} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                        {loadingCustomerInsights ? 'Generating...' : <><Sparkles className="h-4 w-4" /> Generate Insights</>}
                      </button>
                    </div>
                  </div>

                  {loadingCustomerInsights && <LoadingSkeleton title="Analyzing Your Customers" items={["Personas", "ICP", "Pain Points", "Journey Map"]} />}

                  {customerInsights && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1 border-2 border-[#0A0A0A] bg-white p-1">
                        {[
                          { key: 'personas', label: 'Personas', icon: User },
                          { key: 'icp', label: 'Ideal Customer Profile', icon: Target },
                          { key: 'painpoints', label: 'Pain Points', icon: AlertTriangle },
                          { key: 'journey', label: 'Customer Journey', icon: ShoppingCart },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button key={tab.key} onClick={() => setCustomerInsightsTab(tab.key)} className={`flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${customerInsightsTab === tab.key ? 'bg-[#0A0A0A] text-[#F5F3EE]' : 'bg-white text-[#0A0A0A] hover:bg-[#F5F3EE]'}`}>
                              <Icon className="h-3 w-3" /> {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {customerInsightsTab === 'personas' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Customer Personas</h4>
                          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {(customerInsights?.personas || []).map((persona, i) => (
                              <div key={i} className="border-2 border-[#0A0A0A] bg-white p-5">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-10 w-10 bg-[#0A0A0A] flex items-center justify-center">
                                    <User className="h-5 w-5 text-[#F5F3EE]" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-black uppercase">{persona.name}</p>
                                    <p className="text-[9px] text-[#6A6A6A] uppercase tracking-widest font-black">{persona.age} &middot; {persona.occupation}</p>
                                  </div>
                                </div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">{persona.location}</p>
                                <div className="space-y-2 mt-3">
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Goals</p>
                                    <ul className="text-xs text-[#3A3A3A] space-y-0.5 mt-0.5">
                                      {(persona.goals || []).map((g, gi) => <li key={gi}>&bull; {g}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Challenges</p>
                                    <ul className="text-xs text-[#3A3A3A] space-y-0.5 mt-0.5">
                                      {(persona.challenges || []).map((c, ci) => <li key={ci}>&bull; {c}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Motivations</p>
                                    <ul className="text-xs text-[#3A3A3A] space-y-0.5 mt-0.5">
                                      {(persona.motivations || []).map((m, mi) => <li key={mi}>&bull; {m}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Buying Behavior</p>
                                    <p className="text-xs text-[#3A3A3A] mt-0.5">{persona.buying_behavior}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Preferred Channels</p>
                                    <div className="flex flex-wrap gap-1 mt-0.5">
                                      {(persona.preferred_channels || []).map((ch, chi) => (
                                        <span key={chi} className="text-[9px] font-black uppercase tracking-widest bg-[#F5F3EE] border border-[#0A0A0A] px-1.5 py-0.5">{ch}</span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {customerInsightsTab === 'icp' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Ideal Customer Profile</h4>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="sm:col-span-2 border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Target Audience</p>
                              <p className="text-sm text-[#3A3A3A] leading-relaxed">{customerInsights?.ideal_customer_profile?.target_audience}</p>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Industry</p>
                              <p className="text-sm font-bold">{customerInsights?.ideal_customer_profile?.industry}</p>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Company Size</p>
                              <p className="text-sm font-bold">{customerInsights?.ideal_customer_profile?.company_size}</p>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Demographics</p>
                              <p className="text-sm text-[#3A3A3A]">{customerInsights?.ideal_customer_profile?.demographics}</p>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Budget</p>
                              <p className="text-sm font-bold">{customerInsights?.ideal_customer_profile?.budget}</p>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Buying Intent</p>
                              <p className="text-sm">{customerInsights?.ideal_customer_profile?.buying_intent}</p>
                            </div>
                            <ListBlock title="Interests" items={customerInsights?.ideal_customer_profile?.interests} />
                            <ListBlock title="Decision Makers" items={customerInsights?.ideal_customer_profile?.decision_makers} />
                            <div className="sm:col-span-2">
                              <ListBlock title="Primary Use Cases" items={customerInsights?.ideal_customer_profile?.primary_use_cases} />
                            </div>
                          </div>
                        </div>
                      )}

                      {customerInsightsTab === 'painpoints' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">User Pain Point Analysis</h4>
                          <div className="space-y-3">
                            {(customerInsights?.pain_point_analysis || []).map((pp, i) => (
                              <div key={i} className="border-2 border-[#0A0A0A] bg-white p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <h5 className="text-sm font-black uppercase">{pp.pain_point}</h5>
                                  <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${pp.priority === 'High' ? 'border-red-500 bg-red-50 text-red-600' : pp.priority === 'Medium' ? 'border-yellow-500 bg-yellow-50 text-yellow-600' : 'border-green-500 bg-green-50 text-green-600'}`}>{pp.priority}</span>
                                </div>
                                <div className="grid sm:grid-cols-3 gap-3">
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Existing Solutions</p>
                                    <p className="text-xs text-[#3A3A3A]">{pp.existing_solutions}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Why They Fail</p>
                                    <p className="text-xs text-[#3A3A3A]">{pp.why_they_fail}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Startup Solution</p>
                                    <p className="text-xs text-[#3A3A3A]">{pp.startup_solution}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {customerInsightsTab === 'journey' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Customer Journey Map</h4>
                          {[
                            { key: 'awareness', label: 'Awareness', icon: Sparkles, color: 'bg-blue-50 border-blue-500' },
                            { key: 'consideration', label: 'Consideration', icon: Brain, color: 'bg-purple-50 border-purple-500' },
                            { key: 'decision', label: 'Decision', icon: BarChart3, color: 'bg-orange-50 border-orange-500' },
                            { key: 'purchase', label: 'Purchase', icon: ShoppingCart, color: 'bg-green-50 border-green-500' },
                            { key: 'onboarding', label: 'Onboarding', icon: Rocket, color: 'bg-cyan-50 border-cyan-500' },
                            { key: 'retention', label: 'Retention', icon: Heart, color: 'bg-pink-50 border-pink-500' },
                            { key: 'referral', label: 'Referral', icon: Users, color: 'bg-yellow-50 border-yellow-500' },
                          ].map((stage) => {
                            const s = customerInsights?.customer_journey?.[stage.key] || {};
                            return (
                              <div key={stage.key} className={`border-2 ${stage.color} p-5 mb-3`}>
                                <div className="flex items-center gap-2 mb-3">
                                  <stage.icon className="h-4 w-4" />
                                  <p className="text-xs font-black uppercase tracking-widest">{stage.label}</p>
                                </div>
                                <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Goals</p>
                                    <p className="text-[#3A3A3A]">{s.customer_goals}</p>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Actions</p>
                                    <ul className="text-[#3A3A3A] space-y-0.5">
                                      {(s.actions || []).map((a, ai) => <li key={ai}>&bull; {a}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Pain Points</p>
                                    <ul className="text-[#3A3A3A] space-y-0.5">
                                      {(s.pain_points || []).map((p, pi) => <li key={pi} className="text-red-600">&bull; {p}</li>)}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Emotions</p>
                                    <div className="flex flex-wrap gap-1">
                                      {(s.emotions || []).map((e, ei) => (
                                        <span key={ei} className="text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border border-[#0A0A0A]">{e}</span>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Opportunities</p>
                                    <ul className="text-[#3A3A3A] space-y-0.5">
                                      {(s.opportunities || []).map((o, oi) => <li key={oi} className="text-green-600">&bull; {o}</li>)}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t-2 border-[#0A0A0A] pt-6 mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <h3 className="text-xl font-black uppercase leading-none flex items-center gap-3"><Globe className="h-6 w-6" /> Market Intelligence</h3>
                    <div className="flex gap-3">
                      {marketIntelligence && (
                        <button onClick={handleSaveMarketIntelligence} disabled={savingMarketIntel} className="h-10 px-4 border-2 border-[#0A0A0A] bg-[#0A0A0A] text-[#F5F3EE] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:text-[#0A0A0A] transition-colors disabled:opacity-50">
                          <Save className="h-4 w-4" /> {savingMarketIntel ? 'Saving' : 'Save'}
                        </button>
                      )}
                      <button onClick={handleMarketIntelligence} disabled={loadingMarketIntel} className="h-10 px-4 border-2 border-[#0A0A0A] bg-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-[#0A0A0A] hover:text-[#F5F3EE] transition-colors disabled:opacity-50">
                        {loadingMarketIntel ? 'Generating...' : <><Sparkles className="h-4 w-4" /> Generate Report</>}
                      </button>
                    </div>
                  </div>

                  {loadingMarketIntel && <LoadingSkeleton title="Analyzing Your Market" items={["Market Size", "Trends", "Growth Rate", "Opportunities", "Competitors"]} />}

                  {marketIntelligence && (
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-1 border-2 border-[#0A0A0A] bg-white p-1">
                        {[
                          { key: 'size', label: 'Market Size', icon: BarChart3 },
                          { key: 'trends', label: 'Market Trends', icon: TrendingUp },
                          { key: 'growth', label: 'Industry Growth', icon: TrendingUp },
                          { key: 'opportunities', label: 'Opportunities', icon: Search },
                          { key: 'competitors', label: 'Competitor Comparison', icon: Layers },
                        ].map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button key={tab.key} onClick={() => setMarketIntelTab(tab.key)} className={`flex items-center gap-2 px-3 py-2 text-[9px] font-black uppercase tracking-widest transition-colors ${marketIntelTab === tab.key ? 'bg-[#0A0A0A] text-[#F5F3EE]' : 'bg-white text-[#0A0A0A] hover:bg-[#F5F3EE]'}`}>
                              <Icon className="h-3 w-3" /> {tab.label}
                            </button>
                          );
                        })}
                      </div>

                      {marketIntelTab === 'size' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Market Size Estimation</h4>
                          <div className="grid sm:grid-cols-3 gap-3 mb-4">
                            {[
                              { key: 'tam', label: 'TAM', desc: 'Total Addressable Market' },
                              { key: 'sam', label: 'SAM', desc: 'Serviceable Addressable Market' },
                              { key: 'som', label: 'SOM', desc: 'Serviceable Obtainable Market' },
                            ].map((m) => {
                              const d = marketIntelligence?.market_size?.[m.key] || {};
                              return (
                                <div key={m.key} className="border-2 border-[#0A0A0A] bg-white p-5">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">{m.desc}</p>
                                  <p className="text-2xl font-black mb-2">{d.value || 'N/A'}</p>
                                  <p className="text-xs text-[#3A3A3A] mb-3 leading-relaxed">{d.description}</p>
                                  {(d.assumptions || []).length > 0 && (
                                    <div>
                                      <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Assumptions</p>
                                      <ul className="text-xs text-[#3A3A3A] space-y-0.5">
                                        {d.assumptions.map((a, ai) => <li key={ai}>&bull; {a}</li>)}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="border-2 border-[#0A0A0A] bg-white p-5">
                            <div className="flex items-center gap-2">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A]">Confidence Level:</p>
                              <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${marketIntelligence?.market_size?.confidence_level === 'High' ? 'border-green-500 bg-green-50 text-green-600' : marketIntelligence?.market_size?.confidence_level === 'Low' ? 'border-red-500 bg-red-50 text-red-600' : 'border-yellow-500 bg-yellow-50 text-yellow-600'}`}>{marketIntelligence?.market_size?.confidence_level || 'Medium'}</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {marketIntelTab === 'trends' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Market Trends</h4>
                          <div className="space-y-3">
                            {(marketIntelligence?.market_trends || []).map((t, i) => (
                              <div key={i} className="border-2 border-[#0A0A0A] bg-white p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <h5 className="text-sm font-black uppercase">{t.trend}</h5>
                                  <span className={`shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${t.priority === 'High' ? 'border-green-500 bg-green-50 text-green-600' : t.priority === 'Low' ? 'border-red-500 bg-red-50 text-red-600' : 'border-yellow-500 bg-yellow-50 text-yellow-600'}`}>{t.priority}</span>
                                </div>
                                <p className="text-sm text-[#3A3A3A] mb-3 leading-relaxed">{t.description}</p>
                                <div className="border-t border-[#0A0A0A]/10 pt-3">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Impact on Startup</p>
                                  <p className="text-sm text-[#3A3A3A] leading-relaxed">{t.impact_on_startup}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {marketIntelTab === 'growth' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Industry Growth</h4>
                          <div className="border-2 border-[#0A0A0A] bg-[#F5F3EE] p-5 mb-4">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">Annual Growth Rate</p>
                            <p className="text-2xl font-black">{marketIntelligence?.industry_growth?.annual_growth_rate || 'N/A'}</p>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3 mb-4">
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Growth Drivers</p>
                              <ul className="text-sm text-[#3A3A3A] space-y-1">
                                {(marketIntelligence?.industry_growth?.growth_drivers || []).map((d, i) => <li key={i}>&bull; {d}</li>)}
                              </ul>
                            </div>
                            <div className="border-2 border-[#0A0A0A] bg-white p-5">
                              <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">Market Limitations</p>
                              <ul className="text-sm text-[#3A3A3A] space-y-1">
                                {(marketIntelligence?.industry_growth?.market_limitations || []).map((l, i) => <li key={i}>&bull; {l}</li>)}
                              </ul>
                            </div>
                          </div>
                          <div className="border-2 border-[#0A0A0A] bg-white p-5">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-2">5-Year Outlook</p>
                            <p className="text-sm text-[#3A3A3A] leading-relaxed">{marketIntelligence?.industry_growth?.five_year_outlook}</p>
                          </div>
                        </div>
                      )}

                      {marketIntelTab === 'opportunities' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Emerging Opportunities</h4>
                          <div className="space-y-3">
                            {(marketIntelligence?.emerging_opportunities || []).map((o, i) => (
                              <div key={i} className="border-2 border-[#0A0A0A] bg-white p-5">
                                <div className="flex items-start justify-between gap-4 mb-3">
                                  <h5 className="text-sm font-black uppercase">{o.opportunity}</h5>
                                  <div className="flex gap-1 shrink-0">
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${o.impact === 'High' ? 'border-green-500 bg-green-50 text-green-600' : o.impact === 'Low' ? 'border-red-500 bg-red-50 text-red-600' : 'border-yellow-500 bg-yellow-50 text-yellow-600'}`}>Impact: {o.impact}</span>
                                    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 border ${o.feasibility === 'High' ? 'border-green-500 bg-green-50 text-green-600' : o.feasibility === 'Low' ? 'border-red-500 bg-red-50 text-red-600' : 'border-yellow-500 bg-yellow-50 text-yellow-600'}`}>Feasibility: {o.feasibility}</span>
                                  </div>
                                </div>
                                <p className="text-sm text-[#3A3A3A] mb-3 leading-relaxed">{o.description}</p>
                                <div className="border-t border-[#0A0A0A]/10 pt-3">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-[#6A6A6A] mb-1">How to Capitalize</p>
                                  <p className="text-sm text-[#3A3A3A] leading-relaxed">{o.how_to_capitalize}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {marketIntelTab === 'competitors' && (
                        <div>
                          <h4 className="text-xs font-black uppercase tracking-widest mb-4">Competitor Feature Comparison</h4>
                          <div className="overflow-x-auto border-2 border-[#0A0A0A] bg-white">
                            <table className="w-full text-xs">
                              <thead>
                                <tr className="border-b-2 border-[#0A0A0A] bg-[#F5F3EE]">
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Competitor</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Features</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Pricing</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Target Users</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Strengths</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Weaknesses</th>
                                  <th className="text-left py-3 px-4 font-black uppercase tracking-widest">Differentiation</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(marketIntelligence?.competitor_comparison || []).map((c, i) => (
                                  <tr key={i} className="border-t border-[#0A0A0A]/10">
                                    <td className="py-3 px-4 font-bold whitespace-nowrap">{c.competitor_name}</td>
                                    <td className="py-3 px-4"><ul className="space-y-0.5">{(c.features || []).map((f, fi) => <li key={fi}>&bull; {f}</li>)}</ul></td>
                                    <td className="py-3 px-4">{c.pricing_model}</td>
                                    <td className="py-3 px-4">{c.target_users}</td>
                                    <td className="py-3 px-4"><ul className="space-y-0.5 text-green-600">{(c.strengths || []).map((s, si) => <li key={si}>&bull; {s}</li>)}</ul></td>
                                    <td className="py-3 px-4"><ul className="space-y-0.5 text-red-600">{(c.weaknesses || []).map((w, wi) => <li key={wi}>&bull; {w}</li>)}</ul></td>
                                    <td className="py-3 px-4 text-[#3A3A3A]">{c.differentiation_opportunity}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
