import { vi, Mock, describe, it, expect, beforeEach } from 'vitest'
import {
  CompleteMultipartUploadCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { fromEnv } from '@aws-sdk/credential-providers'
import { createReadStream, ReadStream } from 'fs'
import { S3BucketStorage } from '../../src/External/s3/S3BucketStorage'
import { Right, Left, isRight, isLeft } from '../../src/@Shared/Either'
import { Readable } from 'stream'
import { error } from 'console'

vi.mock('@aws-sdk/client-s3')
vi.mock('@aws-sdk/lib-storage')
vi.mock('@aws-sdk/credential-providers', () => ({ fromEnv: vi.fn() }))
vi.mock('fs', () => ({
  createReadStream: vi.fn(),
  createWriteStream: vi.fn(() => ({ pipe: vi.fn() })),
}))
vi.mock('fs/promises', () => ({ mkdir: vi.fn() }))

describe('S3BucketStorage', () => {
  let storage: S3BucketStorage
  let mockSend: Mock

  beforeEach(() => {
    mockSend = vi.fn()
    ;(S3Client as Mock).mockImplementation(() => ({ send: mockSend }))
    storage = new S3BucketStorage()
  })

  it('should create an S3 client instance', () => {
    expect(S3Client).toHaveBeenCalledWith({
      credentials: fromEnv(),
      region: process.env.AWS_REGION,
    })
  })

  it('should return the output directory when images are found', async () => {
    mockSend.mockResolvedValueOnce({ Contents: [{ Key: 'test-file.jpg' }] })
    vi.spyOn(storage, 'downloadImage').mockResolvedValueOnce(undefined)

    const result = await storage.getProcessedImagesToCompact('test-folder')
    expect(result).toEqual(Right('tozip/test-folder'))
  })

  it('should return an error when no images are found', async () => {
    mockSend.mockResolvedValueOnce({})
    const result = await storage.getProcessedImagesToCompact('empty-folder')

    expect(isLeft(result)).toBe(true)
    expect(result).toEqual(
      Left(new Error('No files found in the specified folder.'))
    )
  })

  it('should handle errors when listing objects', async () => {
    const error = new Error('S3 error')
    mockSend.mockRejectedValue(error)

    const result = await storage.getProcessedImagesToCompact('test-folder')

    expect(isLeft(result)).toBe(true)
    expect(result).toEqual(Left(error))
  })
  let mockUploadInstance: Upload
  const folderKey = 'test-folder'

  beforeEach(() => {
    vi.mocked(createReadStream).mockImplementation(() => {
      const stream = new Readable({
        read() {
          this.push(null) // End the stream immediately
        },
      }) as ReadStream
      stream.close = vi.fn()
      stream.bytesRead = 0
      stream.path = 'mocked-path'
      stream.pending = false

      return stream
    }) as unknown as ReadStream

    mockUploadInstance = new Upload({
      client: new S3Client({}),
      params: {
        Bucket: 'test-bucket',
        Key: 'test-key',
        Body: new Readable(),
      },
    })

    vi.spyOn(mockUploadInstance, 'done').mockResolvedValue({
      $metadata: {},
      Location: 'https://example-bucket.s3.amazonaws.com/test-key',
    } as CompleteMultipartUploadCommandOutput)

    vi.mocked(Upload).mockImplementation(() => mockUploadInstance)
  })

  it('should upload a ZIP file successfully', async () => {
    const result = await storage.uploadZipToCompactedBucket(folderKey)

    expect(isRight(result)).toBe(true)
    expect(result).toEqual(Right(true))
  })

  it('should return an error if the upload fails', async () => {
    vi.spyOn(mockUploadInstance, 'done').mockRejectedValue(
      new Error('Upload failed')
    )

    storage.uploadZipToCompactedBucket(folderKey).catch((error) => {
      expect(isLeft(error)).toBe(true)
      expect(error).toEqual(Left(new Error('Upload failed')))
    })
  })

  it('should return an error if file read fails', async () => {
    vi.mocked(createReadStream).mockImplementation(() => {
      throw new Error('File read error')
    })

    storage.uploadZipToCompactedBucket(folderKey).catch((error) => {
      expect(isLeft(error)).toBe(true)
      expect(error).toEqual(Left(new Error('File read error')))
    })
  })
})
