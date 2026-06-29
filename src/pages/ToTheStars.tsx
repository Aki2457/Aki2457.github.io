import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Sparkles, Globe, Heart, Leaf, Code, Music, Star, Radio, Zap, Coffee } from "lucide-react";

const theme = {
  bg: "#05060a",
  fg: "#f0ece6",
  muted: "#8a8582",
  gold: "#d4a843",
  teal: "#5a9e9f",
  card: "rgba(12, 14, 22, 0.88)",
  border: "rgba(255,255,255,0.08)",
  gradient:
    "radial-gradient(ellipse at 30% 15%, rgba(212,168,67,0.10), transparent 48%), radial-gradient(ellipse at 75% 80%, rgba(90,158,159,0.09), transparent 50%), linear-gradient(180deg, #05060a 0%, #020305 100%)",
};

const CANVA_URL = "https://canva.link/uoo62bjkiyayw28";
const COUNTDOWN_SECS = 20;

const humanFacts = [
  {
    icon: Leaf,
    label: "We touch grass",
    desc: "Literally. Bare feet on soil, chasing sunsets, lying in fields looking at clouds.",
  },
  {
    icon: Globe,
    label: "We built the Web",
    desc: "A planet-spanning dream of light and language. You're travelling it right now.",
  },
  {
    icon: Music,
    label: "We make music",
    desc: "From cave drums to Beethoven to lo-fi beats to Kendrick to songs yet to exist.",
  },
  {
    icon: Code,
    label: "We write code",
    desc: "Instructions that summon machines into purpose. This page is made of them.",
  },
  {
    icon: Heart,
    label: "We fall in love",
    desc: "Relentlessly. With people, with ideas, with cities, with pizza at 2am.",
  },
  {
    icon: Coffee,
    label: "We run on caffeine",
    desc: "Coffee, tea, energy drinks. We are, in part, a civilisation of warm beverages.",
  },
  {
    icon: Zap,
    label: "We invented electricity",
    desc: "Then used it to build the internet, then used the internet to post about cats.",
  },
  {
    icon: Star,
    label: "We look up",
    desc: "Every generation has wondered what's out there. So — hi. We wondered about you.",
  },
];

