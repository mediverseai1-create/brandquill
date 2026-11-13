// Deterministic brand-voice checks. These are computed, not AI-generated.
export interface BrandCheck {
  words: number;
  sentences: number;
  avgSentenceLength: number;
  sampleAvgSentenceLength: number | null;
  bannedHits: { word: string; count: number }[];
  score: number; // 0-100
}

const sentencesOf = (t: string) => t.split(/(?<=[.!?])\s+|\n+/).map((s) => s.trim()).filter((s) => /\w/.test(s));
const wordsOf = (t: string) => t.match(/[\p{L}\p{N}'’-]+/gu) ?? [];

export function brandCheck(text: string, avoidWords: string[], sampleText = ""): BrandCheck {
  const words = wordsOf(text);
  const sentences = sentencesOf(text);
  const avg = sentences.length ? words.length / sentences.length : 0;
  const sampleSentences = sentencesOf(sampleText);
  const sampleAvg = sampleSentences.length ? wordsOf(sampleText).length / sampleSentences.length : null;
  const lower = text.toLowerCase();
  const bannedHits = avoidWords
    .map((w) => w.trim().toLowerCase())
    .filter(Boolean)
    .map((word) => {
      const re = new RegExp(`(?<![\\p{L}\\p{N}])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\p{L}\\p{N}])`, "gu");
      return { word, count: (lower.match(re) ?? []).length };
    })
    .filter((h) => h.count > 0);

  let score = 100;
  score -= Math.min(60, bannedHits.reduce((n, h) => n + h.count, 0) * 15);
  if (sampleAvg) {
    const drift = Math.abs(avg - sampleAvg) / sampleAvg;
    score -= Math.min(30, Math.round(drift * 40));
  }
  return {
    words: words.length,
    sentences: sentences.length,
    avgSentenceLength: Math.round(avg * 10) / 10,
    sampleAvgSentenceLength: sampleAvg ? Math.round(sampleAvg * 10) / 10 : null,
    bannedHits,
    score: Math.max(0, score),
  };
}
