import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WORDS, levels, type Word } from "@/data/words";
import { speak } from "@/lib/speak";
import { loadProgress, saveProgress, type Progress } from "@/lib/progress";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "لعبة 800 كلمة إنجليزية | تعلّم بالنطق والتحدي" },
      {
        name: "description",
        content:
          "لعبة تفاعلية لحفظ 800 كلمة إنجليزية أساسية مع الترجمة العربية والنطق الصوتي، مستويات وتحديات ونقاط تحفّزك على الاستمرار.",
      },
      { property: "og:title", content: "لعبة 800 كلمة إنجليزية | تعلّم بالنطق والتحدي" },
      {
        property: "og:description",
        content: "لعبة تفاعلية لحفظ 800 كلمة إنجليزية أساسية مع الترجمة العربية والنطق الصوتي، مستويات وتحديات ونقاط تحفّزك على الاستمرار.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://moathalyaari800word.lovable.app" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://moathalyaari800word.lovable.app" }],
  }),
  component: Game,
});

type Mode = "quiz" | "cards";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = a[i] as T;
    a[i] = a[j] as T;
    a[j] = temp;
  }
  return a;
}

function buildRound(pool: Word[]) {
  return shuffle(pool).map((word) => {
    const distractors = shuffle(WORDS.filter((w) => w.ar !== word.ar)).slice(0, 3);
    return { word, choices: shuffle([word, ...distractors]) };
  });
}

