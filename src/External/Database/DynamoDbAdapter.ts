import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { fromEnv } from '@aws-sdk/credential-providers'

export class DynamoDBAdapter {
  private dynamoDB: DynamoDBDocumentClient

  constructor() {
    const client = new DynamoDBClient({
      credentials: fromEnv(),
      region: process.env.AWS_REGION,
    })

    this.dynamoDB = DynamoDBDocumentClient.from(client)
    console.log('[DynamoDB]: Connection has been established successfully 🚀')
  }

  public getClient(): DynamoDBDocumentClient {
    return this.dynamoDB
  }
}
