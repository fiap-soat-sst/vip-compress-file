import { ICompressGateway } from '../Gateways/ICompressGateway'

export class CompressImagesToZipUseCase {
  constructor(private readonly compressGateway: ICompressGateway) {}
  async execute(rawImages: string) {
    this.compressGateway.compressImagesToZipUseCase(rawImages)
  }
}
