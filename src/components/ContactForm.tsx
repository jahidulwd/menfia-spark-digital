import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().trim().email({ message: "Enter a valid email address" }).max(255),
  projectType: z.string().trim().min(1).max(80),
  message: z
    .string()
    .trim()
    .min(10, { message: "Tell us at least a sentence about the project" })
    .max(2000, { message: "Please keep it under 2000 characters" }),
});

const inputClass =
  "mt-2 w-full rounded-lg border border-white/10 bg-carbon px-4 py-3 text-sm text-volt placeholder:text-white/30 focus:border-volt focus:outline-none";
const labelClass = "font-mono text-[10px] uppercase tracking-[0.15em] text-white/40";

export function ContactForm() {
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState("Web development");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse({ email, projectType, message });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setSending(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(body.error ?? "Something went wrong");
      toast.success("Brief sent — check your inbox for a confirmation.");
      setEmail("");
      setMessage("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send your message");
    } finally {
      setSending(false);
    }
  }

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className={labelClass}>Your email</span>
        <input
          type="email"
          required
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className={inputClass}
        />
      </label>
      <label className="block">
        <span className={labelClass}>Project type</span>
        <select
          value={projectType}
          onChange={(e) => setProjectType(e.target.value)}
          className="mt-2 w-full rounded-lg border border-white/10 bg-carbon px-4 py-3 text-sm text-white focus:border-volt focus:outline-none"
        >
          <option>Web development</option>
          <option>Template / design system</option>
          <option>Plugin or script</option>
          <option>Digital marketing</option>
        </select>
      </label>
      <label className="block">
        <span className={labelClass}>Message</span>
        <textarea
          required
          rows={4}
          maxLength={2000}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What are you building, and by when?"
          className={`${inputClass} resize-y`}
        />
      </label>
      <button
        type="submit"
        disabled={sending}
        className="mt-2 w-full rounded-lg bg-volt px-6 py-3.5 font-mono text-[12px] font-semibold uppercase tracking-[0.15em] text-carbon transition hover:brightness-95 disabled:opacity-60"
      >
        {sending ? "Sending…" : "Send brief"}
      </button>
    </form>
  );
}
