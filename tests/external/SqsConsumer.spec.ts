import { vi, Mock } from 'vitest'
import { SQSConsumer } from '../../src/External/SQS/SQSConsumer'
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs'
import { fromEnv } from '@aws-sdk/credential-providers'

vi.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn(),
  ReceiveMessageCommand: vi.fn(),
  DeleteMessageCommand: vi.fn(),
}))

vi.mock('@aws-sdk/credential-providers', () => ({
  fromEnv: vi.fn(),
}))

describe('SQSConsumer', () => {
  let sqsConsumer: SQSConsumer
  let mockSend: Mock

  beforeEach(() => {
    vi.clearAllMocks()
    mockSend = vi.fn()
    ;(SQSClient as Mock).mockImplementation(() => ({ send: mockSend }))

    vi.mocked(fromEnv as Mock).mockReturnValue({
      accessKeyId: 'mockAccessKeyId',
      secretAccessKey: 'mockSecretAccessKey',
    })

    sqsConsumer = new SQSConsumer('mock-queue-url')
  })

  it('should receive messages from the queue', async () => {
    const mockMessages = [
      { MessageId: '1', Body: 'Message 1', ReceiptHandle: 'handle1' },
      { MessageId: '2', Body: 'Message 2', ReceiptHandle: 'handle2' },
    ]
    mockSend.mockResolvedValueOnce({
      Messages: mockMessages,
    })
    const messages = await sqsConsumer.receiveMessages()
    expect(messages).toEqual(mockMessages)
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand))
  })

  it('should return an empty array if no messages are received', async () => {
    mockSend.mockResolvedValueOnce({})
    const messages = await sqsConsumer.receiveMessages()
    expect(messages).toEqual(null)
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand))
  })

  it('should throw an error when receiving messages fails', async () => {
    mockSend.mockRejectedValueOnce(new Error('SQS Receive Error'))
    await expect(sqsConsumer.receiveMessages()).rejects.toThrow(
      'SQS Receive Error'
    )
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      MaxNumberOfMessages: 1,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand))
  })

  it('should delete a message from the queue', async () => {
    const receiptHandle = 'mock-receipt-handle'
    mockSend.mockResolvedValueOnce({})
    await sqsConsumer.deleteMessage(receiptHandle)
    expect(DeleteMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      ReceiptHandle: receiptHandle,
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteMessageCommand))
  })

  it('should throw an error when deleting a message fails', async () => {
    const receiptHandle = 'mock-receipt-handle'
    mockSend.mockRejectedValueOnce(new Error('SQS Delete Error'))
    await expect(sqsConsumer.deleteMessage(receiptHandle)).rejects.toThrow(
      'SQS Delete Error'
    )
    expect(DeleteMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      ReceiptHandle: receiptHandle,
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteMessageCommand))
  })
})
