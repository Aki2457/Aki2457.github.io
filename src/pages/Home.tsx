import { ArrowUpRight, Mic, Folder, Dices, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";

const theme = {
  bg: "#131111",
  fg: "#f0ece6",
  muted: "#8a8582",
  accent: "#5a9e9f",
  accent2: "#c15f3c",
  card: "rgba(25, 23, 22, 0.9)",
};

const links = [
  { label: "VoiceVOX TTS", to: "/voicevox", icon: Mic, badge: "TTS", badgeColor: theme.accent2 },
  { label: "Projects", to: "/projects", icon: Folder, badge: "WORK", badgeColor: theme.accent },
  { label: "Truth or Dare", to: "/truth-or-dare", icon: Dices, badge: "GAME", badgeColor: "#8b5cf6" },
];

const startButtons = [
  {
    label: "Start With Sound",
    href: "/akr001/?sound=on",
    icon: Volume2,
    style: {
      background: "rgba(255,255,255,0.18)",
      border: "1px solid rgba(255,255,255,0.22)",
    },
  },
  {
    label: "Start Without Sound",
    href: "/akr001/?sound=off",
    icon: VolumeX,
    style: {
      background: "rgba(19,17,17,0.42)",
      border: "1px solid rgba(255,255,255,0.16)",
    },
  },
];

export default function Home() {
  return (
    <>
      <style>{`
        @keyframes heroDrift {
          0% { transform: scale(1.06) translate3d(0%, 0%, 0); }
          50% { transform: scale(1.12) translate3d(-1.5%, -1%, 0); }
          100% { transform: scale(1.06) translate3d(0%, 0%, 0); }
        }
      `}</style>
      <main
        className="relative min-h-screen flex flex-col overflow-hidden"
        style={{ background: theme.bg, color: theme.fg }}
      >
        <img
          src="https://helloearth.zo.space/images/gradient-bg.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.82) saturate(1.12)", animation: "heroDrift 18s ease-in-out infinite" }}
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(19,17,17,0.2) 0%, rgba(19,17,17,0.72) 100%)" }}
        />

        <div className="relative z-10 w-full min-h-screen flex items-center justify-center px-6 py-16">
          <div className="flex flex-col items-center justify-center text-center">
            <img
              src="/images/smiley.png"
              alt=""
              className="size-20 rounded-2xl mb-8"
              style={{ background: "#1a1514", padding: 4, boxShadow: "0 14px 50px rgba(0,0,0,0.35)" }}
            />
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-3"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
              Akira Oh
            </h1>
            <p className="text-lg md:text-xl opacity-80 mb-8 max-w-md"
              style={{ textShadow: "0 1px 10px rgba(0,0,0,0.4)" }}>
              Airplane Folio
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {startButtons.map((button) => {
                const Icon = button.icon;
                return (
                  <a
                    key={button.label}
                    href={button.href}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:scale-105"
                    style={{ ...button.style, backdropFilter: "blur(10px)" }}
                  >
                    <Icon className="size-4" />
                    {button.label}
                    <ArrowUpRight className="size-3 opacity-60" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto w-full max-w-2xl px-6 pb-12 md:pb-16 space-y-4 -mt-8">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className="group flex items-center gap-4 rounded-2xl border p-5 transition-all hover:scale-[1.02] hover:border-white/20"
                style={{ background: theme.card, borderColor: "rgba(255,255,255,0.08)" }}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ background: `${link.badgeColor}20` }}>
                  <Icon className="size-5" style={{ color: link.badgeColor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{link.label}</span>
                    {link.badge && (
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
                        style={{ background: link.badgeColor }}>
                        {link.badge}
                      </span>
                    )}
                  </div>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-white/20 transition-colors group-hover:text-white/50" />
              </Link>
            );
          })}

          <footer className="pt-12 text-center text-xs text-white/15">
            Built with <a href="https://zocomputer.com" className="underline underline-offset-2 hover:text-white/30 transition-colors">Zo</a>
          </footer>
        </div>
      </main>
    </>
  );
}
