import axios from 'axios';

const API_URL_STORAGE_KEY = 'skill2startup.apiUrl';

function cleanApiUrl(value) {
  return (value || '').trim().replace(/\/$/, '');
}

function readRuntimeApiUrl() {
  if (typeof window === 'undefined') {
    return '';
  }
  const params = new URLSearchParams(window.location.search);
  const urlFromQuery = cleanApiUrl(params.get('apiUrl'));
  if (urlFromQuery) {
    window.localStorage.setItem(API_URL_STORAGE_KEY, urlFromQuery);
    params.delete('apiUrl');
    const nextSearch = params.toString();
    const nextUrl = `${window.location.pathname}${nextSearch ? `?${nextSearch}` : ''}${window.location.hash}`;
    window.history.replaceState({}, '', nextUrl);
    return urlFromQuery;
  }
  return cleanApiUrl(window.localStorage.getItem(API_URL_STORAGE_KEY));
}

const API_BASE_URL = cleanApiUrl(import.meta.env.VITE_API_URL) || readRuntimeApiUrl();
const isProduction = import.meta.env.PROD;

function assertApiConfigured() {
  if (isProduction && !API_BASE_URL) {
    throw new Error('Frontend is missing VITE_API_URL. Set it in Vercel Project Settings > Environment Variables for Production, then redeploy. You can also open the site once with ?apiUrl=https://your-render-backend.onrender.com.');
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 90000,
});

api.interceptors.request.use((config) => {
  const raw = sessionStorage.getItem('skill2startup.session');
  if (raw) {
    try {
      const session = JSON.parse(raw);
      if (session?.token) {
        config.headers.Authorization = `Bearer ${session.token}`;
      }
    } catch {
      // Ignore malformed local session data.
    }
  }
  return config;
});

function apiError(error) {
  if (error.message?.includes('VITE_API_URL')) {
    return error.message;
  }
  if (error.response?.status === 405 && !API_BASE_URL) {
    return 'API URL is not configured. Set VITE_API_URL in Vercel to your Render backend URL, or open the site with ?apiUrl=https://your-render-backend.onrender.com.';
  }
  const detail = error.response?.data?.detail || error.response?.data?.message;
  if (Array.isArray(detail)) {
    return detail.map((d) => d.msg || d.message || JSON.stringify(d)).join('; ');
  }
  return detail || error.message || 'Request failed. Please try again.';
}

export async function analyzeProfile(profile) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/profile/analyze', profile);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function signUpAccount(payload) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/auth/signup', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function signInAccount(payload) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/auth/signin', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getCurrentUser() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/auth/me');
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function logoutAccount() {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/auth/logout');
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function requestPasswordReset(email) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/auth/forgot-password', { email });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateIdeas(profile) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/generate', profile);
    return data.ideas || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generatePlan(profile, idea) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/plan', { profile, idea });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function savePlan(profile, plan) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/save', { profile, plan });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedPlans() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/saved');
    return data.plans || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deletePlan(planId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/${planId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function analyzeIdea(payload) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/analyze-idea', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function analyzeIdeaStream(payload, onToken, onDone, onError) {
  try {
    assertApiConfigured();
  } catch (error) {
    onError(error.message);
    return;
  }
  const url = API_BASE_URL ? `${API_BASE_URL}/api/startups/analyze-idea/stream` : '/api/startups/analyze-idea/stream';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      onError(`Server error ${response.status}`);
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (parsed.token) {
              onToken(parsed.token);
            } else if (parsed.done) {
              onDone(parsed.result);
              return;
            } else if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    }
  } catch (error) {
    onError(error.message);
  }
}

export async function chatAboutIdea(analysis, question) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/analyze-idea/chat', { analysis, question });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function chatAboutIdeaStream(analysis, question, onToken, onDone, onError) {
  try {
    assertApiConfigured();
  } catch (error) {
    onError(error.message);
    return;
  }
  const url = API_BASE_URL ? `${API_BASE_URL}/api/startups/analyze-idea/chat/stream` : '/api/startups/analyze-idea/chat/stream';
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysis, question }),
    });
    if (!response.ok) {
      onError(`Server error ${response.status}`);
      return;
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('data: ')) {
          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (parsed.token) {
              onToken(parsed.token);
            } else if (parsed.done) {
              onDone(parsed.answer);
              return;
            } else if (parsed.error) {
              onError(parsed.error);
              return;
            }
          } catch {
            // skip malformed JSON
          }
        }
      }
    }
  } catch (error) {
    onError(error.message);
  }
}

