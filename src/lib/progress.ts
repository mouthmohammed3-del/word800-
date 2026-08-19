const KEY = "w800-progress-v1";

export type Progress = {
  learned: string[];
  best: Record<string, number>;
  xp: number;
};

const empty: Progress = { learned: [], best: {}, xp: 0 };

export function loadProgress(): Progress {
  if (typeof window === "undefined") return empty;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as Progress) };
  } catch {
    return empty;
  }
}

export function saveProgress(p: Progress) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(p));
}
