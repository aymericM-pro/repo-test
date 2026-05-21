import { IStoragePort, UploadOptions, UploadResult } from "./storage.port";
import { FileValidator, FileValidationOptions } from "./validators/file.validator";
import { FilenameSanitizer } from "./sanitizers/filename.sanitizer";

export class StorageService {
  private readonly validator: FileValidator;
  private readonly sanitizer: FilenameSanitizer;

  constructor(private readonly provider: IStoragePort) {
    this.validator = new FileValidator();
    this.sanitizer = new FilenameSanitizer();
  }

  async upload(
    originalFilename: string,
    buffer: Buffer,
    validationOptions: FileValidationOptions,
    uploadOptions?: UploadOptions,
  ): Promise<UploadResult> {
    this.validator.validate(buffer, originalFilename, validationOptions);
    const safeFilename = this.sanitizer.sanitize(originalFilename);
    return this.provider.upload(safeFilename, buffer, uploadOptions);
  }

  async delete(path: string): Promise<void> {
    return this.provider.delete(path);
  }

  async getSignedUrl(path: string, expiresInSeconds = 900): Promise<string> {
    return this.provider.getSignedUrl(path, expiresInSeconds);
  }
}
