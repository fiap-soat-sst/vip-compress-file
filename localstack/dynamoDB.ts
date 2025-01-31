import {
  DynamoDBClient,
  CreateTableCommand,
  PutItemCommand,
  DeleteTableCommand,
  GetItemCommand,
} from '@aws-sdk/client-dynamodb'

const dynamoClient = new DynamoDBClient({
  region: 'us-east-1',
  endpoint: 'http://localhost:4566',
  credentials: {
    accessKeyId: 'test',
    secretAccessKey: 'test',
  },
})

function setEnvs() {
  process.env.AWS_ACCESS_KEY_ID = 'test'
  process.env.AWS_SECRET_ACCESS_KEY = 'test'
  process.env.AWS_REGION = 'us-east-1'
  process.env.AWS_ENDPOINT = 'http://localhost:4566'
}

async function createTable() {
  await dynamoClient.send(
    new CreateTableCommand({
      TableName: 'vip-video-table',
      KeySchema: [{ AttributeName: 'email', KeyType: 'HASH' }],
      AttributeDefinitions: [{ AttributeName: 'email', AttributeType: 'S' }],
      ProvisionedThroughput: { ReadCapacityUnits: 1, WriteCapacityUnits: 1 },
    })
  )
  console.log('Table created')
}

async function destroyTable() {
  await dynamoClient.send(
    new DeleteTableCommand({ TableName: 'vip-video-table' })
  )
  console.log('Table deleted')
}

async function getData() {
  const params = {
    TableName: 'vip-video-table',
    Key: {
      email: { S: 'test@test.com' },
    },
  }

  try {
    if (dynamoClient) {
      const result = await dynamoClient.send(new GetItemCommand(params))
      console.log('Data retrieved:', result.Item)
    } else {
      console.error('DynamoDB client is not initialized')
    }
  } catch (error) {
    console.error('Failed to retrieve data:', error)
  }
}
async function insertData() {
  const params = {
    TableName: 'vip-video-table',
    Item: {
      email: { S: 'test@test.com' },
      rawImagesBucketName: { S: 'mnetc' },
    },
  }

  try {
    if (dynamoClient) {
      await dynamoClient.send(new PutItemCommand(params))
      console.log('Data inserted')
    } else {
      console.error('DynamoDB client is not initialized')
    }
  } catch (error) {
    console.error('Failed to insert data:', error)
  }
}

async function setup() {
  setEnvs()
  await createTable()
  await insertData()
}

export { setup, destroyTable }
