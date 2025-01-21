import { isLeft, Right } from '../@Shared/Either'
import { DatabaseRepository } from '../Gateways/ImageRepository'

export async function getBucketNameFromDynamoDBUseCase(messageId: string) {
  const databaseRepository = new DatabaseRepository()
  const bucketName = await databaseRepository.getBucket(messageId)

  if (isLeft(bucketName)) {
    throw new Error('Bucket of the images Not Found')
  }

  return bucketName.value
}
