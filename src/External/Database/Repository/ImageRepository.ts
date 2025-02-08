import { IImageRepository } from '../../../Gateways/IDatabaseRepositoryGateway'
import { Either, Left, Right } from '../../../@Shared/Either'
import {
  DynamoDB,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { fromEnv } from '@aws-sdk/credential-providers'

export class ImageRepository implements IImageRepository {
  private client = DynamoDBDocument.from(
    new DynamoDB({
      credentials: fromEnv(),
      region: process.env.AWS_REGION,
      endpoint: process.env.AWS_ENDPOINT,
    })
  )
  constructor() {}
  async addImagesCompressFolderToDynamoDB(
    id: string,
    bucketNameURL: string
  ): Promise<Either<Error, boolean>> {
    try {
      const params = {
        TableName: 'vip-video-table',
        Item: {
          id: { S: id },
          URL: { S: bucketNameURL },
        },
      }

      await this.client.send(new PutItemCommand(params))

      return Right(true)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }

  async getBucketFromUserEmail(
    UserEmail: string
  ): Promise<Either<Error, string>> {
    console.log('Getting bucket name from DynamoDB')

    const params = {
      TableName: 'vip-video-table',
      Key: {
        email: { S: UserEmail },
      },
    }

    try {
      const result = await this.client.send(new GetItemCommand(params))

      if (!result?.Item?.rawImagesBucketName?.S) {
        return Left<Error>(new Error('Bucket of the images Not Found'))
      }

      const bucketName = result.Item.rawImagesBucketName.S

      if (!bucketName) {
        console.log('Bucket name not found')
        return Left<Error>(new Error('Bucket name not found'))
      }

      return Right(bucketName)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
