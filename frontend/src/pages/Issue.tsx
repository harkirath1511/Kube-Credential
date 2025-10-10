import { useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Issue = () => {
  const [name, setName] = useState("");
  const [credential, setCredential] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);
  const [burst, setBurst] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: "50%", glowY: "50%" });
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Prefer env, fallback for local dev
  const baseURL = (import.meta as any).env?.VITE_SERVER_URL || "http://localhost:8080";

  const templates = [
    { title: "Kubernetes Access", hint: "RBAC-bound short-lived token", value: "Kubernetes Access", grad: "from-indigo-500 to-sky-500" },
    { title: "Training Certificate", hint: "Completion w/ hash proof", value: "Certificate", grad: "from-violet-500 to-fuchsia-500" },
    { title: "Project Badge", hint: "Repo-contribution badge", value: "Badge", grad: "from-emerald-500 to-teal-500" },
    { title: "Enterprise License", hint: "Seat-based license claim", value: "License", grad: "from-orange-500 to-rose-500" },
  ];

  const recentActivity = [
    { who: "A. Sharma", what: "Issued Certificate", when: "2m ago", ok: true },
    { who: "Ops Bot", what: "Revoked Badge", when: "14m ago", ok: false },
    { who: "K. Gill", what: "Verified License", when: "29m ago", ok: true },
    { who: "CI Runner", what: "Issued K8s Access", when: "1h ago", ok: true },
  ];

  const faqs = [
    {
      q: "How are credentials secured?",
      a: "Each credential is signed and hashed. Anyone can verify integrity via the Verify page or API without exposing private keys.",
    },
    {
      q: "Can I customize templates?",
      a: "Yes. Select a template as a starting point then adjust fields before issuing. Advanced templates can be added server-side.",
    },
    {
      q: "Where is data stored?",
      a: "Only the signed payload is returned to you. The server keeps minimal audit metadata to support verification and logs.",
    },
  ];

  const handleIssue = async () => {
    if (!name.trim() || !credential.trim()) {
      setResponse("Please fill in all fields");
      setIsSuccess(false);
      return;
    }

    setIsLoading(true);
    setResponse("");
    setIsSuccess(null);

    try {
      const res = await axios.post(`${baseURL}/gen`, {
        name,
        credential,
      });
      setResponse(JSON.stringify(res.data.response, null, 2));
      setIsSuccess(true);
      setBurst(true);
      setTimeout(() => setBurst(false), 1400);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Issuance failed. Please try again.";
      setResponse("Error: " + msg);
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  const onCardMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width;
    const py = y / rect.height;
    const ry = (px - 0.5) * 10; // rotateY
    const rx = (0.5 - py) * 10; // rotateX
    setTilt({
      rx,
      ry,
      glowX: `${px * 100}%`,
      glowY: `${py * 100}%`,
    });
  };

  const onCardLeave = () => {
    setTilt({ rx: 0, ry: 0, glowX: "50%", glowY: "50%" });
  };

  const suggestions = ["Certificate", "License", "Badge", "Membership", "Kubernetes Access"];

  const handleCopy = async () => {
    if (!response) return;
    try {
      await navigator.clipboard.writeText((JSON.parse(response).credentialId).toString());
    } catch {}
  };

  const handleDownload = () => {
    if (!response) return;
    const blob = new Blob([response], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const file = isSuccess ? "credential.json" : "error.json";
    a.download = file;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Live preview before issuing
  const preview = JSON.stringify(
    {
      name: name || "Jane Doe",
      credential: credential || "Kubernetes Access",
      issuedAt: new Date().toISOString(),
      issuer: "Kube Credential",
      id: "preview-only",
    },
    null,
    2
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Ambient animated background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(60rem_60rem_at_10%_10%,rgba(99,102,241,0.18),transparent),radial-gradient(70rem_70rem_at_90%_20%,rgba(249,115,22,0.14),transparent),radial-gradient(50rem_50rem_at_30%_90%,rgba(56,189,248,0.12),transparent)] animate-gradient-shift" />
        {/* Moving grid */}
        <div className="absolute inset-0 opacity-[0.08]">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.20)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.20)_1px,transparent_1px)] bg-[size:40px_40px] animate-grid-pan" />
        </div>
        {/* Section background blocks to avoid large empty areas */}
        <div className="absolute inset-x-0 top-28 mx-auto h-64 max-w-7xl rounded-3xl bg-white/[0.04] ring-1 ring-white/10 backdrop-blur-sm" />
        <div className="absolute inset-x-0 top-[28rem] mx-auto h-72 max-w-7xl rounded-3xl bg-white/[0.035] ring-1 ring-white/10 backdrop-blur-sm" />
        {/* Soft orbs */}
        <div className="absolute left-10 top-16 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl animate-float" />
        <div className="absolute right-24 bottom-10 h-80 w-80 rounded-full bg-orange-500/20 blur-3xl animate-float-slow" />
        <div className="absolute right-1/4 top-1/4 h-56 w-56 rounded-full bg-violet-500/10 blur-3xl animate-float-medium" />
        {/* Light beam */}
        <div className="absolute -left-16 top-1/3 h-64 w-[140%] -rotate-6 bg-gradient-to-r from-indigo-400/0 via-indigo-400/10 to-orange-400/0 blur-xl" />
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAKElEQVQYV2NkwAT/Gf7//z8GJgYGBgYmQGQYGBiGkQwGQ2EYwA0kAAB8cQeQ6p2t5gAAAABJRU5ErkJggg==')]" />
      </div>

      {/* Top nav */}
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
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:opacity-95"
          >
            Issue
          </Link>
          <Link
            to="/verify"
            className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            Verify
          </Link>
        </div>
      </nav>

      {/* Hero micro-strip with trust badges */}
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

      {/* Content */}
      <main className="mx-auto w-full max-w-7xl px-6 pb-28">
        {/* Two-column grid: main form + right rail */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left: main form */}
          <section
            className="col-span-12 lg:col-span-7 group relative overflow-visible rounded-2xl p-[1px]"
            style={{
              background:
                "conic-gradient(from 180deg at 50% 50%, rgba(99,102,241,0.45), rgba(249,115,22,0.45), rgba(14,165,233,0.45), rgba(99,102,241,0.45))",
              mask:
                "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
              WebkitMask:
                "linear-gradient(#000,#000) content-box, linear-gradient(#000,#000)",
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
              {/* Interactive glow following cursor */}
              <div
                className="pointer-events-none absolute -inset-1 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  background: `radial-gradient(400px 200px at ${tilt.glowX} ${tilt.glowY}, rgba(99,102,241,0.10), transparent 70%)`,
                }}
              />

              <div className="relative z-10">
                <div className="flex items-center gap-3">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/10 shadow-inner shadow-black/20">
                    <svg className="h-6 w-6 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M5 3h14a2 2 0 012 2v14l-5-3-5 3-5-3-5 3V5a2 2 0 012-2z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold tracking-tight">Credential Issuance</h2>
                    <p className="text-sm text-slate-300">Generate a signed, tamper-evident credential</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5">
                  <div className="group/field">
                    <label htmlFor="name" className="mb-2 block text-sm font-medium text-slate-200">
                      Recipient Name
                    </label>
                    <div className="relative transition">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 22a10 10 0 0120 0v1H2v-1z" />
                        </svg>
                      </span>
                      <input
                        id="name"
                        type="text"
                        placeholder="Enter recipient's full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3.5 text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/40 focus:bg-white/10"
                      />
                    </div>
                    {!name.trim() && (
                      <div className="mt-2 text-xs text-slate-400">
                        Tip: Use the legal full name for verification.
                      </div>
                    )}
                  </div>

                  <div className="group/field">
                    <label htmlFor="credential" className="mb-2 block text-sm font-medium text-slate-200">
                      Credential Type
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M4 6h16v12H4zM6 8h12v2H6z" />
                        </svg>
                      </span>
                      <input
                        id="credential"
                        type="text"
                        placeholder="e.g., Certificate, License, Badge"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        className="w-full rounded-xl border border-white/10 bg-white/5 px-11 py-3.5 text-white placeholder:text-slate-400 outline-none transition focus:border-indigo-400/40 focus:bg-white/10"
                      />
                    </div>

                    {/* Quick suggestion chips */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {suggestions.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setCredential(s)}
                          className={`rounded-lg px-3 py-1.5 text-xs ring-1 transition ${
                            credential === s
                              ? "bg-indigo-500/30 text-white ring-indigo-400/40"
                              : "bg-white/5 text-slate-300 ring-white/10 hover:bg-white/10"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={handleIssue}
                      disabled={isLoading}
                      className="relative inline-flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-500 to-orange-600 px-6 py-3.5 font-semibold text-white shadow-lg shadow-indigo-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="spinner h-5 w-5" />
                          Processing...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2a1 1 0 011 1v8h8a1 1 0 110 2h-8v8a1 1 0 11-2 0v-8H3a1 1 0 110-2h8V3a1 1 0 011-1z" />
                          </svg>
                          Issue Credential
                        </span>
                      )}
                      {/* Subtle pulse */}
                      {!isLoading && (
                        <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/10 [mask-image:radial-gradient(80%_60%_at_50%_50%,#000_40%,transparent_60%)]" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Result status */}
                {isSuccess !== null && (
                  <div
                    className={`mt-6 flex items-start gap-3 rounded-xl border p-4 transition ${
                      isSuccess
                        ? "border-green-400/20 bg-green-400/10 text-green-200"
                        : "border-red-400/20 bg-red-400/10 text-red-200"
                    }`}
                  >
                    <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/20">
                      {isSuccess ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M9 12l2 2 6-6 2 2-8 8-4-4 2-2z" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      )}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {isSuccess ? "Credential issued successfully." : "There was a problem issuing the credential."}
                      </p>
                      {!!response && (
                        <div className="mt-3 flex items-center gap-2">
                          <button
                            onClick={handleCopy}
                            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 hover:bg-white/15"
                          >
                            Copy issued credential ID
                          </button>
                          <button
                            onClick={handleDownload}
                            className="rounded-md bg-white/10 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/10 hover:bg-white/15"
                          >
                            Download JSON
                          </button>
                          <Link
                            to="/verify"
                            className="ml-auto inline-flex items-center gap-1 rounded-md bg-white/10 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-white/15"
                          >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M9 12l2 2 6-6 2 2-8 8-4-4 2-2z" />
                            </svg>
                            Verify
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Response */}
                {response && (
                  <div className="mt-6">
                    <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                      <svg className="h-4 w-4 text-indigo-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M5 3h10l6 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
                      </svg>
                      Response Details
                    </h3>
                    <pre className="max-h-[40vh] overflow-auto rounded-xl border border-white/10 bg-black/50 p-4 text-sm text-slate-200">
{response}
                    </pre>
                  </div>
                )}
              </div>

              {/* Confetti burst on success */}
              {burst && (
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const left = Math.random() * 100;
                    const delay = Math.random() * 0.2;
                    const hue = Math.floor(200 + Math.random() * 140);
                    return (
                      <span
                        key={i}
                        className="confetti"
                        style={{
                          left: `${left}%`,
                          backgroundColor: `hsl(${hue} 90% 60%)`,
                          animationDelay: `${delay}s`,
                        }}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Right rail */}
          <aside className="col-span-12 lg:col-span-5 space-y-6">
            {/* Live Preview */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/10">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/20 ring-1 ring-white/10">
                    <svg className="h-4 w-4 text-indigo-300" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3h10l6 6v12a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z"/></svg>
                  </span>
                  <h3 className="text-sm font-semibold text-white">Preview</h3>
                </div>
                <span className="text-[10px] text-slate-400">Not yet issued</span>
              </div>
              <pre className="max-h-[260px] overflow-auto rounded-xl border border-white/10 bg-black/40 p-3 text-xs text-slate-200">
{preview}
              </pre>
            </div>

            {/* Templates */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm ring-1 ring-white/10">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white">Templates</h3>
                <span className="text-[10px] text-slate-400">Quick start</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {templates.map((t) => (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => setCredential(t.value)}
                    className={`group flex flex-col items-start rounded-xl border border-white/10 bg-gradient-to-br ${t.grad} p-[1px] text-left transition`}
                  >
                    <div className="h-full w-full rounded-[10px] bg-slate-950/80 p-3 ring-1 ring-white/10 backdrop-blur-sm">
                      <div className="mb-2 inline-flex items-center gap-2">
                        <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                          <svg className="h-4 w-4 text-white/80" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l7 4v6c0 5-3.5 9-7 10-3.5-1-7-5-7-10V6l7-4z"/></svg>
                        </span>
                        <span className="text-sm font-semibold">{t.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-300">{t.hint}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>


          </aside>
        </div>

        {/* How it works strip */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { t: "1. Define", d: "Enter recipient and choose a template." },
              { t: "2. Issue", d: "We sign the payload and return JSON." },
              { t: "3. Verify", d: "Share JSON; anyone can verify integrity." },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
                  <span className="text-xs font-bold text-white/90">{i + 1}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold">{s.t}</div>
                  <div className="text-xs text-slate-400">{s.d}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mt-6 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/10 backdrop-blur-sm">
            <h3 className="mb-3 text-sm font-semibold text-white">FAQ</h3>
            <div className="divide-y divide-white/10">
              {faqs.map((f, i) => {
                const open = activeFaq === i;
                return (
                  <div key={i} className="py-2">
                    <button
                      className="flex w-full items-center justify-between text-left"
                      onClick={() => setActiveFaq(open ? null : i)}
                    >
                      <span className="text-sm text-white/90">{f.q}</span>
                      <span className="ml-3 text-xs text-slate-400">{open ? "−" : "+"}</span>
                    </button>
                    {open && <p className="mt-2 text-xs text-slate-300">{f.a}</p>}
                  </div>
                );
              })}
            </div>
          </div>

        </section>

        {/* Small KPI cards */}

      </main>

      {/* Status indicators */}
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

      {/* Styles */}
      <style>{`
        /* Background animations */
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

        /* Confetti */
        .confetti {
          position: absolute;
          top: 0;
          width: 8px;
          height: 12px;
          border-radius: 2px;
          opacity: 0.9;
          transform: translateY(-10%) rotate(0deg);
          animation: confettiFall 1.1s ease-out forwards, confettiSpin 0.9s linear infinite;
        }
        @keyframes confettiFall {
          0% { transform: translateY(-10%) rotate(0deg); }
          100% { transform: translateY(110%) rotate(360deg); }
        }
        @keyframes confettiSpin {
          0% { transform: translateY(-10%) rotate(0deg); }
          100% { transform: translateY(-10%) rotate(360deg); }
        }
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

export default Issue;
