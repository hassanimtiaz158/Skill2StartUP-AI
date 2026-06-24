export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function formatScore(value) {
  return Number(value || 0).toFixed(1);
}
