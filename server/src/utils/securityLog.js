// Keeps a short, in-memory record of server errors and failed logins.
// No IP addresses, emails or user names are stored.
const MAX = 200;
const errors = [];
const failedLoginsByHour = new Map();

export function logError(route, err) {
  errors.unshift({ at: new Date().toISOString(), route, type: err?.name || "Error" });
  if (errors.length > MAX) errors.pop();
}

export function logFailedLogin() {
  const hour = new Date().toISOString().slice(0, 13);
  failedLoginsByHour.set(hour, (failedLoginsByHour.get(hour) || 0) + 1);
  // Keep only the last 48 hours
  for (const key of failedLoginsByHour.keys()) {
    if (failedLoginsByHour.size > 48) failedLoginsByHour.delete(key);
    else break;
  }
}

export function getSecuritySummary() {
  return {
    recentErrors: errors.slice(0, 50),
    failedLoginsByHour: [...failedLoginsByHour.entries()].map(([hour, count]) => ({ hour, count })),
  };
}
