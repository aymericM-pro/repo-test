import { PdfType, PdfPayload, RenderedPdf } from "@/pdf/pdf.types";
import { gameReportTemplate } from "@/pdf/templates/game-report.template";

type TemplateRegistry = {
  [T in PdfType]: (payload: PdfPayload<T>) => RenderedPdf;
};

export const pdfTemplates: TemplateRegistry = {
  "game.report": gameReportTemplate,
};
