import { getImagesFromS3BucketUseCase } from '../UseCases/getImagesFromS3BucketUseCase.ts'
import { getBucketNameFromDynamoDBUseCase } from '../UseCases/getImagesMetadadaFromDynamoDBUseCase.ts'
import { compressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase.ts'
import { uploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase.ts'

export default class ImageCompressorService {
  async execute(messageId: string) {
    try {
      const imageMetadata = await getBucketNameFromDynamoDBUseCase(messageId)
      const rawImages = await getImagesFromS3BucketUseCase(imageMetadata)
      const compressedImages = await compressImagesToZipUseCase(rawImages)
      await uploadImagesToS3BucketUseCase(compressedImages)
      return { status: 'success', message: 'Images compressed successfully' }
    } catch (error) {
      return {
        status: 'error',
        message: `Error compressing images. ${error}`,
      }
    }
  }
}
