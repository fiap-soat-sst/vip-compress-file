import CompressToZip from '../External/compress/compressToZip'

export async function compressImagesToZipUseCase(rawImages: string) {
  const compressToZip = new CompressToZip()
  compressToZip.compressImagesToZipUseCase(rawImages)
}
