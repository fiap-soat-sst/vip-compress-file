import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'
import { Either, Left } from '../@Shared/Either'

export class UploadImagesToS3BucketUseCase {
  constructor(private readonly bucketStorageGateway: IBucketStorageGateway) {}
  async execute(localZipFolder: string) {
    console.log('Uploading images to S3 bucket')
    try {
      await this.bucketStorageGateway.uploadZipToCompactedBucket(localZipFolder)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
