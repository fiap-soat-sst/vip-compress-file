import { Either, Right } from '../@Shared/Either'
import { IImageStorage } from './Contracts/IImageStorage'

export class S3BucketStorage implements IImageStorage {
  async getImages(bucketName: string): Promise<Either<Error, string>> {
    return Promise.resolve(Right('image'))
  }
  async upload(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>> {
    return Promise.resolve(Right('image'))
  }
}
