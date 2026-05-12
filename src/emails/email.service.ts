import { IEmailProvider } from "@/emails/email.provider";
import { templates } from "@/emails/templates";
import { EmailType, EmailPayload } from "@/emails/email.types";

export class EmailService {
  constructor(private readonly provider: IEmailProvider) {}

  async send<T extends EmailType>(
    type: T,
    payload: EmailPayload<T>,
  ): Promise<void> {
    try {
      const render = templates[type] as (p: EmailPayload<T>) => {
        subject: string;
        html: string;
      };
      const { subject, html } = render(payload);

      await this.provider.send({
        to: (payload as any).to,
        subject,
        html,
      });
    } catch (err) {
      console.error(`[email] failed ${type}`, err);
    }
  }
}
