import { Left } from '../@Shared/Either'
import { ICompressGateway } from '../Gateways/ICompressGateway'

export class CompressImagesToZipUseCase {
  constructor(private readonly compressGateway: ICompressGateway) {}
  async execute(rawImages: string) {
    try {
      console.log('Compressing images to zip')
      this.compressGateway.compressImagesToZip(rawImages)
    } catch (error) {
      return Left<Error>(error as Error)
    }
  }
}
