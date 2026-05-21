import { randomUUID } from "crypto";
import path from "path";

export class FilenameSanitizer {
  sanitize(originalName: string, preserveExtension = true): string {
    const uuid = randomUUID();

    if (!preserveExtension) return uuid;

    const ext = path.extname(originalName)
      .replace(/\0/g, "")
      .toLowerCase()
      .slice(1);

    return ext ? `${uuid}.${ext}` : uuid;
  }
}
