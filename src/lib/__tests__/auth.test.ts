import { describe, it, expect } from "vitest";
import {
  hashPassword,
  comparePassword,
  signToken,
  verifyToken,
} from "@/lib/auth";

describe("hashPassword", () => {
  it("returns a bcrypt hash string", async () => {
    const hash = await hashPassword("mysecret");
    expect(hash).toMatch(/^\$2[aby]\$/);
  });

  it("produces different hashes for the same input (salt)", async () => {
    const h1 = await hashPassword("same");
    const h2 = await hashPassword("same");
    expect(h1).not.toBe(h2);
  });
});

describe("comparePassword", () => {
  it("returns true for matching password and hash", async () => {
    const hash = await hashPassword("password123");
    expect(await comparePassword("password123", hash)).toBe(true);
  });

  it("returns false for non-matching password", async () => {
    const hash = await hashPassword("password123");
    expect(await comparePassword("wrong", hash)).toBe(false);
  });
});

describe("signToken", () => {
  it("returns a JWT string with 3 dot-separated parts", async () => {
    const token = await signToken({ userId: "u1", username: "alice" });
    expect(token.split(".")).toHaveLength(3);
  });
});

describe("verifyToken", () => {
  it("returns payload for a valid token", async () => {
    const token = await signToken({ userId: "u1", username: "alice" });
    const payload = await verifyToken(token);
    expect(payload).toMatchObject({ userId: "u1", username: "alice" });
  });

  it("returns null for an invalid token", async () => {
    expect(await verifyToken("garbage.token.value")).toBeNull();
  });

  it("returns null for a tampered token", async () => {
    const token = await signToken({ userId: "u1", username: "alice" });
    const tampered = token.slice(0, -5) + "XXXXX";
    expect(await verifyToken(tampered)).toBeNull();
  });
});
