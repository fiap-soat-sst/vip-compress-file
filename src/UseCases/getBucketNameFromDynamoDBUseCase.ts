import { isLeft } from '../@Shared/Either'
import { IImageRepository } from '../Gateways/IDatabaseRepositoryGateway'

export class GetBucketNameFromDynamoDBUseCase {
  constructor(private readonly dbRepository: IImageRepository) {}

  async execute(UserEmail: string) {
    console.log('Getting bucket name from DynamoDB')
    const bucketName = await this.dbRepository.getBucketFromUserEmail(UserEmail)

    if (isLeft(bucketName)) {
      throw new Error('Bucket of the images Not Found')
    }

    return bucketName.value
  }
}
