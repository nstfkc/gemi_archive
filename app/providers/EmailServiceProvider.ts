import { EmailOptions } from "@/lib/types/global";
import { Resend } from "resend";

export class EmailServiceProvider {
  async sendEmail(html: string, options: EmailOptions) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { from, subject, to } = options;
    return await resend.emails.send({
      from,
      to,
      subject,
      html,
    });
  }
}
