import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
  const detail = error.response?.data?.detail || error.response?.data?.message;
  return detail || error.message || 'Request failed. Please try again.';
}

export async function analyzeProfile(profile) {
  try {
    const { data } = await api.post('/api/profile/analyze', profile);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function signUpAccount(payload) {
  try {
    const { data } = await api.post('/api/auth/signup', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function signInAccount(payload) {
  try {
    const { data } = await api.post('/api/auth/signin', payload);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get('/api/auth/me');
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function logoutAccount() {
  try {
    const { data } = await api.post('/api/auth/logout');
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generateIdeas(profile) {
  try {
    const { data } = await api.post('/api/startups/generate', profile);
    return data.ideas || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function generatePlan(profile, idea) {
  try {
    const { data } = await api.post('/api/startups/plan', { profile, idea });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function savePlan(profile, plan) {
  try {
    const { data } = await api.post('/api/startups/save', { profile, plan });
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function getSavedPlans() {
  try {
    const { data } = await api.get('/api/startups/saved');
    return data.plans || [];
  } catch (error) {
    throw new Error(apiError(error));
  }
}

export async function deletePlan(planId) {
  try {
    const { data } = await api.delete(`/api/startups/${planId}`);
    return data;
  } catch (error) {
    throw new Error(apiError(error));
  }
}
