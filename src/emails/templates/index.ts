import { EmailType, EmailPayload, RenderedEmail } from "@/emails/email.types";
import { userWelcomeTemplate } from "@/emails/templates/user-welcome.template";

type TemplateRegistry = {
  [T in EmailType]: (payload: EmailPayload<T>) => RenderedEmail;
};

export const templates: TemplateRegistry = {
  "user.welcome": userWelcomeTemplate,
};
