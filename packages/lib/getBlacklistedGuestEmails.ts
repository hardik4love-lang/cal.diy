/**
 * Helper to parse and normalize the BLACKLISTED_GUEST_EMAILS environment variable.
 * Splits on commas, trims surrounding whitespace, lowercases entries, and removes empty tokens.
 */
export const getBlacklistedGuestEmails = (): string[] => {
  const envVal = process.env.BLACKLISTED_GUEST_EMAILS;
  if (!envVal) return [];

  return envVal
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter((email) => email.length > 0);
};

export const isGuestEmailBlacklisted = (email: string): boolean => {
  const blacklisted = getBlacklistedGuestEmails();
  if (blacklisted.length === 0) return false;

  const normalized = email.trim().toLowerCase();
  return blacklisted.includes(normalized);
};
