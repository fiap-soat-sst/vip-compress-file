import { beforeEach, describe, expect, it, vi, Mock } from 'vitest'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { ImageRepository } from '../../src/External/Database/Repository/ImageRepository'
import { Left, Right } from '../../src/@Shared/Either'

vi.mock('@aws-sdk/client-dynamodb')
vi.mock('@aws-sdk/lib-dynamodb')
vi.mock('@aws-sdk/credential-providers', () => ({ fromEnv: vi.fn() }))

describe('ImageRepository', () => {
  let repository: ImageRepository
  let mockSend: Mock

  beforeEach(() => {
    mockSend = vi.fn()
    ;(DynamoDB as Mock).mockImplementation(() => ({}))
    ;(DynamoDBDocument.from as Mock).mockReturnValue({ send: mockSend })
    repository = new ImageRepository()
  })

  it('should return the bucket name if found', async () => {
    mockSend.mockResolvedValue({
      Item: { rawImagesBucketName: { S: 'test-bucket' } },
    })

    const result = await repository.getBucketFromUserEmail('user@example.com')

    expect(result).toEqual(Right('test-bucket'))
  })

  it('should return an error if the bucket name is not found', async () => {
    mockSend.mockResolvedValue({ Item: {} })

    const result = await repository.getBucketFromUserEmail('user@example.com')
    expect(result).toEqual(Left(new Error('Bucket of the images Not Found')))
  })

  it('should return an error if the item does not exist', async () => {
    mockSend.mockResolvedValue({})

    const result = await repository.getBucketFromUserEmail('user@example.com')

    expect(result).toEqual(Left(new Error('Bucket of the images Not Found')))
  })

  it('should return an error if an exception occurs', async () => {
    const error = new Error('DynamoDB error')
    mockSend.mockRejectedValue(error)

    const result = await repository.getBucketFromUserEmail('user@example.com')

    expect(result).toEqual(Left(error))
  })
})
