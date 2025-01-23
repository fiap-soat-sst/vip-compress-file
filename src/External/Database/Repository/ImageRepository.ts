import { IImageRepository } from '../../../Gateways/IDatabaseRepositoryGateway'
import { Either, Left, Right } from '../../../@Shared/Either'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'

export class DatabaseRepository implements IImageRepository {
  private client: DynamoDBDocumentClient
  async getBucket(imagesBucketId: string): Promise<Either<Error, string>> {
    const params = {
      TableName: process.env.AWS_TABLE_IMAGES,
      Key: {
        imagesBucketId,
      },
    }
    try {
      const result = await this.client.send(new GetCommand(params))
      if (!result.Item) {
        return Left<Error>(new Error('Bucket of the images Not Found'))
      }
      const bucketName = result.Item?.bucketName
      return Right(bucketName)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
