import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ImageCompressWorkerController } from '../../src/Controllers/ImageCompressWorkerController'
import { SQSConsumer } from '../../src/External/SQS/SQSConsumer'
import ImageCompressorService from '../../src/Service/ImageCompressorService'
import { CronGateway } from '../../src/External/cron/node-cron'
import { S3BucketStorage } from '../../src/External/s3/S3BucketStorage'
import { ImageRepository } from '../../src/External/Database/Repository/ImageRepository'
import { CompressToZip } from '../../src/External/compress/compressToZip'

vi.mock('../../src/External/SQS/SQSConsumer')
vi.mock('../../src/Service/ImageCompressorService')
vi.mock('../../src/External/cron/node-cron')
vi.mock('../../src/External/s3/S3BucketStorage')
vi.mock('../../src/External/Database/Repository/ImageRepository')
vi.mock('../../src/External/compress/compressToZip')

describe('ImageCompressWorkerController', () => {
  let imageCompressWorkerController: ImageCompressWorkerController
  let mockSQSConsumer: any
  let mockImageCompressorService: any

  beforeEach(() => {
    vi.clearAllMocks()
    mockSQSConsumer = {
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    }
    vi.mocked(SQSConsumer).mockImplementation(() => mockSQSConsumer)
    mockImageCompressorService = {
      execute: vi.fn(),
    }
    vi.mocked(ImageCompressorService).mockImplementation(
      () => mockImageCompressorService
    )
    imageCompressWorkerController = new ImageCompressWorkerController()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should initialize and run the worker', async () => {
    mockSQSConsumer.receiveMessages.mockResolvedValueOnce([
      { Body: 'userId123', ReceiptHandle: 'receiptHandle123' },
    ])
    vi.useFakeTimers()
    imageCompressWorkerController.run()
    await vi.advanceTimersByTimeAsync(5000)
    expect(mockSQSConsumer.receiveMessages).toHaveBeenCalledTimes(1)
    expect(mockImageCompressorService.execute).toHaveBeenCalledWith('userId123')
    expect(mockSQSConsumer.deleteMessage).toHaveBeenCalledWith(
      'receiptHandle123'
    )
  })

  it('should handle no new messages', async () => {
    mockSQSConsumer.receiveMessages.mockResolvedValueOnce([])
    vi.useFakeTimers()
    imageCompressWorkerController.run()
    await vi.advanceTimersByTimeAsync(5000)
    expect(mockSQSConsumer.receiveMessages).toHaveBeenCalledTimes(1)
    expect(mockImageCompressorService.execute).not.toHaveBeenCalled()
    expect(mockSQSConsumer.deleteMessage).not.toHaveBeenCalled()
  })

  it('should handle errors when processing messages', async () => {
    vi.useFakeTimers()
    imageCompressWorkerController.run()
    await vi.advanceTimersByTimeAsync(5000)
    expect(mockSQSConsumer.receiveMessages).toHaveBeenCalledTimes(1)
    expect(mockImageCompressorService.execute).not.toHaveBeenCalled()
    expect(mockSQSConsumer.deleteMessage).not.toHaveBeenCalled()
  })
})
