import { vi, describe, it, expect } from "vitest";

// Mock next/headers and prisma to prevent import-time failures
vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  default: {},
}));

import { createSessionCookie, clearSessionCookie } from "@/lib/session";

describe("createSessionCookie", () => {
  it("returns cookie config with the provided token", () => {
    const cookie = createSessionCookie("my-jwt-token");
    expect(cookie).toMatchObject({
      name: "session",
      value: "my-jwt-token",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    });
  });

  it("sets maxAge to 7 days", () => {
    const cookie = createSessionCookie("token");
    expect(cookie.maxAge).toBe(60 * 60 * 24 * 7);
  });

  it("sets secure=false in non-production", () => {
    const cookie = createSessionCookie("token");
    expect(cookie.secure).toBe(false);
  });
});

describe("clearSessionCookie", () => {
  it("returns cookie config with empty value and maxAge 0", () => {
    const cookie = clearSessionCookie();
    expect(cookie).toMatchObject({
      name: "session",
      value: "",
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
  });
});
