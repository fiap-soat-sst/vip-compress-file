import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export class DynamoDBAdapter {
  private dynamoDB: DynamoDBDocumentClient

  constructor() {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION,
    })

    this.dynamoDB = DynamoDBDocumentClient.from(client)
    console.log('[DynamoDB]: Connection has been established successfully 🚀')
  }

  public getClient(): DynamoDBDocumentClient {
    return this.dynamoDB
  }
}
