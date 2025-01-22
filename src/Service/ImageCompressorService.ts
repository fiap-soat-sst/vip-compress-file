import { downloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase.ts'
import { getBucketNameFromDynamoDBUseCase } from '../UseCases/getBucketNameFromDynamoDBUseCase.ts'
import { compressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase.ts'
import { uploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase.ts'

export default class ImageCompressorService {
  async execute(messageId: string) {
    try {
      const ImagestoZip = await getBucketNameFromDynamoDBUseCase(messageId)
      const folderToBeZipped =
        await downloadFolderImagesFromS3BucketUseCase(ImagestoZip)

      await compressImagesToZipUseCase(folderToBeZipped)
      await uploadImagesToS3BucketUseCase(folderToBeZipped)
      return { status: 'success', message: 'Images compressed successfully' }
    } catch (error) {
      return {
        status: 'error',
        message: `Error compressing images. ${error}`,
      }
    }
  }
}
