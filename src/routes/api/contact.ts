import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const ADMIN_EMAIL = "jahidulwd@gmail.com";
// Replace with a domain verified in Resend to reach customers reliably.
const FROM = "Menfia Digital <onboarding@resend.dev>";

const schema = z.object({
  email: z.string().trim().email().max(255),
  projectType: z.string().trim().min(1).max(80),
  message: z.string().trim().min(10).max(2000),
});

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

async function sendEmail(apiKey: string, payload: Record<string, unknown>) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ from: FROM, ...payload }),
  });
  if (!res.ok) {
    const body = await res.text();
    console.error(`Resend request failed [${res.status}]: ${body}`);
    throw new Error(`Resend request failed [${res.status}]: ${body}`);
  }
  return res.json();
}

export const Route = createFileRoute("/api/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["RESEND_API_KEY"];
        if (!apiKey) {
          return Response.json(
            { error: "Email sending is not configured yet." },
            { status: 503 },
          );
        }

        let parsed;
        try {
          parsed = schema.parse(await request.json());
        } catch {
          return Response.json({ error: "Please check the form fields." }, { status: 400 });
        }

        const email = escapeHtml(parsed.email);
        const projectType = escapeHtml(parsed.projectType);
        const message = escapeHtml(parsed.message).replace(/\n/g, "<br />");

        try {
          await sendEmail(apiKey, {
            to: [ADMIN_EMAIL],
            reply_to: parsed.email,
            subject: `New brief — ${parsed.projectType}`,
            html: `<h2 style="font-family:Arial,sans-serif">New project brief</h2>
<p style="font-family:Arial,sans-serif"><strong>Email:</strong> ${email}<br/>
<strong>Project type:</strong> ${projectType}</p>
<p style="font-family:Arial,sans-serif;white-space:pre-wrap">${message}</p>`,
          });

          await sendEmail(apiKey, {
            to: [parsed.email],
            subject: "Thanks — we got your brief",
            html: `<div style="font-family:Arial,sans-serif;max-width:560px">
<h2>Thanks for reaching out</h2>
<p>We received your brief and a real person at Menfia Digital will reply within one business day.</p>
<p><strong>Project type:</strong> ${projectType}</p>
<p style="white-space:pre-wrap;color:#555">${message}</p>
<p>— Menfia Digital</p></div>`,
          });
        } catch {
          return Response.json({ error: "Could not send your message." }, { status: 502 });
        }

        return Response.json({ ok: true });
      },
    },
  },
});
