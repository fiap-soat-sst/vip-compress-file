import { Either, Left, Right, isLeft } from '../../../@Shared/Either'
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
} from '@aws-sdk/lib-dynamodb'

export class ImageRepository {
  private client: DynamoDBDocumentClient
  async getBucket(imagesId: string): Promise<Either<Error, string>> {
    const params = {
      TableName: process.env.AWS_TABLE_IMAGES,
      Key: {
        imagesId,
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
