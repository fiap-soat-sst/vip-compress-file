export interface IBucketStorageGateway {
  getProcessedImagesToCompact(bucketName: string): any
  uploadZipToCompactedBucket(FolderToUpload: string): any
}
