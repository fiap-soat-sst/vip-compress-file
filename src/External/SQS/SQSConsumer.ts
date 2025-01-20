import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
} from '@aws-sdk/client-sqs'

export class SQSConsumer {
  private client
  private queueUrl

  constructor(queue: string) {
    this.client = new SQSClient({})
    this.queueUrl = queue
  }

  async receiveMessages() {
    try {
      const receiveMessageCommand = new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        MessageAttributeNames: ['All'],
      })
      const response = await this.client.send(receiveMessageCommand)
      const messages = response?.Messages?.length ? response.Messages : []

      return messages
    } catch (err) {
      throw err
    }
  }

  async deleteMessage(receiptHandle?: string) {
    try {
      const deleteMessageCommand = new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
      })

      await this.client.send(deleteMessageCommand)
    } catch (err) {
      throw err
    }
  }
}
