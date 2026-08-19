import type { Word } from "./types";
import { words1 } from "./words-1";
import { words2 } from "./words-2";
import { words3 } from "./words-3";
import { words4 } from "./words-4";
import { words5 } from "./words-5";

const all = [...words1, ...words2, ...words3, ...words4, ...words5];

const seen = new Set<string>();
export const WORDS: Word[] = all
  .filter((w) => {
    const key = w.en.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  })
  .slice(0, 800);

export const LEVEL_SIZE = 20;

export const levels = Array.from(
  { length: Math.ceil(WORDS.length / LEVEL_SIZE) },
  (_, i) => ({
    index: i,
    from: i * LEVEL_SIZE + 1,
    to: Math.min((i + 1) * LEVEL_SIZE, WORDS.length),
    words: WORDS.slice(i * LEVEL_SIZE, (i + 1) * LEVEL_SIZE),
  }),
);

export type { Word };
