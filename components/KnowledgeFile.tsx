"use client";
import { useRef, useState } from "react";

/** Textarea plus optional .txt/.md file loader (read in the browser, saved as text). */
export function KnowledgeFile() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [err, setErr] = useState("");
  async function load(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100_000 || !/\.(txt|md)$/i.test(file.name)) return setErr("Use a .txt or .md file under 100 KB.");
    setErr("");
    if (ref.current) ref.current.value = (await file.text()).slice(0, 20000);
  }
  return (
    <div>
      <label className="label" htmlFor="content">Content</label>
      <textarea ref={ref} id="content" name="content" rows={8} required maxLength={20000} className="input" placeholder="Paste text, or load a .txt / .md file below." />
      <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={load} className="mt-2 text-xs" aria-label="Load a text file" />
      {err && <p role="alert" className="mt-1 text-xs text-coral-dark">{err}</p>}
    </div>
  );
}
