import { IStoragePort, UploadOptions, UploadResult } from "@/storage/storage.port";

export class FakeGcpStorageProvider implements IStoragePort {
  readonly files = new Map<string, Buffer>();

  async upload(filename: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult> {
    const path = options?.folder ? `${options.folder}/${filename}` : filename;
    this.files.set(path, buffer);
    return { path };
  }

  async delete(path: string): Promise<void> {
    this.files.delete(path);
  }

  async getSignedUrl(path: string, expiresInSeconds = 900): Promise<string> {
    return `https://fake-storage.example.com/${path}?expires=${expiresInSeconds}`;
  }
}
