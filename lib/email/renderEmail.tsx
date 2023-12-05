import { renderAsync } from "@react-email/render";
import { JSONLike } from "../types/global";

export async function renderEmail(templatePath: string, data: JSONLike) {
  try {
    const Template = (
      await import(`${process.env.APP_DIR}/views/email/${templatePath}.tsx`)
    ).default;
    console.log(Template);
    return await renderAsync(<Template data={data} />);
  } catch (err) {
    console.log(err);
  }

  return "Email template can not be found";
}
