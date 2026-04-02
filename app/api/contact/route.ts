import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, subject, message } = await req.json();

  // Configure your SMTP transport (use environment variables in production)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  try {
    await transporter.sendMail({
      from: `Contact Form <${process.env.SMTP_USER}>`,
      to: `${process.env.SMTP_USER}`,
      subject: `Contact Form Submission from ${firstName} ${lastName} - ${subject}`,
      replyTo: email,
      text: `Name: ${firstName} ${lastName}\nEmail: ${email}\nMessage:\n${message}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
