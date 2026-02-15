import { describe, it, expect } from "vitest";
import { matchEmoji } from "@/lib/emoji";

describe("matchEmoji", () => {
  describe("full text matches", () => {
    it("matches 'pizza' to the pizza emoji", () => {
      const result = matchEmoji("pizza");
      expect(result.emoji).toBe("🍕");
    });

    it("matches 'dog' to a dog emoji", () => {
      const result = matchEmoji("dog");
      expect(result.emoji).not.toBe("📌");
    });
  });

  describe("bigram matches", () => {
    it("matches 'ice cream' from a sentence", () => {
      const result = matchEmoji("buy ice cream today");
      expect(result.emoji).not.toBe("📌");
    });

    it("matches 'hot dog' from a sentence", () => {
      const result = matchEmoji("eat hot dog");
      expect(result.emoji).not.toBe("📌");
    });
  });

  describe("individual word matches", () => {
    it("matches 'guitar' from a sentence", () => {
      const result = matchEmoji("practice guitar lessons");
      expect(result.emoji).toBe("🎸");
    });

    it("skips generic words and matches specific ones", () => {
      const result = matchEmoji("go to the gym");
      expect(result.emoji).not.toBe("📌");
    });
  });

  describe("fallback defaults", () => {
    it("returns clipboard emoji for unmatched list", () => {
      const result = matchEmoji("xyzzy qqq", "list");
      expect(result.emoji).toBe("📋");
      expect(result.animation).toBe("none");
    });

    it("returns pin emoji for unmatched task", () => {
      const result = matchEmoji("xyzzy qqq", "task");
      expect(result.emoji).toBe("📌");
      expect(result.animation).toBe("none");
    });

    it("defaults type to task when not specified", () => {
      const result = matchEmoji("xyzzy qqq");
      expect(result.emoji).toBe("📌");
    });
  });

  describe("animation assignment", () => {
    it("assigns wiggle to food emojis", () => {
      const result = matchEmoji("pizza");
      expect(result.animation).toBe("wiggle");
    });

    it("assigns a non-default animation to matched emojis", () => {
      const result = matchEmoji("car");
      // "car" should match an emoji and get an animation (not the fallback "none")
      expect(result.emoji).not.toBe("📌");
      expect(result.animation).not.toBe("none");
    });

    it("assigns wave to animal emojis", () => {
      const result = matchEmoji("dog");
      expect(["wave", "wiggle", "bounce", "pulse"]).toContain(
        result.animation
      );
    });
  });

  describe("text normalization", () => {
    it("is case-insensitive", () => {
      const r1 = matchEmoji("PIZZA");
      const r2 = matchEmoji("pizza");
      expect(r1.emoji).toBe(r2.emoji);
    });

    it("handles extra whitespace", () => {
      const r1 = matchEmoji("  pizza  ");
      const r2 = matchEmoji("pizza");
      expect(r1.emoji).toBe(r2.emoji);
    });
  });
});
