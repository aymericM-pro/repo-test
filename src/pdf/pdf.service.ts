import puppeteer from "puppeteer";
import { pdfTemplates } from "@/pdf/templates";
import { PdfType, PdfPayload } from "@/pdf/pdf.types";

export class PdfService {
  async generate<T extends PdfType>(
    type: T,
    payload: PdfPayload<T>,
  ): Promise<{ buffer: Buffer; filename: string }> {
    const render = pdfTemplates[type] as (p: PdfPayload<T>) => {
      html: string;
      filename: string;
    };
    const { html, filename } = render(payload);

    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // nécessaire en Docker
    });

    try {
      const page = await browser.newPage();
      await page.setContent(html, { waitUntil: "networkidle0" });

      const buffer = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
          top: "20mm",
          bottom: "20mm",
          left: "15mm",
          right: "15mm",
        },
      });

      return { buffer: Buffer.from(buffer), filename };
    } finally {
      await browser.close();
    }
  }
}

export const pdfService = new PdfService();
