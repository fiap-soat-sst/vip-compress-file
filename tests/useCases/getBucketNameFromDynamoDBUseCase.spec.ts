import { ImageRepository } from '../../src/External/Database/Repository/ImageRepository'
import { GetBucketNameFromDynamoDBUseCase } from '../../src/UseCases/getBucketNameFromDynamoDBUseCase'
import { Left, Right } from '../../src/@Shared/Either'
import { setup, destroyTable } from '../../localstack/dynamoDB'
import { vi } from 'vitest'

describe('getBucketNameFromDynamoDBUseCase', () => {
  beforeAll(async () => {
    await setup()
  })
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterAll(async () => {
    await destroyTable()
  })
  it('should get bucket name from DynamoDB', async () => {
    const imageRepository = new ImageRepository()
    const getBucketNameFromDynamoDBUseCase =
      new GetBucketNameFromDynamoDBUseCase(imageRepository)

    const bucketName =
      await getBucketNameFromDynamoDBUseCase.execute('test@test.com')

    expect(bucketName).toEqual('mnetc')
  })

  it('should return error if bucket is not found', async () => {
    const imageRepository = new ImageRepository()
    const getBucketNameFromDynamoDBUseCase =
      new GetBucketNameFromDynamoDBUseCase(imageRepository)

    const result =
      await getBucketNameFromDynamoDBUseCase.execute('test2@test.com')

    expect(result).toBeInstanceOf(Error)
  })
})
