import { vi, describe, it, expect, beforeEach } from 'vitest'
import ImageCompressorService from '../../src/Service/ImageCompressorService'
import { DownloadFolderImagesFromS3BucketUseCase } from '../../src/UseCases/downloadFolderImagesFromS3BucketUseCase'
import { CompressImagesToZipUseCase } from '../../src/UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../../src/UseCases/uploadImagesToS3BucketUseCase'
import { MessageData } from '../../src/Entities/MessageData'
import { Video } from '../../src/Entities/video'
import { AddImagesCompressedToDynamoDB } from '../../src/UseCases/AddImagesCompressedToDynamoDB'

// Mock dependencies
vi.mock('../../src/UseCases/downloadFolderImagesFromS3BucketUseCase')
vi.mock('../../src/UseCases/compressImagesToZipUseCase')
vi.mock('../../src/UseCases/uploadImagesToS3BucketUseCase')
vi.mock('../../src/UseCases/AddImagesCompressedToDynamoDB')

const video = new Video({
  id: '1c8fb057-89e7-41ac-8abd-09fca2e8defb',
  name: 'video-name',
  hash: 'c1c266f6930fee2b2459fe1cf3670a641f7c407c231e9c4eda1a6dcef20e603c',
  size: 100,
  contentType: 'video/mp4',
  managerService: { url: 'manager-service-url' },
  processService: { images: [{ url: 'image-url' }] },
})

const messageData = new MessageData({
  email: 'user@example.com',
  video: video,
})

describe('ImageCompressorService', () => {
  let imageCompressorService: ImageCompressorService
  let mockDownloadFolderImagesFromS3Bucket: any
  let mockAddImagesCompressedToDynamoDB: any
  let mockCompressImagesToZip: any
  let mockUploadImagesToS3Bucket: any

  beforeAll(() => {
    process.env.AWS_COMPACTED_IMAGES_BUCKET = 'test-bucket'
    process.env.AWS_REGION = 'us-east-1'
  })

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock the use cases
    mockDownloadFolderImagesFromS3Bucket = {
      execute: vi.fn(),
    }
    mockCompressImagesToZip = {
      execute: vi.fn(),
    }
    mockUploadImagesToS3Bucket = {
      execute: vi.fn(),
    }
    mockAddImagesCompressedToDynamoDB = {
      execute: vi.fn(),
    }

    vi.mocked(AddImagesCompressedToDynamoDB).mockImplementation(
      () => mockAddImagesCompressedToDynamoDB
    )
    vi.mocked(DownloadFolderImagesFromS3BucketUseCase).mockImplementation(
      () => mockDownloadFolderImagesFromS3Bucket
    )
    vi.mocked(CompressImagesToZipUseCase).mockImplementation(
      () => mockCompressImagesToZip
    )
    vi.mocked(UploadImagesToS3BucketUseCase).mockImplementation(
      () => mockUploadImagesToS3Bucket
    )

    // Create an instance of the service
    imageCompressorService = new ImageCompressorService(
      mockDownloadFolderImagesFromS3Bucket,
      mockAddImagesCompressedToDynamoDB,
      mockCompressImagesToZip,
      mockUploadImagesToS3Bucket
    )
  })

  it('should compress images successfully', async () => {
    // Mock dependencies
    mockDownloadFolderImagesFromS3Bucket.execute.mockResolvedValueOnce(
      messageData.video.processService.images
    )
    mockCompressImagesToZip.execute.mockResolvedValueOnce(undefined)

    mockUploadImagesToS3Bucket.execute.mockResolvedValueOnce(
      `https://${process.env.AWS_ZIP_IMAGES_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${video.id}.zip`
    )

    const result = await imageCompressorService.execute(messageData)

    expect(result).toEqual({
      status: 'success',
      message: 'Images compressed successfully',
    })

    // expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
    //   messageData.video.processService.images
    // )
    expect(mockCompressImagesToZip.execute).toHaveBeenCalled()
    expect(mockUploadImagesToS3Bucket.execute).toHaveBeenCalled()
  })

  it('should handle errors during image download', async () => {
    mockDownloadFolderImagesFromS3Bucket.execute.mockRejectedValueOnce(
      new Error('S3 Download Error')
    )

    // Call the execute method
    const result = await imageCompressorService.execute(messageData)

    // Verify the result
    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: S3 Download Error',
    })

    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    expect(mockCompressImagesToZip.execute).not.toHaveBeenCalled()
    expect(mockUploadImagesToS3Bucket.execute).not.toHaveBeenCalled()
  })

  it('should handle errors during image compression', async () => {
    mockDownloadFolderImagesFromS3Bucket.execute.mockResolvedValueOnce(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    mockCompressImagesToZip.execute.mockRejectedValueOnce(
      new Error('Compression Error')
    )

    // Call the execute method
    const result = await imageCompressorService.execute(messageData)

    // Verify the result
    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: Compression Error',
    })

    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    expect(mockCompressImagesToZip.execute).toHaveBeenCalledWith(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    expect(mockUploadImagesToS3Bucket.execute).not.toHaveBeenCalled()
  })

  it('should handle errors during image upload', async () => {
    mockDownloadFolderImagesFromS3Bucket.execute.mockResolvedValueOnce(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    mockCompressImagesToZip.execute.mockResolvedValueOnce(undefined)
    mockUploadImagesToS3Bucket.execute.mockRejectedValueOnce(
      new Error('S3 Upload Error')
    )

    const result = await imageCompressorService.execute(messageData)

    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: S3 Upload Error',
    })

    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    expect(mockCompressImagesToZip.execute).toHaveBeenCalledWith(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
    expect(mockUploadImagesToS3Bucket.execute).toHaveBeenCalledWith(
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb',
      '1c8fb057-89e7-41ac-8abd-09fca2e8defb'
    )
  })
})
