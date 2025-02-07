import { SQSConsumer } from '../External/SQS/SQSConsumer'
import ImageCompressorService from '../Service/ImageCompressorService'
import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase'
import { AddImagesCompressedToDynamoDB } from '../UseCases/AddImagesCompressedToDynamoDB'
import { S3BucketStorage } from '../External/s3/S3BucketStorage'
import { ImageRepository } from '../External/Database/Repository/ImageRepository'
import { CompressToZip } from '../External/compress/compressToZip'

export class ImageCompressWorkerController {
  private readonly imageCompressorService: ImageCompressorService =
    new ImageCompressorService(
      new DownloadFolderImagesFromS3BucketUseCase(new S3BucketStorage()),
      new AddImagesCompressedToDynamoDB(new ImageRepository()),
      new CompressImagesToZipUseCase(new CompressToZip()),
      new UploadImagesToS3BucketUseCase(new S3BucketStorage())
    )
  private readonly AWS_PROCESS_TO_COMPRESS_QUEUE: string =
    process.env.AWS_PROCESS_TO_COMPRESS_QUEUE ?? ''
  private readonly sqsService: SQSConsumer = new SQSConsumer(
    this.AWS_PROCESS_TO_COMPRESS_QUEUE
  )
  public async run() {
    console.log('ImageCompressWorkerController running')
    setInterval(async () => {
      const messages = await this.sqsService.receiveMessages()

      if (!messages?.length) {
        console.log('no new messages')
        return
      }

      this.imageCompressorService.execute(messages)
      await this.sqsService.deleteMessage(messages.ReceiptHandle)
    }, 5000)
  }
}

new ImageCompressWorkerController().run()
