import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase'
import { AddImagesCompressedToDynamoDB } from '../UseCases/AddImagesCompressedToDynamoDB'
import { MessageData } from '../Entities/MessageData'
import { INotificationGateway } from '../Gateways/Notification/INotificationGateway'

export default class ImageCompressorService {
  constructor(
    private readonly downloadFolderImagesFromS3Bucket: DownloadFolderImagesFromS3BucketUseCase,
    private readonly addImagesCompressedToDynamoDB: AddImagesCompressedToDynamoDB,
    private readonly compressImagesToZip: CompressImagesToZipUseCase,
    private readonly uploadImagesToS3Bucket: UploadImagesToS3BucketUseCase,
    private readonly notificationGateway: INotificationGateway
  ) {}
  async execute(messageData: MessageData) {
    try {
      const imagesToZip = messageData.video.id

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

      this.notificationGateway.sendEmail({
        type: 'SUCCESS',
        videoId: '', // video.id,
        email: messageData.email,
        message: 'Images compressed successfully',
      })
      return { status: 'success', message: 'Images compressed successfully' }
    } catch (error: any) {
      this.notificationGateway.sendEmail({
        type: 'ERROR',
        videoId: '', // video.id,
        email: messageData.email,
        message: error.message,
      })
      return {
        status: 'error',
        message: `Error compressing images. ${error}`,
      }
    }
  }
}
