import { Either } from '../@Shared/Either'

export interface ICompressGateway {
  compressImagesToZip(rawImages: string): Either<Error, string>
}
