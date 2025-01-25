import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'

export class UploadImagesToS3BucketUseCase {
  constructor(private readonly bucketStorageGateway: IBucketStorageGateway) {}
  async execute(compressedFolder: string) {
    console.log('Uploading images to S3 bucket')
    return this.bucketStorageGateway.upload(
      compressedFolder,
      'compressed',
      'application/zip'
    )
  }
}
