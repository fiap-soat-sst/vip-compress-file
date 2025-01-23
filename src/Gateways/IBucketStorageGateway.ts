import { Either } from '../@Shared/Either'

export interface IBucketStorageGateway {
  getImages(bucketName: string): Promise<Either<Error, string>>
  upload(
    folderPath: string,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>>
}
