import { ICompressGateway } from '../../Gateways/ICompressGateway'
import { readdirSync } from 'fs'
import admz from 'adm-zip'

export default class CompressToZip implements ICompressGateway {
  compressImagesToZipUseCase(rawImages: string) {
    const zip = new admz()

    var folderToBeZipped = readdirSync(rawImages)

    for (let i = 0; i < folderToBeZipped.length; i++) {
      const image = folderToBeZipped[i]
      zip.addLocalFile(`${rawImages}/${image}`)
    }

    const imagesZipped = '/downloaded_file.zip'

    zip.writeZip(imagesZipped)
  }
}
