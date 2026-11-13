import { Suspense } from "react";
import { Logo } from "@/components/Logo";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-sky-soft">
      <div className="px-6 py-5"><Logo /></div>
      <main className="flex flex-1 items-start justify-center px-4 pb-16 pt-6">
        <div className="w-full max-w-md border border-line bg-white p-8"><Suspense>{children}</Suspense></div>
      </main>
    </div>
  );
}
