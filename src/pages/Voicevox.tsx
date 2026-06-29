import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "react-router-dom";

const ZO_BASE = "https://helloearth.zo.space";

const SERVERS = {
  main: { label: "VOICEVOX Main", url: "https://voicevox-main.zeabur.app" },
  nemo: { label: "VOICEVOX Nemo", url: "https://voicevox-nemo.zeabur.app" },
};
type ServerKey = keyof typeof SERVERS;

interface SpeakerStyle { name: string; id: number }
interface Speaker { name: string; speaker_uuid: string; styles: SpeakerStyle[] }

export default function VoicevoxPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [server, setServer] = useState<ServerKey>("main");
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [voiceIdx, setVoiceIdx] = useState(-1);
  const [styleIdx, setStyleIdx] = useState(0);
  const [text, setText] = useState("");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(0);
  const [intonation, setIntonation] = useState(1);
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [loadingSpeakers, setLoadingSpeakers] = useState(false);
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const voice = speakers[voiceIdx];
  const style = voice?.styles[styleIdx];

  const fetchSpeakers = useCallback(async () => {
    setLoadingSpeakers(true);
    try {
      const resp = await fetch(`${ZO_BASE}/api/voicevox/speakers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server: SERVERS[server].url }),
      });
      if (!resp.ok) throw new Error("Failed");
      const data: Speaker[] = await resp.json();
      setSpeakers(data);
      return data;
    } catch {
      setError(`Cannot reach ${SERVERS[server].label}`);
      return [];
    } finally {
      setLoadingSpeakers(false);
    }
  }, [server]);

  useEffect(() => {
    fetchSpeakers().then((data) => {
      if (data.length === 0) return;
      const urlText = searchParams.get("text") || "";
      const urlVoice = searchParams.get("voice") || "";
      const urlTone = searchParams.get("tone") || "";

      let foundIdx = -1;
      if (urlVoice) {
        const q = urlVoice.toLowerCase();
        foundIdx = data.findIndex((s) => s.name.toLowerCase().includes(q) || s.name.toLowerCase() === q);
      }

      setVoiceIdx(foundIdx >= 0 ? foundIdx : 0);
      if (urlText) setText(urlText);

      if (urlTone === "ai" && urlText) {
        setTimeout(() => runAiFix(urlText), 600);
      }
    });
  }, []);

  const aiFix = useCallback(async () => {
    if (!text.trim()) return;
    setAiLoading(true);
    try {
      const resp = await fetch("https://api.zo.computer/zo/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `You are a Japanese pronunciation expert. Adjust ONLY kanji readings, punctuation, and spacing to improve TTS pronunciation. Do NOT change meaning. Output ONLY the adjusted text.\n\nText: ${text.trim()}`,
          model_name: "vercel:deepseek/deepseek-v4-pro",
          stream: false,
        }),
      });
      if (!resp.ok) throw new Error("AI failed");
      const data = await resp.json() as { output?: string };
      const fixed = (data.output || text).trim();
      setText(fixed);
      updateUrl(fixed, null);
    } catch {
      setError("AI adjustment failed");
    } finally {
      setAiLoading(false);
    }
  }, [text]);

  const runAiFix = async (t: string) => {
    setAiLoading(true);
    try {
      const resp = await fetch("https://api.zo.computer/zo/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: `You are a Japanese pronunciation expert. Adjust ONLY kanji readings, punctuation, and spacing to improve TTS pronunciation. Do NOT change meaning. Output ONLY the adjusted text.\n\nText: ${t.trim()}`,
          model_name: "vercel:deepseek/deepseek-v4-pro",
          stream: false,
        }),
      });
      if (!resp.ok) return;
      const data = await resp.json() as { output?: string };
      setText((data.output || t).trim());
      updateUrl((data.output || t).trim(), null);
    } catch { /* silent */ } finally { setAiLoading(false); }
  };

  const updateUrl = (t: string | null, v: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (t !== null) { if (t) params.set("text", t); else params.delete("text"); }
    if (v !== null) { if (v) params.set("voice", v); else params.delete("voice"); }
    setSearchParams(params, { replace: true });
  };

  const generate = useCallback(async () => {
    if (!voice || !style || !text.trim()) return;
    setLoading(true);
    setError(null);
    setAudioUrl(null);
    try {
      const srv = SERVERS[server].url;
      const qResp = await fetch(`${ZO_BASE}/api/voicevox/audio_query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server: srv, text: text.trim(), speaker: style.id }),
      });
      if (!qResp.ok) throw new Error("audio_query failed");
      const q = await qResp.json() as Record<string, unknown>;
      q.speedScale = speed;
      q.pitchScale = pitch;
      q.intonationScale = intonation;
      q.volumeScale = volume;

      const sResp = await fetch(`${ZO_BASE}/api/voicevox/synthesis`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ server: srv, speaker: style.id, query: q }),
      });
      if (!sResp.ok) throw new Error("synthesis failed");
      const blob = await sResp.blob();
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      setAudioUrl(URL.createObjectURL(blob));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [voice, style, text, speed, pitch, intonation, volume, server]);

  const pickVoice = (i: number) => {
    setVoiceIdx(i);
    setStyleIdx(0);
    setShowVoicePicker(false);
    updateUrl(null, speakers[i]?.name ?? "");
  };

  const missingParams: string[] = [];
  if (!text.trim()) missingParams.push("text");
  if (voiceIdx < 0) missingParams.push("voice");

  return (
    <main className="min-h-screen flex justify-center bg-[#181818]">
      <div className="w-full max-w-xl px-5 py-10 flex flex-col gap-6">
        <div className="text-center">
          <div className="text-3xl font-black text-white tracking-tight">VOICEVOX</div>
          <div className="text-xs text-neutral-500 mt-1 uppercase tracking-[.2em]">Voice Studio</div>
        </div>

        {missingParams.length > 0 && (
          <div className="rounded-xl border border-amber-700/30 bg-amber-950/20 p-4 text-center">
            <div className="text-amber-400 text-sm font-bold mb-1">Fill in the blanks</div>
            <div className="text-amber-200/60 text-xs">
              {missingParams.map((p, i) => (
                <span key={p}>
                  <code className="text-amber-300 bg-amber-950/40 px-1 rounded">{p}</code>
                  {i < missingParams.length - 1 ? " + " : ""}
                </span>
              ))}{" "}
              {missingParams.length === 1 ? "is" : "are"} needed
            </div>
          </div>
        )}

        <div>
          <label className="text-[11px] uppercase tracking-[.06em] font-bold text-neutral-500 block mb-2">Server</label>
          <div className="flex gap-1 p-1 rounded-xl bg-neutral-800">
            {(Object.keys(SERVERS) as ServerKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setServer(k)}
                className={`flex-1 rounded-[10px] py-2.5 text-xs font-bold transition-colors ${server === k ? "bg-white text-orange-600 shadow-sm" : "bg-transparent text-neutral-400"}`}
              >
                {SERVERS[k].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[.06em] font-bold text-neutral-500 block mb-2">
            Text {!text.trim() && <span className="text-amber-400 ml-1">required</span>}
          </label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); updateUrl(e.target.value, null); }}
            placeholder="Enter Japanese text…"
            rows={4}
            className="w-full bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-white text-lg outline-none resize-none focus:border-orange-500 transition-colors placeholder-neutral-600"
          />
          <div className="flex justify-between items-center mt-1.5">
            <span className="text-[11px] text-neutral-600 font-mono">{text.length} / 3000</span>
            <button
              onClick={aiFix}
              disabled={aiLoading || !text.trim()}
              className="inline-flex items-center gap-1.5 rounded-full bg-amber-950/30 border border-amber-700/20 px-3 py-1 text-[11px] font-bold text-amber-400 disabled:opacity-30 transition-opacity"
            >
              ✨ {aiLoading ? "Adjusting…" : "AI Fix"}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-[.06em] font-bold text-neutral-500 block mb-2">
            Voice {voiceIdx < 0 && <span className="text-amber-400 ml-1">required</span>}
          </label>
          {loadingSpeakers ? (
            <div className="flex items-center gap-2 py-3 text-neutral-500 text-sm">Loading…</div>
          ) : (
            <button
              onClick={() => setShowVoicePicker(true)}
              className="w-full flex items-center gap-3 bg-neutral-900 border border-neutral-700 rounded-xl p-3 text-left hover:border-orange-500/50 transition-colors"
            >
              {voice ? (
                <>
                  <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center">
                    <span className="text-sm font-black text-orange-400">{voice.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-bold">{voice.name}</div>
                    <div className="text-neutral-500 text-[11px]">{voice.styles.length} styles</div>
                  </div>
                  <div className="flex gap-1 flex-wrap">
                    {voice.styles.map((s, si) => (
                      <button
                        key={s.id}
                        onClick={(e) => { e.stopPropagation(); setStyleIdx(si); }}
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${si === styleIdx ? "bg-orange-600/20 text-orange-400" : "text-neutral-500"}`}
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <span className="text-neutral-500 text-sm py-1">Pick a voice…</span>
              )}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-4 bg-neutral-900 border border-neutral-800 rounded-xl p-4">
          <ParamSlider label="Speed" value={speed} min={0.5} max={2} step={0.05} onChange={setSpeed} fmt={(v) => v.toFixed(2) + "×"} />
          <ParamSlider label="Pitch" value={pitch} min={-0.15} max={0.15} step={0.01} onChange={setPitch} color="#7a5c44" fmt={(v) => (v > 0 ? "+" : "") + v.toFixed(2)} />
          <ParamSlider label="Intonation" value={intonation} min={0} max={2} step={0.05} onChange={setIntonation} />
          <ParamSlider label="Volume" value={volume} min={0} max={2} step={0.05} onChange={setVolume} />
        </div>

        <button
          onClick={generate}
          disabled={loading || !voice || !text.trim()}
          className="w-full rounded-xl bg-orange-600 py-3.5 text-white font-bold text-base hover:bg-orange-500 disabled:opacity-40 transition-opacity flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin size-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2.5" strokeDasharray="40 20" strokeLinecap="round" /></svg>
              Synthesising…
            </>
          ) : <>✨ Synthesize</>}
        </button>

        {error && (
          <div className="rounded-xl bg-red-950/20 border border-red-800/30 p-3 text-sm text-red-400 flex items-start gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0 mt-0.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
            {error}
          </div>
        )}

        {audioUrl && (
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
            <audio ref={audioRef} controls src={audioUrl} className="w-full" autoPlay />
            <div className="flex justify-between mt-3">
              <span className="text-[11px] text-neutral-600 font-mono">{voice?.name} · {style?.name}</span>
              <a href={audioUrl} download={`${voice?.name || "voicevox"}.wav`} className="text-[11px] font-bold text-orange-400 hover:underline">
                Download WAV
              </a>
            </div>
          </div>
        )}

        <div className="text-center text-[10px] text-neutral-700 font-mono">
          /voicevox?text=…&voice=…&tone=ai
        </div>

        {showVoicePicker && (
          <div className="fixed inset-0 z-50 bg-neutral-950/95 flex flex-col">
            <div className="flex justify-between items-center px-5 py-4 border-b border-neutral-800">
              <div className="text-white text-lg font-black">Pick a Voice</div>
              <button onClick={() => setShowVoicePicker(false)} className="w-8 h-8 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-400">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col gap-2">
              {speakers.map((s, i) => (
                <button
                  key={i}
                  onClick={() => pickVoice(i)}
                  className={`flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${i === voiceIdx ? "bg-orange-600/10 border border-orange-500/30" : "bg-neutral-900 border border-neutral-800 hover:border-neutral-700"}`}
                >
                  <div className="w-9 h-9 rounded-lg bg-orange-600/20 border border-orange-500/40 flex items-center justify-center">
                    <span className="text-sm font-black text-orange-400">{s.name[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-bold">{s.name}</div>
                    <div className="flex gap-1 mt-0.5">
                      {s.styles.map((st) => (
                        <span key={st.id} className="text-[10px] text-neutral-500 bg-neutral-800 rounded-full px-1.5 py-px">{st.name}</span>
                      ))}
                    </div>
                  </div>
                  {i === voiceIdx && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function ParamSlider({
  label, value, min, max, step = 0.01, onChange, fmt, color = "#f97316",
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; fmt?: (v: number) => string; color?: string;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[13px] font-medium text-neutral-300">{label}</span>
        <span className="text-xs font-mono" style={{ color }}>{fmt ? fmt(value) : value.toFixed(2)}</span>
      </div>
      <div className="relative h-[19px] flex items-center">
        <div className="absolute inset-x-0 h-1.5 rounded-full bg-neutral-800" />
        <div className="absolute left-0 h-1.5 rounded-full" style={{ width: `${pct}%`, background: color }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-x-0 w-full h-[19px] appearance-none bg-transparent outline-none cursor-pointer"
          style={{ WebkitAppearance: "none" }}
        />
      </div>
    </div>
  );
}
