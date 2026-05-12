export type EmailEvent = {
  type: "user.welcome";
  payload: { to: string; username: string };
};

export type EmailType = EmailEvent["type"];
export type EmailPayload<T extends EmailType> = Extract<
  EmailEvent,
  { type: T }
>["payload"];

export interface RenderedEmail {
  subject: string;
  html: string;
}
