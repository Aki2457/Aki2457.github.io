import { ArrowLeft, ArrowUpRight } from "lucide-react";

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}
import { Link } from "react-router-dom";

const theme = {
  bg: "#131111",
  fg: "#f0ece6",
  muted: "#8a8582",
  accent: "#5a9e9f",
  card: "rgba(25, 23, 22, 0.9)",
};

const projects = [
  {
    title: "VoiceVOX TTS",
    desc: "Japanese text-to-speech synthesis platform. Full character roster, dynamic voice switching, AI pronunciation adjustment.",
    href: "/voicevox",
    internal: true,
    tags: ["React", "TypeScript", "VoiceVOX API"],
  },
  {
    title: "Zo Space Builder",
    desc: "Personal cloud computer environment. Custom websites, APIs, scheduled automations, and AI-powered workflows.",
    href: "https://zocomputer.com",
    internal: false,
    tags: ["Hono", "Tailwind", "Bun"],
  },
  {
    title: "AI Power User",
    desc: "Building with large language models — prompt engineering, agent orchestration, and multi-model workflows.",
    href: "#",
    internal: false,
    tags: ["AI", "LLM", "Automation"],
  },
  {
    title: "LinkedIn",
    desc: "Professional profile, background, and current work.",
    href: "https://linkedin.com/in/akira-oh-840892356",
    internal: false,
    tags: ["Profile", "Career", "Contact"],
    icon: LinkedinIcon,
  },
];

export default function Projects() {
  return (
    <main
      className="min-h-screen"
      style={{ background: theme.bg, color: theme.fg }}
    >
      <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm mb-12 transition-colors hover:opacity-70"
          style={{ color: theme.muted }}
        >
          <ArrowLeft className="size-4" />
          Back home
        </Link>

        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Projects
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: theme.muted }}>
              Things I&apos;ve been building. AI, web, and beyond.
            </p>
          </div>
          <img
            src="/images/flower.png"
            alt=""
            className="w-40 md:w-56 shrink-0"
          />
        </div>

        <blockquote className="border-l-4 pl-6 py-2 mb-16" style={{ borderColor: theme.accent }}>
          <p className="text-2xl md:text-3xl font-bold leading-snug">
            &ldquo;Build things that matter. Ship fast. Learn relentlessly.&rdquo;
          </p>
          <cite className="block mt-3 text-sm not-italic" style={{ color: theme.muted }}>
            — Akira Oh
          </cite>
        </blockquote>

        <div className="space-y-4 mb-16">
          {projects.map((p) => {
            const Icon = (p as any).icon;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {Icon ? (
                        <span
                          className="inline-flex size-9 items-center justify-center rounded-xl"
                          style={{ background: `${theme.accent}1a`, color: theme.accent }}
                        >
                          <Icon className="size-4" />
                        </span>
                      ) : null}
                      <h2 className="text-xl font-bold group-hover:underline underline-offset-4">
                        {p.title}
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed mb-4" style={{ color: theme.muted }}>
                      {p.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full px-3 py-1 text-[11px] font-semibold"
                          style={{ background: `${theme.accent}1a`, color: theme.accent }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowUpRight className="size-5 shrink-0 mt-1 text-white/20 transition-colors group-hover:text-white/50" />
                </div>
              </>
            );

            const cls = "group block rounded-2xl border p-6 transition-all hover:scale-[1.01] hover:border-white/20";
            const sty = { background: theme.card, borderColor: "rgba(255,255,255,0.08)" };

            return p.internal ? (
              <Link key={p.href} to={p.href} className={cls} style={sty}>{inner}</Link>
            ) : (
              <a
                key={p.href}
                href={p.href}
                target={p.href.startsWith("http") ? "_blank" : undefined}
                rel={p.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={cls}
                style={sty}
              >{inner}</a>
            );
          })}
        </div>

        <footer className="text-center text-xs text-white/15">
          Built with <a href="https://zocomputer.com" className="underline underline-offset-2 hover:text-white/30 transition-colors">Zo</a>
        </footer>
      </div>
    </main>
  );
}
