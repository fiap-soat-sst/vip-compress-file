import { vi, Mock } from 'vitest'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { fromEnv } from '@aws-sdk/credential-providers'
import { createReadStream } from 'fs'
import { S3BucketStorage } from '../../src/External/s3/S3BucketStorage'
import { Right, Left } from '../../src/@Shared/Either'

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

  it('should return undefined when no images are found', async () => {
    mockSend.mockResolvedValueOnce({})
    const result = await storage.getProcessedImagesToCompact('empty-folder')
    expect(result).toBeUndefined()
  })

  it('should handle errors when listing objects', async () => {
    const error = new Error('S3 error')
    mockSend.mockRejectedValue(error)

    const result = await storage.getProcessedImagesToCompact('test-folder')
    expect(result).toBeUndefined()
  })
})
