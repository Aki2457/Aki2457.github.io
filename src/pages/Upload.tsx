import { useState, useCallback, useRef } from "react";
import { Upload, File, Check, X, Copy, Link2, ArrowUp } from "lucide-react";

const ZO_BASE = "https://helloearth.zo.space";

interface UploadResult {
  url: string;
  filename: string;
  size: number;
  type: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File | null) => {
    setError(null);
    setResult(null);
    setFile(f);
  }, []);

  const upload = useCallback(async () => {
    if (!file) return;
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`${ZO_BASE}/api/upload`, { method: "POST", body: formData });

    if (!res.ok) {
      const err = await res.json();
      setError((err as { error?: string }).error || "Upload failed");
      setUploading(false);
      return;
    }

    setResult(await res.json() as UploadResult);
    setUploading(false);
  }, [file]);

  const copyUrl = useCallback(async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-zinc-950 text-zinc-100">
      <div className="w-full max-w-xl">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-3">File Upload</h1>
          <p className="text-zinc-400 text-lg max-w-md mx-auto">
            Drop any file and get an instant shareable URL. No sign-up, no limits (up to 50MB).
          </p>
        </header>

        <section
          className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200
            ${dragOver ? "border-emerald-400 bg-emerald-400/5 scale-[1.01]" : "border-zinc-700 hover:border-zinc-500 bg-zinc-900/50"}
            ${result ? "border-emerald-500/50 bg-emerald-500/5" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
          onClick={() => inputRef.current?.click()}
        >
          <input ref={inputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />

          {!file && !result && (
            <div className="space-y-3">
              <Upload className="w-10 h-10 mx-auto text-zinc-500" />
              <p className="text-zinc-400"><span className="text-zinc-200 font-medium">Click to browse</span>{" or drag and drop"}</p>
              <p className="text-zinc-600 text-sm">Any file up to 50MB</p>
            </div>
          )}

          {file && !result && !uploading && (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-3">
                <File className="w-8 h-8 text-zinc-400 flex-shrink-0" />
                <div className="text-left min-w-0">
                  <p className="font-medium text-zinc-200 truncate">{file.name}</p>
                  <p className="text-sm text-zinc-500">{formatSize(file.size)}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleFile(null); }} className="p-1.5 rounded-lg hover:bg-zinc-800 transition-colors flex-shrink-0" aria-label="Remove file">
                  <X className="w-4 h-4 text-zinc-500" />
                </button>
              </div>
              <button onClick={(e) => { e.stopPropagation(); upload(); }} className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition-colors text-white">
                <span className="flex items-center justify-center gap-2"><ArrowUp className="w-4 h-4" /> Upload File</span>
              </button>
            </div>
          )}

          {uploading && (
            <div className="space-y-4">
              <div className="animate-spin w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full mx-auto" />
              <p className="text-zinc-400">Uploading{file ? ` ${file.name}` : "..."}</p>
            </div>
          )}

          {result && (
            <div className="space-y-5">
              <div className="flex items-center justify-center gap-2 text-emerald-400">
                <Check className="w-6 h-6" />
                <span className="font-medium">Upload complete</span>
              </div>
              <div className="bg-zinc-900 rounded-xl p-4 text-left">
                <p className="text-xs text-zinc-500 mb-1">Your URL</p>
                <p className="text-sm text-zinc-300 break-all font-mono">{result.url}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={async (e) => { e.stopPropagation(); await copyUrl(); }} className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 rounded-xl font-medium transition-colors">
                  {copied ? <><Check className="w-4 h-4 text-emerald-400" /> Copied</> : <><Copy className="w-4 h-4" /> Copy URL</>}
                </button>
                <a href={result.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="flex items-center justify-center gap-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-500 rounded-xl font-medium transition-colors">
                  <Link2 className="w-4 h-4" /> Open
                </a>
              </div>
              <button onClick={(e) => { e.stopPropagation(); reset(); }} className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
                Upload another file
              </button>
            </div>
          )}
        </section>

        {error && (
          <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <footer className="mt-12 text-center text-sm text-zinc-600">
          Files are stored securely and accessible via direct URL
        </footer>
      </div>
    </main>
  );
}
