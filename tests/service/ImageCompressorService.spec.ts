import { vi, describe, it, expect, beforeEach } from 'vitest'
import ImageCompressorService from '../../src/Service/ImageCompressorService'
import { DownloadFolderImagesFromS3BucketUseCase } from '../../src/UseCases/downloadFolderImagesFromS3BucketUseCase'
import { GetBucketNameFromDynamoDBUseCase } from '../../src/UseCases/getBucketNameFromDynamoDBUseCase'
import { CompressImagesToZipUseCase } from '../../src/UseCases/compressImagesToZipUseCase'
import { UploadImagesToS3BucketUseCase } from '../../src/UseCases/uploadImagesToS3BucketUseCase'

// Mock dependencies
vi.mock('../../src/UseCases/downloadFolderImagesFromS3BucketUseCase')
vi.mock('../../src/UseCases/getBucketNameFromDynamoDBUseCase')
vi.mock('../../src/UseCases/compressImagesToZipUseCase')
vi.mock('../../src/UseCases/uploadImagesToS3BucketUseCase')

describe('ImageCompressorService', () => {
  let imageCompressorService: ImageCompressorService
  let mockDownloadFolderImagesFromS3Bucket: any
  let mockGetBucketNameFromDynamoDB: any
  let mockCompressImagesToZip: any
  let mockUploadImagesToS3Bucket: any

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock the use cases
    mockDownloadFolderImagesFromS3Bucket = {
      execute: vi.fn(),
    }
    mockGetBucketNameFromDynamoDB = {
      execute: vi.fn(),
    }
    mockCompressImagesToZip = {
      execute: vi.fn(),
    }
    mockUploadImagesToS3Bucket = {
      execute: vi.fn(),
    }

    // Mock the implementations of the use cases
    vi.mocked(DownloadFolderImagesFromS3BucketUseCase).mockImplementation(
      () => mockDownloadFolderImagesFromS3Bucket
    )
    vi.mocked(GetBucketNameFromDynamoDBUseCase).mockImplementation(
      () => mockGetBucketNameFromDynamoDB
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
      mockGetBucketNameFromDynamoDB,
      mockCompressImagesToZip,
      mockUploadImagesToS3Bucket
    )
  })

  it('should compress images successfully', async () => {
    // Mock the use cases to return expected values
    mockGetBucketNameFromDynamoDB.execute.mockResolvedValueOnce(
      'processed-bucket'
    )
    mockDownloadFolderImagesFromS3Bucket.execute.mockResolvedValueOnce(
      'folder-to-zip'
    )
    mockCompressImagesToZip.execute.mockResolvedValueOnce(undefined)
    mockUploadImagesToS3Bucket.execute.mockResolvedValueOnce(undefined)

    // Call the execute method
    const result = await imageCompressorService.execute('user@example.com')

    // Verify the result
    expect(result).toEqual({
      status: 'success',
      message: 'Images compressed successfully',
    })

    // Verify that the use cases were called with the correct arguments
    expect(mockGetBucketNameFromDynamoDB.execute).toHaveBeenCalledWith(
      'user@example.com'
    )
    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      'processed-bucket'
    )
    expect(mockCompressImagesToZip.execute).toHaveBeenCalledWith(
      'folder-to-zip'
    )
    expect(mockUploadImagesToS3Bucket.execute).toHaveBeenCalledWith(
      'folder-to-zip'
    )
  })

  it('should handle errors during image compression', async () => {
    // Mock the use cases to throw an error
    mockGetBucketNameFromDynamoDB.execute.mockRejectedValueOnce(
      new Error('DynamoDB Error')
    )

    // Call the execute method
    const result = await imageCompressorService.execute('user@example.com')

    // Verify the result
    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: DynamoDB Error',
    })

    // Verify that the use cases were called with the correct arguments
    expect(mockGetBucketNameFromDynamoDB.execute).toHaveBeenCalledWith(
      'user@example.com'
    )
    expect(mockDownloadFolderImagesFromS3Bucket.execute).not.toHaveBeenCalled()
    expect(mockCompressImagesToZip.execute).not.toHaveBeenCalled()
    expect(mockUploadImagesToS3Bucket.execute).not.toHaveBeenCalled()
  })

  it('should handle errors during image download', async () => {
    // Mock the use cases to throw an error during download
    mockGetBucketNameFromDynamoDB.execute.mockResolvedValueOnce(
      'processed-bucket'
    )
    mockDownloadFolderImagesFromS3Bucket.execute.mockRejectedValueOnce(
      new Error('S3 Download Error')
    )

    // Call the execute method
    const result = await imageCompressorService.execute('user@example.com')

    // Verify the result
    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: S3 Download Error',
    })

    // Verify that the use cases were called with the correct arguments
    expect(mockGetBucketNameFromDynamoDB.execute).toHaveBeenCalledWith(
      'user@example.com'
    )
    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      'processed-bucket'
    )
    expect(mockCompressImagesToZip.execute).not.toHaveBeenCalled()
    expect(mockUploadImagesToS3Bucket.execute).not.toHaveBeenCalled()
  })

  it('should handle errors during image compression', async () => {
    // Mock the use cases to throw an error during compression
    mockGetBucketNameFromDynamoDB.execute.mockResolvedValueOnce(
      'processed-bucket'
    )
    mockDownloadFolderImagesFromS3Bucket.execute.mockResolvedValueOnce(
      'folder-to-zip'
    )
    mockCompressImagesToZip.execute.mockRejectedValueOnce(
      new Error('Compression Error')
    )

    // Call the execute method
    const result = await imageCompressorService.execute('user@example.com')

    // Verify the result
    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: Compression Error',
    })

    // Verify that the use cases were called with the correct arguments
    expect(mockGetBucketNameFromDynamoDB.execute).toHaveBeenCalledWith(
      'user@example.com'
    )
    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      'processed-bucket'
    )
    expect(mockCompressImagesToZip.execute).toHaveBeenCalledWith(
      'folder-to-zip'
    )
    expect(mockUploadImagesToS3Bucket.execute).not.toHaveBeenCalled()
  })

  it('should handle errors during image upload', async () => {
    // Mock the use cases to throw an error during upload
    mockGetBucketNameFromDynamoDB.execute.mockResolvedValueOnce(
      'processed-bucket'
    )
    mockDownloadFolderImagesFromS3Bucket.execute.mockResolvedValueOnce(
      'folder-to-zip'
    )
    mockCompressImagesToZip.execute.mockResolvedValueOnce(undefined)
    mockUploadImagesToS3Bucket.execute.mockRejectedValueOnce(
      new Error('S3 Upload Error')
    )

    // Call the execute method
    const result = await imageCompressorService.execute('user@example.com')

    // Verify the result
    expect(result).toEqual({
      status: 'error',
      message: 'Error compressing images. Error: S3 Upload Error',
    })

    // Verify that the use cases were called with the correct arguments
    expect(mockGetBucketNameFromDynamoDB.execute).toHaveBeenCalledWith(
      'user@example.com'
    )
    expect(mockDownloadFolderImagesFromS3Bucket.execute).toHaveBeenCalledWith(
      'processed-bucket'
    )
    expect(mockCompressImagesToZip.execute).toHaveBeenCalledWith(
      'folder-to-zip'
    )
    expect(mockUploadImagesToS3Bucket.execute).toHaveBeenCalledWith(
      'folder-to-zip'
    )
  })
})