export default function ToTheStarsPage() {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECS);

  useEffect(() => {
    if (countdown <= 0) {
      window.location.href = CANVA_URL;
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const year = new Date().getFullYear();

  return (
    <main
      className="relative min-h-screen overflow-hidden px-6 py-16"
      style={{ background: theme.gradient, color: theme.fg }}
    >
      {/* Star field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: [
            "radial-gradient(1.5px 1.5px at 8% 12%, rgba(255,255,255,0.65) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 22% 5%, rgba(255,255,255,0.45) 0%, transparent 100%)",
            "radial-gradient(2px 2px at 38% 19%, rgba(212,168,67,0.55) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 54% 8%, rgba(255,255,255,0.40) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 71% 14%, rgba(255,255,255,0.55) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 88% 7%, rgba(255,255,255,0.35) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 5% 35%, rgba(255,255,255,0.30) 0%, transparent 100%)",
            "radial-gradient(2px 2px at 14% 52%, rgba(90,158,159,0.50) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 29% 47%, rgba(255,255,255,0.40) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 46% 61%, rgba(255,255,255,0.35) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 63% 55%, rgba(255,255,255,0.45) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 80% 43%, rgba(255,255,255,0.30) 0%, transparent 100%)",
            "radial-gradient(2px 2px at 93% 58%, rgba(212,168,67,0.40) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 17% 78%, rgba(255,255,255,0.35) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 34% 85%, rgba(255,255,255,0.50) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 52% 92%, rgba(255,255,255,0.30) 0%, transparent 100%)",
            "radial-gradient(2px 2px at 69% 76%, rgba(90,158,159,0.45) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 83% 88%, rgba(255,255,255,0.40) 0%, transparent 100%)",
            "radial-gradient(1.5px 1.5px at 96% 72%, rgba(255,255,255,0.55) 0%, transparent 100%)",
            "radial-gradient(1px 1px at 42% 35%, rgba(212,168,67,0.30) 0%, transparent 100%)",
          ].join(","),
        }}
      />

      <div className="relative mx-auto max-w-2xl">
        {/* Back link */}
        <Link
          to="/"
          className="mb-16 inline-flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
          style={{ color: theme.muted }}
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        {/* Transmission badge */}
        <div className="mb-10 text-center">
          <div
            className="mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs uppercase tracking-widest"
            style={{
              borderColor: "rgba(212,168,67,0.35)",
              color: theme.gold,
              background: "rgba(212,168,67,0.07)",
            }}
          >
            <Radio className="size-3" />
            Transmission from Earth · {year}
          </div>

          <h1 className="mb-5 text-5xl font-bold leading-tight tracking-tight">
            Hello,{" "}
            <span style={{ color: theme.gold }}>whoever you are.</span>
          </h1>

          <p className="text-lg leading-relaxed" style={{ color: theme.muted }}>
            Whether you're from another star, another century, or just another tab —
            <br />
            <em>we were here. And we want you to know it.</em>
          </p>
        </div>

        {/* Main message */}
        <div
          className="mb-8 rounded-2xl border p-8"
          style={{ background: theme.card, borderColor: "rgba(212,168,67,0.14)" }}
        >
          <p className="mb-5 text-base leading-relaxed">
            We are <strong style={{ color: theme.gold }}>humans</strong> — carbon-based creatures on a pale
            blue dot, the third rock from an unremarkable star, in one quiet arm of the Milky Way.
          </p>
          <p className="mb-5 text-base leading-relaxed" style={{ color: theme.muted }}>
            We spent a few hundred thousand years figuring things out. Agriculture. Writing. Calculus.
            Penicillin. Jazz. The microwave. And then — very recently, cosmically speaking — we
            invented a thing called the{" "}
            <strong style={{ color: theme.teal }}>internet</strong>: a collective hallucination we all
            agreed was real, and it more or less is.
          </p>
          <p className="text-base leading-relaxed" style={{ color: theme.muted }}>
            We used it to map the genome, to topple governments, to learn guitar, to find love, and
            — overwhelmingly — to share pictures of our cats. This is who we are. All of it.
          </p>
        </div>

        {/* What we do */}
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest" style={{ color: theme.muted }}>
          Things we do, for the record
        </h2>
        <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {humanFacts.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              className="flex items-start gap-4 rounded-xl border p-5 transition-transform hover:scale-[1.02]"
              style={{ background: theme.card, borderColor: theme.border }}
            >
              <div
                className="mt-0.5 rounded-lg p-2"
                style={{ background: "rgba(212,168,67,0.11)", color: theme.gold }}
              >
                <Icon className="size-4" />
              </div>
              <div>
                <div className="mb-0.5 text-sm font-semibold">{label}</div>
                <div className="text-sm" style={{ color: theme.muted }}>
                  {desc}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* What's on the whiteboard */}
        <div
          className="mb-10 rounded-2xl border p-8 text-center"
          style={{ background: "rgba(90,158,159,0.05)", borderColor: "rgba(90,158,159,0.22)" }}
        >
          <Sparkles className="mx-auto mb-4 size-6" style={{ color: theme.teal }} />
          <h2 className="mb-3 text-xl font-bold">What's on the other side</h2>
          <p className="mb-2 text-base" style={{ color: theme.muted }}>
            A shared whiteboard — thoughts, doodles, and whatever else was on our minds the
            moment this was made. A small slice of how we think.
          </p>
          <p className="text-sm" style={{ color: theme.muted }}>
            Think of it as the napkin where the future was sketched.
          </p>
        </div>

        {/* CTA + countdown */}
        <div className="text-center">
          <a
            href={CANVA_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-5 inline-flex items-center gap-3 rounded-full px-8 py-4 text-base font-semibold transition-transform hover:scale-[1.02]"
            style={{
              background: "rgba(212,168,67,0.16)",
              border: "1px solid rgba(212,168,67,0.45)",
              color: theme.gold,
            }}
          >
            Enter the Whiteboard
            <ArrowUpRight className="size-5" />
          </a>

          <p className="text-sm" style={{ color: theme.muted }}>
            Taking you there in{" "}
            <span style={{ color: theme.gold, fontVariantNumeric: "tabular-nums" }}>
              {countdown}s
            </span>
            {" "}— or click above to go now.
          </p>
        </div>

        {/* Footer */}
        <p className="mt-24 text-center text-xs" style={{ color: theme.muted }}>
          Built with{" "}
          <a href="https://zocomputer.com" style={{ color: theme.teal }} target="_blank" rel="noopener noreferrer">
            Zo
          </a>{" "}
          · From Earth, with love · {year}
        </p>
      </div>
    </main>
  );
}
