import { useState, useEffect } from "react";
import { Activity, CheckCircle2, XCircle, AlertTriangle, Wifi, Server, Mic, RefreshCw } from "lucide-react";

const ZO_BASE = "https://helloearth.zo.space";

interface Check {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: "ok" | "fail" | "warn";
  latency_ms: number;
  detail: string;
}

const theme = { bg: "#0d0d0d", card: "#161616", border: "#272727", green: "#22c55e", red: "#ef4444", amber: "#f59e0b", muted: "#a1a1aa" };

export default function HealthPage() {
  const [data, setData] = useState<{ timestamp?: string; all_ok?: boolean; total_ms?: number; results?: Record<string, { status: string; latency_ms: number; detail: string }> } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHealth = async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetch(`${ZO_BASE}/api/health`);
      if (!r.ok) throw new Error(`API ${r.status}`);
      setData(await r.json());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHealth(); }, []);

  const resolveIcon = (key: string) => {
    switch (key) {
      case "pipeline": return <Activity className="size-4" />;
      case "voicevox_main": return <Mic className="size-4" />;
      case "voicevox_nemo": return <Mic className="size-4" />;
      case "internet": return <Wifi className="size-4" />;
      default: return <Server className="size-4" />;
    }
  };

  const statusIcon = (s: string) => s === "ok"
    ? <CheckCircle2 className="size-5" style={{ color: theme.green }} />
    : s === "warn"
    ? <AlertTriangle className="size-5" style={{ color: theme.amber }} />
    : <XCircle className="size-5" style={{ color: theme.red }} />;

  const checks: Check[] = data?.results
    ? Object.entries(data.results).map(([k, v]) => ({
        key: k,
        label: k.replace(/_/g, " "),
        icon: resolveIcon(k),
        status: v.status as "ok" | "fail" | "warn",
        latency_ms: v.latency_ms,
        detail: v.detail,
      }))
    : [];

  return (
    <main className="min-h-screen px-4 py-12 md:py-20 flex flex-col items-center" style={{ background: theme.bg, color: "#fafafa" }}>
      <div className="w-full max-w-xl space-y-8">
        <header className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider" style={{ background: theme.card, border: `1px solid ${theme.border}`, color: theme.muted }}>
            <Activity className="size-3" /> System Status
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Health Check</h1>
          <p className="text-sm" style={{ color: theme.muted }}>Real-time monitoring of all services</p>
        </header>

        {loading ? (
          <div className="flex justify-center py-16">
            <RefreshCw className="size-8 animate-spin" style={{ color: theme.muted }} />
          </div>
        ) : error ? (
          <div className="rounded-xl p-6 text-center space-y-3" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
            <XCircle className="size-10 mx-auto" style={{ color: theme.red }} />
            <p className="text-sm font-medium" style={{ color: theme.red }}>Failed to load health data</p>
            <p className="text-xs" style={{ color: theme.muted }}>{error}</p>
            <button onClick={fetchHealth} className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer border transition-colors" style={{ background: "transparent", color: theme.muted, borderColor: theme.border }}>
              <RefreshCw className="size-3" /> Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 rounded-xl p-5" style={{ background: data?.all_ok ? "#14532d" : "#7f1d1d", border: `1px solid ${data?.all_ok ? "#22c55e44" : "#ef444444"}` }}>
              {data?.all_ok ? <CheckCircle2 className="size-7" style={{ color: theme.green }} /> : <XCircle className="size-7" style={{ color: theme.red }} />}
              <div className="flex-1">
                <div className="text-lg font-bold">{data?.all_ok ? "All Systems Operational" : "Some Services Down"}</div>
                <div className="text-xs opacity-70" style={{ fontFamily: "monospace" }}>{data?.timestamp} · {data?.total_ms}ms</div>
              </div>
            </div>

            <div className="space-y-3">
              {checks.map(c => (
                <div key={c.key} className="flex items-center gap-4 rounded-xl p-4 transition-colors" style={{ background: theme.card, border: `1px solid ${theme.border}` }}>
                  <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "#ffffff08" }}>
                    {c.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold capitalize">{c.label}</span>
                      <span className="text-[10px] font-mono opacity-50">{c.latency_ms}ms</span>
                    </div>
                    <div className="text-xs truncate mt-0.5" style={{ color: theme.muted }}>{c.detail}</div>
                  </div>
                  {statusIcon(c.status)}
                </div>
              ))}
            </div>

            <button onClick={fetchHealth} className="w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold cursor-pointer border transition-colors" style={{ background: theme.card, color: theme.muted, borderColor: theme.border }}>
              <RefreshCw className="size-4" /> Refresh
            </button>
          </>
        )}
      </div>
    </main>
  );
}
