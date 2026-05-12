import { IRequest } from "@/mediator/interfaces";
import { PdfPayload } from "@/pdf/pdf.types";

export class GetGameReportQuery implements IRequest<PdfPayload<"game.report">> {
  declare readonly _responseType: PdfPayload<"game.report">;
  constructor(public readonly gameId: string) {}
}
