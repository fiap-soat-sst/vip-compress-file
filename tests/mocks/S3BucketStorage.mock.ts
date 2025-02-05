import { vi } from 'vitest'
import { Readable } from 'stream'
import { fromEnv } from '@aws-sdk/credential-providers'

export const mockS3Client = () => {
  const mockSend = vi.fn()

  const mockS3ClientInstance = {
    send: mockSend,
    config: {
      endpoint: process.env.AWS_ENDPOINT,
      region: process.env.AWS_REGION,
    },
  }

  // Mock the S3Client and its commands
  vi.mock('@aws-sdk/client-s3', () => ({
    S3Client: vi.fn(() => mockS3ClientInstance),
    GetObjectCommand: vi.fn((args) => args), // Mock as a function that returns its arguments
    ListObjectsV2Command: vi.fn((args) => args), // Mock as a function that returns its arguments
  }))

  // Mock the Upload class from @aws-sdk/lib-storage
  vi.mock('@aws-sdk/lib-storage', () => ({
    Upload: vi.fn(() => ({
      done: vi.fn().mockResolvedValue({}),
    })),
  }))

  return mockS3ClientInstance
}

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

export const mockFromEnv = () => {
  vi.mock('@aws-sdk/credential-providers', () => ({
    fromEnv: vi.fn(() => ({
      accessKeyId: 'test',
      secretAccessKey: 'test',
    })),
  }))
}

export const setEnvs = () => {
  process.env.AWS_ENDPOINT = 'http://localhost:4566'
  process.env.AWS_REGION = 'us-east-1'
  process.env.AWS_RAW_IMAGES_BUCKET = 'raw-images-bucket'
  process.env.AWS_COMPACTED_IMAGES_BUCKET = 'compacted-images-bucket'
  process.env.AWS_ACCESS_KEY_ID = 'test'
  process.env.AWS_SECRET_ACCESS_KEY = 'test'
}

// Combine all mocks
export const setupMocks = () => {
  mockS3Client()
  mockFs()
  mockFromEnv()
  setEnvs()
}
