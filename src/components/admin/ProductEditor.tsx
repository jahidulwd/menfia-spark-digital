import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";

export type ProductDraft = {
  id?: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  type: "theme" | "template" | "script" | "plugin" | "service" | "other";
  status: "draft" | "published";
  featured: boolean;
  price_cents: number;
  currency: string;
  cover_image_url: string;
  gallery: string[];
  features: string[];
  tech_stack: string[];
  demo_url: string;
  version: string;
  file_path: string;
  external_download_url: string;
  paddle_price_id: string;
  sort_order: number;
  license_enabled: boolean;
  license_period: "lifetime" | "monthly" | "yearly";
  license_activation_limit: number;
};

export const emptyProduct: ProductDraft = {
  slug: "",
  title: "",
  tagline: "",
  description: "",
  type: "template",
  status: "draft",
  featured: false,
  price_cents: 4900,
  currency: "USD",
  cover_image_url: "",
  gallery: [],
  features: [],
  tech_stack: [],
  demo_url: "",
  version: "1.0.0",
  file_path: "",
  external_download_url: "",
  paddle_price_id: "",
  sort_order: 0,
  license_enabled: false,
  license_period: "lifetime",
  license_activation_limit: 1,
};

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function Field({ children }: { children: React.ReactNode }) {
  return <label className="block">{children}</label>;
}

