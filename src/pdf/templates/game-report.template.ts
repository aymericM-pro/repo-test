import { baseLayout } from "@/pdf/templates/base.layout";
import { PdfPayload, RenderedPdf } from "@/pdf/pdf.types";

function formatSeconds(s: number): string {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return m > 0 ? `${m}m${sec > 0 ? ` ${sec}s` : ""}` : `${sec}s`;
}

function renderMoves(
  moves: Array<{ san: string; color: string; timeLeft: number }>,
): string {
  const pairs: string[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    const num = Math.floor(i / 2) + 1;
    const w = moves[i];
    const b = moves[i + 1];
    pairs.push(`
      <tr>
        <td class="num">${num}.</td>
        <td class="san">${w.san}</td>
        <td class="tl">${formatSeconds(w.timeLeft)}</td>
        <td class="san">${b ? b.san : ""}</td>
        <td class="tl">${b ? formatSeconds(b.timeLeft) : ""}</td>
      </tr>
    `);
  }
  return pairs.join("");
}

const RESULT_LABELS: Record<string, string> = {
  white:  "⬜ Victoire des Blancs",
  black:  "⬛ Victoire des Noirs",
  draw:   "🤝 Nulle",
};

const STATUS_LABELS: Record<string, string> = {
  waiting:  "En attente",
  active:   "En cours",
  finished: "Terminée",
};

const END_REASON_LABELS: Record<string, string> = {
  checkmate:      "Échec et mat",
  resignation:    "Abandon",
  timeout:        "Temps écoulé",
  draw_agreement: "Accord de nulle",
  stalemate:      "Pat",
  abandoned:      "Abandonnée",
};

export function gameReportTemplate(p: PdfPayload<"game.report">): RenderedPdf {
  const resultLabel = p.result ? RESULT_LABELS[p.result] : "—";
  const resultClass = p.result ?? "draw";
  const endReasonLabel = p.endReason ? END_REASON_LABELS[p.endReason] ?? p.endReason : "—";

  return {
    filename: `game-${p.gameId}.pdf`,
    html: baseLayout(
      `
      <h1>♟️ Rapport de partie</h1>

      <div class="meta">
        <div>Blancs      <span>${p.whiteUsername}</span></div>
        <div>Noirs       <span>${p.blackUsername ?? "—"}</span></div>
        <div>Cadence     <span>${p.timeControl} · ${formatSeconds(p.timeLimit)}${p.increment ? ` + ${p.increment}s` : ""}</span></div>
        <div>Statut      <span>${STATUS_LABELS[p.status] ?? p.status}</span></div>
        <div>Coups joués <span>${p.moveCount}</span></div>
        <div>Fin de partie <span>${endReasonLabel}</span></div>
        ${p.startedAt  ? `<div>Début <span>${new Date(p.startedAt).toLocaleString("fr-FR")}</span></div>` : ""}
        ${p.finishedAt ? `<div>Fin   <span>${new Date(p.finishedAt).toLocaleString("fr-FR")}</span></div>` : ""}
      </div>

      ${p.result ? `<div class="result ${resultClass}">${resultLabel}</div>` : ""}

      ${p.moves.length > 0 ? `
      <h2 style="margin: 24px 0 12px; font-size: 15px;">Historique des coups</h2>
      <table class="moves-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Blancs</th>
            <th>Temps</th>
            <th>Noirs</th>
            <th>Temps</th>
          </tr>
        </thead>
        <tbody>${renderMoves(p.moves)}</tbody>
      </table>
      ` : ""}
    `,
      `Rapport — ${p.whiteUsername} vs ${p.blackUsername ?? "?"}`,
    ),
  };
}
