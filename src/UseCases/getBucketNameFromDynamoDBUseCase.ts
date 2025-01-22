import { isLeft } from '../@Shared/Either'
import { IImageRepository } from '../Gateways/IDatabaseRepositoryGateway'

export class GetBucketNameFromDynamoDBUseCase {
  constructor(private readonly imageRepository: IImageRepository) {}

  async execute(messageId: string) {
    const databaseRepository = this.imageRepository
    const bucketName = await databaseRepository.getBucket(messageId)

    if (isLeft(bucketName)) {
      throw new Error('Bucket of the images Not Found')
    }

    return bucketName.value
  }
}
