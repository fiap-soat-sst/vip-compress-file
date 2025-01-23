import { SQSConsumer } from '../External/SQS/SQSConsumer'
import ImageCompressorService from '../Service/ImageCompressorService'

import { ICronGateway } from '../Gateways/ICronGateway'

export class ImageController {
  private readonly cron: ICronGateway
  private readonly SQS_QUEUE_URL: string = process.env.SQS_QUEUE_URL ?? ''
  private readonly sqsService: SQSConsumer = new SQSConsumer(this.SQS_QUEUE_URL)
  private readonly imageCompressorService: ImageCompressorService

  public async run() {
    this.cron.schedule('* * * * *', async () => {
      const messages = await this.sqsService.receiveMessages()

      if (!messages.length) {
        return
      }

      for (let i = 0; i < messages.length; i++) {
        const messageId = messages[i].MessageId
        if (!messageId) continue
        this.imageCompressorService.execute(messageId)
        await this.sqsService.deleteMessage(messages[i].ReceiptHandle)
      }
    })
  }
}

new ImageController().run()
