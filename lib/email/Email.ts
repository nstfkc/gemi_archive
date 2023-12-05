import { writeFile } from "node:fs/promises";

import { EmailOptions, JSONLike } from "../types/global";
import { renderEmail } from "./renderEmail";
import { EmailServiceProvider } from "@/app/providers/EmailServiceProvider";

export class Email {
  constructor(
    private templatePath: string,
    private data: JSONLike,
  ) {}

  async send(options: EmailOptions) {
    const provider = new EmailServiceProvider();
    const html = await renderEmail(this.templatePath, this.data);
    if (options.debug === true || process.env.EMAIL_PROVIDER === "debug") {
      await this.debug(this.templatePath, html);
    } else {
      return await provider.sendEmail(html, options);
    }
  }

  async debug(templatePath: string, html: string) {
    const fileName = `${process.env.DEBUG_DIR}/${templatePath
      .split("/")
      .join("-")}.html`;

    Bun.spawnSync(["open", fileName]);
    await writeFile(fileName, html);
  }
}
