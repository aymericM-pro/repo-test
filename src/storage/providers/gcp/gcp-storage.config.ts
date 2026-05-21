export interface GcpStorageConfig {
  projectId: string;
  bucketName: string;
  keyFilename?: string;
}

export function loadGcpStorageConfig(): GcpStorageConfig {
  return {
    projectId:   process.env.GCP_PROJECT_ID  ?? '',
    bucketName:  process.env.GCP_BUCKET_NAME ?? '',
    keyFilename: process.env.GCP_KEY_FILE,
  };
}
