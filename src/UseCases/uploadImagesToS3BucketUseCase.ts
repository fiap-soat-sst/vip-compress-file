import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'

export class UploadImagesToS3BucketUseCase {
  constructor(private readonly bucketStorageGateway: IBucketStorageGateway) {}
  async execute(localZipFolder: string) {
    console.log('Uploading images to S3 bucket')
    this.bucketStorageGateway.uploadZipToCompactedBucket(localZipFolder)
  }
}
