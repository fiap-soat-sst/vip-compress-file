import { SQSConsumer } from '../External/SQS/SQSConsumer.ts'
import ImageCompressor from '../Service/ImageCompressorService.ts'

export class ImageController {
  private readonly sqsService: SQSConsumer
  private readonly SQS_QUEUE_URL: string
  constructor() {
    this.SQS_QUEUE_URL = process.env.SQS_QUEUE_URL ?? ''
    this.sqsService = new SQSConsumer(this.SQS_QUEUE_URL)
  }

  public async run() {
    const messages = await this.sqsService.receiveMessages()
    const imageCompressor = new ImageCompressor()

    if (!messages.length) {
      return
    }

    for (let i = 0; i < messages.length; i++) {
      imageCompressor.execute(messages[i].Body)
      await this.sqsService.deleteMessage(messages[i].ReceiptHandle)
    }
  }
}
