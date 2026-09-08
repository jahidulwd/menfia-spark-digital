import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { adminGetBranding, adminSaveBranding } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/admin/branding")({
  component: AdminBranding,
});

type Branding = {
  site_name: string;
  header_logo_url: string;
  footer_logo_url: string;
  logo_height: number;
  favicon_url: string;
};

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function AdminBranding() {
  const qc = useQueryClient();
  const get = useServerFn(adminGetBranding);
  const save = useServerFn(adminSaveBranding);
  const { data } = useQuery({ queryKey: ["admin-branding"], queryFn: () => get() });
  const [form, setForm] = useState<Branding | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm(data as Branding);
  }, [data]);

  const mutation = useMutation({
    mutationFn: (payload: Branding) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Logo settings saved");
      qc.invalidateQueries({ queryKey: ["branding"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  async function upload(field: keyof Branding, file: File) {
    setUploading(field as string);
    try {
      const path = `branding/${field}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data: pub } = supabase.storage.from("product-images").getPublicUrl(path);
      setForm((prev) => (prev ? { ...prev, [field]: pub.publicUrl } : prev));
      toast.success("Uploaded — remember to save");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  if (!form) return <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink/50">Loading…</p>;

  const set = (patch: Partial<Branding>) => setForm({ ...form, ...patch });

  const slots: { field: keyof Branding; title: string; hint: string }[] = [
    { field: "header_logo_url", title: "Header logo", hint: "Shown in the top navigation. PNG or SVG with transparent background works best." },
    { field: "footer_logo_url", title: "Footer logo", hint: "Shown in the footer on the dark background — use a light version." },
    { field: "favicon_url", title: "Browser icon", hint: "Small square image shown on the browser tab." },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Logo &amp; branding</h1>
      <p className="mt-1 text-sm text-ink/60">
        Upload the logo for the header, the footer and the browser tab. If a logo is empty, the site name is shown as
        text instead.
      </p>

      <section className="mt-8 rounded-xl border border-steel bg-white/70 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className={label}>Site name</span>
            <input className={input} value={form.site_name} onChange={(e) => set({ site_name: e.target.value })} />
          </label>
          <label className="block">
            <span className={label}>Logo height (px)</span>
            <input
              type="number"
              className={input}
              value={form.logo_height}
              onChange={(e) => set({ logo_height: Number(e.target.value) || 32 })}
            />
          </label>
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {slots.map((slot) => (
          <div key={slot.field} className="rounded-xl border border-steel bg-white/70 p-5">
            <p className={label}>{slot.title}</p>
            <p className="mt-2 text-xs text-ink/50">{slot.hint}</p>
            <input
              type="file"
              accept="image/*"
              className="mt-4 block w-full text-xs"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void upload(slot.field, file);
              }}
            />
            {uploading === slot.field && <p className="mt-2 text-xs text-ink/50">Uploading…</p>}
            {form[slot.field] ? (
              <div className="mt-4 rounded-lg bg-carbon p-4">
                <img src={form[slot.field] as string} alt={slot.title} className="max-h-14 w-auto" />
              </div>
            ) : (
              <p className="mt-4 text-xs text-ink/40">No image yet</p>
            )}
            <input
              className={input}
              placeholder="Or paste an image URL"
              value={form[slot.field] as string}
              onChange={(e) => set({ [slot.field]: e.target.value } as Partial<Branding>)}
            />
            {form[slot.field] && (
              <button
                onClick={() => set({ [slot.field]: "" } as Partial<Branding>)}
                className="mt-3 font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80"
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => mutation.mutate(form)}
        disabled={mutation.isPending}
        className="mt-8 rounded-full bg-volt px-7 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
      >
        {mutation.isPending ? "Saving…" : "Save branding"}
      </button>
    </div>
  );
}
