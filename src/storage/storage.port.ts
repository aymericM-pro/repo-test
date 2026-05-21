export interface UploadOptions {
  folder?: string;
  contentType?: string;
}

export interface UploadResult {
  path: string;
}

export interface IStoragePort {
  upload(filename: string, buffer: Buffer, options?: UploadOptions): Promise<UploadResult>;
  delete(path: string): Promise<void>;
  getSignedUrl(path: string, expiresInSeconds?: number): Promise<string>;
}

export const STORAGE_SERVICE = Symbol('IStoragePort');
