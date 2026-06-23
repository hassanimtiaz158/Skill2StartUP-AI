import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  timeout: 65000, // slightly above backend timeout
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.code === "ECONNABORTED") {
      return Promise.reject(new Error("Request timed out. Please try again."));
    }
    if (!err.response) {
      return Promise.reject(new Error("Cannot reach the server. Make sure the backend is running."));
    }
    const message = err.response?.data?.detail || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export const analyzeProfile = (profile) =>
  api.post("/api/profile/analyze", profile).then((r) => r.data);

export const generateIdeas = (profile) =>
  api.post("/api/startups/generate", profile).then((r) => r.data);

export const generatePlan = (profile, idea) =>
  api.post("/api/startups/plan", { profile, idea }).then((r) => r.data);

export const savePlan = (profile, plan) =>
  api.post("/api/startups/save", { profile, plan }).then((r) => r.data);

export const getSavedPlans = () =>
  api.get("/api/startups/saved").then((r) => r.data);

export const deletePlan = (planId) =>
  api.delete(`/api/startups/${planId}`).then((r) => r.data);
