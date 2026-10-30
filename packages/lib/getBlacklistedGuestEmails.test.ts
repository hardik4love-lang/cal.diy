import { describe, it, expect, beforeEach, afterEach } from "vitest";

import { getBlacklistedGuestEmails, isGuestEmailBlacklisted } from "./getBlacklistedGuestEmails";

describe("getBlacklistedGuestEmails", () => {
  const originalEnv = process.env.BLACKLISTED_GUEST_EMAILS;

  afterEach(() => {
    process.env.BLACKLISTED_GUEST_EMAILS = originalEnv;
  });

  it("returns an empty array when env var is undefined or empty", () => {
    delete process.env.BLACKLISTED_GUEST_EMAILS;
    expect(getBlacklistedGuestEmails()).toEqual([]);

    process.env.BLACKLISTED_GUEST_EMAILS = "";
    expect(getBlacklistedGuestEmails()).toEqual([]);
  });

  it("correctly trims whitespace around comma-separated emails", () => {
    process.env.BLACKLISTED_GUEST_EMAILS = "blocked@example.com, other@example.com ,  spam@test.com  ";
    expect(getBlacklistedGuestEmails()).toEqual([
      "blocked@example.com",
      "other@example.com",
      "spam@test.com",
    ]);
  });

  it("handles newlines and filters empty tokens", () => {
    process.env.BLACKLISTED_GUEST_EMAILS = "a@spam.com,\n b@spam.com ,,, c@spam.com";
    expect(getBlacklistedGuestEmails()).toEqual(["a@spam.com", "b@spam.com", "c@spam.com"]);
  });

  it("lowercases all email addresses", () => {
    process.env.BLACKLISTED_GUEST_EMAILS = "Blocked@Example.COM, Other@Example.com";
    expect(getBlacklistedGuestEmails()).toEqual(["blocked@example.com", "other@example.com"]);
  });
});

describe("isGuestEmailBlacklisted", () => {
  const originalEnv = process.env.BLACKLISTED_GUEST_EMAILS;

  afterEach(() => {
    process.env.BLACKLISTED_GUEST_EMAILS = originalEnv;
  });

  it("returns true for emails with leading/trailing spaces in env config", () => {
    process.env.BLACKLISTED_GUEST_EMAILS = "blocked@example.com, other@example.com";
    expect(isGuestEmailBlacklisted("other@example.com")).toBe(true);
    expect(isGuestEmailBlacklisted("blocked@example.com")).toBe(true);
    expect(isGuestEmailBlacklisted(" OTHER@EXAMPLE.COM ")).toBe(true);
    expect(isGuestEmailBlacklisted("allowed@example.com")).toBe(false);
  });
});
