import nodemailer from "nodemailer";
import { IEmailProvider } from "@/emails/email.provider";

export class NodemailerProvider implements IEmailProvider {
  private readonly transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
  });

  async send({
    to,
    subject,
    html,
  }: {
    to: string;
    subject: string;
    html: string;
  }) {
    await this.transporter.sendMail({
      from: process.env.EMAIL_FROM ?? "noreply@chess-app.com",
      to,
      subject,
      html,
    });
    console.log(`[email] sent → ${to} | ${subject}`);
  }
}
