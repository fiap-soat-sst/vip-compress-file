import { vi } from 'vitest'
import { S3BucketStorage } from '../../src/External/s3/S3BucketStorage'
import { Readable } from 'stream'
import { V } from 'vitest/dist/chunks/reporters.D7Jzd9GS'

// Mock the entire S3BucketStorage class
export const mockS3BucketStorage = () => {
  const mockDownloadImage = vi.fn()
  const mockUploadZipToCompactedBucket = vi.fn()

  const mockS3BucketStorageInstance = {
    getProcessedImagesToCompact: vi.fn(),
    downloadImage: mockDownloadImage,
    uploadZipToCompactedBucket: mockUploadZipToCompactedBucket,
  }

  // Mock the constructor to return the mock instance
  vi.spyOn(
    S3BucketStorage.prototype,
    'getProcessedImagesToCompact'
  ).mockImplementation(mockS3BucketStorageInstance.getProcessedImagesToCompact)

  vi.spyOn(S3BucketStorage.prototype, 'downloadImage').mockImplementation(
    mockDownloadImage
  )
  vi.spyOn(
    S3BucketStorage.prototype,
    'uploadZipToCompactedBucket'
  ).mockImplementation(mockUploadZipToCompactedBucket)

  return mockS3BucketStorageInstance
}

// Mock the S3Client and related AWS SDK dependencies
export const mockS3Client = () => {
  const mockSend = vi.fn((command: any) => {})

  const mockS3ClientInstance = {
    send: vi.fn().mockImplementation(mockSend),
    config: {
      Region: process.env.AWS_REGION,
    },
  }

  vi.mock('@aws-sdk/client-s3', () => ({
    S3Client: vi.fn(() => mockS3ClientInstance),
    GetObjectCommand: vi.fn(() => mockS3ClientInstance),
    ListObjectsV2Command: vi.fn(() => mockS3ClientInstance),
  }))

  vi.mock('@aws-sdk/lib-storage', () => ({
    Upload: vi.fn(() => ({
      done: vi.fn().mockResolvedValue({}),
    })),
  }))

  vi.mock('@aws-sdk/credential-providers', () => ({
    fromEnv: vi.fn().mockReturnValue({
      accessKeyId: 'mockAccessKeyId',
      secretAccessKey: 'mockSecretAccessKey',
      region: 'us-east-1',
    }),
  }))

  return mockS3ClientInstance
}

// Mock the fs and fs/promises modules
export const mockFs = () => {
  vi.mock('fs', () => ({
    createReadStream: vi.fn(() => {
      const stream = new Readable()
      stream.push('mock file content')
      stream.push(null) // Signal the end of the stream
      return stream
    }),
    createWriteStream: vi.fn(),
  }))

  vi.mock('fs/promises', () => ({
    mkdir: vi.fn().mockResolvedValue(undefined),
  }))
}

// Mock the fromEnv function from @aws-sdk/credential-providers
export const mockFromEnv = () => {
  vi.mock('@aws-sdk/credential-providers', () => ({
    fromEnv: vi.fn().mockReturnValue({
      accessKeyId: 'mockAccessKeyId',
      secretAccessKey: 'mockSecretAccessKey',
    }),
  }))
}

export const setEnvs = () => {
  process.env.AWS_ENDPOINT = 'http://localhost:4566'
  process.env.AWS_REGION = 'us-east-1'
  process.env.AWS_RAW_IMAGES_BUCKET = 'raw-images-bucket'
  process.env.AWS_COMPACTED_IMAGES_BUCKET = 'compacted-images-bucket'
}

// Combine all mocks
export const setupMocks = () => {
  mockS3Client()
  mockFs()
  mockFromEnv()
  setEnvs()
  return mockS3BucketStorage()
}
