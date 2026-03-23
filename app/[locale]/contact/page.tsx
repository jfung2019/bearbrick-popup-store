"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const [status, setStatus] = useState<string | null>(null);
  const t = useTranslations('Contact');

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
      setStatus("Message sent!");
      form.reset();
    } else {
      setStatus("Failed to send. Please try again.");
    }
  }

  return (
    <main className="w-full px-6 sm:px-8 lg:px-10 mx-auto py-20 min-h-screen bg-[#181818] flex flex-col items-center justify-center">
      <h1 className="text-5xl font-serif italic text-center text-white mb-4">{t('title')}</h1>
      <p className="text-footer-light text-center mb-10 max-w-lg">{t('subtitle')}</p>
      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6 bg-transparent">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="name" className="uppercase text-xs tracking-widest text-footer-light mb-1">{t('form.name')}</label>
            <input name="name" id="name" type="text" required placeholder={t('form.namePlaceholder')} className="rounded-none px-4 py-3 bg-[#111] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base" />
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label htmlFor="email" className="uppercase text-xs tracking-widest text-footer-light mb-1">{t('form.email')}</label>
            <input name="email" id="email" type="email" required placeholder={t('form.emailPlaceholder')} className="rounded-none px-4 py-3 bg-[#111] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base" />
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="subject" className="uppercase text-xs tracking-widest text-footer-light mb-1">{t('form.subject')}</label>
          <input name="subject" id="subject" type="text" required placeholder={t('form.subjectPlaceholder')} className="rounded-none px-4 py-3 bg-[#111] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="message" className="uppercase text-xs tracking-widest text-footer-light mb-1">{t('form.message')}</label>
          <textarea name="message" id="message" rows={5} required placeholder={t('form.messagePlaceholder')} className="rounded-none px-4 py-3 bg-[#181818] text-white border-0 focus:ring-2 focus:ring-footer-accent placeholder:text-footer-light/60 text-base" />
        </div>
        <button type="submit" className="w-full bg-[#FFD34E] text-black font-semibold tracking-widest py-4 rounded-none shadow-lg mt-4 hover:bg-[#e6b800] transition">{t('form.submit')}</button>
        {status && <p className="text-sm mt-2 text-center text-footer-light">{status === 'Message sent!' ? t('form.success') : t('form.error')}</p>}
      </form>
    </main>
  );
}
