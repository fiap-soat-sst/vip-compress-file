import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase'
import { GetBucketNameFromDynamoDBUseCase } from '../UseCases/getBucketNameFromDynamoDBUseCase'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase'

export default class ImageCompressorService {
  constructor(
    private readonly downloadFolderImagesFromS3BucketUseCase: DownloadFolderImagesFromS3BucketUseCase,
    private readonly getBucketNameFromDynamoDBUseCase: GetBucketNameFromDynamoDBUseCase,
    private readonly compressImagesToZipUseCase: CompressImagesToZipUseCase,
    private readonly uploadImagesToS3BucketUseCase: UploadImagesToS3BucketUseCase
  ) {}
  async execute(userId: string) {
    try {
      const ImagestoZip =
        await this.getBucketNameFromDynamoDBUseCase.execute(userId)
      const folderToBeZipped =
        await this.downloadFolderImagesFromS3BucketUseCase.execute(ImagestoZip)

      await this.compressImagesToZipUseCase.execute(folderToBeZipped)
      await this.uploadImagesToS3BucketUseCase.execute(folderToBeZipped)
      return { status: 'success', message: 'Images compressed successfully' }
    } catch (error) {
      return {
        status: 'error',
        message: `Error compressing images. ${error}`,
      }
    }
  }
}
