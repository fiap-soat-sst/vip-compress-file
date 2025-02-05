import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase'
import { GetBucketNameFromDynamoDBUseCase } from '../UseCases/getBucketNameFromDynamoDBUseCase'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase'

export default class ImageCompressorService {
  constructor(
    private readonly downloadFolderImagesFromS3Bucket: DownloadFolderImagesFromS3BucketUseCase,
    private readonly getBucketNameFromDynamoDB: GetBucketNameFromDynamoDBUseCase,
    private readonly compressImagesToZip: CompressImagesToZipUseCase,
    private readonly uploadImagesToS3Bucket: UploadImagesToS3BucketUseCase
  ) {}
  async execute(UserEmail: string) {
    try {
      const processedImagesBucket =
        await this.getBucketNameFromDynamoDB.execute(UserEmail)

      const folderToBeZipped =
        await this.downloadFolderImagesFromS3Bucket.execute(
          processedImagesBucket
        )

      await this.compressImagesToZip.execute(folderToBeZipped)

      await this.uploadImagesToS3Bucket.execute(folderToBeZipped)

      return { status: 'success', message: 'Images compressed successfully' }
    } catch (error) {
      return {
        status: 'error',
        message: `Error compressing images. ${error}`,
      }
    }
  }
}
