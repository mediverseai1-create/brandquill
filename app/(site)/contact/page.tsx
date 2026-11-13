import type { Metadata } from "next";
export const metadata: Metadata = { title: "Contact" };

export default function Contact() {
  const email = process.env.NEXT_PUBLIC_SALES_EMAIL;
  return (
    <section className="mx-auto max-w-2xl px-4 py-20">
      <h1 className="text-4xl font-semibold">Talk to us</h1>
      <p className="mt-4 text-lg text-ink/85">Questions about Business plans, security or onboarding? Send us a note and we'll reply within one business day.</p>
      {email ? (
        <a className="btn-primary mt-8" href={`mailto:${email}`}>Email {email}</a>
      ) : (
        <p className="mt-8 border border-line bg-paper p-4 text-sm text-mute">Contact email not configured yet. Set NEXT_PUBLIC_SALES_EMAIL to show it here.</p>
      )}
    </section>
  );
}
