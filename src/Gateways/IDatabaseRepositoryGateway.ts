import { Either } from '../@Shared/Either'

export interface IImageRepository {
  getBucketFromUserEmail(UserEmail: string): Promise<Either<Error, string>>
  addImagesCompressFolderToDynamoDB(
    id: string,
    bucketNameURL: string
  ): Promise<Either<Error, boolean>>
}
