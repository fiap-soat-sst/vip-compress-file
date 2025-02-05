import { Either } from '../@Shared/Either'

export interface IImageRepository {
  getBucketFromUserEmail(UserEmail: string): Promise<Either<Error, string>>
}
