import { IImageRepository } from '../../../Gateways/IDatabaseRepositoryGateway'
import { Either, Left, Right } from '../../../@Shared/Either'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { fromEnv } from '@aws-sdk/credential-providers'

export class ImageRepository implements IImageRepository {
  private client = DynamoDBDocument.from(
    new DynamoDB({
      credentials: fromEnv(),
      region: process.env.AWS_REGION,
    })
  )
  constructor() {}
  async getBucketFromUserEmail(
    UserEmail: string
  ): Promise<Either<Error, string>> {
    console.log('Getting bucket name from DynamoDB')
    const params = {
      TableName: process.env.AWS_DYNAMO_DATABASE,
      IndexName: 'email-index',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': UserEmail,
      },
    }
    try {
      const result = await this.client.query(params)

      if (!result.Items) {
        console.log('Bucket of the images Not Found')
        return Left<Error>(new Error('Bucket of the images Not Found'))
      }

      const bucketName = result.Items[0].rawImagesBucketName
      return Right(bucketName)
    } catch (error) {
      console.log(error)
      return Left<Error>(error as Error)
    }
  }
}
