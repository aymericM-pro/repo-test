export function baseLayout(content: string, title: string): string {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      body        { font-family: sans-serif; background: #0f0f0f; color: #e0e0e0; margin: 0; }
      .container  { max-width: 560px; margin: 40px auto; background: #1a1a2e; border-radius: 12px; padding: 40px; }
      .btn        { display: inline-block; padding: 12px 24px; background: #7c3aed; color: #fff; border-radius: 8px; text-decoration: none; font-weight: bold; }
      .footer     { margin-top: 32px; font-size: 12px; color: #555; }
    </style>
  </head>
  <body>
    <div class="container">
      ${content}
      <div class="footer">Chess App — ne pas répondre à cet email</div>
    </div>
  </body>
  </html>`;
}
