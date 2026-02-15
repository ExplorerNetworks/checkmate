import emojilib from "emojilib";

export type EmojiAnimation = "bounce" | "wiggle" | "pulse" | "spin" | "wave" | "none";

export type EmojiMatch = {
  emoji: string;
  animation: EmojiAnimation;
};

const DEFAULT_LIST_EMOJI: EmojiMatch = { emoji: "📋", animation: "none" };
const DEFAULT_TASK_EMOJI: EmojiMatch = { emoji: "📌", animation: "none" };

// Keywords that are too generic and match everything unhelpfully
const SKIP_KEYWORDS = new Set([
  "a", "an", "the", "to", "do", "go", "is", "it", "in", "on", "of", "or",
  "my", "me", "i", "up", "so", "no", "be", "he", "we", "us", "if", "at",
  "by", "as", "thing", "stuff", "like", "just", "get", "got", "has", "had",
  "can", "new", "old", "big", "top", "set", "all", "out", "off", "for",
  "not", "but", "and", "with", "from", "this", "that", "have", "some",
  "face", "symbol", "sign", "object", "mark", "type",
]);

// Build reverse index: keyword -> emoji (first match wins, so order matters)
// We prefer more specific emojis (objects, food, activities) over generic ones (smileys)
let reverseIndex: Map<string, string> | null = null;

function getReverseIndex(): Map<string, string> {
  if (reverseIndex) return reverseIndex;

  // Partition emojis by preference: specific categories first, smileys/people last
  const entries = Object.entries(emojilib) as [string, string[]][];

  const preferred: [string, string[]][] = [];
  const deferred: [string, string[]][] = [];

  for (const [emoji, keywords] of entries) {
    const cp = emoji.codePointAt(0) ?? 0;
    // Smileys & people: 0x1F600-0x1F64F, 0x1F900-0x1F9FF (some), flags, etc.
    if ((cp >= 0x1F600 && cp <= 0x1F64F) || (cp >= 0x1F900 && cp <= 0x1F9FF)) {
      deferred.push([emoji, keywords]);
    } else {
      preferred.push([emoji, keywords]);
    }
  }

  reverseIndex = new Map();
  const ordered = [...preferred, ...deferred];

  for (const [emoji, keywords] of ordered) {
    for (const kw of keywords) {
      const clean = kw.replace(/_/g, " ").toLowerCase();
      if (clean.length <= 2 || SKIP_KEYWORDS.has(clean)) continue;
      if (!reverseIndex.has(clean)) {
        reverseIndex.set(clean, emoji);
      }
    }
  }

  return reverseIndex;
}

/**
 * Determine animation type based on emoji Unicode codepoint range.
 */
function getAnimation(emoji: string): EmojiAnimation {
  const cp = emoji.codePointAt(0) ?? 0;

  // Food & drink: U+1F32D-1F37F, U+1F950-1F96F, U+1F345-1F37C
  if (
    (cp >= 0x1F32D && cp <= 0x1F37F) ||
    (cp >= 0x1F345 && cp <= 0x1F37C) ||
    (cp >= 0x1F950 && cp <= 0x1F96F) ||
    (cp >= 0x1FAD0 && cp <= 0x1FADF)
  ) {
    return "wiggle";
  }

  // Animals & nature: U+1F400-1F4A0, U+1F300-1F320, U+1F330-1F344
  if (
    (cp >= 0x1F400 && cp <= 0x1F43F) ||
    (cp >= 0x1F980 && cp <= 0x1F9AF) ||
    (cp >= 0x1F300 && cp <= 0x1F320) ||
    (cp >= 0x1F330 && cp <= 0x1F344) ||
    (cp >= 0x1FAB0 && cp <= 0x1FACF)
  ) {
    return "wave";
  }

  // Travel & transport: U+1F680-1F6C5, U+1F6E0-1F6FF
  if (
    (cp >= 0x1F680 && cp <= 0x1F6FF) ||
    (cp >= 0x2708 && cp <= 0x2709) ||
    cp === 0x26F5 || cp === 0x2693
  ) {
    return "bounce";
  }

  // Activities & sports: U+1F3A0-1F3CF, U+26BD-26BE, U+1F93A-1F945
  if (
    (cp >= 0x1F3A0 && cp <= 0x1F3CF) ||
    (cp >= 0x1F938 && cp <= 0x1F945) ||
    (cp >= 0x26BD && cp <= 0x26BE)
  ) {
    return "bounce";
  }

  // Objects: U+1F4A0-1F4FF, U+1F500-1F5FF
  if (
    (cp >= 0x1F4A0 && cp <= 0x1F4FF) ||
    (cp >= 0x1F500 && cp <= 0x1F5FF)
  ) {
    return "wiggle";
  }

  // Hearts & symbols: U+2600-27BF, U+2702-27B0
  if (cp >= 0x2600 && cp <= 0x27BF) {
    return "pulse";
  }

  // Smileys & people: U+1F600-1F64F
  if (cp >= 0x1F600 && cp <= 0x1F64F) {
    return "pulse";
  }

  // Flags and other: default
  return "pulse";
}

/**
 * Match the best emoji for a given text.
 * Tokenizes the input, tries multi-word then single-word matches against emojilib.
 * Returns animated emoji if matched, static fallback if not.
 */
export function matchEmoji(text: string, type: "list" | "task" = "task"): EmojiMatch {
  const index = getReverseIndex();
  const lower = text.toLowerCase().replace(/[^\w\s]/g, "");
  const words = lower.split(/\s+/).filter((w) => w.length > 0);

  // Try the full text first (e.g., "ice cream", "hot dog")
  const fullMatch = index.get(lower);
  if (fullMatch) {
    return { emoji: fullMatch, animation: getAnimation(fullMatch) };
  }

  // Try multi-word combinations (bigrams): "ice cream", "credit card", etc.
  for (let i = 0; i < words.length - 1; i++) {
    const bigram = `${words[i]} ${words[i + 1]}`;
    const match = index.get(bigram);
    if (match) {
      return { emoji: match, animation: getAnimation(match) };
    }
  }

  // Try individual words (skip very short/generic ones)
  for (const word of words) {
    if (word.length <= 2 || SKIP_KEYWORDS.has(word)) continue;
    const match = index.get(word);
    if (match) {
      return { emoji: match, animation: getAnimation(match) };
    }
  }

  return type === "list" ? DEFAULT_LIST_EMOJI : DEFAULT_TASK_EMOJI;
}
