import { Either } from '../@Shared/Either'

export interface IImageRepository {
  getBucket(key: string): Promise<Either<Error, string>>
}
