export function baseLayout(content: string, title: string): string {
  return `<!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <style>
      * { box-sizing: border-box; margin: 0; padding: 0; }

      body {
        font-family: 'Georgia', serif;
        padding: 48px;
        color: #1a1a1a;
        background: #fff;
      }

      h1 {
        font-size: 22px;
        border-bottom: 2px solid #1a1a1a;
        padding-bottom: 10px;
        margin-bottom: 24px;
      }

      .meta {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px 24px;
        font-size: 13px;
        margin-bottom: 32px;
        color: #444;
      }

      .meta span { font-weight: bold; color: #1a1a1a; }

      .moves {
        font-family: 'Courier New', monospace;
        font-size: 13px;
        line-height: 2;
        background: #f5f5f5;
        padding: 16px;
        border-radius: 6px;
        border-left: 4px solid #1a1a1a;
      }

      .move-number { color: #888; margin-right: 4px; }
      .move-white  { margin-right: 12px; font-weight: bold; }
      .move-black  { margin-right: 24px; }

      .result {
        margin-top: 24px;
        font-size: 18px;
        font-weight: bold;
        text-align: center;
        padding: 12px;
        border-radius: 6px;
      }

      .result.white { background: #d4edda; color: #155724; }
      .result.black { background: #f8d7da; color: #721c24; }
      .result.draw  { background: #fff3cd; color: #856404; }

      .moves-table {
        width: 100%;
        border-collapse: collapse;
        font-family: 'Courier New', monospace;
        font-size: 12px;
      }

      .moves-table thead tr { background: #1a1a2e; color: #fff; }
      .moves-table th, .moves-table td { padding: 6px 10px; text-align: left; }
      .moves-table tbody tr:nth-child(even) { background: #f5f5f5; }
      .moves-table .num  { color: #888; width: 32px; }
      .moves-table .san  { font-weight: bold; width: 80px; }
      .moves-table .tl   { color: #666; width: 60px; font-size: 11px; }

      .footer {
        position: fixed;
        bottom: 24px;
        left: 48px;
        right: 48px;
        font-size: 11px;
        color: #999;
        border-top: 1px solid #eee;
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
      }
    </style>
  </head>
  <body>
    ${content}
    <div class="footer">
      <span>Chess App</span>
      <span>Généré le ${new Date().toLocaleDateString("fr-FR")}</span>
    </div>
  </body>
  </html>`;
}
