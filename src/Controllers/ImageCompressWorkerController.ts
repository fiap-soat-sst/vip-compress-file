import { SQSConsumer } from '../External/SQS/SQSConsumer'
import ImageCompressorService from '../Service/ImageCompressorService'
import { DownloadFolderImagesFromS3BucketUseCase } from '../UseCases/downloadFolderImagesFromS3BucketUseCase'
import { CompressImagesToZipUseCase } from '../UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../UseCases/uploadImagesToS3BucketUseCase'
import { AddImagesCompressedToDynamoDB } from '../UseCases/AddImagesCompressedToDynamoDB'
import { S3BucketStorage } from '../External/s3/S3BucketStorage'
import { ImageRepository } from '../External/Database/Repository/ImageRepository'
import { CompressToZip } from '../External/compress/compressToZip'
import { Either, Left, Right } from '../@Shared/Either'

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
    setInterval(async (): Promise<Either<Error, void>> => {
      try {
        const messages = await this.sqsService.receiveMessages()

        if (!messages?.length) {
          return Right(undefined)
        }
        for (const message of messages) {
          const messageData = JSON.parse(message.Body)
          await this.imageCompressorService.execute(messageData)
          await this.sqsService.deleteMessage(messages.ReceiptHandle)
        }
        return Right(undefined)
      } catch (error) {
        console.log('Error in ImageCompressWorkerController', error)
        return Left<Error>(error as Error)
      }
    }, 5000)
  }
}

new ImageCompressWorkerController().run()
