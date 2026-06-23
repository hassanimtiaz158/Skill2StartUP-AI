// Score thresholds
export const SCORE_HIGH = 8;
export const SCORE_MEDIUM = 6;

// Score colors
export const SCORE_COLORS = {
  high: '#34D399',
  medium: '#FB923C',
  low: '#F87171',
};

// Score labels
export const SCORE_LABELS = {
  high: 'High Potential',
  medium: 'Promising',
  low: 'Challenging',
};

// Form options
export const EXPERIENCE_OPTIONS = [
  { value: 'Beginner', label: '🌱 Beginner — Just getting started', desc: "I'm learning and exploring" },
  { value: 'Intermediate', label: '🚀 Intermediate — Built a few things', desc: 'I can ship a project end-to-end' },
  { value: 'Advanced', label: '⚡ Advanced — Shipped multiple projects', desc: "I've built and launched before" },
  { value: 'Expert', label: '🏆 Expert — I\'m a domain veteran', desc: 'I could mentor others in this' },
];

export const GOAL_OPTIONS = [
  { value: 'Hackathon MVP', label: '🏗️ Hackathon MVP', icon: 'Rocket' },
  { value: 'SaaS Startup', label: '💼 SaaS Startup', icon: 'Briefcase' },
  { value: 'Side Project', label: '🔧 Side Project', icon: 'Code' },
  { value: 'Full Startup', label: '🚀 Full Startup', icon: 'Zap' },
  { value: 'Freelance Product', label: '🎯 Freelance Product', icon: 'Target' },
];

export const SUGGESTED_SKILLS = [
  'Python', 'JavaScript', 'React', 'AI/ML', 'Node.js', 'Design',
  'TypeScript', 'FastAPI', 'SQL', 'Cloud', 'Mobile', 'DevOps',
];

export const SUGGESTED_INTERESTS = [
  'Education', 'SaaS', 'Productivity', 'Health', 'Finance', 'Social',
  'Developer Tools', 'E-commerce', 'Gaming', 'Climate', 'Music', 'Art',
];

// Session storage keys
export const STORAGE_KEYS = {
  PROFILE: 'profile',
  PROFILE_ANALYSIS: 'profile_analysis',
  IDEAS: 'ideas',
  SELECTED_IDEA: 'selected_idea',
  CURRENT_PLAN: 'current_plan',
  FORM_DRAFT: 'form_draft',
};
