import { IImageRepository } from './Contracts/IImageRepository'
import { ImageRepository } from '../External/Database/Repository/ImagesRepository'
import { Either } from '../@Shared/Either'

export class DatabaseRepository implements IImageRepository {
  private imageRepository: ImageRepository = new ImageRepository()
  getBucket(key: string): Promise<Either<Error, string>> {
    return this.imageRepository.getBucket(key)
  }

  upload(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>> {
    return Promise.resolve(Either.right('image'))
  }
}
