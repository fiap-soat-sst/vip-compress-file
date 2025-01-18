import { DatabaseRepository } from '../Gateways/ImageRepository'

export async function getBucketNameFromDynamoDBUseCase(messageId: string) {
  const databaseRepository = new DatabaseRepository()
  return databaseRepository.getBucket(messageId)
}
