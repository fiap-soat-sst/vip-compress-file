import { ICompressGateway } from '../Gateways/ICompressGateway'

export class CompressImagesToZipUseCase {
  constructor(private readonly compressGateway: ICompressGateway) {}
  async execute(rawImages: string) {
    console.log('Compressing images to zip')
    this.compressGateway.compressImagesToZip(rawImages)
  }
}
