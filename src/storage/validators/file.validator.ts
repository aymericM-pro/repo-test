export interface FileValidationOptions {
  maxSizeBytes?: number;
  allowedMimeTypes?: string[];
  allowedExtensions?: string[];
}

const MAGIC_BYTES: Record<string, string[]> = {
  "image/jpeg":      ["ffd8ff"],
  "image/png":       ["89504e47"],
  "image/webp":      ["52494646"],
  "application/pdf": ["25504446"],
  // pgn = texte, pas de magic bytes → validation par extension + contenu
};

export class FileValidator {
  validate(buffer: Buffer, originalName: string, options: FileValidationOptions = {}): void {
    const {
      maxSizeBytes = 5 * 1024 * 1024,
      allowedMimeTypes = [],
      allowedExtensions = [],
    } = options;

    if (buffer.byteLength > maxSizeBytes) {
      throw new FileValidationError(
        `File exceeds maximum size of ${maxSizeBytes / 1024 / 1024}MB`,
      );
    }

    const ext = this.extractExtension(originalName);
    if (allowedExtensions.length > 0 && !allowedExtensions.includes(ext)) {
      throw new FileValidationError(`Extension .${ext} is not allowed`);
    }

    if (allowedMimeTypes.length > 0) {
      const detectedMime = this.detectMimeFromBytes(buffer);
      if (detectedMime && !allowedMimeTypes.includes(detectedMime)) {
        throw new FileValidationError(`File content does not match allowed types`);
      }
    }
  }

  private extractExtension(filename: string): string {
    const clean = filename.replace(/\0/g, "").split("/").pop() ?? "";
    return clean.split(".").pop()?.toLowerCase() ?? "";
  }

  private detectMimeFromBytes(buffer: Buffer): string | null {
    const hex = buffer.subarray(0, 8).toString("hex");
    for (const [mime, signatures] of Object.entries(MAGIC_BYTES)) {
      if (signatures.some((sig) => hex.startsWith(sig))) return mime;
    }
    return null;
  }
}

export class FileValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FileValidationError";
  }
}
