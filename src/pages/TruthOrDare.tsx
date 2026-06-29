import { useState, useCallback } from "react";
import { Dices, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const theme = {
  bg: "#131111",
  fg: "#f0ece6",
  muted: "#8a8582",
  accent: "#8b5cf6",
  card: "rgba(25, 23, 22, 0.9)",
};

const truths = [
  "What's the most embarrassing song on your playlist?",
  "What's the last lie you told?",
  "Have you ever pretended to like a gift you actually hated?",
  "What's the weirdest thing you've ever eaten?",
  "If you could swap lives with someone for a day, who would it be?",
  "What's a secret talent you have?",
  "What's the most childish thing you still do?",
  "Have you ever stalked someone's social media for more than 30 minutes?",
  "What's the worst date you've ever been on?",
  "What's a rumour you started or helped spread?",
  "What's the cringiest phase you went through?",
  "Have you ever sent a text you instantly regretted?",
  "What's the longest you've gone without showering?",
  "What's the silliest fear you have?",
  "Have you ever eavesdropped on a conversation you shouldn't have?",
  "What's a dream you've never told anyone about?",
  "If your search history was made public, what would people judge you for?",
  "What's the most absurd thing you believed as a child?",
  "Have you ever blamed someone else for something you did?",
  "What's a skill you wish you had but are too embarrassed to try learning?",
  "What's the worst fashion choice you've ever made?",
  "Have you ever cried during a movie when no one was watching?",
  "What's the most trouble you got into at school?",
  "What's something you pretend to understand but really don't?",
];

const dares = [
  "Do your best impression of a celebrity and have everyone guess who it is.",
  "Speak in an accent for the next three rounds.",
  "Post an embarrassing selfie on your social media story for 10 minutes.",
  "Let someone else re-style your hair however they want.",
  "Do 20 push-ups right now.",
  "Call a random contact and sing 'Happy Birthday' to them.",
  "Eat a spoonful of a condiment you dislike.",
  "Act out a scene from your favourite movie — no words, just acting.",
  "Do a handstand or try your best for 10 seconds.",
  "Let the group pick your profile picture for the next 24 hours.",
  "Recite a tongue twister perfectly three times fast.",
  "Do a 30-second silent dance party with a completely straight face.",
  "Text your most recent contact: 'I think I left my dignity at your place.'",
  "Wear your clothes inside out for the next 15 minutes.",
  "Speak only in questions for the next two minutes.",
  "Do your best catwalk across the room.",
  "Draw a portrait of the person to your left with your non-dominant hand.",
  "Show the last five photos in your camera roll — no deleting.",
  "Imitate a sound effect and have everyone guess what it is — keep going until someone gets it.",
  "Do the worm on the floor (or your best attempt).",
  "Let someone else write your next text message and send it.",
  "Stand on one leg for the next two turns.",
  "Speak in a whisper for the next five minutes.",
  "Balance a book on your head and walk across the room.",
];

type Card = "truth" | "dare" | null;
type Result = string | null;

export default function TruthOrDare() {
  const [selected, setSelected] = useState<Card>(null);
  const [result, setResult] = useState<Result>(null);
  const [revealed, setRevealed] = useState(false);
  const [usedTruths, setUsedTruths] = useState<Set<number>>(new Set());
  const [usedDares, setUsedDares] = useState<Set<number>>(new Set());

  const pick = useCallback((type: "truth" | "dare") => {
    const pool = type === "truth" ? truths : dares;
    const used = type === "truth" ? usedTruths : usedDares;
    const setUsed = type === "truth" ? setUsedTruths : setUsedDares;

    if (used.size >= pool.length) {
      used.clear();
    }

    const available = pool.map((_, i) => i).filter((i) => !used.has(i));
    const picked = available[Math.floor(Math.random() * available.length)];
    const updated = new Set(used);
    updated.add(picked);
    setUsed(updated);
    setResult(pool[picked] ?? null);
    setRevealed(false);
  }, [usedTruths, usedDares]);

  const handlePick = (type: "truth" | "dare") => {
    setSelected(type);
    pick(type);
  };

  const handleNew = () => {
    if (selected) pick(selected);
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center"
      style={{ background: theme.bg, color: theme.fg }}
    >
      <div className="w-full pt-6 px-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm transition-colors hover:text-white"
          style={{ color: theme.muted }}
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 w-full max-w-lg mx-auto -mt-12">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center justify-center size-16 rounded-2xl mb-4"
            style={{ background: `${theme.accent}20` }}
          >
            <Dices className="size-8" style={{ color: theme.accent }} />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
            Truth or Dare
          </h1>
          <p style={{ color: theme.muted }}>Pick your poison</p>
        </div>

        {!result ? (
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            <button
              onClick={() => handlePick("truth")}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-3xl border p-8 transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(139, 92, 246, 0.12)", borderColor: "rgba(139, 92, 246, 0.3)" }}
            >
              <span className="text-5xl select-none">🤔</span>
              <span className="text-xl font-bold" style={{ color: "#a78bfa" }}>Truth</span>
            </button>
            <button
              onClick={() => handlePick("dare")}
              className="group relative flex flex-col items-center justify-center gap-3 rounded-3xl border p-8 transition-all hover:scale-105 active:scale-95"
              style={{ background: "rgba(193, 95, 60, 0.12)", borderColor: "rgba(193, 95, 60, 0.3)" }}
            >
              <span className="text-5xl select-none">🔥</span>
              <span className="text-xl font-bold" style={{ color: "#e8845c" }}>Dare</span>
            </button>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-6">
            <div
              className="relative rounded-3xl border p-8 text-center"
              style={{ background: theme.card, borderColor: "rgba(255,255,255,0.08)" }}
            >
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-6"
                style={{
                  background: selected === "truth" ? "rgba(139, 92, 246, 0.25)" : "rgba(193, 95, 60, 0.25)",
                  color: selected === "truth" ? "#a78bfa" : "#e8845c",
                }}
              >
                {selected === "truth" ? "🤔 Truth" : "🔥 Dare"}
              </span>

              <p
                className="text-lg md:text-xl font-medium leading-relaxed transition-all duration-300"
                style={{ filter: revealed ? "none" : "blur(6px)", userSelect: revealed ? "auto" : "none" }}
              >
                {result}
              </p>

              {!revealed && (
                <button
                  onClick={() => setRevealed(true)}
                  className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all hover:scale-105"
                  style={{ background: theme.accent, color: "white" }}
                >
                  Tap to reveal
                </button>
              )}
            </div>

            {revealed && (
              <div className="flex gap-3">
                <button
                  onClick={() => { setResult(null); setSelected(null); }}
                  className="flex-1 rounded-2xl border px-4 py-3 text-sm font-medium transition-all hover:border-white/20 hover:bg-white/5"
                  style={{ borderColor: "rgba(255,255,255,0.08)", color: theme.muted }}
                >
                  Back
                </button>
                <button
                  onClick={handleNew}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    background: selected === "truth" ? "rgba(139, 92, 246, 0.3)" : "rgba(193, 95, 60, 0.3)",
                    color: selected === "truth" ? "#a78bfa" : "#e8845c",
                  }}
                >
                  <RefreshCw className="size-4" />
                  New {selected === "truth" ? "Truth" : "Dare"}
                </button>
              </div>
            )}
          </div>
        )}

        {!result && (
          <p className="mt-10 text-xs" style={{ color: "rgba(255,255,255,0.1)" }}>
            24 truths · 24 dares · no repeats until they run out
          </p>
        )}
      </div>
    </main>
  );
}
