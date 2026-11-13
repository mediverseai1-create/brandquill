import Link from "next/link";
import { LayoutDashboard, PenLine, Library, BookOpenText, Users, Database, CreditCard, Settings } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getContext } from "@/lib/workspace";
import { signOut } from "./actions";

const items = [
  { href: "/app", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/studio", label: "Studio", icon: PenLine },
  { href: "/app/library", label: "Library", icon: Library },
  { href: "/app/brand-voices", label: "Brand voices", icon: BookOpenText },
  { href: "/app/audiences", label: "Audiences", icon: Users },
  { href: "/app/knowledge", label: "Knowledge", icon: Database },
  { href: "/app/billing", label: "Billing", icon: CreditCard },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getContext();
  return (
    <div className="min-h-screen md:flex">
      <aside className="border-b border-line bg-sky-soft md:min-h-screen md:w-60 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-4 md:block"><Logo href="/app" /><p className="hidden pt-1 text-xs text-mute md:block">{ctx.workspaceName}</p></div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0" aria-label="App">
          {items.map((i) => (
            <Link key={i.href} href={i.href} className="flex items-center gap-2 whitespace-nowrap px-3 py-2 text-sm hover:bg-white">
              <i.icon className="h-4 w-4" aria-hidden />{i.label}
            </Link>
          ))}
        </nav>
        <form action={signOut} className="hidden px-3 pt-6 md:block"><button className="w-full px-3 py-2 text-left text-sm text-mute hover:bg-white">Log out</button></form>
      </aside>
      <main className="flex-1 px-4 py-8 sm:px-8"><div className="mx-auto max-w-4xl">{children}</div>
        <form action={signOut} className="mt-10 md:hidden"><button className="btn-outline w-full">Log out</button></form>
      </main>
    </div>
  );
}