function Game() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [mode, setMode] = useState<Mode>("quiz");
  const [progress, setProgress] = useState<Progress>({ learned: [], best: {}, xp: 0 });
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setProgress(loadProgress());
    setHydrated(true);
  }, []);

  const level = levels[levelIndex] ?? levels[0]!;
  const [round, setRound] = useState(() => buildRound(levels[0]!.words));
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<Word | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  const restart = useCallback(
    (idx: number) => {
      setRound(buildRound(levels[idx]?.words ?? levels[0]!.words));
      setStep(0);
      setPicked(null);
      setScore(0);
      setStreak(0);
      setDone(false);
    },
    [],
  );

  useEffect(() => {
    restart(levelIndex);
  }, [levelIndex, restart]);

  const current = round[step];

  useEffect(() => {
    if (mode === "quiz" && current) speak(current.word.en);
  }, [current, mode]);

  const commit = (p: Progress) => {
    setProgress(p);
    saveProgress(p);
  };

  const choose = (choice: Word) => {
    if (picked || !current) return;
    setPicked(choice);
    const correct = choice.ar === current.word.ar;
    if (correct) {
      setScore((s) => s + 1);
      setStreak((s) => s + 1);
      const learned = progress.learned.includes(current.word.en)
        ? progress.learned
        : [...progress.learned, current.word.en];
      commit({ ...progress, learned, xp: progress.xp + 10 + streak });
    } else {
      setStreak(0);
      speak(current.word.en);
    }
    setTimeout(() => {
      setPicked(null);
      if (step + 1 >= round.length) {
        setDone(true);
        const key = String(levelIndex);
        const finalScore = correct ? score + 1 : score;
        if ((progress.best[key] ?? 0) < finalScore) {
          commit({ ...progress, best: { ...progress.best, [key]: finalScore } });
        }
      } else {
        setStep((s) => s + 1);
      }
    }, 750);
  };

  const learnedCount = hydrated ? progress.learned.length : 0;
  const overall = Math.round((learnedCount / WORDS.length) * 100);

  return (
    <main dir="rtl" className="mx-auto min-h-screen w-full max-w-3xl px-4 py-6 pb-24">
      <header className="surface animate-pop rounded-3xl px-5 py-5 text-center">
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          لعبة <span className="text-primary">٨٠٠ كلمة</span> إنجليزية
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          اسمع الكلمة، اختر الترجمة الصحيحة، واجمع النقاط 🔊
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat label="نقاطك" value={hydrated ? progress.xp : 0} />
          <Stat label="كلمات محفوظة" value={learnedCount} />
          <Stat label="التقدّم" value={`${overall}%`} />
        </div>
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full brand-gradient transition-all duration-500"
            style={{ width: `${Math.max(overall, 1)}%` }}
          />
        </div>
      </header>

      <div className="mt-5 flex items-center justify-between gap-2">
        <div className="flex rounded-full bg-secondary p-1 text-sm font-semibold">
          <TabButton active={mode === "quiz"} onClick={() => setMode("quiz")}>
            🎮 التحدي
          </TabButton>
          <TabButton active={mode === "cards"} onClick={() => setMode("cards")}>
            🗂️ البطاقات
          </TabButton>
        </div>
        <select
          value={levelIndex}
          onChange={(e) => setLevelIndex(Number(e.target.value))}
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          {levels.map((l) => (
            <option key={l.index} value={l.index}>
              المستوى {l.index + 1} · {l.from}-{l.to}
            </option>
          ))}
        </select>
      </div>

      {mode === "quiz" ? (
        done ? (
          <section className="surface animate-pop mt-5 rounded-3xl p-8 text-center">
            <div className="text-5xl">{score >= round.length - 2 ? "🏆" : "💪"}</div>
            <h2 className="mt-3 text-xl font-bold">انتهى المستوى {levelIndex + 1}</h2>
            <p className="mt-2 text-muted-foreground">
              نتيجتك {score} من {round.length}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => restart(levelIndex)}
                className="rounded-full border border-border bg-secondary px-6 py-3 text-sm font-bold text-secondary-foreground transition hover:opacity-90"
              >
                🔁 إعادة المستوى
              </button>
              {levelIndex + 1 < levels.length && (
                <button
                  onClick={() => setLevelIndex(levelIndex + 1)}
                  className="brand-gradient rounded-full px-6 py-3 text-sm font-bold shadow-[var(--shadow-glow)] transition hover:brightness-105"
                >
                  المستوى التالي ⬅
                </button>
              )}
            </div>
          </section>
        ) : (
          current && (
            <section className="mt-5">
              <div className="flex items-center justify-between px-1 text-xs font-semibold text-muted-foreground">
                <span>
                  السؤال {step + 1} / {round.length}
                </span>
                <span>🔥 سلسلة: {streak}</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${((step + 1) / round.length) * 100}%` }}
                />
              </div>

              <div
                key={current.word.en}
                className="surface animate-pop mt-4 rounded-3xl px-6 py-10 text-center"
              >
                <p className="text-xs font-semibold text-muted-foreground">ما معنى هذه الكلمة؟</p>
                <button
                  onClick={() => speak(current.word.en)}
                  dir="ltr"
                  className="mt-3 inline-flex items-center gap-3 rounded-full bg-secondary px-6 py-3 text-3xl font-extrabold tracking-tight transition hover:bg-muted sm:text-4xl"
                >
                  <span>{current.word.en}</span>
                  <span className="text-2xl">🔊</span>
                </button>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {current.choices.map((c) => {
                  const isCorrect = c.ar === current.word.ar;
                  const state =
                    !picked ? "idle" : isCorrect ? "good" : c.ar === picked.ar ? "bad" : "dim";
                  return (
                    <button
                      key={c.ar}
                      onClick={() => choose(c)}
                      disabled={!!picked}
                      className={[
                        "rounded-2xl border px-5 py-4 text-lg font-bold transition",
                        state === "idle" &&
                          "border-border bg-card hover:border-accent hover:bg-secondary",
                        state === "good" && "border-success bg-success/20 text-success",
                        state === "bad" &&
                          "animate-shake border-destructive bg-destructive/20 text-destructive",
                        state === "dim" && "border-border bg-card opacity-40",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                    >
                      {c.ar}
                    </button>
                  );
                })}
              </div>
            </section>
          )
        )
      ) : (
        <CardsView words={level.words} learned={progress.learned} />
      )}

      <footer className="mt-10 text-center text-xs text-muted-foreground">
        <p>
          ✧ {WORDS.length} كلمة مقسّمة على {levels.length} مستوى · تقدّمك محفوظ تلقائياً ✧
        </p>
        <p className="mt-2">
          إعداد: <span className="font-bold text-foreground">معاذ اليعري</span> · تواصل:{' '}
          <a
            href="tel:+967778532787"
            className="text-primary underline underline-offset-2 transition hover:text-primary/80"
          >
            778532787
          </a>
        </p>
      </footer>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-secondary px-2 py-3">
      <div className="text-lg font-extrabold text-primary">{value}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-2 transition ${
        active ? "brand-gradient" : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function CardsView({ words, learned }: { words: Word[]; learned: string[] }) {
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const learnedSet = useMemo(() => new Set(learned), [learned]);

  return (
    <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {words.map((w) => (
        <div key={w.en} className="surface animate-pop rounded-2xl p-4 text-center">
          <button
            dir="ltr"
            onClick={() => speak(w.en)}
            className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-lg font-bold transition hover:bg-muted"
          >
            {w.en} <span className="text-sm">🔊</span>
          </button>
          <button
            onClick={() => setRevealed((r) => ({ ...r, [w.en]: !r[w.en] }))}
            className="mt-3 block w-full rounded-xl bg-muted px-2 py-2 text-sm font-semibold text-foreground/90"
          >
            {revealed[w.en] ? w.ar : "👁️ اظهار الترجمة"}
          </button>
          {learnedSet.has(w.en) && (
            <div className="mt-2 text-[11px] font-semibold text-success">✓ محفوظة</div>
          )}
        </div>
      ))}
    </section>
  );
}
