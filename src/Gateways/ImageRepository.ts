import { IImageRepository } from './Contracts/IImageRepository'
import { ImageRepository } from '../External/Database/Repository/ImagesRepository'
import { Either, isLeft, Left, Right } from '../@Shared/Either'

export class DatabaseRepository implements IImageRepository {
  private imageRepository: ImageRepository = new ImageRepository()
  async getBucket(key: string): Promise<Either<Error, string>> {
    try {
      const bucketName = await this.imageRepository.getBucket(key)

      if (isLeft(bucketName)) {
        return Left<Error>(new Error('Bucket of the images Not Found'))
      }

      return Right(bucketName.value)
    } catch (error) {
      throw error
    }
  }

  upload(
    file: Buffer,
    key: string,
    contentType: string
  ): Promise<Either<Error, string>> {
    return Promise.resolve(Right('image'))
  }
}
