import { Storage } from "@google-cloud/storage";
import { IStoragePort, UploadOptions, UploadResult } from "@/storage/storage.port";
import { GcpStorageConfig } from "./gcp-storage.config";

export class GcpStorageProvider implements IStoragePort {
  private readonly storage: Storage;
  private readonly bucketName: string;

  constructor(config: GcpStorageConfig) {
    this.bucketName = config.bucketName;
    this.storage = new Storage({
      projectId: config.projectId,
      ...(config.keyFilename ? { keyFilename: config.keyFilename } : {}),
    });
  }

  async upload(filename: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult> {
    const path = options?.folder ? `${options.folder}/${filename}` : filename;
    const file = this.storage.bucket(this.bucketName).file(path);
    await file.save(buffer, {
      contentType: options?.contentType,
      resumable: false,
    });
    return { path };
  }

  async delete(path: string): Promise<void> {
    await this.storage.bucket(this.bucketName).file(path).delete();
  }

  async getSignedUrl(path: string, expiresInSeconds = 900): Promise<string> {
    const [url] = await this.storage
      .bucket(this.bucketName)
      .file(path)
      .getSignedUrl({
        action: "read",
        expires: Date.now() + expiresInSeconds * 1000,
      });
    return url;
  }
}
