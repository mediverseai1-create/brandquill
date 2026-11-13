"use client";
import { useState } from "react";
import Link from "next/link";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import type { BrandCheck } from "@/lib/brand-check";

type Opt = { id: string; name?: string; title?: string };
interface Result { id: string; title: string; content: string; brandCheck: BrandCheck }

export function StudioForm({ voices, audiences, knowledge }: { voices: Opt[]; audiences: Opt[]; knowledge: Opt[] }) {
  const [templateId, setTemplateId] = useState(TEMPLATES[0].id);
  const [voiceId, setVoiceId] = useState("");
  const [audienceId, setAudienceId] = useState("");
  const [kn, setKn] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<{ msg: string; upgrade: boolean } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [copied, setCopied] = useState(false);
  const template = getTemplate(templateId)!;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null); setResult(null); setBusy(true);
    const f = new FormData(e.currentTarget);
    const inputs: Record<string, string> = {};
    template.fields.forEach((fl) => (inputs[fl.name] = String(f.get(fl.name) ?? "")));
    try {
      const res = await fetch("/api/generate", { method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ template: templateId, inputs, voiceId: voiceId || null, audienceId: audienceId || null, knowledgeIds: kn }) });
      const data = await res.json();
      if (!res.ok) setError({ msg: data.error ?? "Something went wrong.", upgrade: res.status === 402 });
      else setResult(data);
    } catch { setError({ msg: "Network error. Check your connection and try again.", upgrade: false }); }
    finally { setBusy(false); }
  }

  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <form onSubmit={submit} className="space-y-4" key={templateId}>
        <div><label className="label" htmlFor="tpl">Template</label>
          <select id="tpl" className="input" value={templateId} onChange={(e) => setTemplateId(e.target.value)}>{TEMPLATES.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</select>
          <p className="mt-1 text-xs text-mute">{template.description}</p></div>
        {template.fields.map((f) => (
          <div key={f.name}><label className="label" htmlFor={f.name}>{f.label}{f.required && " *"}</label>
            {f.type === "textarea" ? <textarea id={f.name} name={f.name} rows={4} maxLength={4000} className="input" placeholder={f.placeholder} />
              : f.type === "select" ? <select id={f.name} name={f.name} className="input">{f.options!.map((o) => <option key={o}>{o}</option>)}</select>
              : <input id={f.name} name={f.name} className="input" required={f.required} maxLength={4000} placeholder={f.placeholder} />}</div>
        ))}
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label" htmlFor="voice">Brand voice</label>
            <select id="voice" className="input" value={voiceId} onChange={(e) => setVoiceId(e.target.value)}><option value="">None</option>{voices.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select>
            {!voices.length && <p className="mt-1 text-xs text-mute"><Link className="underline" href="/app/brand-voices">Create a voice</Link> for on-brand drafts.</p>}</div>
          <div><label className="label" htmlFor="aud">Audience</label>
            <select id="aud" className="input" value={audienceId} onChange={(e) => setAudienceId(e.target.value)}><option value="">None</option>{audiences.map((v) => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
        </div>
        {knowledge.length > 0 && <fieldset><legend className="label">Knowledge sources</legend>
          <div className="space-y-1">{knowledge.map((k) => <label key={k.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={kn.includes(k.id)} onChange={(e) => setKn(e.target.checked ? [...kn, k.id] : kn.filter((x) => x !== k.id))} />{k.title}</label>)}</div></fieldset>}
        <button className="btn-primary" disabled={busy}>{busy ? "Writing…" : "Generate draft"}</button>
      </form>

      <div aria-live="polite">
        {error && <div role="alert" className="border border-coral bg-coral/10 p-4 text-sm text-coral-dark">{error.msg} {error.upgrade && <Link href="/app/billing" className="underline">Go to Billing</Link>}</div>}
        {busy && <p className="border border-line p-6 text-sm text-mute">Drafting with your brand context…</p>}
        {!busy && !error && !result && <p className="border border-dashed border-line p-6 text-sm text-mute">Your draft will appear here, saved automatically to your library.</p>}
        {result && (
          <div className="space-y-4">
            <div className="border border-line p-4"><p className="text-xs uppercase text-mute">Brand check</p>
              <p className="font-display text-3xl">{result.brandCheck.score}<span className="text-base text-mute"> / 100</span></p>
              <ul className="mt-2 space-y-1 text-xs text-mute">
                <li>{result.brandCheck.words} words, {result.brandCheck.sentences} sentences, avg {result.brandCheck.avgSentenceLength} words per sentence{result.brandCheck.sampleAvgSentenceLength ? ` (sample: ${result.brandCheck.sampleAvgSentenceLength})` : ""}</li>
                <li>{result.brandCheck.bannedHits.length ? `Avoided words found: ${result.brandCheck.bannedHits.map((h) => `${h.word} ×${h.count}`).join(", ")}` : "No avoided words found"}</li></ul></div>
            <article className="border border-line p-4"><h2 className="text-xl font-semibold">{result.title}</h2>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed">{result.content}</pre></article>
            <div className="flex gap-2">
              <button className="btn-outline" onClick={async () => { await navigator.clipboard.writeText(result.content); setCopied(true); setTimeout(() => setCopied(false), 1500); }}>{copied ? "Copied" : "Copy"}</button>
              <Link href={`/app/library/${result.id}`} className="btn-outline">Open in library</Link></div>
          </div>
        )}
      </div>
    </div>
  );
}