export async function shareAnalysis(analysis, ideaForm = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/analyze-idea/share', { analysis, idea_form: ideaForm });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSharedAnalysis(token) {
  try {
    assertApiConfigured();
    const { data } = await api.get(`/api/share/${token}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function estimateMarketSize(payload) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/market-size', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function runDebate(payload) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/debate', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function compareIdeas(payload) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/compare', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function sendEmailReport(analysis, recipientEmail, ideaForm = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/email-report', { analysis, recipient_email: recipientEmail, idea_form: ideaForm });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveAnalysisProgress(analysis, ideaForm = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/analyze-idea/save', { analysis, idea_form: ideaForm });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedAnalyses() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/analyze-idea/saved');
    return data.analyses || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteSavedAnalysis(analysisId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/analyze-idea/saved/${analysisId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveBuildProgress(token, day, completedTasks, notes = '') {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/progress/save', { token, day, completed_tasks: completedTasks, notes });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function loadBuildProgress(token) {
  try {
    assertApiConfigured();
    const { data } = await api.get(`/api/startups/progress/${token}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getAnalytics() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/analytics');
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateFirst100Customers(data) {
  try {
    assertApiConfigured();
    const { data: result } = await api.post('/api/startups/first-100-customers', data);
    return result;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveCustomerStrategy(strategy, ideaContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/first-100-customers/save', { strategy, idea_context: ideaContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedCustomerStrategies() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/first-100-customers/saved');
    return data.strategies || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteCustomerStrategy(strategyId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/first-100-customers/${strategyId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateDecisionEngine(data) {
  try {
    assertApiConfigured();
    const { data: result } = await api.post('/api/startups/decision-engine', data);
    return result;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveDecisionReport(report, ideaContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/decision-engine/save', { report, idea_context: ideaContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedDecisionReports() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/decision-engine/saved');
    return data.reports || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteDecisionReport(reportId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/decision-engine/${reportId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateBusinessPlan(data) {
  try {
    assertApiConfigured();
    const { data: result } = await api.post('/api/startups/business-plan', data);
    return result;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveBusinessPlan(plan, ideaContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/business-plan/save', { plan, idea_context: ideaContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedBusinessPlans() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/business-plan/saved');
    return data.plans || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteBusinessPlan(planId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/business-plan/${planId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateCustomerInsights(data) {
  try {
    assertApiConfigured();
    const { data: result } = await api.post('/api/startups/customer-insights', data);
    return result;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveCustomerInsights(insights, ideaContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/customer-insights/save', { insights, idea_context: ideaContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedCustomerInsights() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/customer-insights/saved');
    return data.insights || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteCustomerInsights(insightsId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/customer-insights/${insightsId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateMarketIntelligence(data) {
  try {
    assertApiConfigured();
    const { data: result } = await api.post('/api/startups/market-intelligence', data);
    return result;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveMarketIntelligence(report, ideaContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/market-intelligence/save', { report, idea_context: ideaContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedMarketIntelligence() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/startups/market-intelligence/saved');
    return data.reports || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteMarketIntelligence(reportId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/startups/market-intelligence/${reportId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateAICofounderChat(advisorType, question, startupContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/ai-cofounder/chat', { advisor_type: advisorType, question, startup_context: startupContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveAICofounderChat(advisorType, messages) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/ai-cofounder/chat/save', { advisor_type: advisorType, messages });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getAICofounderChatHistory(advisorType) {
  try {
    assertApiConfigured();
    const { data } = await api.get(`/api/ai-cofounder/chat/${advisorType}`);
    return data.chats || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteAICofounderChat(chatId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/ai-cofounder/chat/${chatId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateInvestorTools(data) {
  try {
    assertApiConfigured();
    const { data: result } = await api.post('/api/investor-tools/generate', data);
    return result;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function saveInvestorTools(report, ideaContext = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/investor-tools/save', { report, idea_context: ideaContext });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedInvestorTools() {
  try {
    assertApiConfigured();
    const { data } = await api.get('/api/investor-tools/saved');
    return data.reports || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deleteInvestorTools(reportId) {
  try {
    assertApiConfigured();
    const { data } = await api.delete(`/api/investor-tools/${reportId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function trackEvent(event, properties = {}) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/analytics/track', { event, properties });
    return data;
  } catch {
    return { ok: false };
  }
}

export async function evaluateStartup(profile, idea) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/evaluate', { profile, idea });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateCofounder(profile, idea) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/cofounder', { profile, idea });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateRoadmap(profile, idea, plan) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/roadmap', { profile, idea, plan });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateReadme(profile, idea, plan) {
  try {
    assertApiConfigured();
    const { data } = await api.post('/api/startups/readme', { profile, idea, plan });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}
