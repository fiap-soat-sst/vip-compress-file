import { ICompressGateway } from '../../Gateways/ICompressGateway'
import { readdirSync } from 'fs'
import admz from 'adm-zip'

export class CompressToZip implements ICompressGateway {
  compressImagesToZipUseCase(rawImagesPath: string) {
    const zip = new admz()

    var folderToBeZipped = readdirSync(rawImagesPath)

    for (let i = 0; i < folderToBeZipped.length; i++) {
      const image = folderToBeZipped[i]
      zip.addLocalFile(`${rawImagesPath}/${image}`)
    }

    const imagesZipped = `/${rawImagesPath}.zip`

    zip.writeZip(imagesZipped)

    return imagesZipped
  }
}
