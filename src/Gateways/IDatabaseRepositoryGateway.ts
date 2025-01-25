import { Either } from '../@Shared/Either'

export interface IImageRepository {
  getBucket(userId: string): Promise<Either<Error, string>>
}
