import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest'
import { ImageCompressWorkerController } from '../../src/Controllers/ImageCompressWorkerController'
import { SQSConsumer } from '../../src/External/SQS/SQSConsumer'
import ImageCompressorService from '../../src/Service/ImageCompressorService'
import { Video } from '../../src/Entities/video'
import { MessageData } from '../../src/Entities/MessageData'

vi.mock('../../src/External/SQS/SQSConsumer')
vi.mock('../../src/Service/ImageCompressorService')
vi.mock('../../src/External/cron/node-cron')
vi.mock('../../src/External/s3/S3BucketStorage')
vi.mock('../../src/External/Database/Repository/ImageRepository')
vi.mock('../../src/External/compress/compressToZip')

const video = new Video({
  id: 'video-id',
  name: 'video-name',
  hash: 'folder-to-zip',
  size: 100,
  contentType: 'video/mp4',
  managerService: { url: 'manager-service-url' },
  processService: { images: [{ url: 'image-url' }] },
})

const messageData = new MessageData({
  email: 'user@example.com',
  video: video,
})

describe('ImageCompressWorkerController', () => {
  let imageCompressWorkerController: ImageCompressWorkerController
  let mockSQSConsumer: jest.Mocked<SQSConsumer>
  let mockImageCompressorService: jest.Mocked<ImageCompressorService>

  beforeEach(() => {
    vi.clearAllMocks()

    mockSQSConsumer = {
      receiveMessages: vi.fn(),
      deleteMessage: vi.fn(),
    } as unknown as jest.Mocked<SQSConsumer>

    mockImageCompressorService = {
      execute: vi.fn(),
    } as unknown as jest.Mocked<ImageCompressorService>

    vi.mocked(SQSConsumer).mockImplementation(() => mockSQSConsumer)
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
      {
        Body: JSON.stringify(messageData.toJSON()),
        ReceiptHandle: 'receiptHandle123',
      },
    ])

    vi.useFakeTimers()
    imageCompressWorkerController.run()

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockSQSConsumer.receiveMessages).toHaveBeenCalledTimes(1)
    expect(mockImageCompressorService.execute).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'user@example.com',
        video: expect.objectContaining({ id: 'video-id' }),
      })
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
    mockSQSConsumer.receiveMessages.mockResolvedValueOnce([
      {
        Body: JSON.stringify(messageData.toJSON()),
        ReceiptHandle: 'receiptHandle123',
      },
    ])

    mockImageCompressorService.execute.mockRejectedValue(
      new Error('Processing error')
    )

    vi.useFakeTimers()
    imageCompressWorkerController.run()

    await vi.advanceTimersByTimeAsync(5000)

    expect(mockSQSConsumer.receiveMessages).toHaveBeenCalledTimes(1)
    expect(mockImageCompressorService.execute).toHaveBeenCalled()
    expect(mockSQSConsumer.deleteMessage).not.toHaveBeenCalled()
  })
})
