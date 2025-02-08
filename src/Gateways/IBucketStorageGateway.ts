import { Either } from '../@Shared/Either'

export interface IBucketStorageGateway {
  client: any
  getProcessedImagesToCompact(
    bucketName: string
  ): Promise<Either<Error, string>>
  uploadZipToCompactedBucket(
    FolderToUpload: string
  ): Promise<Either<Error, boolean>>
}