export function ProductEditor({
  draft,
  setDraft,
  onSave,
  onCancel,
  saving,
}: {
  draft: ProductDraft;
  setDraft: (next: ProductDraft) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [uploading, setUploading] = useState<"image" | "file" | null>(null);

  function set<K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) {
    setDraft({ ...draft, [key]: value });
  }

  async function uploadImage(file: File) {
    setUploading("image");
    try {
      const path = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error } = await supabase.storage.from("product-images").upload(path, file, { upsert: true });
      if (error) throw error;
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      set("cover_image_url", data.publicUrl);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  async function uploadFile(file: File) {
    setUploading("file");
    try {
      const path = `${draft.slug || "product"}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`;
      const { error } = await supabase.storage.from("product-files").upload(path, file, { upsert: true });
      if (error) throw error;
      set("file_path", path);
      toast.success("Product file uploaded (private)");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  }

  return (
    <div className="rounded-xl border border-steel bg-white/70 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field>
          <span className={label}>Title</span>
          <input
            className={input}
            value={draft.title}
            onChange={(e) => {
              const title = e.target.value;
              const autoSlug = !draft.id
                ? title
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, "")
                : draft.slug;
              setDraft({ ...draft, title, slug: autoSlug });
            }}
          />
        </Field>
        <Field>
          <span className={label}>Slug</span>
          <input className={input} value={draft.slug} onChange={(e) => set("slug", e.target.value)} />
        </Field>
        <Field>
          <span className={label}>Type</span>
          <select className={input} value={draft.type} onChange={(e) => set("type", e.target.value as ProductDraft["type"])}>
            {["theme", "template", "script", "plugin", "service", "other"].map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field>
          <span className={label}>Status</span>
          <select
            className={input}
            value={draft.status}
            onChange={(e) => set("status", e.target.value as ProductDraft["status"])}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </Field>
        <Field>
          <span className={label}>Price (in cents)</span>
          <input
            type="number"
            className={input}
            value={draft.price_cents}
            onChange={(e) => set("price_cents", Number(e.target.value) || 0)}
          />
        </Field>
        <Field>
          <span className={label}>Currency</span>
          <input className={input} value={draft.currency} onChange={(e) => set("currency", e.target.value)} />
        </Field>
        <Field>
          <span className={label}>Paddle price ID</span>
          <input
            className={input}
            placeholder="pri_..."
            value={draft.paddle_price_id}
            onChange={(e) => set("paddle_price_id", e.target.value)}
          />
        </Field>
        <Field>
          <span className={label}>Version</span>
          <input className={input} value={draft.version} onChange={(e) => set("version", e.target.value)} />
        </Field>
        <Field>
          <span className={label}>Demo URL</span>
          <input className={input} value={draft.demo_url} onChange={(e) => set("demo_url", e.target.value)} />
        </Field>
        <Field>
          <span className={label}>Sort order</span>
          <input
            type="number"
            className={input}
            value={draft.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
          />
        </Field>
      </div>

      <Field>
        <span className={`${label} mt-4 block`}>Tagline</span>
        <input className={input} value={draft.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </Field>

      <Field>
        <span className={`${label} mt-4 block`}>Description</span>
        <textarea
          rows={6}
          className={input}
          value={draft.description}
          onChange={(e) => set("description", e.target.value)}
        />
      </Field>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Field>
          <span className={label}>Features (one per line)</span>
          <textarea
            rows={4}
            className={input}
            value={draft.features.join("\n")}
            onChange={(e) => set("features", e.target.value.split("\n").filter(Boolean))}
          />
        </Field>
        <Field>
          <span className={label}>Tech stack (comma separated)</span>
          <textarea
            rows={4}
            className={input}
            value={draft.tech_stack.join(", ")}
            onChange={(e) =>
              set(
                "tech_stack",
                e.target.value
                  .split(",")
                  .map((v) => v.trim())
                  .filter(Boolean),
              )
            }
          />
        </Field>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-dashed border-steel p-4">
          <p className={label}>Cover image</p>
          <input
            type="file"
            accept="image/*"
            className="mt-3 block w-full text-xs"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadImage(file);
            }}
          />
          {uploading === "image" && <p className="mt-2 text-xs text-ink/50">Uploading…</p>}
          {draft.cover_image_url && (
            <img
              src={draft.cover_image_url}
              alt="Cover preview"
              className="mt-3 aspect-[4/3] w-full rounded object-cover"
            />
          )}
        </div>
        <div className="rounded-lg border border-dashed border-steel p-4">
          <p className={label}>Downloadable product file (private)</p>
          <input
            type="file"
            className="mt-3 block w-full text-xs"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void uploadFile(file);
            }}
          />
          {uploading === "file" && <p className="mt-2 text-xs text-ink/50">Uploading…</p>}
          {draft.file_path && <p className="mt-2 break-all text-xs text-ink/60">{draft.file_path}</p>}
          <Field>
            <span className={`${label} mt-4 block`}>Or external download URL</span>
            <input
              className={input}
              value={draft.external_download_url}
              onChange={(e) => set("external_download_url", e.target.value)}
            />
          </Field>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-steel p-4">
        <p className={label}>Licensing</p>
        <label className="mt-3 flex items-center gap-2 text-sm text-ink/70">
          <input
            type="checkbox"
            checked={draft.license_enabled}
            onChange={(e) => set("license_enabled", e.target.checked)}
          />
          This is a licensed product — buyers get a key automatically
        </label>
        {draft.license_enabled && (
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field>
              <span className={label}>Licence type</span>
              <select
                className={input}
                value={draft.license_period}
                onChange={(e) => set("license_period", e.target.value as ProductDraft["license_period"])}
              >
                <option value="lifetime">lifetime</option>
                <option value="monthly">monthly</option>
                <option value="yearly">yearly</option>
              </select>
            </Field>
            <Field>
              <span className={label}>Domains allowed per key</span>
              <input
                type="number"
                min={1}
                className={input}
                value={draft.license_activation_limit}
                onChange={(e) => set("license_activation_limit", Math.max(1, Number(e.target.value) || 1))}
              />
            </Field>
          </div>
        )}
      </div>

      <label className="mt-6 flex items-center gap-2 text-sm text-ink/70">
        <input type="checkbox" checked={draft.featured} onChange={(e) => set("featured", e.target.checked)} />
        Feature this product on the storefront
      </label>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save product"}
        </button>
        <button
          onClick={onCancel}
          className="rounded-full border border-steel px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
