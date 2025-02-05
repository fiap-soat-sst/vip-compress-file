export interface IBucketStorageGateway {
  client: any
  getProcessedImagesToCompact(bucketName: string): any
  uploadZipToCompactedBucket(FolderToUpload: string): any
}
