import { baseLayout } from "@/emails/templates/base.layout";
import { EmailPayload, RenderedEmail } from "@/emails/email.types";

export function userWelcomeTemplate(
  p: EmailPayload<"user.welcome">,
): RenderedEmail {
  return {
    subject: `Bienvenue ${p.username} ♟️`,
    html: baseLayout(
      `
      <h2>Bienvenue, ${p.username} !</h2>
      <p>Ton compte est créé. Tu peux maintenant jouer ta première partie.</p>
      <br/>
      <a class="btn" href="${process.env.APP_URL ?? "http://localhost:3000"}/play">
        Jouer maintenant
      </a>
    `,
      `Bienvenue ${p.username}`,
    ),
  };
}
