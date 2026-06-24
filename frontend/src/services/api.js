import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
const isProduction = import.meta.env.PROD;

function assertApiConfigured() {
  if (isProduction && !API_BASE_URL) {
    throw new Error('Frontend is missing VITE_API_URL. Set it in Vercel to your Render backend URL, then redeploy.');
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
    return 'API URL is not configured. Set VITE_API_URL in Vercel to your Render backend URL.';
  }
  const detail = error.response?.data?.detail || error.response?.data?.message;
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
