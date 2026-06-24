const KEYS = {
  session: 'skill2startup.session',
  profile: 'skill2startup.profile',
  analysis: 'skill2startup.analysis',
  ideas: 'skill2startup.ideas',
  selectedIdea: 'skill2startup.selectedIdea',
  plan: 'skill2startup.plan',
};

export function saveValue(key, value) {
  sessionStorage.setItem(KEYS[key], JSON.stringify(value));
}

export function readValue(key, fallback = null) {
  const raw = sessionStorage.getItem(KEYS[key]);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function clearGeneratedState() {
  ['profile', 'analysis', 'ideas', 'selectedIdea', 'plan'].forEach((key) => {
    sessionStorage.removeItem(KEYS[key]);
  });
}

export function setSession(auth) {
  saveValue('session', auth);
}

export function getSession() {
  return readValue('session');
}

export function clearSession() {
  sessionStorage.removeItem(KEYS.session);
}
