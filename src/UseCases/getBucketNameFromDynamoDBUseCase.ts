import { isLeft } from '../@Shared/Either'
import { IImageRepository } from '../Gateways/IDatabaseRepositoryGateway'

export class GetBucketNameFromDynamoDBUseCase {
  constructor(private readonly databaseRepositoryGateway: IImageRepository) {}

  async execute(rawImagesBucketName: string) {
    console.log('Getting bucket name from DynamoDB')
    const bucketName =
      await this.databaseRepositoryGateway.getBucket(rawImagesBucketName)

    if (isLeft(bucketName)) {
      throw new Error('Bucket of the images Not Found')
    }

    return bucketName.value
  }
}
