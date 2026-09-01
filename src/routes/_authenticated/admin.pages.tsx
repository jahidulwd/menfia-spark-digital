import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { adminDeletePage, adminListPages, adminSavePage } from "@/lib/admin.functions";

export const Route = createFileRoute("/_authenticated/admin/pages")({
  component: AdminPages,
});

type PageDraft = {
  id?: string;
  slug: string;
  title: string;
  seo_description: string;
  content: string;
  published: boolean;
  show_in_footer: boolean;
  sort_order: number;
};

const emptyPage: PageDraft = {
  slug: "",
  title: "",
  seo_description: "",
  content: "",
  published: true,
  show_in_footer: true,
  sort_order: 0,
};

const input =
  "mt-2 w-full rounded-lg border border-steel bg-white px-3 py-2.5 text-sm text-carbon focus:border-volt-dim focus:outline-none";
const label = "font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50";

function AdminPages() {
  const qc = useQueryClient();
  const list = useServerFn(adminListPages);
  const save = useServerFn(adminSavePage);
  const remove = useServerFn(adminDeletePage);
  const [draft, setDraft] = useState<PageDraft | null>(null);

  const { data, isLoading } = useQuery({ queryKey: ["admin-pages"], queryFn: () => list() });

  const saveMutation = useMutation({
    mutationFn: (payload: PageDraft) => save({ data: payload }),
    onSuccess: () => {
      toast.success("Page saved");
      setDraft(null);
      qc.invalidateQueries({ queryKey: ["admin-pages"] });
    },
    onError: (err: unknown) => toast.error(err instanceof Error ? err.message : "Could not save"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Page deleted");
      qc.invalidateQueries({ queryKey: ["admin-pages"] });
    },
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-carbon">Pages</h1>
          <p className="mt-1 text-sm text-ink/60">
            Terms, privacy, refund policy and any other page. Content supports plain text and simple HTML.
          </p>
        </div>
        <button
          onClick={() => setDraft({ ...emptyPage })}
          className="rounded-full bg-carbon px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-volt"
        >
          New page
        </button>
      </div>

      {draft && (
        <div className="mt-6 rounded-xl border border-steel bg-white/70 p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className={label}>Title</span>
              <input
                className={input}
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setDraft({
                    ...draft,
                    title,
                    slug: draft.id
                      ? draft.slug
                      : title
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, "-")
                          .replace(/(^-|-$)/g, ""),
                  });
                }}
              />
            </label>
            <label className="block">
              <span className={label}>Slug</span>
              <input className={input} value={draft.slug} onChange={(e) => setDraft({ ...draft, slug: e.target.value })} />
            </label>
          </div>
          <label className="mt-4 block">
            <span className={label}>SEO description</span>
            <input
              className={input}
              maxLength={300}
              value={draft.seo_description}
              onChange={(e) => setDraft({ ...draft, seo_description: e.target.value })}
            />
          </label>
          <label className="mt-4 block">
            <span className={label}>Content</span>
            <textarea
              rows={16}
              className={`${input} font-mono text-xs`}
              value={draft.content}
              onChange={(e) => setDraft({ ...draft, content: e.target.value })}
            />
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-6 text-sm text-ink/70">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
              />
              Published
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={draft.show_in_footer}
                onChange={(e) => setDraft({ ...draft, show_in_footer: e.target.checked })}
              />
              Show in footer
            </label>
            <label className="flex items-center gap-2">
              Sort
              <input
                type="number"
                className="w-20 rounded border border-steel px-2 py-1"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) || 0 })}
              />
            </label>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              onClick={() => saveMutation.mutate(draft)}
              disabled={saveMutation.isPending}
              className="rounded-full bg-volt px-6 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-carbon disabled:opacity-60"
            >
              {saveMutation.isPending ? "Saving…" : "Save page"}
            </button>
            <button
              onClick={() => setDraft(null)}
              className="rounded-full border border-steel px-6 py-3 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/60"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-8 overflow-x-auto rounded-xl border border-steel bg-white/70">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-steel font-mono text-[10px] uppercase tracking-[0.15em] text-ink/50">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Footer</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-ink/50">
                  Loading…
                </td>
              </tr>
            )}
            {(data ?? []).map((row: any) => (
              <tr key={row.id} className="border-b border-steel/60 last:border-0">
                <td className="px-4 py-3 font-semibold text-carbon">{row.title}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink/60">/p/{row.slug}</td>
                <td className="px-4 py-3 text-ink/60">{row.show_in_footer ? "yes" : "no"}</td>
                <td className="px-4 py-3 text-ink/60">{row.published ? "yes" : "no"}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() =>
                      setDraft({
                        id: row.id,
                        slug: row.slug ?? "",
                        title: row.title ?? "",
                        seo_description: row.seo_description ?? "",
                        content: row.content ?? "",
                        published: Boolean(row.published),
                        show_in_footer: Boolean(row.show_in_footer),
                        sort_order: row.sort_order ?? 0,
                      })
                    }
                    className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink/60 hover:text-carbon"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${row.title}"?`)) deleteMutation.mutate(row.id);
                    }}
                    className="ml-4 font-mono text-[10px] uppercase tracking-[0.12em] text-red-500/80"
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
