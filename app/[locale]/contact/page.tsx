"use client";
import React, { useState } from "react";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      message: formData.get("message") as string,
    };
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus("Message sent!");
      form.reset();
    } else {
      setStatus("Failed to send. Please try again.");
      console.log("res 123", res)
    }
  }

  return (
    <main className="max-w-lg mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-card p-6 rounded-lg border">
        <label className="flex flex-col gap-1">
          Name
          <input name="name" type="text" required className="rounded px-2 py-1 bg-footer-input text-footer-light border border-footer-border" />
        </label>
        <label className="flex flex-col gap-1">
          Email
          <input name="email" type="email" required className="rounded px-2 py-1 bg-footer-input text-footer-light border border-footer-border" />
        </label>
        <label className="flex flex-col gap-1">
          Message
          <textarea name="message" rows={5} required className="rounded px-2 py-1 bg-footer-input text-footer-light border border-footer-border" />
        </label>
        <button type="submit" className="bg-footer-accent text-white px-4 py-2 rounded hover:bg-footer-accent-dark">Send</button>
        {status && <p className="text-sm mt-2">{status}</p>}
      </form>
    </main>
  );
}
