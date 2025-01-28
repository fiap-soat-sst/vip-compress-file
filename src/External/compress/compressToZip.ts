import { ICompressGateway } from '../../Gateways/ICompressGateway'
import { readdirSync } from 'fs'
import admz from 'adm-zip'

export class CompressToZip implements ICompressGateway {
  compressImagesToZip(rawImagesPath: string) {
    console.log('Compressing images to zip')

    const zip = new admz()
    const folderToBeZipped = readdirSync(rawImagesPath)
    const imagesZipped = `${rawImagesPath}.zip`

    for (let i = 0; i < folderToBeZipped.length; i++) {
      const image = folderToBeZipped[i]
      zip.addLocalFile(`${rawImagesPath}/${image}`)
    }

    zip.writeZip(imagesZipped)

    return imagesZipped
  }
}
