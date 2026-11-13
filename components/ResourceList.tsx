import { deleteRow } from "@/app/app/actions";

export function LimitNotice({ error }: { error?: string }) {
  if (!error) return null;
  return <p role="alert" className="mb-4 border border-coral bg-coral/10 p-3 text-sm text-coral-dark">
    {error === "limit" ? "You've reached your plan's limit for this item. Upgrade on the Billing page to add more." : "Please check the form and try again."}</p>;
}

export function DeleteForm({ table, id }: { table: string; id: string }) {
  return <form action={deleteRow}><input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><button className="text-xs text-mute underline hover:text-coral" aria-label="Delete">Delete</button></form>;
}
