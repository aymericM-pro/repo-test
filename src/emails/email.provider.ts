export interface IEmailProvider {
  send(params: { to: string; subject: string; html: string }): Promise<void>;
}
