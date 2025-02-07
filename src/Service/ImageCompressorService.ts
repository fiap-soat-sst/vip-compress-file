import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase'
import { AddImagesCompressedToDynamoDB } from '../UseCases/AddImagesCompressedToDynamoDB'
import { MessageData } from '../Entities/MessageData'

export default class ImageCompressorService {
  constructor(
    private readonly downloadFolderImagesFromS3Bucket: DownloadFolderImagesFromS3BucketUseCase,
    private readonly addImagesCompressedToDynamoDB: AddImagesCompressedToDynamoDB,
    private readonly compressImagesToZip: CompressImagesToZipUseCase,
    private readonly uploadImagesToS3Bucket: UploadImagesToS3BucketUseCase
  ) {}
  async execute(messageData: MessageData) {
    try {
      const imagesToZip = messageData.video.hash

      const folderToBeZipped =
        await this.downloadFolderImagesFromS3Bucket.execute(imagesToZip)

      await this.compressImagesToZip.execute(folderToBeZipped.toString())

      const bucketNameURL = await this.uploadImagesToS3Bucket.execute(
        folderToBeZipped.toString(),
        imagesToZip
      )

      await this.addImagesCompressedToDynamoDB.execute(
        messageData.video.id,
        bucketNameURL.toString()
      )

      return { status: 'success', message: 'Images compressed successfully' }
    } catch (error) {
      return {
        status: 'error',
        message: `Error compressing images. ${error}`,
      }
    }
  }
}
