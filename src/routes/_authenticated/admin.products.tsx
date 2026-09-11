import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { ProductEditor, emptyProduct, type ProductDraft } from "@/components/admin/ProductEditor";
import { adminDeleteProduct, adminListProducts, adminSaveProduct } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/products")({
  component: AdminProducts,
});

function toDraft(row: any): ProductDraft {
  return {
    id: row.id,
    slug: row.slug ?? "",
    title: row.title ?? "",
    tagline: row.tagline ?? "",
    description: row.description ?? "",
    type: row.type ?? "template",
    status: row.status ?? "draft",
    featured: Boolean(row.featured),
    price_cents: row.price_cents ?? 0,
    currency: row.currency ?? "USD",
    cover_image_url: row.cover_image_url ?? "",
    gallery: Array.isArray(row.gallery) ? row.gallery : [],
    features: Array.isArray(row.features) ? row.features : [],
    tech_stack: Array.isArray(row.tech_stack) ? row.tech_stack : [],
    demo_url: row.demo_url ?? "",
    version: row.version ?? "",
    file_path: row.file_path ?? "",
    external_download_url: row.external_download_url ?? "",
    paddle_price_id: row.paddle_price_id ?? "",
    sort_order: row.sort_order ?? 0,
    license_enabled: Boolean(row.license_enabled),
    license_period: row.license_period ?? "lifetime",
    license_activation_limit: row.license_activation_limit ?? 1,
  };
}

function AdminProducts() {
  const qc = useQueryClient();
  const list = useServerFn(adminListProducts);
  const save = useServerFn(adminSaveProduct);
  const remove = useServerFn(adminDeleteProduct);
  const [draft, setDraft] = useState<ProductDraft | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["admin-products"], queryFn: () => list() });

  const saveMutation = useMutation({
    mutationFn: (payload: ProductDraft) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Product saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Product deleted");
      qc.invalidateQueries({ queryKey: ["admin-products"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not delete"),
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Products</h1>
          <p className="mt-1 text-sm text-ink/60">
            Themes, templates, scripts, plugins and services. Published items appear on the storefront.
          </p>
        </div>
        <button
          onClick={() => setDraft({ ...emptyProduct })}
          className="rounded-full bg-carbon px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-volt"
        >
          New product
        </button>
      </div>

      {draft && (
        <div className="mt-6">
          <ProductEditor
            draft={draft}
            setDraft={setDraft}
            saving={saveMutation.isPending}
            onCancel={() => setDraft(null)}
            onSave={() => saveMutation.mutate(draft)}
          />
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-steel bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-steel font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">File</th>
              <th className="px-4 py-3">Licence</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={7}>
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && (data ?? []).length === 0 && (
              <tr>
                <td className="px-4 py-6 text-ink/50" colSpan={7}>
                  No products yet — create your first one.
                </td>
              </tr>
            )}
            {(data ?? []).map((row: any) => (
              <tr key={row.id} className="border-b border-steel/60 last:border-0">
                <td className="px-4 py-3 font-semibold text-carbon">{row.title}</td>
                <td className="px-4 py-3 text-ink/60">{row.type}</td>
                <td className="px-4 py-3 text-ink/60">
                  {row.currency} {(row.price_cents / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase ${
                      row.status === "published" ? "bg-volt text-carbon" : "bg-steel text-ink/60"
                    }`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink/50">
                  {row.file_path ? "uploaded" : row.external_download_url ? "external" : "—"}
                </td>
                <td className="px-4 py-3 font-mono text-[10px] uppercase text-ink/50">
                  {row.license_enabled ? row.license_period : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setDraft(toDraft(row))}
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${row.title}"?`)) deleteMutation.mutate(row.id);
                    }}
                    className="ml-4 font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
