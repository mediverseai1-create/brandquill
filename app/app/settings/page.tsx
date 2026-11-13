import { getContext } from "@/lib/workspace";
import { updateProfile } from "../actions";

export const metadata = { title: "Settings" };

export default async function Settings({ searchParams }: { searchParams: { saved?: string; error?: string } }) {
  const { supabase, user, workspaceName } = await getContext();
  const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
  return (
    <div>
      <h1 className="text-3xl font-semibold">Settings</h1>
      {searchParams.saved && <p role="status" className="mt-4 border border-line bg-sky-soft p-3 text-sm">Saved.</p>}
      {searchParams.error && <p role="alert" className="mt-4 border border-coral bg-coral/10 p-3 text-sm text-coral-dark">Please check the fields and try again.</p>}
      <form action={updateProfile} className="card mt-6 max-w-md space-y-4">
        <div><label className="label" htmlFor="email">Email</label><input id="email" className="input bg-paper" value={user.email ?? ""} disabled readOnly /></div>
        <div><label className="label" htmlFor="full_name">Full name</label><input id="full_name" name="full_name" className="input" required maxLength={80} defaultValue={profile?.full_name ?? ""} /></div>
        <div><label className="label" htmlFor="workspace">Workspace name</label><input id="workspace" name="workspace" className="input" required maxLength={80} defaultValue={workspaceName} /></div>
        <button className="btn-primary">Save changes</button>
      </form>
    </div>
  );
}
