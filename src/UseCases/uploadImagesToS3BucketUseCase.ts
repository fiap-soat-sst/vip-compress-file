import { IBucketStorageGateway } from '../Gateways/IBucketStorageGateway'
import { Left, Right } from '../@Shared/Either'

export class UploadImagesToS3BucketUseCase {
  constructor(private readonly bucketStorageGateway: IBucketStorageGateway) {}
  async execute(localZipFolder: string, hash: string) {
    console.log('Uploading images to S3 bucket')
    try {
      await this.bucketStorageGateway.uploadZipToCompactedBucket(localZipFolder)

      return Right(
        `https://${process.env.AWS_ZIP_IMAGES_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${hash}.zip`
      )
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
