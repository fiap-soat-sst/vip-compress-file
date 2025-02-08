import { isLeft, Left, Right } from '../@Shared/Either'
import { IImageRepository } from '../Gateways/IDatabaseRepositoryGateway'

export class AddImagesCompressedToDynamoDB {
  constructor(private readonly dbRepository: IImageRepository) {}

  async execute(id: string, bucketNameURL: string) {
    console.log('Adding compressed bucket images URL to DynamoDB')
    try {
      await this.dbRepository.addImagesCompressFolderToDynamoDB(
        id,
        bucketNameURL
      )

      return Right(true)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
