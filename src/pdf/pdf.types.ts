export type PdfEvent = {
  type: "game.report";
  payload: {
    gameId: string;
    whiteUsername: string;
    blackUsername: string | null;
    timeControl: string;
    timeLimit: number;
    increment: number;
    status: string;
    result: "white" | "black" | "draw" | null;
    endReason: string | null;
    moveCount: number;
    startedAt: Date | null;
    finishedAt: Date | null;
    moves: Array<{ san: string; color: string; timeLeft: number }>;
  };
};

export type PdfType = PdfEvent["type"];
export type PdfPayload<T extends PdfType> = Extract<
  PdfEvent,
  { type: T }
>["payload"];

export interface RenderedPdf {
  filename: string;
  html: string;
}
