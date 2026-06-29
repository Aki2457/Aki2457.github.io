import { useMemo, useState } from "react";
import { ArrowLeft, ArrowUpRight, Volume2, VolumeX } from "lucide-react";
import { Link } from "react-router-dom";

const theme = {
  bg: "#090d14",
  fg: "#f0ece6",
  muted: "#94a3b8",
  accent: "#5a9e9f",
  accent2: "#c15f3c",
  panel: "rgba(11, 16, 25, 0.88)",
  border: "rgba(255,255,255,0.1)",
};

const modes = [
  { id: "sound-on", label: "Start With Sound", icon: Volume2, href: "/akr001/?sound=on" },
  { id: "sound-off", label: "Start Without Sound", icon: VolumeX, href: "/akr001/?sound=off" },
] as const;

export default function AirplaneFolioPage() {
  const [mode, setMode] = useState<(typeof modes)[number]["id"]>("sound-on");
  const activeMode = useMemo(() => modes.find((item) => item.id === mode) ?? modes[0], [mode]);

  return (
    <main
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(circle at top, rgba(90,158,159,0.18), transparent 24%), linear-gradient(180deg, #090d14 0%, #05070b 100%)",
        color: theme.fg,
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-[1600px] flex-col px-4 py-4 md:px-6">
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border px-4 py-3"
          style={{ background: theme.panel, borderColor: theme.border, backdropFilter: "blur(12px)" }}
        >
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm"
              style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${theme.border}` }}
            >
              <ArrowLeft className="size-4" />
              Home
            </Link>
            <div>
              <div className="text-xs uppercase tracking-[0.22em]" style={{ color: theme.muted }}>
                AKR001
              </div>
              <div className="text-lg font-semibold">Airplane Folio</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {modes.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeMode.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setMode(item.id)}
                  className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-transform hover:scale-[1.02]"
                  style={{
                    background: active ? "rgba(90,158,159,0.18)" : "rgba(255,255,255,0.06)",
                    border: `1px solid ${active ? "rgba(90,158,159,0.45)" : theme.border}`,
                  }}
                >
                  <Icon className="size-4" />
                  {item.label}
                </button>
              );
            })}
            <a
              href={activeMode.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{ background: "rgba(193,95,60,0.18)", border: `1px solid rgba(193,95,60,0.42)` }}
            >
              Open Fullscreen
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <div
          className="min-h-0 flex-1 overflow-hidden rounded-2xl border"
          style={{ background: theme.panel, borderColor: theme.border, boxShadow: "0 24px 80px rgba(0,0,0,0.28)" }}
        >
          <iframe
            key={activeMode.href}
            src={activeMode.href}
            title="AKR001 Airplane Folio"
            className="h-[calc(100vh-8.75rem)] w-full border-0"
            allow="autoplay; fullscreen"
          />
        </div>
      </div>
    </main>
  );
}
