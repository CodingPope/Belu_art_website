"use client";

import { useState } from "react";
import { StarIcon } from "./Icons";
import { OptionCards } from "./OptionCards";

const inquiryTypes = [
  { value: "general", label: "Just saying hi", note: "Questions, kind words" },
  { value: "commission", label: "Commission", note: "A custom piece" },
  { value: "original", label: "Original", note: "Buy a painting" },
  { value: "wholesale", label: "Wholesale", note: "Stockists & shops" },
  { value: "event", label: "Event", note: "Markets & collabs" },
];

const emptyForm = {
  name: "",
  email: "",
  type: "general",
  message: "",
  newsletter: false,
};

type ContactFormProps = {
  consentText: string;
};

export function ContactForm({ consentText }: ContactFormProps) {
  const [form, setForm] = useState(emptyForm);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        setStatus("success");
        setForm(emptyForm);
        const toast =
          data.subscribed === "created"
            ? "Message sent, and you're on the list!"
            : "Message sent! I'll be in touch.";
        window.dispatchEvent(new CustomEvent("bm-toast", { detail: toast }));
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <form className="cform" onSubmit={handleSubmit}>
      <OptionCards
        name="type"
        legend="What's this about?"
        options={inquiryTypes}
        value={form.type}
        onChange={(type) => setForm({ ...form, type })}
        compact
      />

      <div className="cform-row">
        <label className="cfield">
          <span className="kicker">Name</span>
          <input
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label className="cfield">
          <span className="kicker">Email</span>
          <input
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
      </div>
      <label className="cfield">
        <span className="kicker">Message</span>
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
          rows={4}
        />
      </label>

      <label className="optin">
        <input
          type="checkbox"
          checked={form.newsletter}
          onChange={(e) => setForm({ ...form, newsletter: e.target.checked })}
        />
        <span>
          {consentText} <em>(Optional)</em>
        </span>
      </label>

      <button className="btn" type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Sending..." : "Send message"}{" "}
        <StarIcon className="star" />
      </button>
      <p className="cform-status" role="status">
        {status === "success" && (
          <span className="ok">
            Message sent! I&apos;ll get back to you soon.
          </span>
        )}
        {status === "error" && (
          <span className="err">
            Something went wrong sending that. Please try again in a moment.
          </span>
        )}
      </p>
    </form>
  );
}
