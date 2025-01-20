import { Either, Left, Right } from '../../@Shared/Either'

export interface IImageStorage {
  getImages(bucketName: string): Promise<Either<Error, string>>
  upload(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>>
}
