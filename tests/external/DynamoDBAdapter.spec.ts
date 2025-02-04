import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { fromEnv } from '@aws-sdk/credential-providers'
import { DynamoDBAdapter } from '../../src/External/Database/DynamoDbAdapter'
import { vi, Mock } from 'vitest'

vi.mock('@aws-sdk/client-dynamodb')
vi.mock('@aws-sdk/lib-dynamodb')
vi.mock('@aws-sdk/credential-providers', () => ({ fromEnv: vi.fn() }))

describe('DynamoDBAdapter', () => {
  let adapter: DynamoDBAdapter

  beforeEach(() => {
    ;(DynamoDBClient as Mock).mockImplementation(() => ({}))
    ;(DynamoDBDocumentClient.from as Mock).mockReturnValue({
      mockClient: true,
    })
    adapter = new DynamoDBAdapter()
  })

  it('should create a DynamoDB client instance', () => {
    expect(DynamoDBClient).toHaveBeenCalledWith({
      credentials: fromEnv(),
      region: process.env.AWS_REGION,
    })
  })

  it('should return a DynamoDBDocumentClient instance', () => {
    expect(adapter.getClient()).toEqual({ mockClient: true })
  })
})
