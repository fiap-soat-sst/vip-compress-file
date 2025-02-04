import { vi, describe, it, expect, beforeEach } from 'vitest'
import { SQSConsumer } from '../../src/External/SQS/SQSConsumer'
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs'
import { fromEnv } from '@aws-sdk/credential-providers'

// Mock the AWS SDK SQSClient and its methods
vi.mock('@aws-sdk/client-sqs', () => ({
  SQSClient: vi.fn(),
  ReceiveMessageCommand: vi.fn(),
  DeleteMessageCommand: vi.fn(),
}))

// Mock the fromEnv function
vi.mock('@aws-sdk/credential-providers', () => ({
  fromEnv: vi.fn(),
}))

describe('SQSConsumer', () => {
  let sqsConsumer: SQSConsumer
  let mockSend: vi.Mock

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock the SQSClient's send method
    mockSend = vi.fn()
    vi.mocked(SQSClient).mockImplementation(() => ({
      send: mockSend,
    }))

    // Mock the fromEnv function to return mock credentials
    vi.mocked(fromEnv).mockReturnValue({
      accessKeyId: 'mockAccessKeyId',
      secretAccessKey: 'mockSecretAccessKey',
    })

    // Create an instance of SQSConsumer
    sqsConsumer = new SQSConsumer('mock-queue-url')
  })

  it('should receive messages from the queue', async () => {
    // Mock the response from the SQSClient
    const mockMessages = [
      { MessageId: '1', Body: 'Message 1', ReceiptHandle: 'handle1' },
      { MessageId: '2', Body: 'Message 2', ReceiptHandle: 'handle2' },
    ]
    mockSend.mockResolvedValueOnce({
      Messages: mockMessages,
    })

    // Call the receiveMessages method
    const messages = await sqsConsumer.receiveMessages()

    // Verify the result
    expect(messages).toEqual(mockMessages)

    // Verify that the SQSClient was called with the correct command
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand))
  })

  it('should return an empty array if no messages are received', async () => {
    // Mock the response from the SQSClient with no messages
    mockSend.mockResolvedValueOnce({})

    // Call the receiveMessages method
    const messages = await sqsConsumer.receiveMessages()

    // Verify the result
    expect(messages).toEqual([])

    // Verify that the SQSClient was called with the correct command
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand))
  })

  it('should throw an error when receiving messages fails', async () => {
    // Mock the SQSClient to throw an error
    mockSend.mockRejectedValueOnce(new Error('SQS Receive Error'))

    // Call the receiveMessages method and expect it to throw
    await expect(sqsConsumer.receiveMessages()).rejects.toThrow(
      'SQS Receive Error'
    )

    // Verify that the SQSClient was called with the correct command
    expect(ReceiveMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 5,
      MessageAttributeNames: ['All'],
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(ReceiveMessageCommand))
  })

  it('should delete a message from the queue', async () => {
    const receiptHandle = 'mock-receipt-handle'

    // Mock the SQSClient's send method for DeleteMessageCommand
    mockSend.mockResolvedValueOnce({})

    // Call the deleteMessage method
    await sqsConsumer.deleteMessage(receiptHandle)

    // Verify that the SQSClient was called with the correct command
    expect(DeleteMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      ReceiptHandle: receiptHandle,
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteMessageCommand))
  })

  it('should throw an error when deleting a message fails', async () => {
    const receiptHandle = 'mock-receipt-handle'

    // Mock the SQSClient to throw an error
    mockSend.mockRejectedValueOnce(new Error('SQS Delete Error'))

    // Call the deleteMessage method and expect it to throw
    await expect(sqsConsumer.deleteMessage(receiptHandle)).rejects.toThrow(
      'SQS Delete Error'
    )

    // Verify that the SQSClient was called with the correct command
    expect(DeleteMessageCommand).toHaveBeenCalledWith({
      QueueUrl: 'mock-queue-url',
      ReceiptHandle: receiptHandle,
    })
    expect(mockSend).toHaveBeenCalledWith(expect.any(DeleteMessageCommand))
  })
})
