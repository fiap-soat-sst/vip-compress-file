import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase.ts'
import { GetBucketNameFromDynamoDBUseCase } from '../UseCases/getBucketNameFromDynamoDBUseCase.ts'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase.ts'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase.ts'

export default class ImageCompressorService {
  constructor(
    private readonly downloadFolderImagesFromS3BucketUseCase: DownloadFolderImagesFromS3BucketUseCase,
    private readonly getBucketNameFromDynamoDBUseCase: GetBucketNameFromDynamoDBUseCase,
    private readonly compressImagesToZipUseCase: CompressImagesToZipUseCase,
    private readonly uploadImagesToS3BucketUseCase: UploadImagesToS3BucketUseCase
  ) {}
  async execute(messageId: string) {
    try {
      const ImagestoZip =
        await this.getBucketNameFromDynamoDBUseCase.execute(messageId)
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
