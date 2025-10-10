import { useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Verify = () => {
  const [credentialId, setCredentialId] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: "50%", glowY: "50%" });

  // Prefer env, fallback for local dev (verifier service)
  const baseURL =
    (import.meta as any).env?.VITE_VERIFIER_URL ||"http://localhost:8081";

  const onCardMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const ry = (px - 0.5) * 10;
    const rx = (0.5 - py) * 10;
    setTilt({ rx, ry, glowX: `${px * 100}%`, glowY: `${py * 100}%` });
  };

  const onCardLeave = () => {
    setTilt({ rx: 0, ry: 0, glowX: "50%", glowY: "50%" });
  };

  const handleVerify = async () => {
    if (!credentialId.trim()) {
      setResponse("Please enter a credential ID");
      setIsVerified(false);
      return;
    }

    setIsLoading(true);
    setResponse("");
    setIsVerified(null);

    try {
      const res = await axios.post(`${baseURL}/verify`, { credentialId });
      setResponse(JSON.stringify(res.data?.result ?? res.data, null, 2));
      setIsVerified(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Verification failed. Please try again.";
      setResponse("Error: " + msg);
      setIsVerified(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Ambient animated background (same as Issue) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute inset-0 bg-[radial-gradient(60rem_60rem_at_10%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(70rem_70rem_at_90%_20%,rgba(249,115,22,0.14),transparent),radial-gradient(50rem_50rem_at_30%_90%,rgba(56,189,248,0.12),transparent)] animate-gradient-shift" />
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.20)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-pan" />
        </div>
        <div className="absolute inset-x-0 top-28 mx-auto h-64 max-w-7xl rounded-3xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm" />
        <div className="absolute inset-x-0 top-[28rem] mx-auto h-72 max-w-7xl rounded-3xl bg-white/[0.035] ring-1 ring-white/10 backdrop-blur-sm" />
        <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl animate-float" />
        <div className="absolute right-24 bottom-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl animate-float-slow" />
        <div className="absolute right-1/4 top-1/4 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl animate-float-medium" />
        <div className="absolute -left-16 top-1/3 h-64 w-[140%] -rotate-6 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-orange-400/0 blur-xl" />
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAKElEQVQYV2NkwAT/Gf7//z8GJgYGBgYmQGQYGBiGkQwGQ2EYwA0kAAB8cQeQ6p2t5gAAAABJRU5ErkJggg==')]" />
      </div>

      {/* Top nav (Verify highlighted) */}
      <nav className="mx-auto mt-6 mb-6 flex max-w-7xl items-center justify-between rounded-2xl bg-white/5 px-5 py-3 backdrop-blur-md ring-1 ring-white/10">
        <Link to="/issue" className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-orange-500 ring-1 ring-white/20 shadow-md shadow-indigo-500/20">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-wide text-white/90">
            Kube Credential
          </span>
        </Link>
        <div className="flex gap-2">
          <Link
            to="/issue"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            Issue
          </Link>
          <Link
            to="/verify"
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95"
          >
            Verify
          </Link>
        </div>
      </nav>

      {/* Micro-strip (optional trust badges to match Issue) */}
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between gap-4 px-6">
        <div className="flex items-center gap-3 text-sm text-slate-300">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
            Signed & anchored
          </span>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <svg className="h-3.5 w-3.5 text-blue-300" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Enterprise security
          </span>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
            <svg className="h-3.5 w-3.5 text-amber-300" viewBox="0 0 24 24" fill="currentColor"><path d="M3 11l9-9 9 9v10a2 2 0 01-2 2h-4v-7H9v7H5a2 2 0 01-2-2V11z"/></svg>
            Self-host friendly
          </span>
        </div>
        <div className="hidden md:flex items-center gap-3 text-xs text-slate-400">
          <span className="opacity-80">SOC2-ready</span>
          <span className="opacity-40">•</span>
          <span className="opacity-80">Audit logging</span>
          <span className="opacity-40">•</span>
          <span className="opacity-80">API-first</span>
        </div>
      </div>

      {/* Content (styled like Issue card) */}
      <main className="mx-auto w-full max-w-7xl px-6 pb-28">
        <section
          className="group relative overflow-visible rounded-2xl p-[1px]"
          style={{
            background:
              "conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.45), rgba(249,115,22,0.45), rgba(14,165,233,0.45), rgba(99,102,241,0.45))",
            mask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
            WebkitMask: "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
          }}
        >
          <div className="absolute inset-0 rounded-2xl bg-black/60 backdrop-blur-xl ring-1 ring-white/10" />
          <div
            ref={cardRef}
            onMouseMove={onCardMove}
            onMouseLeave={onCardLeave}
            style={{
              transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
              transition: "transform 0.2s ease-out",
            }}
            className="relative rounded-2xl p-8"
          >
            <div
              className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: `radial-gradient(400px 200px at ${tilt.glowX} ${tilt.glowY}, rgba(99,102,241,0.10), transparent 70%)`,
              }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 shadow-inner shadow-black/20">
                  <svg className="h-6 w-6 text-orange-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l9 4-9 4-9-4 9-4zm0 7l9 4-9 4-9-4 9-4zm0 7l9 4-9 4-9-4 9-4z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Credential Verification</h2>
                  <p className="text-sm text-slate-300">
                    Verify authenticity securely with cryptographic proofs
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <label htmlFor="credentialId" className="mb-2 block text-sm font-medium text-slate-200">
                  Credential ID
                </label>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7zm4 3h10v2H7v-2z" />
                      </svg>
                    </span>
                    <input
                      id="credentialId"
                      type="text"
                      placeholder="e.g. 0xA1B2C3... or UUID"
                      value={credentialId}
                      onChange={(e) => setCredentialId(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3.5 text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/40 focus:bg-white/10"
                    />
                  </div>

                  <button
                    onClick={handleVerify}
                    disabled={isLoading}
                    className="relative inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="spinner h-5 w-5" />
                        Verifying...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 6-6 2 2-8 8-4-4 2-2z" />
                        </svg>
                        Verify
                      </span>
                    )}
                    {!isLoading && (
                      <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 [mask-image:radial-gradient(80%_60%_at_50%_50%,#000_40%,transparent_60%)]" />
                    )}
                  </button>
                </div>
              </div>

              {isVerified !== null && (
                <div
                  className={`mt-6 flex items-start gap-3 rounded-xl border p-4 transition ${
                    isVerified
                      ? "border-green-400/20 bg-green-400/10 text-green-200"
                      : "border-red-400/20 bg-red-400/10 text-red-200"
                  }`}
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/20">
                    {isVerified ? (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 12l2 2 6-6 2 2-8 8-4-4 2-2z" />
                      </svg>
                    ) : (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" />
                      </svg>
                    )}
                  </span>
                  <p className="text-sm font-medium">
                    {isVerified ? "Credential verified successfully." : "Verification failed."}
                  </p>
                </div>
              )}

              {response && (
                <div className="mt-6">
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                    <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 3h10l6 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                    </svg>
                    Verification Response
                  </h3>
                  <pre className="max-h-[40vh] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-slate-200">
{response}
                  </pre>
                </div>
              )}

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-6">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 1l3 5 5 1-4 4 1 5-5-3-5 3 1-5-4-4 5-1 3-5z" />
                  </svg>
                  Bank-grade cryptography. Zero-knowledge ready.
                </div>
                <Link
                  to="/issue"
                  className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10 transition hover:bg-white/10"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" />
                  </svg>
                  Issue a new credential
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Status indicators (match Issue) */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-0.5 text-xs font-medium text-green-300">
          <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse"></span>
          System Online
        </span>
        <span className="flex items-center gap-1 rounded-full bg-blue-500/20 px-2 py-0.5 text-xs font-medium text-blue-300">
          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          Enterprise Secured
        </span>
      </div>

      {/* Local styles for animations (same as Issue) */}
      <style>{`
        @keyframes gridPan {
          0% { background-position: 0px 0px, 0px 0px; }
          100% { background-position: 40px 40px, 40px 40px; }
        }
        .animate-grid-pan { animation: gridPan 18s linear infinite; }

        @keyframes gradientShift {
          0%, 100% { transform: translateY(0px) }
          50% { transform: translateY(-8px) }
        }
        .animate-gradient-shift { animation: gradientShift 16s ease-in-out infinite; }

        @keyframes float {
          0%, 100% { transform: translateY(0) }
          50% { transform: translateY(-12px) }
        }
        .animate-float { animation: float 10s ease-in-out infinite; }
        .animate-float-slow { animation: float 14s ease-in-out infinite; }
        .animate-float-medium { animation: float 12s ease-in-out infinite; }

        .spinner {
          border-radius: 9999px;
          border: 2px solid rgba(255,255,255,0.25);
          border-top-color: white;
          width: 20px;
          height: 20px;
          animation: spin 0.9s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <footer className="fixed bottom-0 inset-x-0 bg-slate-900/60 backdrop-blur-md border-t border-white/5 py-2">
        <div className="container mx-auto flex items-center justify-between px-4 text-xs text-slate-400">
          <div>Kube Credential System v1.0</div>
          <div className="flex items-center gap-4">
            <span>Documentation</span>
            <span>API</span>
            <span>Support</span>
            <span className="flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Verify;
