"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";

export function ContactForm() {
  const [status, setStatus] = useState<string | null>(null);
  const t = useTranslations("Contact");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      setStatus("sent");
      form.reset();
    } else {
      setStatus("error");
    }
  }

  return (
    <section className="w-full px-6 sm:px-8 lg:px-10 py-16 flex flex-col items-center">
      <h2 className="text-4xl font-serif italic text-center text-white mb-4">{t("title")}</h2>
      <p className="text-footer-light text-center mb-10 max-w-lg">{t("subtitle")}</p>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="contact-name" className="uppercase text-xs tracking-widest text-footer-light mb-1">
              {t("form.name")}
            </label>
            <input
              name="name"
              id="contact-name"
              type="text"
              required
              placeholder={t("form.namePlaceholder")}
              className="rounded-none px-4 py-3 bg-[#111] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base"
            />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="contact-email" className="uppercase text-xs tracking-widest text-footer-light mb-1">
              {t("form.email")}
            </label>
            <input
              name="email"
              id="contact-email"
              type="email"
              required
              placeholder={t("form.emailPlaceholder")}
              className="rounded-none px-4 py-3 bg-[#111] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base"
            />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-subject" className="uppercase text-xs tracking-widest text-footer-light mb-1">
            {t("form.subject")}
          </label>
          <input
            name="subject"
            id="contact-subject"
            type="text"
            required
            placeholder={t("form.subjectPlaceholder")}
            className="rounded-none px-4 py-3 bg-[#111] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="contact-message" className="uppercase text-xs tracking-widest text-footer-light mb-1">
            {t("form.message")}
          </label>
          <textarea
            name="message"
            id="contact-message"
            rows={5}
            required
            placeholder={t("form.messagePlaceholder")}
            className="rounded-none px-4 py-3 bg-[#181818] text-white border border-white/10 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-[#FFD34E] text-black font-semibold tracking-widest py-4 rounded-none shadow-lg hover:bg-[#e6b800] transition"
        >
          {t("form.submit")}
        </button>
        {status && (
          <p className="text-sm mt-2 text-center text-footer-light">
            {status === "sent" ? t("form.success") : t("form.error")}
          </p>
        )}
      </form>
    </section>
  );
}
