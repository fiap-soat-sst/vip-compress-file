import { SQSClient, CreateQueueCommand } from '@aws-sdk/client-sqs'

const sqsClient = new SQSClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

async function createQueue() {
  const result = await sqsClient.send(
    new CreateQueueCommand({ QueueName: 'my-queue' })
  )
  console.log('Queue URL:', result.QueueUrl)
}

createQueue()
